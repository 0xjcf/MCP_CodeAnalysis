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
  previousState?: string;
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
      history: ({ context, event, self }) => {
        const currentState = String(self.getSnapshot().value);
        const nextState =
          event.type === 'START'
            ? currentState === 'error'
              ? 'idle'
              : currentState === 'idle'
                ? 'running'
                : 'running'
            : event.type === 'PAUSE'
              ? 'paused'
              : event.type === 'RESUME'
                ? 'running'
                : event.type === 'STOP'
                  ? 'stopped'
                  : event.type === 'ERROR'
                    ? 'error'
                    : currentState;

        return [...context.history, nextState];
      },
      previousState: ({ self }) => String(self.getSnapshot().value),
    }),
    setError: assign({
      history: ({ context }) => [...context.history, 'error'],
      error: ({ event }) => {
        if (event.type === 'ERROR') {
          return event.error;
        }
        return undefined;
      },
      previousState: ({ self }) => String(self.getSnapshot().value),
    }),
    clearError: assign({
      error: undefined,
    }),
    updateHistoryFromError: assign({
      history: ({ context }) => {
        const wasRunning = context.previousState === 'running';
        return [...context.history, 'idle', ...(wasRunning ? ['running'] : [])];
      },
      previousState: ({ self }) => String(self.getSnapshot().value),
    }),
  },
}).createMachine({
  id: 'mcp',
  initial: 'idle',
  context: {
    history: ['idle'],
    previousState: 'idle',
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
      on: {
        START: {
          target: 'running',
          actions: ['updateHistory', 'clearError'],
        },
        ERROR: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    error: {
      on: {
        START: {
          target: 'running',
          actions: ['updateHistoryFromError', 'clearError'],
        },
      },
    },
  },
});
