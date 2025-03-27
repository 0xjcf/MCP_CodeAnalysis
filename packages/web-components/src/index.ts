export * from './types';
export * from './analyzer';

// Re-export the factory function as the default export
export { createWebComponentsAnalyzer as default } from './analyzer';
