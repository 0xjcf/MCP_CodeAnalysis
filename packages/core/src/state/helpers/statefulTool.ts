/**
 * Stateful Tool Integration Helper
 *
 * This helper provides integration between the MCP SDK's tool system and XState state machines.
 * It enhances the standard MCP tools with state persistence, allowing tools to maintain
 * context between invocations through a session management system. This is particularly
 * useful for:
 *
 * - Multi-step tool executions where state must be maintained
 * - Chained tool interactions that share context
 * - Building conversational or wizard-like tool interfaces
 * - Tracking execution history across multiple invocations
 *
 * @module statefulTool
 */

import type { IToolResult, IToolResponse } from '@mcp/types';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { createSuccessResponse, createErrorResponse } from '../../utils/responses.js';
import { ToolExecutionService } from '../services/toolService.js';

// Map to store sessions by ID
const sessions = new Map<string, ToolExecutionService>();

interface IToolCallbackArgs {
  sessionId?: string;
}

interface ISdkExtra {
  requestId?: string;
  timestamp?: number;
  severity?: 'info' | 'warning' | 'error';
  metadata?: Record<string, unknown>;
  context?: Record<string, unknown>;
  sessionId?: string;
}

/**
 * Create a stateful tool that uses XState for state management
 *
 * Registers a tool with the MCP server using the same signature pattern as McpServer.tool(),
 * but enhances it with session management and state persistence. This allows tools to maintain
 * context across multiple invocations.
 *
 * @param server MCP server instance
 * @param name Tool name
 * @param schema Zod schema for tool parameters
 * @param handler Function to handle tool execution
 */
export function createStatefulTool<
  TParams extends Record<string, unknown>,
  TResult extends Record<string, unknown>,
>(
  server: McpServer,
  name: string,
  schema: z.ZodRawShape,
  handler: (params: TParams, extra: ISdkExtra) => Promise<IToolResult<TResult>>,
): void {
  // Register the tool with the server
  server.tool(
    name,
    {
      ...schema,
      sessionId: z.string().optional(),
    } as Record<string, z.ZodType>,
    async (args: Record<string, unknown>, extra: ISdkExtra) => {
      const startTime = Date.now();
      try {
        // Extract sessionId from params (or create new session)
        const { sessionId, ...toolParams } = args as { sessionId?: string } & Record<
          string,
          unknown
        >;

        // Get or create session
        let session: ToolExecutionService;
        const sessionIdStr = sessionId;

        if (sessionIdStr) {
          const existingSession = sessions.get(sessionIdStr);
          if (existingSession) {
            session = existingSession;
          } else {
            session = new ToolExecutionService(sessionIdStr);
            sessions.set(sessionIdStr, session);
          }
        } else {
          const newSessionId = crypto.randomUUID();
          session = new ToolExecutionService(newSessionId);
          sessions.set(newSessionId, session);
        }

        // Select the tool and set parameters
        session.selectTool(name, async (parameters: Record<string, unknown>) => {
          const result = await handler(parameters as TParams, {
            ...extra,
            sessionId: session.getSessionId(),
            timestamp: Date.now(),
          });
          return result;
        });
        session.setParameters(toolParams);

        // Execute the tool
        const result = await session.execute();

        // Return MCP-formatted response with properly typed content
        if (result.error) {
          const errorResponse = createErrorResponse(String(result.error), name, {
            sessionId: session.getSessionId(),
            executionTime: Date.now() - startTime,
          });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(errorResponse),
              },
            ],
            isError: true,
            _meta: {
              requestId: extra?.requestId ?? crypto.randomUUID(),
              timestamp: extra?.timestamp ?? Date.now(),
              severity: extra?.severity ?? 'error',
            },
          };
        }

        const successResponse = createSuccessResponse(result.data, name, {
          sessionId: session.getSessionId(),
          executionTime: Date.now() - startTime,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(successResponse),
            },
          ],
          _meta: {
            requestId: extra?.requestId ?? crypto.randomUUID(),
            timestamp: extra?.timestamp ?? Date.now(),
            severity: extra?.severity ?? 'info',
          },
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorResponse = createErrorResponse(errorMessage, name, {
          executionTime: Date.now() - startTime,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(errorResponse),
            },
          ],
          isError: true,
          _meta: {
            requestId: extra?.requestId ?? crypto.randomUUID(),
            timestamp: extra?.timestamp ?? Date.now(),
            severity: extra?.severity ?? 'error',
          },
        };
      }
    },
  );
}

/**
 * Get a session by ID, creating one if it doesn't exist
 *
 * Used to access or create a tool execution session for managing state.
 * Sessions are identified by a unique ID, which can be provided or
 * generated automatically.
 *
 * @param sessionId Session ID to retrieve
 * @returns Tool execution service for the session
 */
export function getSession(sessionId?: string): ToolExecutionService {
  if (sessionId) {
    const existingSession = sessions.get(sessionId);
    if (existingSession) {
      return existingSession;
    }
  }

  const newSessionId = sessionId || crypto.randomUUID();
  const session = new ToolExecutionService(newSessionId);
  sessions.set(newSessionId, session);
  return session;
}

/**
 * Clear a session by ID
 *
 * Removes a session and its associated state from memory.
 * Used for cleanup after a tool interaction is complete.
 *
 * @param sessionId Session ID to clear
 * @returns true if session was found and cleared, false otherwise
 */
export function clearSession(sessionId: string): boolean {
  if (sessions.has(sessionId)) {
    sessions.delete(sessionId);
    return true;
  }
  return false;
}

/**
 * Get all active session IDs
 *
 * Provides a list of all active session IDs, which can be useful
 * for monitoring, debugging or bulk operations.
 *
 * @returns Array of active session IDs
 */
export function getSessionIds(): string[] {
  return Array.from(sessions.keys());
}

const formatResponse = <T>(result: IToolResult<T>): IToolResponse<T> => {
  return {
    data: result.result,
    metadata: {
      tool: 'unknown',
      version: '1.0.0',
      executionTime: 0,
      timestamp: new Date().toISOString(),
    },
    status: {
      success: !result.error,
      code: result.error ? 500 : 200,
      message: result.error,
    },
    context: {
      sessionId: crypto.randomUUID(),
    },
  };
};
