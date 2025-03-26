import { assign, setup } from "xstate";

interface TaskContext {
  tasks: { name: string; priority: string; completed: boolean }[];
}

type TaskEvent =
  | { type: "ADD"; name: string; priority: string }
  | { type: "TOGGLE"; index: number }
  | { type: "RESET" };

export const taskManagerMachine = setup({
  types: {
    context: {} as TaskContext,
    events: {} as TaskEvent,
  },
}).createMachine({
  id: "taskManager",
  initial: "active",
  context: {
    tasks: [
      { name: "Buy groceries", priority: "High", completed: false },
      { name: "Write blog post", priority: "Medium", completed: true },
    ],
  },
  states: {
    active: {
      always: [
        {
          target: "completed",
          guard: ({ context }) =>
            context.tasks.length > 0 &&
            context.tasks.every((task) => task.completed),
        },
      ],
      on: {
        ADD: {
          actions: assign({
            tasks: ({ context, event }) => [
              ...context.tasks,
              { name: event.name, priority: event.priority, completed: false },
            ],
          }),
        },
        TOGGLE: {
          actions: assign({
            tasks: ({ context, event }) =>
              context.tasks.map((task, index) =>
                index === event.index
                  ? { ...task, completed: !task.completed }
                  : task
              ),
          }),
        },
      },
    },
    completed: {
      on: {
        RESET: {
          target: "active",
          actions: assign({
            tasks: () => [],
          }),
        },
      },
    },
  },
});
