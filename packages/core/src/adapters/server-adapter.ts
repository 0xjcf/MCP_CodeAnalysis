import type { McpServer, RequestHandlerExtra } from '@mcp/types';
import type { McpServer as SdkMcpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ZodType } from 'zod';

/**
 * Adapts the SDK McpServer to our local McpServer interface
 */
export function adaptServer(sdkServer: SdkMcpServer): McpServer {
  return {
    tool(
      id: string,
      schema: Record<string, ZodType>,
      handler: (args: Record<string, unknown>, extra: RequestHandlerExtra) => Promise<unknown>,
    ): McpServer {
      // Adapt the handler to match SDK's expected format
      const adaptedHandler = async (sdkExtra: any) => {
        // Convert SDK extra to our RequestHandlerExtra format
        const extra: RequestHandlerExtra = {
          requestId: sdkExtra.requestId || '',
          timestamp: sdkExtra.timestamp || Date.now(),
          metadata: sdkExtra.metadata,
          severity: sdkExtra.severity || 'info',
          context: sdkExtra.context,
        };

        const validatedArgs = Object.fromEntries(
          Object.entries(sdkExtra)
            .filter(([key]) => schema[key])
            .map(([key, value]) => [key, schema[key].parse(value)]),
        );

        const result = await handler(validatedArgs, extra);

        // Convert result to SDK format
        return {
          content: [{ type: 'text', text: JSON.stringify(result) }],
          _meta: { timestamp: Date.now() },
        };
      };

      // Register tool with SDK server
      sdkServer.tool(id, adaptedHandler);

      return this;
    },
  };
}
