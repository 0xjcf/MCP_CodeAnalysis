import { describe, it, expect } from 'vitest';
import { createWebComponentsAnalyzer } from '../src/analyzer';

describe('@mcp/web-components', () => {
  it('should create a WebComponentsAnalyzer instance', () => {
    const analyzer = createWebComponentsAnalyzer();
    expect(analyzer).toBeDefined();
    expect(typeof analyzer.analyze).toBe('function');
  });

  it('should return a valid analysis result', async () => {
    const analyzer = createWebComponentsAnalyzer();
    const result = await analyzer.analyze('// Test code');

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data.components)).toBe(true);
    expect(Array.isArray(result.data.lifecycleHooks)).toBe(true);
    expect(Array.isArray(result.data.shadowDOMUsage)).toBe(true);
    expect(Array.isArray(result.data.properties)).toBe(true);
    expect(Array.isArray(result.data.events)).toBe(true);
    expect(result.data.performance).toBeDefined();
  });
});
