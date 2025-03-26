#!/usr/bin/env node

/**
 * AI Context Generator
 * 
 * Generates ai-context.json by analyzing the codebase
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import MCPParameterHandler from './lib/parameter-handler.js';

// Define command parameters
const aiAnalyzerCommand = {
  name: 'ai-analyzer',
  description: 'Generate AI context by analyzing the codebase',
  parameters: [
    {
      name: 'task',
      alias: 't',
      description: 'Task to run (required)',
      type: 'string',
      required: true
    },
    {
      name: 'files',
      alias: 'f',
      description: 'Files pattern to analyze (e.g., "**/*.js")',
      type: 'string',
      default: 'src/**/*.ts'
    },
    {
      name: 'output',
      alias: 'o',
      description: 'Output file path',
      type: 'string',
      default: 'ai-context.json'
    },
    {
      name: 'verbose',
      alias: 'v',
      description: 'Enable verbose output',
      type: 'boolean',
      default: false
    }
  ]
};

// Parse parameters
const paramHandler = new MCPParameterHandler(aiAnalyzerCommand);

// Check for help flag first
const hasHelpFlag = process.argv.includes('--help') || process.argv.includes('-h');
if (hasHelpFlag) {
  console.log(paramHandler.getHelpText());
  process.exit(0);
}

// Parse actual parameters
const params = paramHandler.parse(process.argv.slice(2));

/**
 * Analyze codebase and generate AI context
 * @returns {Promise<Object>} AI context object
 */
async function generateAIContext() {
  const context = {
    metadata: {
      generated_at: new Date().toISOString(),
      task: params.task,
      files_analyzed: params.files
    },
    codebase_analysis: {
      structure: {},
      dependencies: {},
      patterns: {}
    },
    project_context: {
      goals: {},
      constraints: {},
      requirements: {}
    }
  };

  try {
    // Read session goals if available
    if (fs.existsSync('session-goal.json')) {
      const sessionGoals = JSON.parse(fs.readFileSync('session-goal.json', 'utf8'));
      context.project_context.goals = sessionGoals;
    }

    // Read complexity analysis if available
    if (fs.existsSync('complexity_analysis.json')) {
      const complexityAnalysis = JSON.parse(fs.readFileSync('complexity_analysis.json', 'utf8'));
      context.codebase_analysis.structure.complexity = complexityAnalysis;
    }

    // Read knowledge graph if available
    if (fs.existsSync('knowledge_graph.json')) {
      const knowledgeGraph = JSON.parse(fs.readFileSync('knowledge_graph.json', 'utf8'));
      context.codebase_analysis.patterns.knowledge_graph = knowledgeGraph;
    }

    // Read monetization analysis if available
    if (fs.existsSync('monetization_analysis.json')) {
      const monetizationAnalysis = JSON.parse(fs.readFileSync('monetization_analysis.json', 'utf8'));
      context.project_context.requirements.monetization = monetizationAnalysis;
    }

    // Analyze dependencies
    if (fs.existsSync('package.json')) {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      context.codebase_analysis.dependencies = {
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {}
      };
    }

    return context;
  } catch (error) {
    console.error('Error generating AI context:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Validate required parameters
    if (!params.task) {
      console.error('Error: --task parameter is required');
      console.log(paramHandler.getHelpText());
      return 1;
    }

    // Generate AI context
    console.log(`Generating AI context for task: ${params.task}`);
    const context = await generateAIContext();

    // Write to output file
    fs.writeFileSync(params.output, JSON.stringify(context, null, 2));
    console.log(`✅ AI context generated and saved to ${params.output}`);

    return 0;
  } catch (error) {
    console.error(`❌ Failed to generate AI context: ${error.message}`);
    if (params.verbose) {
      console.error(error.stack);
    }
    return 1;
  }
}

// Run main function
main().then(process.exit); 