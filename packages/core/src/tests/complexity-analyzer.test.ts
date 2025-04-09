import { describe, it, expect } from 'vitest';

import { analyzeCode, getMetrics } from '../features/basic-analysis/analyzer.js';

describe('Complexity Analyzer Edge Cases', () => {
  // Test empty file analysis
  it('should handle empty files correctly', async () => {
    const result = await getMetrics({
      fileContent: '',
      language: 'typescript',
    });
    expect(result).toBeDefined();
    expect(result.complexity).toBeDefined();
    expect(result.complexity.cyclomatic).toBe(1); // Base complexity for empty file
    expect(result.complexity.cognitive).toBe(0);
  });

  // Test file with only comments
  it('should handle files with only comments', async () => {
    const code = `
      // This is a comment
      /* This is a block comment */
      /**
       * This is a JSDoc comment
       */
    `;
    const result = await getMetrics({
      fileContent: code,
      language: 'typescript',
    });
    expect(result).toBeDefined();
    expect(result.complexity).toBeDefined();
    expect(result.complexity.cyclomatic).toBe(1); // Base complexity for file with only comments
    expect(result.complexity.cognitive).toBe(0);
  });

  // Test file with complex nested structures
  it('should handle complex nested structures', async () => {
    const code = `
      function complexFunction() {
        if (condition1) {
          while (condition2) {
            for (let i = 0; i < 10; i++) {
              if (condition3) {
                switch (value) {
                  case 1:
                    return true;
                  case 2:
                    return false;
                  default:
                    throw new Error();
                }
              }
            }
          }
        }
      }
    `;
    const result = await getMetrics({
      fileContent: code,
      language: 'typescript',
    });
    expect(result).toBeDefined();
    expect(result.complexity).toBeDefined();
    expect(result.complexity.cyclomatic).toBeGreaterThan(5); // High cyclomatic complexity
    expect(result.complexity.cognitive).toBeGreaterThan(5); // High cognitive complexity
  });

  // Test file with Unicode characters
  it('should handle Unicode characters correctly', async () => {
    const code = `
      // Test with Unicode characters
      const 你好 = "Hello";
      function 测试函数() {
        return 你好;
      }
    `;
    const result = await getMetrics({
      fileContent: code,
      language: 'typescript',
    });
    expect(result).toBeDefined();
    expect(result.complexity).toBeDefined();
    expect(result.complexity.cyclomatic).toBe(1);
    expect(result.complexity.cognitive).toBe(0);
  });

  // Test file with maximum allowed complexity
  it('should handle files with maximum allowed complexity', async () => {
    const code = `
      function maxComplexity() {
        if (c1) {
          if (c2) {
            if (c3) {
              if (c4) {
                if (c5) {
                  if (c6) {
                    if (c7) {
                      if (c8) {
                        if (c9) {
                          if (c10) {
                            return true;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return false;
      }
    `;
    const result = await getMetrics({
      fileContent: code,
      language: 'typescript',
    });
    expect(result).toBeDefined();
    expect(result.complexity).toBeDefined();
    expect(result.complexity.cyclomatic).toBe(11); // 10 conditions + 1 base
    expect(result.complexity.cognitive).toBeGreaterThan(10);
  });

  // Test property-based assertions
  it('should maintain property-based invariants', async () => {
    const code = `
      function testFunction() {
        if (condition) {
          return true;
        }
        return false;
      }
    `;
    const result = await getMetrics({
      fileContent: code,
      language: 'typescript',
    });

    // Property 1: Cyclomatic complexity should be non-negative
    expect(result.complexity.cyclomatic).toBeGreaterThanOrEqual(1);

    // Property 2: Cognitive complexity should be >= cyclomatic complexity
    expect(result.complexity.cognitive).toBeGreaterThanOrEqual(result.complexity.cyclomatic);

    // Property 3: Analysis should be idempotent
    const result2 = await getMetrics({
      fileContent: code,
      language: 'typescript',
    });
    expect(result).toEqual(result2);
  });

  // Test error handling
  it('should handle invalid input gracefully', async () => {
    // @ts-ignore - Testing invalid input
    await expect(getMetrics({})).rejects.toThrow();
    // @ts-ignore - Testing invalid input
    await expect(getMetrics({ fileContent: null })).rejects.toThrow();
    // @ts-ignore - Testing invalid input
    await expect(getMetrics({ language: null })).rejects.toThrow();
  });
});
