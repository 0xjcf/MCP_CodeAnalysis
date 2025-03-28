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

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ToolExecutionService } from "../services/toolService.js";

// Map to store sessions by ID
const sessions = new Map<string, ToolExecutionService>();

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
  TParams = Record<string, unknown>,
  TResult = Record<string, unknown>
>(
  server: McpServer,
  name: string,
  schema: z.ZodRawShape,
  handler: (params: TParams) => Promise<TResult>
): void;

/**
 * Create a stateful tool that uses XState for state management
 *
 * Registers a tool with the MCP server using the same signature pattern as McpServer.tool(),
 * but enhances it with session management and state persistence. This allows tools to maintain
 * context across multiple invocations.
 *
 * @param server MCP server instance
 * @param name Tool name
 * @param description Tool description
 * @param schema Zod schema for tool parameters
 * @param handler Function to handle tool execution
 */
export function createStatefulTool<
  TParams = Record<string, unknown>,
  TResult = Record<string, unknown>
>(
  server: McpServer,
  name: string,
  description: string,
  schema: z.ZodRawShape,
  handler: (params: TParams) => Promise<TResult>
): void;

// Implementation that handles both overloads
export function createStatefulTool<
  TParams = Record<string, unknown>,
  TResult = Record<string, unknown>
>(
  server: McpServer,
  name: string,
  descriptionOrSchema: string | z.ZodRawShape,
  handlerOrSchema: ((params: TParams) => Promise<TResult>) | z.ZodRawShape,
  handler?: (params: TParams) => Promise<TResult>
): void {
  // Determine if description was provided
  const hasDescription = typeof descriptionOrSchema === "string";

  // Extract parameters based on which overload was used
  const description = hasDescription
    ? (descriptionOrSchema as string)
    : undefined;
  const schema = hasDescription
    ? (handlerOrSchema as z.ZodRawShape)
    : (descriptionOrSchema as z.ZodRawShape);
  const toolHandler = hasDescription
    ? (handler as (params: TParams) => Promise<TResult>)
    : (handlerOrSchema as (params: TParams) => Promise<TResult>);

  // Add sessionId parameter to the schema
  const enhancedSchema = {
    ...schema,
    sessionId: z
      .string()
      .optional()
      .describe(
        "Session ID for maintaining state between calls. If not provided, a new session will be created."
      ),
  };

  // Create the tool callback that handles state management
  const toolCallback = async (args: any, extra: any) => {
    try {
      // Extract sessionId from params (or create new session)
      const { sessionId, ...toolParams } = args;

      // Get or create session
      let session: ToolExecutionService;
      const sessionIdStr = sessionId as string | undefined;

      if (sessionIdStr && sessions.has(sessionIdStr)) {
        session = sessions.get(sessionIdStr)!;
      } else {
        const newSessionId = sessionIdStr || crypto.randomUUID();
        session = new ToolExecutionService(newSessionId);
        sessions.set(newSessionId, session);
      }

      // Select the tool and set parameters
      session.selectTool(name);
      session.setParameters(toolParams);

      // Execute the tool
      const result = await session.execute(async (p) => {
        return toolHandler(p as TParams);
      });

      // Add session ID to the response context
      if (result.context) {
        result.context.sessionId = session.getSessionId();
      } else {
        result.context = { sessionId: session.getSessionId() };
      }

      // Return MCP-formatted response with properly typed content
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      // Return MCP-formatted error response
      return {
        content: [
          {
            type: "text" as const,
            text:
              error instanceof Error
                ? error.message.replace(/^Error:\s*/, "")
                : `Error executing ${name}: ${String(error)}`,
          },
        ],
        isError: true,
      };
    }
  };

  // Register the tool with the server using the appropriate overload
  if (hasDescription && description) {
    server.tool(name, description, enhancedSchema, toolCallback);
  } else {
    server.tool(name, enhancedSchema, toolCallback);
  }
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
  if (sessionId && sessions.has(sessionId)) {
    return sessions.get(sessionId)!;
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
