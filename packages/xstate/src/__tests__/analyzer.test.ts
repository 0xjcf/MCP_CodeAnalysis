import { describe, it, expect } from 'vitest';
import { createMachine } from 'xstate';
import { XStateAnalyzer } from '../analyzer';

type TimerContext = {
  elapsed: number;
};

type TimerEvent = { type: 'START' } | { type: 'STOP' } | { type: 'TICK' };

const timerMachine = createMachine({
  id: 'timer',
  initial: 'idle',
  context: {
    elapsed: 0,
  },
  types: {
    context: {} as TimerContext,
    events: {} as TimerEvent,
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

describe('XStateAnalyzer', () => {
  it('should analyze a simple state machine', () => {
    const analyzer = new XStateAnalyzer(timerMachine);
    const analysis = analyzer.analyze();
    expect(analysis).toBeDefined();
  });

  it('should count states correctly', () => {
    const analyzer = new XStateAnalyzer(timerMachine);
    const analysis = analyzer.analyze();
    expect(analysis.stateCount).toBe(3);
  });

  it('should count transitions correctly', () => {
    const analyzer = new XStateAnalyzer(timerMachine);
    const analysis = analyzer.analyze();
    expect(analysis.transitionCount).toBe(3);
  });

  it('should count guards correctly', () => {
    const analyzer = new XStateAnalyzer(timerMachine);
    const analysis = analyzer.analyze();
    expect(analysis.guardCount).toBe(0);
  });

  it('should count actions correctly', () => {
    const analyzer = new XStateAnalyzer(timerMachine);
    const analysis = analyzer.analyze();
    expect(analysis.actionCount).toBe(1);
  });

  it('should count services correctly', () => {
    const analyzer = new XStateAnalyzer(timerMachine);
    const analysis = analyzer.analyze();
    expect(analysis.serviceCount).toBe(1);
  });

  it('should calculate complexity correctly', () => {
    const analyzer = new XStateAnalyzer(timerMachine);
    const analysis = analyzer.analyze();
    expect(analysis.complexity).toBeGreaterThan(0);
  });

  it('should analyze a complex state machine with guards and actions', () => {
    const complexMachine = createMachine({
      id: 'complex',
      initial: 'idle',
      context: {},
      states: {
        idle: {
          on: {
            START: {
              target: 'running',
              guard: 'isValid',
              actions: ['logStart'],
            },
          },
        },
        running: {
          on: {
            STOP: 'idle',
          },
        },
      },
    });

    const analyzer = new XStateAnalyzer(complexMachine);
    const analysis = analyzer.analyze();

    expect(analysis.guardCount).toBe(1);
    expect(analysis.actionCount).toBe(1);
  });
});
