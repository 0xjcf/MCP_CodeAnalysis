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
