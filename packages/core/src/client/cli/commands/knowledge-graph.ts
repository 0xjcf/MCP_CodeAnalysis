import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import fs from 'fs';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';

export function registerKnowledgeGraphCommands(program: Command) {
  const kgCommand = program
    .command('knowledge')
    .description('Work with the code knowledge graph');
  
  // Build knowledge graph command
  kgCommand
    .command('build <repository-url>')
    .description('Build a knowledge graph for a repository')
    .option('-d, --depth <depth>', 'Analysis depth (1-3)', '2')
    .option('--include-external', 'Include external dependencies', 'true')
    .action(async (repositoryUrl, options, command) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Building knowledge graph...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the build-knowledge-graph tool
        const result = await callTool('build-knowledge-graph', {
          repositoryUrl,
          depth: parseInt(options.depth),
          includeExternalDependencies: options.includeExternal === 'true'
        }, debug);
        
        spinner.succeed('Knowledge graph built');
        
        // Format and display the results
        console.log(formatOutput(result, output));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Failed to build knowledge graph: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Query knowledge graph command
  kgCommand
    .command('query <repository-url>')
    .description('Query the knowledge graph')
    .requiredOption('-q, --query <query>', 'Query string')
    .option('-d, --depth <depth>', 'Context depth', '2')
    .option('-f, --format <format>', 'Output format (json, text, visualization)', 'json')
    .option('--save <filename>', 'Save results to file')
    .action(async (repositoryUrl, options, command) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Querying knowledge graph...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the query-knowledge-graph tool
        const result = await callTool('query-knowledge-graph', {
          repositoryUrl,
          query: options.query,
          contextDepth: parseInt(options.depth),
          outputFormat: options.format
        }, debug);
        
        spinner.succeed('Query complete');
        
        // Save to file if requested
        if (options.save) {
          if (options.format === 'visualization') {
            fs.writeFileSync(options.save, result.content[0].text);
          } else {
            fs.writeFileSync(options.save, JSON.stringify(result, null, 2));
          }
          console.log(chalk.green(`Results saved to ${options.save}`));
        }
        
        // Format and display the results
        console.log(formatOutput(result, output));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Query failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  // Export knowledge graph command
  kgCommand
    .command('export <repository-url>')
    .description('Export the knowledge graph')
    .option('-f, --format <format>', 'Export format (json, mermaid, dot, cypher)', 'json')
    .option('--save <filename>', 'Save to file')
    .action(async (repositoryUrl, options, command) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Exporting knowledge graph...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the export-knowledge-graph tool
        const result = await callTool('export-knowledge-graph', {
          repositoryUrl,
          format: options.format
        }, debug);
        
        spinner.succeed('Export complete');
        
        // Save to file if requested
        if (options.save) {
          fs.writeFileSync(options.save, result.content[0].text);
          console.log(chalk.green(`Graph exported to ${options.save}`));
        }
        
        // Format and display the results
        console.log(formatOutput(result, output));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Export failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  return kgCommand;
} 