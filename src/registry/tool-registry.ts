import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Interface for a tool definition
 */
export interface ToolDefinition {
  id: string;
  schema: Record<string, any>;
  handler: (...args: any[]) => Promise<any>;
  source: string; // The source module that registered this tool
}

/**
 * Centralized registry for MCP tools
 *
 * This singleton class tracks all tool registrations across the codebase
 * to ensure tools are only registered once.
 */
export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools: Map<string, ToolDefinition> = new Map();
  private verbose: boolean = false;
  private registrationCounts: Map<string, number> = new Map(); // Track registration counts by source

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
   * Set verbosity for logging
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
    source: string
  ): boolean {
    if (this.isToolRegistered(toolId)) {
      if (this.verbose) {
        console.log(
          `[Registry] Skipped: Tool '${toolId}' is already registered by '${
            this.tools.get(toolId)?.source
          }', not registering from '${source}'`
        );
      }
      return false;
    }

    this.tools.set(toolId, {
      id: toolId,
      schema,
      handler,
      source,
    });

    // Update counts for this source
    this.registrationCounts.set(
      source,
      (this.registrationCounts.get(source) || 0) + 1
    );

    if (this.verbose) {
      console.log(`[Registry] Registered: Tool '${toolId}' from '${source}'`);
    }

    return true;
  }

  /**
   * Register a tool with the MCP server
   *
   * This is a wrapper around the MCP server's tool method that checks
   * if the tool is already registered before attempting registration.
   */
  public registerWithServer(
    server: McpServer,
    toolId: string,
    schema: Record<string, any>,
    handler: (...args: any[]) => Promise<any>,
    source: string
  ): boolean {
    // First check our registry
    if (this.isToolRegistered(toolId)) {
      if (this.verbose) {
        console.log(
          `[Registry] Skipped: Tool '${toolId}' is already registered by '${
            this.tools.get(toolId)?.source
          }', not registering from '${source}'`
        );
      }
      return false;
    }

    // Register with the server
    server.tool(toolId, schema, handler);

    // Add to our registry
    this.tools.set(toolId, {
      id: toolId,
      schema,
      handler,
      source,
    });

    // Update counts for this source
    this.registrationCounts.set(
      source,
      (this.registrationCounts.get(source) || 0) + 1
    );

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
   * Get a summary of registered tools
   */
  public getRegistrationSummary(): string {
    const totalTools = this.tools.size;
    let summary = `\n━━━━━━━━━━ Tool Registration Summary ━━━━━━━━━━\n`;
    summary += `Total registered tools: ${totalTools}\n\n`;

    // Sort sources by number of tools (descending)
    const sortedSources = Array.from(this.registrationCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    );

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
  }
}

/**
 * Get the global tool registry instance
 */
export const getToolRegistry = ToolRegistry.getInstance;
