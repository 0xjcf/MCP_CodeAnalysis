#!/usr/bin/env node

import { spawn } from 'child_process';
import readline from 'readline';
import path from 'path';
import fs from 'fs';
import MCPParameterHandler from './lib/parameter-handler.js';

// Define command with parameters
const rawClientCommand = {
  name: 'mcp-raw-client',
  description: 'Raw MCP client for direct communication with the server',
  parameters: [
    {
      name: 'server',
      alias: 's',
      description: 'Path to the server script',
      type: 'string',
      default: 'dist/server.js'
    },
    {
      name: 'verbose',
      alias: 'v',
      description: 'Enable verbose output',
      type: 'boolean',
      default: false
    },
    {
      name: 'timeout',
      alias: 't',
      description: 'Timeout for server initialization in milliseconds',
      type: 'number',
      default: 2000
    },
    {
      name: 'config',
      alias: 'c',
      description: 'Path to config file',
      type: 'string'
    },
    {
      name: 'tool',
      alias: 'T',
      description: 'Call a specific tool by name after discovery',
      type: 'string'
    },
    {
      name: 'tool-params',
      alias: 'p',
      description: 'JSON string of parameters to pass to the tool',
      type: 'string',
      default: '{}'
    },
    {
      name: 'port',
      alias: 'P',
      description: 'Port for the server to listen on',
      type: 'number'
    }
  ]
};

// Parse parameters
const paramHandler = new MCPParameterHandler(rawClientCommand);

// Check for help flag first
const hasHelpFlag = process.argv.includes('--help') || process.argv.includes('-h');
if (hasHelpFlag) {
  console.log(paramHandler.getHelpText());
  process.exit(0);
}

// Parse actual parameters
const params = paramHandler.parse(process.argv.slice(2));

// Load config if specified
let configParams = {};
if (params.config) {
  try {
    if (fs.existsSync(params.config)) {
      const configData = fs.readFileSync(params.config, 'utf8');
      configParams = JSON.parse(configData);
      if (params.verbose) {
        console.log(`Loaded configuration from ${params.config}`);
        console.log(JSON.stringify(configParams, null, 2));
      }
    } else {
      console.error(`Error: Config file not found: ${params.config}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error loading config file: ${error.message}`);
    process.exit(1);
  }
}

// Log startup info in verbose mode
if (params.verbose) {
  console.log('Starting MCP Raw Client');
  console.log(`Server script: ${params.server}`);
  console.log(`Timeout: ${params.timeout}ms`);
  if (params.tool) {
    console.log(`Will call tool: ${params.tool}`);
    console.log(`Tool parameters: ${params['tool-params']}`);
  }
  if (params.port) {
    console.log(`Server port: ${params.port}`);
  }
} else {
  console.log(`Starting MCP client - connecting to ${params.server}`);
}

// Prepare environment variables for the server process
const env = { ...process.env };
if (params.port) {
  env.PORT = params.port.toString();
}

// Spawn the server process
const serverProcess = spawn('node', [params.server], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env
});

// Create readline interface for reading server output
const rl = readline.createInterface({
  input: serverProcess.stdout,
  terminal: false
});

// Handle server errors
serverProcess.stderr.on('data', (data) => {
  console.error(`⚠️ Server Error: ${data.toString().trim()}`);
});

// Track if we're receiving JSON or debug output
let inJsonMode = false;
let jsonBuffer = '';
let tools = [];

// Handle server output
rl.on('line', (line) => {
  const trimmedLine = line.trim();
  
  // Skip empty lines
  if (!trimmedLine) return;
  
  // Check if this looks like JSON
  if (trimmedLine.startsWith('{') || trimmedLine.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmedLine);
      if (params.verbose) {
        console.log('\n🔄 MCP Message:');
        console.log(JSON.stringify(parsed, null, 2));
      } else {
        const msgType = parsed.method ? 
          `Request [${parsed.method}]` : 
          (parsed.result ? 'Response' : 'Notification');
        console.log(`🔄 Message [${parsed.id || 'no-id'}]: ${msgType}`);
      }
      
      // If this is a successful response with implementation info, the server is ready
      if (parsed.result && parsed.result.implementation) {
        console.log('\n✅ MCP Server initialized successfully!');
        console.log(`   Name: ${parsed.result.implementation.name}`);
        console.log(`   Version: ${parsed.result.implementation.version}`);
        
        // Now let's discover available tools
        sendJsonRpc('rpc.discover', { method: 'tools.list' });
      }
      
      // If we get tools back, store them and show them
      if (parsed.result && parsed.result.tools) {
        tools = parsed.result.tools;
        console.log('\n🧰 Available Tools:');
        tools.forEach((tool, index) => {
          console.log(`   ${index + 1}. ${tool.name}${tool.description ? `: ${tool.description}` : ''}`);
        });
        
        // If a specific tool was requested, call it
        if (params.tool) {
          const foundTool = tools.find(t => t.name === params.tool);
          if (foundTool) {
            console.log(`\n🔨 Calling tool: ${params.tool}`);
            try {
              const toolParams = params['tool-params'] ? JSON.parse(params['tool-params']) : {};
              sendJsonRpc('tools.call', { 
                name: params.tool,
                arguments: { ...toolParams, ...configParams }
              });
            } catch (error) {
              console.error(`⚠️ Error parsing tool parameters: ${error.message}`);
            }
          } else {
            console.error(`⚠️ Requested tool "${params.tool}" not found!`);
            console.log('Available tools: ' + tools.map(t => t.name).join(', '));
          }
        }
      }
    } catch (error) {
      // Not valid JSON, treat as debug output
      console.log(`🔍 Server: ${line}`);
    }
  } else {
    // Regular output
    console.log(`🔍 Server: ${line}`);
  }
});

// Send a JSON-RPC request to the server
function sendJsonRpc(method, params = {}) {
  const request = {
    jsonrpc: '2.0',
    id: Date.now(),
    method,
    params
  };
  
  const requestStr = JSON.stringify(request) + '\n';
  if (params.verbose) {
    console.log('\n📤 Sending request:');
    console.log(JSON.stringify(request, null, 2));
  }
  
  try {
    serverProcess.stdin.write(requestStr);
  } catch (error) {
    console.error(`⚠️ Error sending request: ${error.message}`);
  }
}

// Handle process exit
serverProcess.on('close', (code) => {
  console.log(`\n👋 Server process exited with code ${code}`);
  process.exit(0);
});

// Handle server process errors
serverProcess.on('error', (error) => {
  console.error(`⚠️ Server process error: ${error.message}`);
  process.exit(1);
});

// Initial discovery request
setTimeout(() => {
  console.log('\n🚀 Discovering server capabilities...');
  sendJsonRpc('rpc.discover');
}, params.timeout);

// Handle ctrl+c to exit gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  serverProcess.kill();
  process.exit(0);
}); 