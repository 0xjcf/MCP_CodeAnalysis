import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import fs from 'fs';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';

export function registerSocioTechnicalCommands(program: Command) {
  const stCommand = program
    .command('socio-technical')
    .description('Analyze socio-technical patterns in repositories');
  
  // Analyze socio-technical patterns command
  stCommand
    .command('analyze <repository-url>')
    .description('Analyze socio-technical patterns in a repository')
    .option('--contributors <boolean>', 'Include contributor patterns', 'true')
    .option('--team-dynamics <boolean>', 'Include team dynamics', 'true')
    .option('--start-date <date>', 'Start date for analysis (YYYY-MM-DD)')
    .option('--end-date <date>', 'End date for analysis (YYYY-MM-DD)')
    .option('-f, --format <format>', 'Visualization format (json, mermaid, dot)', 'json')
    .option('--save <filename>', 'Save results to file')
    .action(async (repositoryUrl, options, command) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Analyzing socio-technical patterns...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Prepare time range if provided
        const timeRange = (options.startDate || options.endDate) ? {
          start: options.startDate,
          end: options.endDate
        } : undefined;
        
        // Call the socio-technical-analysis tool
        const result = await callTool('socio-technical-analysis', {
          repositoryUrl,
          includeContributorPatterns: options.contributors === 'true',
          includeTeamDynamics: options.teamDynamics === 'true',
          timeRange,
          visualizationFormat: options.format
        }, debug);
        
        spinner.succeed('Analysis complete');
        
        // Save to file if requested
        if (options.save) {
          const content = result.content[0].text;
          fs.writeFileSync(options.save, content);
          console.log(chalk.green(`Results saved to ${options.save}`));
        }
        
        // Format and display the results
        console.log(formatOutput(result, output));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  return stCommand;
} 