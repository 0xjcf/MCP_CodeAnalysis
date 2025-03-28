import { ToolState } from "../state/interfaces/toolExecutionService";

/**
 * Result of tool execution
 */
export interface ToolResult<T = any> {
  /**
   * Result data from the tool execution
   */
  result: T;

  /**
   * Error message if execution failed
   */
  error?: string;

  /**
   * Updated tool state after execution
   */
  state?: ToolState;
}

/**
 * Interface for MCP tool definition
 */
export interface Tool<P = any, R = any> {
  /**
   * Unique ID for the tool
   */
  id: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Tool description
   */
  description: string;

  /**
   * Optional tool version
   */
  version?: string;

  /**
   * Optional tool category for grouping
   */
  category?: string;

  /**
   * Optional cache TTL for this tool in seconds
   */
  cacheTtl?: number;

  /**
   * Indicates if this tool supports or requires persistent state
   */
  supportsState?: boolean;

  /**
   * Function to execute the tool
   *
   * @param params Tool parameters
   * @param state Current state (optional)
   * @returns Tool execution result
   */
  execute(params: P, state?: ToolState): Promise<ToolResult<R>>;
}

/**
 * Manager for tool registration and discovery
 */
export interface ToolRegistry {
  /**
   * Register a new tool
   *
   * @param tool Tool to register
   */
  registerTool(tool: Tool): void;

  /**
   * Get a tool by ID
   *
   * @param id Tool ID
   * @returns Tool or undefined if not found
   */
  getTool(id: string): Tool | undefined;

  /**
   * Get all registered tools
   *
   * @returns Map of all registered tools
   */
  getAllTools(): Map<string, Tool>;

  /**
   * Get tools by category
   *
   * @param category Category name
   * @returns Array of tools in the category
   */
  getToolsByCategory(category: string): Tool[];

  /**
   * Unregister a tool
   *
   * @param id Tool ID
   * @returns True if tool was unregistered, false if not found
   */
  unregisterTool(id: string): boolean;
}
