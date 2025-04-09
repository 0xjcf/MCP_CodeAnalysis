/**
 * Tool Execution State Machine for MCP SDK Integration
 *
 * This module provides a state machine implementation for tool execution flow used by
 * the MCP SDK tools. It defines the core state machine that manages tool execution
 * states and transitions, handling the lifecycle of tool execution including:
 *
 * - Parameter validation
 * - Tool selection
 * - Execution flow management
 * - Error handling and recovery
 * - Result processing and history tracking
 *
 * This state machine is used by the statefulTool helper to provide state persistence
 * across multiple tool invocations.
 *
 * @module toolMachine
 */

import type { IToolResult} from '@mcp/types';
import { IExecutionResult } from '@mcp/types';
import { setup, fromPromise, assign, AnyEventObject, EventObject, createMachine } from 'xstate';
import { z } from 'zod';

import type { ToolExecutionService } from '../services/toolService.js';

import type {
  IToolMachineContext,
  IToolHistoryItem,
  ToolMachineEvent,
} from './toolMachine.types.js';

// Export the unified createStatefulTool implementation from statefulTool.ts
export { createStatefulTool } from '../helpers/statefulTool.js';
// We need to re-export these functions from the statefulTool to maintain API compatibility
import {
  getSession as getSessionFromStatefulTool,
  clearSession as clearSessionFromStatefulTool,
  getSessionIds as getSessionIdsFromStatefulTool,
} from '../helpers/statefulTool.js';

/**
 * Get a session by ID, creating one if it doesn't exist
 *
 * Used to access or create a tool execution session for managing state.
 * This function delegates to the implementation in statefulTool.ts.
 *
 * @param sessionId Session ID to retrieve
 * @returns Tool execution service for the session
 */
export function getSession(sessionId?: string): ToolExecutionService {
  return getSessionFromStatefulTool(sessionId);
}

/**
 * Clear a session by ID
 *
 * Removes a session and its associated state from memory.
 * This function delegates to the implementation in statefulTool.ts.
 *
 * @param sessionId Session ID to clear
 * @returns true if session was found and cleared, false otherwise
 */
export function clearSession(sessionId: string): boolean {
  return clearSessionFromStatefulTool(sessionId);
}

/**
 * Get all active session IDs
 *
 * Provides a list of all active session IDs.
 * This function delegates to the implementation in statefulTool.ts.
 *
 * @returns Array of active session IDs
 */
export function getSessionIds(): string[] {
  return getSessionIdsFromStatefulTool();
}

/**
 * Tool Execution State Machine
 *
 * This defines the XState machine for tool execution flow.
 * The machine handles the lifecycle of tool execution including:
 *
 * - Parameter validation
 * - Tool selection
 * - Execution
 * - Error handling
 * - Result processing
 */

export const toolMachine = setup({
  types: {
    context: {} as IToolMachineContext,
    events: {} as ToolMachineEvent,
  },
  actions: {
    selectTool: assign(({ event }) => {
      if (event.type !== 'SELECT_TOOL') return {};
      return {
        toolName: event.tool,
        selectedTool: event.handler ? { name: event.tool, handler: event.handler } : null,
        parameters: null,
        result: null,
        error: null,
      };
    }),
    setParameters: assign(({ event, context }) => {
      if (event.type !== 'SET_PARAMETERS') return {};
      return {
        parameters: event.parameters,
      };
    }),
    reset: assign(() => ({
      toolName: null,
      selectedTool: null,
      parameters: null,
      result: null,
      error: null,
      history: [],
    })),
    setResult: assign(({ event, context }) => {
      if (event.type !== 'RECEIVED_RESULT') return {};
      if (!context.toolName) return {};

      const historyItem: IToolHistoryItem = {
        tool: context.toolName,
        parameters: context.parameters,
        result: {
          result: event.result.data,
          error: event.result.error ? event.result.error.toString() : undefined,
          state: event.result.context,
        },
        timestamp: new Date().toISOString(),
      };
      return {
        result: event.result as unknown as IToolResult,
        history: [...context.history, historyItem],
      };
    }),
    setError: assign(({ event, context }) => {
      if (event.type !== 'ERROR') return {};
      if (!context.toolName) return {};

      return {
        error: event.error,
      };
    }),
    setCancelled: assign(({ context }) => {
      if (!context.toolName) return { history: context.history };

      const historyItem: IToolHistoryItem = {
        tool: context.toolName,
        parameters: context.parameters,
        status: 'cancelled',
        timestamp: new Date().toISOString(),
      };

      return {
        history: [...context.history, historyItem],
      };
    }),
  },
}).createMachine({
  id: 'tool',
  initial: 'idle',
  context: {
    toolName: null,
    selectedTool: null,
    parameters: null,
    result: null,
    error: null,
    history: [],
  },
  states: {
    idle: {
      on: {
        SELECT_TOOL: {
          target: 'toolSelected',
          actions: [{ type: 'selectTool' }],
        },
      },
    },
    toolSelected: {
      on: {
        SET_PARAMETERS: {
          target: 'parametersSet',
          actions: [{ type: 'setParameters' }],
        },
        SELECT_TOOL: {
          target: 'toolSelected',
          actions: [{ type: 'selectTool' }],
        },
        RESET: {
          target: 'idle',
          actions: [{ type: 'reset' }],
        },
      },
    },
    parametersSet: {
      on: {
        EXECUTE: {
          target: 'executing',
          actions: assign(() => ({
            result: null,
            error: null,
          })),
        },
        SELECT_TOOL: {
          target: 'toolSelected',
          actions: [{ type: 'selectTool' }],
        },
        RESET: {
          target: 'idle',
          actions: [{ type: 'reset' }],
        },
      },
    },
    executing: {
      on: {
        RECEIVED_RESULT: {
          target: 'succeeded',
          actions: [{ type: 'setResult' }],
        },
        ERROR: {
          target: 'failed',
          actions: [{ type: 'setError' }],
        },
        CANCEL: {
          target: 'cancelled',
          actions: [{ type: 'setCancelled' }],
        },
      },
    },
    succeeded: {
      on: {
        SELECT_TOOL: {
          target: 'toolSelected',
          actions: [{ type: 'selectTool' }],
        },
        RESET: {
          target: 'idle',
          actions: [{ type: 'reset' }],
        },
      },
    },
    failed: {
      on: {
        SELECT_TOOL: {
          target: 'toolSelected',
          actions: [{ type: 'selectTool' }],
        },
        RESET: {
          target: 'idle',
          actions: [{ type: 'reset' }],
        },
      },
    },
    cancelled: {
      on: {
        SELECT_TOOL: {
          target: 'toolSelected',
          actions: [{ type: 'selectTool' }],
        },
        RESET: {
          target: 'idle',
          actions: [{ type: 'reset' }],
        },
      },
    },
  },
});

/**
 * Create a tool execution service
 *
 * Helper function to create a new ToolExecutionService instance with the provided
 * session ID, or a generated one if not provided. The service will be stored in
 * the sessions map for future retrieval using the statefulTool storage.
 *
 * @param sessionId Optional session ID for persistence
 * @returns Tool execution service with the state machine
 */
export function createToolExecutionService(sessionId?: string): ToolExecutionService {
  return getSession(sessionId);
}
