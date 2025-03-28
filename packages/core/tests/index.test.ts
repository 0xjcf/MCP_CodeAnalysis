import { describe, it, expect } from 'vitest';
import type { Analyzer, AnalysisResult, AnalysisOptions } from '../src';

describe('@mcp/core', () => {
  it('should export required types', () => {
    // This is a placeholder test to verify our type exports
    const analyzer: Analyzer = {
      analyze: async () => ({ success: true, data: {} }),
    };
    const result: AnalysisResult = { success: true, data: {} };
    const options: AnalysisOptions = { strict: true };

    expect(analyzer).toBeDefined();
    expect(result).toBeDefined();
    expect(options).toBeDefined();
  });
});
