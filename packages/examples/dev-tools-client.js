/**
 * Example client for using MCP developer tools
 * 
 * This script demonstrates how an AI assistant or development tool could interact with 
 * the MCP server to access development-specific features.
 * 
 * Usage: 
 *   node examples/dev-tools-client.js
 */

import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  console.log('Connecting to MCP server...');
  
  // Create a client with stdio transport
  const client = new McpClient();
  const transport = new StdioClientTransport();
  
  try {
    await client.connect(transport);
    console.log('Connected to MCP server successfully!');
    
    // Step 1: Get project information
    console.log('\n--- Project Information ---');
    const projectInfo = await client.executeTool('project-info', {});
    console.log(JSON.parse(projectInfo.content[0].text).result);
    
    // Step 2: Search for code using search-code tool
    console.log('\n--- Code Search Results ---');
    const searchResults = await client.executeTool('search-code', {
      query: 'registerToolsOnce',
      filePattern: '*.ts', 
      maxResults: 5
    });
    console.log(JSON.parse(searchResults.content[0].text).result);

    // Step 3: Get folder structure
    console.log('\n--- Folder Structure ---');
    const folderStructure = await client.executeTool('folder-structure', {
      path: 'src/features',
      depth: 2
    });
    console.log(JSON.parse(folderStructure.content[0].text).result);
    
    // Step 4: Get file content
    console.log('\n--- File Content ---');
    const fileContent = await client.executeTool('get-file', {
      path: 'src/features/dev-tools/index.ts',
      startLine: 1,
      endLine: 10
    });
    const fileResult = JSON.parse(fileContent.content[0].text).result;
    console.log(`File: ${fileResult.path} (showing lines ${fileResult.selectedLines.start}-${fileResult.selectedLines.end})`);
    console.log('---');
    console.log(fileResult.content);
    
    // Create a session to maintain state between interactions
    console.log('\n--- Creating Session ---');
    const session = await client.executeTool('create-session', {
      sessionId: 'dev-' + Date.now(),
      metadata: {
        purpose: 'Development assistance',
        features: ['dev-tools']
      }
    });
    console.log(JSON.parse(session.content[0].text).result);
    
    console.log('\nExample client completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

main().catch(console.error); 