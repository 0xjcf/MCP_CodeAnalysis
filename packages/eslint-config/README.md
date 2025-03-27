# @mcp/eslint-config

Shared ESLint configuration for MCP packages.

## Installation

```bash
pnpm add -D @mcp/eslint-config
```

## Usage

Add the following to your `.eslintrc.js`:

```javascript
module.exports = {
  extends: ["@mcp/eslint-config"],
};
```

## Features

This configuration includes:

- TypeScript support
- React and React Hooks rules
- Prettier integration
- Common best practices
- Accessibility rules

## Configuration Files

The package includes several configuration files that can be used independently:

- `index.js` - Base configuration
- `typescript.js` - TypeScript-specific rules
- `react.js` - React and React Hooks rules
- `prettier.js` - Prettier integration

## Requirements

- Node.js 18+
- ESLint 8.0+
- TypeScript 5.0+
- Prettier 3.0+

## Dependencies

- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- eslint-config-prettier
- eslint-plugin-react
- eslint-plugin-react-hooks

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
