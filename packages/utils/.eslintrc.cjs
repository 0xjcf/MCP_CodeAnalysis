module.exports = {
  root: true,
  extends: ['@mcp/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['*.d.ts'],
  rules: {
    'no-console': ['warn', { allow: ['error', 'warn', 'info', 'debug'] }],
  },
};
