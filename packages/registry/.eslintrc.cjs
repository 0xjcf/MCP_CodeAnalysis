module.exports = {
  root: true,
  extends: ['@mcp/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'require-await': 'off',
  },
};
