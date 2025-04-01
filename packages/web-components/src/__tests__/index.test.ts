import { describe, it, expect } from 'vitest';
import { WebComponentsAnalyzerImpl } from '../analyzer';

describe('@mcp/web-components', () => {
  it('should create a WebComponentsAnalyzer instance', () => {
    const analyzer = new WebComponentsAnalyzerImpl();
    expect(analyzer).toBeDefined();
    expect(typeof analyzer.analyze).toBe('function');
  });

  it('should return a valid analysis result', async () => {
    const analyzer = new WebComponentsAnalyzerImpl();
    const result = await analyzer.analyze('// Test code');

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.data.components)).toBe(true);
    expect(typeof result.totalComponents).toBe('number');
    expect(typeof result.totalCustomElements).toBe('number');
    expect(typeof result.totalShadowRoots).toBe('number');
    expect(typeof result.totalSlots).toBe('number');
    expect(typeof result.totalEvents).toBe('number');
    expect(typeof result.totalProperties).toBe('number');
    expect(result.performance).toBeDefined();
    expect(typeof result.performance.constructorTime).toBe('number');
    expect(typeof result.performance.renderTime).toBe('number');
    expect(typeof result.performance.updateTime).toBe('number');
    expect(typeof result.performance.memoryUsage).toBe('number');
  });
});
