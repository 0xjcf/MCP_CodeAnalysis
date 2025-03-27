import { describe, it, expect } from 'vitest';
import { createMachine } from 'xstate';
import { XStateAnalyzer } from '../analyzer';

describe('XStateAnalyzer', () => {
  it('should analyze a simple state machine', () => {
    const machine = createMachine({
      id: 'test',
      initial: 'idle',
      states: {
        idle: {
          on: {
            START: 'running',
          },
        },
        running: {
          on: {
            STOP: 'idle',
          },
        },
      },
    });

    const analyzer = new XStateAnalyzer(machine);
    const result = analyzer.analyze();

    expect(result.stateCount).toBe(2);
    expect(result.transitionCount).toBe(2);
    expect(result.guardCount).toBe(0);
    expect(result.actionCount).toBe(0);
    expect(result.serviceCount).toBe(0);
    expect(result.hasParallelStates).toBe(false);
    expect(result.hasHistoryStates).toBe(false);
    expect(result.hasFinalStates).toBe(false);
    expect(result.complexity).toBe(2);
  });

  it('should analyze a complex state machine with guards and actions', () => {
    const machine = createMachine({
      id: 'test',
      initial: 'idle',
      states: {
        idle: {
          entry: ['logIdle'],
          on: {
            START: {
              target: 'running',
              guard: 'isReady',
            },
          },
        },
        running: {
          entry: ['logRunning'],
          invoke: {
            src: 'timer',
            onDone: 'completed',
          },
        },
        completed: {
          type: 'final',
        },
      },
    });

    const analyzer = new XStateAnalyzer(machine);
    const result = analyzer.analyze();

    expect(result.stateCount).toBe(3);
    expect(result.transitionCount).toBe(2);
    expect(result.guardCount).toBe(1);
    expect(result.actionCount).toBe(2);
    expect(result.serviceCount).toBe(1);
    expect(result.hasParallelStates).toBe(false);
    expect(result.hasHistoryStates).toBe(false);
    expect(result.hasFinalStates).toBe(true);
    expect(result.complexity).toBe(6);
  });
});
