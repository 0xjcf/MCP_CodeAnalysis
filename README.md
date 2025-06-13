# MCP Code Analysis

A powerful codebase analysis toolkit that leverages the Model Context Protocol (MCP) for AI-assisted code understanding and transformation.

<a href="https://glama.ai/mcp/servers/@0xjcf/MCP_CodeAnalysis">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@0xjcf/MCP_CodeAnalysis/badge" alt="CodeAnalysis Server MCP server" />
</a>

## Features

- **Code Analysis**: Parse and analyze codebases with abstract syntax trees
- **Context Generation**: Create rich contextual information for AI models
- **Tool Integration**: Built on the MCP SDK for seamless AI tool integration
- **Extensible Architecture**: Plugin-based system for custom analyzers

## Requirements

- Node.js 18+
- NPM 9+
- Redis (optional, only required for production environments)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-codeanalysis.git
cd mcp-codeanalysis

# Install dependencies
npm install

# Build the project
npm run build
```

## Redis Configuration (Optional)

Redis is used for session storage in production environments. For development and testing, the system will automatically fall back to an in-memory session store if Redis is not available.

> **Note**: There is a known issue with Redis connectivity where operations may fail even when Redis is running. See the "Tech Debt" section in `plan.md` for details. For now, you can use the `./use-memory-session.sh` script to run the server with the memory session store. For more information, see [Redis Troubleshooting Guide](./docs/redis-troubleshooting.md).

To install Redis:

```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Windows (using WSL is recommended)
# For native Windows, download from https://redis.io/download
```

By default, the application tries to connect to Redis at `redis://localhost:6379`. You can configure the Redis connection using environment variables:

```bash
# Set custom Redis URL
export REDIS_URL=redis://custom-host:6379

# Force memory session store even if Redis is available
export FORCE_MEMORY_SESSION=true
```

## Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## Usage

```bash
# Start the MCP server
npm start

# Run CLI tool
node ./tools/mcp-stdio-client.js --task "Analyze dependencies" --files "src/*.ts"
```

## Documentation

- [Session Store Architecture](./docs/session-store.md)
- [Redis Integration](./docs/redis-integration.md)
- [MCP Protocol](./docs/mcp-protocol.md)

## License

MIT

# CodeAnalysis MCP Server

A comprehensive Model Context Protocol (MCP) server for advanced code analysis, providing tools and insights through an extensible architecture.

## 🚀 Features

- **Basic Code Analysis**: Syntax and structure analysis
- **Code Metrics**: Complexity, line counts, and code quality metrics
- **Dependency Analysis**: Package and import relationship visualization
- **Knowledge Graph**: Code relationships visualization and querying
- **Memory System**: Store and retrieve insights about codebases
- **Visualizations**: Generate diagrams in multiple formats (Mermaid, DOT, ASCII)
- **Socio-Technical Analysis**: Understand team and code relationships
- **Multi-Repository Analysis**: Cross-repository relationship analysis
- **Evolution Planning**: Code improvement recommendations
- **Live Watching**: Monitor code changes in real-time
- **IDE Integration**: Tools for editor integration
- **Developer Tools**: Enhanced AI-assisted development workflow support

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Redis (optional for development, recommended for production)

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/codeanalysis-mcp.git
cd codeanalysis-mcp

# Install dependencies
pnpm install

# Build the project
pnpm build
```

## 🖥️ Usage

The CodeAnalysis MCP server can be used in two ways:

### 1. As an MCP Server

```bash
# Start the MCP server
pnpm start
```

This starts the MCP server that can be connected to by any MCP client like Claude Desktop, Cursor, or others.

### 2. Using the CLI

The project includes a comprehensive CLI for direct interaction:

```bash
# Get help
pnpm run cli --help

# Analyze a repository or directory
pnpm run cli analyze repo ./src

# Check code quality
pnpm run cli quality analyze ./src
```

### 3. Using Developer Tools for AI-Assisted Development

The project includes special tools designed to enhance AI-assisted development:

```bash
# Generate code context for AI assistants
node tools/ai-dev-helper.js --task="Implement new feature" --search="related functionality"

# Run example client
node examples/dev-tools-client.js
```

See the [Developer Tools Guide](docs/dev-tools-guide.md) for detailed information.

## 📊 Example Commands

### Basic Analysis

```bash
# Analyze a local directory
pnpm run cli analyze repo ./src

# Analyze a specific file
pnpm run cli analyze file ./src/server.ts
```

### Code Metrics

```bash
# Get code metrics with function details
pnpm run cli metrics analyze ./src --functions

# Save metrics to a file
pnpm run cli metrics analyze ./src -o metrics-report.json
```

### Dependency Analysis

```bash
# Analyze dependencies in Mermaid format
pnpm run cli dependencies analyze ./src -f mermaid -o deps.mmd

# Visualize dependencies
pnpm run cli visualize dependencies -p ./src --format mermaid
```

### Code Quality

```bash
# Run quality analysis
pnpm run cli quality analyze ./src

# Generate HTML report
pnpm run cli quality analyze ./src --html -o quality-report.html
```

### Knowledge Graph

```bash
# Build knowledge graph
pnpm run cli knowledge build ./src

# Query the knowledge graph
pnpm run cli knowledge query ./src "type:function AND complexity>5"

# Export as diagram
pnpm run cli knowledge export ./src -f mermaid
```

### Insights & Memory

```bash
# Store an insight
pnpm run cli insights store -r ./src -t code-pattern -c "Refactoring opportunity"

# Retrieve insights
pnpm run cli insights retrieve -r ./src
```

### Developer Tools

```bash
# Prepare context for AI interactions
node tools/ai-dev-helper.js --task="Fix authentication bug" --files="src/auth/*.ts" --search="login"

# Use with AI prompts
# Copy content from the generated ai-context.json file into your AI assistant prompt
# or use the template in templates/ai-prompt-template.md
```

## 🏗️ Architecture

The project follows the MCP architecture with these components:

1. **MCP Server**: Core server implementation using the MCP protocol
2. **Analysis Features**: Modular code analysis capabilities
3. **CLI**: Command-line interface for direct interaction
4. **Transport Layer**: Communication mechanism (stdio by default)

## 🔌 Integration with MCP Clients

This server is compatible with any MCP-compliant client, including:

- Claude Desktop App
- Cursor Editor
- Continue
- Other MCP-compatible tools

## 📝 Path Specification

Commands accept paths in various formats:

- Local directory: `./src` or `/absolute/path/to/dir`
- Local file: `./src/file.ts` or `/path/to/file.ts`
- Repository URL: `https://github.com/username/repo`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

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
createStatefulTool(server, "my-tool", schema, handler);

// With description
createStatefulTool(server, "my-tool", "My stateful tool", schema, handler);
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
import { createServer } from "@modelcontextprotocol/sdk";
import { createStatefulTool } from "./state/helpers/statefulTool";
import { z } from "zod";

const server = createServer();

// Register a stateful tool
createStatefulTool(
  server,
  "counter",
  "A tool that maintains a count between invocations",
  {
    action: z.enum(["increment", "decrement", "reset"]),
  },
  async (params) => {
    // Get session ID from params (or a new one will be created)
    const sessionId = params.sessionId;

    // Process the action
    let count = 0;

    // Tool logic with state manipulation...

    return { count };
  }
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

### Client Scripts

The repository includes several client scripts in the `tools/` directory:

- **HTTP Client** (`tools/http-client.js`): Connects to the MCP server via HTTP transport (default).

  ```bash
  node tools/http-client.js --task "Your task description" --files "src/features/*.ts" --search "session"
  ```

- **Raw Client** (`tools/mcp-raw-client.js`): A simpler client that only captures server information.

  ```bash
  node tools/mcp-raw-client.js --task "Your task description"
  ```

- **Simple Client** (`tools/simple-client.js`): Communicates with the server via stdio.
  ```bash
  node tools/simple-client.js --task "Your task description" --files "src/features/*.ts"
  ```

All client scripts generate an `ai-context.json` file in the project root. This file contains valuable context about your codebase that can be shared with AI assistants to provide better-informed responses.

### Prompt Template

A prompt template for AI assistants is available at `templates/ai-prompt-template.md`. This template helps structure your requests to AI assistants with proper context from the MCP tools.

### Server Transport Modes

The MCP server supports two transport modes:

1. **HTTP Transport** (default): Runs on port 3000 by default. Best for client-server architecture.
2. **Stdio Transport**: For direct process communication. Set the `STDIO_TRANSPORT=true` environment variable to enable.

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