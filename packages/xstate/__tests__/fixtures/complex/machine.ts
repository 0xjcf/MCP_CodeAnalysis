import { createMachine } from 'xstate';

export const machine = createMachine({
  id: 'complex',
  initial: 'idle',
  context: {
    data: null,
    error: null,
    retries: 0,
  },
  states: {
    idle: {
      on: {
        START: {
          target: 'loading',
          actions: 'resetRetries',
        },
      },
    },
    loading: {
      entry: 'logLoadingStart',
      invoke: {
        src: 'fetchData',
        onDone: {
          target: 'success',
          actions: ['setData', 'logSuccess'],
        },
        onError: {
          target: 'error',
          actions: ['setError', 'logError'],
        },
      },
      on: {
        CANCEL: {
          target: 'idle',
          actions: 'cleanup',
        },
      },
    },
    success: {
      entry: 'notifySuccess',
      on: {
        RESET: {
          target: 'idle',
          actions: 'resetData',
        },
        UPDATE: 'loading',
      },
    },
    error: {
      entry: 'notifyError',
      on: {
        RETRY: {
          target: 'loading',
          actions: 'incrementRetries',
          guard: 'canRetry',
        },
        RESET: {
          target: 'idle',
          actions: ['resetData', 'resetError'],
        },
      },
    },
  },
});
