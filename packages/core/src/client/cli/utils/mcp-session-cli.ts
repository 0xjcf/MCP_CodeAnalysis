/**
 * MCP Session CLI
 *
 * This CLI tool provides a command-line interface for managing MCP sessions.
 * It uses the McpSessionClient to interact with the MCP server.
 */

import { readFile } from 'fs/promises';

import chalk from 'chalk';
import { Command } from 'commander';
import ora from 'ora';

import { McpSessionClient } from './mcp-session-client.js';


const program = new Command();

program.name('mcp-session').description('CLI tool for managing MCP sessions').version('1.0.0');

program
  .command('create')
  .description('Create a new session')
  .option('-d, --description <description>', 'Session description')
  .option('-s, --server <path>', 'Path to MCP server script', '../../server-main.js')
  .option('-p, --port <number>', 'Port of existing MCP server')
  .option('--debug', 'Enable debug logging')
  .action(async options => {
    const client = new McpSessionClient();
    const spinner = ora('Creating session...').start();

    try {
      await client.connect(
        options.server,
        options.debug,
        options.port ? parseInt(options.port) : undefined,
      );
      const result = await client.createSession(options.description);
      spinner.succeed(`Created session ${chalk.cyan(result.sessionId)}`);
    } catch (error) {
      spinner.fail(`Failed to create session: ${(error as Error).message}`);
      process.exit(1);
    } finally {
      await client.close();
    }
  });

program
  .command('info')
  .description('Get information about a session')
  .requiredOption('-i, --id <sessionId>', 'Session ID')
  .option('-s, --server <path>', 'Path to MCP server script', '../../server-main.js')
  .option('--debug', 'Enable debug logging')
  .action(async options => {
    const client = new McpSessionClient();
    const spinner = ora('Getting session info...').start();

    try {
      await client.connect(options.server, options.debug);
      const info = await client.getSessionInfo(options.id);
      spinner.succeed('Retrieved session info');

      console.log('\nSession Information:');
      console.log(chalk.cyan('ID:'), info.sessionId);
      if (info.selectedTool) {
        console.log(chalk.cyan('Selected Tool:'), info.selectedTool);
      }
      if (info.lastExecutionTime) {
        console.log(chalk.cyan('Last Execution:'), info.lastExecutionTime);
      }
      console.log(chalk.cyan('Executions:'), info.executionHistory);
      console.log(chalk.cyan('Has Error:'), info.hasError ? chalk.red('Yes') : chalk.green('No'));
    } catch (error) {
      spinner.fail(`Failed to get session info: ${(error as Error).message}`);
      process.exit(1);
    } finally {
      await client.close();
    }
  });

program
  .command('history')
  .description('Get execution history for a session')
  .requiredOption('-i, --id <sessionId>', 'Session ID')
  .option('-l, --limit <number>', 'Maximum number of entries to return', '10')
  .option('-s, --server <path>', 'Path to MCP server script', '../../server-main.js')
  .option('--debug', 'Enable debug logging')
  .action(async options => {
    const client = new McpSessionClient();
    const spinner = ora('Getting session history...').start();

    try {
      await client.connect(options.server, options.debug);
      const history = await client.getSessionHistory(options.id, parseInt(options.limit));
      spinner.succeed('Retrieved session history');

      console.log('\nSession History:');
      console.log(chalk.cyan('Total Entries:'), history.totalEntries);
      console.log(chalk.cyan('Returned Entries:'), history.returnedEntries);

      console.log('\nHistory:');
      history.history.forEach((entry, index) => {
        console.log(chalk.cyan(`\nEntry ${index + 1}:`));
        console.log('Timestamp:', entry.timestamp);
        console.log('Tool:', entry.tool);
        console.log('Arguments:', JSON.stringify(entry.arguments, null, 2));
        if (entry.result) {
          console.log('Result:', JSON.stringify(entry.result, null, 2));
        }
        if (entry.error) {
          console.log(chalk.red('Error:'), entry.error);
        }
      });
    } catch (error) {
      spinner.fail(`Failed to get session history: ${(error as Error).message}`);
      process.exit(1);
    } finally {
      await client.close();
    }
  });

program
  .command('clear')
  .description('Clear a session')
  .requiredOption('-i, --id <sessionId>', 'Session ID')
  .option('-s, --server <path>', 'Path to MCP server script', '../../server-main.js')
  .option('--debug', 'Enable debug logging')
  .action(async options => {
    const client = new McpSessionClient();
    const spinner = ora('Clearing session...').start();

    try {
      await client.connect(options.server, options.debug);
      const cleared = await client.clearSession(options.id);
      if (cleared) {
        spinner.succeed(`Cleared session ${chalk.cyan(options.id)}`);
      } else {
        spinner.fail(`Failed to clear session ${chalk.cyan(options.id)}`);
        process.exit(1);
      }
    } catch (error) {
      spinner.fail(`Failed to clear session: ${(error as Error).message}`);
      process.exit(1);
    } finally {
      await client.close();
    }
  });

program
  .command('list')
  .description('List all active sessions')
  .option('-s, --server <path>', 'Path to MCP server script', '../../server-main.js')
  .option('--debug', 'Enable debug logging')
  .action(async options => {
    const client = new McpSessionClient();
    const spinner = ora('Listing sessions...').start();

    try {
      await client.connect(options.server, options.debug);
      const sessions = await client.listSessions();
      spinner.succeed('Retrieved session list');

      console.log('\nActive Sessions:');
      console.log(chalk.cyan('Total:'), sessions.activeSessions);

      if (sessions.sessions.length > 0) {
        console.log('\nSessions:');
        sessions.sessions.forEach((session, index) => {
          console.log(chalk.cyan(`\nSession ${index + 1}:`));
          console.log('ID:', session.sessionId);
          console.log('Tools Used:', session.toolsUsed);
          if (session.lastActivity) {
            console.log('Last Activity:', session.lastActivity);
          }
        });
      } else {
        console.log('\nNo active sessions found.');
      }
    } catch (error) {
      spinner.fail(`Failed to list sessions: ${(error as Error).message}`);
      process.exit(1);
    } finally {
      await client.close();
    }
  });

program
  .command('save-end')
  .description('Save end-of-session data')
  .requiredOption('-f, --file <path>', 'Path to JSON file containing session data')
  .option('-s, --server <path>', 'Path to MCP server script', '../../server-main.js')
  .option('--debug', 'Enable debug logging')
  .action(async options => {
    const client = new McpSessionClient();
    const spinner = ora('Saving end-of-session data...').start();

    try {
      const fileContent = await readFile(options.file, 'utf-8');
      const data = JSON.parse(fileContent);
      await client.connect(options.server, options.debug);
      const sessionId = await client.saveEndOfSession(data);
      spinner.succeed(`Saved end-of-session data for session ${chalk.cyan(sessionId)}`);
    } catch (error) {
      spinner.fail(`Failed to save end-of-session data: ${(error as Error).message}`);
      process.exit(1);
    } finally {
      await client.close();
    }
  });

program
  .command('get-end')
  .description('Get end-of-session data')
  .requiredOption('-i, --id <sessionId>', 'Session ID')
  .option('-s, --server <path>', 'Path to MCP server script', '../../server-main.js')
  .option('--debug', 'Enable debug logging')
  .action(async options => {
    const client = new McpSessionClient();
    const spinner = ora('Getting end-of-session data...').start();

    try {
      await client.connect(options.server, options.debug);
      const data = await client.getEndOfSession(options.id);
      spinner.succeed('Retrieved end-of-session data');

      console.log('\nEnd-of-Session Data:');
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      spinner.fail(`Failed to get end-of-session data: ${(error as Error).message}`);
      process.exit(1);
    } finally {
      await client.close();
    }
  });

program
  .command('list-end')
  .description('List all end-of-session records')
  .option('-s, --server <path>', 'Path to MCP server script', '../../server-main.js')
  .option('--debug', 'Enable debug logging')
  .action(async options => {
    const client = new McpSessionClient();
    const spinner = ora('Listing end-of-session records...').start();

    try {
      await client.connect(options.server, options.debug);
      const sessions = await client.listEndOfSessions();
      spinner.succeed('Retrieved end-of-session records');

      console.log('\nEnd-of-Session Records:');
      if (sessions.length > 0) {
        sessions.forEach((sessionId, index) => {
          console.log(`${index + 1}. ${chalk.cyan(sessionId)}`);
        });
      } else {
        console.log('No end-of-session records found.');
      }
    } catch (error) {
      spinner.fail(`Failed to list end-of-session records: ${(error as Error).message}`);
      process.exit(1);
    } finally {
      await client.close();
    }
  });

program.parse();
