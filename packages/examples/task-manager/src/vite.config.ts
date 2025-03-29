import { defineConfig } from 'vite';

export default defineConfig({
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
