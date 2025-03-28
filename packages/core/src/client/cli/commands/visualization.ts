import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';

export function registerVisualizationCommands(program: Command) {
  const vizCommand = program
    .command('visualize')
    .description('Generate visualizations for code and dependencies');
  
  // Dependencies visualization command
  vizCommand
    .command('dependencies')
    .description('Visualize dependencies in a repository or file')
    .option('-r, --repo <url>', 'Repository URL')
    .option('-f, --file <path>', 'File path')
    .option('-p, --path <path>', 'Path to directory, file, or repository')
    .option('--format <format>', 'Output format (mermaid, dot, ascii)', 'mermaid')
    .option('--save <filename>', 'Save visualization to file')
    .action(async (options, command) => {
      const { serverPath, debug, output: globalOutput } = command.parent.parent.opts();
      
      if (!options.repo && !options.file && !options.path) {
        console.error(chalk.red('One of --repo, --file, or --path must be specified'));
        process.exit(1);
      }
      
      try {
        const spinner = ora('Generating dependency visualization...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Prepare arguments
        const args: any = {
          format: options.format
        };
        
        if (options.repo) {
          args.repositoryUrl = options.repo;
        }
        
        if (options.file) {
          if (fs.existsSync(options.file)) {
            args.filePath = options.file;
            if (!options.repo) {
              args.fileContent = fs.readFileSync(options.file, 'utf8');
            }
          } else {
            spinner.fail('File not found');
            process.exit(1);
          }
        }
        
        if (options.path) {
          args.path = options.path;
        }
        
        // Call the visualize-dependencies tool
        const result = await callTool('visualize-dependencies', args, debug);
        
        spinner.succeed('Visualization generated');
        
        // Save to file if requested
        if (options.save) {
          const content = result.content[0].text;
          fs.writeFileSync(options.save, content);
          console.log(chalk.green(`Visualization saved to ${options.save}`));
        }
        
        // Format and display the results
        console.log(formatOutput(result, globalOutput));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Visualization failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Code structure visualization command
  vizCommand
    .command('structure')
    .description('Visualize code structure')
    .option('-r, --repo <url>', 'Repository URL')
    .option('-f, --file <path>', 'File path')
    .option('--format <format>', 'Output format (mermaid, dot, ascii)', 'mermaid')
    .option('--methods <boolean>', 'Include methods', 'true')
    .option('--attributes <boolean>', 'Include attributes', 'true')
    .option('--save <filename>', 'Save visualization to file')
    .action(async (options, command) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      if (!options.repo && !options.file) {
        console.error(chalk.red('Either --repo or --file must be specified'));
        process.exit(1);
      }
      
      try {
        // Implementation for structure visualization
        // Similar to dependencies visualization but with different tool
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Visualization failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  return vizCommand;
} 