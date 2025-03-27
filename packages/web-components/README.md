# @mcp/web-components

Web Components analyzer for MCP Code Analysis platform.

## Features

- Component lifecycle analysis
- Shadow DOM usage analysis
- Custom element analysis
- Property and event analysis
- Performance optimization suggestions

## Installation

```bash
pnpm add @mcp/web-components
```

## Usage

```typescript
import { WebComponentsAnalyzer } from "@mcp/web-components";

const analyzer = new WebComponentsAnalyzer();
const result = await analyzer.analyze(sourceCode);
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint
pnpm lint

# Format code
pnpm format
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit a pull request

## License

MIT
