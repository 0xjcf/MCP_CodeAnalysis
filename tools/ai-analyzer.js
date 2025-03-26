#!/usr/bin/env node

/**
 * AI Analyzer Client
 * 
 * Start MCP server and run analysis for AI context generation
 */

import http from 'http';
import { execSync } from 'child_process';
import { spawn } from 'child_process';
import MCPParameterHandler from './lib/parameter-handler.js';

// Define command parameters
const aiAnalyzerCommand = {
  name: 'ai-analyzer',
  description: 'Start MCP server and run analysis for AI context generation',
  parameters: [
    {
      name: 'task',
      alias: 't',
      description: 'Task to run (required)',
      type: 'string',
      required: true
    },
    {
      name: 'files',
      alias: 'f',
      description: 'Files pattern to analyze (e.g., "**/*.js")',
      type: 'string'
    },
    {
      name: 'search',
      alias: 's',
      description: 'Search term to find in files',
      type: 'string'
    },
    {
      name: 'output',
      alias: 'o',
      description: 'Output file path',
      type: 'string',
      default: 'ai-context.json'
    },
    {
      name: 'server',
      alias: 'S',
      description: 'MCP server URL',
      type: 'string',
      default: 'http://localhost:3000'
    },
    {
      name: 'port',
      alias: 'p',
      description: 'Override port in server URL',
      type: 'number',
      default: 3000
    },
    {
      name: 'keep-server',
      alias: 'k',
      description: 'Keep the server running after analysis',
      type: 'boolean',
      default: false
    },
    {
      name: 'verbose',
      alias: 'v',
      description: 'Enable verbose output',
      type: 'boolean',
      default: false
    }
  ]
};

// Parse parameters
const paramHandler = new MCPParameterHandler(aiAnalyzerCommand);

// Check for help flag first
const hasHelpFlag = process.argv.includes('--help') || process.argv.includes('-h');
if (hasHelpFlag) {
  console.log(paramHandler.getHelpText());
  process.exit(0);
}

// Parse actual parameters
const params = paramHandler.parse(process.argv.slice(2));

// Server process reference
let serverProcess = null;

/**
 * Check if MCP server is running
 * @returns {Promise<boolean>} True if server is running
 */
async function checkServer() {
  return new Promise((resolve) => {
    const serverUrl = new URL(params.server);
    
    // Override port if specified
    if (params.port) {
      serverUrl.port = params.port.toString();
    }
    
    if (params.verbose) {
      console.log(`Checking if server is running at ${serverUrl.toString()}`);
    }
    
    const req = http.get(serverUrl.toString(), (res) => {
      if (res.statusCode === 200) {
        if (params.verbose) {
          console.log('Server is already running');
        }
        resolve(true);
      } else {
        resolve(false);
      }
      res.resume();
    });
    
    req.on('error', () => {
      if (params.verbose) {
        console.log('Server is not running');
      }
      resolve(false);
    });
    
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Start MCP server
 * @returns {Promise<boolean>} True if server started successfully
 */
async function startServer() {
  return new Promise((resolve) => {
    console.log('Starting MCP server...');
    
    const startArgs = ['start'];
    if (params.verbose) {
      startArgs.push('--verbose');
    }
    
    serverProcess = spawn('npm', startArgs, {
      stdio: params.verbose ? 'inherit' : 'ignore',
      detached: false
    });
    
    // Give the server some time to start
    setTimeout(() => {
      checkServer().then(resolve);
    }, 2000);
  });
}

/**
 * Stop MCP server if it was started by this script
 */
function stopServer() {
  if (serverProcess && !params['keep-server']) {
    console.log('Stopping MCP server...');
    // Kill process and all child processes
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${serverProcess.pid} /T /F`);
    } else {
      process.kill(-serverProcess.pid);
    }
    serverProcess = null;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Validate required parameters
    if (!params.task) {
      console.error('Error: --task parameter is required');
      console.log(paramHandler.getHelpText());
      return 1;
    }
    
    // Check if server is running
    const serverRunning = await checkServer();
    
    // Start server if needed
    let serverStartedByUs = false;
    if (!serverRunning) {
      serverStartedByUs = await startServer();
      if (!serverStartedByUs) {
        console.error('Error: Failed to start MCP server');
        return 1;
      }
    }
    
    // Construct command to run the analysis
    let analysisCommand = `node tools/http-client.js --task "${params.task}" --server "${params.server}"`;
    
    if (params.port) {
      analysisCommand += ` --port ${params.port}`;
    }
    
    if (params.files) {
      analysisCommand += ` --files "${params.files}"`;
    }
    
    if (params.search) {
      analysisCommand += ` --search "${params.search}"`;
    }
    
    if (params.output) {
      analysisCommand += ` --output "${params.output}"`;
    }
    
    if (params.verbose) {
      analysisCommand += ' --verbose';
      console.log(`Running analysis command: ${analysisCommand}`);
    }
    
    // Run the analysis
    console.log(`Running analysis for task: ${params.task}`);
    try {
      execSync(analysisCommand, { stdio: 'inherit' });
      console.log(`✅ Analysis complete. Results saved to ${params.output}`);
    } catch (error) {
      console.error(`❌ Analysis failed: ${error.message}`);
      if (params.verbose) {
        console.error(error);
      }
      return 1;
    }
    
    return 0;
  } catch (error) {
    console.error(`Unhandled error: ${error.message}`);
    if (params.verbose) {
      console.error(error.stack);
    }
    return 1;
  } finally {
    // Stop server if we started it and keep-server is not set
    stopServer();
  }
}

// Handle process exit
process.on('exit', stopServer);
process.on('SIGINT', () => {
  stopServer();
  process.exit(0);
});

// Run the main function
main().then((code) => {
  process.exit(code);
}).catch((error) => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
}); 