/**
 * Core functionality for MCP Code Analysis
 * @module @mcp/core
 */

export interface IAnalyzer {
  analyze(source: string): Promise<IAnalysisResult>;
}

export interface IAnalysisResult {
  success: boolean;
  data: unknown;
  errors?: Error[];
  warnings?: string[];
}

export interface IAnalysisOptions {
  strict?: boolean;
  verbose?: boolean;
  timeout?: number;
}

// Export types that will be used across packages
export // Add more type exports as needed
 type {};
