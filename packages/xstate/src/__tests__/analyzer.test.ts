import { describe, it, expect } from 'vitest';
import { createMachine } from 'xstate';
import { XStateAnalyzer, XStateAnalysisData } from '../analyzer';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('XStateAnalyzer', () => {
  describe('Example Analysis', () => {
    const analyzer = new XStateAnalyzer();

    it('should analyze task manager state machine', async () => {
      const sourceCode = readFileSync(
        join(__dirname, '../../../../packages/examples/task-manager/taskManagerMachine.ts'),
        'utf-8',
      );

      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      const data = result.data as XStateAnalysisData;

      expect(data.states).toContain('idle');
      expect(data.states).toContain('loading');
      expect(data.states).toContain('success');
      expect(data.states).toContain('error');
      expect(data.performance.stateCount).toBe(4);
      expect(data.performance.transitionCount).toBeGreaterThan(0);
      expect(data.performance.serviceCount).toBe(1);
    });
  });

  describe('Simple State Machines', () => {
    const analyzer = new XStateAnalyzer();

    it('should analyze a simple state machine', async () => {
      const sourceCode = readFileSync(join(__dirname, './fixtures/simple/machine.ts'), 'utf-8');

      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      const data = result.data as XStateAnalysisData;
      expect(data.states).toContain('idle');
      expect(data.states).toContain('running');
      expect(data.states).toContain('completed');
      expect(data.performance.stateCount).toBe(3);
      expect(data.performance.transitionCount).toBe(3);
      expect(data.performance.serviceCount).toBe(1);
      expect(data.actions).toHaveLength(1);
    });
  });

  describe('Complex State Machines', () => {
    const analyzer = new XStateAnalyzer();

    it('should analyze a complex state machine', async () => {
      const sourceCode = readFileSync(join(__dirname, './fixtures/complex/machine.ts'), 'utf-8');

      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      const data = result.data as XStateAnalysisData;
      expect(data.states).toHaveLength(4);
      expect(data.services).toHaveLength(1);
      expect(data.performance.complexity).toBe('medium');
    });
  });

  describe('Edge Cases', () => {
    const analyzer = new XStateAnalyzer();

    it('should handle invalid code gracefully', async () => {
      const result = await analyzer.analyze('invalid code');
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should handle empty state machine', async () => {
      const sourceCode = `
        import { createMachine } from 'xstate';
        export const machine = createMachine({
          id: 'empty',
          initial: 'idle',
          states: {}
        });
      `;

      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      const data = result.data as XStateAnalysisData;
      expect(data.states).toHaveLength(0);
      expect(data.transitions).toHaveLength(0);
      expect(data.services).toHaveLength(0);
      expect(data.performance.complexity).toBe('low');
    });
  });
});
