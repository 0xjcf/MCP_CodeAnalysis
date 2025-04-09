import { describe, it, expect } from 'vitest';
import type { IAnalyzer, IAnalysisResult, IAnalysisOptions } from '../src/index.js';

describe('@mcp/core', () => {
  it('should export required types', () => {
    // This is a placeholder test to verify our type exports
    const analyzer: IAnalyzer = {
      analyze: async (source: string) => ({ success: true, data: {} }),
    };
    const result: IAnalysisResult = { success: true, data: {} };
    const options: IAnalysisOptions = { strict: true };

    expect(analyzer).toBeDefined();
    expect(result).toBeDefined();
    expect(options).toBeDefined();
  });
});
