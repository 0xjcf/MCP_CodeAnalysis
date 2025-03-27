import { setup, assign } from 'xstate';

// Define the event types
type MCPEvent =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'ERROR'; error: string };

// Define the context type
interface MCPContext {
  error?: string;
}

export const MCPStateMachine = setup({
  types: {
    context: {} as MCPContext,
    events: {} as MCPEvent,
  },
  actions: {
    setError: assign({
      error: ({ event }) => {
        if (event.type === 'ERROR') {
          return event.error;
        }
        return undefined;
      },
    }),
  },
}).createMachine({
  id: 'mcpStateMachine',
  initial: 'idle',
  context: {},
  states: {
    idle: {
      on: {
        START: 'running',
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    running: {
      on: {
        PAUSE: 'paused',
        STOP: 'stopped',
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    paused: {
      on: {
        RESUME: 'running',
        STOP: 'stopped',
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    stopped: {
      type: 'final',
      on: {
        START: 'running',
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    error: {
      type: 'final',
      on: {
        START: 'running',
      },
    },
  },
});
