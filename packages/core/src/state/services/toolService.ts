/**
 * Tool Execution Service for MCP SDK
 *
 * This service implements the XState-based state management layer for MCP SDK tools.
 * It serves as the core execution engine for stateful tools, managing tool state,
 * parameter validation, execution flow, and result tracking. The service:
 *
 * - Integrates with the MCP SDK tool callback system
 * - Provides a stateful wrapper around tool execution
 * - Manages tool execution history and context
 * - Handles error states and recovery
 *
 * The ToolExecutionService is used by the statefulTool helper to provide
 * persistence between tool invocations in the MCP infrastructure.
 *
 * @module toolService
 */

import { createActor } from "xstate";
import {
  toolMachine,
  type ToolMachineContext,
} from "../machines/toolMachine.js";
import { ToolResponse } from "../../types/responses.js";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responses.js";

/**
 * Execution result interface for MCP tool integration
 *
 * Defines the structure of results returned by tool executions.
 * This format aligns with MCP SDK expectations for tool responses,
 * including context for stateful operations and status information.
 */
export interface ExecutionResult<T = any> {
  /**
   * The result data returned by the tool
   */
  data: T;

  /**
   * Execution context information that can be used for
   * tracking state and managing tool sessions
   */
  context?: Record<string, any>;

  /**
   * Status of the execution (success, error, etc.)
   */
  status: "success" | "error" | "cancelled" | "pending";

  /**
   * Error message if the execution failed
   */
  error?: string;

  /**
   * Timestamp when the execution completed
   */
  timestamp: string;
}

/**
 * Service for executing tools with state management
 *
 * This class provides the implementation for stateful tool execution
 * in the MCP SDK ecosystem. It uses XState for state management and
 * provides a simple interface for tool execution with context
 * persistence between invocations.
 */
export class ToolExecutionService {
  private sessionId: string;
  private actor: ReturnType<typeof createActor>;

  /**
   * Create a new tool execution service
   *
   * @param sessionId Unique identifier for this execution session (will generate one if not provided)
   */
  constructor(sessionId?: string) {
    this.sessionId = sessionId || crypto.randomUUID();

    // Create an actor from the machine
    this.actor = createActor(toolMachine, {
      input: {
        sessionId: this.sessionId,
      },
    });

    // Start the actor
    this.actor.start();
  }

  /**
   * Get the current session ID
   *
   * @returns Session ID for this execution service
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Select a tool for execution
   *
   * @param toolName Name of the tool to select
   */
  selectTool(toolName: string): void {
    this.actor.send({ type: "SELECT_TOOL", toolName });
    // Wait for the state to update
    const currentState = this.actor.getSnapshot();
    if (currentState.context.toolName !== toolName) {
      // Force an update if the state didn't change
      const updatedContext = {
        ...currentState.context,
        toolName,
        selectedTool: toolName,
        parameters: null,
        result: null,
        error: null,
      };
      // Apply changes directly to the context
      Object.assign(this.actor.getSnapshot().context, updatedContext);
    }
  }

  /**
   * Set parameters for the selected tool
   *
   * @param parameters Parameters to pass to the tool
   */
  setParameters(parameters: Record<string, any>): void {
    this.actor.send({ type: "SET_PARAMETERS", parameters });
  }

  /**
   * Execute the selected tool with the provided parameters
   *
   * This method runs the tool through its execution lifecycle
   * and returns a properly formatted result for MCP SDK integration.
   *
   * @param executeFunction Function that executes the tool logic
   * @returns Promise that resolves with the execution result
   */
  async execute<T>(
    executeFunction: (params: Record<string, any>) => Promise<T>
  ): Promise<ToolResponse<T>> {
    // Get the current state
    const snapshot = this.actor.getSnapshot();
    const { toolName, parameters } = snapshot.context;

    // Check if we have a tool selected
    if (!toolName) {
      // Important: throw an error directly instead of returning a rejected promise
      throw new Error("No tool selected");
    }

    // Now execute the tool
    try {
      const result = await executeFunction(parameters || {});

      // Convert raw result to standard response if needed
      const standardResult =
        (result as any)?.data !== undefined &&
        (result as any)?.status !== undefined &&
        (result as any)?.metadata !== undefined
          ? (result as ToolResponse<T>)
          : createSuccessResponse(result, toolName);

      this.actor.send({
        type: "RECEIVED_RESULT",
        result: standardResult,
      });

      return standardResult;
    } catch (error) {
      // Create a standardized error
      const errorMessage =
        error instanceof Error
          ? error.message.replace(/^Error:\s*/, "")
          : String(error);

      this.actor.send({
        type: "ERROR",
        error: new Error(errorMessage),
      });

      throw error;
    }
  }

  /**
   * Cancel the current execution
   */
  cancel(): void {
    this.actor.send({ type: "CANCEL" });
  }

  /**
   * Reset the execution state
   */
  reset(): void {
    this.actor.send({ type: "RESET" });
  }

  /**
   * Get the current context of the tool execution
   *
   * @returns Current context object with parameters, results, etc.
   */
  getContext(): ToolMachineContext {
    return this.actor.getSnapshot().context;
  }

  /**
   * Get the execution history for this session
   *
   * @returns Array of previous execution results
   */
  getHistory(): Array<{
    tool: string;
    result: ToolResponse<any>;
    timestamp: string;
  }> {
    return this.getContext().history;
  }
}
