# MCP Code Analysis

This repository contains a modular code analysis framework designed to provide extensible tools for code quality measurement, architecture analysis, and developer guidance.

## Project Purpose

The MCP Code Analysis framework is designed to provide AI-assisted code analysis through a centralized MCP server. This architecture allows:

1. **Centralized Analysis**: Run a single MCP server that can analyze any project
2. **Extensible Analyzers**: Plug in different analyzers (XState, Web Components, etc.) as needed
3. **AI Integration**: Connect AI tools to analyze code through the MCP server
4. **Real-time Analysis**: Get immediate feedback through SSE connections

## Architecture Overview

The project follows a client-server architecture:

```
[Developer's Project] <-> [MCP Server] <-> [Analyzers]
     ^                         ^
     |                         |
[AI Tools] <------------------+
```

### Core Components

1. **MCP Server**

   - Central server that manages analyzer connections
   - Handles SSE communication for real-time updates
   - Manages analyzer registration and execution

2. **Analyzers**

   - Modular analysis tools (XState, Web Components, etc.)
   - Each analyzer focuses on specific aspects of code
   - Can be enabled/disabled as needed

3. **Client Tools**
   - Tools for connecting to the MCP server
   - Handle communication with analyzers
   - Present analysis results

### Usage Pattern

1. Start the MCP server:

   ```bash
   pnpm start
   ```

2. Connect to the server via SSE:

   ```bash
   curl http://localhost:3000/sse
   ```

3. Use analyzers through the server:

   - XState analyzer for state machine analysis
   - Web Components analyzer for component analysis
   - More analyzers can be added as needed

4. Get AI-assisted analysis:
   - AI tools connect to the MCP server
   - Use analyzers to gather code insights
   - Provide recommendations based on analysis

## Project Structure

For detailed information about the project structure and best practices, see [Project Structure Documentation](docs/project-structure.md).

```
packages/
├── @mcp/core/                 # Core analysis framework
├── @mcp/web-components/       # Web Components analyzer
├── @mcp/xstate/              # XState analyzer
├── @mcp/eslint-config/       # Shared ESLint configuration
├── @mcp/tsconfig/            # Shared TypeScript configuration
└── @mcp/test-utils/          # Shared testing utilities

tools/
└── complexity_analyzer/       # Rust-based complexity analyzer

docs/
├── archive/                  # Archived documentation
└── templates/               # Documentation templates

templates/
├── session/                # Session management templates
└── analysis/              # Analysis templates
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- TypeScript 5.0+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/MCP_CodeAnalysis.git
cd MCP_CodeAnalysis

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

### Development

```bash
# Start development server
pnpm dev

# Run tests in watch mode
pnpm test:watch

# Build specific package
pnpm --filter @mcp/web-components build

# Test specific package
pnpm --filter @mcp/web-components test
```

## Features

### Web Components Analysis

The Web Components analyzer provides:

- Component lifecycle analysis
- Shadow DOM usage analysis
- Custom element analysis
- Property and event analysis
- Performance optimization suggestions

### XState Analysis

The XState analyzer provides:

- State machine analysis
- Transition analysis
- Guard and action analysis
- Service integration analysis
- Performance optimization suggestions

## Development Guidelines

For detailed development guidelines, see [Project Structure Documentation](docs/project-structure.md).

### Package Structure

Each analyzer package should follow this structure:

```
packages/@mcp/[analyzer-name]/
├── src/                    # Source code
├── tests/                  # Test files
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Package documentation
```

### Testing

- Use Vitest for testing
- Write unit tests for core functionality
- Include integration tests with example projects
- Maintain test coverage above 80%

### Documentation

- Document public APIs thoroughly
- Include usage examples
- Keep README files up to date
- Document breaking changes

### Code Quality

- Follow TypeScript best practices
- Use shared ESLint and TypeScript configs
- Maintain consistent code style
- Write meaningful commit messages

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Documentation

For detailed documentation, see the following:

- [Project Structure](docs/project-structure.md)
- [Development Guidelines](docs/project-structure.md#best-practices-for-new-features)
- [API Documentation](docs/api/)
- [Analysis Tools](docs/tools/)
- [Templates](docs/templates/)

# MCP SDK State Management Architecture

This project implements stateful tools for the Model Context Protocol (MCP) SDK, providing a framework for building tools that maintain context between invocations.

## Architecture Overview

The state management architecture is organized into several modular components:

```
src/state/
├── helpers/
│   └── statefulTool.ts       # Main entry point for stateful tool creation
├── machines/
│   └── toolMachine.ts        # XState machine for tool execution flow
├── services/
│   ├── toolService.ts        # Core execution service for tools
│   ├── redisToolExecutionService.ts  # Distributed execution service
│   ├── redisSessionStore.ts  # Redis-based session persistence
│   └── types.ts              # Shared type definitions
```

## Core Components

### Stateful Tool Helper (`statefulTool.ts`)

The central integration point with the MCP SDK, providing:

- Tool registration with session management
- MCP-compliant response formatting
- In-memory session management
- Helper functions for session access and manipulation

```typescript
// Creating a stateful tool with state persistence
createStatefulTool(server, 'my-tool', schema, handler);

// With description
createStatefulTool(server, 'my-tool', 'My stateful tool', schema, handler);
```

### Tool Machine (`toolMachine.ts`)

XState-based state machine that defines the execution flow for tools:

- State transitions (idle, toolSelected, parametersSet, executing, etc.)
- Context management for parameters, results, and history
- Error handling and recovery paths

This component delegates session management to the statefulTool implementation.

### Tool Service (`toolService.ts`)

Core execution service that coordinates tool state transitions:

- Manages tool selection, parameter validation, and execution
- Tracks execution history
- Handles execution results and errors

### Types (`types.ts`)

Shared type definitions that ensure consistency across the state management system:

- SessionData: Structure for storing tool state
- SessionStore: Interface for session storage implementations
- ExecutionResult: Standard response format for tools

## Integration with MCP SDK

The architecture integrates with the MCP SDK by:

1. Extending the tool registration pattern with state management
2. Maintaining compatibility with MCP's response format
3. Providing session and context tracking for stateful operations

## Usage Example

```typescript
import { createServer } from '@modelcontextprotocol/sdk';
import { createStatefulTool } from './state/helpers/statefulTool';
import { z } from 'zod';

const server = createServer();

// Register a stateful tool
createStatefulTool(
  server,
  'counter',
  'A tool that maintains a count between invocations',
  {
    action: z.enum(['increment', 'decrement', 'reset']),
  },
  async params => {
    // Get session ID from params (or a new one will be created)
    const sessionId = params.sessionId;

    // Process the action
    let count = 0;

    // Tool logic with state manipulation...

    return { count };
  },
);

server.listen(3000);
```

## Distributed State Management

For distributed environments, the Redis-based implementations provide:

- Session persistence across server restarts
- Distributed locking for concurrent access
- TTL-based session cleanup
- Error handling for network/connection issues

## Testing

The components include comprehensive test suites to verify:

- Tool state transitions
- Session management
- Error handling and recovery
- Response formatting
- Distributed operation (with Redis)

## AI Development Tools

The CodeAnalysis MCP Server provides specialized tools for AI-assisted development. These tools help collect code context that can be fed to AI systems for more effective assistance.

### Client Scripts Reference

For detailed usage instructions on client tools, see the [Using the MCP Server and Clients](#using-the-mcp-server-and-clients) section above.

The generated `ai-context.json` file contains valuable context about your codebase that can be shared with AI assistants to provide better-informed responses.

### Prompt Template

A prompt template for AI assistants is available at `templates/ai-prompt-template.md`. This template helps structure your requests to AI assistants with proper context from the MCP tools.

Example usage:

```
I've analyzed my codebase with the MCP Code Analysis tool and have the following context:

[Paste contents of ai-context.json here]

Based on this context, please help me [your specific question/request].
```

### Server Transport Modes

The MCP server supports two transport modes:

1. **HTTP Transport** (default): Runs on port 3000 by default. Best for client-server architecture.
2. **Stdio Transport**: For direct process communication. Set the `STDIO_TRANSPORT=true` environment variable to enable.

For advanced usage and configuration options, see the [MCP Protocol documentation](./docs/mcp-protocol.md).

## Session Storage Architecture

MCP Code Analysis now features a modular session store architecture with automatic backend detection:

- **Flexible Storage**: Automatically switches between Redis and in-memory storage
- **Development Friendly**: Run without Redis during development
- **Production Ready**: Use Redis for persistence in production environments
- **Automatic Fallback**: Gracefully falls back to memory storage when Redis is unavailable

For more details, see the [Session Store Architecture](docs/session-store.md) documentation.

## Requirements

- Node.js 18+
- npm or yarn
- Redis (optional for development, recommended for production)

## Best Practices for AI-Assisted Development

To get the most out of the MCP Code Analysis tools for AI-assisted development:

1. **Use the all-in-one script for simplicity**:

   ```bash
   node tools/ai-analyzer.js --task="Your specific task" --files="relevant/files/**/*.ts" --search="key terms"
   ```

2. **Scope your analysis appropriately**:

   - Use specific file patterns to focus on relevant code
   - Include search terms to narrow down the context
   - Use descriptive task names that explain what you're trying to accomplish

3. **Keep the MCP server running between analyses**:

   - Use `KEEP_SERVER=true node tools/ai-analyzer.js ...` to prevent automatic shutdown
   - This improves performance for multiple consecutive analyses

4. **Use context effectively with AI assistants**:

   - Share the generated `ai-context.json` with AI assistants
   - Ask specific questions related to the analyzed code
   - Refer to specific parts of the analysis in your questions

5. **Use CLI tools for deeper analysis**:
   ```bash
   # With the server already running
   npm run cli -- knowledge query ./src "type:class AND implements:SessionStore"
   ```

## Troubleshooting Common Issues

See the [Using the MCP Server and Clients](#using-the-mcp-server-and-clients) section for detailed troubleshooting steps.
