"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
exports.default = (0, vite_1.defineConfig)({
    server: {
        port: 8080,
    },
    build: {
        rollupOptions: {
            external: ['lit-html', 'xstate', 'ignite-element'],
        },
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
//# sourceMappingURL=vite.config.js.map