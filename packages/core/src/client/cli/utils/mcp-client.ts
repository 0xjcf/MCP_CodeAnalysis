import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import ora from 'ora';
import chalk from 'chalk';
import { spawn } from 'child_process';

let client: Client | null = null;

export async function getClient(serverPath: string, debug = false): Promise<Client> {
  if (client) {
    return client;
  }

  const spinner = ora('Connecting to analysis server...').start();
  
  try {
    const transport = new StdioClientTransport({
      command: 'node',
      args: [serverPath]
    });

    client = new Client(
      { name: 'code-analysis-cli', version: '1.0.0' },
      { capabilities: { tools: {}, resources: {}, prompts: {} } }
    );

    await client.connect(transport);
    
    if (debug) {
      console.log(chalk.gray('Debug: Connected to MCP server'));
    }
    
    spinner.succeed('Connected to analysis server');
    return client;
  } catch (error) {
    spinner.fail(`Failed to connect to server: ${(error as Error).message}`);
    throw error;
  }
}

export async function closeClient(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}

export async function callTool(toolName: string, args: any, debug = false): Promise<any> {
  if (!client) {
    throw new Error('Client not connected to server');
  }
  
  if (debug) {
    console.log(chalk.gray(`Debug: Calling tool ${toolName} with args:`));
    console.log(chalk.gray(JSON.stringify(args, null, 2)));
  }
  
  return client.callTool({
    name: toolName,
    arguments: args
  });
} 