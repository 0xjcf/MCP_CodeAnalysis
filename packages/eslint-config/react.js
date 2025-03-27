module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript for prop types
    'react/jsx-uses-react': 'off', // Not needed in React 17+
    'react/jsx-filename-extension': ['error', {
      extensions: ['.tsx', '.jsx'],
    }],
    'react/jsx-no-bind': ['warn', {
      allowArrowFunctions: true,
      allowFunctions: false,
      allowBind: false,
    }],
    'react/jsx-no-constructed-context-values': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-props': ['warn', {
      callbacksLast: true,
      shorthandFirst: true,
    }],
    
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // React best practices
    'react/no-array-index-key': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/no-unknown-property': 'error',
    'react/no-unstable-nested-components': 'error',
    'react/no-unused-prop-types': 'error',
    'react/self-closing-comp': ['error', {
      component: true,
      html: true,
    }],
    
    // React accessibility
    'react/no-access-state-in-setstate': 'error',
    'react/no-danger': 'warn',
    'react/no-deprecated': 'error',
    'react/no-did-mount-set-state': 'error',
    'react/no-did-update-set-state': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-is-mounted': 'error',
    'react/no-string-refs': 'error',
    'react/no-typos': 'error',
    'react/no-will-update-set-state': 'error',
  },
}; 