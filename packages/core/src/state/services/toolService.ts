/**
 * Tool Execution Service for MCP SDK
 *
 * This service implements the XState-based state management layer for MCP SDK tools.
 * It serves as the core execution engine for stateful tools, managing tool state,
 * parameter validation, execution flow, and result tracking.
 */

// External imports
import type { ITool, IExecutionResult } from '@mcp/types';
import { v4 as uuid } from 'uuid';
import type { Actor} from 'xstate';
import { createActor } from 'xstate';

// Internal type imports
import type {
  IToolExecutionService,
  IToolExecutionResult,
} from '../interfaces/toolExecutionService.js';

// Internal imports
import { toolMachine } from '../machines/toolMachine.js';
import type { ToolHandler } from '../machines/toolMachine.types.js';

export class ToolExecutionService implements IToolExecutionService {
  private actor: Actor<typeof toolMachine>;
  private tools: Map<string, ITool>;
  private sessionId: string;
  private startTime: number;
  private selectedTool: { name: string; handler: ToolHandler | null } | null = null;
  private parameters: Record<string, unknown> | null = null;
  private history: Array<{
    tool: string;
    parameters: Record<string, unknown>;
    result: any;
    timestamp: string;
  }> = [];

  constructor(sessionId?: string) {
    this.actor = createActor(toolMachine).start();
    this.tools = new Map<string, ITool>();
    this.sessionId = sessionId || uuid();
    this.startTime = Date.now();
  }

  getSessionId(): string {
    return this.sessionId;
  }

  selectTool(toolName: string, handler?: ToolHandler): void {
    this.selectedTool = {
      name: toolName,
      handler: handler ?? null,
    };
    this.parameters = null;
    this.actor.send({ type: 'SELECT_TOOL', tool: toolName, handler: handler ?? null });
  }

  getContext(): {
    toolName: string | null;
    selectedTool: { name: string; handler: ToolHandler | null } | null;
    parameters: Record<string, unknown> | null;
    result: any;
    error: Error | null;
    history: Array<any>;
  } {
    const snapshot = this.actor.getSnapshot();
    return {
      toolName: this.selectedTool?.name || null,
      selectedTool: this.selectedTool,
      parameters: this.parameters,
      result: snapshot.context.result,
      error: snapshot.context.error,
      history: this.history,
    };
  }

  setParameters(parameters: Record<string, unknown>): void {
    if (this.parameters === null) {
      this.parameters = parameters;
      this.actor.send({ type: 'SET_PARAMETERS', parameters });
    }
  }

  setToolHandler(handler: ToolHandler): void {
    if (this.selectedTool) {
      this.selectedTool.handler = handler;
    }
  }

  async execute(handler?: ToolHandler): Promise<IExecutionResult> {
    if (!this.selectedTool) {
      throw new Error('No tool selected');
    }

    const executeHandler = handler || this.selectedTool.handler;
    if (!executeHandler) {
      throw new Error('No tool handler provided');
    }

    try {
      const result = await executeHandler(this.parameters || {});

      const executionResult: IExecutionResult & { metadata?: any } = {
        data: result.result,
        context: { tool: this.selectedTool.name },
        status: 'success',
        timestamp: Date.now(),
        metadata: {
          status: 'success',
          context: { tool: this.selectedTool.name },
        },
      };

      this.history.push({
        tool: this.selectedTool.name,
        parameters: this.parameters || {},
        result: executionResult,
        timestamp: new Date().toISOString(),
      });

      this.actor.send({ type: 'RECEIVED_RESULT', result: executionResult });
      return executionResult;
    } catch (error) {
      const errorResult: IExecutionResult & { metadata?: any } = {
        data: null,
        context: { tool: this.selectedTool.name },
        status: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: Date.now(),
        metadata: {
          status: 'error',
          context: { tool: this.selectedTool.name },
        },
      };
      this.actor.send({
        type: 'ERROR',
        error: error instanceof Error ? error : new Error(String(error)),
      });
      throw error;
    }
  }

  cancel(): void {
    this.actor.send({ type: 'CANCEL' });
  }

  getHistory(): Array<{
    tool: string;
    parameters: Record<string, unknown>;
    result: any;
    timestamp: string;
  }> {
    return this.history;
  }

  async executeTool(
    toolId: string,
    params: Record<string, unknown>,
    sessionId?: string,
    useCached = false,
  ): Promise<IToolExecutionResult> {
    try {
      const tool = this.tools.get(toolId);
      if (!tool) {
        return {
          executionId: uuid(),
          toolId,
          sessionId: sessionId || this.sessionId,
          params,
          result: null,
          error: `Tool ${toolId} not found`,
          status: 'error',
          executionTimeMs: 0,
          timestamp: new Date().toISOString(),
          fromCache: false,
        };
      }

      const executionId = uuid();
      const startTime = Date.now();

      this.actor.send({ type: 'SELECT_TOOL', tool: toolId, handler: null });
      this.actor.send({ type: 'SET_PARAMETERS', parameters: params });

      const result = await tool.execute(params);
      const executionTimeMs = Date.now() - startTime;

      if ('error' in result && result.error) {
        return {
          executionId,
          toolId,
          sessionId: sessionId || this.sessionId,
          params,
          result: null,
          error: result.error,
          status: 'error',
          executionTimeMs,
          timestamp: new Date().toISOString(),
          fromCache: useCached,
        };
      }

      const executionResult: IExecutionResult<unknown> = {
        data: result.result,
        context: {},
        status: 'success',
        timestamp: Date.now(),
      };

      this.actor.send({ type: 'RECEIVED_RESULT', result: executionResult });

      return {
        executionId,
        toolId,
        sessionId: sessionId || this.sessionId,
        params,
        result: result.result,
        status: 'success',
        executionTimeMs,
        timestamp: new Date().toISOString(),
        fromCache: useCached,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.actor.send({ type: 'ERROR', error: new Error(errorMessage) });

      return {
        executionId: uuid(),
        toolId,
        sessionId: sessionId || this.sessionId,
        params,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        executionTimeMs: 0,
        timestamp: new Date().toISOString(),
        fromCache: false,
      };
    }
  }

  getTools(): Map<string, ITool> {
    return this.tools;
  }

  async invalidateToolCache(toolId: string, sessionId?: string): Promise<void> {
    // Implementation not required for now
  }

  async clearSession(sessionId: string): Promise<void> {
    // Implementation not required for now
  }

  async disconnect(): Promise<void> {
    this.actor.stop();
  }

  async getStats(): Promise<any> {
    return {
      activeSessions: 1,
      totalTools: this.tools.size,
      lastUpdated: new Date(),
    };
  }
}
