import { Tool } from "../../tools/interfaces";

/**
 * Represents the state of a tool during execution
 */
export interface ToolState {
  [key: string]: any;
}

/**
 * Represents the result of a tool execution
 */
export interface ToolExecutionResult {
  /**
   * Unique ID for this execution
   */
  executionId: string;

  /**
   * ID of the tool that was executed
   */
  toolId: string;

  /**
   * Session ID associated with this execution
   */
  sessionId: string;

  /**
   * Parameters passed to the tool
   */
  params: any;

  /**
   * Result data from the tool execution
   */
  result: any;

  /**
   * Error message if execution failed
   */
  error?: string;

  /**
   * Status of the execution (success or error)
   */
  status: "success" | "error";

  /**
   * Time taken to execute in milliseconds
   */
  executionTimeMs: number;

  /**
   * ISO timestamp of when the execution completed
   */
  timestamp: string;

  /**
   * Whether this result was retrieved from cache
   */
  fromCache: boolean;
}

/**
 * Service for executing tools with state management
 */
export interface ToolExecutionService {
  /**
   * Executes a tool with the given parameters and session ID
   *
   * @param toolId ID of the tool to execute
   * @param params Tool parameters
   * @param sessionId Session ID for state persistence
   * @param useCached Whether to use cached results if available
   * @returns Tool execution result
   */
  executeTool(
    toolId: string,
    params: any,
    sessionId?: string,
    useCached?: boolean
  ): Promise<ToolExecutionResult>;

  /**
   * Retrieves all available tools
   *
   * @returns Map of tools by ID
   */
  getTools(): Map<string, Tool>;

  /**
   * Invalidates the cache for a specific tool
   *
   * @param toolId Tool ID to invalidate
   * @param sessionId Optional session ID to scope invalidation
   */
  invalidateToolCache?(toolId: string, sessionId?: string): Promise<void>;

  /**
   * Clears all state and cached results for a session
   *
   * @param sessionId Session ID to clear
   */
  clearSession?(sessionId: string): Promise<void>;

  /**
   * Disconnects any resources used by the service
   */
  disconnect?(): Promise<void>;

  /**
   * Gets service statistics
   *
   * @returns Service statistics
   */
  getStats?(): Promise<any>;
}
