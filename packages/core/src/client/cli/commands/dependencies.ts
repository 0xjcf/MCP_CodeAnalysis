import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';

export function registerDependencyCommands(program: Command) {
  const dependencyCommand = program
    .command('dependencies')
    .description('Analyze code dependencies');
  
  // Dependency analysis command
  dependencyCommand
    .command('analyze <repository-path>')
    .description('Analyze dependencies for a repository')
    .option('-f, --format <format>', 'Output format (json, mermaid, dot)', 'json')
    .option('-o, --output-file <file>', 'Write output to a file')
    .action(async (repositoryPath, options, command) => {
      const { serverPath, debug, output: globalOutput } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Analyzing dependencies...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the analyze-dependencies tool
        const result = await callTool('analyze-dependencies', {
          repositoryPath: repositoryPath,
          format: options.format
        }, debug);
        
        spinner.succeed('Dependency analysis complete');
        
        // Format the output
        const formattedOutput = options.format === 'json' 
          ? formatOutput(result, globalOutput) 
          : (result?.content?.[0]?.text || '');
        
        // Write to file if specified
        if (options.outputFile) {
          const outputPath = path.resolve(options.outputFile);
          fs.writeFileSync(outputPath, formattedOutput);
          console.log(chalk.green(`Output written to ${outputPath}`));
        } else {
          // Display the results
          console.log(formattedOutput);
        }
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Dependency analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Visualize dependencies command
  dependencyCommand
    .command('visualize <repository-path>')
    .description('Generate a visual dependency graph')
    .option('-f, --format <format>', 'Output format (mermaid, dot)', 'mermaid')
    .option('-o, --output-file <file>', 'Write output to a file (required)')
    .option('--open', 'Open the generated visualization in a browser', false)
    .action(async (repositoryPath, options, command) => {
      const { serverPath, debug } = command.parent.parent.opts();
      
      if (!options.outputFile) {
        console.error(chalk.red('Output file is required for visualization'));
        process.exit(1);
      }
      
      try {
        const spinner = ora('Generating dependency visualization...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the analyze-dependencies tool
        const result = await callTool('analyze-dependencies', {
          repositoryPath,
          format: options.format
        }, debug);
        
        // Extract the content
        let content = '';
        if (result && result.content && Array.isArray(result.content)) {
          for (const item of result.content) {
            if (item.type === 'text') {
              content = item.text;
              break;
            }
          }
        }
        
        if (!content) {
          throw new Error('No visualization content received from server');
        }
        
        // Write to file
        const outputPath = path.resolve(options.outputFile);
        fs.writeFileSync(outputPath, content);
        
        spinner.succeed('Dependency visualization generated');
        console.log(chalk.green(`Output written to ${outputPath}`));
        
        // Open in browser if requested
        if (options.open) {
          await openVisualization(outputPath, options.format);
        }
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Dependency visualization failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  return dependencyCommand;
}

/**
 * Open the visualization in a browser
 */
async function openVisualization(filePath: string, format: string) {
  try {
    // Generate HTML wrapper based on format
    if (format === 'mermaid') {
      const mermaidContent = fs.readFileSync(filePath, 'utf8');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Dependency Visualization</title>
          <script src="https://cdn.jsdelivr.net/npm/mermaid@10.0.0/dist/mermaid.min.js"></script>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .mermaid { max-width: 100%; }
          </style>
        </head>
        <body>
          <h1>Dependency Visualization</h1>
          <div class="mermaid">
${mermaidContent}
          </div>
          <script>
            mermaid.initialize({ startOnLoad: true });
          </script>
        </body>
        </html>
      `;
      
      // Write HTML file
      const htmlPath = filePath + '.html';
      fs.writeFileSync(htmlPath, htmlContent);
      
      // Open in browser
      const open = (await import('open')).default;
      await open(htmlPath);
      
      console.log(chalk.green(`Opened visualization in browser: ${htmlPath}`));
    } else if (format === 'dot') {
      console.log(chalk.yellow('Auto-opening DOT files is not supported. Please use a tool like Graphviz to visualize the DOT file.'));
    }
  } catch (error) {
    console.error(chalk.red(`Error opening visualization: ${(error as Error).message}`));
  }
} 