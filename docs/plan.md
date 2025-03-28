# MCP Code Analysis Enhancement Plan

## Overview

This document outlines the strategic plan for enhancing the MCP (Model Context Protocol) server for code analysis. The goal is to optimize the server for AI-assisted development, ensuring tools are easily discoverable, well-documented, and produce consistent, useful results for AI agents.

## Areas for Enhancement

### 1. Tool Description & Documentation

- **Goal**: Improve AI understanding of available tools and their usage
- **Action Items**:
  - ✅ Add comprehensive JSDoc comments to all tool registration functions
  - ✅ Create standardized parameter descriptions across all tools
  - ✅ Implement consistent "examples" field in all tool descriptions
  - ✅ Generate automated documentation from tool schemas

### 2. Result Formatting

- **Goal**: Standardize tool outputs for optimal AI consumption
- **Action Items**:
  - ✅ Define a consistent JSON output schema for all tools
  - ✅ Include metadata in responses (timing, version, etc.)
  - ✅ Format complex data for easier parsing (nested objects, typed arrays)
  - Add semantic markers to highlight important parts of results

### 3. Tool Composition

- **Goal**: Enable multi-step analysis workflows
- **Action Items**:
  - Create a workflow engine to chain tool executions
  - Implement preset workflows for common code analysis patterns
  - Add parameterization of workflows for flexibility
  - Build a workflow visualization component

### 4. Context Sharing

- **Goal**: Maintain state across sequential tool invocations
- **Action Items**:
  - ✅ Implement a session management system
  - Create a caching layer for analysis results
  - ✅ Add context persistence between related operations
  - Enable cross-referencing between tool results

### 5. Testing Framework

- **Goal**: Ensure reliability of tools when used by AI
- **Action Items**:
  - ✅ Create unit tests for each individual tool
  - Implement integration tests for tool combinations
  - ✅ Add performance benchmarks for response times
  - Build test fixtures for common code patterns

## Technology Choices

### Hybrid Architecture Approach

We'll implement a hybrid architecture to optimize for both development speed and performance:

1. **TypeScript for Server Core**

   - MCP server infrastructure and API layer
   - Tool registration and orchestration
   - Integration with MCP SDK
   - Developer experience tooling
   - State management (XState) and high-level workflow orchestration
   - API and service layers

2. **Rust for Performance-Critical Components**

   - Code parsers and analyzers
   - Graph traversal algorithms
   - Memory-intensive operations
   - High-performance metric calculations
   - Implemented as standalone binaries or WASM modules
   - Focus on tools where performance matters most (metrics, parsing, static analysis)

3. **Python for ML/AI Components**
   - Code classification models
   - Suggestion generation
   - Pattern detection
   - Integration with ML libraries
   - Leveraging existing ML ecosystems for code understanding

### Implementation Strategy

We're adopting a tailored approach for each component in our architecture:

1. **Session Context**: Redis + XState integration

   - Redis for distributed state persistence
   - XState for state machine modeling
   - Session sharing across multiple server instances

2. **Tool Composition**: XState-driven workflow engine

   - Define reusable workflow templates
   - State machines for complex tool sequences
   - Visual workflow debugging and monitoring

3. **Performance-Critical Analysis**: Rust modules with TypeScript wrappers

   - Native code for performance-intensive operations
   - Consistent TypeScript interfaces for all tools
   - WASM packaging for browser compatibility when needed

4. **Knowledge Graph**: Neo4j or specialized graph database
   - Model code relationships as a connected graph
   - Efficient traversal and pattern matching
   - Support for complex relationship queries

### State Management with XState

We'll use XState for modeling complex AI agent states and workflows:

- **Statechart Modeling**: Formally define agent states and transitions
- **Visualization**: Use XState's visualization tools for debugging and documentation
- **Context Management**: Leverage XState's built-in context for maintaining state
- **Composition**: Create modular, composable state machines for different analysis flows

### AI-Tool Synchronization

We'll implement multiple synchronization mechanisms:

1. **Event-Based Architecture**

   - Pub/sub system for tool completion events
   - WebSocket support for real-time updates
   - Event replay for state reconstruction

2. **Caching Layer**
   - Redis for distributed caching
   - Versioned cache entries
   - TTL-based expiration strategy

### Schema Validation with Zod

We'll use Zod for comprehensive schema validation:

- **Request Validation**: Validate tool inputs with detailed error messages
- **Response Validation**: Ensure all tool responses conform to our standard format
- **Schema Generation**: Automatically generate documentation from Zod schemas
- **Runtime Type Safety**: Leverage TypeScript integration for type inference

### Component Implementation

| Component            | Primary Technology  | Supporting Technologies   |
| -------------------- | ------------------- | ------------------------- |
| Server Core          | TypeScript          | Express, MCP SDK          |
| State Management     | XState              | Redis                     |
| Schema Validation    | Zod                 | TypeScript                |
| Tool Composition     | TypeScript + XState | -                         |
| Performance Analysis | Rust                | WASM, TypeScript bindings |
| Knowledge Graph      | TypeScript          | Neo4j, TypeScript         |
| Code Parsing         | Rust                | Tree-sitter               |
| ML Components        | Python              | TensorFlow/PyTorch        |
| Testing Framework    | Vitest              | -                         |

## Implementation Recommendations

### 1. Standardize Tool Response Format

```typescript
// Example standardized response format with Zod schema
import { z } from "zod";

// Define the schema with Zod
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

// Type derived from the schema
export type ToolResponse<T> = z.infer<typeof ToolResponseSchema> & {
  data: T;
};

// Helper function for creating valid responses
export function createToolResponse<T>(
  data: T,
  tool: string,
  success = true,
  contextData?: { sessionId?: string; relatedResults?: string[] }
): ToolResponse<T> {
  return {
    data,
    metadata: {
      tool,
      version: "1.0.0", // Should be dynamically pulled from package
      executionTime: 0, // Should be calculated
      timestamp: new Date().toISOString(),
    },
    status: {
      success,
      code: success ? 200 : 400,
      message: success ? undefined : "An error occurred",
    },
    context: contextData,
  };
}
```

- ✅ Implement this interface across all tool responses
- ✅ Create helper functions for generating standard responses
- ✅ Add TypeScript types for all response objects
- ✅ Use Zod for runtime validation of responses

### 2. Tool Discovery Mechanism

- ✅ Create a new MCP tool `list-available-tools` that returns:
  - All registered tools with descriptions
  - Parameter schemas and examples
  - Categories and tags for filtering
- Implement a tool capability graph showing relationships
- Add search functionality for finding tools by capability

### 3. Session Context Implementation

- ✅ Create a session management system with:
  - Session creation/termination API
  - State persistence between calls
  - Timeout and garbage collection
  - Context sharing between related tools
- Implement through Redis or similar for scalability
- ✅ Integrate with XState for state management

### 4. Tool Documentation Expansion

- For each tool parameter, add:
  - ✅ Detailed description
  - ✅ Expected format
  - ✅ Example values
  - Common errors
- Generate interactive documentation site from schemas
- ✅ Auto-generate examples from Zod schemas

### 5. AI-Specific Workflows

Create composition tools for common AI tasks:

- `analyze-code-quality` - Combines metrics, linting, and best practices
- `refactor-suggestion` - Analyzes code and suggests improvements
- `dependency-impact` - Analyzes change impact across codebase
- `architecture-overview` - Generates high-level system understanding

## Implementation Timeline

### Phase 1: Foundation (Complete) ✅

- ✅ Standardize response formats with Zod schemas

  - Created consistent success, error, and partial response formats
  - Implemented Zod schemas for response validation
  - Added utility functions for generating responses
  - Ensured TypeScript type inference from schemas

- ✅ Implement basic tool documentation improvements

  - Added JSDoc comments with examples
  - Created standardized parameter descriptions
  - Implemented schema-based documentation
  - Used Zod describe() for rich parameter metadata

- ✅ Create initial test framework

  - Set up Vitest for testing
  - Implemented mock MCP server
  - Created shared test utilities
  - Added proper lifecycle management in tests

- ✅ Set up XState for core state management

  - Implemented tool machine with typed states
  - Created tool execution service
  - Added parameter validation
  - Implemented execution history tracking

- ✅ Implement stateful tool support

  - Added session management
  - Created state persistence between calls
  - Modified schemas to include sessionId
  - Provided helper functions for session interaction

- ✅ Contract validation and verification
  - Implemented API contract verification
  - Added runtime schema validation
  - Created integration tests for contract adherence
  - Documented interface contracts

### Phase 2: Redis Integration and Performance Optimization (Weeks 3-4)

- **Redis Session Management** (Incomplete ✅)

  - ✅ Implement Redis-backed session store
  - ✅ Add distributed session locking
  - ✅ Create TTL-based session expiration
  - ✅ Implement session migration utilities
  - ✅ Added memory storage fallback with feature detection
  - ✅ Session store factory with dynamic provider selection

- **Performance Optimization**

  - Profile and optimize tool execution
  - Implement caching for expensive operations
  - Add batch processing capabilities
  - Optimize state serialization and deserialization

- **Tool Discovery and Metadata**

  - Create comprehensive tool registry
  - Add rich metadata to tool definitions
  - Implement tool search and filtering
  - Create tool relationship graph

- **Initial Rust-based Tools**

  - Implement code parsing using Tree-sitter
  - Create code complexity analyzer
  - Build dependency graph generator
  - Add performance benchmarking tool

- **Enhanced Error Handling**
  - Create standardized error codes
  - Add detailed error context
  - Implement error recovery strategies
  - Add error logging and aggregation

### Phase 2.5: Storage Backend Expansion (New Priority)

Building on our existing session store architecture, we'll expand storage options to provide more robust persistence without Redis:

- **File-based Session Store**

  - Create `FileSessionStore` implementing our session interface
  - Add JSON file persistence with proper file locking
  - Implement session cleanup and file rotation
  - Add encryption option for sensitive context data

- **Pluggable Storage System Enhancement**

  - Extend the session store factory to dynamically select the best available backend
  - Add configuration options for storage preferences
  - Implement session migration between storage backends
  - Create diagnostic tools for storage health monitoring

- **Command-line Context Integration**
  - Add `--context-file` parameter to client tools
  - Implement import/export functionality for session contexts
  - Create helpers for session continuation between command invocations

### Phase 3: Advanced Capabilities and Workflows (Weeks 5-8)

- **Workflow Engine with XState**

  - Create workflow definitions with XState
  - Implement workflow persistence
  - Add parameterized workflow templates
  - Create workflow visualization

- **Advanced Analysis Tools**

  - Implement code quality scoring
  - Add semantic code understanding
  - Create refactoring suggestion tools
  - Build architecture visualization

- **Integration Testing Framework**

  - Create integration test fixtures
  - Implement end-to-end test scenarios
  - Add performance regression tests
  - Create compatibility test suite

- **API Gateway and Load Balancing**

  - Implement API gateway for tool access
  - Add request rate limiting
  - Create load balancing for heavy tools
  - Implement prioritization for critical operations

- **Documentation and Developer Experience**
  - Create interactive documentation site
  - Add visualizations for tool capabilities
  - Implement playground for tool experimentation
  - Create detailed tutorials and examples

## Phase 2 Technical Details

### Redis Session Store Implementation

We'll implement a Redis-backed session store with the following capabilities:

```typescript
export interface RedisSessionStoreOptions {
  redisUrl: string;
  prefix?: string;
  defaultTtl?: number; // in seconds
  lockTimeout?: number; // in milliseconds
}

export class RedisSessionStore implements SessionStore {
  constructor(options: RedisSessionStoreOptions);

  // Core SessionStore interface
  async getSession<T>(sessionId: string): Promise<T | null>;
  async setSession<T>(sessionId: string, state: T, ttl?: number): Promise<void>;
  async clearSession(sessionId: string): Promise<void>;
  async getSessions(): Promise<string[]>;

  // Extended capabilities
  async acquireLock(
    sessionId: string,
    timeout?: number
  ): Promise<string | null>;
  async releaseLock(sessionId: string, lockToken: string): Promise<boolean>;
  async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean>;
  async getSessionTtl(sessionId: string): Promise<number | null>;
  async createSessionIfNotExists<T>(
    sessionId: string,
    initialState: T
  ): Promise<T>;
}
```

### Performance Optimization Strategy

For Phase 2, we'll focus on the following performance optimizations:

1. **Caching Layer**

   - Implement Redis-backed result caching
   - Add cache invalidation strategies
   - Create tiered caching (memory + Redis)
   - Implement cache warming for common operations

2. **State Optimization**

   - Reduce serialization overhead
   - Implement incremental state updates
   - Add lazy loading for context data
   - Optimize state machine transitions

3. **Batch Processing**

   - Add support for batch tool execution
   - Implement parallel execution where applicable
   - Create queue management for heavy operations
   - Add prioritization for interactive operations

4. **Memory Management**
   - Implement streaming for large results
   - Add memory usage monitoring
   - Create auto-scaling session cleanup
   - Optimize object pooling for frequent operations

### Rust-based Tool Integration

We'll implement a standard pattern for integrating Rust-based tools:

```typescript
import { spawnSync } from "child_process";
import { z } from "zod";
import { createStatefulTool } from "../statefulTool";

const ComplexityAnalysisSchema = z.object({
  filePath: z.string().describe("Path to the file to analyze"),
  options: z
    .object({
      metrics: z
        .array(z.enum(["cyclomatic", "cognitive", "halstead"]))
        .default(["cyclomatic"]),
      threshold: z
        .number()
        .optional()
        .describe("Complexity threshold for highlighting"),
    })
    .optional(),
});

export const complexityAnalysisTool = createStatefulTool({
  name: "complexityAnalysis",
  description: "Analyzes code complexity using various metrics",
  schema: ComplexityAnalysisSchema,
  handler: async (params, context) => {
    try {
      const result = spawnSync("./bin/complexity_analyzer", [
        params.filePath,
        "--format=json",
        `--metrics=${params.options?.metrics.join(",") || "cyclomatic"}`,
        params.options?.threshold
          ? `--threshold=${params.options.threshold}`
          : "",
      ]);

      if (result.status !== 0) {
        return createErrorResponse({
          message: "Complexity analysis failed",
          code: "COMPLEXITY_ANALYSIS_ERROR",
          details: result.stderr.toString(),
        });
      }

      const analysisResult = JSON.parse(result.stdout.toString());
      return createSuccessResponse(analysisResult);
    } catch (error) {
      return createErrorResponse({
        message: "Failed to execute complexity analysis",
        code: "EXECUTION_ERROR",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  },
});
```

## Success Metrics

We will consider Phase 2 successful when we achieve the following metrics:

1. **Performance**

   - Response time under 100ms for 95% of tool executions
   - Support for 5000+ concurrent sessions
   - Memory usage stable with increasing sessions

2. **Reliability**

   - 99.9% success rate for tool executions
   - Zero memory leaks in extended testing
   - Graceful error handling for all edge cases

3. **Developer Experience**

   - 90% test coverage for core components
   - Comprehensive documentation for all tools
   - Interactive example for each tool

4. **Scalability**
   - Linear scaling with added resources
   - Support for distributed deployment
   - Efficient resource utilization

## Next Steps

1. Continue with Phase 2 implementation using memory storage as a fallback
2. Focus on Performance Optimization aspects of Phase 2
3. Implement Tool Discovery and Metadata improvements
4. Begin work on initial Rust-based tools for code analysis
5. Address Redis connectivity issues in parallel if time permits

## Tech Debt

The following items represent technical debt that should be addressed in future iterations.

### 1. Redis Connectivity Issues (Active ⚠️)

- **Issue**: While Redis availability checks pass with simple ping tests, actual session operations fail with connection errors.
- **Current State**: `redis-cli ping` returns successfully, but Redis session store operations fail with "Redis client not connected" errors.
- **Workaround**: Using memory session store temporarily by setting `preferMemory: true` or `FORCE_MEMORY_SESSION=true`.
- **Status**: Actively working around this issue by using the memory session store, which is fully functional for development and single-instance deployments.
- **Impact**:
  - Memory store is fully functional for development and single-instance deployments
  - Missing Redis persistence for production scenarios with multiple instances
  - Potential data loss on server restarts with memory store
  - Not blocking further development as memory store implements the same interface

#### Investigation Plan

1. **Redis Configuration Check**:

   - Review Redis server configuration for authentication requirements
   - Check connection limits and timeout settings
   - Verify Redis is not in protected mode that restricts connections

2. **Network/Firewall Issues**:

   - Confirm Redis port (6379) is not being blocked
   - Check for any network policies affecting Redis connectivity

3. **Connection Handling Improvements**:

   - Review Redis client initialization in `RedisSessionStore`
   - Implement better connection retry logic
   - Add more detailed connection error logging

4. **Client Library Compatibility**:
   - Verify compatibility between Redis server version and Node.js client
   - Check for known issues in the Redis client library

#### Resolution Timeline

- **Short-term**: Continue using memory store for development
- **Medium-term**: Implement improved Redis connection error handling and diagnostics
- **Long-term**: Provide additional backend options (e.g., SQLite, file-based) for greater flexibility

This tech debt should be prioritized before deploying to production environments that require state persistence across multiple instances or server restarts.
