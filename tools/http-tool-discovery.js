#!/usr/bin/env node

/**
 * HTTP Tool Discovery Client
 * 
 * Connects to MCP server and lists available tools via HTTP
 */

import fetch from 'node-fetch';
import { EventSource } from 'eventsource';
import MCPParameterHandler from './lib/parameter-handler.js';

// Define command parameters
const toolDiscoveryCommand = {
  name: 'http-tool-discovery',
  description: 'Discover tools available on an MCP server via HTTP',
  parameters: [
    {
      name: 'server',
      alias: 's',
      description: 'MCP server URL',
      type: 'string',
      default: 'http://localhost:3000'
    },
    {
      name: 'timeout',
      alias: 't',
      description: 'SSE connection timeout in milliseconds',
      type: 'number',
      default: 5000
    },
    {
      name: 'verbose',
      alias: 'v',
      description: 'Enable verbose output',
      type: 'boolean',
      default: false
    },
    {
      name: 'raw',
      alias: 'r',
      description: 'Use raw client approach via stdio',
      type: 'boolean',
      default: false
    },
    {
      name: 'port',
      alias: 'p',
      description: 'Override port in server URL',
      type: 'number'
    },
    {
      name: 'tool',
      alias: 'T',
      description: 'Call a specific tool by name after discovery',
      type: 'string'
    },
    {
      name: 'tool-params',
      alias: 'P',
      description: 'JSON string of parameters to pass to the tool',
      type: 'string',
      default: '{}'
    }
  ]
};

// Parse parameters
const paramHandler = new MCPParameterHandler(toolDiscoveryCommand);

// Check for help flag first
const hasHelpFlag = process.argv.includes('--help') || process.argv.includes('-h');
if (hasHelpFlag) {
  console.log(paramHandler.getHelpText());
  process.exit(0);
}

// Parse actual parameters
const params = paramHandler.parse(process.argv.slice(2));

// Apply port override if specified
let serverUrl = params.server;
if (params.port) {
  // Replace port in URL if it exists, or add it if it doesn't
  const urlObj = new URL(serverUrl);
  urlObj.port = params.port.toString();
  serverUrl = urlObj.toString();
  
  if (params.verbose) {
    console.log(`Using server URL with overridden port: ${serverUrl}`);
  }
}

// Store discovered tools
let tools = [];
let sseSource = null;

/**
 * Check server health and print server info
 */
async function checkServerHealth() {
  try {
    if (params.verbose) {
      console.log(`Connecting to MCP server at ${serverUrl}...`);
    }
    
    const response = await fetch(serverUrl);
    
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType) {
      throw new Error('No content type in response');
    }
    
    // Accept both HTML and JSON responses
    if (!contentType.includes('text/html') && !contentType.includes('application/json')) {
      throw new Error(`Unexpected content type: ${contentType}`);
    }
    
    const text = await response.text();
    
    // Try to parse JSON if that's what we got
    if (contentType.includes('application/json')) {
      try {
        const data = JSON.parse(text);
        if (data.server) {
          console.log(`Connected to ${data.server} ${data.version ? `v${data.version}` : ''}`);
          return true;
        }
      } catch (e) {
        if (params.verbose) {
          console.log('Failed to parse JSON response:', e.message);
        }
      }
    }
    
    // Extract server name and version from HTML response
    const nameMatch = text.match(/<title>(.*?)<\/title>/);
    if (nameMatch && nameMatch[1]) {
      console.log(`Connected to ${nameMatch[1]}`);
      return true;
    }
    
    console.log('Connected to MCP server successfully');
    return true;
  } catch (error) {
    console.error(`Failed to connect to server: ${error.message}`);
    return false;
  }
}

/**
 * Connect to SSE endpoint and setup event handlers
 */
function connectSSE() {
  return new Promise((resolve, reject) => {
    // Create timeout for SSE connection
    const timeout = setTimeout(() => {
      if (sseSource) {
        sseSource.close();
      }
      reject(new Error(`SSE connection timed out after ${params.timeout}ms`));
    }, params.timeout);
    
    try {
      if (params.verbose) {
        console.log('Establishing SSE connection...');
      }
      
      sseSource = new EventSource(`${serverUrl}/mcp`);
      
      sseSource.onopen = () => {
        clearTimeout(timeout);
        if (params.verbose) {
          console.log('SSE connection established');
        }
        resolve(true);
      };
      
      sseSource.onerror = (err) => {
        clearTimeout(timeout);
        sseSource.close();
        reject(new Error(`SSE connection failed: ${err.message || 'Unknown error'}`));
      };
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

/**
 * Call a tool on the MCP server
 */
async function callTool(method, toolParams = {}) {
  try {
    const request = {
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params: toolParams
    };
    
    if (params.verbose) {
      console.log(`Calling ${method} with params:`, JSON.stringify(toolParams, null, 2));
    }
    
    const response = await fetch(`${serverUrl}/mcp/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (params.verbose) {
      console.log('Response:', JSON.stringify(result, null, 2));
    }
    
    if (result.error) {
      throw new Error(`RPC error: ${result.error.message} (${result.error.code})`);
    }
    
    return result.result;
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error('Failed to parse JSON response');
    }
    throw error;
  }
}

/**
 * Get list of available tools
 */
async function getTools() {
  try {
    const result = await callTool('rpc.discover', { method: 'tools.list' });
    
    if (!result || !result.tools || !Array.isArray(result.tools)) {
      throw new Error('Invalid response format - tools list not found');
    }
    
    return result.tools;
  } catch (error) {
    console.error(`Failed to get tools: ${error.message}`);
    return [];
  }
}

/**
 * Display tools in a formatted way
 */
function displayTools(tools) {
  if (!tools || tools.length === 0) {
    console.log('No tools found');
    return;
  }
  
  console.log(`\nFound ${tools.length} available tools:\n`);
  
  tools.forEach((tool, index) => {
    console.log(`${index + 1}. ${tool.name}`);
    if (tool.description) {
      console.log(`   Description: ${tool.description}`);
    }
    if (tool.parameters && Object.keys(tool.parameters).length > 0) {
      console.log('   Parameters:');
      Object.entries(tool.parameters).forEach(([name, param]) => {
        console.log(`     - ${name}${param.required ? ' (required)' : ''}: ${param.description || 'No description'}`);
      });
    }
    console.log('');
  });
}

/**
 * Call a specific tool if requested
 */
async function callSpecificTool() {
  if (!params.tool) {
    return;
  }

  if (tools.length === 0) {
    console.error(`⚠️ Cannot call tool "${params.tool}" - no tools available`);
    return;
  }

  const foundTool = tools.find(t => t.name === params.tool);
  if (!foundTool) {
    console.error(`⚠️ Requested tool "${params.tool}" not found!`);
    console.log('Available tools: ' + tools.map(t => t.name).join(', '));
    return;
  }

  console.log(`\n🔨 Calling tool: ${params.tool}`);
  try {
    const toolParams = params['tool-params'] ? JSON.parse(params['tool-params']) : {};
    const result = await callTool('tools.call', { 
      name: params.tool,
      arguments: toolParams
    });
    
    console.log('\n📊 Tool Result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(`⚠️ Error calling tool: ${error.message}`);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // If using raw approach, execute the raw client directly
    if (params.raw) {
      console.log('Using raw client approach via stdio...');
      // Import dynamically to avoid circular dependencies
      const { spawn } = await import('child_process');
      
      // Pass port to raw client if specified
      const rawArgs = ['tools/tool-discovery-client.js', '--raw'];
      if (params.port) {
        rawArgs.push('--port', params.port.toString());
      }
      
      const rawProc = spawn('node', rawArgs, {
        stdio: 'inherit'
      });
      
      return new Promise((resolve) => {
        rawProc.on('close', (code) => {
          resolve(code);
        });
      });
    }
    
    // Use HTTP approach
    const serverHealthy = await checkServerHealth();
    if (!serverHealthy) {
      throw new Error('Server health check failed');
    }
    
    await connectSSE();
    
    tools = await getTools();
    displayTools(tools);
    
    // Call specific tool if requested
    if (params.tool) {
      await callSpecificTool();
    }
    
    if (sseSource) {
      sseSource.close();
    }
    
    return 0;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    
    if (sseSource) {
      sseSource.close();
    }
    
    if (params.verbose) {
      console.error(error.stack);
    }
    
    if (error.message.includes('SSE connection')) {
      console.log('\nSuggestion: Try using the raw client with --raw flag');
      if (params.port) {
        console.log(`Or check if the server is running on port ${params.port}`);
      }
    }
    
    return 1;
  }
}

// Run the main function
main().then(process.exit).catch((error) => {
  console.error(`Unhandled error: ${error.message}`);
  process.exit(1);
}); 