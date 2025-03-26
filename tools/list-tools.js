#!/usr/bin/env node

import fetch from 'node-fetch';

// Default server URL
const SERVER_URL = 'http://localhost:3000';

// Helper function to make JSON-RPC requests
async function jsonRpcRequest(method, params = {}) {
  try {
    const response = await fetch(`${SERVER_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'list_tools',
        params: {},
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`JSON-RPC error: ${data.error.message}`);
    }
    
    return data.result;
  } catch (error) {
    throw new Error(`Failed to connect to MCP server: ${error.message}`);
  }
}

// Main function
async function main() {
  try {
    console.log(`Connecting to MCP server at ${SERVER_URL}...`);
    
    // First check if server is running with a basic health check
    try {
      const response = await fetch(SERVER_URL);
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      console.log(`Connected to server: ${data.server} v${data.version}`);
    } catch (error) {
      throw new Error(`Server not reachable: ${error.message}`);
    }
    
    // List all available tools
    try {
      console.log('Requesting tool list...');
      const result = await jsonRpcRequest('list_tools');
      
      console.log('\nAvailable tools:');
      console.log('-----------------');
      
      if (result.tools && result.tools.length > 0) {
        result.tools.forEach(tool => {
          console.log(`• ${tool.name}`);
          console.log(`  ${tool.description || 'No description provided'}`);
          console.log();
        });
      } else {
        console.log('No tools found!');
      }
      
    } catch (error) {
      throw new Error(`Failed to list tools: ${error.message}`);
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.error('Make sure the server is running with HTTP transport enabled on port 3000');
    process.exit(1);
  }
}

main(); 