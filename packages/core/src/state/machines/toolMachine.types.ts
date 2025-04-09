import type { IToolResult, IExecutionResult } from '@mcp/types';

export type ToolHandler = (params: Record<string, unknown>) => Promise<IToolResult>;

export interface IToolHistoryItem {
  tool: string;
  parameters: Record<string, unknown> | null;
  result?: {
    result: unknown;
    error?: string;
    state: Record<string, unknown>;
  };
  status?: 'success' | 'error' | 'cancelled';
  timestamp: string;
}

export interface IToolMachineContext {
  toolName: string | null;
  selectedTool: {
    name: string;
    handler: ToolHandler;
  } | null;
  parameters: Record<string, unknown> | null;
  result: IToolResult | null;
  error: Error | null;
  history: IToolHistoryItem[];
}

export type ToolMachineEvent =
  | { type: 'SELECT_TOOL'; tool: string; handler: ToolHandler | null }
  | { type: 'SET_PARAMETERS'; parameters: Record<string, unknown> }
  | { type: 'EXECUTE' }
  | { type: 'RECEIVED_RESULT'; result: IExecutionResult<unknown> }
  | { type: 'ERROR'; error: Error }
  | { type: 'CANCEL' }
  | { type: 'RESET' };

export type ToolMachineState =
  | { value: 'idle'; context: IToolMachineContext }
  | { value: 'toolSelected'; context: IToolMachineContext }
  | { value: 'parametersSet'; context: IToolMachineContext }
  | { value: 'executing'; context: IToolMachineContext }
  | { value: 'succeeded'; context: IToolMachineContext }
  | { value: 'failed'; context: IToolMachineContext }
  | { value: 'cancelled'; context: IToolMachineContext };

export type ToolMachineAction =
  | { type: 'selectTool' }
  | { type: 'setParameters' }
  | { type: 'reset' }
  | { type: 'setResult' }
  | { type: 'setError' }
  | { type: 'setCancelled' };
