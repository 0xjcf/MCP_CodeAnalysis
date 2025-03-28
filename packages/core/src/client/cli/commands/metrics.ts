import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';

export function registerMetricsCommands(program: Command) {
  const metricsCommand = program
    .command('metrics')
    .description('Analyze code metrics and quality');
  
  // Code metrics command
  metricsCommand
    .command('analyze <repository-path>')
    .description('Analyze code metrics for a repository')
    .option('--no-files', 'Exclude file-level metrics')
    .option('--functions', 'Include function-level metrics')
    .option('-o, --output-file <file>', 'Write output to a file')
    .action(async (repositoryPath, options, command) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Analyzing code metrics...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the analyze-metrics tool
        const result = await callTool('analyze-metrics', {
          repositoryPath,
          includeFiles: options.files !== false,
          includeFunctions: options.functions === true
        }, debug);
        
        spinner.succeed('Metrics analysis complete');
        
        // Format the output
        const formattedOutput = formatOutput(result, output);
        
        // Write to file if specified
        if (options.outputFile) {
          const fs = await import('fs');
          const path = await import('path');
          const outputPath = path.resolve(options.outputFile);
          fs.writeFileSync(outputPath, formattedOutput);
          console.log(chalk.green(`Output written to ${outputPath}`));
        } else {
          // Display the results
          console.log(formattedOutput);
        }
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Metrics analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  return metricsCommand;
} 