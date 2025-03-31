import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Interface for a tool definition
 */
export interface ToolDefinition {
  id: string;
  schema: Record<string, any>;
  handler: (...args: any[]) => Promise<any>;
  source: string; // The source module that registered this tool
  description?: string; // Human-readable description
  category?: string; // Tool category for organization
  timeout?: number; // Timeout in milliseconds
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

/**
 * Centralized registry for MCP tools
 *
 * This singleton class tracks all tool registrations across the codebase
 * to ensure tools are only registered once and provides enhanced tool management
 * capabilities.
 */
export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, ToolDefinition> = new Map();
  private verbose: boolean = false;
  private registrationCounts: Map<string, number> = new Map();
  private rateLimitTracker: Map<string, { count: number; resetTime: number }> = new Map();

  private constructor() {}

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
   */
  public registerTool(
    toolId: string,
    schema: Record<string, any>,
    handler: (...args: any[]) => Promise<any>,
    source: string,
    options: Partial<Omit<ToolDefinition, 'id' | 'schema' | 'handler' | 'source'>> = {},
  ): boolean {
    if (this.isToolRegistered(toolId)) {
      if (this.verbose) {
        console.log(
          `[Registry] Skipped: Tool '${toolId}' is already registered by '${
            this.tools.get(toolId)?.source
          }', not registering from '${source}'`,
        );
      }
      return false;
    }

    // Validate schema
    try {
      z.object(schema);
    } catch (error) {
      console.error(`[Registry] Invalid schema for tool '${toolId}':`, error);
      return false;
    }

    this.tools.set(toolId, {
      id: toolId,
      schema,
      handler,
      source,
      ...options,
    });

    // Update counts for this source
    this.registrationCounts.set(source, (this.registrationCounts.get(source) || 0) + 1);

    if (this.verbose) {
      console.log(`[Registry] Registered: Tool '${toolId}' from '${source}'`);
    }

    return true;
  }

  /**
   * Register a tool with the MCP server with enhanced error handling and rate limiting
   */
  public registerWithServer(
    server: McpServer,
    toolId: string,
    schema: Record<string, any>,
    handler: (...args: any[]) => Promise<any>,
    source: string,
    options: Partial<Omit<ToolDefinition, 'id' | 'schema' | 'handler' | 'source'>> = {},
  ): boolean {
    // First check our registry
    if (this.isToolRegistered(toolId)) {
      if (this.verbose) {
        console.log(
          `[Registry] Skipped: Tool '${toolId}' is already registered by '${
            this.tools.get(toolId)?.source
          }', not registering from '${source}'`,
        );
      }
      return false;
    }

    // Create wrapped handler with timeout and rate limiting
    const wrappedHandler = async (...args: any[]) => {
      const toolDef = this.tools.get(toolId);
      if (!toolDef) throw new Error(`Tool ${toolId} not found`);

      // Check rate limiting
      if (toolDef.rateLimit) {
        const now = Date.now();
        const tracker = this.rateLimitTracker.get(toolId) || { count: 0, resetTime: now };

        if (now > tracker.resetTime + toolDef.rateLimit.windowMs) {
          tracker.count = 0;
          tracker.resetTime = now;
        }

        if (tracker.count >= toolDef.rateLimit.maxRequests) {
          throw new Error(`Rate limit exceeded for tool ${toolId}`);
        }

        tracker.count++;
        this.rateLimitTracker.set(toolId, tracker);
      }

      // Apply timeout if specified
      if (toolDef.timeout) {
        const timeoutId = setTimeout(() => {
          throw new Error(`Tool ${toolId} timed out after ${toolDef.timeout}ms`);
        }, toolDef.timeout);

        try {
          return await Promise.race([
            handler(...args),
            new Promise((_, reject) => {
              setTimeout(
                () => reject(new Error(`Tool ${toolId} timed out after ${toolDef.timeout}ms`)),
                toolDef.timeout,
              );
            }),
          ]);
        } finally {
          clearTimeout(timeoutId);
        }
      }

      return handler(...args);
    };

    // Register with the server
    server.tool(toolId, schema, wrappedHandler);

    // Add to our registry
    this.tools.set(toolId, {
      id: toolId,
      schema,
      handler: wrappedHandler,
      source,
      ...options,
    });

    // Update counts for this source
    this.registrationCounts.set(source, (this.registrationCounts.get(source) || 0) + 1);

    if (this.verbose) {
      console.log(`[Registry] Registered: Tool '${toolId}' from '${source}'`);
    }

    return true;
  }

  /**
   * Get all registered tools
   */
  public getAllTools(): Map<string, ToolDefinition> {
    return this.tools;
  }

  /**
   * Get a specific tool by ID
   */
  public getTool(id: string): ToolDefinition | undefined {
    return this.tools.get(id);
  }

  /**
   * Get all tools in a specific category
   */
  public getToolsByCategory(category: string): ToolDefinition[] {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }

  /**
   * Get a summary of tool registrations by source
   */
  public getRegistrationSummary(): string {
    let summary = 'Tool Registration Summary:\n';
    summary += '------------------------\n';

    // Total tools
    summary += `Total Tools: ${this.tools.size}\n\n`;

    // Tools by source
    summary += 'By Source:\n';
    this.registrationCounts.forEach((count, source) => {
      summary += `  ${source}: ${count} tools\n`;
    });
    summary += '\n';

    // Tools by category
    const categories = new Map<string, number>();
    this.tools.forEach(tool => {
      const category = tool.category || 'uncategorized';
      categories.set(category, (categories.get(category) || 0) + 1);
    });

    summary += 'By Category:\n';
    categories.forEach((count, category) => {
      summary += `  ${category}: ${count} tools\n`;
    });
    summary += '\n';

    // Rate limited tools
    const rateLimitedTools = Array.from(this.tools.values()).filter(tool => tool.rateLimit);
    if (rateLimitedTools.length > 0) {
      summary += 'Rate Limited Tools:\n';
      rateLimitedTools.forEach(tool => {
        summary += `  ${tool.id}: ${tool.rateLimit?.maxRequests} requests per ${
          tool.rateLimit?.windowMs
        }ms\n`;
      });
    }

    return summary;
  }

  /**
   * Clear all registered tools
   */
  public clear(): void {
    this.tools.clear();
    this.registrationCounts.clear();
    this.rateLimitTracker.clear();
  }
}

/**
 * Get the singleton instance of the tool registry
 */
export function getToolRegistry(): ToolRegistry {
  return ToolRegistry.getInstance();
}
