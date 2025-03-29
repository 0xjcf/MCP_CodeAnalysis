"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskManagerMachine = void 0;
const xstate_1 = require("xstate");
exports.taskManagerMachine = (0, xstate_1.setup)({
    types: {
        context: {},
        events: {},
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
                    guard: ({ context }) => context.tasks.length > 0 &&
                        context.tasks.every((task) => task.completed),
                },
            ],
            on: {
                ADD: {
                    actions: (0, xstate_1.assign)({
                        tasks: ({ context, event }) => [
                            ...context.tasks,
                            { name: event.name, priority: event.priority, completed: false },
                        ],
                    }),
                },
                TOGGLE: {
                    actions: (0, xstate_1.assign)({
                        tasks: ({ context, event }) => context.tasks.map((task, index) => index === event.index
                            ? { ...task, completed: !task.completed }
                            : task),
                    }),
                },
            },
        },
        completed: {
            on: {
                RESET: {
                    target: "active",
                    actions: (0, xstate_1.assign)({
                        tasks: () => [],
                    }),
                },
            },
        },
    },
});
//# sourceMappingURL=taskManagerMachine.js.map