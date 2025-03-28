# MCP Code Analysis Examples

This directory contains example scripts that demonstrate how to use the MCP Code Analysis tools and components.

## Running Examples

Before running any examples, make sure you have built the project:

```bash
npm run build
```

Then, you can run any example using Node.js:

```bash
node examples/example-name.js
```

## Available Examples

### Session Store Example

Demonstrates the modular session store with different backend implementations:

```bash
node examples/session-store-example.js
```

This example shows:

- Checking Redis availability
- Using an explicit memory session store
- Using automatic backend detection
- Forcing memory store even if Redis is available

## Creating New Examples

When creating new examples:

1. Use clear, descriptive names ending with `-example.js`
2. Include a header comment explaining the purpose of the example
3. Add good documentation and comments throughout the code
4. Add your example to this README.md
5. Ensure the example works with the current build of the project
