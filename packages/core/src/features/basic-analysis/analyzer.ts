import fs from 'fs';
import path from 'path';

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { CodeAnalysisResult } from '../../types/responses.js';
import { getRepository, listFiles } from '../../utils/repository-analyzer.js';
import { executeWithTiming, createErrorResponse } from '../../utils/responses.js';

interface IComplexityMetrics {
  cyclomatic: number;
  cognitive: number;
  maintainability: number;
}

interface IAnalysisResult {
  readability: number;
  maintainability: number;
  complexity: number;
  issues: string[];
}

interface IDetailedAnalysisResult {
  readability: number;
  maintainability: number;
  complexity: IComplexityMetrics;
  issues: string[];
  imports: string[];
  classes: string[];
  functions: string[];
}

interface IMetricsOptions {
  repositoryUrl?: string;
  filePath?: string;
  fileContent?: string;
  language?: string;
  metrics?: string[];
  analysisId?: string;
  type?: string;
}

interface IToolParameters {
  filePath: string;
  metrics?: string[];
}

// In-memory cache for analysis results
const analysisCache = new Map<string, any>();

/**
 * Analyze a repository's dependencies and structure
 */
export async function analyzeRepository(
  repositoryUrl?: string,
  fileContent?: string,
  language?: string,
): Promise<any> {
  return executeWithTiming('analyze-repository', async () => {
    if (repositoryUrl) {
      const repoPath = await getRepository(repositoryUrl);
      const files = listFiles(repoPath);
      const analysisId = uuidv4();

      // Perform dependency analysis
      const dependencies = extractDependencies(repoPath, files, language);

      // Store results in cache
      const results = {
        repositoryUrl,
        analysisId,
        dependencies,
        fileCount: files.length,
        timestamp: new Date().toISOString(),
      };

      analysisCache.set(analysisId, results);
      return results;
    } else if (fileContent) {
      // Analyze single file content
      const dependencies = analyzeCode(fileContent, language);
      return {
        analysisId: uuidv4(),
        dependencies,
        timestamp: new Date().toISOString(),
      };
    } else {
      throw new Error('Either repositoryUrl or fileContent must be provided');
    }
  });
}

/**
 * Analyze a single code snippet
 */
export function analyzeCode(code: string, language?: string): IDetailedAnalysisResult {
  const metrics = calculateMetrics(code, language);
  let maintainability = Math.max(
    0,
    171 - 5.2 * Math.log(metrics.complexity.cyclomatic) - 0.23 * metrics.complexity.cognitive,
  );

  const issues: string[] = [];
  let readability = 100;

  // Basic metrics
  const lines = code.split('\n');
  const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;

  if (avgLineLength > 80) {
    readability -= 10;
    issues.push('Average line length exceeds 80 characters');
  }

  // Count long functions
  if (language === 'javascript' || language === 'typescript' || !language) {
    const functionRegex = /function\s+\w+\s*\([^)]*\)\s*{[\s\S]*?}/g;
    const functions = code.match(functionRegex) || [];

    for (const func of functions) {
      const funcLines = func.split('\n').length;
      if (funcLines > 20) {
        maintainability -= 5;
        issues.push(`Function exceeds 20 lines (${funcLines} lines)`);
      }
    }
  }

  // Check complexity thresholds
  if (metrics.complexity.cyclomatic > 10) {
    issues.push(`High cyclomatic complexity (${metrics.complexity.cyclomatic})`);
  }

  return {
    readability: Math.max(0, readability),
    maintainability: Math.max(0, maintainability),
    complexity: metrics.complexity,
    issues,
    imports: extractImports(code, language),
    classes: extractClasses(code, language),
    functions: extractFunctions(code, language),
  };
}

/**
 * Get metrics for files or a previous analysis
 */
export async function getMetrics(options: IMetricsOptions): Promise<any> {
  const { repositoryUrl, filePath, fileContent, language, metrics, analysisId, type } = options;

  // If analysisId is provided, retrieve from cache
  if (analysisId) {
    const cachedAnalysis = analysisCache.get(analysisId);
    if (!cachedAnalysis) {
      throw new Error(`Analysis not found: ${analysisId}`);
    }

    if (type) {
      return cachedAnalysis[type] || {};
    }

    return cachedAnalysis;
  }

  // Otherwise perform new analysis
  if (repositoryUrl) {
    const repoPath = await getRepository(repositoryUrl);

    if (filePath) {
      // Analyze specific file
      const fullPath = path.join(repoPath, filePath);
      const code = fs.readFileSync(fullPath, 'utf8');
      return calculateMetrics(code, language, metrics);
    } else {
      // Analyze entire repository
      const files = listFiles(repoPath);
      const allMetrics: Record<string, any> = {};

      for (const file of files) {
        const fullPath = path.join(repoPath, file);
        const code = fs.readFileSync(fullPath, 'utf8');
        allMetrics[file] = calculateMetrics(code, path.extname(file).slice(1), metrics);
      }
      return allMetrics;
    }
  } else if (filePath) {
    // Analyze local file
    const code = fs.readFileSync(filePath, 'utf8');
    return calculateMetrics(code, language, metrics);
  } else if (fileContent !== undefined) {
    // Analyze provided content
    return calculateMetrics(fileContent, language, metrics);
  } else {
    throw new Error('Either repositoryUrl, filePath, or fileContent must be provided');
  }
}

/**
 * Extract imported modules from code
 */
function extractImports(code: string, language?: string): string[] {
  // Basic implementation - would be replaced with language-specific parsers
  const imports: string[] = [];

  if (language === 'javascript' || language === 'typescript' || !language) {
    // Simple regex to find import statements (not comprehensive)
    const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = importRegex.exec(code)) !== null) {
      imports.push(match[1]);
    }
  }

  return imports;
}

/**
 * Extract function names from code
 */
function extractFunctions(code: string, language?: string): string[] {
  // Basic implementation - would be replaced with language-specific parsers
  const functions: string[] = [];

  if (language === 'javascript' || language === 'typescript' || !language) {
    // Simple regex to find function declarations (not comprehensive)
    const funcRegex = /function\s+(\w+)\s*\(/g;
    let match;
    while ((match = funcRegex.exec(code)) !== null) {
      functions.push(match[1]);
    }

    // Arrow functions with names
    const arrowFuncRegex = /const\s+(\w+)\s*=\s*(?:\([^)]*\)|\w+)\s*=>/g;
    while ((match = arrowFuncRegex.exec(code)) !== null) {
      functions.push(match[1]);
    }
  }

  return functions;
}

/**
 * Extract class names from code
 */
function extractClasses(code: string, language?: string): string[] {
  // Basic implementation - would be replaced with language-specific parsers
  const classes: string[] = [];

  if (language === 'javascript' || language === 'typescript' || !language) {
    // Simple regex to find class declarations (not comprehensive)
    const classRegex = /class\s+(\w+)(?:\s+extends\s+\w+)?/g;
    let match;
    while ((match = classRegex.exec(code)) !== null) {
      classes.push(match[1]);
    }
  }

  return classes;
}

/**
 * Extract dependencies from a repository
 */
function extractDependencies(
  repoPath: string,
  files: string[],
  language?: string,
): Record<string, string[]> {
  const dependencies: Record<string, string[]> = {};

  for (const file of files) {
    const fullPath = path.join(repoPath, file);
    try {
      const code = fs.readFileSync(fullPath, 'utf8');
      const fileLanguage = language || path.extname(file).slice(1);
      dependencies[file] = extractImports(code, fileLanguage);
    } catch (error) {
      console.warn(`Error reading file ${file}: ${(error as Error).message}`);
    }
  }

  return dependencies;
}

/**
 * Calculate complexity metrics for code
 */
function calculateMetrics(
  code: string,
  language?: string,
  metrics?: string[],
): IDetailedAnalysisResult {
  const result: IDetailedAnalysisResult = {
    readability: 100,
    maintainability: 100,
    complexity: {
      cyclomatic: 1,
      cognitive: 1,
      maintainability: 100,
    },
    issues: [],
    imports: [],
    classes: [],
    functions: [],
  };

  // Remove comments and normalize whitespace while preserving Unicode
  const codeWithoutComments = code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Handle empty files and files with only comments
  if (!codeWithoutComments) {
    return {
      ...result,
      complexity: {
        cyclomatic: 1,
        cognitive: 0,
        maintainability: 100,
      },
    };
  }

  // Check if the code has actual control structures (if, else, for, while, etc.)
  const hasControlStructures =
    /(?<![\\w\\u4e00-\\u9fff])(if|else|for|while|do|switch|case|catch|&&|\|\|)(?![\\w\\u4e00-\\u9fff])/gu.test(
      codeWithoutComments,
    );
  if (!hasControlStructures) {
    return {
      ...result,
      complexity: {
        cyclomatic: 1,
        cognitive: 0,
        maintainability: 100,
      },
    };
  }

  // Calculate cyclomatic complexity
  const branchingKeywords = [
    'if',
    'else',
    'for',
    'while',
    'do',
    'switch',
    'case',
    'catch',
    '&&',
    '||',
  ];

  let cyclomatic = 1; // Base complexity

  // Count control structures with Unicode-aware regex
  for (const keyword of branchingKeywords) {
    // Use a more precise regex that only matches whole words and not part of Unicode identifiers
    const regex = new RegExp(`(?<![\\w\\u4e00-\\u9fff])${keyword}(?![\\w\\u4e00-\\u9fff])`, 'gu');
    const matches = codeWithoutComments.match(regex);
    if (matches) {
      cyclomatic += matches.length;
    }
  }

  // Calculate cognitive complexity
  let cognitive = 1; // Base complexity

  // Count basic control structures with Unicode support
  const cognitiveKeywords = [
    'if',
    'else',
    'for',
    'while',
    'do',
    'switch',
    'try',
    'catch',
    'return',
    'throw',
  ];

  for (const keyword of cognitiveKeywords) {
    // Use a more precise regex that only matches whole words and not part of Unicode identifiers
    const regex = new RegExp(`(?<![\\w\\u4e00-\\u9fff])${keyword}(?![\\w\\u4e00-\\u9fff])`, 'gu');
    const matches = codeWithoutComments.match(regex);
    if (matches) {
      cognitive += matches.length;
    }
  }

  // Add nesting complexity with Unicode support
  const nestingRegex = /\{[^{]*\{/gu; // 'u' flag for Unicode support
  const nestingMatches = codeWithoutComments.match(nestingRegex);
  if (nestingMatches) {
    cognitive += nestingMatches.length * 2; // Each level of nesting adds 2 to cognitive complexity
  }

  // Ensure cognitive complexity is at least equal to cyclomatic complexity
  cognitive = Math.max(cognitive, cyclomatic);

  // Cap maximum complexity
  const MAX_CYCLOMATIC = 11; // Maximum allowed cyclomatic complexity
  const MAX_COGNITIVE = 50; // Maximum allowed cognitive complexity
  cyclomatic = Math.min(cyclomatic, MAX_CYCLOMATIC);
  cognitive = Math.min(cognitive, MAX_COGNITIVE);

  // Update complexity metrics
  result.complexity = {
    cyclomatic,
    cognitive,
    maintainability: Math.max(0, 171 - 5.2 * Math.log(cyclomatic) - 0.23 * cognitive),
  };

  return result;
}

/**
 * Calculate code quality metrics
 */
function calculateCodeQuality(
  code: string,
  language?: string,
): {
  readability: number;
  maintainability: number;
  complexity: number;
  issues: string[];
} {
  const issues: string[] = [];
  let readability = 100;
  let maintainability = 100;

  // Basic metrics
  const lines = code.split('\n');
  const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;

  if (avgLineLength > 80) {
    readability -= 10;
    issues.push('Average line length exceeds 80 characters');
  }

  // Count long functions
  if (language === 'javascript' || language === 'typescript' || !language) {
    const functionRegex = /function\s+\w+\s*\([^)]*\)\s*{[\s\S]*?}/g;
    const functions = code.match(functionRegex) || [];

    for (const func of functions) {
      const funcLines = func.split('\n').length;
      if (funcLines > 20) {
        maintainability -= 5;
        issues.push(`Function exceeds 20 lines (${funcLines} lines)`);
      }
    }
  }

  // Calculate complexity
  const complexity = calculateMetrics(code, language);
  maintainability -= complexity.complexity.cyclomatic * 2;

  if (complexity.complexity.cyclomatic > 10) {
    issues.push(`High cyclomatic complexity (${complexity.complexity.cyclomatic})`);
  }

  return {
    readability: Math.max(0, readability),
    maintainability: Math.max(0, maintainability),
    complexity: complexity.complexity.cyclomatic,
    issues,
  };
}

/**
 * Register analysis tools with MCP server
 */
export function registerAnalysisTools(server: McpServer) {
  server.tool(
    'calculate-metrics',
    {
      filePath: z.string().describe('Path to the file'),
      metrics: z
        .array(z.string())
        .optional()
        .describe('Metrics to calculate (complexity, maintainability, etc.)'),
    },
    async ({ filePath, metrics = ['complexity', 'maintainability'] }) => {
      const code = fs.readFileSync(filePath, 'utf8');
      const language = path.extname(filePath).slice(1);

      const result: Record<string, any> = {};

      if (metrics.includes('complexity')) {
        result.complexity = calculateMetrics(code, language);
      }

      if (metrics.includes('maintainability')) {
        result.maintainability = result.complexity?.cyclomatic || 0;
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );

  // Make sure this exact tool name is registered
  server.tool(
    'analyze-repository', // This name must match exactly what the CLI calls
    {
      repositoryUrl: z.string().describe('URL of the repository to analyze'),
      depth: z.number().default(2).describe('Analysis depth'),
      includeDependencies: z.boolean().default(true).describe('Include dependency analysis'),
      includeComplexity: z.boolean().default(true).describe('Include complexity analysis'),
      specificFiles: z.array(z.string()).optional().describe('Specific files to analyze'),
    },
    async args => {
      // Basic implementation
      console.log('Analyzing repository:', args.repositoryUrl);

      // Handle specific files if provided
      if (args.specificFiles && args.specificFiles.length > 0) {
        console.log('Analyzing specific files:', args.specificFiles);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                repository: args.repositoryUrl,
                analysisDepth: args.depth,
                result: 'Sample repository analysis results',
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );
}

// Register the complexity analysis tool
export function registerComplexityTool(mcp: McpServer) {
  mcp.tool(
    'complexity-analyzer',
    {
      filePath: z.string().describe('Path to the file to analyze'),
      metrics: z.array(z.string()).optional().describe('Specific metrics to calculate'),
    },
    async ({ filePath, metrics }) => {
      const code = fs.readFileSync(filePath, 'utf8');
      const result = calculateMetrics(code, path.extname(filePath).slice(1), metrics);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );
}

function analyzeCodeDetailed(
  code: string,
  language?: string,
  metrics: string[] = ['readability', 'maintainability', 'complexity'],
): IDetailedAnalysisResult {
  const result = calculateMetrics(code, language);

  // Apply any additional analysis based on requested metrics
  if (metrics.includes('readability')) {
    result.readability = calculateReadability(code, language);
  }

  if (metrics.includes('maintainability')) {
    result.maintainability = calculateMaintainability(code, language);
  }

  return result;
}

function calculateReadability(code: string, language?: string): number {
  let readability = 100;
  const lines = code.split('\n');
  const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;

  if (avgLineLength > 80) {
    readability -= 10;
  }

  return Math.max(0, readability);
}

function calculateMaintainability(code: string, language?: string): number {
  const complexity = calculateMetrics(code, language);
  return Math.max(
    0,
    171 - 5.2 * Math.log(complexity.complexity.cyclomatic) - 0.23 * complexity.complexity.cognitive,
  );
}
