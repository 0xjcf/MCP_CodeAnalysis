/**
 * Core types for the MCP Code Analysis system.
 * This file exports common interfaces, types, and enums used throughout the application.
 */

/**
 * Represents a tool that can be executed
 */
export interface Tool {
  name: string;
  description: string;
  parameterSchema?: Record<string, any>;
  [key: string]: any;
}

/**
 * Interface for tool execution services
 */
export interface ToolExecution {
  initializeState(): Promise<void>;
  selectTool(tool: Tool): Promise<void>;
  setParameters(parameters: Record<string, unknown>): Promise<void>;
  execute(options?: ToolExecutionOptions): Promise<ToolExecutionResponse>;
  cancel(): Promise<void>;
  reset(): Promise<void>;
  dispose(): Promise<void>;
  getContext(): ToolMachineContext;
}

/**
 * Context for the tool execution state machine
 */
export interface ToolMachineContext {
  toolName: string | null;
  parameters: Record<string, any> | null;
  result: any | null;
  error: Error | null;
  sessionId: string | null;
  selectedTool: string | null;
  history: Array<{
    tool: string;
    result: any;
    timestamp: string;
  }>;
}

/**
 * Options for tool execution
 */
export interface ToolExecutionOptions {
  timeout?: number;
  retries?: number;
  signal?: AbortSignal;
}

/**
 * Response from a tool execution
 */
export interface ToolExecutionResponse {
  status: {
    success: boolean;
    message?: string;
  };
  data?: any;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  metadata?: Record<string, any>;
}

/**
 * Event to select a tool
 */
export interface ToolSelectEvent {
  type: 'SELECT_TOOL';
  toolName: string;
}

/**
 * Event to set parameters
 */
export interface SetParametersEvent {
  type: 'SET_PARAMETERS';
  parameters: Record<string, unknown>;
}

/**
 * Event to update execution status
 */
export interface ExecutionStatusEvent {
  type: 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  payload?: any;
} 