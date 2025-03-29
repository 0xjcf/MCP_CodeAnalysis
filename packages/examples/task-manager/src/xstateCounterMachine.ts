import { assign, setup } from "xstate";

const counterMachine = setup({
  types: {
    events: {} as { type: "START" } | { type: "INC" } | { type: "DEC" },
    context: {} as {
      count: number;
    },
  },
}).createMachine({
  id: "counter",
  initial: "idle",
  context: {
    count: 0,
  },
  states: {
    idle: {
      on: {
        START: {
          target: "active",
        },
      },
    },
    active: {},
  },
  on: {
    INC: {
      actions: assign({
        count: ({ context }) => context.count + 1,
      }),
    },

    DEC: {
      actions: assign({
        count: ({ context }) => context.count - 1,
      }),
    },
  },
});

export default counterMachine;
