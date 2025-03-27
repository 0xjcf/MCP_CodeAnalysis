module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', './typescript.js', './prettier.js', './react.js'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-unused-vars': 'off', // Using TypeScript's no-unused-vars instead
    'no-var': 'error',
    'prefer-const': 'error',

    // Best practices
    eqeqeq: ['error', 'always'],
    'no-return-await': 'error',
    'require-await': 'error',

    // Error prevention
    'no-duplicate-imports': 'error',
    'no-unused-expressions': 'error',
  },
};
