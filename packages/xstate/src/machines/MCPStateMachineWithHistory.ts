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
  history: string[];
  error?: string;
}

// Define the state type
type MCPState = 'idle' | 'running' | 'paused' | 'stopped' | 'error';

// TODO: Properly type the actions with XState v5's type system
// Current limitations:
// 1. The assign function requires 5 type arguments including ProvidedActor
// 2. Action types in transitions need to be properly typed for each specific event type
// 3. The type assertions (as any) are temporary workarounds

export const MCPStateMachineWithHistory = setup({
  types: {
    context: {} as MCPContext,
    events: {} as MCPEvent,
  },
  actions: {
    updateHistory: assign({
      history: ({ context, event }) => {
        const stateName =
          event.type === 'START'
            ? 'running'
            : event.type === 'PAUSE'
              ? 'paused'
              : event.type === 'RESUME'
                ? 'running'
                : event.type === 'STOP'
                  ? 'stopped'
                  : 'error';

        // Don't add final states to history
        if (stateName === 'stopped' || stateName === 'error') {
          return context.history;
        }

        return [...context.history, stateName];
      },
    }),
    setError: assign({
      history: ({ context }) => [...context.history, 'error'],
      error: ({ event }) => {
        if (event.type === 'ERROR') {
          return event.error;
        }
        return undefined;
      },
    }),
  },
}).createMachine({
  id: 'mcp',
  initial: 'idle',
  context: {
    history: ['idle'],
  },
  states: {
    idle: {
      on: {
        START: {
          target: 'running',
          actions: 'updateHistory',
        },
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    running: {
      on: {
        PAUSE: {
          target: 'paused',
          actions: 'updateHistory',
        },
        STOP: {
          target: 'stopped',
          actions: 'updateHistory',
        },
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    paused: {
      on: {
        RESUME: {
          target: 'running',
          actions: 'updateHistory',
        },
        STOP: {
          target: 'stopped',
          actions: 'updateHistory',
        },
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    stopped: {
      type: 'final',
      on: {
        START: {
          target: 'running',
          actions: 'updateHistory',
        },
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    error: {
      type: 'final',
      on: {
        START: {
          target: 'running',
          actions: 'updateHistory',
        },
      },
    },
  },
});
