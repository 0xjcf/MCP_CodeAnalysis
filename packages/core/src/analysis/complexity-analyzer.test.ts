import { describe, expect, test, beforeEach } from '@jest/globals';

import { ComplexityAnalyzer } from './complexityAnalyzer.js';

describe('ComplexityAnalyzer', () => {
  let analyzer: ComplexityAnalyzer;

  beforeEach(() => {
    analyzer = new ComplexityAnalyzer();
  });

  test('should handle empty code', () => {
    const result = analyzer.analyze('');
    expect(result.complexity.cyclomatic).toBe(1);
    expect(result.complexity.cognitive).toBe(0);
  });

  test('should handle simple code', () => {
    const code = `
      function add(a, b) {
        return a + b;
      }
    `;
    const result = analyzer.analyze(code);
    expect(result.complexity.cyclomatic).toBe(1);
    expect(result.complexity.cognitive).toBe(1);
  });

  test('should handle control structures', () => {
    const code = `
      if (x > 0) {
        if (y > 0) {
          return true;
        }
      }
      return false;
    `;
    const result = analyzer.analyze(code);
    expect(result.complexity.cyclomatic).toBe(3);
    expect(result.complexity.cognitive).toBe(2);
  });

  test('should handle logical operators', () => {
    const code = `
      if (x > 0 && y > 0) {
        return true;
      }
      return false;
    `;
    const result = analyzer.analyze(code);
    expect(result.complexity.cyclomatic).toBe(2);
    expect(result.complexity.cognitive).toBe(2);
  });

  test('should handle Unicode characters correctly', () => {
    const code = `
      const 你好 = "world";
      if (你好 === "world") {
        return true;
      }
      return false;
    `;
    const result = analyzer.analyze(code);
    expect(result.complexity.cyclomatic).toBe(2);
    expect(result.complexity.cognitive).toBe(1);
  });

  test('should handle files with maximum allowed complexity', () => {
    const code = `
      function complex() {
        if (a && b) {
          if (c || d) {
            if (e && f) {
              if (g || h) {
                if (i && j) {
                  return true;
                }
              }
            }
          }
        }
        return false;
      }
    `;
    const result = analyzer.analyze(code);
    expect(result.complexity.cyclomatic).toBe(6);
    expect(result.complexity.cognitive).toBe(10);
  });
});
