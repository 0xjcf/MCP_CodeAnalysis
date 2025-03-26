#!/usr/bin/env node

/**
 * Test script for MCP Parameter Handler
 * 
 * Demonstrates the parameter handling utility with various parameter types and validations.
 * 
 * Usage examples:
 *   node tools/test-parameter-handler.js
 *   node tools/test-parameter-handler.js --server http://localhost:8080
 *   node tools/test-parameter-handler.js -p ./src -v
 *   node tools/test-parameter-handler.js --help
 */

import MCPParameterHandler from './lib/parameter-handler.js';

// Define command with parameters
const testCommand = {
  name: 'test-parameters',
  description: 'Test the parameter handling functionality',
  parameters: [
    {
      name: 'server',
      alias: 's',
      description: 'Server URL to connect to',
      type: 'string',
      default: 'http://localhost:3000'
    },
    {
      name: 'path',
      alias: 'p',
      description: 'Path to analyze',
      type: 'string',
      required: true,
      validator: (value) => {
        if (!value.startsWith('./') && !value.startsWith('/')) {
          return 'Path must start with ./ or /';
        }
        return true;
      }
    },
    {
      name: 'verbose',
      alias: 'v',
      description: 'Enable verbose output',
      type: 'boolean',
      default: false
    },
    {
      name: 'level',
      alias: 'l',
      description: 'Analysis level',
      type: 'number',
      default: 1,
      choices: [1, 2, 3]
    },
    {
      name: 'tags',
      alias: 't',
      description: 'Tags to include (comma-separated)',
      type: 'array'
    }
  ]
};

// Create parameter handler
const paramHandler = new MCPParameterHandler(testCommand);

// Main function
async function main() {
  try {
    // Parse command line arguments
    const params = paramHandler.parse(process.argv.slice(2));
    
    // Display the parsed parameters
    console.log('\n🧪 Parameter Test Results:');
    console.log('=========================');
    
    Object.entries(params).forEach(([key, value]) => {
      if (key === 'help') return; // Skip help flag
      
      const param = testCommand.parameters.find(p => p.name === key);
      const valueType = Array.isArray(value) ? 'array' : typeof value;
      const isDefault = param && param.default === value ? ' (default)' : '';
      
      console.log(`${key}: ${value}${isDefault} (${valueType})`);
    });
    
    console.log('\n✅ All parameters validated successfully!');
    
    // Example of using the parameters
    console.log('\n📋 Example Action:');
    console.log(`Connecting to ${params.server}...`);
    console.log(`Analyzing path: ${params.path}`);
    console.log(`Analysis level: ${params.level}`);
    
    if (params.tags && params.tags.length > 0) {
      console.log(`Including tags: ${params.tags.join(', ')}`);
    }
    
    if (params.verbose) {
      console.log('Verbose mode enabled - showing detailed output');
    }
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error(`Unhandled error: ${error.message}`);
  process.exit(1);
}); 