import { assign, setup } from "xstate";

interface AdvancedContext {
  count: number;
  darkMode: boolean;
  logs: string[];
}

type AdvancedEvent =
  | { type: "INC" }
  | { type: "DEC" }
  | { type: "TOGGLE_DARK" };

// Machine definition
export const advancedMachine = setup({
  types: {
    context: {} as AdvancedContext,
    events: {} as AdvancedEvent,
  },
}).createMachine({
  id: "advancedMachine",
  initial: "idle",
  context: {
    count: 0,
    darkMode: false,
    logs: ["Advanced Counter initialized"],
  },
  states: {
    idle: {
      on: {
        INC: {
          actions: assign({
            count: ({ context }) => context.count + 1,
            logs: ({ context }) => [
              ...context.logs,
              `Count incremented to ${context.count + 1}`,
            ],
          }),
        },
        DEC: {
          actions: assign({
            count: ({ context }) => context.count - 1,
            logs: ({ context }) => [
              ...context.logs,
              `Count decremented to ${context.count - 1}`,
            ],
          }),
        },
        TOGGLE_DARK: {
          actions: assign({
            darkMode: ({ context }) => !context.darkMode,
            logs: ({ context }) => [
              ...context.logs,
              `Dark mode set to ${!context.darkMode}`,
            ],
          }),
        },
      },
    },
  },
});
