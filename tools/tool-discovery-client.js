#!/usr/bin/env node

import fetch from 'node-fetch';
import { spawn } from 'child_process';

// Default values
const DEFAULT_SERVER = 'http://localhost:3000';

// Parse command line args
const args = process.argv.slice(2);
const serverIndex = args.indexOf('--server');
const serverUrl = serverIndex !== -1 && serverIndex + 1 < args.length 
  ? args[serverIndex + 1] 
  : DEFAULT_SERVER;

// Use HTTP client if specifically requested, otherwise use raw client by default
const useHttpClient = args.includes('--http');

// Check server health
async function checkServerHealth() {
  try {
    console.log(`Connecting to MCP server at ${serverUrl}...`);
    
    const response = await fetch(serverUrl);
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Connected to server: ${data.server} v${data.version}`);
    return data;
  } catch (error) {
    throw new Error(`Server not reachable: ${error.message}`);
  }
}

// Call any tool via JSON-RPC over HTTP
async function callTool(method, params = {}) {
  try {
    // Construct proper JSON-RPC request
    const requestBody = {
      jsonrpc: '2.0',
      id: Date.now().toString(),
      method,
      params
    };
    
    // Log the request for debugging
    console.log(`Sending request to ${serverUrl}/messages:`);
    console.log(JSON.stringify(requestBody, null, 2));
    
    // Make the request to the correct endpoint
    const response = await fetch(`${serverUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Check if the response is OK
    if (!response.ok) {
      console.error(`HTTP error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(`Response body: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
      
      if (response.status === 500 && text.includes('SSE connection not established')) {
        console.error("\nError: The server requires an SSE connection to be established first.");
        console.error("This client currently doesn't support establishing SSE connections.");
        console.error("Remove the --http flag to use the raw client approach instead, which works reliably.");
      }
      
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Log the response for debugging
    console.log('Received response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Check for errors in the response
    if (data.error) {
      throw new Error(`RPC error: ${JSON.stringify(data.error)}`);
    }
    
    // Return the result
    return data.result;
  } catch (error) {
    // Handle JSON parsing errors
    if (error.name === 'SyntaxError') {
      throw new Error(`Invalid JSON response: ${error.message}`);
    }
    throw error;
  }
}

// Get tools via HTTP
async function getTools() {
  try {
    console.log('\nListing available tools via HTTP...');
    
    // Use the correct JSON-RPC method to discover tools
    const result = await callTool('rpc.discover', { method: 'tools.list' });
    
    if (!result || !Array.isArray(result)) {
      throw new Error('Invalid response format for tools list');
    }
    
    return result;
  } catch (error) {
    throw new Error(`Failed to list tools: ${error.message}`);
  }
}

// Use raw client approach
async function getToolsRaw() {
  return new Promise((resolve, reject) => {
    console.log('\nListing available tools via raw client approach...');
    console.log('Starting a new MCP server with STDIO transport...');
    
    // Start a new server instance with STDIO transport
    const env = { ...process.env, STDIO_TRANSPORT: 'true', VERBOSE: 'true' };
    
    // Use a unique port to avoid conflicts with the running server
    env.PORT = (parseInt(process.env.PORT || '3000') + 1).toString();
    
    const serverProcess = spawn('node', ['dist/server.js'], {
      stdio: ['pipe', 'pipe', 'pipe'], // Capture stderr as well
      env
    });
    
    let toolsList = [];
    let stdoutBuffer = '';
    let requestSent = false;
    
    const cleanup = () => {
      try {
        serverProcess.kill();
      } catch (e) {
        // Ignore
      }
    };
    
    // Handle stdout to detect when server is ready
    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      stdoutBuffer += output; // Accumulate output
      console.log(output.trim());
      
      // When the server is ready, send the discovery request
      if (output.includes('MCP server ready to handle stdio requests') && !requestSent) {
        requestSent = true;
        console.log('\n🚀 Discovering server capabilities...');
        const request = {
          jsonrpc: '2.0',
          id: Date.now().toString(),
          method: 'rpc.discover',
          params: { method: 'tools.list' }
        };
        
        console.log('Sending discovery request...');
        serverProcess.stdin.write(JSON.stringify(request) + '\n');
        
        // Set a completion timer - if we don't get a result in 10 seconds, 
        // try to extract what we can from the buffer
        setTimeout(() => {
          // If we haven't already resolved, try to extract tools from the buffer
          extractToolsFromBuffer();
        }, 10000);
      }
    });
    
    // Handle stderr
    serverProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data.toString().trim()}`);
    });
    
    // Try to extract tool information from the collected stdout
    const extractToolsFromBuffer = () => {
      // First try to find any tool registrations in the log output
      const tools = [];
      const toolRegistrations = stdoutBuffer.match(/Registered tool ([a-zA-Z0-9_-]+) from ([a-zA-Z0-9_-]+)/g);
      
      if (toolRegistrations && toolRegistrations.length > 0) {
        // Create a map to avoid duplicates
        const uniqueTools = new Map();
        
        toolRegistrations.forEach(match => {
          try {
            // Extract the tool name and module
            const parts = match.match(/Registered tool ([a-zA-Z0-9_-]+) from ([a-zA-Z0-9_-]+)/);
            if (parts && parts.length >= 3) {
              const toolName = parts[1];
              const moduleName = parts[2];
              
              // Skip temporary probe tools
              if (toolName.includes('_temp_') || toolName.includes('probe')) {
                return;
              }
              
              // Use the tool name as key to avoid duplicates
              uniqueTools.set(toolName, {
                name: toolName,
                description: `${toolName} tool from ${moduleName} module`,
                parameters: {}
              });
            }
          } catch (e) {
            // Ignore parsing errors and continue
          }
        });
        
        // Convert the map to an array
        uniqueTools.forEach(tool => tools.push(tool));
      }
      
      // If we found tools from registrations, use them
      if (tools.length > 0) {
        cleanup();
        resolve(tools);
        return;
      }
      
      // Attempt to find any JSON-RPC response as a fallback
      const jsonMatches = stdoutBuffer.match(/\{"jsonrpc":"2\.0","id":"[^"]+","result":\[.*?\]\}/gs);
      if (jsonMatches && jsonMatches.length > 0) {
        try {
          const data = JSON.parse(jsonMatches[jsonMatches.length - 1]);
          if (data.result && Array.isArray(data.result)) {
            toolsList = data.result;
            cleanup();
            resolve(toolsList);
            return;
          }
        } catch (e) {
          console.error('Error parsing JSON-RPC response:', e);
        }
      }
      
      // If we're still here and have timed out, resolve with whatever we've collected
      if (toolsList.length > 0) {
        cleanup();
        resolve(toolsList);
      } else if (tools.length > 0) {
        cleanup();
        resolve(tools);
      }
      // Otherwise, the timeout handler will reject the promise
    };
    
    // Set a timeout
    const timeout = setTimeout(() => {
      console.log('Operation timed out. Shutting down...');
      
      // Make one last attempt to extract tools
      extractToolsFromBuffer();
      
      // If we still don't have any tools, reject
      if (toolsList.length === 0) {
        cleanup();
        reject(new Error('Timeout waiting for tool discovery'));
      }
    }, 10000);
    
    // Handle process exit
    serverProcess.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0 && code !== null) {
        // Even on failure, try to extract tools before rejecting
        extractToolsFromBuffer();
        
        if (toolsList.length === 0) {
          reject(new Error(`Server process exited with code ${code}`));
        }
      }
    });
  });
}

// Display tools nicely
function displayTools(tools) {
  console.log('\n=== Available Tools ===');
  
  if (Array.isArray(tools) && tools.length > 0) {
    tools.forEach(tool => {
      console.log(`\n- ${tool.name}`);
      console.log(`  Description: ${tool.description || 'No description provided'}`);
      
      if (tool.parameters && Object.keys(tool.parameters).length > 0) {
        console.log('  Parameters:');
        Object.entries(tool.parameters).forEach(([key, param]) => {
          const type = param.type || (param.items ? `array of ${param.items.type}s` : 'any');
          console.log(`    - ${key}: ${param.description || 'No description'} (${type})`);
        });
      } else {
        console.log('  Parameters: None');
      }
    });
    
    console.log(`\nTotal tools available: ${tools.length}`);
  } else {
    console.log('No tools available');
  }
}

// Main function
async function main() {
  try {
    // Check server health
    await checkServerHealth();
    
    // Get and display tools
    let tools;
    if (useHttpClient) {
      // Use HTTP approach (requires pre-established SSE connection)
      try {
        tools = await getTools();
      } catch (error) {
        console.error(`\nError using HTTP client: ${error.message}`);
        console.log('\nFalling back to raw client approach...');
        tools = await getToolsRaw();
      }
    } else {
      // Use raw client approach by default
      tools = await getToolsRaw();
    }
    
    // Display the tools
    displayTools(tools);
    console.log('\nTool discovery completed successfully');
    
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    
    if (useHttpClient) {
      console.log('\nTry removing the --http flag to use the raw client approach instead:');
      console.log('  node tools/tool-discovery-client.js');
    } else {
      console.log('\nMake sure the server is running and accessible.');
    }
    
    process.exit(1);
  }
}

// Run the main function
main(); 