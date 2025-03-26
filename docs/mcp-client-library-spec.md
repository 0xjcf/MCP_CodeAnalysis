# MCP Client Library Technical Specification

## Overview

The MCP Client Library provides a unified interface for interacting with the Model Context Protocol (MCP) server. It abstracts away transport-specific details, implements standardized error handling, and offers a consistent API for tool execution and context generation.

## Implementation Status

- **2023-10-30**: Fixed SSE endpoint in server from "/sse" to "/mcp" to match client configuration in mcp.json, resolving connection issues.
- **2023-10-30**: Implemented duplicate detection in tool registration for analyze-dependencies, preventing "Tool already registered" errors during server startup.
- **2023-11-15**: Implemented standardized parameter handling across all client scripts, allowing for consistent command-line arguments.
- **2023-11-20**: Created comprehensive parameter handler tests with >90% code coverage.
- **2023-11-25**: Added parameter handler documentation (parameter-handler.md) with usage examples and integration guidance.
- **2023-11-30**: Updated client scripts to use the standardized parameter handling utility:
  - http-tool-discovery.js: Added port override and verbose mode
  - ai-analyzer.js: Enhanced with better server control
  - http-client.js: Added verbose mode
  - simple-client.js: Fixed with proper JSON detection
  - mcp-raw-client.js: Improved with better error reporting

## Current Development Focus

- Implementing standardized error handling
- Creating transport abstraction layer
- Updating documentation to reflect current implementation status

## Design Goals

1. **Modularity**: Separate concerns into distinct, replaceable components
2. **Extensibility**: Allow for adding new tools and transports without core changes
3. **Reliability**: Implement robust error handling and recovery mechanisms
4. **Performance**: Optimize for common operations and large codebases
5. **Usability**: Provide intuitive, well-documented interfaces

## Core Architecture

```
mcp-client/
├── core/
│   ├── transport/        # Transport layer implementations
│   ├── session/          # Session and state management
│   ├── context/          # Context collection and formatting
│   └── error/            # Error handling and reporting
├── tools/                # Tool-specific implementations
├── adapters/             # IDE and environment-specific adapters
└── cli/                  # Command-line interface components
```

## Key Components

### 1. Transport Layer

Responsible for communication with the MCP server.

```typescript
export interface Transport {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Core RPC methods
  discover(): Promise<ToolDefinition[]>;
  executeRpc(method: string, params: any): Promise<any>;

  // Server lifecycle methods
  startServer(): Promise<boolean>;
  stopServer(): Promise<boolean>;

  // Event handling
  on(event: TransportEvent, handler: EventHandler): void;
  off(event: TransportEvent, handler: EventHandler): void;
}

// Specific implementations
export class HttpTransport implements Transport {...}
export class StdioTransport implements Transport {...}
export class SseTransport implements Transport {...}
```

### 2. Session Management

Handles client-side session state and persistence.

```typescript
export interface SessionManager {
  createSession(): string;
  getSession(id: string): Session;
  removeSession(id: string): boolean;
  listSessions(): string[];

  // State management
  saveState(sessionId: string, state: any): Promise<void>;
  loadState(sessionId: string): Promise<any>;
}

export interface Session {
  id: string;
  created: Date;
  lastAccessed: Date;
  state: Record<string, any>;
}
```

### 3. Context Builder

Collects and formats code context for AI tools.

```typescript
export interface ContextBuilder {
  addFiles(patterns: string | string[]): ContextBuilder;
  addSearchTerms(terms: string | string[]): ContextBuilder;
  setTaskDescription(description: string): ContextBuilder;
  includeProjectInfo(include: boolean): ContextBuilder;
  includeFileContents(include: boolean): ContextBuilder;
  includeLineNumbers(include: boolean): ContextBuilder;

  build(): Promise<CodeContext>;
}

export interface CodeContext {
  server: {
    name: string;
    version: string;
  };
  task: string;
  files: string;
  matchingFileCount: number;
  searchTerm?: string;
  timestamp: string;
  projectInfo?: ProjectInfo;
  searchResults: SearchResults;
  fileContents: Record<string, string>;
}
```

### 4. Client API

The main entry point for consumers of the library.

```typescript
export class McpClient {
  constructor(options?: ClientOptions);

  // Server management
  connect(options?: ConnectionOptions): Promise<boolean>;
  disconnect(): Promise<void>;
  ensureServerRunning(): Promise<boolean>;

  // Tool discovery and execution
  getTools(): Promise<ToolDefinition[]>;
  executeTool(name: string, params: any): Promise<any>;

  // Specialized methods for common operations
  analyze(options: AnalysisOptions): Promise<CodeContext>;

  // Session management
  getSessionManager(): SessionManager;
}
```

## Transport Implementations

### HTTP Transport

```typescript
export class HttpTransport implements Transport {
  constructor(options: {
    serverUrl?: string;
    headers?: Record<string, string>;
    timeout?: number;
  });

  // Implementation of Transport interface for HTTP
  // Uses fetch API for request/response handling
}
```

### Stdio Transport

```typescript
export class StdioTransport implements Transport {
  constructor(options: { command?: string; args?: string[]; cwd?: string });

  // Implementation of Transport interface for stdio
  // Uses child_process for communication
}
```

### SSE Transport

```typescript
export class SseTransport implements Transport {
  constructor(options: {
    serverUrl?: string;
    headers?: Record<string, string>;
    reconnectInterval?: number;
  });

  // Implementation of Transport interface for SSE
  // Uses EventSource for server-sent events
}
```

## Tool Implementations

### Analysis Tool

```typescript
export class AnalysisTool {
  constructor(client: McpClient);

  // Core analysis methods
  analyzeFiles(
    patterns: string[],
    options?: AnalysisOptions
  ): Promise<CodeContext>;

  // Specialized analysis types
  analyzeStructure(patterns: string[]): Promise<CodeContext>;
  analyzeDependencies(patterns: string[]): Promise<CodeContext>;
  analyzeMetrics(patterns: string[]): Promise<CodeContext>;
}
```

### Discovery Tool

```typescript
export class DiscoveryTool {
  constructor(client: McpClient);

  // Tool discovery methods
  listTools(): Promise<ToolDefinition[]>;
  getToolDetails(name: string): Promise<ToolDetails>;

  // Categorization
  getToolsByCategory(): Promise<Record<string, ToolDefinition[]>>;
}
```

## IDE Adapters

### Base Adapter

```typescript
export abstract class IdeAdapter {
  constructor(client: McpClient);

  // Common adapter methods
  abstract getCurrentFile(): string;
  abstract getSelectedText(): string;
  abstract getOpenFiles(): string[];
  abstract showResult(result: any): void;

  // Analysis methods
  analyzeCurrentFile(options?: AnalysisOptions): Promise<CodeContext>;
  analyzeProject(options?: AnalysisOptions): Promise<CodeContext>;
}
```

### Cursor Adapter

```typescript
export class CursorAdapter extends IdeAdapter {
  // Cursor-specific implementation
  // Integrates with Cursor's extension API
}
```

### VS Code Adapter

```typescript
export class VsCodeAdapter extends IdeAdapter {
  // VS Code-specific implementation
  // Integrates with VS Code's extension API
}
```

## CLI Components

### Command Parser

```typescript
export class CommandParser {
  // Parse and validate command line arguments
  parse(args: string[]): ParsedCommand;

  // Register custom commands
  registerCommand(name: string, options: CommandOptions): void;
}
```

### Interactive Shell

```typescript
export class InteractiveShell {
  constructor(client: McpClient);

  // Start interactive session
  start(): void;

  // Register custom commands
  registerCommand(name: string, handler: CommandHandler): void;
}
```

## Usage Examples

### Basic Usage

```typescript
import { McpClient } from "mcp-client";

async function main() {
  // Create client with default settings
  const client = new McpClient();

  // Ensure server is running
  await client.ensureServerRunning();

  // Run analysis
  const context = await client.analyze({
    files: "src/**/*.ts",
    task: "Analyze architecture",
    search: "useState",
    includeFileContents: true,
  });

  // Use the context
  console.log(`Found ${context.matchingFileCount} matching files`);

  // Clean up
  await client.disconnect();
}

main().catch(console.error);
```

### Advanced Usage with Custom Transport

```typescript
import { McpClient, HttpTransport } from "mcp-client";

async function main() {
  // Create custom transport
  const transport = new HttpTransport({
    serverUrl: "http://custom-server:3000",
    headers: {
      Authorization: "Bearer token123",
    },
    timeout: 30000, // 30 seconds
  });

  // Create client with custom transport
  const client = new McpClient({
    transport,
  });

  // Create context builder
  const contextBuilder = client
    .createContextBuilder()
    .addFiles("src/**/*.ts")
    .addSearchTerms(["useState", "useEffect"])
    .setTaskDescription("Find React hooks usage")
    .includeLineNumbers(true);

  // Build context
  const context = await contextBuilder.build();

  // Save to file
  await writeFile("ai-context.json", JSON.stringify(context, null, 2));
}

main().catch(console.error);
```

### IDE Integration

```typescript
import { CursorAdapter } from "mcp-client/adapters/cursor";

// In Cursor extension
export function activate(context) {
  // Create Cursor adapter
  const adapter = new CursorAdapter();

  // Register commands
  context.subscriptions.push(
    registerCommand("mcp.analyzeCurrentFile", () => {
      return adapter.analyzeCurrentFile();
    }),
    registerCommand("mcp.analyzeProject", () => {
      return adapter.analyzeProject();
    })
  );
}
```

## Error Handling ✅

The library implements a comprehensive error handling system that is now fully integrated across all client tools:

```typescript
// Error types - IMPLEMENTED
export enum ErrorType {
  // Connection Errors
  CONNECTION_FAILED = "connection_failed",
  TIMEOUT = "timeout",
  SERVER_UNAVAILABLE = "server_unavailable",

  // Tool Errors
  TOOL_NOT_FOUND = "tool_not_found",
  TOOL_EXECUTION_FAILED = "tool_execution_failed",

  // Parameter Errors
  INVALID_PARAMETERS = "invalid_parameters",
  MISSING_REQUIRED_PARAMETER = "missing_required_parameter",

  // Data Errors
  INVALID_RESPONSE = "invalid_response",
  PARSING_ERROR = "parsing_error",

  // File System Errors
  FILE_NOT_FOUND = "file_not_found",
  PERMISSION_DENIED = "permission_denied",

  // Session Errors
  SESSION_EXPIRED = "session_expired",
  SESSION_CREATION_FAILED = "session_creation_failed",

  // Generic Errors
  UNKNOWN = "unknown_error",
  INTERNAL = "internal_error",
}

// Error severity levels - IMPLEMENTED
export enum ErrorSeverity {
  FATAL = "fatal", // Application cannot continue
  ERROR = "error", // Operation failed but application can continue
  WARNING = "warning", // Operation succeeded with issues
  INFO = "info", // Informational message
}

// Error structure - IMPLEMENTED
export interface MCPError extends Error {
  type: ErrorType;
  severity: ErrorSeverity;
  retryable: boolean;
  code: number;
  details?: any;
  suggestion?: string;
  timestamp: string;
}

// Example usage with retry mechanism
try {
  await client.executeTool("analyze-code", {});
} catch (error) {
  if (error.retryable) {
    await retry(
      async () => {
        return await client.executeTool("analyze-code", {});
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
        shouldRetry: (e) => e.type === ErrorType.CONNECTION_FAILED,
      }
    );
  } else {
    console.error(error.format());
    if (error.suggestion) {
      console.log(`Suggestion: ${error.suggestion}`);
    }
  }
}
```

### Key Features ✅

- **Standardized Error Types**: Comprehensive set of error types covering all failure scenarios
- **Severity Levels**: Clear indication of error impact and required action
- **Retry Mechanism**: Built-in retry functionality with exponential backoff
- **Actionable Messages**: Detailed error messages with suggestions for resolution
- **Error Recovery**: Strategies for handling and recovering from errors
- **Type Safety**: Complete TypeScript type definitions
- **Integration**: Fully integrated with all MCP client tools
- **Factory Functions**: Helper functions for creating common error types

### Implementation Status ✅

- ✅ Error types and interfaces defined
- ✅ Error handling utility created (`error-handler.js`)
- ✅ Retry mechanism implemented
- ✅ Factory functions for common errors
- ✅ Integration with all client tools complete
- ✅ Documentation and examples provided
- ✅ Test coverage for error scenarios

## Configuration

The library supports extensive configuration options:

```typescript
export interface ClientOptions {
  // Transport options
  transport?: Transport; // Custom transport instance
  transportType?: "http" | "stdio" | "sse"; // Or use built-in transport
  serverUrl?: string; // Server URL for HTTP/SSE transport

  // Server lifecycle options
  autoStartServer?: boolean; // Auto-start server if not running
  serverCommand?: string; // Command to start server
  serverArgs?: string[]; // Arguments for server command

  // Timeout options
  connectionTimeout?: number; // Connection timeout in ms
  executionTimeout?: number; // Tool execution timeout in ms

  // Session options
  sessionTtl?: number; // Session time-to-live in seconds

  // Caching options
  enableCaching?: boolean; // Enable result caching
  cacheTtl?: number; // Cache time-to-live in seconds

  // Logging options
  logLevel?: "debug" | "info" | "warn" | "error";
  logger?: Logger; // Custom logger implementation
}
```

## Performance Considerations

1. **Caching**: Implement caching of tool execution results and context data
2. **Incremental Updates**: Support for incremental context updates when only parts change
3. **Lazy Loading**: Load tools and adapters on-demand
4. **Batch Operations**: Support for batching multiple operations in a single request
5. **Connection Pooling**: Reuse connections to the server for multiple requests
6. **Resource Management**: Proper cleanup of resources when no longer needed

## Security Considerations

1. **Authentication**: Support for various authentication mechanisms
2. **Secure Communication**: Use HTTPS for HTTP transport
3. **Sensitive Data**: Filtering of sensitive data from context
4. **Input Validation**: Validate all inputs before sending to server
5. **Controlled Access**: Limit access to tools based on permissions

## Testing Strategy

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test components working together
3. **End-to-End Tests**: Test complete workflows
4. **Mock Server**: Use mock server for testing without actual server
5. **Performance Tests**: Test performance with large codebases
6. **Security Tests**: Test for security vulnerabilities
