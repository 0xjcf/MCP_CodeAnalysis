/**
 * Session Management Feature
 *
 * This feature provides tools for managing sessions in the MCP server.
 * Sessions allow maintaining state between related tool invocations and
 * enable multi-step workflows. The session manager uses XState for state
 * management and provides tools for:
 *
 * - Creating sessions
 * - Retrieving session information
 * - Managing session lifecycle
 * - Viewing execution history
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getSession,
  clearSession,
  getSessionIds,
} from "../../state/helpers/statefulTool.js";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responses.js";

/**
 * Register session management tools with the MCP server
 *
 * @param server MCP server instance to register tools with
 */
export function registerSessionTools(server: McpServer): void {
  // Tool to create a new session
  server.tool(
    "create-session",
    {
      description: z
        .string()
        .optional()
        .describe("Optional description for this session"),
    },
    async ({ description }) => {
      try {
        const session = getSession();
        const sessionId = session.getSessionId();

        const result = createSuccessResponse(
          { sessionId, description, created: new Date().toISOString() },
          "create-session"
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                createErrorResponse(
                  error instanceof Error ? error.message : String(error),
                  "create-session"
                ),
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool to get session information
  server.tool(
    "get-session-info",
    {
      sessionId: z
        .string()
        .describe("ID of the session to retrieve information for"),
    },
    async ({ sessionId }) => {
      try {
        const session = getSession(sessionId);
        const context = session.getContext();

        const result = createSuccessResponse(
          {
            sessionId,
            selectedTool: context.selectedTool,
            lastExecutionTime:
              context.history.length > 0
                ? context.history[context.history.length - 1].timestamp
                : null,
            executionHistory: context.history.length,
            hasError: !!context.error,
          },
          "get-session-info"
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                createErrorResponse(
                  error instanceof Error ? error.message : String(error),
                  "get-session-info"
                ),
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool to get session history
  server.tool(
    "get-session-history",
    {
      sessionId: z
        .string()
        .describe("ID of the session to retrieve history for"),
      limit: z
        .number()
        .default(10)
        .describe("Maximum number of history entries to return"),
    },
    async ({ sessionId, limit }) => {
      try {
        const session = getSession(sessionId);
        const history = session.getHistory();

        // Get the most recent entries up to the limit
        const limitedHistory = history.slice(-limit);

        const result = createSuccessResponse(
          {
            sessionId,
            totalEntries: history.length,
            returnedEntries: limitedHistory.length,
            history: limitedHistory,
          },
          "get-session-history"
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                createErrorResponse(
                  error instanceof Error ? error.message : String(error),
                  "get-session-history"
                ),
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool to clear a session
  server.tool(
    "clear-session",
    {
      sessionId: z.string().describe("ID of the session to clear"),
    },
    async ({ sessionId }) => {
      try {
        const cleared = clearSession(sessionId);

        const result = createSuccessResponse(
          {
            sessionId,
            cleared,
            timestamp: new Date().toISOString(),
          },
          "clear-session"
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                createErrorResponse(
                  error instanceof Error ? error.message : String(error),
                  "clear-session"
                ),
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool to list active sessions
  server.tool("list-sessions", {}, async () => {
    try {
      const sessionIds = getSessionIds();

      const sessionInfo = sessionIds.map((id) => {
        const session = getSession(id);
        const context = session.getContext();

        return {
          sessionId: id,
          toolsUsed: context.history.length,
          lastActivity:
            context.history.length > 0
              ? context.history[context.history.length - 1].timestamp
              : null,
        };
      });

      const result = createSuccessResponse(
        {
          activeSessions: sessionIds.length,
          sessions: sessionInfo,
        },
        "list-sessions"
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              createErrorResponse(
                error instanceof Error ? error.message : String(error),
                "list-sessions"
              ),
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  });
}
