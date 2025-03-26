#!/usr/bin/env node

/**
 * AI Context Client
 * 
 * A unified client for generating AI context using either HTTP or MCP protocol.
 * Supports code analysis, metrics, and session management.
 */

import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { HttpClientTransport } from '@modelcontextprotocol/sdk/client/http.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'node:util';
import { glob } from 'glob';
import { execSync } from 'child_process';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse command line arguments
const options = {
  task: { type: 'string', short: 't', default: '' },
  files: { type: 'string', short: 'f', default: '' },
  search: { type: 'string', short: 's', default: '' },
  output: { type: 'string', short: 'o', default: 'ai-context.json' },
  sessionId: { type: 'string', short: 'i', default: `ai-${Date.now()}` },
  protocol: { type: 'string', short: 'p', default: 'mcp' },
  server: { type: 'string', short: 'S', default: 'http://localhost:3000' },
  metrics: { type: 'string', short: 'm', default: 'complexity,maintainability' },
  verbose: { type: 'boolean', short: 'v', default: false }
};

const { values: args } = parseArgs({ options, allowPositionals: true });

async function main() {
  console.log('🚀 AI Context Client');
  console.log('-------------------');
  
  // Validate required parameters
  if (!args.task) {
    console.error('Error: --task parameter is required');
    process.exit(1);
  }
  
  // Create client based on protocol
  let client;
  if (args.protocol === 'mcp') {
    client = new McpClient();
    const transport = new StdioClientTransport();
    await client.connect(transport);
  } else {
    client = new McpClient();
    const transport = new HttpClientTransport({
      serverUrl: args.server
    });
    await client.connect(transport);
  }
  
  try {
    // Create a new session
    console.log(`Creating session: ${args.sessionId}`);
    const sessionResponse = await client.executeTool('create-session', {
      sessionId: args.sessionId,
      metadata: {
        task: args.task,
        timestamp: new Date().toISOString()
      }
    });
    
    const sessionResult = JSON.parse(sessionResponse.content[0].text).result;
    console.log(`✅ Session created: ${sessionResult.sessionId}`);
    
    // Collect context data
    const context = {
      task: args.task,
      timestamp: new Date().toISOString(),
      sessionId: args.sessionId,
      projectInfo: null,
      codeSearchResults: null,
      relevantFiles: [],
      folderStructure: null,
      metrics: {}
    };
    
    // Get project info
    console.log('Gathering project information...');
    const projectInfoResponse = await client.executeTool('project-info', {});
    context.projectInfo = JSON.parse(projectInfoResponse.content[0].text).result;
    console.log('✅ Project information collected');
    
    // Get folder structure
    console.log('Collecting folder structure...');
    const folderResponse = await client.executeTool('folder-structure', {
      path: 'src',
      depth: 3
    });
    context.folderStructure = JSON.parse(folderResponse.content[0].text).result;
    console.log(`✅ Folder structure collected (${context.folderStructure.count} directories)`);
    
    // Get content of relevant files if specified
    if (args.files) {
      const filePatterns = args.files.split(',');
      console.log(`Collecting content from files matching: ${filePatterns.join(', ')}`);
      
      for (const pattern of filePatterns) {
        const files = await glob(pattern);
        for (const file of files) {
          console.log(`Getting content from: ${file}`);
          try {
            const fileResponse = await client.executeTool('get-file', {
              path: file
            });
            
            const fileResult = JSON.parse(fileResponse.content[0].text).result;
            context.relevantFiles.push({
              path: fileResult.path,
              totalLines: fileResult.totalLines,
              content: fileResult.content
            });
            
            // Calculate metrics for the file
            const metricsResponse = await client.executeTool('calculate-metrics', {
              filePath: file,
              metrics: args.metrics.split(',')
            });
            
            context.metrics[file] = JSON.parse(metricsResponse.content[0].text).result;
            console.log(`✅ Added ${file} (${fileResult.totalLines} lines)`);
          } catch (error) {
            console.error(`❌ Error processing file ${file}:`, error.message);
          }
        }
      }
    }
    
    // Search for code if search term is provided
    if (args.search) {
      console.log(`Searching for code related to: ${args.search}`);
      const searchResponse = await client.executeTool('search-code', {
        query: args.search,
        maxResults: 20
      });
      context.codeSearchResults = JSON.parse(searchResponse.content[0].text).result;
      console.log(`✅ Found ${context.codeSearchResults.resultsCount} code references`);
    }
    
    // Output the context
    const outputPath = path.resolve(process.cwd(), args.output);
    fs.writeFileSync(outputPath, JSON.stringify(context, null, 2));
    console.log(`\n✅ Context saved to: ${outputPath}`);
    console.log('\nAI context preparation complete!');
    console.log(`\nTo use this context in AI interactions, include the contents of ${args.output}`);
    console.log(`Or reference session ID: ${args.sessionId}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main().catch(console.error); 