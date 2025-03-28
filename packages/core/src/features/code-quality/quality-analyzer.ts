import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { analyzeCodeMetrics } from '../code-metrics/metrics-analyzer.js';

// Issue interface
interface QualityIssue {
  type: string;
  severity: 'error' | 'warning' | 'info';
  file: string;
  line?: number;
  column?: number;
  message: string;
  rule: string;
  context?: string;
}

// Rule interface for extensibility
interface QualityRule {
  id: string;
  name: string;
  description: string;
  languages: string[];
  severity: 'error' | 'warning' | 'info';
  analyze: (content: string, filePath: string, lineIndex?: number) => QualityIssue[];
}

// Result interface
interface QualityAnalysisResult {
  issueCount: {
    errors: number;
    warnings: number;
    info: number;
  };
  issues: QualityIssue[];
  summary: {
    byFile: Record<string, { errors: number; warnings: number; info: number }>;
    byRule: Record<string, { errors: number; warnings: number; info: number }>;
  };
  metadata: {
    analyzedFiles: number;
    languageBreakdown: Record<string, number>;
  };
}

// Rule registry - extensible rule collection
const ruleRegistry: QualityRule[] = [
  // JavaScript/TypeScript rules
  {
    id: 'no-console',
    name: 'No Console Statements',
    description: 'Avoid console statements in production code',
    languages: ['js', 'jsx', 'ts', 'tsx'],
    severity: 'warning',
    analyze: (content, filePath) => {
      const issues: QualityIssue[] = [];
      const lines = content.split('\n');
      
      lines.forEach((line, i) => {
        if (/console\.(log|warn|error|info|debug)\(/.test(line)) {
          issues.push({
            type: 'quality',
            severity: 'warning',
            file: filePath,
            line: i + 1,
            message: 'Console statement should be removed in production code',
            rule: 'no-console',
            context: line.trim()
          });
        }
      });
      
      return issues;
    }
  },
  {
    id: 'max-line-length',
    name: 'Maximum Line Length',
    description: 'Lines should not exceed 100 characters',
    languages: ['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'go', 'rb'],
    severity: 'info',
    analyze: (content, filePath) => {
      const issues: QualityIssue[] = [];
      const lines = content.split('\n');
      
      lines.forEach((line, i) => {
        if (line.length > 100) {
          issues.push({
            type: 'style',
            severity: 'info',
            file: filePath,
            line: i + 1,
            message: 'Line exceeds 100 characters',
            rule: 'max-line-length'
          });
        }
      });
      
      return issues;
    }
  },
  {
    id: 'no-empty-catch',
    name: 'No Empty Catch Blocks',
    description: 'Catch blocks should not be empty',
    languages: ['js', 'jsx', 'ts', 'tsx', 'java'],
    severity: 'warning',
    analyze: (content, filePath) => {
      const issues: QualityIssue[] = [];
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        if (/catch\s*\([^)]*\)\s*{/.test(lines[i])) {
          // Look for empty catch block
          let j = i + 1;
          let isEmpty = true;
          
          while (j < lines.length && !lines[j].includes('}')) {
            const trimmed = lines[j].trim();
            if (trimmed !== '' && !trimmed.startsWith('//')) {
              isEmpty = false;
              break;
            }
            j++;
          }
          
          if (isEmpty) {
            issues.push({
              type: 'error-handling',
              severity: 'warning',
              file: filePath,
              line: i + 1,
              message: 'Empty catch block',
              rule: 'no-empty-catch',
              context: lines[i].trim()
            });
          }
        }
      }
      
      return issues;
    }
  },
  // Generic rules for all languages
  {
    id: 'no-todo-comments',
    name: 'No TODO Comments',
    description: 'TODO comments should be addressed',
    languages: ['*'],
    severity: 'info',
    analyze: (content, filePath) => {
      const issues: QualityIssue[] = [];
      const lines = content.split('\n');
      
      lines.forEach((line, i) => {
        if (/(?:\/\/|\/\*|#|<!--)\s*(?:TODO|FIXME|XXX)/.test(line)) {
          issues.push({
            type: 'documentation',
            severity: 'info',
            file: filePath,
            line: i + 1,
            message: 'TODO comment found',
            rule: 'no-todo-comments',
            context: line.trim()
          });
        }
      });
      
      return issues;
    }
  }
];

// Add this mapping function somewhere at the top of the file
function getSeverityKey(severity: string): 'errors' | 'warnings' | 'info' {
  if (severity === 'error') return 'errors';
  if (severity === 'warning') return 'warnings';
  return 'info';
}

/**
 * Apply rules that match the file extension
 */
function applyRules(content: string, filePath: string, ext: string): QualityIssue[] {
  const issues: QualityIssue[] = [];
  
  // Get applicable rules for this file type
  const applicableRules = ruleRegistry.filter(rule => 
    rule.languages.includes('*') || rule.languages.includes(ext.replace('.', ''))
  );
  
  // Apply each rule
  for (const rule of applicableRules) {
    const ruleIssues = rule.analyze(content, filePath);
    issues.push(...ruleIssues);
  }
  
  return issues;
}

/**
 * Analyze code quality issues in a repository
 */
export async function analyzeCodeQuality(
  repositoryPath: string,
  options: {
    includePaths?: string[];
    excludePaths?: string[];
    maxIssues?: number;
    minSeverity?: 'error' | 'warning' | 'info';
  } = {}
): Promise<QualityAnalysisResult> {
  const {
    includePaths = ['**/*.*'],
    excludePaths = ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**'],
    maxIssues = 1000,
    minSeverity = 'warning'
  } = options;

  // Find files to analyze
  const files = await glob(includePaths, {
    cwd: repositoryPath,
    ignore: excludePaths,
    absolute: false,
    nodir: true
  });

  // Initialize result
  const result: QualityAnalysisResult = {
    issueCount: { errors: 0, warnings: 0, info: 0 },
    issues: [],
    summary: { byFile: {}, byRule: {} },
    metadata: { analyzedFiles: files.length, languageBreakdown: {} }
  };

  // Track language breakdown
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    result.metadata.languageBreakdown[ext] = (result.metadata.languageBreakdown[ext] || 0) + 1;
  }

  try {
    // Get code metrics for complexity-based issues
    const metricsResult = await analyzeCodeMetrics(repositoryPath);
    
    // Analyze each file
    let issueCount = 0;
    for (const file of files) {
      if (issueCount >= maxIssues) break;

      try {
        const fullPath = path.join(repositoryPath, file);
        const ext = path.extname(file).toLowerCase();
        const content = await fs.readFile(fullPath, 'utf8');
        
        // Apply rules to this file
        let fileIssues = applyRules(content, file, ext);
        
        // Add complexity-based issues by integrating with metrics data
        const fileMetrics = metricsResult.files?.find(f => f.filePath === file);
        if (fileMetrics && fileMetrics.cyclomaticComplexity > 10) {
          fileIssues.push({
            type: 'complexity',
            severity: 'warning',
            file: file,
            message: `High cyclomatic complexity: ${fileMetrics.cyclomaticComplexity}`,
            rule: 'max-complexity'
          });
        }
        
        // Filter by severity
        fileIssues = fileIssues.filter(issue => {
          if (minSeverity === 'error') return issue.severity === 'error';
          if (minSeverity === 'warning') return issue.severity === 'error' || issue.severity === 'warning';
          return true;
        });
        
        // Update summary
        if (fileIssues.length > 0) {
          result.summary.byFile[file] = { errors: 0, warnings: 0, info: 0 };
          
          for (const issue of fileIssues) {
            // Update issue counts using the mapping function
            const severityKey = getSeverityKey(issue.severity);
            result.issueCount[severityKey]++;
            result.summary.byFile[file][severityKey]++;
            
            // Update rule summary
            if (!result.summary.byRule[issue.rule]) {
              result.summary.byRule[issue.rule] = { errors: 0, warnings: 0, info: 0 };
            }
            result.summary.byRule[issue.rule][severityKey]++;
          }
        }
        
        // Add issues to result
        result.issues.push(...fileIssues);
        issueCount += fileIssues.length;
        
      } catch (error) {
        console.error(`Error analyzing file ${file}:`, error);
      }
    }
  } catch (error) {
    // Handle the error if code metrics analysis fails
    console.error('Error getting code metrics:', error);
    // Continue with just the regular quality analysis
  }
  
  // Sort issues by severity (errors first, then warnings, then info)
  result.issues.sort((a, b) => {
    const severityOrder = { error: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
  
  // Ensure we don't exceed maxIssues
  if (result.issues.length > maxIssues) {
    result.issues = result.issues.slice(0, maxIssues);
  }
  
  return result;
}

/**
 * Add a custom rule to the registry
 */
export function addQualityRule(rule: QualityRule): void {
  // Check if rule with this ID already exists
  const existingRuleIndex = ruleRegistry.findIndex(r => r.id === rule.id);
  if (existingRuleIndex >= 0) {
    // Replace existing rule
    ruleRegistry[existingRuleIndex] = rule;
  } else {
    // Add new rule
    ruleRegistry.push(rule);
  }
}

/**
 * Get all registered rules
 */
export function getQualityRules(): QualityRule[] {
  return [...ruleRegistry];
} 