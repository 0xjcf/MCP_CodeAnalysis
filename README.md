# MCP Code Analysis

This repository contains a modular code analysis framework designed to provide extensible tools for code quality measurement, architecture analysis, and developer guidance.

## Recent Improvements

- **Error Handling System**: Comprehensive error handling with standardized types and retry mechanisms
- **Parameter Handling**: Unified parameter handling utility across all client tools
- **Tool Discovery**: Enhanced discovery process with better reliability and fallback mechanisms
- **Documentation**: Consolidated planning and documentation into a single master plan

For detailed information about our current status and roadmap, see the [Master Plan](docs/MCP_MASTER_PLAN.md).

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/MCP_CodeAnalysis.git
cd MCP_CodeAnalysis

# Install dependencies
npm install

# Build the project
npm run build
```

### Starting the Server

```bash
# Start the server
npm start

# Start with verbose logging
VERBOSE=true npm start
```

### Using Client Tools

The project includes several client tools for interacting with the MCP server:

```bash
# Discover available tools
node tools/tool-discovery-client.js

# Use HTTP tool discovery
node tools/http-tool-discovery.js

# Test parameter handling
node tools/test-parameter-handler.js -p ./src -v
```

## Features

### Client Parameter Handling

All clients now support standardized parameter handling with features including:

- Command-line arguments (`--param value` or `-p value`)
- Environment variables (`MCP_PARAM_NAME=value`)
- Type validation and conversion
- Required parameter enforcement
- Help text generation (`--help`)

For details, see [Client Parameter Handling Specification](docs/client-parameter-handling-spec.md).

### Tool Discovery

The framework provides multiple methods to discover available tools:

- `tool-discovery-client.js` - Uses direct stdio connection
- `http-tool-discovery.js` - Uses HTTP/SSE connection

### Code Analysis

Various analysis tools are available:

- Repository structure analysis
- Code metrics calculation
- Dependency analysis
- Code quality assessment

### Complexity Analysis

The project includes a Rust-based complexity analyzer that provides detailed code complexity metrics:

- **Cyclomatic Complexity**: Measures the number of linearly independent paths through code
- **Cognitive Complexity**: Measures how difficult code is to understand
- **Halstead Metrics**: Measures vocabulary, volume, difficulty, and effort
- File and directory analysis with recursive scanning
- JSON/Text output formats with threshold filtering
- Comprehensive test suite including property-based tests

For detailed information about the complexity analyzer, see the [Complexity Analyzer Documentation](tools/complexity_analyzer/README.md).

## Development

### Building the Project

```bash
npm run build
```

### Running Tests

```bash
npm test
```

### Project Structure

- `/src` - Source code
- `/dist` - Compiled output
- `/tools` - Client tools and utilities
- `/docs` - Documentation

## Documentation

- [Master Plan](docs/MCP_MASTER_PLAN.md) - Current status, roadmap, and implementation plans
- [Getting Started Guide](docs/getting-started.md)
- [MCP Protocol Specification](docs/mcp-protocol.md)
- [Tool Development Guide](docs/tool-development.md)
- [Transport Layers](docs/transports.md)
- [Parameter Handler](docs/parameter-handler.md)
- [Client Parameter Handling Specification](docs/client-parameter-handling-spec.md)
- [Client Tools](tools/README.md)
- [Refactoring Guidelines](docs/refactoring-guidelines.md) - Guidelines for refactoring high-complexity code

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
