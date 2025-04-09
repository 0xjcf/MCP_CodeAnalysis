/**
 * Core types for the MCP Code Analysis system.
 * This file exports common interfaces, types, and enums used throughout the application.
 */

/**
 * Represents a tool parameter schema
 */
export interface IToolParameterSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  required?: boolean;
  default?: unknown;
  enum?: unknown[];
  properties?: Record<string, IToolParameterSchema>;
  items?: IToolParameterSchema;
}

/**
 * Represents a tool that can be executed
 */
export interface ITool {
  name: string;
  description: string;
  parameterSchema?: Record<string, IToolParameterSchema>;
  category?: string;
  tags?: string[];
  timeout?: number;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

/**
 * Interface for tool execution services
 */
export interface IToolExecution {
  initializeState(): Promise<void>;
  selectTool(tool: ITool): Promise<void>;
  setParameters(parameters: Record<string, unknown>): Promise<void>;
  execute(options?: IToolExecutionOptions): Promise<IToolExecutionResponse>;
  cancel(): Promise<void>;
  reset(): Promise<void>;
  dispose(): Promise<void>;
  getContext(): IToolMachineContext;
}

/**
 * Context for the tool execution state machine
 */
export interface IToolMachineContext {
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
}

/**
 * Options for tool execution
 */
export interface IToolExecutionOptions {
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
}

/**
 * Response from a tool execution
 */
export interface IToolExecutionResponse {
  status: {
    success: boolean;
    message?: string;
  };
  data?: unknown;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Event to select a tool
 */
export interface IToolSelectEvent {
  type: 'SELECT_TOOL';
  toolName: string;
}

/**
 * Event to set parameters
 */
export interface ISetParametersEvent {
  type: 'SET_PARAMETERS';
  parameters: Record<string, unknown>;
}

/**
 * Event to update execution status
 */
export interface IExecutionStatusEvent {
  type: 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  payload?: unknown;
}
