import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';
import { detectCurrentProject } from '../utils/project-detector.js';

export function registerIdeCommands(program: Command) {
  const ideCommand = program
    .command('ide')
    .description('IDE-specific commands and integrations');
  
  // Analyze at cursor position
  ideCommand
    .command('analyze-cursor <file-path> <line> <column>')
    .description('Analyze code at a specific cursor position')
    .option('-r, --range <lines>', 'Number of lines of context to include', '5')
    .action(async (filePath: string, line: string, column: string, options: any, command: any) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Analyzing at cursor position...').start();
        
        // Read file content
        const fullPath = path.resolve(process.cwd(), filePath);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        
        // Extract context around cursor position
        const lineNumber = parseInt(line);
        const columnNumber = parseInt(column);
        const contextRange = parseInt(options.range);
        const context = extractContext(fileContent, lineNumber, columnNumber, contextRange);
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call analyze-cursor tool (you'll need to implement this in the server)
        const result = await callTool('analyze-cursor', {
          filePath: fullPath,
          fileContent,
          line: lineNumber,
          column: columnNumber,
          context
        }, debug);
        
        spinner.succeed('Analysis complete');
        
        // Format and display the results
        console.log(formatOutput(result, output));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Analyze only open files (IDE would provide list)
  ideCommand
    .command('analyze-open-files <files...>')
    .description('Analyze specifically listed open files')
    .action(async (files: string[], options: any, command: any) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora(`Analyzing ${files.length} open files...`).start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Read and analyze each file
        const fileContents = files.map(file => ({
          path: file,
          content: fs.readFileSync(file, 'utf8')
        }));
        
        // Call analyze-files tool
        const result = await callTool('analyze-files', {
          files: fileContents,
        }, debug);
        
        spinner.succeed('Analysis complete');
        
        // Format and display the results
        console.log(formatOutput(result, output));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  return ideCommand;
}

/**
 * Extract code context around a cursor position
 */
function extractContext(
  fileContent: string,
  line: number,
  column: number,
  contextRange: number
): { before: string[], target: string, after: string[] } {
  const lines = fileContent.split('\n');
  
  // Adjust for 0-based array indexing vs 1-based line numbers
  const targetLineIndex = line - 1;
  
  // Get context lines before
  const startLine = Math.max(0, targetLineIndex - contextRange);
  const before = lines.slice(startLine, targetLineIndex);
  
  // Get target line
  const target = lines[targetLineIndex] || '';
  
  // Get context lines after
  const endLine = Math.min(lines.length, targetLineIndex + contextRange + 1);
  const after = lines.slice(targetLineIndex + 1, endLine);
  
  return { before, target, after };
} 