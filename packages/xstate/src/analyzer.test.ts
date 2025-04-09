import { describe, it, expect } from 'vitest';
import { createMachine } from 'xstate';

import { XStateAnalyzer } from './analyzer.js';
import type { IXStateAnalysisData } from './types.js';

describe('XStateAnalyzer', () => {
  it('should analyze a simple state machine', async () => {
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

    const analyzer = new XStateAnalyzer();
    const result = await analyzer.analyze({ sourceCode: JSON.stringify(machine) });

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();

    const analysisData = result.data as IXStateAnalysisData;
    expect(analysisData.metrics.stateCount).toBe(2);
    expect(analysisData.metrics.transitionCount).toBe(2);
  });
});
