/**
 * Core functionality for MCP Code Analysis
 * @module @mcp/core
 */

export interface Analyzer {
  analyze(source: string): Promise<AnalysisResult>;
}

export interface AnalysisResult {
  success: boolean;
  data: unknown;
  errors?: Error[];
  warnings?: string[];
}

export interface AnalysisOptions {
  strict?: boolean;
  verbose?: boolean;
  timeout?: number;
}
