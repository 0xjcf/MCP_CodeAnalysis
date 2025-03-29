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
    return new Map(this.tools);
  }

  /**
   * Get a tool by ID
   */
  public getTool(id: string): ToolDefinition | undefined {
    return this.tools.get(id);
  }

  /**
   * Get tools by category
   */
  public getToolsByCategory(category: string): ToolDefinition[] {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }

  /**
   * Get a summary of registered tools
   */
  public getRegistrationSummary(): string {
    const totalTools = this.tools.size;
    let summary = `\n━━━━━━━━━━ Tool Registration Summary ━━━━━━━━━━\n`;
    summary += `Total registered tools: ${totalTools}\n\n`;

    // Sort sources by number of tools (descending)
    const sortedSources = Array.from(this.registrationCounts.entries()).sort((a, b) => b[1] - a[1]);

    if (sortedSources.length > 0) {
      summary += `Tools by module:\n`;
      for (const [source, count] of sortedSources) {
        summary += `  • ${source}: ${count} tools\n`;
      }
    }

    // List all tools for verbose mode
    if (this.verbose) {
      summary += `\nRegistered tools:\n`;

      // Group tools by source
      const toolsBySource = new Map<string, string[]>();
      for (const [id, def] of this.tools.entries()) {
        if (!toolsBySource.has(def.source)) {
          toolsBySource.set(def.source, []);
        }
        toolsBySource.get(def.source)?.push(id);
      }

      // Print tools organized by source
      for (const [source, tools] of toolsBySource.entries()) {
        summary += `  • ${source}:\n`;
        for (const tool of tools.sort()) {
          summary += `    - ${tool}\n`;
        }
      }
    }

    summary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    return summary;
  }

  /**
   * Clear the registry (mainly for testing)
   */
  public clear(): void {
    this.tools.clear();
    this.registrationCounts.clear();
    this.rateLimitTracker.clear();
  }
}

/**
 * Get the global tool registry instance
 */
export const getToolRegistry = ToolRegistry.getInstance;
