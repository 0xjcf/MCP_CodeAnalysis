import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
/**
 * Interface for a tool definition
 */
export interface ToolDefinition {
    id: string;
    schema: Record<string, any>;
    handler: (...args: any[]) => Promise<any>;
    source: string;
    description?: string;
    category?: string;
    timeout?: number;
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
export declare class ToolRegistry {
    private static instance;
    private tools;
    private verbose;
    private registrationCounts;
    private rateLimitTracker;
    private constructor();
    /**
     * Get the singleton instance of the tool registry
     */
    static getInstance(): ToolRegistry;
    /**
     * Set verbosity level for logging
     */
    setVerbose(verbose: boolean): void;
    /**
     * Check if a tool is already registered
     */
    isToolRegistered(id: string): boolean;
    /**
     * Register a tool with the registry
     */
    registerTool(toolId: string, schema: Record<string, any>, handler: (...args: any[]) => Promise<any>, source: string, options?: Partial<Omit<ToolDefinition, 'id' | 'schema' | 'handler' | 'source'>>): boolean;
    /**
     * Register a tool with the MCP server with enhanced error handling and rate limiting
     */
    registerWithServer(server: McpServer, toolId: string, schema: Record<string, any>, handler: (...args: any[]) => Promise<any>, source: string, options?: Partial<Omit<ToolDefinition, 'id' | 'schema' | 'handler' | 'source'>>): boolean;
    /**
     * Get all registered tools
     */
    getAllTools(): Map<string, ToolDefinition>;
    /**
     * Get a tool by ID
     */
    getTool(id: string): ToolDefinition | undefined;
    /**
     * Get tools by category
     */
    getToolsByCategory(category: string): ToolDefinition[];
    /**
     * Get a summary of registered tools
     */
    getRegistrationSummary(): string;
    /**
     * Clear the registry (mainly for testing)
     */
    clear(): void;
}
/**
 * Get the global tool registry instance
 */
export declare const getToolRegistry: typeof ToolRegistry.getInstance;
//# sourceMappingURL=tool-registry.d.ts.map