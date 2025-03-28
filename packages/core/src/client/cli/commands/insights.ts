import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import inquirer from 'inquirer';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';

export function registerInsightsCommands(program: Command) {
  const insightsCommand = program
    .command('insights')
    .description('Work with codebase insights and memory');
  
  // Store insight command
  insightsCommand
    .command('store')
    .description('Store a new insight about a codebase')
    .requiredOption('-r, --repo <url>', 'Repository URL')
    .requiredOption('-t, --type <type>', 'Insight type', 'code-pattern')
    .requiredOption('-c, --content <content>', 'Insight content')
    .option('-f, --files <files>', 'Related files (comma-separated)')
    .option('--tags <tags>', 'Tags (comma-separated)')
    .action(async (options: any, command: any) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Storing insight...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the store-codebase-insight tool
        const result = await callTool('store-codebase-insight', {
          repositoryUrl: options.repo,
          insightType: options.type,
          insightContent: options.content,
          relatedFiles: options.files ? options.files.split(',') : [],
          tags: options.tags ? options.tags.split(',') : []
        }, debug);
        
        spinner.succeed('Insight stored');
        
        // Format and display the results
        console.log(formatOutput(result, output));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Failed to store insight: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Retrieve insights command
  insightsCommand
    .command('retrieve')
    .description('Retrieve insights about a codebase')
    .requiredOption('-r, --repo <url>', 'Repository URL')
    .option('-t, --types <types>', 'Insight types (comma-separated)')
    .option('-f, --file <file>', 'Related file')
    .option('--tags <tags>', 'Filter by tags (comma-separated)')
    .option('-l, --limit <limit>', 'Limit results', '10')
    .action(async (options: any, command: any) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Retrieving insights...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the retrieve-codebase-insights tool
        const result = await callTool('retrieve-codebase-insights', {
          repositoryUrl: options.repo,
          insightTypes: options.types ? options.types.split(',') : undefined,
          relatedFile: options.file,
          tags: options.tags ? options.tags.split(',') : undefined,
          limit: parseInt(options.limit)
        }, debug);
        
        spinner.succeed('Retrieved insights');
        
        // Format and display the results
        console.log(formatOutput(result, output));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Failed to retrieve insights: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  return insightsCommand;
} 