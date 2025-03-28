import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import figures from 'figures';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';
import fs from 'fs';
import path from 'path';
import { detectCurrentProject, getProjectInfo, getChangedFiles } from '../utils/project-detector.js';

export function registerAnalyzeCommands(program: Command) {
  const analyzeCommand = program
    .command('analyze')
    .description('Analyze code repositories and files');
  
  // Repository analysis command
  analyzeCommand
    .command('repo <repository-url>')
    .description('Analyze a Git repository')
    .option('-d, --depth <depth>', 'Analysis depth (1-3)', '2')
    .option('--dependencies', 'Analyze dependencies', true)
    .option('--complexity', 'Analyze code complexity', true)
    .action(async (repositoryUrl: string, options: any, command: any) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Analyzing repository...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the analyze-dependencies tool
        const result = await callTool('analyze-dependencies', {
          repositoryUrl,
          depth: parseInt(options.depth),
          includeDependencies: options.dependencies,
          includeComplexity: options.complexity
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
  
  // File analysis command
  analyzeCommand
    .command('file <file-path>')
    .description('Analyze a single file')
    .option('-l, --language <language>', 'Specify the programming language')
    .option('-m, --metrics <metrics>', 'Metrics to calculate (comma-separated)', 'complexity,linesOfCode,maintainability')
    .action(async (filePath: string, options: any, command: any) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Analyzing file...').start();
        
        // Read the file content
        const fullPath = path.resolve(process.cwd(), filePath);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Call the calculate-metrics tool
        const result = await callTool('calculate-metrics', {
          fileContent,
          language: options.language || path.extname(filePath).slice(1),
          metrics: options.metrics.split(',')
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
  
  // Current project analysis command
  analyzeCommand
    .command('current')
    .description('Analyze the current project or workspace')
    .option('-d, --depth <depth>', 'Analysis depth (1-3)', '2')
    .option('--dependencies', 'Analyze dependencies', true)
    .option('--complexity', 'Analyze code complexity', true)
    .option('--changed-only', 'Analyze only files with uncommitted changes', false)
    .action(async (options: any, command: any) => {
      const { serverPath, debug, output } = command.parent.parent.opts();
      
      try {
        // Detect the current project
        const spinner = ora('Detecting project...').start();
        const projectRoot = await detectCurrentProject();
        const projectInfo = getProjectInfo(projectRoot);
        
        spinner.succeed(`Detected ${projectInfo.type} project: ${projectInfo.name}`);
        
        // If changed-only flag is set and it's a git repo, get only changed files
        let filesToAnalyze: string[] = [];
        if (options.changedOnly && projectInfo.isGitRepo) {
          filesToAnalyze = getChangedFiles(projectRoot);
          if (filesToAnalyze.length === 0) {
            console.log(chalk.yellow('No changed files detected.'));
            return;
          }
          console.log(chalk.blue(`Found ${filesToAnalyze.length} changed files to analyze.`));
        }
        
        const analysisSpinner = ora('Analyzing project...').start();
        
        // Connect to server
        const client = await getClient(serverPath, debug);
        
        // Create repository URL from local path
        const repositoryUrl = `file://${projectRoot}`;
        
        // Call the analyze-repository tool
        const result = await callTool('analyze-repository', {
          repositoryUrl,
          depth: parseInt(options.depth),
          includeDependencies: options.dependencies,
          includeComplexity: options.complexity,
          specificFiles: options.changedOnly ? filesToAnalyze : undefined
        }, debug);
        
        analysisSpinner.succeed('Analysis complete');
        
        // Format and display the results
        console.log(formatOutput(result, output));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  return analyzeCommand;
} 