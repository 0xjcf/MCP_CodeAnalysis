module.exports = {
  root: true,
  extends: ['@mcp/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
  },
};
