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

import { z } from "zod";
import { setup } from "xstate";
import { ToolExecutionService } from "../services/toolService.js";
// Export the unified createStatefulTool implementation from statefulTool.ts
export { createStatefulTool } from "../helpers/statefulTool.js";
// We need to re-export these functions from the statefulTool to maintain API compatibility
import {
  getSession as getSessionFromStatefulTool,
  clearSession as clearSessionFromStatefulTool,
  getSessionIds as getSessionIdsFromStatefulTool,
} from "../helpers/statefulTool.js";

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

// Define the context shape for the state machine
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

// Define the possible events for the state machine
export type ToolMachineEvent =
  | { type: "SELECT_TOOL"; toolName: string }
  | { type: "SET_PARAMETERS"; parameters: Record<string, any> }
  | { type: "EXECUTE" }
  | { type: "RECEIVED_RESULT"; result: any }
  | { type: "ERROR"; error: Error }
  | { type: "CANCEL" }
  | { type: "RESET" };

/**
 * Tool execution state machine
 *
 * This machine defines the states and transitions for the tool execution flow:
 *
 * 1. idle: Initial state waiting for tool selection
 * 2. toolSelected: Tool has been selected but parameters not yet set
 * 3. parametersSet: Parameters have been set, ready for execution
 * 4. executing: Tool is currently executing
 * 5. succeeded: Tool execution succeeded
 * 6. failed: Tool execution failed
 */
export const toolMachine = setup({
  types: {
    context: {} as ToolMachineContext,
    events: {} as ToolMachineEvent,
  },
  actions: {
    // Define named actions for better type safety
    setToolName: ({ context, event }) => {
      if (event.type !== "SELECT_TOOL") return;
      context.toolName = event.toolName;
      context.selectedTool = event.toolName;
      context.parameters = null;
      context.result = null;
      context.error = null;
    },
    setParameters: ({ context, event }) => {
      if (event.type !== "SET_PARAMETERS") return;
      context.parameters = event.parameters;
    },
    clearError: ({ context }) => {
      context.error = null;
    },
    setResult: ({ context, event }) => {
      if (event.type !== "RECEIVED_RESULT") return;
      context.result = event.result;
      context.history.push({
        tool: context.selectedTool || "unknown",
        result: event.result,
        timestamp: new Date().toISOString(),
      });
    },
    setError: ({ context, event }) => {
      if (event.type !== "ERROR") return;
      context.error = event.error;
      context.result = null;
    },
    resetState: ({ context }) => {
      context.toolName = null;
      context.selectedTool = null;
      context.parameters = null;
      context.result = null;
      context.error = null;
      context.history = [];
    },
  },
}).createMachine({
  id: "toolExecution",
  initial: "idle",
  context: {
    toolName: null,
    parameters: null,
    result: null,
    error: null,
    sessionId: null,
    selectedTool: null,
    history: [],
  },
  states: {
    idle: {
      on: {
        SELECT_TOOL: {
          target: "toolSelected",
          actions: "setToolName",
        },
      },
    },
    toolSelected: {
      on: {
        SET_PARAMETERS: {
          target: "parametersSet",
          actions: "setParameters",
        },
        SELECT_TOOL: {
          target: "toolSelected",
          actions: "setToolName",
        },
        RESET: {
          target: "idle",
          actions: "resetState",
        },
      },
    },
    parametersSet: {
      on: {
        EXECUTE: "executing",
        SET_PARAMETERS: {
          target: "parametersSet",
          actions: "setParameters",
        },
        RESET: {
          target: "idle",
          actions: "resetState",
        },
      },
    },
    executing: {
      on: {
        RECEIVED_RESULT: {
          target: "succeeded",
          actions: "setResult",
        },
        ERROR: {
          target: "failed",
          actions: "setError",
        },
        CANCEL: "cancelled",
      },
    },
    succeeded: {
      on: {
        SELECT_TOOL: {
          target: "toolSelected",
          actions: "setToolName",
        },
        RESET: {
          target: "idle",
          actions: "resetState",
        },
      },
    },
    failed: {
      on: {
        SELECT_TOOL: {
          target: "toolSelected",
          actions: "setToolName",
        },
        SET_PARAMETERS: {
          target: "parametersSet",
          actions: ["setParameters", "clearError"],
        },
        RESET: {
          target: "idle",
          actions: "resetState",
        },
      },
    },
    cancelled: {
      on: {
        SELECT_TOOL: {
          target: "toolSelected",
          actions: "setToolName",
        },
        RESET: {
          target: "idle",
          actions: "resetState",
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
export function createToolExecutionService(
  sessionId?: string
): ToolExecutionService {
  return getSession(sessionId);
}
