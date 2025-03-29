/**
 * @file mcp-analysis.ts
 * @description Example of using the centralized MCP server from @mcp/core to analyze task manager code
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import path from 'path';

// Import the task manager machine for analysis
import { taskManagerMachine } from './taskManagerMachine.js';

/**
 * Example of using the centralized MCP server to analyze task manager code
 * This demonstrates how to:
 * 1. Connect to the centralized MCP server
 * 2. Use the registered analyzers
 * 3. Analyze task manager code
 */
async function analyzeTaskManager() {
  try {
    // Create stdio transport for client with server configuration
    const transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/server.js'],
      env: {
        ...process.env,
        STDIO_TRANSPORT: 'true',
        FORCE_MEMORY_SESSION: 'true',
      },
    });

    // Create MCP client with required capabilities
    const client = new Client(
      {
        name: 'task-manager-analysis',
        version: '1.0.0',
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {},
        },
      },
    );

    // Connect to the server
    await client.connect(transport);

    // Get the task manager source code
    const taskManagerPath = path.resolve(process.cwd(), 'taskManagerMachine.ts');
    const sourceCode = readFileSync(taskManagerPath, 'utf-8');

    // Use the XState analyzer to analyze the task manager
    const xstateAnalysis = await client.callTool({
      name: 'analyze-xstate',
      arguments: {
        sourceCode,
        includeMachineDefinition: true,
      },
    });

    console.log('XState Analysis Results:', xstateAnalysis);

    // Use the Web Components analyzer if there are any web components
    const webComponentsAnalysis = await client.callTool({
      name: 'analyze-web-components',
      arguments: {
        sourceCode,
      },
    });

    console.log('Web Components Analysis Results:', webComponentsAnalysis);

    // Get code metrics
    const metricsAnalysis = await client.callTool({
      name: 'analyze-metrics',
      arguments: {
        sourceCode,
        includeFiles: true,
        includeFunctions: true,
      },
    });

    console.log('Code Metrics:', metricsAnalysis);

    // Close the connection
    await client.close();
  } catch (error) {
    console.error('Error during analysis:', error);
  }
}

// Run the analysis
analyzeTaskManager().catch(console.error);
