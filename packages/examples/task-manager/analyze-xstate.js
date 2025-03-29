#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import {
  getClient,
  callTool,
  closeClient,
} from '@modelcontextprotocol/sdk/client/cli/utils/mcp-client.js';
import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';

/**
 * Analyzes an XState machine definition file using the MCP analysis tools
 * @param {string} filePath - Path to the XState machine file
 * @param {Object} options - Command line options
 * @returns {Promise<void>}
 */
async function analyzeXState(filePath, options) {
  const spinner = ora('Analyzing XState machine...').start();

  try {
    // Read the source code
    const fullPath = path.resolve(process.cwd(), filePath);
    const sourceCode = fs.readFileSync(fullPath, 'utf8');

    // Connect to MCP server
    const client = await getClient(options.serverPath, options.debug);

    // Call the analyze-xstate tool
    const result = await callTool(
      'analyze-xstate',
      {
        sourceCode,
        includeComplexity: options.complexity,
        includeVisualization: options.visualize,
      },
      options.debug,
    );

    spinner.succeed('Analysis complete');

    // Format and display results
    console.log('\nAnalysis Results:');
    console.log(chalk.blue('\nStates:'));
    console.log(result.states);

    console.log(chalk.blue('\nTransitions:'));
    console.log(result.transitions);

    if (result.warnings?.length > 0) {
      console.log(chalk.yellow('\nWarnings:'));
      result.warnings.forEach(warning => {
        console.log(`- ${warning}`);
      });
    }

    if (result.recommendations?.length > 0) {
      console.log(chalk.green('\nRecommendations:'));
      result.recommendations.forEach(rec => {
        console.log(`- ${rec}`);
      });
    }
  } catch (error) {
    spinner.fail(`Analysis failed: ${error.message}`);
    process.exit(1);
  } finally {
    await closeClient();
  }
}

async function analyzeXStateMachine() {
  // Create MCP client
  const client = new McpClient({
    serverUrl: 'http://localhost:3000',
    verbose: true,
  });

  try {
    // Read the XState machine file
    const machinePath = path.join(process.cwd(), 'taskManagerMachine.js');
    const sourceCode = fs.readFileSync(machinePath, 'utf-8');

    // Analyze the XState machine
    const result = await client.invoke('analyze-xstate', {
      sourceCode,
      options: {
        strict: true,
        verbose: true,
        timeout: 10000, // 10 second timeout
      },
    });

    // Print the analysis results
    console.log('XState Machine Analysis Results:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error analyzing XState machine:', error);
  } finally {
    // Clean up client
    await client.disconnect();
  }
}

// Create CLI program
const program = new Command()
  .name('analyze-xstate')
  .description('Analyze XState machine definitions')
  .version('1.0.0');

// Add command
program
  .argument('<file-path>', 'Path to the XState machine file')
  .option('-s, --server-path <path>', 'Path to MCP server executable', './dist/server.js')
  .option('--debug', 'Enable debug logging', false)
  .option('--complexity', 'Include complexity analysis', true)
  .option('--visualize', 'Generate visualization', false)
  .action(analyzeXState);

// Parse arguments
program.parse(process.argv);

// Run the analysis
analyzeXStateMachine().catch(console.error);
