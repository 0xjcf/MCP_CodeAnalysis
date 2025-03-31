import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolRegistry, getToolRegistry } from "./tool-registry.js";
/**
 * Initialize the tool registry with verbosity setting
 */
export declare function initializeToolRegistry(verbose?: boolean): ToolRegistry;
/**
 * Register tools with both the registry and server
 *
 * This function ensures tools are only registered once while
 * maintaining the existing defensive programming approach
 */
export declare function registerToolsWithRegistry(server: McpServer, registerFn: (server: McpServer) => void, source: string, verbose?: boolean): void;
export { ToolRegistry, getToolRegistry };
//# sourceMappingURL=index.d.ts.map