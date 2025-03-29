import { describe, it, expect } from 'vitest';
import { XStateAnalyzer, XStateAnalysisData } from '../analyzer.js';
import { AnalysisOptions } from '@mcp/types';

describe('XStateAnalyzer', () => {
  describe('Simple State Machines', () => {
    const analyzer = new XStateAnalyzer();

    it('should analyze a simple state machine', async () => {
      const sourceCode = `
        import { createMachine } from 'xstate';

        export const machine = createMachine({
          initial: 'idle',
          states: {
            idle: {
              on: {
                START: 'running'
              }
            },
            running: {
              on: {
                STOP: 'idle'
              }
            }
          }
        });
      `;

      const result = await analyzer.analyze({ sourceCode });
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      const data = result.data as XStateAnalysisData;
      expect(data.states).toEqual(['idle', 'running']);
      expect(data.events).toEqual(['START', 'STOP']);
      expect(data.transitions).toEqual([
        { source: 'idle', target: 'running', event: 'START' },
        { source: 'running', target: 'idle', event: 'STOP' },
      ]);
      expect(data.performance).toBeDefined();
      expect(data.performance.stateCount).toBe(2);
      expect(data.performance.transitionCount).toBe(2);
      expect(data.performance.serviceCount).toBe(0);
      expect(data.performance.complexity).toBe('low');
    });

    it('should handle invalid source code', async () => {
      const sourceCode = 'invalid javascript code';
      const result = await analyzer.analyze({ sourceCode });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    const analyzer = new XStateAnalyzer();

    it('should handle invalid code gracefully', async () => {
      const result = await analyzer.analyze({ sourceCode: 'invalid code' });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toBeTruthy();
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

      const result = await analyzer.analyze({ sourceCode });
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
