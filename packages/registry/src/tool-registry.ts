import type { McpServer, RequestHandlerExtra, IToolDefinition, RateLimit } from '@mcp/types';
import { Logger } from '@mcp/utils';
import { z } from 'zod';

/**
 * Centralized registry for MCP tools
 *
 * This singleton class provides a single point of truth for tool registration and management
 * across the codebase. It ensures tools are only registered once and provides enhanced
 * tool management capabilities including:
 * - Rate limiting
 * - Schema validation
 * - Source tracking
 * - Verbose logging
 *
 * @example
 * ```typescript
 * const registry = getToolRegistry();
 * registry.registerTool('my-tool', schema, handler, 'my-module');
 * ```
 */
export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, IToolDefinition> = new Map();
  private verbose = false;
  private registrationCounts: Map<string, number> = new Map();
  private rateLimitTracker: Map<string, { count: number; resetTime: number }> = new Map();
  private logger: Logger;

  private constructor() {
    this.logger = new Logger('ToolRegistry');
  }

  /**
   * Get the singleton instance of the tool registry
   */
  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  /**
   * Set verbosity level for logging
   */
  public setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  /**
   * Check if a tool is already registered
   */
  public isToolRegistered(id: string): boolean {
    return this.tools.has(id);
  }

  /**
   * Register a tool with the registry
   *
   * @param toolId - Unique identifier for the tool
   * @param schema - Zod schema defining the tool's parameters
   * @param handler - Function to handle tool execution
   * @param source - Module or package registering the tool
   * @param options - Additional tool configuration
   * @returns true if registration was successful, false otherwise
   */
  public registerTool(
    toolId: string,
    schema: Record<string, z.ZodType>,
    handler: (args: Record<string, unknown>, extra: RequestHandlerExtra) => Promise<unknown>,
    source: string,
    options: Partial<Omit<IToolDefinition, 'id' | 'schema' | 'handler' | 'source'>> = {},
  ): boolean {
    if (!schema || typeof schema !== 'object' || Object.keys(schema).length === 0) {
      if (this.verbose) {
        this.logger.error(
          `[Registry] Invalid schema for tool '${toolId}': Schema must be a non-empty object`,
        );
      }
      return false;
    }

    for (const [key, value] of Object.entries(schema)) {
      if (!(value instanceof z.ZodType)) {
        if (this.verbose) {
          this.logger.error(
            `[Registry] Invalid schema for tool '${toolId}': Property '${key}' is not a valid Zod type`,
          );
        }
        return false;
      }
    }

    const existingTool = this.tools.get(toolId);
    if (existingTool && this.isToolDefinition(existingTool)) {
      const existingSource = existingTool.source;
      if (this.verbose) {
        this.logger.debug(
          `Skipped: Tool '${toolId}' is already registered by '${existingSource}', not registering from '${source}'`,
        );
      }
      return false;
    }

    try {
      const toolDefinition: IToolDefinition = {
        id: toolId,
        schema,
        handler,
        source,
        ...options,
      };

      this.tools.set(toolId, toolDefinition);
      const currentCount = this.registrationCounts.get(source) ?? 0;
      this.registrationCounts.set(source, currentCount + 1);

      if (this.verbose) {
        this.logger.debug(`Registered tool '${toolId}' from '${source}'`);
      }

      return true;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (this.verbose) {
        this.logger.error(`[Registry] Failed to register tool '${toolId}':`, error.message);
      }
      return false;
    }
  }

  private isValidRateLimit(rateLimit: unknown): rateLimit is RateLimit {
    if (typeof rateLimit !== 'object' || rateLimit === null) {
      return false;
    }

    const rl = rateLimit as Partial<RateLimit>;
    const maxRequests = rl.maxRequests;
    const windowMs = rl.windowMs;

    if (typeof maxRequests !== 'number' || typeof windowMs !== 'number') {
      return false;
    }

    return maxRequests > 0 && windowMs > 0;
  }

  private isToolDefinition(tool: unknown): tool is IToolDefinition {
    if (typeof tool !== 'object' || tool === null) {
      return false;
    }

    const td = tool as Partial<IToolDefinition>;
    const id = td.id;
    const schema = td.schema;
    const handler = td.handler;
    const source = td.source;

    if (
      typeof id !== 'string' ||
      typeof schema !== 'object' ||
      typeof handler !== 'function' ||
      typeof source !== 'string'
    ) {
      return false;
    }

    return true;
  }

  /**
   * Register a tool with both the registry and server
   *
   * @param server - MCP server instance
   * @param toolId - Unique identifier for the tool
   * @param schema - Zod schema defining the tool's parameters
   * @param handler - Function to handle tool execution
   * @param source - Module or package registering the tool
   * @param options - Additional tool configuration
   * @returns true if registration was successful, false otherwise
   */
  public registerWithServer(
    server: McpServer,
    toolId: string,
    schema: Record<string, z.ZodType>,
    handler: (args: Record<string, unknown>, extra: RequestHandlerExtra) => Promise<unknown>,
    source: string,
    options: Partial<Omit<IToolDefinition, 'id' | 'schema' | 'handler' | 'source'>> = {},
  ): boolean {
    if (!this.registerTool(toolId, schema, handler, source, options)) {
      return false;
    }

    const toolDefinition = this.tools.get(toolId);
    if (!toolDefinition || !this.isToolDefinition(toolDefinition)) {
      return false;
    }

    const wrappedHandler = async (
      args: Record<string, unknown>,
      extra: RequestHandlerExtra,
    ): Promise<unknown> => {
      try {
        const { rateLimit } = toolDefinition;
        if (rateLimit && this.isValidRateLimit(rateLimit)) {
          const now = Date.now();
          const tracker = this.rateLimitTracker.get(toolId) ?? { count: 0, resetTime: now };

          if (now >= tracker.resetTime + rateLimit.windowMs) {
            tracker.count = 0;
            tracker.resetTime = now;
          }

          if (tracker.count >= rateLimit.maxRequests) {
            throw new Error(`Rate limit exceeded for tool '${toolId}'`);
          }

          tracker.count++;
          this.rateLimitTracker.set(toolId, tracker);
        }

        const { timeout } = toolDefinition;
        if (typeof timeout === 'number' && timeout > 0) {
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout);
          });

          return Promise.race([handler(args, extra), timeoutPromise]);
        }

        return handler(args, extra);
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (this.verbose) {
          this.logger.error(`[Registry] Error executing tool '${toolId}':`, error.message);
        }
        throw error;
      }
    };

    try {
      const registeredServer = server.tool(toolId, schema, wrappedHandler);
      if (!registeredServer) {
        throw new Error('Failed to register tool with server');
      }
      return true;
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (this.verbose) {
        this.logger.error(
          `[Registry] Failed to register tool with server '${toolId}':`,
          error.message,
        );
      }
      return false;
    }
  }

  /**
   * Get all registered tools
   */
  public getAllTools(): Map<string, IToolDefinition> {
    return new Map(this.tools);
  }

  /**
   * Get a specific tool by ID
   */
  public getTool(id: string): IToolDefinition | undefined {
    return this.tools.get(id);
  }

  /**
   * Get all tools in a specific category
   */
  public getToolsByCategory(category: string): IToolDefinition[] {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }

  /**
   * Get a summary of tool registrations
   */
  public getRegistrationSummary(): string {
    const header = 'Tool Registration Summary:\n------------------------';

    if (this.tools.size === 0) {
      return header;
    }

    const summary = Array.from(this.registrationCounts.entries())
      .map(([source, count]) => `${source}: ${count} tools`)
      .join('\n');

    return `${header}\n${summary}`;
  }

  /**
   * Clear all registered tools
   */
  public clear(): void {
    this.tools.clear();
    this.registrationCounts.clear();
    this.rateLimitTracker.clear();
    this.registrationCounts.set('default', 0);
  }
}

/**
 * Get the singleton instance of the tool registry
 */
export function getToolRegistry(): ToolRegistry {
  return ToolRegistry.getInstance();
}
