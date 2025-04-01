export default {
  extends: ['@mcp/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    // Disable React rules since we're using Lit
    'react/jsx-filename-extension': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off',
  },
};
