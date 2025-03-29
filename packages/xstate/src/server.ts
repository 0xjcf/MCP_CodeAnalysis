import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XStateAnalyzer } from './analyzer.js';
import { registerToolsWithRegistry } from '../../core/src/registry/index.js';
import { AnalysisOptions } from '@mcp/types';

/**
 * Register XState analysis features with the MCP server
 */
export function registerXStateFeatures(server: McpServer) {
  // Create XState analyzer instance with default options
  const analyzer = new XStateAnalyzer({ sourceCode: '' });

  // Register the analyze-xstate tool using the registry
  registerToolsWithRegistry(
    server,
    (server: McpServer) => {
      server.tool(
        'analyze-xstate',
        {
          sourceCode: z.string().describe('Source code containing XState machine definition'),
          includeMachineDefinition: z
            .boolean()
            .optional()
            .describe('Whether to include the full machine definition in the response'),
        },
        async ({
          sourceCode,
          includeMachineDefinition,
        }: {
          sourceCode: string;
          includeMachineDefinition?: boolean;
        }) => {
          try {
            const options: AnalysisOptions = { sourceCode };
            const result = await analyzer.analyze(options);

            if (!result.success) {
              return {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(
                      {
                        success: false,
                        error: result.error || 'Unknown error',
                      },
                      null,
                      2,
                    ),
                  },
                ],
                isError: true,
              };
            }

            const data = result.data as any;
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      success: true,
                      data: {
                        states: data.states,
                        events: data.events,
                        transitions: data.transitions,
                        ...(includeMachineDefinition
                          ? { machineDefinition: data.machineDefinition }
                          : {}),
                      },
                    },
                    null,
                    2,
                  ),
                },
              ],
            };
          } catch (error) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      success: false,
                      error: error instanceof Error ? error.message : 'Unknown error',
                    },
                    null,
                    2,
                  ),
                },
              ],
              isError: true,
            };
          }
        },
      );
    },
    'xstate',
    false,
  );
}
