import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import fs from 'fs';
import path from 'path';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';
import { detectCurrentProject } from '../utils/project-detector.js';
import { getConfigValue } from '../utils/config.js';

// Use Node.js built-in fs.watch instead of requiring an additional dependency
let watchTimeout: NodeJS.Timeout | null = null;
const watchingFiles = new Set<string>();

export function registerWatchCommands(program: Command) {
  const watchCommand = program
    .command('watch')
    .description('Watch for file changes and analyze in real-time');
  
  // Watch current project
  watchCommand
    .command('current')
    .description('Watch the current project for changes')
    .option('-i, --ignore <patterns>', 'Comma-separated patterns to ignore', 'node_modules,dist,build')
    .option('-d, --delay <ms>', 'Debounce delay in milliseconds', '1000')
    .option('-e, --extensions <ext>', 'File extensions to watch (comma-separated)', 'js,ts,jsx,tsx')
    .action(async (options: any, command: any) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        // Detect current project
        const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watching ${projectRoot} for changes...`));
        console.log(chalk.gray('Press Ctrl+C to stop'));
        
        // Parse extensions to watch
        const extensions = options.extensions.split(',').map((ext: string) => ext.startsWith('.') ? ext : `.${ext}`);
        
        // Parse ignore patterns
        const ignorePatterns = options.ignore.split(',');
        
        // Connect to server and keep connection open
        const client = await getClient(serverPath, debug);
        
        // Set up recursive directory watching
        watchDirectory(projectRoot, extensions, ignorePatterns, async (filePath) => {
          // Debounce file changes
          if (watchTimeout) {
            clearTimeout(watchTimeout);
          }
          
          // Skip if we're already analyzing this file
          if (watchingFiles.has(filePath)) {
            return;
          }
          
          watchingFiles.add(filePath);
          
          watchTimeout = setTimeout(async () => {
            const spinner = ora(`Analyzing ${path.relative(projectRoot, filePath)}...`).start();
            
            try {
              // Read file content
              const fileContent = fs.readFileSync(filePath, 'utf8');
              
              // Call analyze-file tool
              const result = await callTool('calculate-metrics', {
                fileContent,
                language: path.extname(filePath).slice(1),
                metrics: getConfigValue('analysis.metrics', 'complexity,linesOfCode,maintainability')
              }, debug);
              
              spinner.succeed(`Analysis of ${path.relative(projectRoot, filePath)} complete`);
              
              // Format and display results
              console.log(formatOutput(result, output));
            } catch (error) {
              spinner.fail(`Analysis failed: ${(error as Error).message}`);
            } finally {
              watchingFiles.delete(filePath);
            }
          }, parseInt(options.delay));
        });
        
        // Keep process running
        process.stdin.resume();
        
        // Handle process termination
        process.on('SIGINT', async () => {
          console.log(chalk.blue('\nStopping watch mode...'));
          await closeClient();
          process.exit(0);
        });
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Watch mode failed: ${(error as Error).message}`));
        await closeClient();
        process.exit(1);
      }
    });
  
  return watchCommand;
}

/**
 * Watch a directory recursively for file changes
 */
function watchDirectory(
  dir: string, 
  extensions: string[], 
  ignorePatterns: string[], 
  callback: (filePath: string) => void
) {
  // Skip ignored directories
  const dirName = path.basename(dir);
  if (ignorePatterns.some(pattern => dirName === pattern || dir.includes(`/${pattern}/`))) {
    return;
  }
  
  try {
    // Watch current directory
    fs.watch(dir, (eventType, filename) => {
      if (!filename) return;
      
      const filePath = path.join(dir, filename);
      
      // Skip if the file doesn't exist (might have been deleted)
      if (!fs.existsSync(filePath)) return;
      
      // Skip if it's an ignored pattern
      if (ignorePatterns.some(pattern => filename === pattern || filename.includes(`/${pattern}/`))) {
        return;
      }
      
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        // If a new directory is created, start watching it
        watchDirectory(filePath, extensions, ignorePatterns, callback);
      } else if (extensions.includes(path.extname(filename))) {
        // If it's a file with a matching extension, trigger the callback
        callback(filePath);
      }
    });
    
    // Recursively watch subdirectories
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !ignorePatterns.includes(entry.name)) {
        watchDirectory(path.join(dir, entry.name), extensions, ignorePatterns, callback);
      }
    }
  } catch (error) {
    console.error(chalk.yellow(`Warning: Could not watch ${dir}: ${(error as Error).message}`));
  }
} 