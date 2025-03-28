#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Import commands
import { registerAnalyzeCommands } from './commands/analyze.js';
import { registerMetricsCommands } from './commands/metrics.js';
import { registerDependencyCommands } from './commands/dependencies.js';
import { registerInsightsCommands } from './commands/insights.js';
import { registerVisualizationCommands } from './commands/visualization.js';
import { registerKnowledgeGraphCommands } from './commands/knowledge-graph.js';
import { registerSocioTechnicalCommands } from './commands/socio-technical.js';
import { registerConfigCommands } from './commands/config.js';
import { registerWatchCommands } from './commands/watch.js';
import { registerIdeCommands } from './commands/ide.js';
import { registerQualityCommands } from './commands/quality.js';

// Import utilities
import { loadConfig } from './utils/config.js';

// Get package info
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let packageJson;

try {
  const packagePath = path.resolve(__dirname, '../../../package.json');
  packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
} catch (error) {
  packageJson = { version: '1.0.0' };
}

// Create program
const program = new Command()
  .name('codeanalysis')
  .description('Advanced code analysis tools powered by MCP')
  .version(packageJson.version);

// Register command groups
registerAnalyzeCommands(program);
registerMetricsCommands(program);
registerDependencyCommands(program);
registerInsightsCommands(program);
registerVisualizationCommands(program);
registerKnowledgeGraphCommands(program);
registerSocioTechnicalCommands(program);
registerConfigCommands(program);
registerWatchCommands(program);
registerIdeCommands(program);
registerQualityCommands(program);

// Load configuration for defaults
const config = loadConfig();

// Add global options with config defaults
program
  .option('-s, --server-path <path>', 'Path to server executable', config.serverPath || './dist/server.js')
  .option('--debug', 'Enable debug logging', config.debug || false)
  .option('-o, --output <format>', 'Output format (json, text)', config.output || 'text');

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`));
  console.error(chalk.yellow('See --help for a list of available commands.'));
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// If no arguments, show help
if (process.argv.length === 2) {
  program.help();
}

export * from './commands/analyze.js';