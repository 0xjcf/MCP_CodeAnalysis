#!/usr/bin/env node

import { spawn } from 'child_process';
import readline from 'readline';
import MCPParameterHandler from './lib/parameter-handler.js';

// Define command with parameters
const simpleClientCommand = {
  name: 'simple-client',
  description: 'A simple MCP client for testing server communication',
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
    }
  ]
};

// Parse parameters
const paramHandler = new MCPParameterHandler(simpleClientCommand);
const params = paramHandler.parse(process.argv.slice(2));

// Log startup info in verbose mode
if (params.verbose) {
  console.log('Starting MCP Simple Client');
  console.log(`Server script: ${params.server}`);
  console.log(`Timeout: ${params.timeout}ms`);
}

// Spawn the server process
const serverProcess = spawn("node", [params.server], {
  stdio: ["pipe", "pipe", "pipe"],
});

// Create readline interface for reading server output
const rl = readline.createInterface({
  input: serverProcess.stdout,
  terminal: false,
});

// Set up error handling
serverProcess.stderr.on("data", (data) => {
  console.error(`Server error: ${data.toString()}`);
});

// Handle server process exit
serverProcess.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Initialize message ID counter
let messageId = 1;

// Function to send a request to the server
function sendRequest(method, params = {}) {
  const request = {
    jsonrpc: "2.0",
    id: messageId++,
    method,
    params,
  };
  
  const requestStr = JSON.stringify(request) + "\n";
  serverProcess.stdin.write(requestStr);
  
  if (params.verbose) {
    console.log("Sent request:", requestStr);
  }
}

// Helper function to check if a line is likely JSON
function isLikelyJson(line) {
  const trimmed = line.trim();
  return (trimmed.startsWith('{') && trimmed.endsWith('}')) || 
         (trimmed.startsWith('[') && trimmed.endsWith(']'));
}

// Parse and handle server responses
rl.on("line", (line) => {
  // Skip empty lines
  if (!line.trim()) return;
  
  // Check if this looks like JSON before trying to parse it
  if (isLikelyJson(line)) {
    try {
      const response = JSON.parse(line);
      
      if (params.verbose) {
        console.log("Received response:", JSON.stringify(response, null, 2));
      } else {
        console.log(`Response [${response.id}]: ${response.result ? 'Success' : 'Error'}`);
      }
      
      // If this is the server initialization response, list available tools
      if (response.result && response.result.implementation) {
        console.log("✅ Server initialized successfully!");
        console.log(`Server: ${response.result.implementation.name} v${response.result.implementation.version}`);
        console.log("Listing tools...");
        sendRequest("rpc.discover", { method: "tools.list" });
      }
      
      // If we received the list of tools, try calling the first tool
      if (response.result && response.result.tools && response.result.tools.length > 0) {
        console.log(`Found ${response.result.tools.length} tools:`);
        
        // Display the tools
        response.result.tools.forEach((tool, index) => {
          console.log(`  ${index + 1}. ${tool.name}${tool.description ? ` - ${tool.description}` : ''}`);
        });
        
        // Call the first tool as a test
        const firstTool = response.result.tools[0];
        console.log(`\nCalling tool: ${firstTool.name}`);
        sendRequest("tools.call", { 
          name: firstTool.name,
          arguments: {},
        });
      }
    } catch (error) {
      // Even though it looked like JSON, parsing failed
      if (params.verbose) {
        console.log(`Server log: ${line}`);
      }
    }
  } else {
    // This is not JSON, treat as regular server output
    console.log(`Server: ${line}`);
  }
});

// Send initial request to get server info
console.log("Connecting to server...");
sendRequest("rpc.discover");

// Handle process termination
process.on("SIGINT", () => {
  console.log("Terminating server...");
  serverProcess.kill();
  process.exit(0);
}); 