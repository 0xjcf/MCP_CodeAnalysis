/**
 * MCP Server Main Entry Point
 *
 * This is the main entry point for the MCP server. It uses the startServer
 * function to create and connect an MCP server with auto-detected backends.
 *
 * Environment variables:
 * - PORT: HTTP port for the server (default: 3000)
 * - STDIO_TRANSPORT: Use stdio transport instead of HTTP (set to "true")
 * - REDIS_URL: Redis connection URL (default: redis://localhost:6379)
 * - FORCE_MEMORY_SESSION: Force in-memory session storage (set to "true")
 * - VERBOSE: Show verbose logs (set to "true")
 */

import { server, start } from './server.js';

// Register analyzers and tools
import { registerAnalysisTools } from './features/basic-analysis/index.js';
import { registerCodeMetricsTools } from './features/code-metrics/index.js';
import { registerDependencyAnalysisTools } from './features/dependency-analysis/index.js';
import { registerIdeTools } from './features/basic-analysis/ide-analyzer.js';
import { registerCodeQualityTools } from './features/code-quality/index.js';
import { registerKnowledgeGraphFeatures } from './features/knowledge-graph/index.js';
import { registerVisualizationFeatures } from './features/visualization/index.js';
import { registerMemoryFeatures } from './features/memory/index.js';
import { registerSocioTechnicalFeatures } from './features/socio-technical/index.js';
import { registerMultiRepoFeatures } from './features/multi-repo/index.js';
import { registerEvolutionFeatures } from './features/evolution/index.js';
import { registerSessionTools } from './features/session-manager/index.js';
import { registerDevTools } from './features/dev-tools/index.js';
import { registerXStateFeatures } from '@mcp/xstate';
import { getToolRegistry } from './registry/index.js';
import { XStateAnalyzer } from '@mcp/xstate';
import { z } from 'zod';

// Register all tools
registerAnalysisTools(server);
registerCodeMetricsTools(server);
registerDependencyAnalysisTools(server);
registerIdeTools(server);
registerCodeQualityTools(server);
registerXStateFeatures(server);
registerKnowledgeGraphFeatures(server);
registerVisualizationFeatures(server);
registerMemoryFeatures(server);
registerSocioTechnicalFeatures(server);
registerMultiRepoFeatures(server);
registerEvolutionFeatures(server);
registerSessionTools(server);
registerDevTools(server);

// Register XState analyzer with enhanced features
const registry = getToolRegistry();
registry.registerWithServer(
  server,
  'analyze-xstate',
  {
    sourceCode: z.string().describe('Source code containing XState machine definition'),
    options: z
      .object({
        strict: z.boolean().optional().describe('Enable strict mode for analysis'),
        verbose: z.boolean().optional().describe('Enable verbose output'),
        timeout: z.number().optional().describe('Analysis timeout in milliseconds'),
      })
      .optional(),
  },
  async ({ sourceCode, options }) => {
    const analyzer = new XStateAnalyzer(options || {});
    return analyzer.analyze(sourceCode);
  },
  'xstate-analyzer',
  {
    description: 'Analyzes XState state machines for complexity and structure',
    category: 'code-analysis',
    timeout: 30000, // 30 second timeout
    rateLimit: {
      maxRequests: 10,
      windowMs: 60000, // 1 minute window
    },
  },
);

// Parse environment variables
const options = {
  useStdio: process.env.STDIO_TRANSPORT === 'true',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  redisUrl: process.env.REDIS_URL,
  forceMemorySessionStore: process.env.FORCE_MEMORY_SESSION === 'true',
  verbose: process.env.VERBOSE === 'true',
};

console.log('Starting MCP server with options:', {
  ...options,
  // Hide sensitive information from logs
  redisUrl: options.redisUrl ? '[CONFIGURED]' : undefined,
});

// Start the server
start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
