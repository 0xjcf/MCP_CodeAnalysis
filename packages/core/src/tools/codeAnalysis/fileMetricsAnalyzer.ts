import { promises as fs } from 'fs';

import type { IToolState } from '../../state/interfaces/toolExecutionService.js';
import type { ITool, IToolResult } from '../interfaces.js';

/**
 * Parameters for the file metrics analyzer tool
 */
interface IFileMetricsParams {
  /**
   * File path to analyze
   */
  filePath: string;

  /**
   * Optional file content (if already loaded)
   */
  fileContent?: string;

  /**
   * Whether to include detailed line metrics
   */
  includeLineMetrics?: boolean;
}

/**
 * Result of file metrics analysis
 */
interface IFileMetricsResult {
  /**
   * File path that was analyzed
   */
  filePath: string;

  /**
   * File size in bytes
   */
  sizeBytes: number;

  /**
   * Number of lines in the file
   */
  lineCount: number;

  /**
   * Number of code lines (non-empty, non-comment)
   */
  codeLines: number;

  /**
   * Number of comment lines
   */
  commentLines: number;

  /**
   * Number of blank lines
   */
  blankLines: number;

  /**
   * Cyclomatic complexity of the file
   */
  complexity: number;

  /**
   * Detailed metrics per line (if requested)
   */
  lineMetrics?: Array<{
    lineNumber: number;
    content: string;
    isCode: boolean;
    isComment: boolean;
    isBlank: boolean;
  }>;
}

/**
 * State interface for file metrics analyzer
 */
interface IFileMetricsState extends IToolState {
  fileCache: Map<
    string,
    {
      metrics: IFileMetricsResult;
      timestamp: number;
    }
  >;
}

/**
 * File metrics analyzer tool
 */
export class FileMetricsAnalyzer implements ITool<IFileMetricsParams, IFileMetricsResult> {
  id = 'fileMetricsAnalyzer';
  name = 'File Metrics Analyzer';
  description = 'Analyzes file metrics including size, line counts, and complexity';
  version = '1.0.0';
  category = 'codeAnalysis';

  /**
   * Executes the file metrics analysis
   */
  async execute(
    params: IFileMetricsParams,
    state: IFileMetricsState = { fileCache: new Map() },
  ): Promise<IToolResult<IFileMetricsResult>> {
    const { filePath, fileContent, includeLineMetrics } = params;

    try {
      // Check if we have this file in state cache and it's not older than 5 minutes
      const cachedResult = state.fileCache.get(filePath);
      if (cachedResult && Date.now() - cachedResult.timestamp < 5 * 60 * 1000) {
        return {
          result: cachedResult.metrics,
          state,
        };
      }

      // Load file content if not provided
      const content = fileContent ?? (await this.readFile(filePath));

      // Process file content
      const lines = content.split('\n');
      const sizeBytes = Buffer.byteLength(content, 'utf-8');
      let codeLineCount = 0;
      let commentLineCount = 0;
      let blankLineCount = 0;
      const lineMetrics: IFileMetricsResult['lineMetrics'] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const isComment = line.startsWith('//') || line.startsWith('/*') || line.startsWith('*');
        const isBlank = line.length === 0;

        if (isBlank) {
          blankLineCount++;
        } else if (isComment) {
          commentLineCount++;
        } else {
          codeLineCount++;
        }

        if (includeLineMetrics) {
          lineMetrics.push({
            lineNumber: i + 1,
            content: lines[i],
            isCode: !isBlank && !isComment,
            isComment,
            isBlank,
          });
        }
      }

      // Calculate complexity
      const complexity = this.calculateComplexity(content);

      const result: IFileMetricsResult = {
        filePath,
        sizeBytes,
        lineCount: lines.length,
        codeLines: codeLineCount,
        commentLines: commentLineCount,
        blankLines: blankLineCount,
        complexity,
        lineMetrics: includeLineMetrics ? lineMetrics : undefined,
      };

      // Update cache
      state.fileCache.set(filePath, {
        timestamp: Date.now(),
        metrics: result,
      });

      // Prune old entries if cache grows too large
      if (state.fileCache.size > 100) {
        const entries = Array.from(state.fileCache.entries());
        const oldestEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp).slice(0, 20);

        for (const [key] of oldestEntries) {
          state.fileCache.delete(key);
        }
      }

      return {
        result,
        state,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        error: errorMessage,
        state,
        result: {
          filePath,
          sizeBytes: 0,
          lineCount: 0,
          codeLines: 0,
          commentLines: 0,
          blankLines: 0,
          complexity: 0,
          lineMetrics: undefined,
        },
      };
    }
  }

  /**
   * Reads a file and returns its content
   * @throws Error if file cannot be read
   */
  private async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to read file: ${errorMessage}`);
    }
  }

  /**
   * Calculates cyclomatic complexity of code
   */
  private calculateComplexity(content: string): number {
    const controlFlowKeywords = [
      'if',
      'else if',
      'for',
      'while',
      'do',
      'switch',
      'case',
      'catch',
      '&&',
      '||',
      '?',
    ] as const;

    let complexity = 1; // Base complexity

    for (const keyword of controlFlowKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }
}
