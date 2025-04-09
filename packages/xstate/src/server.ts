/**
 * XState server implementation
 * @module @mcp/xstate
 */

import { getToolRegistry } from '@mcp/registry';
import type { McpServer } from '@mcp/types';
import { z } from 'zod';

import { XStateAnalyzer } from './analyzer.js';

const analysisInputSchema = z.object({
  sourceCode: z.string().min(1),
});

export function registerXStateFeatures(_server: McpServer): void {
  const toolRegistry = getToolRegistry();
  if (!toolRegistry) {
    throw new Error('Tool registry not found');
  }

  const analyzer = new XStateAnalyzer();

  toolRegistry.registerTool(
    'xstate-analyzer',
    { sourceCode: z.string().min(1) },
    async (params, _extra) => {
      try {
        const validatedParams = analysisInputSchema.parse(params);
        const result = await analyzer.analyze(validatedParams);
        return result;
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
    'xstate',
  );
}
