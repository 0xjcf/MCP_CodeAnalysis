# MCP Code Analysis: Phase 1 Foundations

This document provides an overview of the foundational components implemented in Phase 1 of the MCP Code Analysis project. These components establish the architectural patterns and standards that will support the more advanced features in subsequent phases.

## 1. Standardized Response Format

### Overview

We've implemented a consistent response format across all tools to ensure AI agents can reliably parse and reason about tool outputs. The response format is defined using Zod schemas for runtime validation and TypeScript types for compile-time safety.

### Implementation Details

#### Response Schema

```typescript
export const ToolResponseSchema = z.object({
  data: z.any(),
  metadata: z.object({
    tool: z.string(),
    version: z.string(),
    executionTime: z.number(),
    timestamp: z.string(),
  }),
  status: z.object({
    success: z.boolean(),
    code: z.number(),
    message: z.string().optional(),
  }),
  context: z
    .object({
      sessionId: z.string().optional(),
      relatedResults: z.array(z.string()).optional(),
    })
    .optional(),
});

export type ToolResponse<T> = z.infer<typeof ToolResponseSchema> & {
  data: T;
};
```

#### Helper Functions

We provide helper functions to create standardized responses:

```typescript
// Success response
export function createSuccessResponse<T>(
  data: T,
  tool: string,
  contextData?: { sessionId?: string; relatedResults?: string[] }
): ToolResponse<T> {
  return {
    data,
    metadata: {
      tool,
      version: "1.0.0",
      executionTime: performance.now(), // This is replaced with actual execution time
      timestamp: new Date().toISOString(),
    },
    status: {
      success: true,
      code: 200,
    },
    context: contextData,
  };
}

// Error response
export function createErrorResponse(
  error: string | Error,
  tool: string,
  contextData?: { sessionId?: string; relatedResults?: string[] }
): ToolResponse<null> {
  const errorMessage = error instanceof Error ? error.message : error;

  return {
    data: null,
    metadata: {
      tool,
      version: "1.0.0",
      executionTime: 0,
      timestamp: new Date().toISOString(),
    },
    status: {
      success: false,
      code: 400,
      message: errorMessage,
    },
    context: contextData,
  };
}
```

### Usage

All tools must return responses in this format, either by using the helper functions or by manually constructing objects that conform to the schema.

```typescript
// Example usage in a tool
server.tool(
  "analyze-file",
  {
    path: z.string().describe("Path to the file to analyze"),
  },
  async (params) => {
    try {
      const result = await analyzeFile(params.path);
      return createSuccessResponse(result, "analyze-file");
    } catch (error) {
      return createErrorResponse(error, "analyze-file");
    }
  }
);
```

## 2. State Management with XState

### Overview

We've implemented a state management system using XState to maintain context across tool invocations and manage complex workflows. This provides a robust foundation for stateful tools that can maintain context between calls.

### Implementation Details

#### Tool Machine

The core of our state management is the `toolMachine`, an XState state machine that handles the lifecycle of tool execution:

```typescript
export const toolMachine = setup({
  types: {
    context: {} as ToolMachineContext,
    events: {} as ToolMachineEvent,
  },
  // Actions and state definitions...
}).createMachine({
  id: "toolExecution",
  initial: "idle",
  context: {
    toolName: null,
    parameters: null,
    result: null,
    error: null,
    sessionId: null,
    selectedTool: null,
    history: [],
  },
  states: {
    idle: {
      /* ... */
    },
    toolSelected: {
      /* ... */
    },
    parametersSet: {
      /* ... */
    },
    executing: {
      /* ... */
    },
    succeeded: {
      /* ... */
    },
    failed: {
      /* ... */
    },
    cancelled: {
      /* ... */
    },
  },
});
```

#### Tool Execution Service

The `ToolExecutionService` class provides a high-level interface to the state machine:

```typescript
class ToolExecutionService {
  constructor(sessionId?: string) {
    // Initialize state machine actor
  }

  selectTool(toolName: string): void {
    /* ... */
  }
  setParameters(parameters: Record<string, any>): void {
    /* ... */
  }
  async execute<T>(executeFunction: Function): Promise<ToolResponse<T>> {
    /* ... */
  }
  cancel(): void {
    /* ... */
  }
  getContext(): ToolMachineContext {
    /* ... */
  }
  getHistory(): Array<{ tool: string; result: any }> {
    /* ... */
  }
  getSessionId(): string {
    /* ... */
  }
}
```

#### Stateful Tool Creation

We provide a helper function to create stateful tools with session management:

```typescript
export function createStatefulTool<TParams extends z.ZodRawShape, TResult>(
  server: McpServer,
  toolName: string,
  paramSchema: TParams,
  handler: (params: z.infer<z.ZodObject<TParams>>) => Promise<TResult>
): void {
  // Implementation that adds sessionId parameter and manages state
}
```

#### Session Management

Sessions are managed through a simple yet effective API:

```typescript
// Create a new session
const service = createToolExecutionService();

// Get an existing session
const existingService = getSession(sessionId);

// Clear a session
clearSession(sessionId);

// Get all session IDs
const sessionIds = getSessionIds();
```

### Usage

Stateful tools can be created with minimal boilerplate:

```typescript
// Create a stateful tool
createStatefulTool(
  server,
  "analyze-project",
  {
    projectPath: z.string().describe("Path to the project root"),
    options: z
      .object({
        includeDependencies: z.boolean().optional(),
        maxDepth: z.number().optional(),
      })
      .optional(),
  },
  async (params) => {
    // Implementation that can maintain state between calls
    return analysisResult;
  }
);
```

## 3. Testing Framework

### Overview

We've implemented a comprehensive testing framework for verifying the functionality of tools, state management, and response formatting. This ensures reliability and maintainability as the system grows.

### Implementation Details

#### Test Structure

Tests are organized into logical groups using `describe` blocks:

```typescript
describe("Tool Machine", () => {
  describe("State Transitions", () => {
    /* Tests for state transitions */
  });

  describe("Context Management", () => {
    /* Tests for context updates */
  });

  describe("Session Management", () => {
    /* Tests for session handling */
  });
});
```

#### Actor Lifecycle Management

We follow best practices for managing actor lifecycle in tests:

```typescript
describe("State Transitions", () => {
  // Shared actor for all tests in this describe block
  let actor: ToolMachineActor;

  beforeEach(() => {
    // Create and start the actor before each test
    actor = createActor(toolMachine).start();
  });

  afterEach(() => {
    // Stop the actor after each test
    actor.stop();
  });

  // Test cases...
});
```

#### Mock Objects

We use shared mock objects to ensure consistency:

```typescript
// Create and reuse mock objects
const mockServer = {
  tool: vi.fn(),
  httpTool: vi.fn(),
};

beforeEach(() => {
  // Reset mocks before each test
  vi.resetAllMocks();
});
```

#### Isolated Tests

We maintain test isolation by clearing state between tests:

```typescript
beforeEach(() => {
  // Clear any existing sessions
  getSessionIds().forEach(clearSession);
});
```

### Key Test Files

- `responses.test.ts`: Tests for response format utility functions
- `toolMachine.test.ts`: Tests for the XState state machine
- `toolService.test.ts`: Tests for the Tool Execution Service
- `statefulTool.test.ts`: Tests for stateful tool creation and management
- `toolServiceNoTool.test.ts`: Isolated tests for specific edge cases

## 4. Tool Documentation Improvements

### Overview

We've enhanced tool documentation to make tools more discoverable and easier to use by AI agents. This includes standardized parameter descriptions, examples, and clear documentation of expected behavior.

### Implementation Details

#### Parameter Descriptions

All tool parameters now include descriptive information:

```typescript
server.tool(
  "analyze-code",
  {
    filePath: z.string().describe("Full path to the file to analyze"),
    options: z
      .object({
        includeDependencies: z
          .boolean()
          .describe("Whether to include dependencies in analysis")
          .optional(),
        maxDepth: z.number().describe("Maximum depth for analysis").optional(),
      })
      .describe("Analysis options")
      .optional(),
  },
  async (params) => {
    // Implementation
  }
);
```

#### JSDoc Comments

All tool registration functions include comprehensive JSDoc comments:

```typescript
/**
 * Analyzes code quality metrics for a given file
 *
 * This tool examines the specified file and calculates various code quality metrics
 * including complexity, maintainability index, and potential issues.
 *
 * @param filePath - Path to the file to analyze
 * @param options - Optional configuration parameters
 * @returns Code quality metrics and identified issues
 * @example
 * // Basic usage
 * analyzeCode({filePath: "/path/to/file.js"})
 *
 * // With options
 * analyzeCode({
 *   filePath: "/path/to/file.js",
 *   options: {
 *     includeDependencies: true,
 *     maxDepth: 2
 *   }
 * })
 */
function analyzeCode(params) {
  // Implementation
}
```

## 5. Lessons Learned and Best Practices

### State Management

- Use XState for complex stateful workflows
- Maintain clear state transitions and action definitions
- Keep context shape consistent and well-typed

### Response Formatting

- Always use the standardized response format
- Include appropriate metadata for each response
- Handle errors consistently with proper error messages

### Testing

- Maintain proper actor lifecycle management
- Use shared mocks with proper reset between tests
- Keep tests isolated from each other
- Test error conditions as well as success paths

### Documentation

- Use consistent parameter descriptions
- Include examples for complex parameters
- Document expected behavior and error conditions

## Next Steps

Phase 1 has established the foundational architecture for the MCP Code Analysis system. In Phase 2, we will build upon these foundations to implement:

1. Session management system with Redis
2. Tool discovery mechanism
3. Expanded test coverage
4. Initial Rust-based analysis tools

## API Reference

### Response Utilities

- `createSuccessResponse<T>(data: T, tool: string, contextData?): ToolResponse<T>`
- `createErrorResponse(error: string | Error, tool: string, contextData?): ToolResponse<null>`

### State Management

- `createToolExecutionService(sessionId?: string): ToolExecutionService`
- `getSession(sessionId?: string): ToolExecutionService`
- `clearSession(sessionId: string): boolean`
- `getSessionIds(): string[]`

### Stateful Tools

- `createStatefulTool<TParams, TResult>(server, toolName, paramSchema, handler): void`
