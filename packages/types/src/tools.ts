import { z } from 'zod';

/**
 * Base response schema that all tool responses must follow
 */
export const ToolResponseSchema = z.object({
  data: z.unknown().describe('The actual response data - can be any valid JSON value'),
  metadata: z.object({
    tool: z.string().describe('Name of the tool that generated this response'),
    version: z.string().describe('Version of the tool'),
    executionTime: z.number().describe('Time taken to execute the tool (in milliseconds)'),
    timestamp: z.string().describe('ISO timestamp of when the response was generated'),
  }),
  status: z.object({
    success: z.boolean().describe('Whether the operation succeeded'),
    code: z.number().describe('HTTP-like status code (200, 400, 500, etc.)'),
    message: z
      .string()
      .optional()
      .describe('Optional status message, especially useful for errors'),
  }),
  context: z
    .object({
      sessionId: z.string().optional().describe('Session identifier for related operations'),
      relatedResults: z.array(z.string()).optional().describe('References to related result IDs'),
    })
    .optional()
    .describe('Optional context for chaining operations'),
});

/**
 * Standard tool response type
 */
export type IToolResponse<T = unknown> = z.infer<typeof ToolResponseSchema> & {
  data: T;
};

/**
 * Result of tool execution
 */
export interface IToolResult<T = unknown> {
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
  state?: IToolState;
}

/**
 * Interface for MCP tool definition
 */
export interface ITool<P = unknown, R = unknown> {
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
  execute(params: P, state?: IToolState): Promise<IToolResult<R>>;
}

/**
 * Represents the state of a tool during execution
 */
export interface IToolState {
  [key: string]: unknown;
}

/**
 * Tool execution result interface for MCP SDK
 */
export interface IExecutionResult<T = unknown> {
  /**
   * The result data returned by the tool
   */
  data: T | null;

  /**
   * Execution context information that can be used for
   * tracking state and managing tool sessions
   */
  context: Record<string, unknown>;

  /**
   * Status of the execution (success, error, etc.)
   */
  status: 'success' | 'error' | 'cancelled';

  /**
   * Error message if the execution failed
   */
  error?: Error;

  /**
   * Timestamp when the execution completed
   */
  timestamp: number;
}

/**
 * Context for the tool execution state machine
 */
export interface ToolMachineContext {
  toolName: string | null;
  parameters: Record<string, unknown> | null;
  result: unknown | null;
  error: Error | null;
  sessionId: string | null;
  selectedTool: string | null;
  history: Array<{
    tool: string;
    result: unknown;
    timestamp: string;
  }>;
  toolHandler?: (parameters: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Possible events for the tool execution state machine
 */
export type ToolMachineEvent =
  | {
      type: 'SELECT_TOOL';
      toolName: string;
      handler?: (parameters: Record<string, unknown>) => Promise<unknown>;
    }
  | { type: 'SET_PARAMETERS'; parameters: Record<string, unknown> }
  | { type: 'EXECUTE' }
  | { type: 'RECEIVED_RESULT'; result: unknown }
  | { type: 'ERROR'; error: Error }
  | { type: 'CANCEL' }
  | { type: 'RESET' };
