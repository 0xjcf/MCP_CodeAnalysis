"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xstate_1 = require("xstate");
const counterMachine = (0, xstate_1.setup)({
    types: {
        events: {},
        context: {},
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
            actions: (0, xstate_1.assign)({
                count: ({ context }) => context.count + 1,
            }),
        },
        DEC: {
            actions: (0, xstate_1.assign)({
                count: ({ context }) => context.count - 1,
            }),
        },
    },
});
exports.default = counterMachine;
//# sourceMappingURL=xstateCounterMachine.js.map