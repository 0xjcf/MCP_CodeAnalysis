# MCP Client Documentation

This document provides an overview of the different clients available in the MCP Code Analysis project, their purposes, and how to use them.

## Command Line Interface (CLI)

The MCP Code Analysis project includes a comprehensive CLI tool that provides various commands for analyzing codebases. The CLI is structured as a modular command system built with Commander.js.

### CLI Structure

- **Entry Point**: `src/client/cli/index.ts`
- **Commands Directory**: `src/client/cli/commands/`
- **Utilities**: `src/client/cli/utils/`

### Available Client Types

## 1. Analyze Client

**Purpose**: Performs code analysis on repositories, files, or the current project

**Commands**:

- `analyze repo <repository-url>`: Analyze a Git repository
- `analyze file <file-path>`: Analyze a single file
- `analyze current`: Analyze the current project/workspace

**Usage Example**:

```bash
# Analyze the current project
codeanalysis analyze current

# Analyze a specific file
codeanalysis analyze file src/server.ts

# Analyze a remote repository
codeanalysis analyze repo https://github.com/username/repo
```

**Options**:

- `--depth <depth>`: Analysis depth (1-3)
- `--dependencies`: Analyze dependencies
- `--complexity`: Analyze code complexity
- `--changed-only`: Analyze only files with uncommitted changes

## 2. Watch Client

**Purpose**: Monitors a project for file changes and performs real-time analysis

**Commands**:

- `watch current`: Watch the current project for changes

**Usage Example**:

```bash
# Watch the current project with default settings
codeanalysis watch current

# Watch with custom settings
codeanalysis watch current --ignore "node_modules,build" --extensions "ts,js"
```

**Options**:

- `--ignore <patterns>`: Comma-separated patterns to ignore
- `--delay <ms>`: Debounce delay in milliseconds
- `--extensions <ext>`: File extensions to watch

## 3. IDE Integration Client

**Purpose**: Provides code analysis features for integration with IDEs

**Commands**:

- `ide analyze-cursor <file-path> <line> <column>`: Analyze code at a specific cursor position
- `ide analyze-open-files <files...>`: Analyze specifically listed open files

**Usage Example**:

```bash
# Analyze at cursor position
codeanalysis ide analyze-cursor src/server.ts 42 15

# Analyze multiple open files
codeanalysis ide analyze-open-files src/server.ts src/client/cli/index.ts
```

**Options**:

- `--range <lines>`: Number of lines of context to include

## 4. Metrics Client

**Purpose**: Calculates and reports code metrics for projects and files

**Usage Example**:

```bash
# Get metrics for the current project
codeanalysis metrics current

# Get specific metrics for a file
codeanalysis metrics file src/server.ts --include complexity,maintainability
```

## 5. Dependencies Client

**Purpose**: Analyzes and visualizes code dependencies

**Usage Example**:

```bash
# Analyze dependencies in the current project
codeanalysis dependencies current

# Find dependencies for a specific module
codeanalysis dependencies module src/server.ts
```

## 6. Knowledge Graph Client

**Purpose**: Builds and queries a knowledge graph of the codebase

**Usage Example**:

```bash
# Build a knowledge graph for the current project
codeanalysis knowledge-graph build

# Query the knowledge graph
codeanalysis knowledge-graph query "What modules depend on the session store?"
```

## 7. Visualization Client

**Purpose**: Generates visualizations of code structure and relationships

**Usage Example**:

```bash
# Create a dependency graph visualization
codeanalysis visualization dependencies

# Generate a module map
codeanalysis visualization modules
```

## 8. Quality Client

**Purpose**: Analyzes code quality, identifies issues, and suggests improvements

**Usage Example**:

```bash
# Run quality checks on the current project
codeanalysis quality check

# Get quality suggestions for a file
codeanalysis quality suggest src/server.ts
```

## Client Architecture

### MCP Client Implementation

The clients communicate with the MCP server using the MCP SDK. The primary client implementation is in `src/client/cli/utils/mcp-client.ts` which provides:

1. **Connection Management**:

   - `getClient(serverPath, debug)`: Connects to the MCP server
   - `closeClient()`: Closes the connection to the server

2. **Tool Execution**:
   - `callTool(toolName, args, debug)`: Calls a tool on the MCP server

### Client Workflow

All clients follow a similar workflow:

1. Parse command line arguments
2. Connect to the MCP server
3. Call the appropriate tools
4. Format and display the results
5. Close the connection

### Session Handling

Clients can maintain session state across multiple tool calls using the session store architecture:

1. **Session Creation**: When a client first connects, a session is created
2. **State Persistence**: Analysis state is preserved in the session
3. **Session Closure**: Sessions are closed explicitly or time out after a period of inactivity

## Using the Clients Programmatically

The clients can also be used programmatically by importing the appropriate modules:

```typescript
import {
  getClient,
  callTool,
  closeClient,
} from "./src/client/cli/utils/mcp-client.js";

async function analyzeFile(filePath) {
  // Connect to server
  const client = await getClient("./dist/server.js");

  try {
    // Call the tool
    const result = await callTool("calculate-metrics", {
      fileContent: fs.readFileSync(filePath, "utf8"),
      language: path.extname(filePath).slice(1),
      metrics: ["complexity", "linesOfCode"],
    });

    // Process the result
    console.log(result);
  } finally {
    // Close the connection
    await closeClient();
  }
}
```

## Extending the Client

To add a new command:

1. Create a new file in `src/client/cli/commands/`
2. Implement the command registration function
3. Register the command in `src/client/cli/index.ts`

Example:

```typescript
// src/client/cli/commands/new-command.ts
import { Command } from "commander";
import { getClient, callTool, closeClient } from "../utils/mcp-client.js";

export function registerNewCommands(program: Command) {
  const newCommand = program
    .command("new-feature")
    .description("New feature description");

  newCommand
    .command("action")
    .description("Action description")
    .action(async (options, command) => {
      const { serverPath, debug, output } = command.parent.parent.opts();

      try {
        const client = await getClient(serverPath, debug);
        const result = await callTool("new-tool", {
          /* args */
        });
        console.log(result);
      } finally {
        await closeClient();
      }
    });

  return newCommand;
}
```
