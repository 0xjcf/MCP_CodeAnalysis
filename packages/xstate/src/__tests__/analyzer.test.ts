import { describe, it, expect } from 'vitest';
import { createMachine } from 'xstate';
import { XStateAnalyzer, XStateAnalysisData } from '../analyzer';

describe('XStateAnalyzer', () => {
  describe('Unit Tests - Pre-defined Machines', () => {
    const analyzer = new XStateAnalyzer();

    it('should analyze a simple state machine', async () => {
      const source = `
        import { createMachine } from 'xstate';

        export const machine = createMachine({
          id: 'timer',
          initial: 'idle',
          context: {
            elapsed: 0,
          },
          states: {
            idle: {
              on: {
                START: 'running',
              },
            },
            running: {
              invoke: {
                src: 'timerService',
                onDone: {
                  target: 'completed',
                  actions: 'logCompletion',
                },
              },
              on: {
                STOP: 'idle',
              },
            },
            completed: {
              type: 'final',
            },
          },
        });
      `;

      const result = await analyzer.analyze(source);
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

    it('should calculate complexity correctly', async () => {
      const source = `
        import { createMachine } from 'xstate';

        export const machine = createMachine({
          id: 'complex',
          initial: 'idle',
          states: {
            idle: {
              on: {
                START: 'running',
              },
            },
            running: {
              invoke: {
                src: 'timerService',
                onDone: {
                  target: 'completed',
                  actions: 'logCompletion',
                },
              },
              on: {
                STOP: 'idle',
              },
            },
            completed: {
              type: 'final',
            },
          },
        });
      `;

      const result = await analyzer.analyze(source);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      const data = result.data as XStateAnalysisData;
      expect(data.performance.complexity).toBeDefined();
    });
  });

  describe('Integration Tests - Source Code Analysis', () => {
    const analyzer = new XStateAnalyzer();

    it('should analyze a simple state machine from source', async () => {
      const source = `
        import { createMachine } from 'xstate';

        export const machine = createMachine({
          id: 'simple',
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

      const result = await analyzer.analyze(source);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      const data = result.data as XStateAnalysisData;
      expect(data.states).toContain('idle');
      expect(data.states).toContain('running');
      expect(data.transitions).toHaveLength(2);
      expect(data.performance.stateCount).toBe(2);
      expect(data.performance.transitionCount).toBe(2);
    });

    it('should handle errors gracefully', async () => {
      const source = 'invalid code';
      const result = await analyzer.analyze(source);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should analyze a complex state machine with services', async () => {
      const source = `
        import { createMachine } from 'xstate';

        export const machine = createMachine({
          id: 'complex',
          initial: 'idle',
          states: {
            idle: {
              on: {
                START: 'loading'
              }
            },
            loading: {
              invoke: {
                src: 'fetchData',
                onDone: 'success',
                onError: 'error'
              }
            },
            success: {
              on: {
                RESET: 'idle'
              }
            },
            error: {
              on: {
                RETRY: 'loading'
              }
            }
          }
        });
      `;

      const result = await analyzer.analyze(source);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      const data = result.data as XStateAnalysisData;
      expect(data.states).toHaveLength(4);
      expect(data.services).toHaveLength(1);
      expect(data.performance.complexity).toBe('medium');
    });
  });
});
