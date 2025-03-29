"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advancedMachine = void 0;
const xstate_1 = require("xstate");
// Machine definition
exports.advancedMachine = (0, xstate_1.setup)({
    types: {
        context: {},
        events: {},
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
                    actions: (0, xstate_1.assign)({
                        count: ({ context }) => context.count + 1,
                        logs: ({ context }) => [
                            ...context.logs,
                            `Count incremented to ${context.count + 1}`,
                        ],
                    }),
                },
                DEC: {
                    actions: (0, xstate_1.assign)({
                        count: ({ context }) => context.count - 1,
                        logs: ({ context }) => [
                            ...context.logs,
                            `Count decremented to ${context.count - 1}`,
                        ],
                    }),
                },
                TOGGLE_DARK: {
                    actions: (0, xstate_1.assign)({
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
//# sourceMappingURL=advancedCounterMachine.js.map