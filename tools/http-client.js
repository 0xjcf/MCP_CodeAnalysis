#!/usr/bin/env node

/**
 * HTTP Client for AI Context Generation
 * 
 * Connects to MCP server and generates AI context data
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';
import MCPParameterHandler from './lib/parameter-handler.js';

// Define command parameters
const httpClientCommand = {
  name: 'http-client',
  description: 'Connect to MCP server and generate AI context data',
  parameters: [
    {
      name: 'task',
      alias: 't',
      description: 'Task to analyze (required)',
      type: 'string',
      required: true
    },
    {
      name: 'files',
      alias: 'f',
      description: 'Files pattern to analyze (e.g., "**/*.js")',
      type: 'string',
      default: '*'
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
      type: 'number'
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
const paramHandler = new MCPParameterHandler(httpClientCommand);

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
  const urlObj = new URL(serverUrl);
  urlObj.port = params.port.toString();
  serverUrl = urlObj.toString();
  
  if (params.verbose) {
    console.log(`Using server URL with overridden port: ${serverUrl}`);
  }
}

// Main function
async function main() {
  try {
    console.log(`Task: ${params.task}`);
    console.log(`Connecting to MCP server at ${serverUrl}...`);
    
    // First check if server is running with a basic health check
    try {
      const response = await fetch(serverUrl);
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const text = await response.text();
      
      // Try to parse as JSON if possible
      let serverInfo = { server: "MCP Server", version: "Unknown" };
      try {
        serverInfo = JSON.parse(text);
      } catch (e) {
        // Extract from HTML if JSON parsing fails
        const nameMatch = text.match(/<title>(.*?)<\/title>/);
        if (nameMatch && nameMatch[1]) {
          serverInfo.server = nameMatch[1];
        }
      }
      
      console.log(`Connected to server: ${serverInfo.server} ${serverInfo.version ? `v${serverInfo.version}` : ''}`);
    } catch (error) {
      throw new Error(`Server not reachable: ${error.message}`);
    }
    
    // Collect available data for the context
    try {
      console.log('Preparing context data...');
      
      // Find matching files directly
      const matchingFiles = await glob(params.files);
      const fileContents = {};
      const searchResults = { matches: [] };
      
      if (params.verbose) {
        console.log(`Found ${matchingFiles.length} files matching pattern: ${params.files}`);
      }
      
      // If search term is provided, use grep
      if (params.search) {
        console.log(`Searching for "${params.search}" in ${params.files}...`);
        try {
          // Use grep to search for the term
          const grepCmd = `grep -n -r "${params.search}" ${params.files} --include="*.ts" --include="*.js" --color=never | head -n 50`;
          
          if (params.verbose) {
            console.log(`Running search command: ${grepCmd}`);
          }
          
          const grepOutput = execSync(grepCmd, { encoding: 'utf-8' }).trim();
          
          // Parse grep output
          if (grepOutput) {
            const matches = grepOutput.split('\n').map(line => {
              const [filePath, lineNum, ...contentParts] = line.split(':');
              return {
                file: filePath,
                lineNum: parseInt(lineNum, 10),
                content: contentParts.join(':').trim()
              };
            });
            
            searchResults.matches = matches;
            
            if (params.verbose) {
              console.log(`Found ${matches.length} matches for search term`);
            }
            
            // Get file contents for top matches
            for (const match of matches.slice(0, 10)) {
              if (!fileContents[match.file] && existsSync(match.file)) {
                fileContents[match.file] = await fs.readFile(match.file, 'utf-8');
              }
            }
          }
        } catch (error) {
          console.log(`Note: Search failed: ${error.message}`);
        }
      } else {
        // Just load first 10 matching files
        for (const file of matchingFiles.slice(0, 10)) {
          if (existsSync(file)) {
            fileContents[file] = await fs.readFile(file, 'utf-8');
          }
        }
      }
      
      // Get basic project info
      let projectInfo = {};
      try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        if (existsSync(packageJsonPath)) {
          const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
          const packageJson = JSON.parse(packageJsonContent);
          projectInfo = {
            name: packageJson.name,
            version: packageJson.version,
            description: packageJson.description,
            dependencies: Object.keys(packageJson.dependencies || {}),
            devDependencies: Object.keys(packageJson.devDependencies || {})
          };
        }
      } catch (error) {
        console.log(`Note: Package info not available: ${error.message}`);
      }
      
      // Create context object with combined results
      const context = {
        server: {
          name: "MCP Code Analysis Server",
          version: "1.0.0"
        },
        task: params.task,
        files: params.files,
        matchingFileCount: matchingFiles.length,
        searchTerm: params.search || undefined,
        timestamp: new Date().toISOString(),
        projectInfo,
        searchResults,
        fileContents
      };
      
      // Write context to file
      await fs.writeFile(
        params.output,
        JSON.stringify(context, null, 2),
        'utf-8'
      );
      
      console.log(`✅ Context saved to ${params.output}`);
      
    } catch (error) {
      throw new Error(`Failed to prepare context data: ${error.message}`);
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (params.verbose) {
      console.error(error.stack);
    }
    console.error('Make sure the server is running with HTTP transport enabled');
    process.exit(1);
  }
}

main(); 