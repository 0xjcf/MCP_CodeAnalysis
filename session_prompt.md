# Session Continuation Prompt

I'm continuing work on the MCP Code Analysis project. Here's the context from my previous session:

## Project Context

- Last Session: 2024-03-25
- Current Phase: Phase 2 - Storage Backend Expansion
- Focus Area: Rust Component Implementation and Testing

## Active Development

Currently working on:

- Component: complexity_analyzer
- Status: In Progress - Testing Phase
- Progress: 90%

## Technical Context

The following components and relationships are relevant to our current work:



## Monetization Status

Current tier implementation:


### Opportunities Tier Features

#### Unnamed Feature
- { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; import { StdioServerTransport } from
  - Context: import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/std
  - Type: freemium
- import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"; import { SSEServerTransport }
  - Context:  from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse
  - Type: freemium
- SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"; import express from "express"; import {
  - Context:  from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

import { registerAnalysisTools } from "./f
  - Type: freemium
- "express"; import { registerAnalysisTools } from "./features/basic-analysis/index.js"; import { registerCodeMetricsTools
  - Context: k/server/sse.js";
import express from "express";

import { registerAnalysisTools } from "./features/basic-analysis/index.js";
import { registerCodeMetricsTools } from "./features/code-metrics/index.js";
im
  - Type: freemium
- "./features/dependency-analysis/index.js"; import { registerIdeTools } from "./features/basic-analysis/ide-analyzer.js"; import { registerCodeQualityTools
  - Context: ools } from "./features/dependency-analysis/index.js";
import { registerIdeTools } from "./features/basic-analysis/ide-analyzer.js";
import { registerCodeQualityTools } from "./features/code-quality/index.
  - Type: freemium
- Enable verbose logging if requested
const verbose = process.env.VERBOSE === "true";

// Initialize the tool registry with verbosity setting
initializeToolR
  - Context: "codeanalysis-mcp",
  version: "1.0.0",
});

// Enable verbose logging if requested
const verbose = process.env.VERBOSE === "true";

// Initialize the tool registry with verbosity setting
initializeToolR
  - Type: freemium
- their source names registerToolsWithRegistry( server, registerAnalysisTools, "basic-analysis", verbose ); registerToolsWithRegistry(
  - Context: re modules with their source names
registerToolsWithRegistry(
  server,
  registerAnalysisTools,
  "basic-analysis",
  verbose
);
registerToolsWithRegistry(
  server,
  registerCodeMetricsTools,
  "code-me
  - Type: freemium
- Check if we should use stdio transport
if (process.env.STDIO_TRANSPORT === "true") {
  console.log("Server configured for stdio transport");
  con
  - Context: e");
console.log(registry.getRegistrationSummary());

// Check if we should use stdio transport
if (process.env.STDIO_TRANSPORT === "true") {
  console.log("Server configured for stdio transport");
  con
  - Type: freemium
- Setup HTTP transport
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const app = express();

  // Add headers to
  - Context: ed to connect to stdio transport:", err);
    });
} else {
  // Setup HTTP transport
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const app = express();

  // Add headers to
  - Type: freemium
- Setup HTTP transport
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const app = express();

  // Add headers to fix CORS issues
  app.use((
  - Context: port:", err);
    });
} else {
  // Setup HTTP transport
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const app = express();

  // Add headers to fix CORS issues
  app.use((
  - Type: freemium
- Server connected and ready to handle stdio requests"); }) .catch((err)
  - Context:   server
    .connect(stdioTransport)
    .then(() => {
      console.log("✓ Server connected and ready to handle stdio requests");
    })
    .catch((err) => {
      console.error("Failed to connect to
  - Type: ads
- Add headers to fix CORS issues
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Or
  - Context: nst port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const app = express();

  // Add headers to fix CORS issues
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Or
  - Type: ads
- Add headers to fix CORS issues
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",
  - Context: rt = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const app = express();

  // Add headers to fix CORS issues
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",
  - Type: ads
- Add headers to fix CORS issues
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
  - Context: nst app = express();

  // Add headers to fix CORS issues
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      
  - Type: ads
- res, next) => { res.header("Access-Control-Allow-Origin", "*"); res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With,
  - Context: ssues
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
   
  - Type: ads
- "*"); res.header( "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" ); next(); });
  - Context: {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // Define r
  - Type: ads
- Set up SSE endpoint for client connections
  app.get("/mcp", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.set
  - Context: });

  // Set up SSE endpoint for client connections
  app.get("/mcp", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.set
  - Type: ads
- Create SSE t
  - Context: pp.get("/mcp", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Create SSE t
  - Type: ads
- Create SSE transport for this connection
    const transport
  - Context: ("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Create SSE transport for this connection
    const transport
  - Type: ads
- Output the transport info
  console.log(`Server configured
  - Context: ort, () => {
    console.log(`✓ Server listening on port ${port}`);
    console.log("✓ MCP server ready to handle HTTP requests");
  });

  // Output the transport info
  console.log(`Server configured 
  - Type: ads
- Parse environment variables
const options = {
  useStdio: process.env.STDIO_TRANSPORT === "true",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 300
  - Context: ver } from "./server/startServer.js";

// Parse environment variables
const options = {
  useStdio: process.env.STDIO_TRANSPORT === "true",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 300
  - Type: freemium
- { useStdio: process.env.STDIO_TRANSPORT === "true", port: process.env.PORT ? parseInt(process.env.PORT, 10)
  - Context: environment variables
const options = {
  useStdio: process.env.STDIO_TRANSPORT === "true",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  redisUrl: process.env.REDIS_URL,
  forceMem
  - Type: freemium
- process.env.STDIO_TRANSPORT === "true", port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  - Context: options = {
  useStdio: process.env.STDIO_TRANSPORT === "true",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  redisUrl: process.env.REDIS_URL,
  forceMemorySessionStore: process.env
  - Type: freemium
- port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000, redisUrl: process.env.REDIS_URL, forceMemorySessionStore:
  - Context: TRANSPORT === "true",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  redisUrl: process.env.REDIS_URL,
  forceMemorySessionStore: process.env.FORCE_MEMORY_SESSION === "true",
  verbos
  - Type: freemium
- 3000, redisUrl: process.env.REDIS_URL, forceMemorySessionStore: process.env.FORCE_MEMORY_SESSION === "true", verbose: process.env.VERBOSE ===
  - Context: arseInt(process.env.PORT, 10) : 3000,
  redisUrl: process.env.REDIS_URL,
  forceMemorySessionStore: process.env.FORCE_MEMORY_SESSION === "true",
  verbose: process.env.VERBOSE === "true",
};

console.log
  - Type: freemium
- === "true", verbose: process.env.VERBOSE === "true", }; console.log("Starting MCP server
  - Context: s.env.REDIS_URL,
  forceMemorySessionStore: process.env.FORCE_MEMORY_SESSION === "true",
  verbose: process.env.VERBOSE === "true",
};

console.log("Starting MCP server with options:", {
  ...options,
  
  - Type: freemium
- }) .catch((error) => { console.error("Failed to start MCP server:", error);
  - Context: essfully");
  })
  .catch((error) => {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  });

  - Type: freemium
- : 3000, redisUrl: process.env.REDIS_URL, forceMemorySessionStore: process.env.FORCE_MEMORY_SESSION === "true", verbose: process.env.VERBOSE
  - Context: ORT ? parseInt(process.env.PORT, 10) : 3000,
  redisUrl: process.env.REDIS_URL,
  forceMemorySessionStore: process.env.FORCE_MEMORY_SESSION === "true",
  verbose: process.env.VERBOSE === "true",
};

consol
  - Type: marketplace
- localhost:6379)
 * -
  - Context: 
 * - PORT: HTTP port for the server (default: 3000)
 * - STDIO_TRANSPORT: Use stdio transport instead of HTTP (set to "true")
 * - REDIS_URL: Redis connection URL (default: redis://localhost:6379)
 * -
  - Type: ads
- McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; import { ToolRegistry, getToolRegistry } from
  - Context: import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ToolRegistry, getToolRegistry } from "./tool-registry.js";

/**
 
  - Type: freemium
- registered once while * maintaining the existing defensive programming approach
  - Context:  * This function ensures tools are only registered once while
 * maintaining the existing defensive programming approach
 */
export function registerToolsWithRegistry(
  server: McpServer,
  registerFn: 
  - Type: freemium
- while * maintaining the existing defensive programming approach */ export
  - Context: on ensures tools are only registered once while
 * maintaining the existing defensive programming approach
 */
export function registerToolsWithRegistry(
  server: McpServer,
  registerFn: (server: McpSe
  - Type: freemium
- Create a proxy that intercepts tool registrations
    const serverProxy = new Proxy(server, {
      get(target,
  - Context: se) {
      console.log(`[Registry] Registering tools from '${source}'...`);
    }

    // Create a proxy that intercepts tool registrations
    const serverProxy = new Proxy(server, {
      get(target, 
  - Type: freemium
- Create a proxy that intercepts tool registrations
    const serverProxy = new Proxy(server, {
      get(target, prop) {
        // If someone is calling the tool method
  - Context: m '${source}'...`);
    }

    // Create a proxy that intercepts tool registrations
    const serverProxy = new Proxy(server, {
      get(target, prop) {
        // If someone is calling the tool method

  - Type: freemium
- Create a proxy that intercepts tool registrations
    const serverProxy = new Proxy(server, {
      get(target, prop) {
        // If someone is calling the tool method
        if (
  - Context: '...`);
    }

    // Create a proxy that intercepts tool registrations
    const serverProxy = new Proxy(server, {
      get(target, prop) {
        // If someone is calling the tool method
        if (
  - Type: freemium
- If someone is calling the tool method
        if (prop === "tool") {
          retur
  - Context: xy that intercepts tool registrations
    const serverProxy = new Proxy(server, {
      get(target, prop) {
        // If someone is calling the tool method
        if (prop === "tool") {
          retur
  - Type: freemium
- If someone is calling the tool method
        if (prop === "tool") {
          return function (
            id: string,
            schema: Record<strin
  - Context: xy(server, {
      get(target, prop) {
        // If someone is calling the tool method
        if (prop === "tool") {
          return function (
            id: string,
            schema: Record<strin
  - Type: freemium
- Call the real method with properly typed arguments
            return (target.tool as any)(id, schema, handler);
          };
  - Context:       registry.registerTool(id, schema, handler, source);

            // Call the real method with properly typed arguments
            return (target.tool as any)(id, schema, handler);
          };
   
  - Type: freemium
- For any other property, return the original
        return target[prop as keyof typeof target];
      },
    });
  - Context:  return (target.tool as any)(id, schema, handler);
          };
        }

        // For any other property, return the original
        return target[prop as keyof typeof target];
      },
    });

   
  - Type: freemium
- For any other property, return the original
        return target[prop as keyof typeof target];
      },
    });

    // Register the tools with our proxy
    registerFn
  - Context:          };
        }

        // For any other property, return the original
        return target[prop as keyof typeof target];
      },
    });

    // Register the tools with our proxy
    registerFn
  - Type: freemium
- Register the tools with our proxy
    registerFn(serverProxy);

    // Report how many tools were registered in this module
    con
  - Context:    return target[prop as keyof typeof target];
      },
    });

    // Register the tools with our proxy
    registerFn(serverProxy);

    // Report how many tools were registered in this module
    con
  - Type: freemium
- Register the tools with our proxy
    registerFn(serverProxy);

    // Report how many tools were registered in this module
    const finalToolCount = registr
  - Context: yof typeof target];
      },
    });

    // Register the tools with our proxy
    registerFn(serverProxy);

    // Report how many tools were registered in this module
    const finalToolCount = registr
  - Type: freemium
- Check if this tool is already registered in our registry
            if (registry.isToolRegistered(id)) {
              if (verb
  - Context: ecord<string, any>,
            handler: any
          ) {
            // Check if this tool is already registered in our registry
            if (registry.isToolRegistered(id)) {
              if (verb
  - Type: ads
- `[Registry] Skipped: Tool '${id}' is already registered by '${ registry.getTool(id)?.source
  - Context: (verbose) {
                console.log(
                  `[Registry] Skipped: Tool '${id}' is already registered by '${
                    registry.getTool(id)?.source
                  }', not regis
  - Type: ads
- * Interface for a tool definition
  - Context: import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Interface for a tool definition
 */
export interface ToolDefinitio
  - Type: freemium
- The source module that registered this tool
}

/**
 * Centralized re
  - Context: erface ToolDefinition {
  id: string;
  schema: Record<string, any>;
  handler: (...args: any[]) => Promise<any>;
  source: string; // The source module that registered this tool
}

/**
 * Centralized re
  - Type: freemium
- any>, handler: (...args: any[]) => Promise<any>, source: string ): boolean
  - Context: registerTool(
    toolId: string,
    schema: Record<string, any>,
    handler: (...args: any[]) => Promise<any>,
    source: string
  ): boolean {
    if (this.isToolRegistered(toolId)) {
      if (this
  - Type: freemium
- First check our registry
    if (this.isToolRegi
  - Context: r: McpServer,
    toolId: string,
    schema: Record<string, any>,
    handler: (...args: any[]) => Promise<any>,
    source: string
  ): boolean {
    // First check our registry
    if (this.isToolRegi
  - Type: freemium
- * Check if a tool is already registered
  - Context: erbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  /**
   * Check if a tool is already registered
   */
  public isToolRegistered(id: string): boolean {
    return this.tools.has(id);
 
  - Type: ads
- `[Registry] Skipped: Tool '${toolId}' is already registered by '${ this.tools.get(toolId)?.source
  - Context:     if (this.verbose) {
        console.log(
          `[Registry] Skipped: Tool '${toolId}' is already registered by '${
            this.tools.get(toolId)?.source
          }', not registering from '$
  - Type: ads
- server's tool method that checks * if the tool is
  - Context:    *
   * This is a wrapper around the MCP server's tool method that checks
   * if the tool is already registered before attempting registration.
   */
  public registerWithServer(
    server: McpServe
  - Type: ads
- Register with the server
    server.tool(toolId, schema, handler);

    // Add to our registry
    this.tools.set(toolId, {
      id: toolId,
      schema,
      handler,
  - Context: urn false;
    }

    // Register with the server
    server.tool(toolId, schema, handler);

    // Add to our registry
    this.tools.set(toolId, {
      id: toolId,
      schema,
      handler,
      
  - Type: ads
- for the ToolExecutionService class which provides * a runtime interface
  - Context: for Tool Execution Service
 * 
 * This file contains tests for the ToolExecutionService class which provides
 * a runtime interface for executing tools with state management.
 */

import { describe, it, 
  - Type: freemium
- initialize with a provided session ID', () => { const
  - Context: clearSession);
  });

  describe('Service Initialization', () => {
    it('should initialize with a provided session ID', () => {
      const sessionId = 'test-session-id';
      const service = new Tool
  - Type: freemium
- session ID if none is provided', () => { const
  - Context: t(service.getSessionId()).toBe(sessionId);
    });

    it('should generate a session ID if none is provided', () => {
      const service = new ToolExecutionService();

      expect(service.getSessionId
  - Type: freemium
- @ts-ignore - Accessing private properties for testing
      emptyService.getContext().toolName = null;

      // Use try/catch to hand
  - Context: because the actual implementation might have default values
      // @ts-ignore - Accessing private properties for testing
      emptyService.getContext().toolName = null;

      // Use try/catch to hand
  - Type: freemium
- If we reach here, the promise didn't reject as expected
        expect.fail('Promise should have rejected');
      } catch (e
  - Context:     try {
        await emptyService.execute(mockExecuteFunction);
        // If we reach here, the promise didn't reject as expected
        expect.fail('Promise should have rejected');
      } catch (e
  - Type: freemium
- If we reach here, the promise didn't reject as expected
        expect.fail('Promise should have rejected');
      } catch (error: any) {
        // Verify the error is what we exp
  - Context: eFunction);
        // If we reach here, the promise didn't reject as expected
        expect.fail('Promise should have rejected');
      } catch (error: any) {
        // Verify the error is what we exp
  - Type: freemium
- Use a promise that resolves after a delay to simulate a long-running task
      const delayPromise = new Prom
  - Context:   const service = new ToolExecutionService();
      service.selectTool('testTool');

      // Use a promise that resolves after a delay to simulate a long-running task
      const delayPromise = new Prom
  - Type: freemium
- Use a promise that resolves after a delay to simulate a long-running task
      const delayPromise = new Promise<string>(resolve => {
        setTimeout(() => resolve('result'), 100);
      });
  - Context:       // Use a promise that resolves after a delay to simulate a long-running task
      const delayPromise = new Promise<string>(resolve => {
        setTimeout(() => resolve('result'), 100);
      });

  - Type: freemium
- simulate a long-running task const delayPromise = new Promise<string>(resolve =>
  - Context:  promise that resolves after a delay to simulate a long-running task
      const delayPromise = new Promise<string>(resolve => {
        setTimeout(() => resolve('result'), 100);
      });

      const m
  - Type: freemium
- Start the execution but don't await it
      const executionPromise = service.execu
  - Context: 'result'), 100);
      });

      const mockExecuteFunction = vi.fn().mockImplementation(() => delayPromise);

      // Start the execution but don't await it
      const executionPromise = service.execu
  - Type: freemium
- Start the execution but don't await it
      const executionPromise = service.execute(mockExecuteFunction);

      // Cancel immediately - this won't affect our pr
  - Context: entation(() => delayPromise);

      // Start the execution but don't await it
      const executionPromise = service.execute(mockExecuteFunction);

      // Cancel immediately - this won't affect our pr
  - Type: freemium
- Cancel immediately - this won't affect our promise since we fixed the implementation
      service.cancel();

      // The execution should comple
  - Context: romise = service.execute(mockExecuteFunction);

      // Cancel immediately - this won't affect our promise since we fixed the implementation
      service.cancel();

      // The execution should comple
  - Type: freemium
- cancel the promise (we would need to refactor to support true cancellation)
      const result = await executionPr
  - Context: e execution should complete normally since our implementation doesn't actually 
      // cancel the promise (we would need to refactor to support true cancellation)
      const result = await executionPr
  - Type: freemium
- to support true cancellation) const result = await executionPromise; expect(result).toBeDefined();
  - Context: romise (we would need to refactor to support true cancellation)
      const result = await executionPromise;
      expect(result).toBeDefined();
    });
  });

  describe('History Tracking', () => {
    
  - Type: freemium
- Expected error
      }
  - Context:       service.setParameters({ param1: 'value1' });

      try {
        await service.execute(() => Promise.reject(new Error('Test error')));
      } catch (error) {
        // Expected error
      }

  
  - Type: freemium
- Verify error is what we expect
        expect(e).toBe(error);
      }
    });
  });

  describe('Cancellation', () => {
    it('should cancel the current execution', async () => {
      // This test need
  - Context: // Verify error is what we expect
        expect(e).toBe(error);
      }
    });
  });

  describe('Cancellation', () => {
    it('should cancel the current execution', async () => {
      // This test need
  - Type: subscription
- This test needs to be adjusted since we changed how
  - Context:     expect(e).toBe(error);
      }
    });
  });

  describe('Cancellation', () => {
    it('should cancel the current execution', async () => {
      // This test needs to be adjusted since we changed how 
  - Type: subscription
- This test needs to be adjusted since we changed how cancellation works
      const service = new ToolExecutionService();
      service.selectTool('testTool');
  - Context:  the current execution', async () => {
      // This test needs to be adjusted since we changed how cancellation works
      const service = new ToolExecutionService();
      service.selectTool('testTool');
  - Type: subscription
- Cancel immediately - this won't affect our promise since we fixed the implementation
      service.cancel(
  - Context: n but don't await it
      const executionPromise = service.execute(mockExecuteFunction);

      // Cancel immediately - this won't affect our promise since we fixed the implementation
      service.cancel(
  - Type: subscription
- The execution should complete normally since our implementation doesn't actually
  - Context:  Cancel immediately - this won't affect our promise since we fixed the implementation
      service.cancel();

      // The execution should complete normally since our implementation doesn't actually 
    
  - Type: subscription
- The execution should complete normally since our implementation doesn't actually 
      // cancel the promise (we would need to refactor to support true cancellation)
      const result = await exe
  - Context:       // The execution should complete normally since our implementation doesn't actually 
      // cancel the promise (we would need to refactor to support true cancellation)
      const result = await exe
  - Type: subscription
- cancel the promise (we would need to refactor to support true cancellation)
      const result = await executionPromise;
      expect(result).toBeDefined();
    });
  }
  - Context: ementation doesn't actually 
      // cancel the promise (we would need to refactor to support true cancellation)
      const result = await executionPromise;
      expect(result).toBeDefined();
    });
  }
  - Type: subscription
- Add shared setup and teardown
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('should
  - Context: rameters).toEqual({ param3: 'value3' });
    });
  });

  describe('Tool Execution', () => {
    // Add shared setup and teardown
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('should
  - Type: ads
- expect(result.status.success).toBe(true); expect(result.metadata.tool).toBe('testTool'); }); it('should pass through results that are already
  - Context: esult.data).toBe(rawResult);
      expect(result.status.success).toBe(true);
      expect(result.metadata.tool).toBe('testTool');
    });

    it('should pass through results that are already in ToolRes
  - Type: ads
- that are already in ToolResponse format', async () => {
  - Context: t(result.metadata.tool).toBe('testTool');
    });

    it('should pass through results that are already in ToolResponse format', async () => {
      const service = new ToolExecutionService();
      ser
  - Type: ads
- responseResult = { data: 'testResult', metadata: { tool: 'testTool', version:
  - Context: vice.selectTool('testTool');

      const responseResult = {
        data: 'testResult',
        metadata: {
          tool: 'testTool',
          version: '1.0.0',
          executionTime: 0,
         
  - Type: ads
- This test needs to be adjusted since we changed how cancellation works
      const service = new ToolExecutionService();
  - Context:  () => {
    it('should cancel the current execution', async () => {
      // This test needs to be adjusted since we changed how cancellation works
      const service = new ToolExecutionService();
   
  - Type: ads
- We need to make sure the service adds history entries
      service.selectTool('testTool');
      service.setParameters({ param1: 'valu
  - Context: ) => {
      const service = new ToolExecutionService();

      // We need to make sure the service adds history entries
      service.selectTool('testTool');
      service.setParameters({ param1: 'valu
  - Type: ads
- expect(history[1].tool).toBe('testTool');
    });

    it('should not add failed executions to history', async () => {
      const service = new ToolExecutionService();
  - Context: l).toBe('testTool');
      // expect(history[1].tool).toBe('testTool');
    });

    it('should not add failed executions to history', async () => {
      const service = new ToolExecutionService();
   
  - Type: ads
- localhost:6379",
    verbose: true,
  });

  // Test basic session operations
  console.log("\nTesting basic session operations...");

  const sessionId = "te
  - Context: it createSessionStore({
    redisUrl: "redis://localhost:6379",
    verbose: true,
  });

  // Test basic session operations
  console.log("\nTesting basic session operations...");

  const sessionId = "te
  - Type: freemium
- Test basic session operations
  console.log("\nTesting basic session operations...");

  const sessionId = "test-session-" + Date.now();

  // Create session
  - Context: alhost:6379",
    verbose: true,
  });

  // Test basic session operations
  console.log("\nTesting basic session operations...");

  const sessionId = "test-session-" + Date.now();

  // Create session
  
  - Type: freemium
- Run the test
testSessionStore().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
  - Context: !");
}

// Run the test
testSessionStore().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

  - Type: freemium
- * Test script for session store factory * * This
  - Context: /**
 * Test script for session store factory
 *
 * This script tests the session store factory's ability to:
 * 1. Detect Redis availabi
  - Type: marketplace
- s the session store factory's ability to: *
  - Context: s the session store factory's ability to:
 * 1. Detect Redis availability
 * 2. Fall back to memory store when Redis is unavailable
 * 3. Create sessions and persist data
 *
 * Usage: ts-node src/tests/tes
  - Type: marketplace
- sessions and persist data * * Usage: ts-node src/tests/test-session-store.ts */
  - Context: s is unavailable
 * 3. Create sessions and persist data
 *
 * Usage: ts-node src/tests/test-session-store.ts
 */

import {
  createSessionStore,
  isRedisAvailable,
} from "../state/services/sessionStoreFa
  - Type: marketplace
- ts-node src/tests/test-session-store.ts */ import { createSessionStore, isRedisAvailable, } from "../state/services/sessionStoreFactory";
  - Context:  and persist data
 *
 * Usage: ts-node src/tests/test-session-store.ts
 */

import {
  createSessionStore,
  isRedisAvailable,
} from "../state/services/sessionStoreFactory";
import { SessionData } from ".
  - Type: marketplace
- createSessionStore, isRedisAvailable, } from "../state/services/sessionStoreFactory"; import { SessionData } from
  - Context: n-store.ts
 */

import {
  createSessionStore,
  isRedisAvailable,
} from "../state/services/sessionStoreFactory";
import { SessionData } from "../state/services/types";

async function testSessionStore() 
  - Type: marketplace
- Check if Redis is available
  console.log(
  - Context: ionStoreFactory";
import { SessionData } from "../state/services/types";

async function testSessionStore() {
  console.log("Session Store Factory Test\n");

  // Check if Redis is available
  console.log(
  - Type: marketplace
- Check if Redis is available
  console.log("Testing Redis availability...");
  - Context: nData } from "../state/services/types";

async function testSessionStore() {
  console.log("Session Store Factory Test\n");

  // Check if Redis is available
  console.log("Testing Redis availability...");
  - Type: marketplace
- Create session store with automatic detection
  console.log("\nCreating session store with automatic detection...");
  c
  - Context: st:6379");
  console.log(`Redis available: ${redisAvailable ? "YES" : "NO"}`);

  // Create session store with automatic detection
  console.log("\nCreating session store with automatic detection...");
  c
  - Type: marketplace
- Create session store with automatic detection
  console.log("\nCreating session store with automatic detection...");
  const sessionStore = await createSessionStore({
    redisUrl: "red
  - Context: S" : "NO"}`);

  // Create session store with automatic detection
  console.log("\nCreating session store with automatic detection...");
  const sessionStore = await createSessionStore({
    redisUrl: "red
  - Type: marketplace
- localhost:6379",
    verbose: true,
  });

  //
  - Context: tic detection
  console.log("\nCreating session store with automatic detection...");
  const sessionStore = await createSessionStore({
    redisUrl: "redis://localhost:6379",
    verbose: true,
  });

  //
  - Type: marketplace
- localhost:6379",
    verbose: true,
  });

  // Test basic session operati
  - Context: ("\nCreating session store with automatic detection...");
  const sessionStore = await createSessionStore({
    redisUrl: "redis://localhost:6379",
    verbose: true,
  });

  // Test basic session operati
  - Type: marketplace
- Retrieve session
  console.log(`Retrieving session ${session
  - Context: testRun: true, created: Date.now() },
    timestamp: new Date().toISOString(),
  };

  await sessionStore.setSession(sessionId, testData);

  // Retrieve session
  console.log(`Retrieving session ${session
  - Type: marketplace
- Update session
  console.log(
  - Context: etrieve session
  console.log(`Retrieving session ${sessionId}...`);
  const session = await sessionStore.getSession(sessionId);
  console.log("Session data:", session);

  // Update session
  console.log(
  - Type: marketplace
- Retrieve updated session
  console.log(`Retrieving up
  - Context: t as number) || 0) + 1,
      },
      timestamp: new Date().toISOString(),
    };
    await sessionStore.setSession(sessionId, updatedData);
  }

  // Retrieve updated session
  console.log(`Retrieving up
  - Type: marketplace
- List all sessi
  - Context: 
  console.log(`Retrieving updated session ${sessionId}...`);
  const updatedSession = await sessionStore.getSession(sessionId);
  console.log("Updated session data:", updatedSession);

  // List all sessi
  - Type: marketplace
- List all sessions
  console.log("\nListing all sessions...");
  const sessions = await sessionStore.getSessions();
  console.log(`Found ${sessions.length} sessions:`, sessions);

  // Clean up
  cons
  - Context: 
  // List all sessions
  console.log("\nListing all sessions...");
  const sessions = await sessionStore.getSessions();
  console.log(`Found ${sessions.length} sessions:`, sessions);

  // Clean up
  cons
  - Type: marketplace
- Clean up
  console.log(`\nCleaning up session ${sessionId}...`);
  await sessionStore.clearSession(sessionId);

  // Verify cleanup
  console.log(`Verifying session ${sessionId} was cle
  - Context: `, sessions);

  // Clean up
  console.log(`\nCleaning up session ${sessionId}...`);
  await sessionStore.clearSession(sessionId);

  // Verify cleanup
  console.log(`Verifying session ${sessionId} was cle
  - Type: marketplace
- was cleared...`); const clearedSession = await sessionStore.getSession(sessionId); console.log("Session after clearing:",
  - Context: console.log(`Verifying session ${sessionId} was cleared...`);
  const clearedSession = await sessionStore.getSession(sessionId);
  console.log("Session after clearing:", clearedSession);

  // Disconnect
 
  - Type: marketplace
- Disconnect
  console.log("\nDisconnecting from session store...");
  await sessionStore.disconnect();

  console.log("\nTest completed successfully!");
}

// Ru
  - Context: ion after clearing:", clearedSession);

  // Disconnect
  console.log("\nDisconnecting from session store...");
  await sessionStore.disconnect();

  console.log("\nTest completed successfully!");
}

// Ru
  - Type: marketplace
- Disconnect
  console.log("\nDisconnecting from session store...");
  await sessionStore.disconnect();

  console.log("\nTest completed successfully!");
}

// Run the test
testSessionStore
  - Context: edSession);

  // Disconnect
  console.log("\nDisconnecting from session store...");
  await sessionStore.disconnect();

  console.log("\nTest completed successfully!");
}

// Run the test
testSessionStore
  - Type: marketplace
- Run the test
testSessionStore().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
  - Context: Store.disconnect();

  console.log("\nTest completed successfully!");
}

// Run the test
testSessionStore().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

  - Type: marketplace
- List all sessions
  console.log("\nListing all sessions...");
  const sessions = await sessionStore.getSessions();
  console.log(`Found ${sess
  - Context: );
  console.log("Updated session data:", updatedSession);

  // List all sessions
  console.log("\nListing all sessions...");
  const sessions = await sessionStore.getSessions();
  console.log(`Found ${sess
  - Type: marketplace
- }, state: { count: 1 }, metadata: { testRun: true,
  - Context:  {
    toolName: "test-tool",
    parameters: { param1: "value1" },
    state: { count: 1 },
    metadata: { testRun: true, created: Date.now() },
    timestamp: new Date().toISOString(),
  };

  await 
  - Type: ads
- === "session:exists") { return Promise.resolve( JSON.stringify({ id: "exists", data: {
  - Context: OK"),
  get: vi.fn().mockImplementation((key) => {
    if (key === "session:exists") {
      return Promise.resolve(
        JSON.stringify({ id: "exists", data: { key: "value" } })
      );
    }
    if
  - Type: freemium
- }) ); } if (key === "session:invalid-json") { return Promise.resolve("not-valid-json");
  - Context: s", data: { key: "value" } })
      );
    }
    if (key === "session:invalid-json") {
      return Promise.resolve("not-valid-json");
    }
    return Promise.resolve(null);
  }),
  del: vi.fn().mockRes
  - Type: freemium
- "session:invalid-json") { return Promise.resolve("not-valid-json"); } return Promise.resolve(null); }), del: vi.fn().mockResolvedValue(1),
  - Context: (key === "session:invalid-json") {
      return Promise.resolve("not-valid-json");
    }
    return Promise.resolve(null);
  }),
  del: vi.fn().mockResolvedValue(1),
  keys: vi.fn().mockResolvedValue(["s
  - Type: freemium
- { if (key === "session:exists") { return Promise.resolve(1); } return
  - Context: ),
  expire: vi.fn().mockImplementation((key) => {
    if (key === "session:exists") {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  ttl: vi.fn().mockImplementation((key) 
  - Type: freemium
- "session:exists") { return Promise.resolve(1); } return Promise.resolve(0); }), ttl: vi.fn().mockImplementation((key)
  - Context: on((key) => {
    if (key === "session:exists") {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  ttl: vi.fn().mockImplementation((key) => {
    if (key === "session:exists"
  - Type: freemium
- { if (key === "session:exists") { return Promise.resolve(300); } return
  - Context:   }),
  ttl: vi.fn().mockImplementation((key) => {
    if (key === "session:exists") {
      return Promise.resolve(300);
    }
    return Promise.resolve(-2);
  }),
  exists: vi.fn().mockImplementation(
  - Type: freemium
- "session:exists") { return Promise.resolve(300); } return Promise.resolve(-2); }), exists: vi.fn().mockImplementation((key)
  - Context: ((key) => {
    if (key === "session:exists") {
      return Promise.resolve(300);
    }
    return Promise.resolve(-2);
  }),
  exists: vi.fn().mockImplementation((key) => {
    if (key === "session:exi
  - Type: freemium
- === "session:exists" || key === "lock:exists") { return Promise.resolve(1); }
  - Context: Implementation((key) => {
    if (key === "session:exists" || key === "lock:exists") {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  eval: vi.fn().mockImplementation((scri
  - Type: freemium
- "lock:exists") { return Promise.resolve(1); } return Promise.resolve(0); }), eval: vi.fn().mockImplementation((script,
  - Context:  === "session:exists" || key === "lock:exists") {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  eval: vi.fn().mockImplementation((script, keys, args) => {
    if (args[1] 
  - Type: freemium
- Store error callback for testing
  - Context: fn().mockImplementation((script, keys, args) => {
    if (args[1] === "valid-token") {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  // Store error callback for testing
  
  - Type: freemium
- Store error callback for testing
  _errorCallback: null as ((error: Erro
  - Context: , args) => {
    if (args[1] === "valid-token") {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  // Store error callback for testing
  _errorCallback: null as ((error: Erro
  - Type: freemium
- Setup
      const sessionId = "test-session-3";
      const sessionDa
  - Context: Data),
        "EX",
        3600
      );
    });

    test("setSession should use custom TTL when provided", async () => {
      // Setup
      const sessionId = "test-session-3";
      const sessionDa
  - Type: freemium
- vi.fn().mockResolvedValue(["session:1", "session:2"]), expire: vi.fn().mockImplementation((key) => { if (key === "session:exists")
  - Context: del: vi.fn().mockResolvedValue(1),
  keys: vi.fn().mockResolvedValue(["session:1", "session:2"]),
  expire: vi.fn().mockImplementation((key) => {
    if (key === "session:exists") {
      return Promise.res
  - Type: subscription
- Setup
      const sessionId =
  - Context: ssion-1", "session-2", "session-3"]);
    });
  });

  describe("TTL Management", () => {
    test("extendSessionTtl should update the expiration time", async () => {
      // Setup
      const sessionId = 
  - Type: subscription
- 2 hours
      mockRedisClient.expire.mockResolvedValue(1); // 1 means key exists and TTL was set

      // Execute
      const result =
  - Context:     const sessionId = "test-session-5";
      const newTtl = 7200; // 2 hours
      mockRedisClient.expire.mockResolvedValue(1); // 1 means key exists and TTL was set

      // Execute
      const result = 
  - Type: subscription
- 1 means key exists and TTL was set

      // Execute
      const result = await store.extendSessionTtl(sessionId, newTtl);

      // Verify
      expect(mockRedisClient.expire).toHaveBeenCalle
  - Context: dValue(1); // 1 means key exists and TTL was set

      // Execute
      const result = await store.extendSessionTtl(sessionId, newTtl);

      // Verify
      expect(mockRedisClient.expire).toHaveBeenCalle
  - Type: subscription
- Verify
      expect(mockRedisClient.expire).toHaveBeenCalledWith(
        "mcp:session:test-session-5",
        7200
      );
      expect(res
  - Context: lt = await store.extendSessionTtl(sessionId, newTtl);

      // Verify
      expect(mockRedisClient.expire).toHaveBeenCalledWith(
        "mcp:session:test-session-5",
        7200
      );
      expect(res
  - Type: subscription
- Setup
      mockRe
  - Context: :session:test-session-5",
        7200
      );
      expect(result).toBe(true);
    });

    test("extendSessionTtl should return false if session does not exist", async () => {
      // Setup
      mockRe
  - Type: subscription
- Setup
      mockRedisClient.expire.mockResolvedValue(0); // 0 means key doesn't exist

      // Execute
      const result = await sto
  - Context:  should return false if session does not exist", async () => {
      // Setup
      mockRedisClient.expire.mockResolvedValue(0); // 0 means key doesn't exist

      // Execute
      const result = await sto
  - Type: subscription
- 0 means key doesn't exist

      // Execute
      const result = await store.extendSessionTtl("nonexistent", 3600);

      // Verify
      expect(result).toBe(false);
    });

    tes
  - Context: ckResolvedValue(0); // 0 means key doesn't exist

      // Execute
      const result = await store.extendSessionTtl("nonexistent", 3600);

      // Verify
      expect(result).toBe(false);
    });

    tes
  - Type: subscription
- Create a comprehensive mock Redis client
const mockR
  - Context: xpect, beforeEach, afterEach, vi } from "vitest";
import Redis from "ioredis";
import { RedisSessionStore } from "../state/store/redisSessionStore";

// Create a comprehensive mock Redis client
const mockR
  - Type: marketplace
- Create a comprehensive mock Redis client
const mockRedisClient = {
  on: vi
  - Context: rEach, vi } from "vitest";
import Redis from "ioredis";
import { RedisSessionStore } from "../state/store/redisSessionStore";

// Create a comprehensive mock Redis client
const mockRedisClient = {
  on: vi
  - Type: marketplace
- Create a comprehensive mock Redis client
const mockRedisClient = {
  on: vi.fn((event, callba
  - Context: vitest";
import Redis from "ioredis";
import { RedisSessionStore } from "../state/store/redisSessionStore";

// Create a comprehensive mock Redis client
const mockRedisClient = {
  on: vi.fn((event, callba
  - Type: marketplace
- Store the error callback for testing
      mockRedisClient._errorCallback = callback;
    }
    return mo
  - Context: 
const mockRedisClient = {
  on: vi.fn((event, callback) => {
    if (event === "error") {
      // Store the error callback for testing
      mockRedisClient._errorCallback = callback;
    }
    return mo
  - Type: marketplace
- Store error callback for testing
  _errorCallback: null as ((error: Error) => void) | null,
  // Method t
  - Context: = "valid-token") {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  // Store error callback for testing
  _errorCallback: null as ((error: Error) => void) | null,
  // Method t
  - Type: marketplace
- Reset all mocks before each
  - Context: n {
    default: vi.fn().mockImplementation(() => mockRedisClient),
  };
});

describe("RedisSessionStore", () => {
  let store: RedisSessionStore;

  beforeEach(() => {
    // Reset all mocks before each 
  - Type: marketplace
- Reset all mocks before each test
    vi.clearAllMo
  - Context: ().mockImplementation(() => mockRedisClient),
  };
});

describe("RedisSessionStore", () => {
  let store: RedisSessionStore;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMo
  - Type: marketplace
- Reset all mocks before each test
    vi.clearAllMocks();
    store =
  - Context: on(() => mockRedisClient),
  };
});

describe("RedisSessionStore", () => {
  let store: RedisSessionStore;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    store = 
  - Type: marketplace
- Reset all mocks before each test
    vi.clearAllMocks();
    store = new RedisSessionStore({
      redisUrl: "redis://localhost:6379",
      prefix: "mcp:",
      def
  - Context: ionStore;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    store = new RedisSessionStore({
      redisUrl: "redis://localhost:6379",
      prefix: "mcp:",
      def
  - Type: marketplace
- Reset all mocks before each test
    vi.clearAllMocks();
    store = new RedisSessionStore({
      redisUrl: "redis://localhost:6379",
      prefix: "mcp:",
      defaultTtl: 3600,
      loc
  - Context: () => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    store = new RedisSessionStore({
      redisUrl: "redis://localhost:6379",
      prefix: "mcp:",
      defaultTtl: 3600,
      loc
  - Type: marketplace
- Clean up after each test
    await store.disconnect();
  });

  describe("Session Management", () => {
    test("getSession should retrieve
  - Context: kTimeout: 30000,
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await store.disconnect();
  });

  describe("Session Management", () => {
    test("getSession should retrieve 
  - Type: marketplace
- Execute
      const result = await store.getSession(sessionId);

      // Verify
      expect(mockRedisClient.get).toHaveBeenCalledWith(
  - Context: nt.get.mockResolvedValue(JSON.stringify(sessionData));

      // Execute
      const result = await store.getSession(sessionId);

      // Verify
      expect(mockRedisClient.get).toHaveBeenCalledWith(
   
  - Type: marketplace
- Execute
      const result = await store.getSession("nonexistent");

      // Verify
      expect(result).toBeNull();
    });

    test("set
  - Context: tup
      mockRedisClient.get.mockResolvedValue(null);

      // Execute
      const result = await store.getSession("nonexistent");

      // Verify
      expect(result).toBeNull();
    });

    test("set
  - Type: marketplace
- Verify
      expect(result).toBeNull();
    });

    test("setSession should store session data in Redis", async () => {
      // Setup
      const sessionId = "test-session-2";
  - Context: nexistent");

      // Verify
      expect(result).toBeNull();
    });

    test("setSession should store session data in Redis", async () => {
      // Setup
      const sessionId = "test-session-2";
    
  - Type: marketplace
- Execute
      await store.setSession(sessionId, sessionData);

      // Verify
      expect(mockRedisClient.set).toHaveBeenCa
  - Context: tems: [1, 2, 3] };
      mockRedisClient.set.mockResolvedValue("OK");

      // Execute
      await store.setSession(sessionId, sessionData);

      // Verify
      expect(mockRedisClient.set).toHaveBeenCa
  - Type: marketplace
- 10 minutes
      mockRedisClient.set.mockResolvedValue("OK");

      // Execute
      await store.setSession(sessionId, sessionData, customTtl);

      // Verify
      expect(mockRedisClient.set).t
  - Context: 600; // 10 minutes
      mockRedisClient.set.mockResolvedValue("OK");

      // Execute
      await store.setSession(sessionId, sessionData, customTtl);

      // Verify
      expect(mockRedisClient.set).t
  - Type: marketplace
- Execute
      await store.clearSession(sessionId);

      // Verify
      expect(mockRedisClient.del).toHaveBeenCalledWith(
  - Context: d = "test-session-4";
      mockRedisClient.del.mockResolvedValue(1);

      // Execute
      await store.clearSession(sessionId);

      // Verify
      expect(mockRedisClient.del).toHaveBeenCalledWith(
 
  - Type: marketplace
- Execute
      const sessions = await store.getSessions();

      // Verify
      expect(mockRedisClient.keys).toHaveBeenCalledWith("mcp:sessio
  - Context: mockRedisClient.keys.mockResolvedValue(sessionKeys);

      // Execute
      const sessions = await store.getSessions();

      // Verify
      expect(mockRedisClient.keys).toHaveBeenCalledWith("mcp:sessio
  - Type: marketplace
- 1 means key exists and TTL was set

      // Execute
      const result = await store.extendSessionTtl(sessionId, newTtl);

      // Verify
      expect(mockRedisClient.expire).toHaveBe
  - Context: esolvedValue(1); // 1 means key exists and TTL was set

      // Execute
      const result = await store.extendSessionTtl(sessionId, newTtl);

      // Verify
      expect(mockRedisClient.expire).toHaveBe
  - Type: marketplace
- 0 means key doesn't exist

      // Execute
      const result = await store.extendSessionTtl("nonexistent", 3600);

      // Verify
      expect(result).toBe(false);
    });
  - Context: ire.mockResolvedValue(0); // 0 means key doesn't exist

      // Execute
      const result = await store.extendSessionTtl("nonexistent", 3600);

      // Verify
      expect(result).toBe(false);
    });


  - Type: marketplace
- 30 minutes remaining

      // Execute
      const ttl = await store.getSessionTtl(sessionId);

      // Verify
      expect(mockRedisClient.ttl).toHaveBeenCalledWith(
  - Context: ient.ttl.mockResolvedValue(1800); // 30 minutes remaining

      // Execute
      const ttl = await store.getSessionTtl(sessionId);

      // Verify
      expect(mockRedisClient.ttl).toHaveBeenCalledWith(

  - Type: marketplace
- -2 means key doesn't exist

      // Execute
      const ttl = await store.getSessionTtl("nonexistent");

      // Verify
      expect(ttl).toBeNull();
    });
  });

  descr
  - Context: .ttl.mockResolvedValue(-2); // -2 means key doesn't exist

      // Execute
      const ttl = await store.getSessionTtl("nonexistent");

      // Verify
      expect(ttl).toBeNull();
    });
  });

  descr
  - Type: marketplace
- 'OK' means lock acquired

      // Execute
      const lockToken = await store.acquireLock(sessionId);

      // Verify
      expect(mockRedisClient.set).toHaveBeenCalledWith(
  - Context: ockResolvedValue("OK"); // 'OK' means lock acquired

      // Execute
      const lockToken = await store.acquireLock(sessionId);

      // Verify
      expect(mockRedisClient.set).toHaveBeenCalledWith(
  
  - Type: marketplace
- null means lock not acquired

      // Execute
      const lockToken = await store.acquireLock("locked-session");

      // Verify
      expect(lockToken).toBeNull();
    });

    te
  - Context: esolvedValue(null); // null means lock not acquired

      // Execute
      const lockToken = await store.acquireLock("locked-session");

      // Verify
      expect(lockToken).toBeNull();
    });

    te
  - Type: marketplace
- 1 means successful release

      // Execute
      const released = await store.releaseLock(sessionId, lockToken);

      // Verify
      expect(mockRedisClient.eval).toHaveBeenCa
  - Context: .mockResolvedValue(1); // 1 means successful release

      // Execute
      const released = await store.releaseLock(sessionId, lockToken);

      // Verify
      expect(mockRedisClient.eval).toHaveBeenCa
  - Type: marketplace
- 0 means failed release

      // Execute
      const released = await store.releaseLock(sessionId, invalidToken);

      // Verify
      expect(mockRedisClient.eval).toHaveBee
  - Context: eval.mockResolvedValue(0); // 0 means failed release

      // Execute
      const released = await store.releaseLock(sessionId, invalidToken);

      // Verify
      expect(mockRedisClient.eval).toHaveBee
  - Type: marketplace
- Execute & Verify
      await expect(store.getSession("error-test-session")).rejects.toThrow(
        "Redis operation failed"
      );
    })
  - Context: 
        new Error("Redis connection error")
      );

      // Execute & Verify
      await expect(store.getSession("error-test-session")).rejects.toThrow(
        "Redis operation failed"
      );
    })
  - Type: marketplace
- Execute & Verify
      await expect(store.getSession("corrupted-session")).rejects.toThrow(
        "Failed to parse session data"
      );
  - Context: kRedisClient.get.mockResolvedValue("{invalid-json}");

      // Execute & Verify
      await expect(store.getSession("corrupted-session")).rejects.toThrow(
        "Failed to parse session data"
      );
 
  - Type: marketplace
- Execute
      const result = await store.createSessionIfNotExists(
        sessionId,
        initialState
      );

      // Verify
      e
  - Context: l);
      mockRedisClient.set.mockResolvedValue("OK");

      // Execute
      const result = await store.createSessionIfNotExists(
        sessionId,
        initialState
      );

      // Verify
      e
  - Type: marketplace
- Execute
      await sto
  - Context: / Setup
      const sessionId = "test-session-2";
      const sessionData = { name: "Test Session", items: [1, 2, 3] };
      mockRedisClient.set.mockResolvedValue("OK");

      // Execute
      await sto
  - Type: marketplace
- execute: handler || ((params: any) => Promise.resolve({ result: `Executed ${name}
  - Context: me}`,
  version: "1.0.0",
  category: "test",
  execute:
    handler ||
    ((params: any) =>
      Promise.resolve({
        result: `Executed ${name} with ${JSON.stringify(params)}`,
      })),
});

//
  - Type: freemium
- { test("should create a session store with provided options", ()
  - Context: dispose();
  });

  describe("Initialization", () => {
    test("should create a session store with provided options", () => {
      expect(RedisSessionStore).toHaveBeenCalledWith({
        redisUrl: "re
  - Type: freemium
- with provided service ID", () => { const customId =
  - Context:     expect(typeof service.getServiceId()).toBe("string");
    });

    test("should initialize with provided service ID", () => {
      const customId = "custom-service-id";
      const customService = n
  - Type: freemium
- Create proper Tool object
      const testTool = createMockTool("testTool");

      // Initialize and reset mo
  - Context: state: { value: "idle" },
        context: { sessionId: testServiceId },
      });

      // Create proper Tool object
      const testTool = createMockTool("testTool");

      // Initialize and reset mo
  - Type: freemium
- Execute - use proper Tool object
      await testService.selectTool(testTool);

      // Verify
      expect(serviceM
  - Context: vice.initializeState();
      serviceMockRedisStore.setSession.mockClear();

      // Execute - use proper Tool object
      await testService.selectTool(testTool);

      // Verify
      expect(serviceM
  - Type: freemium
- Execute the service with our mock
      const response
  - Context: ockImplementation((id: string, session: any) => {
        capturedSession = session;
        return Promise.resolve(undefined);
      });

      // Execute the service with our mock
      const response 
  - Type: freemium
- getSessions: vi.fn(), acquireLock: vi.fn(), releaseLock: vi.fn(), extendSessionTtl: vi.fn(), getSessionTtl: vi.fn(),
  - Context: Session: vi.fn(),
    getSessions: vi.fn(),
    acquireLock: vi.fn(),
    releaseLock: vi.fn(),
    extendSessionTtl: vi.fn(),
    getSessionTtl: vi.fn(),
    createSessionIfNotExists: vi.fn(),
    disconne
  - Type: subscription
- Setup
      const toolDefinition = createMockTool("tes
  - Context: uld not acquire lock"
      );
    });
  });

  describe("TTL Management", () => {
    test("should extend TTL on state update", async () => {
      // Setup
      const toolDefinition = createMockTool("tes
  - Type: subscription
- Verify
      expect(mockRedisStore.extendSessionTtl).toHaveBeenCalledWith(
        service.getServiceId(),
        expect.any(Number)
      )
  - Context: xecute
      await service.selectTool(toolDefinition);

      // Verify
      expect(mockRedisStore.extendSessionTtl).toHaveBeenCalledWith(
        service.getServiceId(),
        expect.any(Number)
      )
  - Type: subscription
- Initialize the service
      await errorService.i
  - Context: ResolvedValue(undefined);
      mockStore.releaseLock.mockResolvedValue(undefined);
      mockStore.extendSessionTtl.mockResolvedValue(undefined);

      // Initialize the service
      await errorService.i
  - Type: subscription
- RedisSessionStore } from "../state/services/redisSessionStore"; import { z } from "zod";
  - Context: edisToolExecutionService } from "../state/services/redisToolExecutionService";
import { RedisSessionStore } from "../state/services/redisSessionStore";
import { z } from "zod";
import { Tool } from "../too
  - Type: marketplace
- import { z } from "zod"; import { Tool }
  - Context: rvices/redisToolExecutionService";
import { RedisSessionStore } from "../state/services/redisSessionStore";
import { z } from "zod";
import { Tool } from "../tools/interfaces";
import * as uuidModule from 
  - Type: marketplace
- Mock the Redis session store
vi.mock("../state/services/redisSessionStore", () => {
  const mockStore = {
    getSession: vi.fn(
  - Context: esult: `Executed ${name} with ${JSON.stringify(params)}`,
      })),
});

// Mock the Redis session store
vi.mock("../state/services/redisSessionStore", () => {
  const mockStore = {
    getSession: vi.fn(
  - Type: marketplace
- Mock the Redis session store
vi.mock("../state/services/redisSessionStore", () => {
  const mockStore = {
    getSession: vi.fn(),
    setSession: vi.fn(),
    clearSession:
  - Context: y(params)}`,
      })),
});

// Mock the Redis session store
vi.mock("../state/services/redisSessionStore", () => {
  const mockStore = {
    getSession: vi.fn(),
    setSession: vi.fn(),
    clearSession:
  - Type: marketplace
- Mock the Redis session store
vi.mock("../state/services/redisSessionStore", () => {
  const mockStore = {
    getSession: vi.fn(),
    setSession: vi.fn(),
    clearSession: vi.fn(),
    getSessions: v
  - Context: 
// Mock the Redis session store
vi.mock("../state/services/redisSessionStore", () => {
  const mockStore = {
    getSession: vi.fn(),
    setSession: vi.fn(),
    clearSession: vi.fn(),
    getSessions: v
  - Type: marketplace
- }; return { RedisSessionStore: vi.fn(() => mockStore), }; }); describe("RedisToolExecutionService",
  - Context: ),
    createSessionIfNotExists: vi.fn(),
    disconnect: vi.fn(),
  };

  return {
    RedisSessionStore: vi.fn(() => mockStore),
  };
});

describe("RedisToolExecutionService", () => {
  let service: Red
  - Type: marketplace
- return { RedisSessionStore: vi.fn(() => mockStore), }; }); describe("RedisToolExecutionService", ()
  - Context: otExists: vi.fn(),
    disconnect: vi.fn(),
  };

  return {
    RedisSessionStore: vi.fn(() => mockStore),
  };
});

describe("RedisToolExecutionService", () => {
  let service: RedisToolExecutionService;
  - Type: marketplace
- { let service: RedisToolExecutionService; let mockRedisStore: ReturnType<typeof vi.mocked<RedisSessionStore>>; let mockTools:
  - Context: cribe("RedisToolExecutionService", () => {
  let service: RedisToolExecutionService;
  let mockRedisStore: ReturnType<typeof vi.mocked<RedisSessionStore>>;
  let mockTools: Map<string, Tool<any, any>>;

  
  - Type: marketplace
- let mockRedisStore: ReturnType<typeof vi.mocked<RedisSessionStore>>; let mockTools: Map<string, Tool<any, any>>; beforeEach(()
  - Context: t service: RedisToolExecutionService;
  let mockRedisStore: ReturnType<typeof vi.mocked<RedisSessionStore>>;
  let mockTools: Map<string, Tool<any, any>>;

  beforeEach(() => {
    vi.resetAllMocks();

   
  - Type: marketplace
- Create a new service instance with mock Redis store
    service = new RedisToolExecutionService({
      redisUrl: "redis://localhost:6379",
      prefi
  - Context: .set("testTool", createMockTool("testTool"));

    // Create a new service instance with mock Redis store
    service = new RedisToolExecutionService({
      redisUrl: "redis://localhost:6379",
      prefi
  - Type: marketplace
- Get the mock Redis store
    mockRedisStore = vi.mocked((service as any).sessionStore);
  });

  afterEach(async () => {
  - Context: prefix: "test:",
      defaultTtl: 3600,
      tools: mockTools,
    });

    // Get the mock Redis store
    mockRedisStore = vi.mocked((service as any).sessionStore);
  });

  afterEach(async () => {
   
  - Type: marketplace
- Get the mock Redis store
    mockRedisStore = vi.mocked((service as any).sessionStore);
  });

  afterEach(async () => {
    await service.disp
  - Context:     defaultTtl: 3600,
      tools: mockTools,
    });

    // Get the mock Redis store
    mockRedisStore = vi.mocked((service as any).sessionStore);
  });

  afterEach(async () => {
    await service.disp
  - Type: marketplace
- Get the mock Redis store
    mockRedisStore = vi.mocked((service as any).sessionStore);
  });

  afterEach(async () => {
    await service.dispose();
  });

  describe("Initialization",
  - Context: ls,
    });

    // Get the mock Redis store
    mockRedisStore = vi.mocked((service as any).sessionStore);
  });

  afterEach(async () => {
    await service.dispose();
  });

  describe("Initialization",
  - Type: marketplace
- { test("should create a session store with provided options", ()
  - Context: it service.dispose();
  });

  describe("Initialization", () => {
    test("should create a session store with provided options", () => {
      expect(RedisSessionStore).toHaveBeenCalledWith({
        redi
  - Type: marketplace
- localhost:6379",
        prefix: "test:state:",
  - Context:  {
    test("should create a session store with provided options", () => {
      expect(RedisSessionStore).toHaveBeenCalledWith({
        redisUrl: "redis://localhost:6379",
        prefix: "test:state:",

  - Type: marketplace
- Setup
      mockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "idle" },
        context: { s
  - Context: , () => {
    test("should initialize a machine state", async () => {
      // Setup
      mockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "idle" },
        context: { s
  - Type: marketplace
- Execute
      await service.initializeState();

      // Verify
      expect(mockRedisStore.createSessionIfNotExists).toHaveBeenCalledWith(
        service.getServiceId(),
        expect.obje
  - Context: });

      // Execute
      await service.initializeState();

      // Verify
      expect(mockRedisStore.createSessionIfNotExists).toHaveBeenCalledWith(
        service.getServiceId(),
        expect.obje
  - Type: marketplace
- Get the mock Redis store from the service
      const serviceMockRedisStore = vi.mocked(
        (testService as any).sessio
  - Context: 
        serviceId: testServiceId,
        tools: mockTools,
      });

      // Get the mock Redis store from the service
      const serviceMockRedisStore = vi.mocked(
        (testService as any).sessio
  - Type: marketplace
- Get the mock Redis store from the service
      const serviceMockRedisStore = vi.mocked(
        (testService as any).sessionStore
      );
      serviceMockRedisStore.acquire
  - Context: ockTools,
      });

      // Get the mock Redis store from the service
      const serviceMockRedisStore = vi.mocked(
        (testService as any).sessionStore
      );
      serviceMockRedisStore.acquire
  - Type: marketplace
- the service const serviceMockRedisStore = vi.mocked( (testService as any).sessionStore );
  - Context: from the service
      const serviceMockRedisStore = vi.mocked(
        (testService as any).sessionStore
      );
      serviceMockRedisStore.acquireLock.mockResolvedValue("mock-lock-token");
      servic
  - Type: marketplace
- ockRedisStore = vi.mocked( (testService as any).sessionStore ); serviceMockRedisStore.acquireLock.mockResolvedValue("mock-lock-token"); serviceMockRedisStore.createSessionIfNotExi
  - Context: ockRedisStore = vi.mocked(
        (testService as any).sessionStore
      );
      serviceMockRedisStore.acquireLock.mockResolvedValue("mock-lock-token");
      serviceMockRedisStore.createSessionIfNotExi
  - Type: marketplace
- serviceMockRedisStore.acquireLock.mockResolvedValue("mock-lock-token"); serviceMockRedisStore.createSessionIfNotExists.mockResolvedValue({ state: { value: "idle" }, context: { s
  - Context:       serviceMockRedisStore.acquireLock.mockResolvedValue("mock-lock-token");
      serviceMockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "idle" },
        context: { s
  - Type: marketplace
- Initialize and reset mock calls
      await testService.initializeState();
      serviceMockRedisStore.setSession.mockClear();

      // Execute - use proper Tool object
      await testService.selectTo
  - Context: // Initialize and reset mock calls
      await testService.initializeState();
      serviceMockRedisStore.setSession.mockClear();

      // Execute - use proper Tool object
      await testService.selectTo
  - Type: marketplace
- Verify
      expect(serviceMockRedisStore.setSession).toHaveBeenCalledWith(
        testServiceId,
        expect.objectContaining({
  - Context:  object
      await testService.selectTool(testTool);

      // Verify
      expect(serviceMockRedisStore.setSession).toHaveBeenCalledWith(
        testServiceId,
        expect.objectContaining({
        
  - Type: marketplace
- Setup - Simulate existing session in Redis
      mockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "tool_selected" },
        con
  - Context: is on initialize", async () => {
      // Setup - Simulate existing session in Redis
      mockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "tool_selected" },
        con
  - Type: marketplace
- Execute
      await service.initializeS
  - Context: toolName: "existingTool",
          parameters: { foo: "bar" },
        },
      });
      mockRedisStore.acquireLock.mockResolvedValue("mock-lock-token");

      // Execute
      await service.initializeS
  - Type: marketplace
- localhost:6379",
        tools: mockTools,
      });

      // Get the mock store from the service
      const store = (service as any).sessionStore as Mocked<RedisSessionStore>;
  - Context:      redisUrl: "redis://localhost:6379",
        tools: mockTools,
      });

      // Get the mock store from the service
      const store = (service as any).sessionStore as Mocked<RedisSessionStore>;

 
  - Type: marketplace
- Get the mock store from the service
      const store = (service as any).sessionStore as Mocked<RedisSessionStore>;

      // Mock store methods
      st
  - Context: 379",
        tools: mockTools,
      });

      // Get the mock store from the service
      const store = (service as any).sessionStore as Mocked<RedisSessionStore>;

      // Mock store methods
      st
  - Type: marketplace
- Get the mock store from the service
      const store = (service as any).sessionStore as Mocked<RedisSessionStore>;

      // Mock store methods
      store.acquireLock = vi.fn().mockRe
  - Context:       });

      // Get the mock store from the service
      const store = (service as any).sessionStore as Mocked<RedisSessionStore>;

      // Mock store methods
      store.acquireLock = vi.fn().mockRe
  - Type: marketplace
- Mock store methods
      store.acquireLock = vi.fn().mockResolvedValue("mock-lock");
  - Context: mock store from the service
      const store = (service as any).sessionStore as Mocked<RedisSessionStore>;

      // Mock store methods
      store.acquireLock = vi.fn().mockResolvedValue("mock-lock");
  
  - Type: marketplace
- Mock store methods
      store.acquireLock = vi.fn().mockResolvedValue("mock-lock");
      store.createSession
  - Context: vice
      const store = (service as any).sessionStore as Mocked<RedisSessionStore>;

      // Mock store methods
      store.acquireLock = vi.fn().mockResolvedValue("mock-lock");
      store.createSession
  - Type: marketplace
- Mock store methods
      store.acquireLock = vi.fn().mockResolvedValue("mock-lock");
      store.createSessionIfNotExists = vi.fn(
  - Context: re = (service as any).sessionStore as Mocked<RedisSessionStore>;

      // Mock store methods
      store.acquireLock = vi.fn().mockResolvedValue("mock-lock");
      store.createSessionIfNotExists = vi.fn(
  - Type: marketplace
- Mock store methods
      store.acquireLock = vi.fn().mockResolvedValue("mock-lock");
      store.createSessionIfNotExists = vi.fn().mockResolvedValue({
        state: { value: "idle" },
        co
  - Context:       // Mock store methods
      store.acquireLock = vi.fn().mockResolvedValue("mock-lock");
      store.createSessionIfNotExists = vi.fn().mockResolvedValue({
        state: { value: "idle" },
        co
  - Type: marketplace
- "idle" }, context: { sessionId: serviceId }, }); store.setSession =
  - Context: alue({
        state: { value: "idle" },
        context: { sessionId: serviceId },
      });
      store.setSession = vi.fn().mockResolvedValue(undefined);
      store.releaseLock = vi.fn().mockResolvedVa
  - Type: marketplace
- Initialize state first
      await se
  - Context: sionId: serviceId },
      });
      store.setSession = vi.fn().mockResolvedValue(undefined);
      store.releaseLock = vi.fn().mockResolvedValue(undefined);

      // Initialize state first
      await se
  - Type: marketplace
- Verify Redis was updated with correct parameters
      expect(store.setSession).toHaveBeenCalledWith(
        serviceId,
        expect.objectContaining({
          co
  - Context: .setParameters(parameters);

      // Verify Redis was updated with correct parameters
      expect(store.setSession).toHaveBeenCalledWith(
        serviceId,
        expect.objectContaining({
          co
  - Type: marketplace
- Setup
      mockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "tool_selected" },
        con
  - Context:   test("should execute tool and update state in Redis", async () => {
      // Setup
      mockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "tool_selected" },
        con
  - Type: marketplace
- "testTool", parameters: { foo: "bar" }, }, }); mockRedisStore.acquireLock.mockResolvedValue("mock-lock-token"); await
  - Context:     toolName: "testTool",
          parameters: { foo: "bar" },
        },
      });
      mockRedisStore.acquireLock.mockResolvedValue("mock-lock-token");

      await service.initializeState();

      //
  - Type: marketplace
- Execute
      await service.reset();

      // Verify
      expect(mockRedisStore.clearSession).toHaveBeenCalledWith(
        service.getServiceId()
      );
    });

    test("shou
  - Context:  async () => {
      // Execute
      await service.reset();

      // Verify
      expect(mockRedisStore.clearSession).toHaveBeenCalledWith(
        service.getServiceId()
      );
    });

    test("shou
  - Type: marketplace
- Execute
      await service.dispose();

      // Verify
      expect(mockRedisStore.disconnect).toHaveBeenCalled();
    });
  });

  describe("Concurrency Handling", () => {
    test(
  - Context: sync () => {
      // Execute
      await service.dispose();

      // Verify
      expect(mockRedisStore.disconnect).toHaveBeenCalled();
    });
  });

  describe("Concurrency Handling", () => {
    test(
  - Type: marketplace
- Setup
      const toolDefinition = createMockTool("testTool");
      mockRedisStore.acquireLock.mockResolvedValue("lock-token-123");

      // Execute
      await service.selectTool(t
  - Context: sync () => {
      // Setup
      const toolDefinition = createMockTool("testTool");
      mockRedisStore.acquireLock.mockResolvedValue("lock-token-123");

      // Execute
      await service.selectTool(t
  - Type: marketplace
- Execute
      await service.selectTool(toolDefinition);

      // Verify
      expect(mockRedisStore.acquireLock).toHaveBeenCalledWith(
        service.getServiceId()
      );
      expect(mockRedisSt
  - Context:   // Execute
      await service.selectTool(toolDefinition);

      // Verify
      expect(mockRedisStore.acquireLock).toHaveBeenCalledWith(
        service.getServiceId()
      );
      expect(mockRedisSt
  - Type: marketplace
- service.getServiceId() ); expect(mockRedisStore.releaseLock).toHaveBeenCalled(); }); test("should throw error if lock cannot
  - Context: re.acquireLock).toHaveBeenCalledWith(
        service.getServiceId()
      );
      expect(mockRedisStore.releaseLock).toHaveBeenCalled();
    });

    test("should throw error if lock cannot be acquired",
  - Type: marketplace
- Setup
      const toolDefinition = createMockTool("testTool");
      mockRedisStore.acquireLock.mockResolvedValue(null); // Lock not acquired

      // Execute & Verify
      await ex
  - Context: sync () => {
      // Setup
      const toolDefinition = createMockTool("testTool");
      mockRedisStore.acquireLock.mockResolvedValue(null); // Lock not acquired

      // Execute & Verify
      await ex
  - Type: marketplace
- Execute
      await service.selectTool(toolDefinition);

      // Verify
      expect(mockRedisStore.extendSessionTtl).toHaveBeenCalledWith(
        service.getServiceId(),
        expect.any(Number)
  - Context:   // Execute
      await service.selectTool(toolDefinition);

      // Verify
      expect(mockRedisStore.extendSessionTtl).toHaveBeenCalledWith(
        service.getServiceId(),
        expect.any(Number)

  - Type: marketplace
- Arrange
      mockRedisStore.createSessionIfNotExists.mockRejectedValue(
        new Error("Redis error")
      );

      // Exe
  - Context:  {
    test("should handle Redis operation failures", async () => {
      // Arrange
      mockRedisStore.createSessionIfNotExists.mockRejectedValue(
        new Error("Redis error")
      );

      // Exe
  - Type: marketplace
- Get the mock store directly
      const mockStore = vi.mocked((errorService as any).sessionStore);

      // Setup the
  - Context: ost:6379",
        serviceId: sessionId,
        tools: mockTools,
      });

      // Get the mock store directly
      const mockStore = vi.mocked((errorService as any).sessionStore);

      // Setup the
  - Type: marketplace
- Get the mock store directly
      const mockStore = vi.mocked((errorService as any).sessionStore);

      // Setup the necessary mock methods
      m
  - Context: essionId,
        tools: mockTools,
      });

      // Get the mock store directly
      const mockStore = vi.mocked((errorService as any).sessionStore);

      // Setup the necessary mock methods
      m
  - Type: marketplace
- Get the mock store directly
      const mockStore = vi.mocked((errorService as any).sessionStore);

      // Setup the necessary mock methods
      mockStore.acquireLock.mockResolvedValue("mock-lo
  - Context:       // Get the mock store directly
      const mockStore = vi.mocked((errorService as any).sessionStore);

      // Setup the necessary mock methods
      mockStore.acquireLock.mockResolvedValue("mock-lo
  - Type: marketplace
- Setup the necessary mock methods
      mockStore.acquireLock.mockResolvedValue("mock-lock-token");
      mockStore.createSessionIfNotExists.mockReso
  - Context: vi.mocked((errorService as any).sessionStore);

      // Setup the necessary mock methods
      mockStore.acquireLock.mockResolvedValue("mock-lock-token");
      mockStore.createSessionIfNotExists.mockReso
  - Type: marketplace
- mock methods mockStore.acquireLock.mockResolvedValue("mock-lock-token"); mockStore.createSessionIfNotExists.mockResolvedValue({ state: { value: "idle" }, context:
  - Context:  necessary mock methods
      mockStore.acquireLock.mockResolvedValue("mock-lock-token");
      mockStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "idle" },
        context: { s
  - Type: marketplace
- state: { value: "idle" }, context: { sessionId }, });
  - Context: solvedValue({
        state: { value: "idle" },
        context: { sessionId },
      });
      mockStore.setSession.mockResolvedValue(undefined);
      mockStore.releaseLock.mockResolvedValue(undefined);

  - Type: marketplace
- ontext: { sessionId }, }); mockStore.setSession.mockResolvedValue(undefined); mockStore.releaseLock.mockResolvedValue(undefined); mockStore.extendSessionTtl.mockResolvedValue(undefi
  - Context: ontext: { sessionId },
      });
      mockStore.setSession.mockResolvedValue(undefined);
      mockStore.releaseLock.mockResolvedValue(undefined);
      mockStore.extendSessionTtl.mockResolvedValue(undefi
  - Type: marketplace
- Initialize the service
      await errorSe
  - Context: n.mockResolvedValue(undefined);
      mockStore.releaseLock.mockResolvedValue(undefined);
      mockStore.extendSessionTtl.mockResolvedValue(undefined);

      // Initialize the service
      await errorSe
  - Type: marketplace
- what was passed let capturedSession: any = null; mockStore.setSession.mockImplementation((id: string,
  - Context: on for setSession that will record what was passed
      let capturedSession: any = null;
      mockStore.setSession.mockImplementation((id: string, session: any) => {
        capturedSession = session;
  
  - Type: marketplace
- Verify that setSession was called with an error in the context
      expect(mockStore.setSession).toHaveBeenCalledWith(
        sessionId,
        expect.objectContaining({
          co
  - Context:       });

      // Verify that setSession was called with an error in the context
      expect(mockStore.setSession).toHaveBeenCalledWith(
        sessionId,
        expect.objectContaining({
          co
  - Type: marketplace
- Clean up
      await testService.dispose();
    });

    test("should load state from Redis on initialize", async () => {
      // Setup - Simulate existing session in Redis
  - Context:       })
      );

      // Clean up
      await testService.dispose();
    });

    test("should load state from Redis on initialize", async () => {
      // Setup - Simulate existing session in Redis

  - Type: ads
- Execute
      await service.initializeState();

      // Verify state is loaded
      expect(service.getContext().toolName).toBe("existingTool");
      expect(service.getContext
  - Context: -lock-token");

      // Execute
      await service.initializeState();

      // Verify state is loaded
      expect(service.getContext().toolName).toBe("existingTool");
      expect(service.getContext
  - Type: ads
- Mock the execute method to directly call the error handling logic
  - Context:        message: "Test execution error",
        data: { error: "Test execution error" },
        metadata: {},
      };

      // Mock the execute method to directly call the error handling logic
      
  - Type: ads
- localhost:6379',
    verbose: true
  });
  
  // Test basic session operations
  console.log('\nTesting basic session operations...');
  
  const sessionId = '
  - Context: t createSessionStore({
    redisUrl: 'redis://localhost:6379',
    verbose: true
  });
  
  // Test basic session operations
  console.log('\nTesting basic session operations...');
  
  const sessionId = '
  - Type: freemium
- Test basic session operations
  console.log('\nTesting basic session operations...');
  
  const sessionId = 'test-session-' + Date.now();
  
  // Create sessio
  - Context: lhost:6379',
    verbose: true
  });
  
  // Test basic session operations
  console.log('\nTesting basic session operations...');
  
  const sessionId = 'test-session-' + Date.now();
  
  // Create sessio
  - Type: freemium
- Run the test
testSessionStore().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
  - Context: ly!');
}

// Run the test
testSessionStore().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
}); 
  - Type: freemium
- sessions and persist data * * Usage: node src/tests/test-session-store.js */
  - Context: dis is unavailable
 * 3. Create sessions and persist data
 * 
 * Usage: node src/tests/test-session-store.js
 */

import { createSessionStore, isRedisAvailable } from '../state/services/sessionStoreFactory
  - Type: marketplace
- * Usage: node src/tests/test-session-store.js */ import { createSessionStore, isRedisAvailable }
  - Context: ions and persist data
 * 
 * Usage: node src/tests/test-session-store.js
 */

import { createSessionStore, isRedisAvailable } from '../state/services/sessionStoreFactory.js';

async function testSessionSto
  - Type: marketplace
- async function testSessionStore() { console.log('Session Store Factory Test\n');
  - Context: ession-store.js
 */

import { createSessionStore, isRedisAvailable } from '../state/services/sessionStoreFactory.js';

async function testSessionStore() {
  console.log('Session Store Factory Test\n');
  

  - Type: marketplace
- Check if Redis is available
  console.lo
  - Context: ore, isRedisAvailable } from '../state/services/sessionStoreFactory.js';

async function testSessionStore() {
  console.log('Session Store Factory Test\n');
  
  // Check if Redis is available
  console.lo
  - Type: marketplace
- Check if Redis is available
  console.log('Testing Redis availability...'
  - Context: state/services/sessionStoreFactory.js';

async function testSessionStore() {
  console.log('Session Store Factory Test\n');
  
  // Check if Redis is available
  console.log('Testing Redis availability...'
  - Type: marketplace
- Create session store with automatic detection
  console.log('\nCreating session store with automatic detection...');
  c
  - Context: :6379');
  console.log(`Redis available: ${redisAvailable ? 'YES' : 'NO'}`);
  
  // Create session store with automatic detection
  console.log('\nCreating session store with automatic detection...');
  c
  - Type: marketplace
- Create session store with automatic detection
  console.log('\nCreating session store with automatic detection...');
  const sessionStore = await createSessionStore({
    redisUrl: 'red
  - Context:  : 'NO'}`);
  
  // Create session store with automatic detection
  console.log('\nCreating session store with automatic detection...');
  const sessionStore = await createSessionStore({
    redisUrl: 'red
  - Type: marketplace
- localhost:6379',
    verbose: true
  });
  
  /
  - Context: tic detection
  console.log('\nCreating session store with automatic detection...');
  const sessionStore = await createSessionStore({
    redisUrl: 'redis://localhost:6379',
    verbose: true
  });
  
  /
  - Type: marketplace
- localhost:6379',
    verbose: true
  });
  
  // Test basic session operat
  - Context: ('\nCreating session store with automatic detection...');
  const sessionStore = await createSessionStore({
    redisUrl: 'redis://localhost:6379',
    verbose: true
  });
  
  // Test basic session operat
  - Type: marketplace
- Retrieve session
  console.log(`Retrieving session ${sessi
  - Context: estRun: true, created: Date.now() },
    timestamp: new Date().toISOString()
  };
  
  await sessionStore.setSession(sessionId, testData);
  
  // Retrieve session
  console.log(`Retrieving session ${sessi
  - Type: marketplace
- Update session
  console.lo
  - Context: etrieve session
  console.log(`Retrieving session ${sessionId}...`);
  const session = await sessionStore.getSession(sessionId);
  console.log('Session data:', session);
  
  // Update session
  console.lo
  - Type: marketplace
- Retrieve updated session
  console.log(`Retrieving
  - Context: .state?.count) || 0) + 1
      },
      timestamp: new Date().toISOString()
    };
    await sessionStore.setSession(sessionId, updatedData);
  }
  
  // Retrieve updated session
  console.log(`Retrieving 
  - Type: marketplace
- List all ses
  - Context: 
  console.log(`Retrieving updated session ${sessionId}...`);
  const updatedSession = await sessionStore.getSession(sessionId);
  console.log('Updated session data:', updatedSession);
  
  // List all ses
  - Type: marketplace
- List all sessions
  console.log('\nListing all sessions...');
  const sessions = await sessionStore.getSessions();
  console.log(`Found ${sessions.length} sessions:`, sessions);
  
  // Clean up
  co
  - Context: 
  // List all sessions
  console.log('\nListing all sessions...');
  const sessions = await sessionStore.getSessions();
  console.log(`Found ${sessions.length} sessions:`, sessions);
  
  // Clean up
  co
  - Type: marketplace
- Clean up
  console.log(`\nCleaning up session ${sessionId}...`);
  await sessionStore.clearSession(sessionId);
  
  // Verify cleanup
  console.log(`Verifying session ${sessionId} was c
  - Context:  sessions);
  
  // Clean up
  console.log(`\nCleaning up session ${sessionId}...`);
  await sessionStore.clearSession(sessionId);
  
  // Verify cleanup
  console.log(`Verifying session ${sessionId} was c
  - Type: marketplace
- was cleared...`); const clearedSession = await sessionStore.getSession(sessionId); console.log('Session after clearing:',
  - Context: console.log(`Verifying session ${sessionId} was cleared...`);
  const clearedSession = await sessionStore.getSession(sessionId);
  console.log('Session after clearing:', clearedSession);
  
  // Disconnect
  - Type: marketplace
- Disconnect
  console.log('\nDisconnecting from session store...');
  await sessionStore.disconnect();
  
  console.log('\nTest completed successfully!');
}

//
  - Context: n after clearing:', clearedSession);
  
  // Disconnect
  console.log('\nDisconnecting from session store...');
  await sessionStore.disconnect();
  
  console.log('\nTest completed successfully!');
}

// 
  - Type: marketplace
- Disconnect
  console.log('\nDisconnecting from session store...');
  await sessionStore.disconnect();
  
  console.log('\nTest completed successfully!');
}

// Run the test
testSessionSto
  - Context: Session);
  
  // Disconnect
  console.log('\nDisconnecting from session store...');
  await sessionStore.disconnect();
  
  console.log('\nTest completed successfully!');
}

// Run the test
testSessionSto
  - Type: marketplace
- Run the test
testSessionStore().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
  - Context: ore.disconnect();
  
  console.log('\nTest completed successfully!');
}

// Run the test
testSessionStore().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
}); 
  - Type: marketplace
- List all sessions
  console.log('\nListing all sessions...');
  const sessions = await sessionStore.getSessions();
  console.log(`Found ${sess
  - Context: 
  console.log('Updated session data:', updatedSession);
  
  // List all sessions
  console.log('\nListing all sessions...');
  const sessions = await sessionStore.getSessions();
  console.log(`Found ${sess
  - Type: marketplace
- session with a provided ID', () => { const sessionId
  - Context: (sessionIds).toContain(session.getSessionId());
    });

    it('should create a new session with a provided ID', () => {
      const sessionId = 'test-session-id';
      const session = createToolExecut
  - Type: freemium
- executing to cancelled when CANCEL event is sent', () =>
  - Context: ctor.getSnapshot().context.error).toBe(error);
    });

    it('should transition from executing to cancelled when CANCEL event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool'
  - Type: subscription
- from executing to cancelled when CANCEL event is sent', ()
  - Context: t().context.error).toBe(error);
    });

    it('should transition from executing to cancelled when CANCEL event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      acto
  - Type: subscription
- } }); actor.send({ type: 'EXECUTE' }); actor.send({ type: 'CANCEL' });
  - Context: rameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });
      actor.send({ type: 'CANCEL' });
      
      expect(actor.getSnapshot().value).toBe('cancelled');
    });

    it('should rese
  - Type: subscription
- }); expect(actor.getSnapshot().value).toBe('cancelled'); }); it('should reset state when RESET event is
  - Context: UTE' });
      actor.send({ type: 'CANCEL' });
      
      expect(actor.getSnapshot().value).toBe('cancelled');
    });

    it('should reset state when RESET event is sent', () => {
      actor.send({ typ
  - Type: subscription
- const result = { data: 'testResult', metadata: { executionTime: 100
  - Context: ' } });
      actor.send({ type: 'EXECUTE' });
      
      const result = { data: 'testResult', metadata: { executionTime: 100 } };
      actor.send({ type: 'RECEIVED_RESULT', result });
      
      c
  - Type: ads
- to history when a result is received', () => {
  - Context: expect(context.error).toBe(error);
      expect(context.result).toBeNull();
    });

    it('should add to history when a result is received', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: '
  - Type: ads
- Test empty file analys
  - Context: import { describe, it, expect } from "vitest";
import { analyzeCode, getMetrics } from "../features/basic-analysis/analyzer";

describe("Complexity Analyzer Edge Cases", () => {
  // Test empty file analys
  - Type: freemium
- Test property-based assertions
  it("should maintain property-based invariants", async () => {
    const cod
  - Context: 0 conditions + 1 base
    expect(result.complexity.cognitive).toBeGreaterThan(10);
  });

  // Test property-based assertions
  it("should maintain property-based invariants", async () => {
    const cod
  - Type: freemium
- Test property-based assertions
  it("should maintain property-based invariants", async () => {
    const code = `
      function testFunction() {
        if
  - Context: ty.cognitive).toBeGreaterThan(10);
  });

  // Test property-based assertions
  it("should maintain property-based invariants", async () => {
    const code = `
      function testFunction() {
        if
  - Type: freemium
- Property 1: Cyclomatic complexity should be non-negative
    expect(result.complexity.cyclomatic).toBeG
  - Context:  result = await getMetrics({
      fileContent: code,
      language: "typescript",
    });

    // Property 1: Cyclomatic complexity should be non-negative
    expect(result.complexity.cyclomatic).toBeG
  - Type: freemium
- Property 2: Cognitive complexity should be >= cyclomatic complexity
    expect(result.complexity.cognit
  - Context:  should be non-negative
    expect(result.complexity.cyclomatic).toBeGreaterThanOrEqual(1);

    // Property 2: Cognitive complexity should be >= cyclomatic complexity
    expect(result.complexity.cognit
  - Type: freemium
- Property 3: Analysis should be idempotent
    const result2 = await getMetrics({
      fileContent: cod
  - Context: ult.complexity.cognitive).toBeGreaterThanOrEqual(
      result.complexity.cyclomatic
    );

    // Property 3: Analysis should be idempotent
    const result2 = await getMetrics({
      fileContent: cod
  - Type: freemium
- tool integration helper, * which provides a way to integrate
  - Context: or Stateful Tool
 * 
 * This file contains tests for the stateful tool integration helper,
 * which provides a way to integrate MCP tools with XState state machines.
 */

import { describe, it, expect, v
  - Type: freemium
- Create a type for our mock server
type MockServe
  - Context: , 
  getSessionIds 
} from '../state/helpers/statefulTool';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";

// Create a type for our mock server
type MockServe
  - Type: freemium
- Extract the handler function from the tool call
      cons
  - Context: n as McpServer, 'testTool', schema, handler);
    });
    
    it('should call the handler with the provided parameters', async () => {
      // Extract the handler function from the tool call
      cons
  - Type: freemium
- Verify the response format
      expect(response).toHaveProperty('content');
      expect(response.content).toBeInstanceOf(Array);
      expect(response.conten
  - Context: ssionId: 'test-session' });
      
      // Verify the response format
      expect(response).toHaveProperty('content');
      expect(response.content).toBeInstanceOf(Array);
      expect(response.conten
  - Type: freemium
- nt'); expect(response.content).toBeInstanceOf(Array); expect(response.content[0]).toHaveProperty('type', 'text'); expect(response.content[0]).toHaveProperty('text'); // The
  - Context: nt');
      expect(response.content).toBeInstanceOf(Array);
      expect(response.content[0]).toHaveProperty('type', 'text');
      expect(response.content[0]).toHaveProperty('text');
      
      // The
  - Type: freemium
- The text should be a JSON string with our result
      const parsedRe
  - Context: expect(response.content[0]).toHaveProperty('type', 'text');
      expect(response.content[0]).toHaveProperty('text');
      
      // The text should be a JSON string with our result
      const parsedRe
  - Type: freemium
- t const parsedResult = JSON.parse(response.content[0].text); expect(parsedResult).toHaveProperty('data'); expect(parsedResult).toHaveProperty('status'); expect(parsedResult).toHav
  - Context: t
      const parsedResult = JSON.parse(response.content[0].text);
      expect(parsedResult).toHaveProperty('data');
      expect(parsedResult).toHaveProperty('status');
      expect(parsedResult).toHav
  - Type: freemium
- ntent[0].text); expect(parsedResult).toHaveProperty('data'); expect(parsedResult).toHaveProperty('status'); expect(parsedResult).toHaveProperty('metadata'); expect(parsedResult).t
  - Context: ntent[0].text);
      expect(parsedResult).toHaveProperty('data');
      expect(parsedResult).toHaveProperty('status');
      expect(parsedResult).toHaveProperty('metadata');
      expect(parsedResult).t
  - Type: freemium
- erty('data'); expect(parsedResult).toHaveProperty('status'); expect(parsedResult).toHaveProperty('metadata'); expect(parsedResult).toHaveProperty('context'); expect(parsedResult.c
  - Context: erty('data');
      expect(parsedResult).toHaveProperty('status');
      expect(parsedResult).toHaveProperty('metadata');
      expect(parsedResult).toHaveProperty('context');
      expect(parsedResult.c
  - Type: freemium
- ('status'); expect(parsedResult).toHaveProperty('metadata'); expect(parsedResult).toHaveProperty('context'); expect(parsedResult.context).toHaveProperty('sessionId'); }); it('s
  - Context: ('status');
      expect(parsedResult).toHaveProperty('metadata');
      expect(parsedResult).toHaveProperty('context');
      expect(parsedResult.context).toHaveProperty('sessionId');
    });

    it('s
  - Type: freemium
- expect(parsedResult.context).toHaveProperty('sessionId'); }); it('should handle errors and return error responses', async
  - Context: a');
      expect(parsedResult).toHaveProperty('context');
      expect(parsedResult.context).toHaveProperty('sessionId');
    });

    it('should handle errors and return error responses', async () => {
  - Type: freemium
- Verify the error response format
      expect(response).toHaveProperty('content');
      expect(response.content).toBeInstanceOf(Array);
      expect(response.conten
  - Context: d: 'test-session' });
      
      // Verify the error response format
      expect(response).toHaveProperty('content');
      expect(response.content).toBeInstanceOf(Array);
      expect(response.conten
  - Type: freemium
- nt'); expect(response.content).toBeInstanceOf(Array); expect(response.content[0]).toHaveProperty('type', 'text'); expect(response.content[0]).toHaveProperty('text', 'Test error');
  - Context: nt');
      expect(response.content).toBeInstanceOf(Array);
      expect(response.content[0]).toHaveProperty('type', 'text');
      expect(response.content[0]).toHaveProperty('text', 'Test error');
     
  - Type: freemium
- expect(response.content[0]).toHaveProperty('type', 'text'); expect(response.content[0]).toHaveProperty('text', 'Test error'); expect(response).toHaveProperty('isError', true); }); });
  - Context: expect(response.content[0]).toHaveProperty('type', 'text');
      expect(response.content[0]).toHaveProperty('text', 'Test error');
      expect(response).toHaveProperty('isError', true);
    });
  });


  - Type: freemium
- Schema to be
  - Context:      expect(response.content[0]).toHaveProperty('text', 'Test error');
      expect(response).toHaveProperty('isError', true);
    });
  });

  describe('Session Management', () => {
    // Schema to be 
  - Type: freemium
- Extract the handler function from the tool call
      const toolHandl
  - Context: 'testTool', schema, handler);
    });
    
    it('should create a new session when no sessionId is provided', async () => {
      // Extract the handler function from the tool call
      const toolHandl
  - Type: freemium
- Verify a session ID was created
      expect(parsedResult.context).toHaveProperty('sessionId');
      expect(parsedResult.context.sessionId).toBeDefined();
    });

    it('sho
  - Context: [0].text);
      
      // Verify a session ID was created
      expect(parsedResult.context).toHaveProperty('sessionId');
      expect(parsedResult.context.sessionId).toBeDefined();
    });

    it('sho
  - Type: freemium
- a session ID if none is provided', () => {
  - Context: t(session.getSessionId()).toBe(sessionId);
    });

    it('should generate a session ID if none is provided', () => {
      const session = getSession();
      
      expect(session).toBeDefined();
    
  - Type: freemium
- it('should add sessionId parameter to the schema', () => {
  - Context: ionId: expect.any(Object)
        }),
        expect.any(Function)
      );
    });

    it('should add sessionId parameter to the schema', () => {
      const schema = {
        param1: z.string()
    
  - Type: ads
- expect(parsedResult).toHaveProperty('status'); expect(parsedResult).toHaveProperty('metadata'); expect(parsedResult).toHaveProperty('context'); expect(parsedResult.context).toHa
  - Context: 
      expect(parsedResult).toHaveProperty('status');
      expect(parsedResult).toHaveProperty('metadata');
      expect(parsedResult).toHaveProperty('context');
      expect(parsedResult.context).toHa
  - Type: ads
- Force reading the latest state
      const context = session.getContext();
      expect(context.toolName).toBe
  - Context: it affects the original session
      sameSession.selectTool('secondTool');
      
      // Force reading the latest state
      const context = session.getContext();
      expect(context.toolName).toBe
  - Type: ads
- when provided', () => { const data = { test:
  - Context:     expect(validation.success).toBe(true);
    });
    
    it('should include session context when provided', () => {
      const data = { test: 'data' };
      const sessionId = 'test-session';
      c
  - Type: freemium
- code when provided', () => { const message = 'Test
  - Context:   expect(validation.success).toBe(true);
    });
    
    it('should include custom error code when provided', () => {
      const message = 'Test error message';
      const response = createErrorRespon
  - Type: freemium
- provided', () => { const message = 'Test error message';
  - Context:     
      expect(response.status.code).toEqual(404);
    });
    
    it('should include data when provided', () => {
      const message = 'Test error message';
      const data = { additionalInfo: 'er
  - Type: freemium
- function when provided', () => { const response1 = createSuccessResponse({
  - Context: ta.executionTime).toBeLessThanOrEqual(251);
    });
    
    it('should use transform function when provided', () => {
      const response1 = createSuccessResponse({ value: 10 }, 'tool-1');
      const 
  - Type: freemium
- (data: any[]) => ({ sum: data.reduce((acc, item) => acc +
  - Context: { value: 20 }, 'tool-2');
      
      const transform = (data: any[]) => ({ sum: data.reduce((acc, item) => acc + item.value, 0) });
      const combined = combineResponses([response1, response2], 'combi
  - Type: marketplace
- ({ sum: data.reduce((acc, item) => acc + item.value, 0) });
  - Context: 'tool-2');
      
      const transform = (data: any[]) => ({ sum: data.reduce((acc, item) => acc + item.value, 0) });
      const combined = combineResponses([response1, response2], 'combined-tool', { tr
  - Type: marketplace
- onse(data, 'test-tool'); expect(response.data).toEqual(data); expect(response.metadata.tool).toEqual('test-tool'); expect(response.status.success).toBe(true); expect(respo
  - Context: onse(data, 'test-tool');
      
      expect(response.data).toEqual(data);
      expect(response.metadata.tool).toEqual('test-tool');
      expect(response.status.success).toBe(true);
      expect(respo
  - Type: ads
- 'test-tool', { executionTime: 100 }); expect(response.metadata.executionTime).toEqual(100); }); }); describe('createErrorResponse', ()
  - Context: = createSuccessResponse(data, 'test-tool', { executionTime: 100 });
      
      expect(response.metadata.executionTime).toEqual(100);
    });
  });
  
  describe('createErrorResponse', () => {
    it('
  - Type: ads
- onse(message, 'test-tool'); expect(response.data).toBeNull(); expect(response.metadata.tool).toEqual('test-tool'); expect(response.status.success).toBe(false); expect(resp
  - Context: onse(message, 'test-tool');
      
      expect(response.data).toBeNull();
      expect(response.metadata.tool).toEqual('test-tool');
      expect(response.status.success).toBe(false);
      expect(resp
  - Type: ads
- message = 'Test error message'; const data = { additionalInfo:
  - Context: clude data when provided', () => {
      const message = 'Test error message';
      const data = { additionalInfo: 'error details' };
      const response = createErrorResponse(message, 'test-tool', { 
  - Type: ads
- result: 'success' }); expect(response.status.success).toBe(true); expect(response.metadata.executionTime).toBeGreaterThanOrEqual(0); }); it('should handle errors and
  - Context: ({ result: 'success' });
      expect(response.status.success).toBe(true);
      expect(response.metadata.executionTime).toBeGreaterThanOrEqual(0);
    });
    
    it('should handle errors and return e
  - Type: ads
- .toBe(false); expect(response.status.message).toEqual('Test error'); expect(response.metadata.executionTime).toBeGreaterThanOrEqual(0); }); }); describe('validateResponse', () =>
  - Context: .toBe(false);
      expect(response.status.message).toEqual('Test error');
      expect(response.metadata.executionTime).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('validateResponse', () => 
  - Type: ads
- Allow for small variations in execution time calculation
      expect(combined.metadata.executionTime).toBeGreaterThanOrEqual(249);
      expect(combined.metadata.executionTime).toBeLe
  - Context: true });
      // Allow for small variations in execution time calculation
      expect(combined.metadata.executionTime).toBeGreaterThanOrEqual(249);
      expect(combined.metadata.executionTime).toBeLe
  - Type: ads
- expect(combined.metadata.executionTime).toBeGreaterThanOrEqual(249); expect(combined.metadata.executionTime).toBeLessThanOrEqual(251); }); it('should use transform function when
  - Context:       expect(combined.metadata.executionTime).toBeGreaterThanOrEqual(249);
      expect(combined.metadata.executionTime).toBeLessThanOrEqual(251);
    });
    
    it('should use transform function when
  - Type: ads
- executeWithTiming, validateResponse, extractResponseData, combineResponses } from '../utils/responses'; import { ToolResponseSchema
  - Context:  
  createSuccessResponse, 
  createErrorResponse, 
  executeWithTiming,
  validateResponse,
  extractResponseData,
  combineResponses
} from '../utils/responses';

import { ToolResponseSchema } from '..
  - Type: ads
- () => { it('should extract only the data portion', ()
  - Context: 
      expect(() => validateResponse(invalidResponse)).toThrow();
    });
  });
  
  describe('extractResponseData', () => {
    it('should extract only the data portion', () => {
      const data = { ke
  - Type: ads
- const response = createSuccessResponse(data, 'test-tool'); expect(extractResponseData(response)).toEqual(data); }); }); describe('combineResponses', ()
  - Context: value' };
      const response = createSuccessResponse(data, 'test-tool');
      
      expect(extractResponseData(response)).toEqual(data);
    });
  });
  
  describe('combineResponses', () => {
    it
  - Type: ads
- Create program
const program = new Command()
  .name('codeanalysis')
  .description('Advanced code analysis to
  - Context: ileSync(packagePath, 'utf8'));
} catch (error) {
  packageJson = { version: '1.0.0' };
}

// Create program
const program = new Command()
  .name('codeanalysis')
  .description('Advanced code analysis to
  - Type: freemium
- Create program
const program = new Command()
  .name('codeanalysis')
  .description('Advanced code analysis tools powered by
  - Context: ePath, 'utf8'));
} catch (error) {
  packageJson = { version: '1.0.0' };
}

// Create program
const program = new Command()
  .name('codeanalysis')
  .description('Advanced code analysis tools powered by
  - Type: freemium
- Register command groups
registerAnalyzeCommands(program);
registerMetricsCommands(program);
registerDependencyCommands(program);
registerInsightsComman
  - Context: wered by MCP')
  .version(packageJson.version);

// Register command groups
registerAnalyzeCommands(program);
registerMetricsCommands(program);
registerDependencyCommands(program);
registerInsightsComman
  - Type: freemium
- Register command groups
registerAnalyzeCommands(program);
registerMetricsCommands(program);
registerDependencyCommands(program);
registerInsightsCommands(program);
registerVisualization
  - Context: son.version);

// Register command groups
registerAnalyzeCommands(program);
registerMetricsCommands(program);
registerDependencyCommands(program);
registerInsightsCommands(program);
registerVisualization
  - Type: freemium
- oups registerAnalyzeCommands(program); registerMetricsCommands(program); registerDependencyCommands(program); registerInsightsCommands(program); registerVisualizationCommands(program); registerKnowledgeG
  - Context: oups
registerAnalyzeCommands(program);
registerMetricsCommands(program);
registerDependencyCommands(program);
registerInsightsCommands(program);
registerVisualizationCommands(program);
registerKnowledgeG
  - Type: freemium
- m); registerMetricsCommands(program); registerDependencyCommands(program); registerInsightsCommands(program); registerVisualizationCommands(program); registerKnowledgeGraphCommands(program); registerSoci
  - Context: m);
registerMetricsCommands(program);
registerDependencyCommands(program);
registerInsightsCommands(program);
registerVisualizationCommands(program);
registerKnowledgeGraphCommands(program);
registerSoci
  - Type: freemium
- gisterDependencyCommands(program); registerInsightsCommands(program); registerVisualizationCommands(program); registerKnowledgeGraphCommands(program); registerSocioTechnicalCommands(program); registerCon
  - Context: gisterDependencyCommands(program);
registerInsightsCommands(program);
registerVisualizationCommands(program);
registerKnowledgeGraphCommands(program);
registerSocioTechnicalCommands(program);
registerCon
  - Type: freemium
- erInsightsCommands(program); registerVisualizationCommands(program); registerKnowledgeGraphCommands(program); registerSocioTechnicalCommands(program); registerConfigCommands(program); registerWatchComman
  - Context: erInsightsCommands(program);
registerVisualizationCommands(program);
registerKnowledgeGraphCommands(program);
registerSocioTechnicalCommands(program);
registerConfigCommands(program);
registerWatchComman
  - Type: freemium
- alizationCommands(program); registerKnowledgeGraphCommands(program); registerSocioTechnicalCommands(program); registerConfigCommands(program); registerWatchCommands(program); registerIdeCommands(program)
  - Context: alizationCommands(program);
registerKnowledgeGraphCommands(program);
registerSocioTechnicalCommands(program);
registerConfigCommands(program);
registerWatchCommands(program);
registerIdeCommands(program)
  - Type: freemium
- terKnowledgeGraphCommands(program); registerSocioTechnicalCommands(program); registerConfigCommands(program); registerWatchCommands(program); registerIdeCommands(program); registerQualityCommands(program
  - Context: terKnowledgeGraphCommands(program);
registerSocioTechnicalCommands(program);
registerConfigCommands(program);
registerWatchCommands(program);
registerIdeCommands(program);
registerQualityCommands(program
  - Type: freemium
- Load configuration for de
  - Context: m);
registerSocioTechnicalCommands(program);
registerConfigCommands(program);
registerWatchCommands(program);
registerIdeCommands(program);
registerQualityCommands(program);

// Load configuration for de
  - Type: freemium
- Load configuration for defaults
const config = loadConf
  - Context: ands(program);
registerConfigCommands(program);
registerWatchCommands(program);
registerIdeCommands(program);
registerQualityCommands(program);

// Load configuration for defaults
const config = loadConf
  - Type: freemium
- Load configuration for defaults
const config = loadConfig();

// Add global options with
  - Context: nds(program);
registerWatchCommands(program);
registerIdeCommands(program);
registerQualityCommands(program);

// Load configuration for defaults
const config = loadConfig();

// Add global options with 
  - Type: freemium
- Add global options with config defaults
program
  .option('-s, --server-path <path>', 'Path to server executable', config.serverPath || './dist
  - Context: configuration for defaults
const config = loadConfig();

// Add global options with config defaults
program
  .option('-s, --server-path <path>', 'Path to server executable', config.serverPath || './dist
  - Type: freemium
- Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`)
  - Context: tput <format>', 'Output format (json, text)', config.output || 'text');

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`)
  - Type: freemium
- () => { console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`)); console.error(chalk.yellow('See --help for
  - Context: ndle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`));
  console.error(chalk.yellow('See --help for a list of available commands.'
  - Type: freemium
- Parse arguments
program.parse(process.argv);

// If no arguments, show help
if
  - Context: rgs.join(' ')}`));
  console.error(chalk.yellow('See --help for a list of available commands.'));
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// If no arguments, show help
if
  - Type: freemium
- Parse arguments
program.parse(process.argv);

// If no arguments, show help
if (process.argv.length === 2) {
  program.
  - Context: yellow('See --help for a list of available commands.'));
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// If no arguments, show help
if (process.argv.length === 2) {
  program.
  - Type: freemium
- Parse arguments
program.parse(process.argv);

// If no arguments, show help
if (process.argv.length === 2) {
  program.help();
}

exp
  - Context: help for a list of available commands.'));
  process.exit(1);
});

// Parse arguments
program.parse(process.argv);

// If no arguments, show help
if (process.argv.length === 2) {
  program.help();
}

exp
  - Type: freemium
- Parse arguments
program.parse(process.argv);

// If no arguments, show help
if (process.argv.length === 2) {
  program.help();
}

export * from './commands/analyze.js';
  - Context: ss.exit(1);
});

// Parse arguments
program.parse(process.argv);

// If no arguments, show help
if (process.argv.length === 2) {
  program.help();
}

export * from './commands/analyze.js';
  - Type: freemium
- If no arguments, show help
if (process.argv.length === 2) {
  program.help();
}

export * from './commands/analyze.js';
  - Context: ents
program.parse(process.argv);

// If no arguments, show help
if (process.argv.length === 2) {
  program.help();
}

export * from './commands/analyze.js';
  - Type: freemium
- Import utilities
import { loadConfig } from './utils/config.js';

// Get package info
const __filename = fileURLToPath(import.meta
  - Context: ';
import { registerQualityCommands } from './commands/quality.js';

// Import utilities
import { loadConfig } from './utils/config.js';

// Get package info
const __filename = fileURLToPath(import.meta
  - Type: ads
- = JSON.parse(fs.readFileSync(packagePath, 'utf8')); } catch (error) { packageJson = {
  - Context: nst packagePath = path.resolve(__dirname, '../../../package.json');
  packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
} catch (error) {
  packageJson = { version: '1.0.0' };
}

// Create
  - Type: ads
- Create program
const program = new Command()
  .name('codeanalysis')
  .description('Advanced code analysis tools powered by MCP')
  .version(packageJson.version);

// Register command gr
  - Context: .0.0' };
}

// Create program
const program = new Command()
  .name('codeanalysis')
  .description('Advanced code analysis tools powered by MCP')
  .version(packageJson.version);

// Register command gr
  - Type: ads
- Load configuration for defaults
const config = loadConfig();

// Add global options with config defaults
  - Context: gisterWatchCommands(program);
registerIdeCommands(program);
registerQualityCommands(program);

// Load configuration for defaults
const config = loadConfig();

// Add global options with config defaults
  - Type: ads
- Load configuration for defaults
const config = loadConfig();

// Add global options with config defaults
program
  .option('-s, --server-path <path>',
  - Context: ds(program);
registerQualityCommands(program);

// Load configuration for defaults
const config = loadConfig();

// Add global options with config defaults
program
  .option('-s, --server-path <path>', 
  - Type: ads
- Load configuration for defaults
const config = loadConfig();

// Add global options with config defaults
program
  .option('-s, --server-path <path>', 'Path to server
  - Context: isterQualityCommands(program);

// Load configuration for defaults
const config = loadConfig();

// Add global options with config defaults
program
  .option('-s, --server-path <path>', 'Path to server 
  - Type: ads
- } from './commands/dependencies.js'; import { registerInsightsCommands } from './commands/insights.js'; import
  - Context: rics.js';
import { registerDependencyCommands } from './commands/dependencies.js';
import { registerInsightsCommands } from './commands/insights.js';
import { registerVisualizationCommands } from './commands/
  - Type: data
- import { registerInsightsCommands } from './commands/insights.js'; import { registerVisualizationCommands }
  - Context: yCommands } from './commands/dependencies.js';
import { registerInsightsCommands } from './commands/insights.js';
import { registerVisualizationCommands } from './commands/visualization.js';
import { register
  - Type: data
- zeCommands(program); registerMetricsCommands(program); registerDependencyCommands(program); registerInsightsCommands(program); registerVisualizationCommands(program); registerKnowledgeGraphCommands(program);
  - Context: zeCommands(program);
registerMetricsCommands(program);
registerDependencyCommands(program);
registerInsightsCommands(program);
registerVisualizationCommands(program);
registerKnowledgeGraphCommands(program);

  - Type: data
- Display issues list (limited)
        if (qualityReport.issues.length > 0) {
          console.log(chalk.bold('\nIssues:'));
  - Context: halk.bold(entry.file)}: ${entry.total} issues`);
        }
        
        // Display issues list (limited)
        if (qualityReport.issues.length > 0) {
          console.log(chalk.bold('\nIssues:'));
 
  - Type: freemium
- 0) { console.log(chalk.bold('\nIssues:')); const limitedIssues = qualityReport.issues.slice(0, 10); for (const
  - Context: (qualityReport.issues.length > 0) {
          console.log(chalk.bold('\nIssues:'));
          const limitedIssues = qualityReport.issues.slice(0, 10);
          
          for (const issue of limitedIssues
  - Type: freemium
- 10); for (const issue of limitedIssues) { const severityColor =
  - Context:   const limitedIssues = qualityReport.issues.slice(0, 10);
          
          for (const issue of limitedIssues) {
            const severityColor = 
              issue.severity === 'error' ? chalk.red 
  - Type: freemium
- Call the analyze-quality tool with limited scope
        const result = await callTool('analyze-quality', {
          repositoryPath,
  - Context: client = await getClient(serverPath, debug);
        
        // Call the analyze-quality tool with limited scope
        const result = await callTool('analyze-quality', {
          repositoryPath,
      
  - Type: freemium
- warnings: number; info: number }; export function registerQualityCommands(program: Command) {
  - Context: Type = { errors: number; warnings: number; info: number };

export function registerQualityCommands(program: Command) {
  const qualityCommand = program
    .command('quality')
    .description('Analyze 
  - Type: freemium
- registerQualityCommands(program: Command) { const qualityCommand = program .command('quality') .description('Analyze code
  - Context: fo: number };

export function registerQualityCommands(program: Command) {
  const qualityCommand = program
    .command('quality')
    .description('Analyze code quality and best practices');
  
  // Co
  - Type: freemium
- Calculate totals
        const totalIssues = qualityRepo
  - Context:  (!qualityReport) {
          console.error(chalk.red('Failed to parse quality report'));
          process.exit(1);
        }
        
        // Calculate totals
        const totalIssues = qualityRepo
  - Type: freemium
- Quick summary c
  - Context: .error(chalk.red(`${figures.cross} Quality analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Quick summary c
  - Type: freemium
- Display compact summary
        console.log(chalk.bold('
  - Context:  (!qualityReport) {
          console.error(chalk.red('Failed to parse quality report'));
          process.exit(1);
        }
        
        // Display compact summary
        console.log(chalk.bold('
  - Type: freemium
- List quality
  - Context: e.error(chalk.red(`${figures.cross} Quality summary failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  // List quality 
  - Type: freemium
- Display rules
        console.log(chalk.bold('\nAvailabl
  - Context: ay.isArray(rules)) {
          console.error(chalk.red('Failed to parse quality rules'));
          process.exit(1);
        }
        
        // Display rules
        console.log(chalk.bold('\nAvailabl
  - Type: freemium
- quality rules: ${(error as Error).message}`)); process.exit(1); } finally { await
  - Context: alk.red(`${figures.cross} Failed to retrieve quality rules: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  return qualityComm
  - Type: freemium
- && Array.isArray(result.content)) { for (const item of result.content) { if
  - Context: port;
        if (result && result.content && Array.isArray(result.content)) {
          for (const item of result.content) {
            if (item.type === 'text') {
              try {
                qu
  - Type: marketplace
- && Array.isArray(result.content)) { for (const item of result.content) { if
  - Context:  && Array.isArray(result.content)) {
          for (const item of result.content) {
            if (item.type === 'text') {
              try {
                qualityReport = JSON.parse(item.text);
     
  - Type: marketplace
- Not JSON, use as is
  - Context:          if (item.type === 'text') {
              try {
                qualityReport = JSON.parse(item.text);
                break;
              } catch (e) {
                // Not JSON, use as is
  
  - Type: marketplace
- Not JSON, use as is
  - Context: t) {
            if (item.type === 'text') {
              try {
                rules = JSON.parse(item.text);
                break;
              } catch (e) {
                // Not JSON, use as is
  
  - Type: marketplace
- Add this type at the top of the file
type CountsType = { errors: number; warnings: number; info: numbe
  - Context: rt path from 'path';
import { getClient, callTool, closeClient } from '../utils/mcp-client.js';

// Add this type at the top of the file
type CountsType = { errors: number; warnings: number; info: numbe
  - Type: ads
- Display top issues by rule
        console.log(chalk.bold
  - Context: alityReport.issueCount.info)}`);
        console.log(`Files analyzed: ${chalk.bold(qualityReport.metadata.analyzedFiles)}`);
        
        // Display top issues by rule
        console.log(chalk.bold
  - Type: ads
- old('\nCode Quality Summary:')); console.log(`Files analyzed: ${chalk.bold(qualityReport.metadata.analyzedFiles)}`); console.log(`Issues: ${chalk.red(qualityReport.issueCount.errors)} er
  - Context: old('\nCode Quality Summary:'));
        console.log(`Files analyzed: ${chalk.bold(qualityReport.metadata.analyzedFiles)}`);
        console.log(`Issues: ${chalk.red(qualityReport.issueCount.errors)} er
  - Type: ads
- Implementation for HTML report generation
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  - Context: {
  // Implementation for HTML report generation
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  - Type: ads
- 333; }
    h1, h2, h3 { color: #2c3e50; }
    .summary { display: flex; gap: 20p
  - Context: y Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
    h1, h2, h3 { color: #2c3e50; }
    .summary { display: flex; gap: 20p
  - Type: ads
- 2c3e50; }
    .summary { display: flex; gap: 20px; margin-bottom: 20px; }
    .summary-box { padding: 15px; border-radius: 5px; flex: 1; }
    .errors { background-color: #ffecec; border-left: 5px
  - Context: lor: #2c3e50; }
    .summary { display: flex; gap: 20px; margin-bottom: 20px; }
    .summary-box { padding: 15px; border-radius: 5px; flex: 1; }
    .errors { background-color: #ffecec; border-left: 5px
  - Type: ads
- ffecec; border-left: 5px solid #f44336; }
  - Context: ummary { display: flex; gap: 20px; margin-bottom: 20px; }
    .summary-box { padding: 15px; border-radius: 5px; flex: 1; }
    .errors { background-color: #ffecec; border-left: 5px solid #f44336; }
    
  - Type: ads
- 2196f3; }
    .tabs { display: flex; margin: 20px 0; border-bottom: 1px solid #ddd; }
    .tab { padding: 10px 20px; cursor: pointer; }
    .tab.active { border-bottom: 3px solid #3f51b5; color: #3f51
  - Context:  #2196f3; }
    .tabs { display: flex; margin: 20px 0; border-bottom: 1px solid #ddd; }
    .tab { padding: 10px 20px; cursor: pointer; }
    .tab.active { border-bottom: 3px solid #3f51b5; color: #3f51
  - Type: ads
- f5f5f5; border-radius: 5px; }
    .filters select, .filters input { p
  - Context: tent { display: none; }
    .tab-content.active { display: block; }
    .filters { margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
    .filters select, .filters input { p
  - Type: ads
- f5f5f5; border-radius: 5px; }
    .filters select, .filters input { padding: 8px; margin-right: 10px; }
    .issues-ta
  - Context:  display: block; }
    .filters { margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
    .filters select, .filters input { padding: 8px; margin-right: 10px; }
    .issues-ta
  - Type: ads
- f5f5f5; border-radius: 5px; }
    .filters select, .filters input { padding: 8px; margin-right: 10px; }
    .issues-table { width: 100%; border-collapse: collapse; margin-
  - Context: ding: 15px; background-color: #f5f5f5; border-radius: 5px; }
    .filters select, .filters input { padding: 8px; margin-right: 10px; }
    .issues-table { width: 100%; border-collapse: collapse; margin-
  - Type: ads
- ddd; }
    .issues-table th { background-color: #f2f2f2; }
  - Context: collapse: collapse; margin-top: 20px; }
    .issues-table th, .issues-table td { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
    .issues-table th { background-color: #f2f2f2; }
   
  - Type: ads
- 2196f3; font-weight: bold; }
    .context { background-color: #f9f9f9; padding: 5px; margin-top: 5px; border-radius: 3px; font-family: monospace; }
    .file-link { color: #3
  - Context:    .severity-info { color: #2196f3; font-weight: bold; }
    .context { background-color: #f9f9f9; padding: 5px; margin-top: 5px; border-radius: 3px; font-family: monospace; }
    .file-link { color: #3
  - Type: ads
- f9f9f9; padding: 5px; margin-top: 5px; border-radius: 3px; font-family: monospace; }
    .file-link { color: #3f51b5; text-decoration: none; }
    .f
  - Context: nt-weight: bold; }
    .context { background-color: #f9f9f9; padding: 5px; margin-top: 5px; border-radius: 3px; font-family: monospace; }
    .file-link { color: #3f51b5; text-decoration: none; }
    .f
  - Type: ads
- cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>Code Quality Report</h1>
  
  <div class="summary">
    <div class="summary-box error
  - Context: x; margin: 20px 0; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>Code Quality Report</h1>
  
  <div class="summary">
    <div class="summary-box error
  - Type: ads
- er="Filter issues..."> </div> <table class="issues-table" id="issues-table"> <thead> <tr> <th>Severity</th> <th>File</th>
  - Context: er="Filter issues...">
    </div>
    
    <table class="issues-table" id="issues-table">
      <thead>
        <tr>
          <th>Severity</th>
          <th>File</th>
          <th>Line</th>
         
  - Type: ads
- </tr> </thead> <tbody> `; for (const issue of data.issues) {
  - Context:           <th>Line</th>
          <th>Rule</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  for (const issue of data.issues) {
    const severityClass = `severity-${i
  - Type: ads
- </div> <div class="tab-content" id="files-tab"> <table class="issues-table"> <thead> <tr> <th>File</th> <th>Total
  - Context: >
  </div>
  
  <div class="tab-content" id="files-tab">
    <table class="issues-table">
      <thead>
        <tr>
          <th>File</th>
          <th>Total Issues</th>
          <th>Errors</th>
   
  - Type: ads
- <th>Warnings</th> <th>Info</th> </tr> </thead> <tbody> `; const fileEntries = Object.entries(data.summary.byFile)
  - Context:        <th>Errors</th>
          <th>Warnings</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  const fileEntries = Object.entries(data.summary.byFile)
    .map(([file, c
  - Type: ads
- </div> <div class="tab-content" id="rules-tab"> <table class="issues-table"> <thead> <tr> <th>Rule</th> <th>Total
  - Context: >
  </div>
  
  <div class="tab-content" id="rules-tab">
    <table class="issues-table">
      <thead>
        <tr>
          <th>Rule</th>
          <th>Total Issues</th>
          <th>Errors</th>
   
  - Type: ads
- <th>Warnings</th> <th>Info</th> </tr> </thead> <tbody> `; const ruleEntries = Object.entries(data.summary.byRule)
  - Context:        <th>Errors</th>
          <th>Warnings</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  const ruleEntries = Object.entries(data.summary.byRule)
    .map(([rule, c
  - Type: ads
- = document.querySelectorAll('.tab-content'); tabs.forEach(tab => { tab.addEventListener('click', () => { const
  - Context: t tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
       
  - Type: ads
- Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show active content
        tabContents.forEach(content => {
  - Context: // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show active content
        tabContents.forEach(content => {
      
  - Type: ads
- Issue filtering
    const severit
  - Context: List.remove('active');
          if (content.id === tabId + '-tab') {
            content.classList.add('active');
          }
        });
      });
    });
    
    // Issue filtering
    const severit
  - Type: ads
- showBySeverity && showBySearch ? '' : 'none'; }); } severityFilter.addEventListener('change',
  - Context: yle.display = showBySeverity && showBySearch ? '' : 'none';
      });
    }
    
    severityFilter.addEventListener('change', filterIssues);
    issueSearch.addEventListener('input', filterIssues);
   
  - Type: ads
- Charts
    window.addEventListener('load', () =>
  - Context: ;
      });
    }
    
    severityFilter.addEventListener('change', filterIssues);
    issueSearch.addEventListener('input', filterIssues);
    
    // Charts
    window.addEventListener('load', () => 
  - Type: ads
- Charts
    window.addEventListener('load', () => {
      // Severity chart
      const severityData = [
        ${data.i
  - Context: lterIssues);
    issueSearch.addEventListener('input', filterIssues);
    
    // Charts
    window.addEventListener('load', () => {
      // Severity chart
      const severityData = [
        ${data.i
  - Type: ads
- Charts
    window.addEventListener('load', () => {
      // Severity chart
      const severityData = [
        ${data.issueCount.errors},
  - Context: ueSearch.addEventListener('input', filterIssues);
    
    // Charts
    window.addEventListener('load', () => {
      // Severity chart
      const severityData = [
        ${data.issueCount.errors},
 
  - Type: ads
- Update active tab
  - Context: cument.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        
        // Update active tab
  - Type: ads
- Top rules chart
      const topRules = ${JSON.string
  - Context: 96f3']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
      
      // Top rules chart
      const topRules = ${JSON.string
  - Type: ads
- options: { responsive: true, maintainAspectRatio: false, scales: { y: {
  - Context: f51b5'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
    
  - Type: ads
- from '../utils/formatters.js'; export function registerVisualizationCommands(program: Command) { const vizCommand =
  - Context: port { formatOutput } from '../utils/formatters.js';

export function registerVisualizationCommands(program: Command) {
  const vizCommand = program
    .command('visualize')
    .description('Generate v
  - Type: freemium
- registerVisualizationCommands(program: Command) { const vizCommand = program .command('visualize') .description('Generate visualizations
  - Context: atters.js';

export function registerVisualizationCommands(program: Command) {
  const vizCommand = program
    .command('visualize')
    .description('Generate visualizations for code and dependencies')
  - Type: freemium
- --file, or --path must be specified')); process.exit(1); } try {
  - Context: ) {
        console.error(chalk.red('One of --repo, --file, or --path must be specified'));
        process.exit(1);
      }
      
      try {
        const spinner = ora('Generating dependency visualiz
  - Type: freemium
- else { spinner.fail('File not found'); process.exit(1); } } if (options.path)
  - Context: , 'utf8');
            }
          } else {
            spinner.fail('File not found');
            process.exit(1);
          }
        }
        
        if (options.path) {
          args.path = optio
  - Type: freemium
- Code structure
  - Context: ole.error(chalk.red(`${figures.cross} Visualization failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Code structure 
  - Type: freemium
- Implementation for structure visualization
  - Context: ions.file) {
        console.error(chalk.red('Either --repo or --file must be specified'));
        process.exit(1);
      }
      
      try {
        // Implementation for structure visualization
     
  - Type: freemium
- ${(error as Error).message}`)); process.exit(1); } finally { await closeClient(); }
  - Context: ole.error(chalk.red(`${figures.cross} Visualization failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  return vizComman
  - Type: freemium
- if (!options.repo) { args.fileContent = fs.readFileSync(options.file, 'utf8'); } } else
  - Context: rgs.filePath = options.file;
            if (!options.repo) {
              args.fileContent = fs.readFileSync(options.file, 'utf8');
            }
          } else {
            spinner.fail('File not 
  - Type: ads
- from '../utils/formatters.js'; export function registerKnowledgeGraphCommands(program: Command) { const kgCommand =
  - Context: ort { formatOutput } from '../utils/formatters.js';

export function registerKnowledgeGraphCommands(program: Command) {
  const kgCommand = program
    .command('knowledge')
    .description('Work with t
  - Type: freemium
- Command) { const kgCommand = program .command('knowledge') .description('Work with the
  - Context: atters.js';

export function registerKnowledgeGraphCommands(program: Command) {
  const kgCommand = program
    .command('knowledge')
    .description('Work with the code knowledge graph');
  
  // Build
  - Type: freemium
- Query knowledge
  - Context: halk.red(`${figures.cross} Failed to build knowledge graph: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Query knowledge
  - Type: freemium
- Export knowle
  - Context:     console.error(chalk.red(`${figures.cross} Query failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  // Export knowle
  - Type: freemium
- } from '../utils/formatters.js'; import { detectCurrentProject } from '../utils/project-detector.js'; export
  - Context: /utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';
import { detectCurrentProject } from '../utils/project-detector.js';

export function registerIdeCommands(program: Command) {
  - Type: freemium
- Command) { const ideCommand = pro
  - Context: port { formatOutput } from '../utils/formatters.js';
import { detectCurrentProject } from '../utils/project-detector.js';

export function registerIdeCommands(program: Command) {
  const ideCommand = pro
  - Type: freemium
- from '../utils/project-detector.js'; export function registerIdeCommands(program: Command) { const ideCommand =
  - Context:  { detectCurrentProject } from '../utils/project-detector.js';

export function registerIdeCommands(program: Command) {
  const ideCommand = program
    .command('ide')
    .description('IDE-specific com
  - Type: freemium
- registerIdeCommands(program: Command) { const ideCommand = program .command('ide') .description('IDE-specific commands
  - Context: project-detector.js';

export function registerIdeCommands(program: Command) {
  const ideCommand = program
    .command('ide')
    .description('IDE-specific commands and integrations');
  
  // Analyze
  - Type: freemium
- Read file content
        const fullPath = path.resolve(process.cwd(), filePath);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
  - Context:  position...').start();
        
        // Read file content
        const fullPath = path.resolve(process.cwd(), filePath);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        
     
  - Type: freemium
- Analyze only op
  - Context:  console.error(chalk.red(`${figures.cross} Analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Analyze only op
  - Type: freemium
- Analyze only open files (IDE would provide list)
  ideCommand
    .command('analyze-open-files <files...>')
    .description('Analyze spec
  - Context: } finally {
        await closeClient();
      }
    });
  
  // Analyze only open files (IDE would provide list)
  ideCommand
    .command('analyze-open-files <files...>')
    .description('Analyze spec
  - Type: freemium
- Read file content
        const fullPath = path.resolve(process.cwd(), filePath);
        const fileCont
  - Context: try {
        const spinner = ora('Analyzing at cursor position...').start();
        
        // Read file content
        const fullPath = path.resolve(process.cwd(), filePath);
        const fileCont
  - Type: ads
- Extract context around cursor position
        const
  - Context: nt
        const fullPath = path.resolve(process.cwd(), filePath);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        
        // Extract context around cursor position
        const
  - Type: ads
- Read and analyze each file
        const fileContents = files.map(file => ({
          path: file,
  - Context:  Connect to server
        const client = await getClient(serverPath, debug);
        
        // Read and analyze each file
        const fileContents = files.map(file => ({
          path: file,
     
  - Type: ads
- Call analyze-files tool
        const result
  - Context: ile
        const fileContents = files.map(file => ({
          path: file,
          content: fs.readFileSync(file, 'utf8')
        }));
        
        // Call analyze-files tool
        const result
  - Type: ads
- Adjust for 0-based array indexing vs 1-based line numbers
  const targetLineIndex = line - 1;
  
  //
  - Context: ore: string[], target: string, after: string[] } {
  const lines = fileContent.split('\n');
  
  // Adjust for 0-based array indexing vs 1-based line numbers
  const targetLineIndex = line - 1;
  
  // 
  - Type: ads
- tags (comma-separated)') .option('-l, --limit <limit>', 'Limit results', '10') .action(async (options:
  - Context: 'Related file')
    .option('--tags <tags>', 'Filter by tags (comma-separated)')
    .option('-l, --limit <limit>', 'Limit results', '10')
    .action(async (options: any, command: any) => {
      const { 
  - Type: freemium
- (comma-separated)') .option('-l, --limit <limit>', 'Limit results', '10') .action(async (options: any,
  - Context: d file')
    .option('--tags <tags>', 'Filter by tags (comma-separated)')
    .option('-l, --limit <limit>', 'Limit results', '10')
    .action(async (options: any, command: any) => {
      const { serverP
  - Type: freemium
- .option('-l, --limit <limit>', 'Limit results', '10') .action(async (options: any, command:
  - Context:    .option('--tags <tags>', 'Filter by tags (comma-separated)')
    .option('-l, --limit <limit>', 'Limit results', '10')
    .action(async (options: any, command: any) => {
      const { serverPath, debug
  - Type: freemium
- tags: options.tags ? options.tags.split(',') : undefined, limit: parseInt(options.limit) }, debug);
  - Context: edFile: options.file,
          tags: options.tags ? options.tags.split(',') : undefined,
          limit: parseInt(options.limit)
        }, debug);
        
        spinner.succeed('Retrieved insights');
  - Type: freemium
- ? options.tags.split(',') : undefined, limit: parseInt(options.limit) }, debug); spinner.succeed('Retrieved insights');
  - Context:         tags: options.tags ? options.tags.split(',') : undefined,
          limit: parseInt(options.limit)
        }, debug);
        
        spinner.succeed('Retrieved insights');
        
        // For
  - Type: freemium
- } from '../utils/formatters.js'; export function registerInsightsCommands(program: Command) { const insightsCommand
  - Context: ';
import { formatOutput } from '../utils/formatters.js';

export function registerInsightsCommands(program: Command) {
  const insightsCommand = program
    .command('insights')
    .description('Work w
  - Type: freemium
- Command) { const insightsCommand = program .command('insights') .description('Work with codebase
  - Context: atters.js';

export function registerInsightsCommands(program: Command) {
  const insightsCommand = program
    .command('insights')
    .description('Work with codebase insights and memory');
  
  // St
  - Type: freemium
- Retrieve insigh
  - Context: .error(chalk.red(`${figures.cross} Failed to store insight: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Retrieve insigh
  - Type: freemium
- insights: ${(error as Error).message}`)); process.exit(1); } finally { await closeClient();
  - Context: or(chalk.red(`${figures.cross} Failed to retrieve insights: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  return insightsC
  - Type: freemium
- Store insight command
  insightsCommand
    .command('store')
    .description('Store a new insight about
  - Context: rogram
    .command('insights')
    .description('Work with codebase insights and memory');
  
  // Store insight command
  insightsCommand
    .command('store')
    .description('Store a new insight about
  - Type: marketplace
- Store insight command
  insightsCommand
    .command('store')
    .description('Store a new insight about a codebase')
    .requiredOption('-r, --repo <url>',
  - Context:  with codebase insights and memory');
  
  // Store insight command
  insightsCommand
    .command('store')
    .description('Store a new insight about a codebase')
    .requiredOption('-r, --repo <url>', 
  - Type: marketplace
- Store insight command
  insightsCommand
    .command('store')
    .description('Store a new insight about a codebase')
    .requiredOption('-r, --repo <url>', 'Repository URL')
    .req
  - Context: d memory');
  
  // Store insight command
  insightsCommand
    .command('store')
    .description('Store a new insight about a codebase')
    .requiredOption('-r, --repo <url>', 'Repository URL')
    .req
  - Type: marketplace
- Call the store-codebase-insight tool
        const result = await callTool('store-codebase-insight', {
          r
  - Context: t to server
        const client = await getClient(serverPath, debug);
        
        // Call the store-codebase-insight tool
        const result = await callTool('store-codebase-insight', {
          r
  - Type: marketplace
- Call the store-codebase-insight tool
        const result = await callTool('store-codebase-insight', {
          repositoryUrl: options.repo,
          insightType: options.type,
  - Context: g);
        
        // Call the store-codebase-insight tool
        const result = await callTool('store-codebase-insight', {
          repositoryUrl: options.repo,
          insightType: options.type,
  
  - Type: marketplace
- Format and display the results
        console.log(formatOutput(result, out
  - Context: ns.tags ? options.tags.split(',') : []
        }, debug);
        
        spinner.succeed('Insight stored');
        
        // Format and display the results
        console.log(formatOutput(result, out
  - Type: marketplace
- (error) { console.error(chalk.red(`${figures.cross} Failed to store insight: ${(error as Error).message}`));
  - Context: sult, output));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Failed to store insight: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await c
  - Type: marketplace
- } from '../utils/formatters.js'; export function registerInsightsCommands(program: Command) { const insightsCommand
  - Context: ils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';

export function registerInsightsCommands(program: Command) {
  const insightsCommand = program
    .command('insights')
    .descrip
  - Type: data
- program .command('insights') .description('Work with codebase insights and memory'
  - Context: rom '../utils/formatters.js';

export function registerInsightsCommands(program: Command) {
  const insightsCommand = program
    .command('insights')
    .description('Work with codebase insights and memory'
  - Type: data
- Store insight command
  insig
  - Context: nction registerInsightsCommands(program: Command) {
  const insightsCommand = program
    .command('insights')
    .description('Work with codebase insights and memory');
  
  // Store insight command
  insig
  - Type: data
- Store insight command
  insightsCommand
    .command('store')
    .descriptio
  - Context: ) {
  const insightsCommand = program
    .command('insights')
    .description('Work with codebase insights and memory');
  
  // Store insight command
  insightsCommand
    .command('store')
    .descriptio
  - Type: data
- Store insight command
  insightsCommand
    .command('store')
    .description('Store a new insight about a codebase')
    .required
  - Context: ights')
    .description('Work with codebase insights and memory');
  
  // Store insight command
  insightsCommand
    .command('store')
    .description('Store a new insight about a codebase')
    .required
  - Type: data
- Retrieve insights command
  insightsCommand
    .command('retrieve')
    .description('Retrieve insights about a code
  - Context:    process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Retrieve insights command
  insightsCommand
    .command('retrieve')
    .description('Retrieve insights about a code
  - Type: data
- Retrieve insights command
  insightsCommand
    .command('retrieve')
    .description('Retrieve insights about a codebase')
    .require
  - Context: 
      } finally {
        await closeClient();
      }
    });
  
  // Retrieve insights command
  insightsCommand
    .command('retrieve')
    .description('Retrieve insights about a codebase')
    .require
  - Type: data
- Retrieve insights command
  insightsCommand
    .command('retrieve')
    .description('Retrieve insights about a codebase')
    .requiredOption('-r, --repo <url>', 'Repository URL')
    .option('-t, --typ
  - Context:  // Retrieve insights command
  insightsCommand
    .command('retrieve')
    .description('Retrieve insights about a codebase')
    .requiredOption('-r, --repo <url>', 'Repository URL')
    .option('-t, --typ
  - Type: data
- Connect to server
        const client = await getClient(serverPa
  - Context: output } = command.parent.parent.opts();
      
      try {
        const spinner = ora('Retrieving insights...').start();
        
        // Connect to server
        const client = await getClient(serverPa
  - Type: data
- Call the retrieve-codebase-insights tool
        const result = await callTool('retrieve-codebase-insights', {
          repositoryUrl:
  - Context:   const client = await getClient(serverPath, debug);
        
        // Call the retrieve-codebase-insights tool
        const result = await callTool('retrieve-codebase-insights', {
          repositoryUrl:
  - Type: data
- retrieve-codebase-insights tool const result = await callTool('retrieve-codebase-insights', { repositoryUrl: options.repo,
  - Context: / Call the retrieve-codebase-insights tool
        const result = await callTool('retrieve-codebase-insights', {
          repositoryUrl: options.repo,
          insightTypes: options.types ? options.types.sp
  - Type: data
- Format and display the results
        console.log(formatOutput(result, outp
  - Context:       limit: parseInt(options.limit)
        }, debug);
        
        spinner.succeed('Retrieved insights');
        
        // Format and display the results
        console.log(formatOutput(result, outp
  - Type: data
- { console.error(chalk.red(`${figures.cross} Failed to retrieve insights: ${(error as Error).message}`)); process.exit(1);
  - Context: put));
      } catch (error) {
        console.error(chalk.red(`${figures.cross} Failed to retrieve insights: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClie
  - Type: data
- process.exit(1); } finally { await closeClient(); } }); return insightsCommand;
  - Context:       process.exit(1);
      } finally {
        await closeClient();
      }
    });
    
  return insightsCommand;
} 
  - Type: data
- } from '../utils/formatters.js'; export function registerSocioTechnicalCommands(program: Command) { const stCommand
  - Context: ort { formatOutput } from '../utils/formatters.js';

export function registerSocioTechnicalCommands(program: Command) {
  const stCommand = program
    .command('socio-technical')
    .description('Analy
  - Type: freemium
- registerSocioTechnicalCommands(program: Command) { const stCommand = program .command('socio-technical') .description('Analyze socio-technical
  - Context: atters.js';

export function registerSocioTechnicalCommands(program: Command) {
  const stCommand = program
    .command('socio-technical')
    .description('Analyze socio-technical patterns in repositor
  - Type: freemium
- Prepare time range if provided
        const timeRange = (options.startDate || options.endDate) ? {
          start: options.
  - Context:        const client = await getClient(serverPath, debug);
        
        // Prepare time range if provided
        const timeRange = (options.startDate || options.endDate) ? {
          start: options.
  - Type: freemium
- } from '../utils/formatters.js'; export function registerDependencyCommands(program: Command) { const dependencyCommand
  - Context: 
import { formatOutput } from '../utils/formatters.js';

export function registerDependencyCommands(program: Command) {
  const dependencyCommand = program
    .command('dependencies')
    .description('
  - Type: freemium
- registerDependencyCommands(program: Command) { const dependencyCommand = program .command('dependencies') .description('Analyze code
  - Context: rs.js';

export function registerDependencyCommands(program: Command) {
  const dependencyCommand = program
    .command('dependencies')
    .description('Analyze code dependencies');
  
  // Dependency 
  - Type: freemium
- Visualize depen
  - Context: ror(chalk.red(`${figures.cross} Dependency analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Visualize depen
  - Type: freemium
- is required for visualization')); process.exit(1); } try { const spinner
  - Context: utputFile) {
        console.error(chalk.red('Output file is required for visualization'));
        process.exit(1);
      }
      
      try {
        const spinner = ora('Generating dependency visualiz
  - Type: freemium
- failed: ${(error as Error).message}`)); process.exit(1); } finally { await closeClient();
  - Context: halk.red(`${figures.cross} Dependency visualization failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  return dependencyC
  - Type: freemium
- or (const item of result.content) { if
  - Context: or (const item of result.content) {
            if (item.type === 'text') {
              content = item.text;
              break;
            }
          }
        }
        
        if (!content) {
   
  - Type: marketplace
- if (format === 'mermaid') { const mermaidContent = fs.readFileSync(filePath, 'utf8');
  - Context: rate HTML wrapper based on format
    if (format === 'mermaid') {
      const mermaidContent = fs.readFileSync(filePath, 'utf8');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
     
  - Type: ads
- const htmlContent = ` <!DOCTYPE html> <html> <head> <meta charset="UTF-8">
  - Context: nc(filePath, 'utf8');
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Dependency Visualization</title>
          <scri
  - Type: ads
- } .mermaid { max-width: 100%; } </style> </head> <body> <h1>Dependency
  - Context: ans-serif; margin: 20px; }
            .mermaid { max-width: 100%; }
          </style>
        </head>
        <body>
          <h1>Dependency Visualization</h1>
          <div class="mermaid">
${merma
  - Type: ads
- Write HTML f
  - Context: d">
${mermaidContent}
          </div>
          <script>
            mermaid.initialize({ startOnLoad: true });
          </script>
        </body>
        </html>
      `;
      
      // Write HTML f
  - Type: ads
- } from '../utils/formatters.js'; export function registerMetricsCommands(program: Command) { const metricsCommand
  - Context: s';
import { formatOutput } from '../utils/formatters.js';

export function registerMetricsCommands(program: Command) {
  const metricsCommand = program
    .command('metrics')
    .description('Analyze 
  - Type: freemium
- Command) { const metricsCommand = program .command('metrics') .description('Analyze code metrics
  - Context: rmatters.js';

export function registerMetricsCommands(program: Command) {
  const metricsCommand = program
    .command('metrics')
    .description('Analyze code metrics and quality');
  
  // Code metr
  - Type: freemium
- 'fs'; import path from 'path'; import { detectCurrentProject, getProjectInfo, getChangedFiles
  - Context:  from '../utils/formatters.js';
import fs from 'fs';
import path from 'path';
import { detectCurrentProject, getProjectInfo, getChangedFiles } from '../utils/project-detector.js';

export function regist
  - Type: freemium
- import path from 'path'; import { detectCurrentProject, getProjectInfo, getChangedFiles }
  - Context: ils/formatters.js';
import fs from 'fs';
import path from 'path';
import { detectCurrentProject, getProjectInfo, getChangedFiles } from '../utils/project-detector.js';

export function registerAnalyzeCom
  - Type: freemium
- import { detectCurrentProject, getProjectInfo, getChangedFiles } from '../utils/project-detector.js'; export function
  - Context: t path from 'path';
import { detectCurrentProject, getProjectInfo, getChangedFiles } from '../utils/project-detector.js';

export function registerAnalyzeCommands(program: Command) {
  const analyzeComma
  - Type: freemium
- from '../utils/project-detector.js'; export function registerAnalyzeCommands(program: Command) { const analyzeCommand =
  - Context: fo, getChangedFiles } from '../utils/project-detector.js';

export function registerAnalyzeCommands(program: Command) {
  const analyzeCommand = program
    .command('analyze')
    .description('Analyze 
  - Type: freemium
- Command) { const analyzeCommand = program .command('analyze') .description('Analyze code repositories
  - Context: detector.js';

export function registerAnalyzeCommands(program: Command) {
  const analyzeCommand = program
    .command('analyze')
    .description('Analyze code repositories and files');
  
  // Reposi
  - Type: freemium
- File analysis c
  - Context:  console.error(chalk.red(`${figures.cross} Analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // File analysis c
  - Type: freemium
- file') .option('-l, --language <language>', 'Specify the programming language') .option('-m, --metrics
  - Context: >')
    .description('Analyze a single file')
    .option('-l, --language <language>', 'Specify the programming language')
    .option('-m, --metrics <metrics>', 'Metrics to calculate (comma-separated)',
  - Type: freemium
- Read the file content
        const fullPath = path.resolve(process.cwd(), filePath);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
  - Context:  file...').start();
        
        // Read the file content
        const fullPath = path.resolve(process.cwd(), filePath);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        
     
  - Type: freemium
- Current project
  - Context:  console.error(chalk.red(`${figures.cross} Analysis failed: ${(error as Error).message}`));
        process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Current project
  - Type: freemium
- Current project analysis command
  analyzeCommand
    .command('current')
    .description('Analyze the current
  - Context:     process.exit(1);
      } finally {
        await closeClient();
      }
    });
  
  // Current project analysis command
  analyzeCommand
    .command('current')
    .description('Analyze the current
  - Type: freemium
- .command('current') .description('Analyze the current project or workspace') .option('-d, --depth <depth>',
  - Context: ect analysis command
  analyzeCommand
    .command('current')
    .description('Analyze the current project or workspace')
    .option('-d, --depth <depth>', 'Analysis depth (1-3)', '2')
    .option('--d
  - Type: freemium
- Detect the current project
        const spinner = ora('Detecting project...').start();
        const projectRoot = await
  - Context: h, debug, output } = command.parent.parent.opts();
      
      try {
        // Detect the current project
        const spinner = ora('Detecting project...').start();
        const projectRoot = await 
  - Type: freemium
- Detect the current project
        const spinner = ora('Detecting project...').start();
        const projectRoot = await detectCurrentProject();
        const projectIn
  - Context: ();
      
      try {
        // Detect the current project
        const spinner = ora('Detecting project...').start();
        const projectRoot = await detectCurrentProject();
        const projectIn
  - Type: freemium
- const spinner = ora('Detecting project...').start(); const projectRoot = await detectCurrentProject();
  - Context: tect the current project
        const spinner = ora('Detecting project...').start();
        const projectRoot = await detectCurrentProject();
        const projectInfo = getProjectInfo(projectRoot);
  
  - Type: freemium
- = ora('Detecting project...').start(); const projectRoot = await detectCurrentProject(); const projectInfo
  - Context: const spinner = ora('Detecting project...').start();
        const projectRoot = await detectCurrentProject();
        const projectInfo = getProjectInfo(projectRoot);
        
        spinner.succeed(`D
  - Type: freemium
- project...').start(); const projectRoot = await detectCurrentProject(); const projectInfo = getProjectInfo(projectRoot);
  - Context: cting project...').start();
        const projectRoot = await detectCurrentProject();
        const projectInfo = getProjectInfo(projectRoot);
        
        spinner.succeed(`Detected ${projectInfo.typ
  - Type: freemium
- projectRoot = await detectCurrentProject(); const projectInfo = getProjectInfo(projectRoot); spinner.succeed(`Detected ${projectInfo.type}
  - Context: ).start();
        const projectRoot = await detectCurrentProject();
        const projectInfo = getProjectInfo(projectRoot);
        
        spinner.succeed(`Detected ${projectInfo.type} project: ${pro
  - Type: freemium
- If changed-only flag is set and i
  - Context:       const projectInfo = getProjectInfo(projectRoot);
        
        spinner.succeed(`Detected ${projectInfo.type} project: ${projectInfo.name}`);
        
        // If changed-only flag is set and i
  - Type: freemium
- If changed-only flag is set and it's a git repo, ge
  - Context: tInfo = getProjectInfo(projectRoot);
        
        spinner.succeed(`Detected ${projectInfo.type} project: ${projectInfo.name}`);
        
        // If changed-only flag is set and it's a git repo, ge
  - Type: freemium
- If changed-only flag is set and it's a git repo, get only chan
  - Context: ProjectInfo(projectRoot);
        
        spinner.succeed(`Detected ${projectInfo.type} project: ${projectInfo.name}`);
        
        // If changed-only flag is set and it's a git repo, get only chan
  - Type: freemium
- let filesToAnalyze: string[] = []; if (options.changedOnly && projectInfo.isGitRepo) {
  - Context: et only changed files
        let filesToAnalyze: string[] = [];
        if (options.changedOnly && projectInfo.isGitRepo) {
          filesToAnalyze = getChangedFiles(projectRoot);
          if (filesTo
  - Type: freemium
- && projectInfo.isGitRepo) { filesToAnalyze = getChangedFiles(projectRoot); if (filesToAnalyze.length === 0)
  - Context:      if (options.changedOnly && projectInfo.isGitRepo) {
          filesToAnalyze = getChangedFiles(projectRoot);
          if (filesToAnalyze.length === 0) {
            console.log(chalk.yellow('No cha
  - Type: freemium
- Connect to server
        const client = await getClient(serv
  - Context: th} changed files to analyze.`));
        }
        
        const analysisSpinner = ora('Analyzing project...').start();
        
        // Connect to server
        const client = await getClient(serv
  - Type: freemium
- Create repository URL from local path
        const repositoryUrl = `file://${projectRoot}`;
        
        // Call the analyze-repository tool
        const result = await callTo
  - Context: ;
        
        // Create repository URL from local path
        const repositoryUrl = `file://${projectRoot}`;
        
        // Call the analyze-repository tool
        const result = await callTo
  - Type: freemium
- Read the file content
        const fullPath = path.resolve(process.cwd(), filePath);
        const file
  - Context: 
      
      try {
        const spinner = ora('Analyzing file...').start();
        
        // Read the file content
        const fullPath = path.resolve(process.cwd(), filePath);
        const file
  - Type: ads
- Connect to server
        const client = await getCl
  - Context: nt
        const fullPath = path.resolve(process.cwd(), filePath);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        
        // Connect to server
        const client = await getCl
  - Type: ads
- const spinner = ora('Detecting project...').start(); const projectRoot = await detectCurrentProject();
  - Context: the current project
        const spinner = ora('Detecting project...').start();
        const projectRoot = await detectCurrentProject();
        const projectInfo = getProjectInfo(projectRoot);
       
  - Type: ads
- projectRoot = await detectCurrentProject(); const projectInfo = getProjectInfo(projectRoot); spinner.succeed(`Detected ${projectInfo.type}
  - Context:   const projectRoot = await detectCurrentProject();
        const projectInfo = getProjectInfo(projectRoot);
        
        spinner.succeed(`Detected ${projectInfo.type} project: ${projectInfo.name}`);
  - Type: ads
- && projectInfo.isGitRepo) { filesToAnalyze = getChangedFiles(projectRoot); if (filesToAnalyze.length === 0)
  - Context: if (options.changedOnly && projectInfo.isGitRepo) {
          filesToAnalyze = getChangedFiles(projectRoot);
          if (filesToAnalyze.length === 0) {
            console.log(chalk.yellow('No changed 
  - Type: ads
- Create repository URL from local path
        const repositoryUrl = `file://${projectRoot}`;
        
        // Call the analyze-repository tool
        const result = await callTool('a
  - Context:      
        // Create repository URL from local path
        const repositoryUrl = `file://${projectRoot}`;
        
        // Call the analyze-repository tool
        const result = await callTool('a
  - Type: ads
- from '../utils/formatters.js'; import { detectCurrentProject } from '../utils/project-detector.js'; import {
  - Context: /utils/mcp-client.js';
import { formatOutput } from '../utils/formatters.js';
import { detectCurrentProject } from '../utils/project-detector.js';
import { getConfigValue } from '../utils/config.js';

//
  - Type: freemium
- Use Node.js built-in fs.
  - Context: port { formatOutput } from '../utils/formatters.js';
import { detectCurrentProject } from '../utils/project-detector.js';
import { getConfigValue } from '../utils/config.js';

// Use Node.js built-in fs.
  - Type: freemium
- watchingFiles = new Set<string>(); export function registerWatchCommands(program: Command) { const
  - Context: eout | null = null;
const watchingFiles = new Set<string>();

export function registerWatchCommands(program: Command) {
  const watchCommand = program
    .command('watch')
    .description('Watch for fi
  - Type: freemium
- Command) { const watchCommand = program .command('watch') .description('Watch for file
  - Context: ew Set<string>();

export function registerWatchCommands(program: Command) {
  const watchCommand = program
    .command('watch')
    .description('Watch for file changes and analyze in real-time');
  
 
  - Type: freemium
- Watch current project
  watchCommand
    .command('current')
    .description('Watch the current project for changes'
  - Context: 'watch')
    .description('Watch for file changes and analyze in real-time');
  
  // Watch current project
  watchCommand
    .command('current')
    .description('Watch the current project for changes'
  - Type: freemium
- Watch current project
  watchCommand
    .command('current')
    .description('Watch the current project for changes')
    .option('-i, --ignore <patterns>', 'Comma-separated patterns to ignore', 'nod
  - Context: // Watch current project
  watchCommand
    .command('current')
    .description('Watch the current project for changes')
    .option('-i, --ignore <patterns>', 'Comma-separated patterns to ignore', 'nod
  - Type: freemium
- Detect current project
        const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watch
  - Context: rPath, debug, output } = command.parent.parent.opts();
      
      try {
        // Detect current project
        const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watch
  - Type: freemium
- Detect current project
        const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watching ${projectRoot} for
  - Context:  = command.parent.parent.opts();
      
      try {
        // Detect current project
        const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watching ${projectRoot} for
  - Type: freemium
- Detect current project
        const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watching ${projectRoot} for changes...`));
        console.l
  - Context:       
      try {
        // Detect current project
        const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watching ${projectRoot} for changes...`));
        console.l
  - Type: freemium
- projectRoot = await detectCurrentProject(); console.log(chalk.blue(`Watching ${projectRoot} for changes...`)); console.log(chalk.gray('Press Ctrl+C
  - Context:        const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watching ${projectRoot} for changes...`));
        console.log(chalk.gray('Press Ctrl+C to stop'));
        
     
  - Type: freemium
- Set up recursive directory watching
        watchDirectory(projectRoot, extensions, ignorePatterns, async (filePath) => {
          // Debounce file changes
  - Context: (serverPath, debug);
        
        // Set up recursive directory watching
        watchDirectory(projectRoot, extensions, ignorePatterns, async (filePath) => {
          // Debounce file changes
     
  - Type: freemium
- Read file content
  - Context:  watchTimeout = setTimeout(async () => {
            const spinner = ora(`Analyzing ${path.relative(projectRoot, filePath)}...`).start();
            
            try {
              // Read file content
  - Type: freemium
- Format and display results
  - Context: 
              }, debug);
              
              spinner.succeed(`Analysis of ${path.relative(projectRoot, filePath)} complete`);
              
              // Format and display results
        
  - Type: freemium
- Keep process running
        process.stdin.resume();
        
        // Handle process termination
  - Context: ilePath);
            }
          }, parseInt(options.delay));
        });
        
        // Keep process running
        process.stdin.resume();
        
        // Handle process termination
        
  - Type: freemium
- Keep process running
        process.stdin.resume();
        
        // Handle process termination
        process.on('SIGINT', asy
  - Context:           }, parseInt(options.delay));
        });
        
        // Keep process running
        process.stdin.resume();
        
        // Handle process termination
        process.on('SIGINT', asy
  - Type: freemium
- Keep process running
        process.stdin.resume();
        
        // Handle process termination
        process.on('SIGINT', async () => {
          console.log(chalk.blue('\nStop
  - Context:         
        // Keep process running
        process.stdin.resume();
        
        // Handle process termination
        process.on('SIGINT', async () => {
          console.log(chalk.blue('\nStop
  - Type: freemium
- Handle process termination
        process.on('SIGINT', async () => {
          console.log(chalk.blue('\nStopping watch mode...'));
  - Context: cess running
        process.stdin.resume();
        
        // Handle process termination
        process.on('SIGINT', async () => {
          console.log(chalk.blue('\nStopping watch mode...'));
     
  - Type: freemium
- watch mode...')); await closeClient(); process.exit(0); }); } catch (error) {
  - Context:       console.log(chalk.blue('\nStopping watch mode...'));
          await closeClient();
          process.exit(0);
        });
      } catch (error) {
        console.error(chalk.red(`${figures.cross} 
  - Type: freemium
- Error).message}`)); await closeClient(); process.exit(1); } }); return watchCommand; } /**
  - Context: ures.cross} Watch mode failed: ${(error as Error).message}`));
        await closeClient();
        process.exit(1);
      }
    });
  
  return watchCommand;
}

/**
 * Watch a directory recursively for 
  - Type: freemium
- Use Node.js built-in fs.watch instead of requiring an additional dependency
let watchTimeout: NodeJS.Timeout | null = null;
const watchin
  - Context: or.js';
import { getConfigValue } from '../utils/config.js';

// Use Node.js built-in fs.watch instead of requiring an additional dependency
let watchTimeout: NodeJS.Timeout | null = null;
const watchin
  - Type: ads
- Use Node.js built-in fs.watch instead of requiring an additional dependency
let watchTimeout: NodeJS.Timeout | null = null;
const watchingFiles = new Set<st
  - Context: tConfigValue } from '../utils/config.js';

// Use Node.js built-in fs.watch instead of requiring an additional dependency
let watchTimeout: NodeJS.Timeout | null = null;
const watchingFiles = new Set<st
  - Type: ads
- Skip if we're already analyzing this file
          if (watchingFiles.has(filePath)) {
            return;
          }
  - Context: ut) {
            clearTimeout(watchTimeout);
          }
          
          // Skip if we're already analyzing this file
          if (watchingFiles.has(filePath)) {
            return;
          }
 
  - Type: ads
- { return; } watchingFiles.add(filePath); watchTimeout = setTimeout(async () => {
  - Context:  (watchingFiles.has(filePath)) {
            return;
          }
          
          watchingFiles.add(filePath);
          
          watchTimeout = setTimeout(async () => {
            const spinner 
  - Type: ads
- Read file content
              const fileContent = fs.readFileSync(filePath, 'utf8');
  - Context: th.relative(projectRoot, filePath)}...`).start();
            
            try {
              // Read file content
              const fileContent = fs.readFileSync(filePath, 'utf8');
              
  
  - Type: ads
- Read file content
              const fileContent = fs.readFileSync(filePath, 'utf8');
              
              // Call analyze-file tool
              con
  - Context:        
            try {
              // Read file content
              const fileContent = fs.readFileSync(filePath, 'utf8');
              
              // Call analyze-file tool
              con
  - Type: ads
- Recursively watch subdirectories
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirector
  - Context: ck(filePath);
      }
    });
    
    // Recursively watch subdirectories
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirector
  - Type: ads
- Detect current project
        const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watching ${projectRoot} for chan
  - Context: mmand.parent.parent.opts();
      
      try {
        // Detect current project
        const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watching ${projectRoot} for chan
  - Type: ads
- = await detectCurrentProject(); console.log(chalk.blue(`Watching ${projectRoot} for changes...`)); console.log(chalk.gray('Press Ctrl+C to
  - Context:   const projectRoot = await detectCurrentProject();
        console.log(chalk.blue(`Watching ${projectRoot} for changes...`));
        console.log(chalk.gray('Press Ctrl+C to stop'));
        
        //
  - Type: ads
- Parse extensions to watch
        const extensions = options.ext
  - Context: le.log(chalk.blue(`Watching ${projectRoot} for changes...`));
        console.log(chalk.gray('Press Ctrl+C to stop'));
        
        // Parse extensions to watch
        const extensions = options.ext
  - Type: ads
- Set up recursive directory watching
        watchDirectory(projectRoot, extensions, ignorePatterns, async (filePath) => {
          // Debounce file changes
  - Context: erPath, debug);
        
        // Set up recursive directory watching
        watchDirectory(projectRoot, extensions, ignorePatterns, async (filePath) => {
          // Debounce file changes
          
  - Type: ads
- Read file content
  - Context: hTimeout = setTimeout(async () => {
            const spinner = ora(`Analyzing ${path.relative(projectRoot, filePath)}...`).start();
            
            try {
              // Read file content
    
  - Type: ads
- Format and display results
  - Context:           }, debug);
              
              spinner.succeed(`Analysis of ${path.relative(projectRoot, filePath)} complete`);
              
              // Format and display results
             
  - Type: ads
- from '../utils/config.js'; export function registerConfigCommands(program: Command) { const configCommand =
  - Context: getConfigValue, setConfigValue } from '../utils/config.js';

export function registerConfigCommands(program: Command) {
  const configCommand = program
    .command('config')
    .description('Manage con
  - Type: freemium
- Get configura
  - Context: ils/config.js';

export function registerConfigCommands(program: Command) {
  const configCommand = program
    .command('config')
    .description('Manage configuration settings');
  
  // Get configura
  - Type: freemium
- Set configuration values
  configCommand
    .command('set <ke
  - Context: or(chalk.red(`${figures.cross} Error getting configuration: ${(error as Error).message}`));
        process.exit(1);
      }
    });
  
  // Set configuration values
  configCommand
    .command('set <ke
  - Type: freemium
- Parse the value to the appropriate type
        let parsedValue: any = value;
        
        if (value === 'true') parsedValue
  - Context: lue')
    .action((key: string, value: string) => {
      try {
        // Parse the value to the appropriate type
        let parsedValue: any = value;
        
        if (value === 'true') parsedValue
  - Type: freemium
- Reset configuration
  configCommand
    .command('reset [key]'
  - Context: or(chalk.red(`${figures.cross} Error setting configuration: ${(error as Error).message}`));
        process.exit(1);
      }
    });
  
  // Reset configuration
  configCommand
    .command('reset [key]'
  - Type: freemium
- Error resetting configuration: ${(error as Error).message}`)); process.exit(1); } }); return
  - Context: (chalk.red(`${figures.cross} Error resetting configuration: ${(error as Error).message}`));
        process.exit(1);
      }
    });
    
  return configCommand;
} 
  - Type: freemium
- from 'chalk'; import figures from 'figures'; import { loadConfig, saveConfig,
  - Context:  { Command } from 'commander';
import chalk from 'chalk';
import figures from 'figures';
import { loadConfig, saveConfig, getConfigValue, setConfigValue } from '../utils/config.js';

export function reg
  - Type: ads
- Show all configuration
          const config = loadConfig();
          console.log(JSON.stringify(config, null, 2));
        }
      } catch (error) {
  - Context: value, null, 2)}`);
        } else {
          // Show all configuration
          const config = loadConfig();
          console.log(JSON.stringify(config, null, 2));
        }
      } catch (error) {

  - Type: ads
- { Client } from "@modelcontextprotocol/sdk/client/index.js"; import { StdioClientTransport } from
  - Context: import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/s
  - Type: freemium
- } from "@modelcontextprotocol/sdk/client/stdio.js"; import ora from 'ora'; import chalk from
  - Context: rom "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import ora from 'ora';
import chalk from 'chalk';
import { spawn } from 
  - Type: freemium
- import { spawn } from 'child_process'; let client: Client |
  - Context: dk/client/stdio.js";
import ora from 'ora';
import chalk from 'chalk';
import { spawn } from 'child_process';

let client: Client | null = null;

export async function getClient(serverPath: string, debug
  - Type: freemium
- getClient(serverPath: string, debug = false): Promise<Client> { if (client) {
  - Context:  client: Client | null = null;

export async function getClient(serverPath: string, debug = false): Promise<Client> {
  if (client) {
    return client;
  }

  const spinner = ora('Connecting to analysis
  - Type: freemium
- capabilities: { tools: {}, resources: {}, prompts: {} } }
  - Context:  { name: 'code-analysis-cli', version: '1.0.0' },
      { capabilities: { tools: {}, resources: {}, prompts: {} } }
    );

    await client.connect(transport);
    
    if (debug) {
      console.log(ch
  - Type: freemium
- export async function closeClient(): Promise<void> { if (client) { await
  - Context: server: ${(error as Error).message}`);
    throw error;
  }
}

export async function closeClient(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}

export async functi
  - Type: freemium
- args: any, debug = false): Promise<any> { if (!client) {
  - Context:   client = null;
  }
}

export async function callTool(toolName: string, args: any, debug = false): Promise<any> {
  if (!client) {
    throw new Error('Client not connected to server');
  }
  
  if (deb
  - Type: freemium
- * Detect the root directory of the current project
  - Context: import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Detect the root directory of the current project
 */
export async function detectCurr
  - Type: freemium
- Define project markers in order
  - Context: the root directory of the current project
 */
export async function detectCurrentProject(startDir = process.cwd()): Promise<string> {
  let currentDir = startDir;
  
  // Define project markers in order 
  - Type: freemium
- Define project markers in order of preference
  - Context: ry of the current project
 */
export async function detectCurrentProject(startDir = process.cwd()): Promise<string> {
  let currentDir = startDir;
  
  // Define project markers in order of preference
  
  - Type: freemium
- Define project markers in order of preference
  const projectMarkers = [
    '.git',            // Git reposit
  - Context: entProject(startDir = process.cwd()): Promise<string> {
  let currentDir = startDir;
  
  // Define project markers in order of preference
  const projectMarkers = [
    '.git',            // Git reposit
  - Type: freemium
- Define project markers in order of preference
  const projectMarkers = [
    '.git',            // Git repository
    'package.json',    // Node.js project
  - Context: tring> {
  let currentDir = startDir;
  
  // Define project markers in order of preference
  const projectMarkers = [
    '.git',            // Git repository
    'package.json',    // Node.js project
 
  - Type: freemium
- Git repository
    'package.json',    // Node.js project
    'cargo.toml',      // Rust project
    'pom.xml',         // Maven (Java) project
    'buil
  - Context: const projectMarkers = [
    '.git',            // Git repository
    'package.json',    // Node.js project
    'cargo.toml',      // Rust project
    'pom.xml',         // Maven (Java) project
    'buil
  - Type: freemium
- Git repository
    'package.json',    // Node.js project
    'cargo.toml',      // Rust project
    'pom.xml',         // Maven (Java) project
    'build.gradle',    // Gradle (Java) project
  - Context:          // Git repository
    'package.json',    // Node.js project
    'cargo.toml',      // Rust project
    'pom.xml',         // Maven (Java) project
    'build.gradle',    // Gradle (Java) project

  - Type: freemium
- Node.js project
    'cargo.toml',      // Rust project
    'pom.xml',         // Maven (Java) project
    'build.gradle',    // Gradle (Java) project
  ];
  
  // Walk up the directory tree until w
  - Context:    // Node.js project
    'cargo.toml',      // Rust project
    'pom.xml',         // Maven (Java) project
    'build.gradle',    // Gradle (Java) project
  ];
  
  // Walk up the directory tree until w
  - Type: freemium
- Maven (Java) project
    'build.gradle',    // Gradle (Java) project
  ];
  
  // Walk up the directory tree until we find a project marker or hit the filesystem ro
  - Context: Rust project
    'pom.xml',         // Maven (Java) project
    'build.gradle',    // Gradle (Java) project
  ];
  
  // Walk up the directory tree until we find a project marker or hit the filesystem ro
  - Type: freemium
- Gradle (Java) project
  ];
  
  // Walk up the directory tree until we find a project marker or hit the filesystem root
  while (currentDir !== path.parse(currentDir).root) {
    //
  - Context: 'build.gradle',    // Gradle (Java) project
  ];
  
  // Walk up the directory tree until we find a project marker or hit the filesystem root
  while (currentDir !== path.parse(currentDir).root) {
    //
  - Type: freemium
- Check for project markers
    for (const marker of projectMarkers) {
      const markerPath = path.join(currentDi
  - Context:  or hit the filesystem root
  while (currentDir !== path.parse(currentDir).root) {
    // Check for project markers
    for (const marker of projectMarkers) {
      const markerPath = path.join(currentDi
  - Type: freemium
- Check for project markers
    for (const marker of projectMarkers) {
      const markerPath = path.join(currentDir, marker);
      if (fs.existsSync(marke
  - Context: entDir !== path.parse(currentDir).root) {
    // Check for project markers
    for (const marker of projectMarkers) {
      const markerPath = path.join(currentDir, marker);
      if (fs.existsSync(marke
  - Type: freemium
- Move up to parent directory
    currentDir = path.dirname(currentDir);
  }
  
  // If no project marker found, return the starting directory
  return startDir;
}

/**
 * Get information about
  - Context:    
    // Move up to parent directory
    currentDir = path.dirname(currentDir);
  }
  
  // If no project marker found, return the starting directory
  return startDir;
}

/**
 * Get information about 
  - Type: freemium
- * Get information about the detected project
  - Context: ound, return the starting directory
  return startDir;
}

/**
 * Get information about the detected project
 */
export function getProjectInfo(projectRoot: string): {
  type: string;
  name: string;
  is
  - Type: freemium
- Detect project
  - Context: me: string;
  isGitRepo: boolean;
} {
  const info = {
    type: 'unknown',
    name: path.basename(projectRoot),
    isGitRepo: fs.existsSync(path.join(projectRoot, '.git'))
  };
  
  // Detect project 
  - Type: freemium
- Detect project type
  if (fs.existsSync(path.join(projectRoot, 'pack
  - Context: {
    type: 'unknown',
    name: path.basename(projectRoot),
    isGitRepo: fs.existsSync(path.join(projectRoot, '.git'))
  };
  
  // Detect project type
  if (fs.existsSync(path.join(projectRoot, 'pack
  - Type: freemium
- Detect project type
  if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
    info.type = 'node';
  - Context: name(projectRoot),
    isGitRepo: fs.existsSync(path.join(projectRoot, '.git'))
  };
  
  // Detect project type
  if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
    info.type = 'node';
   
  - Type: freemium
- Detect project type
  if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
    info.type = 'node';
    try {
      const packageJson = JSON.parse
  - Context: Sync(path.join(projectRoot, '.git'))
  };
  
  // Detect project type
  if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
    info.type = 'node';
    try {
      const packageJson = JSON.parse
  - Type: freemium
- try { const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')); if (packageJson.name)
  - Context:  {
    info.type = 'node';
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
      if (packageJson.name) {
        info.name = packageJson.n
  - Type: freemium
- Ignore JSON parsing errors
    }
  } else if (fs.existsSync(path.join(projectRoot, 'cargo.toml'))) {
    info.type = 'rust';
  } else if (fs.existsSync(path.join(projectRoot
  - Context:  }
    } catch (e) {
      // Ignore JSON parsing errors
    }
  } else if (fs.existsSync(path.join(projectRoot, 'cargo.toml'))) {
    info.type = 'rust';
  } else if (fs.existsSync(path.join(projectRoot
  - Type: freemium
- = 'rust'; } else if (fs.existsSync(path.join(projectRoot, 'pom.xml'))) { info.type =
  - Context: th.join(projectRoot, 'cargo.toml'))) {
    info.type = 'rust';
  } else if (fs.existsSync(path.join(projectRoot, 'pom.xml'))) {
    info.type = 'java-maven';
  } else if (fs.existsSync(path.join(projectR
  - Type: freemium
- else if (fs.existsSync(path.join(projectRoot, 'build.gradle'))) { info.type = 'java-gradle'; } return
  - Context: join(projectRoot, 'pom.xml'))) {
    info.type = 'java-maven';
  } else if (fs.existsSync(path.join(projectRoot, 'build.gradle'))) {
    info.type = 'java-gradle';
  }
  
  return info;
}

/**
 * Get a l
  - Type: freemium
- Rust project
    'pom.xml',         // Maven (Java) project
    'build.gradle',    // Gradle (Java) project
  ];
  
  // Walk up the directory tree until we find a project mar
  - Context: 
    'cargo.toml',      // Rust project
    'pom.xml',         // Maven (Java) project
    'build.gradle',    // Gradle (Java) project
  ];
  
  // Walk up the directory tree until we find a project mar
  - Type: ads
- Rust project
    'pom.xml',         // Maven (Java) project
    'build.gradle',    // Gradle (Java) project
  ];
  
  // Walk up the directory tree until we find a project marker or hit the
  - Context: l',      // Rust project
    'pom.xml',         // Maven (Java) project
    'build.gradle',    // Gradle (Java) project
  ];
  
  // Walk up the directory tree until we find a project marker or hit the 
  - Type: ads
- = 'node'; try { const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  - Context: ot, 'package.json'))) {
    info.type = 'node';
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
      if (packageJson.name) {
        inf
  - Type: ads
- (fs.existsSync(path.join(projectRoot, 'build.gradle'))) { info.type = 'java-gradle'; } return info; }
  - Context: .xml'))) {
    info.type = 'java-maven';
  } else if (fs.existsSync(path.join(projectRoot, 'build.gradle'))) {
    info.type = 'java-gradle';
  }
  
  return info;
}

/**
 * Get a list of changed files 
  - Type: ads
- * Get a list of changed files in the repository
  - Context: ven';
  } else if (fs.existsSync(path.join(projectRoot, 'build.gradle'))) {
    info.type = 'java-gradle';
  }
  
  return info;
}

/**
 * Get a list of changed files in the repository
 */
export functi
  - Type: ads
- * Get information about the detected project
  - Context: rtDir;
}

/**
 * Get information about the detected project
 */
export function getProjectInfo(projectRoot: string): {
  type: string;
  name: string;
  isGitRepo: boolean;
} {
  const info = {
    type:
  - Type: ads
- Detect project type
  - Context: tring;
  isGitRepo: boolean;
} {
  const info = {
    type: 'unknown',
    name: path.basename(projectRoot),
    isGitRepo: fs.existsSync(path.join(projectRoot, '.git'))
  };
  
  // Detect project type

  - Type: ads
- Detect project type
  if (fs.existsSync(path.join(projectRoot, 'package.j
  - Context:  type: 'unknown',
    name: path.basename(projectRoot),
    isGitRepo: fs.existsSync(path.join(projectRoot, '.git'))
  };
  
  // Detect project type
  if (fs.existsSync(path.join(projectRoot, 'package.j
  - Type: ads
- Detect project type
  if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
    info.type = 'node';
    try {
      const packageJson = JSON.parse(fs.r
  - Context: path.join(projectRoot, '.git'))
  };
  
  // Detect project type
  if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
    info.type = 'node';
    try {
      const packageJson = JSON.parse(fs.r
  - Type: ads
- try { const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')); if (packageJson.name)
  - Context:   info.type = 'node';
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
      if (packageJson.name) {
        info.name = packageJson.name;

  - Type: ads
- Ignore JSON parsing errors
    }
  } else if (fs.existsSync(path.join(projectRoot, 'cargo.toml'))) {
    info.type = 'rust';
  } else if (fs.existsSync(path.join(projectRoot, 'po
  - Context:   } catch (e) {
      // Ignore JSON parsing errors
    }
  } else if (fs.existsSync(path.join(projectRoot, 'cargo.toml'))) {
    info.type = 'rust';
  } else if (fs.existsSync(path.join(projectRoot, 'po
  - Type: ads
- = 'rust'; } else if (fs.existsSync(path.join(projectRoot, 'pom.xml'))) { info.type =
  - Context: in(projectRoot, 'cargo.toml'))) {
    info.type = 'rust';
  } else if (fs.existsSync(path.join(projectRoot, 'pom.xml'))) {
    info.type = 'java-maven';
  } else if (fs.existsSync(path.join(projectRoot, 
  - Type: ads
- else if (fs.existsSync(path.join(projectRoot, 'build.gradle'))) { info.type = 'java-gradle'; } return
  - Context: projectRoot, 'pom.xml'))) {
    info.type = 'java-maven';
  } else if (fs.existsSync(path.join(projectRoot, 'build.gradle'))) {
    info.type = 'java-gradle';
  }
  
  return info;
}

/**
 * Get a list o
  - Type: ads
- Try to parse as JSON for prettier formatting
    const data = JSON.parse(text);
    return formatJsonData(data);
  } catch (e) {
  - Context: ;
}

function formatTextContent(text: string): string {
  try {
    // Try to parse as JSON for prettier formatting
    const data = JSON.parse(text);
    return formatJsonData(data);
  } catch (e) {
    
  - Type: freemium
- if (content.type === 'text') { if (content._metadata?.format === 'mermaid') {
  - Context: or (const content of result.content) {
      if (content.type === 'text') {
        if (content._metadata?.format === 'mermaid') {
          output += chalk.magenta('>>> Mermaid Diagram <<<\n');
       
  - Type: ads
- Diagram <<<\n\n'); } else if (content._metadata?.format === 'dot') { output
  - Context:          output += chalk.magenta('>>> End Mermaid Diagram <<<\n\n');
        } else if (content._metadata?.format === 'dot') {
          output += chalk.magenta('>>> DOT Graph <<<\n');
          output 
  - Type: ads
- Handle different data types
  if (Array.isArray(data)) {
    if (data
  - Context: n text;
  }
}

function formatJsonData(data: any, indent = 0): string {
  let output = '';
  const pad = ' '.repeat(indent);
  
  // Handle different data types
  if (Array.isArray(data)) {
    if (data
  - Type: ads
- { output += `${pad}[]\n`; } else { for (let i
  - Context:  different data types
  if (Array.isArray(data)) {
    if (data.length === 0) {
      output += `${pad}[]\n`;
    } else {
      for (let i = 0; i < data.length; i++) {
        output += `${pad}${chalk.
  - Type: ads
- 0; i < data.length; i++) { output += `${pad}${chalk.gray(i)}: ${formatJsonData(data[i],
  - Context: t += `${pad}[]\n`;
    } else {
      for (let i = 0; i < data.length; i++) {
        output += `${pad}${chalk.gray(i)}: ${formatJsonData(data[i], indent + 2)}`;
      }
    }
  } else if (data !== null
  - Type: ads
- && value !== null) { output += `${pad}${chalk.cyan(key)}:\n`; output +=
  - Context: ect.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        output += `${pad}${chalk.cyan(key)}:\n`;
        output += formatJsonData(value, indent + 2);
      } else {
       
  - Type: ads
- 2); } else { output += `${pad}${chalk.cyan(key)}: ${formatValue(value)}\n`; } }
  - Context: ey)}:\n`;
        output += formatJsonData(value, indent + 2);
      } else {
        output += `${pad}${chalk.cyan(key)}: ${formatValue(value)}\n`;
      }
    }
  } else {
    output += `${formatValue
  - Type: ads
- Navigate to the proper nesting level
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (
  - Context: alysis.depth')
  const parts = key.split('.');
  let current: any = config;
  
  // Navigate to the proper nesting level
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (
  - Type: freemium
- * Load configuration from file
  - Context: ndencies: true,
    complexity: true
  },
  visualization: {
    format: 'mermaid'
  }
};

/**
 * Load configuration from file
 */
export function loadConfig(): typeof DEFAULT_CONFIG {
  try {
    if (!
  - Type: ads
- } const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')); return { ...DEFAULT_CONFIG, ...config
  - Context: istsSync(CONFIG_FILE)) {
      return DEFAULT_CONFIG;
    }
    
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
   
  - Type: ads
- * Save configuration to file
  - Context: tf8'));
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    console.error(`Error loading config: ${error}`);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save configuration to file
 */
expo
  - Type: ads
- true }); } const existingConfig = loadConfig(); const newConfig =
  - Context: IR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    
    const existingConfig = loadConfig();
    const newConfig = { ...existingConfig, ...config };
    
    fs.writeFileSync(CONFIG_F
  - Type: ads
- Handle nested keys (e.g., 'analysis.depth')
  const parts = key.split('.');
  let
  - Context:  value
 */
export function getConfigValue<T>(key: string, defaultValue?: T): T {
  const config = loadConfig();
  
  // Handle nested keys (e.g., 'analysis.depth')
  const parts = key.split('.');
  let 
  - Type: ads
- a standardized partial response for operations in progress * @param
  - Context:  ? { details } : {})
    }
  };
}

/**
 * Creates a standardized partial response for operations in progress
 * @param data The partial data to include
 * @param percentage Completion percentage (0-100)

  - Type: freemium
- percentage Completion percentage (0-100) * @param progressMessage Progress status message
  - Context: param data The partial data to include
 * @param percentage Completion percentage (0-100)
 * @param progressMessage Progress status message
 * @returns A standardized partial response
 */
export function
  - Type: freemium
- percentage (0-100) * @param progressMessage Progress status message * @returns
  - Context: artial data to include
 * @param percentage Completion percentage (0-100)
 * @param progressMessage Progress status message
 * @returns A standardized partial response
 */
export function createPartialRe
  - Type: freemium
- T, percentage?: number, progressMessage?: string ): { status: { success:
  - Context:  partial response
 */
export function createPartialResponse<T>(
  data: T,
  percentage?: number,
  progressMessage?: string
): {
  status: { success: true; partial: true; message?: string };
  data: T;

  - Type: freemium
- message?: string }; data: T; progress: { percentage?: number; message?:
  - Context: essMessage?: string
): {
  status: { success: true; partial: true; message?: string };
  data: T;
  progress: { percentage?: number; message?: string };
} {
  return {
    status: {
      success: true,

  - Type: freemium
- status: { success: true, partial: true, message: progressMessage || 'Operation
  - Context: e?: string };
} {
  return {
    status: {
      success: true,
      partial: true,
      message: progressMessage || 'Operation in progress'
    },
    data,
    progress: {
      percentage,
      mes
  - Type: freemium
- true, message: progressMessage || 'Operation in progress' }, data, progress:
  - Context: status: {
      success: true,
      partial: true,
      message: progressMessage || 'Operation in progress'
    },
    data,
    progress: {
      percentage,
      message: progressMessage
    }
  };

  - Type: freemium
- || 'Operation in progress' }, data, progress: { percentage, message:
  - Context:       partial: true,
      message: progressMessage || 'Operation in progress'
    },
    data,
    progress: {
      percentage,
      message: progressMessage
    }
  };
} 
  - Type: freemium
- 'Operation in progress' }, data, progress: { percentage, message: progressMessage
  - Context: essage || 'Operation in progress'
    },
    data,
    progress: {
      percentage,
      message: progressMessage
    }
  };
} 
  - Type: freemium
- for creating standardized API responses. */ /** * Creates a
  - Context: e utilities for MCP Code Analysis system.
 * This file contains functions for creating standardized API responses.
 */

/**
 * Creates a standardized success response
 * @param data The data to include in the res
  - Type: api
- The source identifier (optional) * @param metadata Additional metadata (optional)
  - Context:  The data to include in the response
 * @param source The source identifier (optional)
 * @param metadata Additional metadata (optional)
 * @returns A standardized success response
 */
export function c
  - Type: ads
- identifier (optional) * @param metadata Additional metadata (optional) * @returns
  - Context:  in the response
 * @param source The source identifier (optional)
 * @param metadata Additional metadata (optional)
 * @returns A standardized success response
 */
export function createSuccessResponse
  - Type: ads
- T, source?: string, metadata?: Record<string, any> ): { status: {
  - Context: d success response
 */
export function createSuccessResponse<T>(
  data: T,
  source?: string,
  metadata?: Record<string, any>
): {
  status: { success: true; message?: string };
  data: T;
  metadata?
  - Type: ads
- true; message?: string }; data: T; metadata?: Record<string, any>; }
  - Context:  metadata?: Record<string, any>
): {
  status: { success: true; message?: string };
  data: T;
  metadata?: Record<string, any>;
} {
  return {
    status: {
      success: true,
      message: 'Operati
  - Type: ads
- { metadata: { source, ...metadata } } : { metadata:
  - Context: 
      success: true,
      message: 'Operation completed successfully'
    },
    data,
    ...(metadata ? { metadata: { source, ...metadata } } : { metadata: { source } })
  };
}

/**
 * Creates a sta
  - Type: ads
- metadata: { source, ...metadata } } : { metadata: {
  - Context: s: true,
      message: 'Operation completed successfully'
    },
    data,
    ...(metadata ? { metadata: { source, ...metadata } } : { metadata: { source } })
  };
}

/**
 * Creates a standardized err
  - Type: ads
- ...metadata } } : { metadata: { source } })
  - Context:  'Operation completed successfully'
    },
    data,
    ...(metadata ? { metadata: { source, ...metadata } } : { metadata: { source } })
  };
}

/**
 * Creates a standardized error response
 * @param m
  - Type: ads
- } : { metadata: { source } }) }; }
  - Context: eted successfully'
    },
    data,
    ...(metadata ? { metadata: { source, ...metadata } } : { metadata: { source } })
  };
}

/**
 * Creates a standardized error response
 * @param message The error 
  - Type: ads
- error code or source * @param details Additional error details
  - Context: ponse
 * @param message The error message
 * @param code The error code or source
 * @param details Additional error details (optional)
 * @returns A standardized error response
 */
export function crea
  - Type: ads
- easier for AI to understand and process tool * results,
  - Context: e for AI agents to consume. Using a
 * standardized format makes it easier for AI to understand and process tool
 * results, regardless of which specific tool was called.
 *
 * Key features:
 * - Consist
  - Type: freemium
- the data field * * This type provides strong typing
  - Context: 
 * Type derived from the schema
 * Generic T represents the type of the data field
 *
 * This type provides strong typing for tool responses while allowing
 * different data types for different tools. I
  - Type: freemium
- tools. It inherits all properties * from the Zod schema
  - Context: ping for tool responses while allowing
 * different data types for different tools. It inherits all properties
 * from the Zod schema but allows specifying the concrete type for the data.
 *
 * @template
  - Type: freemium
- }; /** * Schema for basic code analysis result *
  - Context: ype ToolResponse<T = any> = z.infer<typeof ToolResponseSchema> & {
  data: T;
};

/**
 * Schema for basic code analysis result
 *
 * This schema defines the structure for basic code analysis results,
 * in
  - Type: freemium
- }; /** * Schema for basic code analysis result *
  - Context: ta: T;
};

/**
 * Schema for basic code analysis result
 *
 * This schema defines the structure for basic code analysis results,
 * including information about functions, classes, imports, and complexity.

  - Type: freemium
- = { * functions: ['renderComponent', 'fetchData', 'processResults'], * classes: ['DataService',
  - Context: escript
 * const analysis: CodeAnalysisResult = {
 *   functions: ['renderComponent', 'fetchData', 'processResults'],
 *   classes: ['DataService', 'UserComponent'],
 *   imports: ['react', 'axios', 'lod
  - Type: freemium
- - Consistent structure with data, metadata, and status sections *
  - Context: less of which specific tool was called.
 *
 * Key features:
 * - Consistent structure with data, metadata, and status sections
 * - Runtime validation using Zod schemas
 * - Type safety through TypeScri
  - Type: ads
- tool responses must adhere to. * It includes: * -
  - Context: all tool responses must follow
 *
 * This schema defines the structure that all tool responses must adhere to.
 * It includes:
 * - data: The actual response content (can be any valid JSON value)
 * - m
  - Type: ads
- (can be any valid JSON value) * - metadata: Information
  - Context: re to.
 * It includes:
 * - data: The actual response content (can be any valid JSON value)
 * - metadata: Information about the tool execution
 * - status: Success/error status and related information

  - Type: ads
- data: { fileCount: 42, lineCount: 1024 }, * metadata: {
  - Context: lid response structure
 * const response = {
 *   data: { fileCount: 42, lineCount: 1024 },
 *   metadata: {
 *     tool: 'repository-analysis',
 *     version: '1.0.0',
 *     executionTime: 350,
 *   
  - Type: ads
- - can be any valid JSON value"), metadata: z.object({ tool:
  - Context: 
  data: z
    .any()
    .describe("The actual response data - can be any valid JSON value"),
  metadata: z.object({
    tool: z.string().describe("Name of the tool that generated this response"),
    
  - Type: ads
- * maintainability: 85 * }, * metadata: { * tool:
  - Context:  data: {
 *     complexity: 15,
 *     linesOfCode: 250,
 *     maintainability: 85
 *   },
 *   metadata: {
 *     tool: 'code-metrics',
 *     version: '1.0.0',
 *     executionTime: 120,
 *     times
  - Type: ads
- "imports" | "calls" | "defines" | "extends" | "implements" |
  - Context: h
 */
export interface GraphRelationship {
  id: string;
  type: "imports" | "calls" | "defines" | "extends" | "implements" | "uses" | "contains" | "relates_to";
  sourceId: string;
  targetId: string;
  at
  - Type: subscription
- execution services */ export interface ToolExecution { initializeState(): Promise<void>; selectTool(tool:
  - Context: 
 * Interface for tool execution services
 */
export interface ToolExecution {
  initializeState(): Promise<void>;
  selectTool(tool: Tool): Promise<void>;
  setParameters(parameters: Record<string, unkn
  - Type: freemium
- interface ToolExecution { initializeState(): Promise<void>; selectTool(tool: Tool): Promise<void>; setParameters(parameters: Record<string,
  - Context: 
 */
export interface ToolExecution {
  initializeState(): Promise<void>;
  selectTool(tool: Tool): Promise<void>;
  setParameters(parameters: Record<string, unknown>): Promise<void>;
  execute(options?:
  - Type: freemium
- selectTool(tool: Tool): Promise<void>; setParameters(parameters: Record<string, unknown>): Promise<void>; execute(options?: ToolExecutionOptions): Promise<ToolExecutionResponse>;
  - Context: id>;
  selectTool(tool: Tool): Promise<void>;
  setParameters(parameters: Record<string, unknown>): Promise<void>;
  execute(options?: ToolExecutionOptions): Promise<ToolExecutionResponse>;
  cancel(): P
  - Type: freemium
- Record<string, unknown>): Promise<void>; execute(options?: ToolExecutionOptions): Promise<ToolExecutionResponse>; cancel(): Promise<void>; reset(): Promise<void>;
  - Context: ers(parameters: Record<string, unknown>): Promise<void>;
  execute(options?: ToolExecutionOptions): Promise<ToolExecutionResponse>;
  cancel(): Promise<void>;
  reset(): Promise<void>;
  dispose(): Promi
  - Type: freemium
- execute(options?: ToolExecutionOptions): Promise<ToolExecutionResponse>; cancel(): Promise<void>; reset(): Promise<void>; dispose(): Promise<void>; getContext():
  - Context: omise<void>;
  execute(options?: ToolExecutionOptions): Promise<ToolExecutionResponse>;
  cancel(): Promise<void>;
  reset(): Promise<void>;
  dispose(): Promise<void>;
  getContext(): ToolMachineContext
  - Type: freemium
- cancel(): Promise<void>; reset(): Promise<void>; dispose(): Promise<void>; getContext(): ToolMachineContext; } /**
  - Context: ions?: ToolExecutionOptions): Promise<ToolExecutionResponse>;
  cancel(): Promise<void>;
  reset(): Promise<void>;
  dispose(): Promise<void>;
  getContext(): ToolMachineContext;
}

/**
 * Context for th
  - Type: freemium
- Promise<void>; dispose(): Promise<void>; getContext(): ToolMachineContext; } /** * Context for
  - Context: : Promise<ToolExecutionResponse>;
  cancel(): Promise<void>;
  reset(): Promise<void>;
  dispose(): Promise<void>;
  getContext(): ToolMachineContext;
}

/**
 * Context for the tool execution state machi
  - Type: freemium
- Promise<void>; execute(options?: ToolExecutionOptions): Promise<ToolExecutionResponse>; cancel(): Promise<void>; reset(): Promise<void>; dispose(): Promise<void>;
  - Context: nown>): Promise<void>;
  execute(options?: ToolExecutionOptions): Promise<ToolExecutionResponse>;
  cancel(): Promise<void>;
  reset(): Promise<void>;
  dispose(): Promise<void>;
  getContext(): ToolMachine
  - Type: subscription
- interface ExecutionStatusEvent { type: 'EXECUTING' | 'COMPLETED' | 'FAILED' |
  - Context:  status
 */
export interface ExecutionStatusEvent {
  type: 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  payload?: any;
} 
  - Type: subscription
- * Event to select a tool
  - Context: 
  };
  data?: any;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  metadata?: Record<string, any>;
}

/**
 * Event to select a tool
 */
export interface ToolSelectEvent {
 
  - Type: ads
- { type: 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'; payload?:
  - Context: interface ExecutionStatusEvent {
  type: 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  payload?: any;
} 
  - Type: ads
- repositoryUrl: string; insightTypes?: string[]; tags?: string[]; relatedFile?: string; limit?: number;
  - Context:  {
  repositoryUrl: string;
  insightTypes?: string[];
  tags?: string[];
  relatedFile?: string;
  limit?: number;
} 
  - Type: freemium
- * Types of insights that can be stored in the memory system
  - Context: /**
 * Types of insights that can be stored in the memory system
 */
export type InsightType = 
  | "architectural-decision" 
  | "performance
  - Type: marketplace
- * Structure of an insight stored in the memory system
  - Context: iority"
  | "medium-priority"
  | "low-priority"
  | "information";

/**
 * Structure of an insight stored in the memory system
 */
export interface Insight {
  id?: number;
  repositoryUrl: string;
  insi
  - Type: marketplace
- * Types of insights that can be stored in the memory system
  - Context: /**
 * Types of insights that can be stored in the memory system
 */
export type InsightType = 
  | "architectural-decision"
  - Type: data
- * Categories for prioritizing insights
  - Context: "
  | "code-pattern"
  | "refactoring-opportunity"
  | "other";

/**
 * Categories for prioritizing insights
 */
export type InsightCategory =
  | "high-priority"
  | "medium-priority"
  | "low-priority"
  | 
  - Type: data
- * Query parameters for retrieving insights from memory
  - Context: Files?: string[];
  tags?: string[];
  timestamp: string;
}

/**
 * Query parameters for retrieving insights from memory
 */
export interface MemoryQuery {
  repositoryUrl: string;
  insightTypes?: string[];

  - Type: data
- module provides a factory function to start an MCP server
  - Context: /**
 * Server Initialization
 *
 * This module provides a factory function to start an MCP server with
 * automatic detection of storage backends. It 
  - Type: freemium
- not available. */ import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; import
  - Context: in-memory implementations when Redis is not available.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/std
  - Type: freemium
- "express"; import { registerAnalysisTools } from "../features/basic-analysis/index.js"; import { registerCodeMetricsTools
  - Context: /server/sse.js";
import express from "express";

import { registerAnalysisTools } from "../features/basic-analysis/index.js";
import { registerCodeMetricsTools } from "../features/code-metrics/index.js";
i
  - Type: freemium
- "../features/dependency-analysis/index.js"; import { registerIdeTools } from "../features/basic-analysis/ide-analyzer.js"; import { registerCodeQualityTools
  - Context: ls } from "../features/dependency-analysis/index.js";
import { registerIdeTools } from "../features/basic-analysis/ide-analyzer.js";
import { registerCodeQualityTools } from "../features/code-quality/index
  - Type: freemium
- configuration options * @returns A promise that resolves when the
  - Context:  back to in-memory implementations.
 *
 * @param options Server configuration options
 * @returns A promise that resolves when the server is ready
 */
export async function startServer(options: ServerOpt
  - Type: freemium
- async function startServer(options: ServerOptions = {}): Promise<{ server: McpServer; }>
  - Context: solves when the server is ready
 */
export async function startServer(options: ServerOptions = {}): Promise<{
  server: McpServer;
}> {
  const {
    name = "codeanalysis-mcp",
    version = "1.0.0",
   
  - Type: freemium
- = "codeanalysis-mcp", version = "1.0.0", useStdio = process.env.STDIO_TRANSPORT === "true",
  - Context: ver: McpServer;
}> {
  const {
    name = "codeanalysis-mcp",
    version = "1.0.0",
    useStdio = process.env.STDIO_TRANSPORT === "true",
    port = process.env.PORT ? parseInt(process.env.PORT, 10) : 
  - Type: freemium
- process.env.STDIO_TRANSPORT === "true", port = process.env.PORT ? parseInt(process.env.PORT, 10) :
  - Context: ysis-mcp",
    version = "1.0.0",
    useStdio = process.env.STDIO_TRANSPORT === "true",
    port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    redisUrl = process.env.REDIS_URL || "redi
  - Type: freemium
- localhost:6379",
    for
  - Context: 0.0",
    useStdio = process.env.STDIO_TRANSPORT === "true",
    port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    redisUrl = process.env.REDIS_URL || "redis://localhost:6379",
    for
  - Type: freemium
- localhost:6379",
    forceMemorySessionStore = process.env.FORCE_MEMO
  - Context: ORT === "true",
    port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    redisUrl = process.env.REDIS_URL || "redis://localhost:6379",
    forceMemorySessionStore = process.env.FORCE_MEMO
  - Type: freemium
- localhost:6379",
    forceMemorySessionStore = process.env.FORCE_MEMORY_SESSION === "true",
    useMemoryCache = true,
    verbose = false,
  } = opti
  - Context: 00,
    redisUrl = process.env.REDIS_URL || "redis://localhost:6379",
    forceMemorySessionStore = process.env.FORCE_MEMORY_SESSION === "true",
    useMemoryCache = true,
    verbose = false,
  } = opti
  - Type: freemium
- Add to tracking set
        registeredTools.add(id);

        // Call original method with properly typed arguments
        return (originalToolMethod as any)(id, ...(args as [any, any]));
  - Context:       // Add to tracking set
        registeredTools.add(id);

        // Call original method with properly typed arguments
        return (originalToolMethod as any)(id, ...(args as [any, any]));
     
  - Type: freemium
- Connect server using appropriate transport
  if (useStdio) {
    // For stdio transport
    if (verbose) {
      console.log("
  - Context: ning: Could not initialize Redis-backed services: ${error}`
    );
  }

  // Connect server using appropriate transport
  if (useStdio) {
    // For stdio transport
    if (verbose) {
      console.log("
  - Type: freemium
- Start the HTTP server
    await new Promise<void>((resolve) => {
      app.listen(port, () => {
        console.log(`✓ Server listening on
  - Context: rsion,
        transport: "HTTP+SSE",
      });
    });

    // Start the HTTP server
    await new Promise<void>((resolve) => {
      app.listen(port, () => {
        console.log(`✓ Server listening on 
  - Type: freemium
- * Force use of in-memory session store instead of Redis
  - Context: g., "redis://localhost:6379")
   */
  redisUrl?: string;

  /**
   * Force use of in-memory session store instead of Redis
   */
  forceMemorySessionStore?: boolean;

  /**
   * Enable memory caching layer
  - Type: marketplace
- localhost:6379",
    forceMemorySessionStore = process.env.FORCE_MEMORY_SESSION === "true",
    useMemoryCache = true,
    verbose = false,
  }
  - Context: 10) : 3000,
    redisUrl = process.env.REDIS_URL || "redis://localhost:6379",
    forceMemorySessionStore = process.env.FORCE_MEMORY_SESSION === "true",
    useMemoryCache = true,
    verbose = false,
  } 
  - Type: marketplace
- Register the tools
      registerFn(server);

      // Restore original method
      server.tool = originalToolMethod;

      if (verbose) {
        console.log(`
  - Context: .(args as [any, any]));
      };

      // Register the tools
      registerFn(server);

      // Restore original method
      server.tool = originalToolMethod;

      if (verbose) {
        console.log(`
  - Type: marketplace
- defaultTtl: 3600, useMemoryCache, forceMemorySessionStore, verbose, }); if (verbose) { console.log(`✓
  - Context: disUrl,
      prefix: "mcp:",
      defaultTtl: 3600,
      useMemoryCache,
      forceMemorySessionStore,
      verbose,
    });

    if (verbose) {
      console.log(`✓ Services initialized successfully`
  - Type: marketplace
- initialized successfully`); console.log( ` - Session store: ${services.sessionStore.constructor.name}` ); console.log(`
  - Context: {
      console.log(`✓ Services initialized successfully`);
      console.log(
        `  - Session store: ${services.sessionStore.constructor.name}`
      );
      console.log(`  - Cache store: ${services
  - Type: marketplace
- successfully`); console.log( ` - Session store: ${services.sessionStore.constructor.name}` ); console.log(` -
  - Context: rvices initialized successfully`);
      console.log(
        `  - Session store: ${services.sessionStore.constructor.name}`
      );
      console.log(`  - Cache store: ${services.cacheStore.constructor.n
  - Type: marketplace
- ${services.sessionStore.constructor.name}` ); console.log(` - Cache store: ${services.cacheStore.constructor.name}`); console.log( ` -
  - Context:   - Session store: ${services.sessionStore.constructor.name}`
      );
      console.log(`  - Cache store: ${services.cacheStore.constructor.name}`);
      console.log(
        `  - Tool execution service:
  - Type: marketplace
- console.log(` - Cache store: ${services.cacheStore.constructor.name}`); console.log( ` - Tool execution
  - Context: rvices.sessionStore.constructor.name}`
      );
      console.log(`  - Cache store: ${services.cacheStore.constructor.name}`);
      console.log(
        `  - Tool execution service: ${services.toolService
  - Type: marketplace
- * Server version
  - Context: : string;

  /**
   * Server version
   */
  version?: string;

  /**
   * Use stdio transport instead of HTTP+SSE
   */
  useStdio?: boolean;

  /**
   * HTTP port for server (when not using stdio)
   
  - Type: ads
- * Force use of in-memory session store instead of Redis
  - Context: //localhost:6379")
   */
  redisUrl?: string;

  /**
   * Force use of in-memory session store instead of Redis
   */
  forceMemorySessionStore?: boolean;

  /**
   * Enable memory caching layer (defaul
  - Type: ads
- promise that resolves when the server is ready */ export
  - Context: param options Server configuration options
 * @returns A promise that resolves when the server is ready
 */
export async function startServer(options: ServerOptions = {}): Promise<{
  server: McpServer;
  - Type: ads
- console.log( ` - Tool ${id} is already registered, skipping duplicate
  - Context: s.has(id)) {
          if (verbose) {
            console.log(
              `  - Tool ${id} is already registered, skipping duplicate registration`
            );
          }
          return this;
   
  - Type: ads
- Add to tracking set
        registeredTools.add(id);

        // Call original method with properly ty
  - Context: ing duplicate registration`
            );
          }
          return this;
        }

        // Add to tracking set
        registeredTools.add(id);

        // Call original method with properly ty
  - Type: ads
- Add to tracking set
        registeredTools.add(id);

        // Call original method with properly typed arguments
        return (originalToolMe
  - Context:          }
          return this;
        }

        // Add to tracking set
        registeredTools.add(id);

        // Call original method with properly typed arguments
        return (originalToolMe
  - Type: ads
- console.log("✓ Server connected and ready to handle stdio requests"); })
  - Context:  server
      .connect(transport)
      .then(() => {
        console.log("✓ Server connected and ready to handle stdio requests");
      })
      .catch((err) => {
        console.error("Failed to star
  - Type: ads
- Set up SSE endpoint for client connections
    app.get("/mcp", (req, res) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res
  - Context:    // Set up SSE endpoint for client connections
    app.get("/mcp", (req, res) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res
  - Type: ads
- (req, res) => { res.setHeader("Content-Type", "text/event-stream"); res.setHeader("Cache-Control", "no-cache"); res.setHeader("Connection", "keep-alive");
  - Context: et("/mcp", (req, res) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const trans
  - Type: ads
- "text/event-stream"); res.setHeader("Cache-Control", "no-cache"); res.setHeader("Connection", "keep-alive"); const transport = new SSEServerTransport("/messages",
  - Context: ntent-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const transport = new SSEServerTransport("/messages", res);


  - Type: ads
- ${port}`); console.log("✓ MCP server ready to handle HTTP requests"); resolve();
  - Context: => {
        console.log(`✓ Server listening on port ${port}`);
        console.log("✓ MCP server ready to handle HTTP requests");
        resolve();
      });
    });
  }

  return { server };
}

  - Type: ads
- { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; import { RedisToolExecutionService } from
  - Context: import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RedisToolExecutionService } from "../state/services/redisToolExec
  - Type: freemium
- server: McpServer, options: RedisBackedServicesOptions ): Promise<{ sessionStore: SessionStore; cacheStore: RedisCacheStore;
  - Context: function registerRedisBackedServices(
  server: McpServer,
  options: RedisBackedServicesOptions
): Promise<{
  sessionStore: SessionStore;
  cacheStore: RedisCacheStore;
  toolService: RedisToolExecutio
  - Type: freemium
- "../state/services/redisToolExecutionService.js"; import { RedisCacheStore } from "../state/store/redisCacheStore.js"; import { createSessionStore
  - Context: disToolExecutionService } from "../state/services/redisToolExecutionService.js";
import { RedisCacheStore } from "../state/store/redisCacheStore.js";
import { createSessionStore } from "../state/services/s
  - Type: marketplace
- RedisCacheStore } from "../state/store/redisCacheStore.js"; import { createSessionStore } from "../state/services/sessionStoreFactory.js";
  - Context: e/services/redisToolExecutionService.js";
import { RedisCacheStore } from "../state/store/redisCacheStore.js";
import { createSessionStore } from "../state/services/sessionStoreFactory.js";
import { Sessio
  - Type: marketplace
- } from "../state/store/redisCacheStore.js"; import { createSessionStore } from "../state/services/sessionStoreFactory.js"; import
  - Context: ice.js";
import { RedisCacheStore } from "../state/store/redisCacheStore.js";
import { createSessionStore } from "../state/services/sessionStoreFactory.js";
import { SessionStore } from "../state/services/
  - Type: marketplace
- { createSessionStore } from "../state/services/sessionStoreFactory.js"; import { SessionStore } from
  - Context: m "../state/store/redisCacheStore.js";
import { createSessionStore } from "../state/services/sessionStoreFactory.js";
import { SessionStore } from "../state/services/types.js";

export interface RedisBacke
  - Type: marketplace
- from "../state/services/sessionStoreFactory.js"; import { SessionStore } from "../state/services/types.js"; export interface
  - Context: js";
import { createSessionStore } from "../state/services/sessionStoreFactory.js";
import { SessionStore } from "../state/services/types.js";

export interface RedisBackedServicesOptions {
  /**
   * Redi
  - Type: marketplace
- * Force use of in-memory session store instead of Redis
  - Context: oolean;

  /**
   * Force use of in-memory session store instead of Redis
   */
  forceMemorySessionStore?: boolean;

  /**
   * Whether to show verbose logs
   */
  verbose?: boolean;
}

/**
 * Registers 
  - Type: marketplace
- sets up: * 1. Session store (Redis if available, otherwise
  - Context: sters storage and execution services with the MCP server
 *
 * This function sets up:
 * 1. Session store (Redis if available, otherwise in-memory)
 * 2. Redis cache store for performance optimization
 * 3
  - Type: marketplace
- options: RedisBackedServicesOptions ): Promise<{ sessionStore: SessionStore; cacheStore: RedisCacheStore; toolService: RedisToolExecutionService;
  - Context: disBackedServices(
  server: McpServer,
  options: RedisBackedServicesOptions
): Promise<{
  sessionStore: SessionStore;
  cacheStore: RedisCacheStore;
  toolService: RedisToolExecutionService;
}> {
  if (
  - Type: marketplace
- ): Promise<{ sessionStore: SessionStore; cacheStore: RedisCacheStore; toolService: RedisToolExecutionService; }> {
  - Context:  McpServer,
  options: RedisBackedServicesOptions
): Promise<{
  sessionStore: SessionStore;
  cacheStore: RedisCacheStore;
  toolService: RedisToolExecutionService;
}> {
  if (options.verbose) {
    conso
  - Type: marketplace
- Promise<{ sessionStore: SessionStore; cacheStore: RedisCacheStore; toolService: RedisToolExecutionService; }> { if
  - Context: ions: RedisBackedServicesOptions
): Promise<{
  sessionStore: SessionStore;
  cacheStore: RedisCacheStore;
  toolService: RedisToolExecutionService;
}> {
  if (options.verbose) {
    console.log("Registeri
  - Type: marketplace
- Create session store with auto-detection of backends
  const sessionStore = await createSessionStore({
    redisUrl: opt
  - Context: e and execution services...");
  }

  const prefix = options.prefix || "mcp:";

  // Create session store with auto-detection of backends
  const sessionStore = await createSessionStore({
    redisUrl: opt
  - Type: marketplace
- Create session store with auto-detection of backends
  const sessionStore = await createSessionStore({
    redisUrl: options.redisUrl,
    prefix: `${prefix}session:`,
    d
  - Context: options.prefix || "mcp:";

  // Create session store with auto-detection of backends
  const sessionStore = await createSessionStore({
    redisUrl: options.redisUrl,
    prefix: `${prefix}session:`,
    d
  - Type: marketplace
- Create session store with auto-detection of backends
  const sessionStore = await createSessionStore({
    redisUrl: options.redisUrl,
    prefix: `${prefix}session:`,
    defaultTtl: options.defaultT
  - Context:   // Create session store with auto-detection of backends
  const sessionStore = await createSessionStore({
    redisUrl: options.redisUrl,
    prefix: `${prefix}session:`,
    defaultTtl: options.defaultT
  - Type: marketplace
- Create Redis cache store
  const cacheStore = new RedisC
  - Context: }session:`,
    defaultTtl: options.defaultTtl || 3600,
    preferMemory: options.forceMemorySessionStore,
    verbose: options.verbose,
  });

  // Create Redis cache store
  const cacheStore = new RedisC
  - Type: marketplace
- Create Redis cache store
  const cacheStore = new RedisCacheStore({
    redisUrl: options.redisUrl,
    prefix: `${prefix}ca
  - Context: mory: options.forceMemorySessionStore,
    verbose: options.verbose,
  });

  // Create Redis cache store
  const cacheStore = new RedisCacheStore({
    redisUrl: options.redisUrl,
    prefix: `${prefix}ca
  - Type: marketplace
- Create Redis cache store
  const cacheStore = new RedisCacheStore({
    redisUrl: options.redisUrl,
    prefix: `${prefix}cache:`,
    defaultT
  - Context: MemorySessionStore,
    verbose: options.verbose,
  });

  // Create Redis cache store
  const cacheStore = new RedisCacheStore({
    redisUrl: options.redisUrl,
    prefix: `${prefix}cache:`,
    defaultT
  - Type: marketplace
- Create Redis cache store
  const cacheStore = new RedisCacheStore({
    redisUrl: options.redisUrl,
    prefix: `${prefix}cache:`,
    defaultTtl: options.defaultTtl
  - Context:   verbose: options.verbose,
  });

  // Create Redis cache store
  const cacheStore = new RedisCacheStore({
    redisUrl: options.redisUrl,
    prefix: `${prefix}cache:`,
    defaultTtl: options.defaultTtl
  - Type: marketplace
- Empty tools map
    serviceId: `mcp-service-${Date.now()}`,
  });

  // Attempt to set session store on server (using type assertion for compatibility)
  try {
    const serverAny = server as any;
  - Context: , // Empty tools map
    serviceId: `mcp-service-${Date.now()}`,
  });

  // Attempt to set session store on server (using type assertion for compatibility)
  try {
    const serverAny = server as any;
   
  - Type: marketplace
- serverAny = server as any; if (typeof serverAny.setSessionStore === "function")
  - Context:  for compatibility)
  try {
    const serverAny = server as any;
    if (typeof serverAny.setSessionStore === "function") {
      serverAny.setSessionStore(sessionStore);
      if (options.verbose) {
     
  - Type: marketplace
- (typeof serverAny.setSessionStore === "function") { serverAny.setSessionStore(sessionStore); if (options.verbose) { console.log("Session
  - Context: server as any;
    if (typeof serverAny.setSessionStore === "function") {
      serverAny.setSessionStore(sessionStore);
      if (options.verbose) {
        console.log("Session store registered with serv
  - Type: marketplace
- serverAny.setSessionStore === "function") { serverAny.setSessionStore(sessionStore); if (options.verbose) { console.log("Session store
  - Context: ;
    if (typeof serverAny.setSessionStore === "function") {
      serverAny.setSessionStore(sessionStore);
      if (options.verbose) {
        console.log("Session store registered with server");
      }
  - Type: marketplace
- serverAny.setSessionStore(sessionStore); if (options.verbose) { console.log("Session store registered with server"); }
  - Context:  serverAny.setSessionStore(sessionStore);
      if (options.verbose) {
        console.log("Session store registered with server");
      }
    } else {
      console.warn(
        "Server does not support
  - Type: marketplace
- "Server does not support setSessionStore method - using alternative session
  - Context:  with server");
      }
    } else {
      console.warn(
        "Server does not support setSessionStore method - using alternative session management"
      );
    }
  } catch (error) {
    console.warn(
  - Type: marketplace
- (error) { console.warn(`Could not set session store: ${error}`); } if
  - Context: tive session management"
      );
    }
  } catch (error) {
    console.warn(`Could not set session store: ${error}`);
  }

  if (options.verbose) {
    console.log("Storage and execution services register
  - Type: marketplace
- execution services registered successfully"); } return { sessionStore, cacheStore, toolService,
  - Context:   console.log("Storage and execution services registered successfully");
  }

  return {
    sessionStore,
    cacheStore,
    toolService,
  };
}

  - Type: marketplace
- * Manager for tool registration and discovery
  - Context: state (optional)
   * @returns Tool execution result
   */
  execute(params: P, state?: ToolState): Promise<ToolResult<R>>;
}

/**
 * Manager for tool registration and discovery
 */
export interface Tool
  - Type: freemium
- * Unique ID for the tool
  - Context:  Tool<P = any, R = any> {
  /**
   * Unique ID for the tool
   */
  id: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Tool description
   */
  description: string;

  /**
   
  - Type: ads
- fs } from "fs"; import path from "path"; import {
  - Context: import { promises as fs } from "fs";
import path from "path";
import { Tool, ToolResult } from "../interfaces";

  - Type: freemium
- * File language/type based on extension
  - Context: ber;
  }[];

  /**
   * File language/type based on extension
   */
  fileType: string;

  /**
   * Basic complexity metrics
   */
  complexity: {
    /**
     * Average line length
     */
    avgLineLeng
  - Type: freemium
- - Size analysis * - Basic complexity estimation * -
  - Context: le metrics
 *
 * Features:
 * - Line counting (total, code, comment, blank)
 * - Size analysis
 * - Basic complexity estimation
 * - Language detection
 * - Detailed line-by-line metrics
 */
export const f
  - Type: freemium
- Initialize state if not exists
      if (!s
  - Context: State: true,

  async execute(
    params: FileMetricsParams,
    state: FileMetricsState = {}
  ): Promise<ToolResult<FileMetricsResult>> {
    try {
      // Initialize state if not exists
      if (!s
  - Type: freemium
- Load file content if not provided
      let content: string;
      if (fileContent) {
        content = fileContent;
      } els
  - Context: esult: cachedResult.metrics,
          state,
        };
      }

      // Load file content if not provided
      let content: string;
      if (fileContent) {
        content = fileContent;
      } els
  - Type: freemium
- Process the file content
      const lines = content.split(/\r?\n/);
      const sizeBytes = Buffer.fro
  - Context: .extname(filePath).toLowerCase().slice(1);
      const fileType = getFileType(extension);

      // Process the file content
      const lines = content.split(/\r?\n/);
      const sizeBytes = Buffer.fro
  - Type: freemium
- * State for the file metrics analyzer tool
  - Context: pth: number;
  };
}

/**
 * State for the file metrics analyzer tool
 */
interface FileMetricsState extends ToolState {
  /**
   * Cache of recently analyzed files
   */
  fileCache?: Map<
    string,
    {
  - Type: subscription
- * File path to analyze
  - Context:   /**
   * File path to analyze
   */
  filePath: string;

  /**
   * Optional file content (if already loaded)
   */
  fileContent?: string;

  /**
   * Whether to include detailed line metrics
   */
 
  - Type: ads
- * Optional file content (if already loaded)
  - Context:    * File path to analyze
   */
  filePath: string;

  /**
   * Optional file content (if already loaded)
   */
  fileContent?: string;

  /**
   * Whether to include detailed line metrics
   */
  inclu
  - Type: ads
- Load file content if not provided
      let content: string;
      if (fileContent) {
        content =
  - Context:    return {
          result: cachedResult.metrics,
          state,
        };
      }

      // Load file content if not provided
      let content: string;
      if (fileContent) {
        content = 
  - Type: ads
- { try { content = await fs.readFile(filePath, "utf-8"); } catch
  - Context: ntent) {
        content = fileContent;
      } else {
        try {
          content = await fs.readFile(filePath, "utf-8");
        } catch (error: any) {
          return {
            result: null 
  - Type: ads
- unknown as FileMetricsResult, error: `Failed to read file: ${error?.message ||
  - Context:  return {
            result: null as unknown as FileMetricsResult,
            error: `Failed to read file: ${error?.message || String(error)}`,
            state,
          };
        }
      }

     
  - Type: ads
- Add to detailed metrics if requested
        if (includeLineMetrics && lineMetrics) {
          lineMe
  - Context: e line
        else {
          codeLineCount++;
          lineType = "code";
        }

        // Add to detailed metrics if requested
        if (includeLineMetrics && lineMetrics) {
          lineMe
  - Type: ads
- * This module provides a state machine implementation for tool
  - Context: /**
 * Tool Execution State Machine for MCP SDK Integration
 *
 * This module provides a state machine implementation for tool execution flow used by
 * the MCP SDK tools. It define
  - Type: freemium
- handling and recovery * - Result processing and history tracking
  - Context: ion
 * - Tool selection
 * - Execution flow management
 * - Error handling and recovery
 * - Result processing and history tracking
 *
 * This state machine is used by the statefulTool helper to provide 
  - Type: freemium
- used by the statefulTool helper to provide state persistence *
  - Context: sult processing and history tracking
 *
 * This state machine is used by the statefulTool helper to provide state persistence
 * across multiple tool invocations.
 *
 * @module toolMachine
 */

import { 
  - Type: freemium
- session IDs * * Provides a list of all active
  - Context: lean {
  return clearSessionFromStatefulTool(sessionId);
}

/**
 * Get all active session IDs
 *
 * Provides a list of all active session IDs.
 * This function delegates to the implementation in stateful
  - Type: freemium
- Define the context shape for the state machine
export interface ToolMachineContext {
  - Context: ng:
 *
 * - Parameter validation
 * - Tool selection
 * - Execution
 * - Error handling
 * - Result processing
 */

// Define the context shape for the state machine
export interface ToolMachineContext {
  - Type: freemium
- instance with the provided * session ID, or a generated
  - Context: tool execution service
 *
 * Helper function to create a new ToolExecutionService instance with the provided
 * session ID, or a generated one if not provided. The service will be stored in
 * the sessio
  - Type: freemium
- a generated one if not provided. The service will be
  - Context: eate a new ToolExecutionService instance with the provided
 * session ID, or a generated one if not provided. The service will be stored in
 * the sessions map for future retrieval using the statefulTool
  - Type: freemium
- Error } | { type: "CANCEL" } | { type:
  - Context: TE" }
  | { type: "RECEIVED_RESULT"; result: any }
  | { type: "ERROR"; error: Error }
  | { type: "CANCEL" }
  | { type: "RESET" };

/**
 * Tool execution state machine
 *
 * This machine defines the state
  - Type: subscription
- "failed", actions: "setError", }, CANCEL: "cancelled", }, }, succeeded: {
  - Context:   },
        ERROR: {
          target: "failed",
          actions: "setError",
        },
        CANCEL: "cancelled",
      },
    },
    succeeded: {
      on: {
        SELECT_TOOL: {
          target:
  - Type: subscription
- actions: "setError", }, CANCEL: "cancelled", }, }, succeeded: { on:
  - Context:     ERROR: {
          target: "failed",
          actions: "setError",
        },
        CANCEL: "cancelled",
      },
    },
    succeeded: {
      on: {
        SELECT_TOOL: {
          target: "toolSel
  - Type: subscription
- actions: "resetState", }, }, }, cancelled: { on: { SELECT_TOOL:
  - Context:  RESET: {
          target: "idle",
          actions: "resetState",
        },
      },
    },
    cancelled: {
      on: {
        SELECT_TOOL: {
          target: "toolSelected",
          actions: "setT
  - Type: subscription
- not provided. The service will be stored in * the
  - Context: e instance with the provided
 * session ID, or a generated one if not provided. The service will be stored in
 * the sessions map for future retrieval using the statefulTool storage.
 *
 * @param sessionId
  - Type: marketplace
- parametersSet: Parameters have been set, ready for execution * 4.
  - Context:  Tool has been selected but parameters not yet set
 * 3. parametersSet: Parameters have been set, ready for execution
 * 4. executing: Tool is currently executing
 * 5. succeeded: Tool execution succeed
  - Type: ads
- as JavaScript's setTimeout doesn't provide access to the remaining time
    // This is a limitation of the memory implementation
    const key = this.getSessionKey(sessionId);
    return this.se
  - Context: ion
    // as JavaScript's setTimeout doesn't provide access to the remaining time
    // This is a limitation of the memory implementation
    const key = this.getSessionKey(sessionId);
    return this.se
  - Type: freemium
- * * This module provides a memory-based storage implementation for
  - Context: /**
 * In-Memory Session Store for MCP SDK Tools
 *
 * This module provides a memory-based storage implementation for MCP SDK tool sessions.
 * It's intended for developm
  - Type: freemium
- * NOT RECOMMENDED FOR PRODUCTION USE due to lack of
  - Context: ended for development and testing environments where Redis is not available.
 * NOT RECOMMENDED FOR PRODUCTION USE due to lack of persistence across server restarts
 * and inability to share sessions acr
  - Type: freemium
- session store implementation * * Provides non-persistent storage of tool
  - Context: efault: 30000)
   */
  lockTimeout?: number;
}

/**
 * In-memory session store implementation
 *
 * Provides non-persistent storage of tool sessions using JavaScript Map,
 * with support for TTL manageme
  - Type: freemium
- TTL management, and locking. Not suitable for production * use
  - Context: ol sessions using JavaScript Map,
 * with support for TTL management, and locking. Not suitable for production
 * use or distributed environments.
 */
export class MemorySessionStore implements SessionSt
  - Type: freemium
- * Get session data by ID
   *
   * @param sessionId Unique session identifier
   * @returns Promise resolving to session data or null if not found
   * @throws Error if operation fails
  - Context:  /**
   * Get session data by ID
   *
   * @param sessionId Unique session identifier
   * @returns Promise resolving to session data or null if not found
   * @throws Error if operation fails
   */
  as
  - Type: freemium
- getSession<T = SessionData>(sessionId: string): Promise<T | null> { try {
  - Context:    * @throws Error if operation fails
   */
  async getSession<T = SessionData>(sessionId: string): Promise<T | null> {
    try {
      const key = this.getSessionKey(sessionId);
      const data = this.
  - Type: freemium
- data: T, ttl?: number ): Promise<void> { try { const
  - Context:   */
  async setSession<T = SessionData>(
    sessionId: string,
    data: T,
    ttl?: number
  ): Promise<void> {
    try {
      const key = this.getSessionKey(sessionId);
      const sessionTtl = ttl
  - Type: freemium
- if operation fails */ async clearSession(sessionId: string): Promise<void> { try
  - Context: ion identifier
   * @throws Error if operation fails
   */
  async clearSession(sessionId: string): Promise<void> {
    try {
      const key = this.getSessionKey(sessionId);
      this.clearSessionTimeo
  - Type: freemium
- * List all active session IDs
   *
   * @returns Promise resolving to array of session IDs
  - Context: tring(err)
        }`
      );
    }
  }

  /**
   * List all active session IDs
   *
   * @returns Promise resolving to array of session IDs
   */
  async getSessions(): Promise<string[]> {
    try {
  
  - Type: freemium
- to array of session IDs */ async getSessions(): Promise<string[]> {
  - Context: ssion IDs
   *
   * @returns Promise resolving to array of session IDs
   */
  async getSessions(): Promise<string[]> {
    try {
      const prefixLength = this.prefix.length;
      return Array.from(th
  - Type: freemium
- timeout in milliseconds * @returns Promise resolving to a lock
  - Context:  sessionId Unique session identifier
   * @param timeout Lock timeout in milliseconds
   * @returns Promise resolving to a lock token if successful, null otherwise
   */
  async acquireLock(
    sessionI
  - Type: freemium
- sessionId: string, timeout?: number ): Promise<string | null> { const
  - Context: cessful, null otherwise
   */
  async acquireLock(
    sessionId: string,
    timeout?: number
  ): Promise<string | null> {
    const lockKey = this.getLockKey(sessionId);
    const lockTimeoutMs = time
  - Type: freemium
- token from acquireLock * @returns Promise resolving to true if
  - Context: ram sessionId Unique session identifier
   * @param token Lock token from acquireLock
   * @returns Promise resolving to true if successful, false if token didn't match
   */
  async releaseLock(sessionI
  - Type: freemium
- */ async releaseLock(sessionId: string, token: string): Promise<boolean> { const lockKey
  - Context: uccessful, false if token didn't match
   */
  async releaseLock(sessionId: string, token: string): Promise<boolean> {
    const lockKey = this.getLockKey(sessionId);
    const lock = this.locks.get(lock
  - Type: freemium
- New TTL in seconds * @returns Promise resolving to true
  - Context:  *
   * @param sessionId Unique session identifier
   * @param ttl New TTL in seconds
   * @returns Promise resolving to true if successful, false if session does not exist
   */
  async extendSessionTtl
  - Type: freemium
- exist */ async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean> { const
  - Context: ul, false if session does not exist
   */
  async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean> {
    const key = this.getSessionKey(sessionId);

    if (!this.sessions.has(key)) {
 
  - Type: freemium
- sessionId Unique session identifier * @returns Promise resolving to TTL
  - Context: t the remaining TTL of a session
   *
   * @param sessionId Unique session identifier
   * @returns Promise resolving to TTL in seconds, or null if session doesn't exist
   */
  async getSessionTtl(sessi
  - Type: freemium
- We can't actually determine the exact TTL in the memory implementation
  - Context: to TTL in seconds, or null if session doesn't exist
   */
  async getSessionTtl(sessionId: string): Promise<number | null> {
    // We can't actually determine the exact TTL in the memory implementation

  - Type: freemium
- as JavaScript's setTimeout doesn't provide access to the remaining time
    // This is a limitation of the memory implementation
    const
  - Context: ally determine the exact TTL in the memory implementation
    // as JavaScript's setTimeout doesn't provide access to the remaining time
    // This is a limitation of the memory implementation
    const
  - Type: freemium
- if session doesn't exist * @returns Promise resolving to existing
  - Context: ion identifier
   * @param initialState Initial state to set if session doesn't exist
   * @returns Promise resolving to existing or newly created session data
   */
  async createSessionIfNotExists<T = 
  - Type: freemium
- sessionId: string, initialState: T ): Promise<T> { const existingSession =
  - Context: 
  async createSessionIfNotExists<T = SessionData>(
    sessionId: string,
    initialState: T
  ): Promise<T> {
    const existingSession = await this.getSession<T>(sessionId);

    if (existingSession)
  - Type: freemium
- No-op for memory implementation
  }

  /**
   * Get the internal key for a sessi
  - Context:  * No-op for memory implementation since there's no connection to close
   */
  async disconnect(): Promise<void> {
    // No-op for memory implementation
  }

  /**
   * Get the internal key for a sessi
  - Type: freemium
- return true; } /** * Extend the TTL of a
  - Context: k
    clearTimeout(lock.timeout);
    this.locks.delete(lockKey);

    return true;
  }

  /**
   * Extend the TTL of a session
   *
   * @param sessionId Unique session identifier
   * @param ttl New TTL i
  - Type: subscription
- false if session does not exist */ async extendSessionTtl(sessionId: string,
  - Context:   * @returns Promise resolving to true if successful, false if session does not exist
   */
  async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean> {
    const key = this.getSessionKey(se
  - Type: subscription
- /** * In-Memory Session Store for MCP SDK Tools
  - Context: /**
 * In-Memory Session Store for MCP SDK Tools
 *
 * This module provides a memory-based storage implementation for MCP SDK tool
  - Type: marketplace
- * * The memory session store handles: * - Session
  - Context: tarts
 * and inability to share sessions across multiple server instances.
 *
 * The memory session store handles:
 * - Session data storage in a Map
 * - TTL-based session management via setTimeout
 * - S
  - Type: marketplace
- operations * * @module memorySessionStore */ import { SessionData, SessionStore
  - Context: t via setTimeout
 * - Simple locking mechanism for concurrent operations
 *
 * @module memorySessionStore
 */

import { SessionData, SessionStore } from "./types.js";
import { v4 as uuidv4 } from "uuid";


  - Type: marketplace
- * Memory Session Store Options
  - Context: hanism for concurrent operations
 *
 * @module memorySessionStore
 */

import { SessionData, SessionStore } from "./types.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Memory Session Store Options
 */

  - Type: marketplace
- } /** * In-memory session store implementation * * Provides
  - Context:  timeout in milliseconds (default: 30000)
   */
  lockTimeout?: number;
}

/**
 * In-memory session store implementation
 *
 * Provides non-persistent storage of tool sessions using JavaScript Map,
 * with
  - Type: marketplace
- distributed environments. */ export class MemorySessionStore implements SessionStore { private
  - Context: king. Not suitable for production
 * use or distributed environments.
 */
export class MemorySessionStore implements SessionStore {
  private readonly sessions: Map<string, any> = new Map();
  private read
  - Type: marketplace
- class MemorySessionStore implements SessionStore { private readonly sessions: Map<string, any>
  - Context: roduction
 * use or distributed environments.
 */
export class MemorySessionStore implements SessionStore {
  private readonly sessions: Map<string, any> = new Map();
  private readonly locks: Map<
    str
  - Type: marketplace
- * Create a new memory session store
   *
   * @param options Memory session store options
  - Context: defaultTtl: number;
  private readonly lockTimeout: number;

  /**
   * Create a new memory session store
   *
   * @param options Memory session store options
   */
  constructor(options: MemorySessionSto
  - Type: marketplace
- options */ constructor(options: MemorySessionStoreOptions = {}) { const { prefix
  - Context: ore
   *
   * @param options Memory session store options
   */
  constructor(options: MemorySessionStoreOptions = {}) {
    const {
      prefix = "memory:",
      defaultTtl = 3600,
      lockTimeout = 3
  - Type: marketplace
- @param data Session data to store * @param ttl Optional
  - Context:  session data
   *
   * @param sessionId Unique session identifier
   * @param data Session data to store
   * @param ttl Optional TTL override (in seconds)
   * @throws Error if operation fails
   */
  as
  - Type: marketplace
- Clear any existing timeout
      this.clearSessionTimeout(sessionId);

      // Store the session data
      this.sessions.set(key, data);

      // Set TTL timeout if not infinite
  - Context: faultTtl;

      // Clear any existing timeout
      this.clearSessionTimeout(sessionId);

      // Store the session data
      this.sessions.set(key, data);

      // Set TTL timeout if not infinite
    
  - Type: marketplace
- Store the lock
    this.locks.set(lockKey, { token, timeout: timeoutHandle });

    return token;
  }
  - Context: timeoutHandle = setTimeout(() => {
      this.locks.delete(lockKey);
    }, lockTimeoutMs);

    // Store the lock
    this.locks.set(lockKey, { token, timeout: timeoutHandle });

    return token;
  }

  
  - Type: marketplace
- * Disconnect from the store
   * No-op for memory implementation since there's no connection to close
  - Context: s.setSession(sessionId, initialState);
    return initialState;
  }

  /**
   * Disconnect from the store
   * No-op for memory implementation since there's no connection to close
   */
  async disconnect(
  - Type: marketplace
- * NOT RECOMMENDED FOR PRODUCTION USE due to lack of
  - Context: ended for development and testing environments where Redis is not available.
 * NOT RECOMMENDED FOR PRODUCTION USE due to lack of persistence across server restarts
 * and inability to share sessions across 
  - Type: marketplace
- TTL management, and locking. Not suitable for production * use
  - Context: ol sessions using JavaScript Map,
 * with support for TTL management, and locking. Not suitable for production
 * use or distributed environments.
 */
export class MemorySessionStore implements SessionStore 
  - Type: marketplace
- } catch (err) { console.error("Error listing sessions:", err); return [];
  - Context: key) =>
        key.substring(prefixLength)
      );
    } catch (err) {
      console.error("Error listing sessions:", err);
      return [];
    }
  }

  /**
   * Acquire a lock on a session
   *
   * @par
  - Type: marketplace
- SessionStore { private readonly sessions: Map<string, any> = new Map();
  - Context: distributed environments.
 */
export class MemorySessionStore implements SessionStore {
  private readonly sessions: Map<string, any> = new Map();
  private readonly locks: Map<
    string,
    { token:
  - Type: ads
- = new Map(); private readonly locks: Map< string, { token:
  - Context: re implements SessionStore {
  private readonly sessions: Map<string, any> = new Map();
  private readonly locks: Map<
    string,
    { token: string; timeout: NodeJS.Timeout }
  > = new Map();
  priva
  - Type: ads
- } > = new Map(); private readonly timeouts: Map<string, NodeJS.Timeout>
  - Context: locks: Map<
    string,
    { token: string; timeout: NodeJS.Timeout }
  > = new Map();
  private readonly timeouts: Map<string, NodeJS.Timeout> = new Map();
  private readonly prefix: string;
  private
  - Type: ads
- Map<string, NodeJS.Timeout> = new Map(); private readonly prefix: string; private
  - Context: 
  > = new Map();
  private readonly timeouts: Map<string, NodeJS.Timeout> = new Map();
  private readonly prefix: string;
  private readonly defaultTtl: number;
  private readonly lockTimeout: number;

  - Type: ads
- readonly prefix: string; private readonly defaultTtl: number; private readonly lockTimeout:
  - Context: y timeouts: Map<string, NodeJS.Timeout> = new Map();
  private readonly prefix: string;
  private readonly defaultTtl: number;
  private readonly lockTimeout: number;

  /**
   * Create a new memory ses
  - Type: ads
- defaultTtl: number; private readonly lockTimeout: number; /** * Create a
  - Context:  = new Map();
  private readonly prefix: string;
  private readonly defaultTtl: number;
  private readonly lockTimeout: number;

  /**
   * Create a new memory session store
   *
   * @param options Mem
  - Type: ads
- If lock already exists, return null
    if (this.locks.has(lockKey)) {
      return null;
    }

    // Create a n
  - Context: s.getLockKey(sessionId);
    const lockTimeoutMs = timeout || this.lockTimeout;

    // If lock already exists, return null
    if (this.locks.has(lockKey)) {
      return null;
    }

    // Create a n
  - Type: ads
- handles: * - Session data storage in a Map *
  - Context: are sessions across multiple server instances.
 *
 * The memory session store handles:
 * - Session data storage in a Map
 * - TTL-based session management via setTimeout
 * - Simple locking mechanism for concurr
  - Type: data
- * This module provides shared type definitions for the MCP
  - Context: /**
 * Type Definitions for MCP SDK State Management
 *
 * This module provides shared type definitions for the MCP SDK state management system.
 * It defines the core interf
  - Type: freemium
- functionality of the MCP SDK, providing * a foundation for
  - Context: anagement infrastructure.
 *
 * These types support the stateful tool functionality of the MCP SDK, providing
 * a foundation for building persistent, distributed, and resilient tool execution.
 *
 * @mo
  - Type: freemium
- * Get session data by ID
   *
   * @param sessionId Unique session identifier
   * @returns Promise resolving to session data or null if not found
  - Context:  /**
   * Get session data by ID
   *
   * @param sessionId Unique session identifier
   * @returns Promise resolving to session data or null if not found
   */
  getSession<T = SessionData>(sessionId: s
  - Type: freemium
- */ getSession<T = SessionData>(sessionId: string): Promise<T | null>; /** *
  - Context: olving to session data or null if not found
   */
  getSession<T = SessionData>(sessionId: string): Promise<T | null>;

  /**
   * Set session data
   *
   * @param sessionId Unique session identifier
  
  - Type: freemium
- T, ttl?: number ): Promise<void>; /** * Clear a session
  - Context: nds)
   */
  setSession<T = SessionData>(
    sessionId: string,
    data: T,
    ttl?: number
  ): Promise<void>;

  /**
   * Clear a session by ID
   *
   * @param sessionId Unique session identifier
 
  - Type: freemium
- */ clearSession(sessionId: string): Promise<void>; /** * List all active session
  - Context: by ID
   *
   * @param sessionId Unique session identifier
   */
  clearSession(sessionId: string): Promise<void>;

  /**
   * List all active session IDs
   *
   * @returns Promise resolving to array of
  - Type: freemium
- * List all active session IDs
   *
   * @returns Promise resolving to array of session IDs
  - Context: ssion(sessionId: string): Promise<void>;

  /**
   * List all active session IDs
   *
   * @returns Promise resolving to array of session IDs
   */
  getSessions(): Promise<string[]>;

  /**
   * Acquire
  - Type: freemium
- of session IDs */ getSessions(): Promise<string[]>; /** * Acquire a
  - Context: ive session IDs
   *
   * @returns Promise resolving to array of session IDs
   */
  getSessions(): Promise<string[]>;

  /**
   * Acquire a lock on a session
   *
   * @param sessionId Unique session id
  - Type: freemium
- timeout in milliseconds * @returns Promise resolving to a lock
  - Context:  sessionId Unique session identifier
   * @param timeout Lock timeout in milliseconds
   * @returns Promise resolving to a lock token if successful, null otherwise
   */
  acquireLock(sessionId: string, 
  - Type: freemium
- timeout?: number): Promise<string | null>; /** * Release a lock
  - Context:  lock token if successful, null otherwise
   */
  acquireLock(sessionId: string, timeout?: number): Promise<string | null>;

  /**
   * Release a lock on a session
   *
   * @param sessionId Unique sessi
  - Type: freemium
- token from acquireLock * @returns Promise resolving to true if
  - Context: ram sessionId Unique session identifier
   * @param token Lock token from acquireLock
   * @returns Promise resolving to true if successful, false if token didn't match
   */
  releaseLock(sessionId: str
  - Type: freemium
- string, token: string): Promise<boolean>; /** * Extends the TTL of
  - Context: e if successful, false if token didn't match
   */
  releaseLock(sessionId: string, token: string): Promise<boolean>;

  /**
   * Extends the TTL of a session
   *
   * @param sessionId ID of the session
  - Type: freemium
- ttl: number): Promise<boolean>; /** * Gets the remaining TTL for
  - Context: uccessful, false if session doesn't exist
   */
  extendSessionTtl(sessionId: string, ttl: number): Promise<boolean>;

  /**
   * Gets the remaining TTL for a session
   *
   * @param sessionId ID of the
  - Type: freemium
- */ getSessionTtl(sessionId: string): Promise<number | null>; /** * Creates a
  - Context: emaining TTL in seconds, or null if session doesn't exist
   */
  getSessionTtl(sessionId: string): Promise<number | null>;

  /**
   * Creates a session if it doesn't exist already
   *
   * @param sess
  - Type: freemium
- * Disconnects from the storage backend
  - Context: 
   */
  createSessionIfNotExists<T = SessionData>(
    sessionId: string,
    initialState: T
  ): Promise<T>;

  /**
   * Disconnects from the storage backend
   */
  disconnect(): Promise<void>;
}

/*
  - Type: freemium
- Extends the TTL of a session * * @param sessionId
  - Context: n didn't match
   */
  releaseLock(sessionId: string, token: string): Promise<boolean>;

  /**
   * Extends the TTL of a session
   *
   * @param sessionId ID of the session
   * @param ttl New TTL in secon
  - Type: subscription
- if successful, false if session doesn't exist */ extendSessionTtl(sessionId: string,
  - Context: ram ttl New TTL in seconds
   * @returns True if successful, false if session doesn't exist
   */
  extendSessionTtl(sessionId: string, ttl: number): Promise<boolean>;

  /**
   * Gets the remaining TTL for
  - Type: subscription
- * Status of the execution (success, error, etc.)
  - Context: ;

  /**
   * Status of the execution (success, error, etc.)
   */
  status: "success" | "error" | "cancelled" | "pending";

  /**
   * Error message if the execution failed
   */
  error?: string;

  /**
 
  - Type: subscription
- types used by the session store and tool execution *
  - Context: he MCP SDK state management system.
 * It defines the core interfaces and types used by the session store and tool execution
 * services, ensuring consistent typing across the state management infrastructu
  - Type: marketplace
- Defines the shape of data that will be stored and
  - Context: *
 * Session data structure for tool state persistence
 *
 * Defines the shape of data that will be stored and retrieved from
 * session storage implementations (memory, Redis, etc.).
 */
export interface 
  - Type: marketplace
- }; } /** * Session store interface for MCP SDK
  - Context: on?: {
    operationId: string;
    toolName: string;
    timestamp: string;
  };
}

/**
 * Session store interface for MCP SDK
 *
 * Defines the contract for session storage implementations
 * that can be
  - Type: marketplace
- */ export interface SessionStore { /** * Get session data
  - Context:  implementations
 * that can be used with the stateful tools framework.
 */
export interface SessionStore {
  /**
   * Get session data by ID
   *
   * @param sessionId Unique session identifier
   * @retu
  - Type: marketplace
- * Additional metadata for the session
  - Context:  */
  history?: Array<{
    tool: string;
    result: any;
    timestamp: string;
  }>;

  /**
   * Additional metadata for the session
   */
  metadata?: Record<string, any>;

  /**
   * Timestamp of t
  - Type: ads
- if it doesn't exist already * * @param sessionId ID
  - Context: l(sessionId: string): Promise<number | null>;

  /**
   * Creates a session if it doesn't exist already
   *
   * @param sessionId ID of the session
   * @param initialState Initial state if session is 
  - Type: ads
- Set up state change handler to persist state changes
      this.actor.subscribe((state: any) => {
        this.persistState(state);
      });
    } catch (error) {
      console.e
  - Context: this.actor.start();

      // Set up state change handler to persist state changes
      this.actor.subscribe((state: any) => {
        this.persistState(state);
      });
    } catch (error) {
      console.e
  - Type: freemium
- Set up a listener for completion events
          const unsubscribe = this.actor.subscribe((state: any) => {
            if (state.matches("succeeded")) {
  - Context:       (resolve, reject) => {
          // Set up a listener for completion events
          const unsubscribe = this.actor.subscribe((state: any) => {
            if (state.matches("succeeded")) {
            
  - Type: freemium
- Set up a listener for completion events
          const unsubscribe = this.actor.subscribe((state: any) => {
            if (state.matches("succeeded")) {
              unsubscribe();
  - Context:  => {
          // Set up a listener for completion events
          const unsubscribe = this.actor.subscribe((state: any) => {
            if (state.matches("succeeded")) {
              unsubscribe();
      
  - Type: freemium
- => { if (state.matches("succeeded")) { unsubscribe(); resolve(state.context.result); } else if
  - Context: his.actor.subscribe((state: any) => {
            if (state.matches("succeeded")) {
              unsubscribe();
              resolve(state.context.result);
            } else if (state.matches("failed")) {
 
  - Type: freemium
- Create an error response
              const errorResponse = createErrorRespon
  - Context:    resolve(state.context.result);
            } else if (state.matches("failed")) {
              unsubscribe();

              // Create an error response
              const errorResponse = createErrorRespon
  - Type: freemium
- Set up state change handler to persist state changes
    this.actor.subscribe((state: any) => {
      this.persistState(state);
    });
  }

  /**
   * Disposes of the service a
  - Context:     this.actor.start();

    // Set up state change handler to persist state changes
    this.actor.subscribe((state: any) => {
      this.persistState(state);
    });
  }

  /**
   * Disposes of the service a
  - Type: freemium
- * This module provides a Redis-backed implementation of the Tool
  - Context: /**
 * Redis-based Tool Execution Service for MCP SDK
 *
 * This module provides a Redis-backed implementation of the Tool Execution Service for MCP SDK tools.
 * It extends t
  - Type: freemium
- state between memory and Redis, * providing both high performance
  - Context: distributed MCP deployments.
 * This implementation synchronizes state between memory and Redis,
 * providing both high performance and persistence.
 */
export class RedisToolExecutionService implements 
  - Type: freemium
- Get or initialize the state in Redis
      const persistedState = aw
  - Context:  the state from Redis or creates a new state if none exists
   */
  public async initializeState(): Promise<void> {
    try {
      // Get or initialize the state in Redis
      const persistedState = aw
  - Type: freemium
- machine state */ private async persistState(state: any): Promise<void> { try
  - Context: te to Redis
   * @param state Current machine state
   */
  private async persistState(state: any): Promise<void> {
    try {
      await this.sessionStore.setSession(this.serviceId, {
        state: { v
  - Type: freemium
- lock cannot be acquired */ private async acquireLock(): Promise<string> {
  - Context: oken if acquired
   * @throws Error if lock cannot be acquired
   */
  private async acquireLock(): Promise<string> {
    const lockToken = await this.sessionStore.acquireLock(this.serviceId);

    if (!
  - Type: freemium
- to release */ private async releaseLock(lockToken: string): Promise<void> { await
  - Context:  * @param lockToken The lock token to release
   */
  private async releaseLock(lockToken: string): Promise<void> {
    await this.sessionStore.releaseLock(this.serviceId, lockToken);
  }

  /**
   * Ext
  - Type: freemium
- * Extends the TTL for the current session
  - Context: kToken);
  }

  /**
   * Extends the TTL for the current session
   */
  private async extendTtl(): Promise<void> {
    await this.sessionStore.extendSessionTtl(this.serviceId, this.defaultTtl);
  }

  /
  - Type: freemium
- withLock<T>( operation: (lockToken: string) => Promise<T> ): Promise<T> { const
  - Context: ns Result of the operation
   */
  private async withLock<T>(
    operation: (lockToken: string) => Promise<T>
  ): Promise<T> {
    const lockToken = await this.acquireLock();

    try {
      const res
  - Type: freemium
- string) => Promise<T> ): Promise<T> { const lockToken = await
  - Context:  operation
   */
  private async withLock<T>(
    operation: (lockToken: string) => Promise<T>
  ): Promise<T> {
    const lockToken = await this.acquireLock();

    try {
      const result = await oper
  - Type: freemium
- select */ public async selectTool(tool: Tool): Promise<void> { return this.withLock(async
  - Context: tool for execution
   * @param tool The tool to select
   */
  public async selectTool(tool: Tool): Promise<void> {
    return this.withLock(async () => {
      const event: ToolSelectEvent = {
        t
  - Type: freemium
- Update the context manually since the event might not be properly processed
      const snapshot = this.actor.getSnapshot();
      const updatedContext = {
  - Context:    toolName: tool.name,
      };

      // Update the context manually since the event might not be properly processed
      const snapshot = this.actor.getSnapshot();
      const updatedContext = {
    
  - Type: freemium
- Update the context manually since the event might not be properly processed
      const snapshot = this.actor.getSnapshot();
      const updatedContext = {
        ...sn
  - Context: me: tool.name,
      };

      // Update the context manually since the event might not be properly processed
      const snapshot = this.actor.getSnapshot();
      const updatedContext = {
        ...sn
  - Type: freemium
- setParameters( parameters: Record<string, unknown> ): Promise<void> { return this.withLock(async ()
  - Context: eters for the tool
   */
  public async setParameters(
    parameters: Record<string, unknown>
  ): Promise<void> {
    return this.withLock(async () => {
      const event: SetParametersEvent = {
      
  - Type: freemium
- async execute( options?: ToolExecutionOptions ): Promise<ToolExecutionResponse> { return this.withLock(async ()
  - Context: ram options Execution options
   */
  public async execute(
    options?: ToolExecutionOptions
  ): Promise<ToolExecutionResponse> {
    return this.withLock(async () => {
      const context = this.getC
  - Type: freemium
- We'll assume parameters are valid for now

      const executePromise = new Promise<ToolExecutionResponse>(
        (resolve, reject) => {
          // Set up a list
  - Context: chema validation in this fix
      // We'll assume parameters are valid for now

      const executePromise = new Promise<ToolExecutionResponse>(
        (resolve, reject) => {
          // Set up a list
  - Type: freemium
- We'll assume parameters are valid for now

      const executePromise = new Promise<ToolExecutionResponse>(
        (resolve, reject) => {
          // Set up a listener for compl
  - Context: on in this fix
      // We'll assume parameters are valid for now

      const executePromise = new Promise<ToolExecutionResponse>(
        (resolve, reject) => {
          // Set up a listener for compl
  - Type: freemium
- Create standardized error response
        const errorRespo
  - Context:          type: "EXECUTE",
          });
        }
      );

      try {
        return await executePromise;
      } catch (error) {
        // Create standardized error response
        const errorRespo
  - Type: freemium
- * Cancels the current execution
  - Context: ponse;
      }
    });
  }

  /**
   * Cancels the current execution
   */
  public async cancel(): Promise<void> {
    return this.withLock(async () => {
      this.actor.send({ type: "CANCEL" });
    }
  - Type: freemium
- * Resets the service state
  - Context: { type: "CANCEL" });
    });
  }

  /**
   * Resets the service state
   */
  public async reset(): Promise<void> {
    await this.sessionStore.clearSession(this.serviceId);

    // Stop and restart the 
  - Type: freemium
- * Disposes of the service and its resources
  - Context: ;
    });
  }

  /**
   * Disposes of the service and its resources
   */
  public async dispose(): Promise<void> {
    this.actor.stop();
    await this.sessionStore.disconnect();
    await this.cacheSt
  - Type: freemium
- Generate execution ID for tracking
    const executionId = uuidv4
  - Context: ol(
    toolId: string,
    params: any,
    sessionId?: string,
    useCached: boolean = true
  ): Promise<ToolExecutionResult> {
    // Generate execution ID for tracking
    const executionId = uuidv4
  - Type: freemium
- async getToolState( sessionId: string, toolId: string ): Promise<ToolState> { const
  - Context: ool state object
   */
  private async getToolState(
    sessionId: string,
    toolId: string
  ): Promise<ToolState> {
    const sessionState = await this.sessionStore.getSession<
      Record<string, 
  - Type: freemium
- Get current session state
    const sessionState =
      (await this.sessionStor
  - Context: 
  private async setToolState(
    sessionId: string,
    toolId: string,
    state: ToolState
  ): Promise<void> {
    // Get current session state
    const sessionState =
      (await this.sessionStor
  - Type: freemium
- Invalidate tool cache for specific session
      await th
  - Context: alidation
   */
  public async invalidateToolCache(
    toolId: string,
    sessionId?: string
  ): Promise<void> {
    if (sessionId) {
      // Invalidate tool cache for specific session
      await th
  - Type: freemium
- Session ID to clear */ public async clearSession(sessionId: string): Promise<void>
  - Context:   *
   * @param sessionId Session ID to clear
   */
  public async clearSession(sessionId: string): Promise<void> {
    await this.sessionStore.clearSession(sessionId);
    await this.cacheStore.invalida
  - Type: freemium
- * Gets cache statistics
   *
   * @returns Cache statistics
  - Context: /**
   * Gets cache statistics
   *
   * @returns Cache statistics
   */
  public async getStats(): Promise<any> {
    return {
      cache: this.cacheStore.getStats(),
    };
  }
}

  - Type: freemium
- Set up state change handler to persist state changes
      this.actor.subscribe((state: any) => {
        this.persistState(state);
      });
    } catch (error) {
      console.e
  - Context: this.actor.start();

      // Set up state change handler to persist state changes
      this.actor.subscribe((state: any) => {
        this.persistState(state);
      });
    } catch (error) {
      console.e
  - Type: subscription
- Set up a listener for completion events
          const unsubscribe = this.actor.subscribe((state: any) => {
            if (state.matches("succeeded")) {
  - Context:       (resolve, reject) => {
          // Set up a listener for completion events
          const unsubscribe = this.actor.subscribe((state: any) => {
            if (state.matches("succeeded")) {
            
  - Type: subscription
- Set up a listener for completion events
          const unsubscribe = this.actor.subscribe((state: any) => {
            if (state.matches("succeeded")) {
              unsubscribe();
  - Context:  => {
          // Set up a listener for completion events
          const unsubscribe = this.actor.subscribe((state: any) => {
            if (state.matches("succeeded")) {
              unsubscribe();
      
  - Type: subscription
- => { if (state.matches("succeeded")) { unsubscribe(); resolve(state.context.result); } else if
  - Context: his.actor.subscribe((state: any) => {
            if (state.matches("succeeded")) {
              unsubscribe();
              resolve(state.context.result);
            } else if (state.matches("failed")) {
 
  - Type: subscription
- Create an error response
              const errorResponse = createErrorRespon
  - Context:    resolve(state.context.result);
            } else if (state.matches("failed")) {
              unsubscribe();

              // Create an error response
              const errorResponse = createErrorRespon
  - Type: subscription
- Set up state change handler to persist state changes
    this.actor.subscribe((state: any) => {
      this.persistState(state);
    });
  }

  /**
   * Disposes of the service a
  - Context:     this.actor.start();

    // Set up state change handler to persist state changes
    this.actor.subscribe((state: any) => {
      this.persistState(state);
    });
  }

  /**
   * Disposes of the service a
  - Type: subscription
- MCP SDK tools. * It extends the standard ToolExecutionService with
  - Context: odule provides a Redis-backed implementation of the Tool Execution Service for MCP SDK tools.
 * It extends the standard ToolExecutionService with persistent state storage to enable:
 *
 * - Stateful tool i
  - Type: subscription
- service for MCP SDK * * Extends the regular tool
  - Context: service
   */
  serviceId?: string;
}

/**
 * Redis-backed tool execution service for MCP SDK
 *
 * Extends the regular tool execution service with Redis persistence,
 * enabling stateful tool executions in
  - Type: subscription
- * Extends the TTL for the current session
  - Context: Promise<void> {
    await this.sessionStore.releaseLock(this.serviceId, lockToken);
  }

  /**
   * Extends the TTL for the current session
   */
  private async extendTtl(): Promise<void> {
    await this.
  - Type: subscription
- extendTtl(): Promise<void> { await this.sessionStore.extendSessionTtl(this.serviceId, this.defaultTtl); } /** * Performs
  - Context:  the current session
   */
  private async extendTtl(): Promise<void> {
    await this.sessionStore.extendSessionTtl(this.serviceId, this.defaultTtl);
  }

  /**
   * Performs an operation with a lock
   * 
  - Type: subscription
- result = await operation(lockToken); await this.extendTtl(); return result; } finally
  - Context: it this.acquireLock();

    try {
      const result = await operation(lockToken);
      await this.extendTtl();
      return result;
    } finally {
      await this.releaseLock(lockToken);
    }
  }

  /*
  - Type: subscription
- * Cancels the current execution
  - Context: context: updatedContext,
        });

        return errorResponse;
      }
    });
  }

  /**
   * Cancels the current execution
   */
  public async cancel(): Promise<void> {
    return this.withLock(asyn
  - Type: subscription
- * Resets the service state
  - Context: ync cancel(): Promise<void> {
    return this.withLock(async () => {
      this.actor.send({ type: "CANCEL" });
    });
  }

  /**
   * Resets the service state
   */
  public async reset(): Promise<void> {
  - Type: subscription
- @module redisToolExecutionService */ import { RedisSessionStore, type RedisSessionStoreOptions, } from
  - Context: g Redis as the backend storage.
 *
 * @module redisToolExecutionService
 */

import {
  RedisSessionStore,
  type RedisSessionStoreOptions,
} from "./redisSessionStore";
import { v4 as uuidv4 } from "uuid"
  - Type: marketplace
- { RedisSessionStore, type RedisSessionStoreOptions, } from "./redisSessionStore"; import { v4
  - Context: rage.
 *
 * @module redisToolExecutionService
 */

import {
  RedisSessionStore,
  type RedisSessionStoreOptions,
} from "./redisSessionStore";
import { v4 as uuidv4 } from "uuid";
import { createMachine, 
  - Type: marketplace
- from "./redisSessionStore"; import { v4 as uuidv4 } from "uuid";
  - Context: onService
 */

import {
  RedisSessionStore,
  type RedisSessionStoreOptions,
} from "./redisSessionStore";
import { v4 as uuidv4 } from "uuid";
import { createMachine, createActor } from "xstate";
import 
  - Type: marketplace
- Define our ow
  - Context: tionResult,
  ToolExecutionService,
} from "../interfaces/toolExecutionService";
import { RedisCacheStore } from "../store/redisCacheStore";
import { Tool } from "../../tools/interfaces";

// Define our ow
  - Type: marketplace
- Define our own interface to av
  - Context: lExecutionService,
} from "../interfaces/toolExecutionService";
import { RedisCacheStore } from "../store/redisCacheStore";
import { Tool } from "../../tools/interfaces";

// Define our own interface to av
  - Type: marketplace
- Define our own interface to avoid direct depen
  - Context: e,
} from "../interfaces/toolExecutionService";
import { RedisCacheStore } from "../store/redisCacheStore";
import { Tool } from "../../tools/interfaces";

// Define our own interface to avoid direct depen
  - Type: marketplace
- RedisToolExecutionService implements ToolExecutionService { private sessionStore: RedisSessionStore; private cacheStore: RedisCacheStore;
  - Context: ence.
 */
export class RedisToolExecutionService implements ToolExecutionService {
  private sessionStore: RedisSessionStore;
  private cacheStore: RedisCacheStore;
  private tools: Map<string, Tool>;
  pr
  - Type: marketplace
- { private sessionStore: RedisSessionStore; private cacheStore: RedisCacheStore; private tools: Map<string,
  - Context: ass RedisToolExecutionService implements ToolExecutionService {
  private sessionStore: RedisSessionStore;
  private cacheStore: RedisCacheStore;
  private tools: Map<string, Tool>;
  private prefix: strin
  - Type: marketplace
- private sessionStore: RedisSessionStore; private cacheStore: RedisCacheStore; private tools: Map<string, Tool>;
  - Context: Service implements ToolExecutionService {
  private sessionStore: RedisSessionStore;
  private cacheStore: RedisCacheStore;
  private tools: Map<string, Tool>;
  private prefix: string;
  private defaultTt
  - Type: marketplace
- RedisSessionStore; private cacheStore: RedisCacheStore; private tools: Map<string, Tool>; private prefix:
  - Context: s ToolExecutionService {
  private sessionStore: RedisSessionStore;
  private cacheStore: RedisCacheStore;
  private tools: Map<string, Tool>;
  private prefix: string;
  private defaultTtl: number;
  priv
  - Type: marketplace
- 30 seconds default

    // Initialize Redis session store for state persistence
    this.sessionStore = new RedisSessionStore({
      redisUrl: options.redis
  - Context: Timeout = options.operationTimeout || 30000; // 30 seconds default

    // Initialize Redis session store for state persistence
    this.sessionStore = new RedisSessionStore({
      redisUrl: options.redis
  - Type: marketplace
- 30 seconds default

    // Initialize Redis session store for state persistence
    this.sessionStore = new RedisSessionStore({
      redisUrl: options.redisUrl,
      prefix: `${this.prefix}state:`,
  - Context:  // 30 seconds default

    // Initialize Redis session store for state persistence
    this.sessionStore = new RedisSessionStore({
      redisUrl: options.redisUrl,
      prefix: `${this.prefix}state:`,
 
  - Type: marketplace
- Initialize Redis session store for state persistence
    this.sessionStore = new RedisSessionStore({
      redisUrl: options.redisUrl,
      prefix: `${this.prefix}state:`,
      defaultTtl: this.de
  - Context:     // Initialize Redis session store for state persistence
    this.sessionStore = new RedisSessionStore({
      redisUrl: options.redisUrl,
      prefix: `${this.prefix}state:`,
      defaultTtl: this.de
  - Type: marketplace
- Initialize Redis cache store for result caching
    this.cacheStore = new RedisCacheStore({
      redisUrl: options.redisUrl,
  - Context: : `${this.prefix}state:`,
      defaultTtl: this.defaultTtl,
    });

    // Initialize Redis cache store for result caching
    this.cacheStore = new RedisCacheStore({
      redisUrl: options.redisUrl,
  
  - Type: marketplace
- Initialize Redis cache store for result caching
    this.cacheStore = new RedisCacheStore({
      redisUrl: options.redisUrl,
      prefix: `${this.prefix}cache:`,
  - Context: Ttl: this.defaultTtl,
    });

    // Initialize Redis cache store for result caching
    this.cacheStore = new RedisCacheStore({
      redisUrl: options.redisUrl,
      prefix: `${this.prefix}cache:`,
   
  - Type: marketplace
- Initialize Redis cache store for result caching
    this.cacheStore = new RedisCacheStore({
      redisUrl: options.redisUrl,
      prefix: `${this.prefix}cache:`,
      defaultTtl: this.de
  - Context:     });

    // Initialize Redis cache store for result caching
    this.cacheStore = new RedisCacheStore({
      redisUrl: options.redisUrl,
      prefix: `${this.prefix}cache:`,
      defaultTtl: this.de
  - Type: marketplace
- Get or initialize the state in Redis
      const persistedState = await this.sessionStore.createSessionIfNotExists(
        this.serviceId,
        {
          state: { value: "idle" },
  - Context:  try {
      // Get or initialize the state in Redis
      const persistedState = await this.sessionStore.createSessionIfNotExists(
        this.serviceId,
        {
          state: { value: "idle" },
   
  - Type: marketplace
- any): Promise<void> { try { await this.sessionStore.setSession(this.serviceId, { state: {
  - Context: e
   */
  private async persistState(state: any): Promise<void> {
    try {
      await this.sessionStore.setSession(this.serviceId, {
        state: { value: state.value },
        context: state.context,
  - Type: marketplace
- { const lockToken = await this.sessionStore.acquireLock(this.serviceId); if (!lockToken) { throw
  - Context: ired
   */
  private async acquireLock(): Promise<string> {
    const lockToken = await this.sessionStore.acquireLock(this.serviceId);

    if (!lockToken) {
      throw new Error("Could not acquire lock f
  - Type: marketplace
- string): Promise<void> { await this.sessionStore.releaseLock(this.serviceId, lockToken); } /** * Extends
  - Context: release
   */
  private async releaseLock(lockToken: string): Promise<void> {
    await this.sessionStore.releaseLock(this.serviceId, lockToken);
  }

  /**
   * Extends the TTL for the current session
   
  - Type: marketplace
- private async extendTtl(): Promise<void> { await this.sessionStore.extendSessionTtl(this.serviceId, this.defaultTtl); } /**
  - Context: TL for the current session
   */
  private async extendTtl(): Promise<void> {
    await this.sessionStore.extendSessionTtl(this.serviceId, this.defaultTtl);
  }

  /**
   * Performs an operation with a loc
  - Type: marketplace
- Stop and restart the actor
    this.actor.stop();
    this.ac
  - Context: *
   * Resets the service state
   */
  public async reset(): Promise<void> {
    await this.sessionStore.clearSession(this.serviceId);

    // Stop and restart the actor
    this.actor.stop();
    this.ac
  - Type: marketplace
- Promise<void> { this.actor.stop(); await this.sessionStore.disconnect(); await this.cacheStore.disconnect(); } /** *
  - Context: ources
   */
  public async dispose(): Promise<void> {
    this.actor.stop();
    await this.sessionStore.disconnect();
    await this.cacheStore.disconnect();
  }

  /**
   * Executes a tool with the give
  - Type: marketplace
- this.cacheStore.disconnect(); } /** * Executes a tool with the given
  - Context: romise<void> {
    this.actor.stop();
    await this.sessionStore.disconnect();
    await this.cacheStore.disconnect();
  }

  /**
   * Executes a tool with the given parameters and session ID
   *
   * @p
  - Type: marketplace
- = this.createCacheKey(toolId, params); const cachedResult = await this.cacheStore.get<ToolExecutionResult>( cacheKey, actualSessionId
  - Context:  const cacheKey = this.createCacheKey(toolId, params);
        const cachedResult = await this.cacheStore.get<ToolExecutionResult>(
          cacheKey,
          actualSessionId
        );

        if (cac
  - Type: marketplace
- const cacheKey = this.createCacheKey(toolId, params); await this.cacheStore.set<ToolExecutionResult>( cacheKey, finalResult, tool.cacheTtl
  - Context:  useCached) {
        const cacheKey = this.createCacheKey(toolId, params);
        await this.cacheStore.set<ToolExecutionResult>(
          cacheKey,
          finalResult,
          tool.cacheTtl || thi
  - Type: marketplace
- Promise<ToolState> { const sessionState = await this.sessionStore.getSession< Record<string, ToolState> >(sessionId);
  - Context: Id: string,
    toolId: string
  ): Promise<ToolState> {
    const sessionState = await this.sessionStore.getSession<
      Record<string, ToolState>
    >(sessionId);
    if (!sessionState) {
      // Cre
  - Type: marketplace
- initialState: Record<string, ToolState> = {}; await this.sessionStore.setSession(sessionId, initialState); return {};
  - Context: ial session state
      const initialState: Record<string, ToolState> = {};
      await this.sessionStore.setSession(sessionId, initialState);
      return {};
    }

    return sessionState[toolId] || {};
  - Type: marketplace
- Get current session state
    const sessionState =
      (await this.sessionStore.getSession<Record<string, ToolState>>(
        sessionId
      )) || {};

    // Update tool state
  - Context:  Promise<void> {
    // Get current session state
    const sessionState =
      (await this.sessionStore.getSession<Record<string, ToolState>>(
        sessionId
      )) || {};

    // Update tool state

  - Type: marketplace
- Save updated session state
    await this.sessionStore.setSession(sessionId, sessionState);
  }

  /**
   * Retrieves all available tools
   *
   * @retur
  - Context: ol state
    sessionState[toolId] = state;

    // Save updated session state
    await this.sessionStore.setSession(sessionId, sessionState);
  }

  /**
   * Retrieves all available tools
   *
   * @retur
  - Type: marketplace
- Invalidate tool cache for specific session
      await this.cacheStore.invalidateNamespace(sessionId);
    } else {
      // Invalidate tool cache across all sessions
  - Context: d> {
    if (sessionId) {
      // Invalidate tool cache for specific session
      await this.cacheStore.invalidateNamespace(sessionId);
    } else {
      // Invalidate tool cache across all sessions
   
  - Type: marketplace
- Invalidate tool cache across all sessions
      await this.cacheStore.invalidateNamespace(toolId);
    }
  }

  /**
   * Clears all state and cached results for a sessio
  - Context: e(sessionId);
    } else {
      // Invalidate tool cache across all sessions
      await this.cacheStore.invalidateNamespace(toolId);
    }
  }

  /**
   * Clears all state and cached results for a sessio
  - Type: marketplace
- public async clearSession(sessionId: string): Promise<void> { await this.sessionStore.clearSession(sessionId); await this.cacheStore.invalidateNamespace(sessionId);
  - Context: o clear
   */
  public async clearSession(sessionId: string): Promise<void> {
    await this.sessionStore.clearSession(sessionId);
    await this.cacheStore.invalidateNamespace(sessionId);
  }

  /**
   * 
  - Type: marketplace
- await this.sessionStore.clearSession(sessionId); await this.cacheStore.invalidateNamespace(sessionId); } /** * Gets cache statistics
  - Context: : string): Promise<void> {
    await this.sessionStore.clearSession(sessionId);
    await this.cacheStore.invalidateNamespace(sessionId);
  }

  /**
   * Gets cache statistics
   *
   * @returns Cache stat
  - Type: marketplace
- */ public async getStats(): Promise<any> { return { cache: this.cacheStore.getStats(),
  - Context: ache statistics
   */
  public async getStats(): Promise<any> {
    return {
      cache: this.cacheStore.getStats(),
    };
  }
}

  - Type: marketplace
- * * This module provides a Redis-based persistent storage implementation
  - Context: /**
 * Redis Session Store for MCP SDK Tools
 *
 * This module provides a Redis-based persistent storage implementation for MCP SDK tool sessions.
 * It allows for di
  - Type: freemium
- string, listener: (...args: any[]) => void): void; connect?(): Promise<void>; quit():
  - Context: y[]) => void): void;
  once(event: string, listener: (...args: any[]) => void): void;
  connect?(): Promise<void>;
  quit(): Promise<void>;
  disconnect?(): Promise<void>;
  get(key: string): Promise<str
  - Type: freemium
- => void): void; connect?(): Promise<void>; quit(): Promise<void>; disconnect?(): Promise<void>; get(key:
  - Context: ce(event: string, listener: (...args: any[]) => void): void;
  connect?(): Promise<void>;
  quit(): Promise<void>;
  disconnect?(): Promise<void>;
  get(key: string): Promise<string | null>;
  set(key: s
  - Type: freemium
- Promise<void>; quit(): Promise<void>; disconnect?(): Promise<void>; get(key: string): Promise<string | null>;
  - Context: args: any[]) => void): void;
  connect?(): Promise<void>;
  quit(): Promise<void>;
  disconnect?(): Promise<void>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ...args: a
  - Type: freemium
- disconnect?(): Promise<void>; get(key: string): Promise<string | null>; set(key: string, value:
  - Context: ect?(): Promise<void>;
  quit(): Promise<void>;
  disconnect?(): Promise<void>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ...args: any[]): Promise<any>;
  setEx?(key: 
  - Type: freemium
- set(key: string, value: string, ...args: any[]): Promise<any>; setEx?(key: string, seconds:
  - Context: id>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ...args: any[]): Promise<any>;
  setEx?(key: string, seconds: number, value: string): Promise<any>;
  del(key: string): 
  - Type: freemium
- Promise<any>; setEx?(key: string, seconds: number, value: string): Promise<any>; del(key: string):
  - Context: alue: string, ...args: any[]): Promise<any>;
  setEx?(key: string, seconds: number, value: string): Promise<any>;
  del(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  exists
  - Type: freemium
- seconds: number, value: string): Promise<any>; del(key: string): Promise<number>; keys(pattern: string):
  - Context: mise<any>;
  setEx?(key: string, seconds: number, value: string): Promise<any>;
  del(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  exists(key: string): Promise<number>;
  
  - Type: freemium
- del(key: string): Promise<number>; keys(pattern: string): Promise<string[]>; exists(key: string): Promise<number>; expire(key:
  - Context: number, value: string): Promise<any>;
  del(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  exists(key: string): Promise<number>;
  expire(key: string, seconds: number): Prom
  - Type: freemium
- keys(pattern: string): Promise<string[]>; exists(key: string): Promise<number>; expire(key: string, seconds: number):
  - Context: l(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  exists(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<n
  - Type: freemium
- Promise<number>; expire(key: string, seconds: number): Promise<number>; ttl(key: string): Promise<number>; removeAllListeners?(event?:
  - Context:  Promise<string[]>;
  exists(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  removeAllListeners?(event?: string): void;
}

/
  - Type: freemium
- Factory function to create Redis cl
  - Context: ing): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  removeAllListeners?(event?: string): void;
}

// Factory function to create Redis cl
  - Type: freemium
- Factory function to create Redis client
async function createRedisClient(url: string): Promise<RedisClient> {
  // Attempt to dynamically load redis client libraries
  try {
    // This will
  - Context:  void;
}

// Factory function to create Redis client
async function createRedisClient(url: string): Promise<RedisClient> {
  // Attempt to dynamically load redis client libraries
  try {
    // This will
  - Type: freemium
- }, connect: async () => Promise.resolve(), quit: async () =>
  - Context: "ready") {
          setTimeout(() => listener(), 0);
        }
      },
      connect: async () => Promise.resolve(),
      quit: async () => Promise.resolve(),
      get: async (key) => null,
      set
  - Type: freemium
- Promise.resolve(), quit: async () => Promise.resolve(), get: async (key) =>
  - Context: ner(), 0);
        }
      },
      connect: async () => Promise.resolve(),
      quit: async () => Promise.resolve(),
      get: async (key) => null,
      set: async (key, value, ...args) => "OK",
    
  - Type: freemium
- store implementation * * Provides persistent storage of tool sessions
  - Context: ult: 30000)
   */
  lockTimeout?: number;
}

/**
 * Redis-backed session store implementation
 *
 * Provides persistent storage of tool sessions using Redis, with
 * support for TTL management, atomic op
  - Type: freemium
- connection URL */ private async connect(redisUrl: string): Promise<void> { try
  - Context: dis
   *
   * @param redisUrl Redis connection URL
   */
  private async connect(redisUrl: string): Promise<void> {
    try {
      this.client = await createRedisClient(redisUrl);

      this.client.on(
  - Type: freemium
- session identifier * @returns Promise resolving to session data or
  - Context:  /**
   * Get session data by ID
   *
   * @param sessionId Unique session identifier
   * @returns Promise resolving to session data or null if not found
   * @throws Error if Redis operation fails or s
  - Type: freemium
- be parsed */ async getSession<T>(sessionId: string): Promise<T | null> {
  - Context: is operation fails or session data cannot be parsed
   */
  async getSession<T>(sessionId: string): Promise<T | null> {
    try {
      const sessionKey = this.getSessionKey(sessionId);
      logger.debu
  - Type: freemium
- data: T, ttl?: number ): Promise<void> { try { if
  - Context:   */
  async setSession<T = SessionData>(
    sessionId: string,
    data: T,
    ttl?: number
  ): Promise<void> {
    try {
      if (!this.connected || !this.client) {
        throw new Error("Redis c
  - Type: freemium
- identifier */ async clearSession(sessionId: string): Promise<void> { try { if
  - Context:    *
   * @param sessionId Unique session identifier
   */
  async clearSession(sessionId: string): Promise<void> {
    try {
      if (!this.connected || !this.client) {
        console.warn("Redis clie
  - Type: freemium
- Lock timeout in milliseconds * @returns Promise resolving to lock
  - Context:   *
   * @param sessionId Session ID
   * @param timeout Lock timeout in milliseconds
   * @returns Promise resolving to lock token if successful, null otherwise
   */
  async acquireLock(
    sessionId:
  - Type: freemium
- sessionId: string, timeout?: number ): Promise<string | null> { try
  - Context: cessful, null otherwise
   */
  async acquireLock(
    sessionId: string,
    timeout?: number
  ): Promise<string | null> {
    try {
      if (!this.connected || !this.client) {
        console.warn("R
  - Type: freemium
- */ async releaseLock(sessionId: string, token: string): Promise<boolean> { try {
  - Context: uccessful, false if token didn't match
   */
  async releaseLock(sessionId: string, token: string): Promise<boolean> {
    try {
      if (!this.connected || !this.client) {
        console.warn("Redis c
  - Type: freemium
- */ async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean> { try {
  - Context: ful, false if session doesn't exist
   */
  async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean> {
    try {
      if (!this.connected || !this.client) {
        console.warn("Redis c
  - Type: freemium
- doesn't exist */ async getSessionTtl(sessionId: string): Promise<number | null> {
  - Context: ng TTL in seconds, or null if session doesn't exist
   */
  async getSessionTtl(sessionId: string): Promise<number | null> {
    try {
      if (!this.connected || !this.client) {
        console.warn("R
  - Type: freemium
- First check if the session already exists
      const existingSession =
  - Context: otExists<T = SessionData>(
    sessionId: string,
    initialState: T,
    ttlSeconds?: number
  ): Promise<T> {
    try {
      // First check if the session already exists
      const existingSession =
  - Type: freemium
- * Disconnect from Redis
  - Context: trieve session: ${error}`);
    }
  }

  /**
   * Disconnect from Redis
   */
  async disconnect(): Promise<void> {
    if (this.connected && this.client) {
      try {
        if (typeof this.client.qui
  - Type: freemium
- timeout in milliseconds * @returns Promise resolving to true if
  - Context: edisUrl Redis connection URL
   * @param timeoutMs Connection timeout in milliseconds
   * @returns Promise resolving to true if Redis is available, false otherwise
   */
  static async isRedisAvailable(
  - Type: freemium
- localhost:6379",
    timeoutMs: number = 1000
  ): Promise<boolean> {
    const client = await createRedisClient(redisUrl).catch(() => null);

    return
  - Context: sRedisAvailable(
    redisUrl: string = "redis://localhost:6379",
    timeoutMs: number = 1000
  ): Promise<boolean> {
    const client = await createRedisClient(redisUrl).catch(() => null);

    return 
  - Type: freemium
- Set up a timeout to handle connection hanging
      cons
  - Context: <boolean> {
    const client = await createRedisClient(redisUrl).catch(() => null);

    return new Promise<boolean>(async (resolve) => {
      // Set up a timeout to handle connection hanging
      cons
  - Type: freemium
- connection issues * * This implementation extends the in-memory session
  - Context: rations for state updates
 * - Error handling for Redis connection issues
 *
 * This implementation extends the in-memory session management from statefulTool
 * to support distributed environments and pers
  - Type: subscription
- Promise<string[]>; exists(key: string): Promise<number>; expire(key: string, seconds: number): Promise<number>; ttl(key:
  - Context: mise<number>;
  keys(pattern: string): Promise<string[]>;
  exists(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  removeAllLis
  - Type: subscription
- exists: async (key) => 0, expire: async (key, seconds) =>
  - Context:     del: async (key) => 1,
      keys: async (pattern) => [],
      exists: async (key) => 0,
      expire: async (key, seconds) => 1,
      ttl: async (key) => -2,
      removeAllListeners: (event) => {},

  - Type: subscription
- * Extends the TTL of a session * * @param
  - Context: r(`Error releasing lock for session ${sessionId}:`, err);
      return false;
    }
  }

  /**
   * Extends the TTL of a session
   *
   * @param sessionId ID of the session
   * @param ttl New TTL in secon
  - Type: subscription
- successful, false if session doesn't exist */ async extendSessionTtl(sessionId: string,
  - Context: l New TTL in seconds
   * @returns True if successful, false if session doesn't exist
   */
  async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean> {
    try {
      if (!this.connected |
  - Type: subscription
- console.warn("Redis client not connected, cannot extend TTL"); return false; }
  - Context:     if (!this.connected || !this.client) {
        console.warn("Redis client not connected, cannot extend TTL");
        return false;
      }

      const key = this.getSessionKey(sessionId);

      // Ch
  - Type: subscription
- Set expiry
      await this.client.expire(key, ttl);
      return true;
    } catch (err) {
      console.error(`Error extending TTL for sess
  - Context:      if (exists === 0) {
        return false;
      }

      // Set expiry
      await this.client.expire(key, ttl);
      return true;
    } catch (err) {
      console.error(`Error extending TTL for sess
  - Type: subscription
- (err) { console.error(`Error extending TTL for session ${sessionId}:`, err); return
  - Context: ait this.client.expire(key, ttl);
      return true;
    } catch (err) {
      console.error(`Error extending TTL for session ${sessionId}:`, err);
      return false;
    }
  }

  /**
   * Gets the remaini
  - Type: subscription
- /** * Redis Session Store for MCP SDK Tools
  - Context: /**
 * Redis Session Store for MCP SDK Tools
 *
 * This module provides a Redis-based persistent storage implementation for MC
  - Type: marketplace
- multiple server instances. The session store handles: * * -
  - Context: K by persisting tool state between invocations
 * and across multiple server instances. The session store handles:
 *
 * - Session data serialization and deserialization
 * - TTL-based session management a
  - Type: marketplace
- * * @module redisSessionStore */ import { SessionData, SessionStore }
  - Context: ol
 * to support distributed environments and persistent session storage.
 *
 * @module redisSessionStore
 */

import { SessionData, SessionStore } from "./types.js";
import { v4 as uuidv4 } from "uuid";
i
  - Type: marketplace
- import { SessionData, SessionStore } from "./types.js"; import { v4
  - Context: s and persistent session storage.
 *
 * @module redisSessionStore
 */

import { SessionData, SessionStore } from "./types.js";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger.j
  - Type: marketplace
- * Redis Session Store Options
  - Context: client:", error);
    throw new Error("Could not create Redis client");
  }
}

/**
 * Redis Session Store Options
 */
export interface RedisSessionStoreOptions {
  /**
   * Redis connection URL (e.g., redi
  - Type: marketplace
- } /** * Redis-backed session store implementation * * Provides
  - Context: meout in milliseconds (default: 30000)
   */
  lockTimeout?: number;
}

/**
 * Redis-backed session store implementation
 *
 * Provides persistent storage of tool sessions using Redis, with
 * support for 
  - Type: marketplace
- and locking. */ export class RedisSessionStore implements SessionStore { private
  - Context: s, with
 * support for TTL management, atomic operations, and locking.
 */
export class RedisSessionStore implements SessionStore {
  private client: RedisClient | null = null;
  private prefix: string;
  
  - Type: marketplace
- class RedisSessionStore implements SessionStore { private client: RedisClient | null
  - Context: TL management, atomic operations, and locking.
 */
export class RedisSessionStore implements SessionStore {
  private client: RedisClient | null = null;
  private prefix: string;
  private defaultTtl: numb
  - Type: marketplace
- * Create a new Redis session store
   *
   * @param options Redis connection options
  - Context: e lockTimeout: number;
  private connected: boolean = false;

  /**
   * Create a new Redis session store
   *
   * @param options Redis connection options
   */
  constructor(options: RedisSessionStoreOpt
  - Type: marketplace
- options Redis connection options */ constructor(options: RedisSessionStoreOptions) { this.prefix =
  - Context: on store
   *
   * @param options Redis connection options
   */
  constructor(options: RedisSessionStoreOptions) {
    this.prefix = options.prefix || "mcp:session:";
    this.defaultTtl = options.default
  - Type: marketplace
- Connect if the client has a connect method
      if (this.client
  - Context: nt(redisUrl);

      this.client.on("error", (err: Error) => {
        console.error("Redis session store error:", err);
      });

      // Connect if the client has a connect method
      if (this.client
  - Type: marketplace
- * Set session data
   *
   * @param sessionId Session ID
   * @param data Session data to store
   * @param ttl Optional TTL in seconds
   * @throws Error if Redis operations fail
  - Context: 
  /**
   * Set session data
   *
   * @param sessionId Session ID
   * @param data Session data to store
   * @param ttl Optional TTL in seconds
   * @throws Error if Redis operations fail
   */
  async s
  - Type: marketplace
- Attempt to dynamically load redis client libraries
  try {
    // This will be a dynamic import in JS
    return {
      on(eve
  - Context: async function createRedisClient(url: string): Promise<RedisClient> {
  // Attempt to dynamically load redis client libraries
  try {
    // This will be a dynamic import in JS
    return {
      on(eve
  - Type: ads
- ${event}`); if (event === "ready") { setTimeout(() => listener(), 0);
  - Context: nt, listener) {
        console.log(`Once listener registered: ${event}`);
        if (event === "ready") {
          setTimeout(() => listener(), 0);
        }
      },
      connect: async () => Promi
  - Type: ads
- First check if the session already exists
      const existingSession = await this.getSession<T>(sessionId);
      if (existingSessio
  - Context: ate: T,
    ttlSeconds?: number
  ): Promise<T> {
    try {
      // First check if the session already exists
      const existingSession = await this.getSession<T>(sessionId);
      if (existingSessio
  - Type: ads
- logger.debug( `Session ${sessionId} already exists, returning existing session` ); return
  - Context: (sessionId);
      if (existingSession) {
        logger.debug(
          `Session ${sessionId} already exists, returning existing session`
        );
        return existingSession;
      }

      // I
  - Type: ads
- Set up ready handler
      const readyHandler = () => {
        cleanup();
        resolve(true);
      };
  - Context: nection test failed:", err);
        cleanup();
        resolve(false);
      };

      // Set up ready handler
      const readyHandler = () => {
        cleanup();
        resolve(true);
      };

   
  - Type: ads
- Set up ready handler
      const readyHandler = () => {
        cleanup();
        resolve(true);
      };

      // Clean up function to
  - Context: );
        cleanup();
        resolve(false);
      };

      // Set up ready handler
      const readyHandler = () => {
        cleanup();
        resolve(true);
      };

      // Clean up function to
  - Type: ads
- (client) { if (client.removeAllListeners) { client.removeAllListeners("ready"); client.removeAllListeners("error"); } if (typeof
  - Context:   if (client) {
          if (client.removeAllListeners) {
            client.removeAllListeners("ready");
            client.removeAllListeners("error");
          }
          if (typeof client.quit ==
  - Type: ads
- Connect if the client has a connect method
      if (typeof cli
  - Context: nt listeners
      if (client) {
        client.once("error", errorHandler);
        client.once("ready", readyHandler);
      }

      // Connect if the client has a connect method
      if (typeof cli
  - Type: ads
- Connect if the client has a connect method
      if (typeof client?.con
  - Context: ners
      if (client) {
        client.once("error", errorHandler);
        client.once("ready", readyHandler);
      }

      // Connect if the client has a connect method
      if (typeof client?.con
  - Type: ads
- * * This module provides factory functions for creating SessionStore
  - Context: /**
 * Session Store Factory Module
 *
 * This module provides factory functions for creating SessionStore instances
 * with automatic backend detection and 
  - Type: freemium
- features: * - Redis-backed storage for production environments * -
  - Context: omatic backend detection and fallback mechanisms.
 *
 * Key features:
 * - Redis-backed storage for production environments
 * - Memory-backed storage for development and testing
 * - Automatic fallback 
  - Type: freemium
- @param redisUrl Redis connection URL * @returns Promise resolving to
  - Context: Check if Redis is available at the given URL
 *
 * @param redisUrl Redis connection URL
 * @returns Promise resolving to true if Redis is available, false otherwise
 */
export async function isRedisAvail
  - Type: freemium
- If no Redis URL provided, Redis is not available
  if (!redisUrl) {
    return
  - Context:  Redis is available, false otherwise
 */
export async function isRedisAvailable(redisUrl?: string): Promise<boolean> {
  // If no Redis URL provided, Redis is not available
  if (!redisUrl) {
    return 
  - Type: freemium
- If no Redis URL provided, Redis is not available
  if (!redisUrl) {
    return false;
  }

  try {
    return await Red
  - Context: 
export async function isRedisAvailable(redisUrl?: string): Promise<boolean> {
  // If no Redis URL provided, Redis is not available
  if (!redisUrl) {
    return false;
  }

  try {
    return await Red
  - Type: freemium
- Redis if a URL is provided and * if Redis
  - Context: on store with automatic backend detection
 *
 * This function will attempt to use Redis if a URL is provided and
 * if Redis is available. If Redis is unavailable or if memory is
 * preferred, it will fa
  - Type: freemium
- @param options Session store options * @returns Promise resolving to
  - Context:  will fall back to the memory session store.
 *
 * @param options Session store options
 * @returns Promise resolving to a SessionStore instance
 */
export async function createSessionStore(
  options: S
  - Type: freemium
- localhost:6379";
  const prefer
  - Context: nstance
 */
export async function createSessionStore(
  options: SessionStoreFactoryOptions = {}
): Promise<SessionStore> {
  const redisUrl = options.redisUrl || "redis://localhost:6379";
  const prefer
  - Type: freemium
- /** * Session Store Factory Module * *
  - Context: /**
 * Session Store Factory Module
 *
 * This module provides factory functions for creating SessionStore instances
 * 
  - Type: marketplace
- ** * Session Store Factory Module * *
  - Context: **
 * Session Store Factory Module
 *
 * This module provides factory functions for creating SessionStore instances
 * with automatic backend detection and fallback mechanisms.
 *
 * Key features:
 * - Red
  - Type: marketplace
- Configurable session options */ import { SessionStore } from "./types.js";
  - Context: - Automatic fallback if Redis is unavailable
 * - Configurable session options
 */

import { SessionStore } from "./types.js";
import { RedisSessionStore } from "./redisSessionStore.js";
import { MemorySes
  - Type: marketplace
- SessionStore } from "./types.js"; import { RedisSessionStore } from "./redisSessionStore.js";
  - Context: - Configurable session options
 */

import { SessionStore } from "./types.js";
import { RedisSessionStore } from "./redisSessionStore.js";
import { MemorySessionStore } from "./memorySessionStore.js";

exp
  - Type: marketplace
- from "./types.js"; import { RedisSessionStore } from "./redisSessionStore.js"; import {
  - Context: ns
 */

import { SessionStore } from "./types.js";
import { RedisSessionStore } from "./redisSessionStore.js";
import { MemorySessionStore } from "./memorySessionStore.js";

export interface SessionStoreFa
  - Type: marketplace
- from "./redisSessionStore.js"; import { MemorySessionStore } from "./memorySessionStore.js"; export interface
  - Context: rom "./types.js";
import { RedisSessionStore } from "./redisSessionStore.js";
import { MemorySessionStore } from "./memorySessionStore.js";

export interface SessionStoreFactoryOptions {
  /**
   * Redis c
  - Type: marketplace
- { MemorySessionStore } from "./memorySessionStore.js"; export interface SessionStoreFactoryOptions { /**
  - Context: disSessionStore } from "./redisSessionStore.js";
import { MemorySessionStore } from "./memorySessionStore.js";

export interface SessionStoreFactoryOptions {
  /**
   * Redis connection URL (default: redis
  - Type: marketplace
- * Redis connection URL (default: redis://localhost:6379)
  - Context: onStore.js";
import { MemorySessionStore } from "./memorySessionStore.js";

export interface SessionStoreFactoryOptions {
  /**
   * Redis connection URL (default: redis://localhost:6379)
   */
  redisUrl?
  - Type: marketplace
- * Prefer memory store even if Redis is available
  - Context:  milliseconds (default: 30000 - 30 seconds)
   */
  lockTimeout?: number;

  /**
   * Prefer memory store even if Redis is available
   */
  preferMemory?: boolean;

  /**
   * Whether to show verbose logs
  - Type: marketplace
- } try { return await RedisSessionStore.isRedisAvailable(redisUrl); } catch (error) {
  - Context: dis is not available
  if (!redisUrl) {
    return false;
  }

  try {
    return await RedisSessionStore.isRedisAvailable(redisUrl);
  } catch (error) {
    return false;
  }
}

/**
 * Create a session st
  - Type: marketplace
- /** * Create a session store with automatic backend detection
  - Context: re.isRedisAvailable(redisUrl);
  } catch (error) {
    return false;
  }
}

/**
 * Create a session store with automatic backend detection
 *
 * This function will attempt to use Redis if a URL is provided
  - Type: marketplace
- * * @param options Session store options * @returns Promise
  - Context: able. If Redis is unavailable or if memory is
 * preferred, it will fall back to the memory session store.
 *
 * @param options Session store options
 * @returns Promise resolving to a SessionStore instanc
  - Type: marketplace
- * * @param options Session store options * @returns Promise
  - Context: memory is
 * preferred, it will fall back to the memory session store.
 *
 * @param options Session store options
 * @returns Promise resolving to a SessionStore instance
 */
export async function createSe
  - Type: marketplace
- options * @returns Promise resolving to a SessionStore instance */
  - Context: session store.
 *
 * @param options Session store options
 * @returns Promise resolving to a SessionStore instance
 */
export async function createSessionStore(
  options: SessionStoreFactoryOptions = {}
)
  - Type: marketplace
- SessionStore instance */ export async function createSessionStore( options: SessionStoreFactoryOptions =
  - Context: ons
 * @returns Promise resolving to a SessionStore instance
 */
export async function createSessionStore(
  options: SessionStoreFactoryOptions = {}
): Promise<SessionStore> {
  const redisUrl = options.r
  - Type: marketplace
- export async function createSessionStore( options: SessionStoreFactoryOptions = {} ): Promise<SessionStore>
  - Context: esolving to a SessionStore instance
 */
export async function createSessionStore(
  options: SessionStoreFactoryOptions = {}
): Promise<SessionStore> {
  const redisUrl = options.redisUrl || "redis://local
  - Type: marketplace
- localhost:6379";
  const preferMemory = options.
  - Context: ort async function createSessionStore(
  options: SessionStoreFactoryOptions = {}
): Promise<SessionStore> {
  const redisUrl = options.redisUrl || "redis://localhost:6379";
  const preferMemory = options.
  - Type: marketplace
- If memory store is preferred, use it directly
  if (preferMemory) {
    if (verbose) {
      console.log("Using mem
  - Context: Memory = options.preferMemory || false;
  const verbose = options.verbose || false;

  // If memory store is preferred, use it directly
  if (preferMemory) {
    if (verbose) {
      console.log("Using mem
  - Type: marketplace
- (verbose) { console.log("Using memory session store (explicitly preferred)"); } return
  - Context: d, use it directly
  if (preferMemory) {
    if (verbose) {
      console.log("Using memory session store (explicitly preferred)");
    }
    return createMemorySessionStore(options);
  }

  // Try to use 
  - Type: marketplace
- Try to use Redis if available
  try {
    const redisAvailable = await isRedisA
  - Context: nsole.log("Using memory session store (explicitly preferred)");
    }
    return createMemorySessionStore(options);
  }

  // Try to use Redis if available
  try {
    const redisAvailable = await isRedisA
  - Type: marketplace
- (verbose) { console.log(`Using Redis session store (${redisUrl})`); } return createRedisSessionStore(options);
  - Context: redisUrl);

    if (redisAvailable) {
      if (verbose) {
        console.log(`Using Redis session store (${redisUrl})`);
      }
      return createRedisSessionStore(options);
    } else {
      if (verb
  - Type: marketplace
- (${redisUrl})`); } return createRedisSessionStore(options); } else { if (verbose) {
  - Context:      console.log(`Using Redis session store (${redisUrl})`);
      }
      return createRedisSessionStore(options);
    } else {
      if (verbose) {
        console.log(
          `Redis not available at 
  - Type: marketplace
- falling back to memory session store` ); } return createMemorySessionStore(options);
  - Context: 
        console.log(
          `Redis not available at ${redisUrl}, falling back to memory session store`
        );
      }
      return createMemorySessionStore(options);
    }
  } catch (error) {
    i
  - Type: marketplace
- store` ); } return createMemorySessionStore(options); } } catch (error) {
  - Context: redisUrl}, falling back to memory session store`
        );
      }
      return createMemorySessionStore(options);
    }
  } catch (error) {
    if (verbose) {
      console.warn(
        `Error checking 
  - Type: marketplace
- back to memory session store` ); } return createMemorySessionStore(options); }
  - Context:  console.warn(
        `Error checking Redis availability: ${error}, falling back to memory session store`
      );
    }
    return createMemorySessionStore(options);
  }
}

/**
 * Create a memory session
  - Type: marketplace
- } return createMemorySessionStore(options); } } /** * Create a memory
  - Context: ility: ${error}, falling back to memory session store`
      );
    }
    return createMemorySessionStore(options);
  }
}

/**
 * Create a memory session store
 *
 * @param options Session store options
 *
  - Type: marketplace
- * Create a memory session store
 *
 * @param options Session store options
 * @returns A MemorySessionStore instance
  - Context: 
      );
    }
    return createMemorySessionStore(options);
  }
}

/**
 * Create a memory session store
 *
 * @param options Session store options
 * @returns A MemorySessionStore instance
 */
export fun
  - Type: marketplace
- options Session store options * @returns A MemorySessionStore instance */
  - Context: Create a memory session store
 *
 * @param options Session store options
 * @returns A MemorySessionStore instance
 */
export function createMemorySessionStore(
  options: SessionStoreFactoryOptions = {}
)
  - Type: marketplace
- MemorySessionStore instance */ export function createMemorySessionStore( options: SessionStoreFactoryOptions = {}
  - Context: sion store options
 * @returns A MemorySessionStore instance
 */
export function createMemorySessionStore(
  options: SessionStoreFactoryOptions = {}
): MemorySessionStore {
  return new MemorySessionStore
  - Type: marketplace
- export function createMemorySessionStore( options: SessionStoreFactoryOptions = {} ): MemorySessionStore {
  - Context: turns A MemorySessionStore instance
 */
export function createMemorySessionStore(
  options: SessionStoreFactoryOptions = {}
): MemorySessionStore {
  return new MemorySessionStore({
    prefix: options.pr
  - Type: marketplace
- SessionStoreFactoryOptions = {} ): MemorySessionStore { return new MemorySessionStore({ prefix:
  - Context: xport function createMemorySessionStore(
  options: SessionStoreFactoryOptions = {}
): MemorySessionStore {
  return new MemorySessionStore({
    prefix: options.prefix || "mcp:session:",
    defaultTtl: o
  - Type: marketplace
- ): MemorySessionStore { return new MemorySessionStore({ prefix: options.prefix || "mcp:session:",
  - Context: Store(
  options: SessionStoreFactoryOptions = {}
): MemorySessionStore {
  return new MemorySessionStore({
    prefix: options.prefix || "mcp:session:",
    defaultTtl: options.defaultTtl || 3600,
    loc
  - Type: marketplace
- * Create a Redis session store
 *
 * @param options Session store options
 * @returns A RedisSessionStore instance
  - Context: tTtl || 3600,
    lockTimeout: options.lockTimeout || 30000,
  });
}

/**
 * Create a Redis session store
 *
 * @param options Session store options
 * @returns A RedisSessionStore instance
 */
export func
  - Type: marketplace
- @param options Session store options * @returns A RedisSessionStore instance
  - Context: * Create a Redis session store
 *
 * @param options Session store options
 * @returns A RedisSessionStore instance
 */
export function createRedisSessionStore(
  options: SessionStoreFactoryOptions = {}
):
  - Type: marketplace
- RedisSessionStore instance */ export function createRedisSessionStore( options: SessionStoreFactoryOptions = {}
  - Context: ession store options
 * @returns A RedisSessionStore instance
 */
export function createRedisSessionStore(
  options: SessionStoreFactoryOptions = {}
): RedisSessionStore {
  return new RedisSessionStore({
  - Type: marketplace
- export function createRedisSessionStore( options: SessionStoreFactoryOptions = {} ): RedisSessionStore {
  - Context: returns A RedisSessionStore instance
 */
export function createRedisSessionStore(
  options: SessionStoreFactoryOptions = {}
): RedisSessionStore {
  return new RedisSessionStore({
    redisUrl: options.re
  - Type: marketplace
- localhost:6379",
  - Context: 
export function createRedisSessionStore(
  options: SessionStoreFactoryOptions = {}
): RedisSessionStore {
  return new RedisSessionStore({
    redisUrl: options.redisUrl || "redis://localhost:6379",
    
  - Type: marketplace
- localhost:6379",
    prefix: options.prefix || "mcp:se
  - Context: onStore(
  options: SessionStoreFactoryOptions = {}
): RedisSessionStore {
  return new RedisSessionStore({
    redisUrl: options.redisUrl || "redis://localhost:6379",
    prefix: options.prefix || "mcp:se
  - Type: marketplace
- * - Redis-backed storage for production environments * - Memory-backed
  - Context: omatic backend detection and fallback mechanisms.
 *
 * Key features:
 * - Redis-backed storage for production environments
 * - Memory-backed storage for development and testing
 * - Automatic fallback if R
  - Type: marketplace
- SDK tool callback system * - Provides a stateful wrapper
  - Context: ow, and result tracking. The service:
 *
 * - Integrates with the MCP SDK tool callback system
 * - Provides a stateful wrapper around tool execution
 * - Manages tool execution history and context
 * - 
  - Type: freemium
- used by the statefulTool helper to provide * persistence between
  - Context: dles error states and recovery
 *
 * The ToolExecutionService is used by the statefulTool helper to provide
 * persistence between tool invocations in the MCP infrastructure.
 *
 * @module toolService
 *
  - Type: freemium
- management * * This class provides the implementation for stateful
  - Context: /
  timestamp: string;
}

/**
 * Service for executing tools with state management
 *
 * This class provides the implementation for stateful tool execution
 * in the MCP SDK ecosystem. It uses XState for
  - Type: freemium
- uses XState for state management and * provides a simple
  - Context: for stateful tool execution
 * in the MCP SDK ecosystem. It uses XState for state management and
 * provides a simple interface for tool execution with context
 * persistence between invocations.
 */
exp
  - Type: freemium
- this execution session (will generate one if not provided) */
  - Context: e
   *
   * @param sessionId Unique identifier for this execution session (will generate one if not provided)
   */
  constructor(sessionId?: string) {
    this.sessionId = sessionId || crypto.randomUUID
  - Type: freemium
- selected tool with the provided parameters * * This method
  - Context: or.send({ type: "SET_PARAMETERS", parameters });
  }

  /**
   * Execute the selected tool with the provided parameters
   *
   * This method runs the tool through its execution lifecycle
   * and return
  - Type: freemium
- its execution lifecycle * and returns a properly formatted result
  - Context: d parameters
   *
   * This method runs the tool through its execution lifecycle
   * and returns a properly formatted result for MCP SDK integration.
   *
   * @param executeFunction Function that execu
  - Type: freemium
- executes the tool logic * @returns Promise that resolves with
  - Context: K integration.
   *
   * @param executeFunction Function that executes the tool logic
   * @returns Promise that resolves with the execution result
   */
  async execute<T>(
    executeFunction: (params:
  - Type: freemium
- Get the current state
    const snapshot = this.actor
  - Context: he execution result
   */
  async execute<T>(
    executeFunction: (params: Record<string, any>) => Promise<T>
  ): Promise<ToolResponse<T>> {
    // Get the current state
    const snapshot = this.actor
  - Type: freemium
- Get the current state
    const snapshot = this.actor.getSnapshot();
  - Context: ult
   */
  async execute<T>(
    executeFunction: (params: Record<string, any>) => Promise<T>
  ): Promise<ToolResponse<T>> {
    // Get the current state
    const snapshot = this.actor.getSnapshot();

  - Type: freemium
- Important: throw an error directly instead of returning a rejected promise
      throw new Error("No tool selected");
    }

    // Now execute the tool
    try {
      c
  - Context: ed
    if (!toolName) {
      // Important: throw an error directly instead of returning a rejected promise
      throw new Error("No tool selected");
    }

    // Now execute the tool
    try {
      c
  - Type: freemium
- * Cancel the current execution
  - Context: ERROR",
        error: new Error(errorMessage),
      });

      throw error;
    }
  }

  /**
   * Cancel the current execution
   */
  cancel(): void {
    this.actor.send({ type: "CANCEL" });
  }

  /**

  - Type: subscription
- * Cancel the current execution
  - Context: 
  }

  /**
   * Cancel the current execution
   */
  cancel(): void {
    this.actor.send({ type: "CANCEL" });
  }

  /**
   * Reset the execution state
   */
  reset(): void {
    this.actor.send({ type: 
  - Type: subscription
- Important: throw an error directly instead of returning a rejected promise
      throw new Error("No tool selected");
    }

    // Now execut
  - Context: ck if we have a tool selected
    if (!toolName) {
      // Important: throw an error directly instead of returning a rejected promise
      throw new Error("No tool selected");
    }

    // Now execut
  - Type: ads
- as any)?.status !== undefined && (result as any)?.metadata !== undefined
  - Context: .data !== undefined &&
        (result as any)?.status !== undefined &&
        (result as any)?.metadata !== undefined
          ? (result as ToolResponse<T>)
          : createSuccessResponse(result, 
  - Type: ads
- This helper provides integration between the MCP SDK's tool system
  - Context: /**
 * Stateful Tool Integration Helper
 *
 * This helper provides integration between the MCP SDK's tool system and XState state machines.
 * It enhances the st
  - Type: freemium
- import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; import { z }
  - Context: across multiple invocations
 *
 * @module statefulTool
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { ToolExecutionService } from "../services
  - Type: freemium
- TParams) => Promise<TResult> ): void; /** * Create a stateful
  - Context: n>
>(
  server: McpServer,
  name: string,
  schema: z.ZodRawShape,
  handler: (params: TParams) => Promise<TResult>
): void;

/**
 * Create a stateful tool that uses XState for state management
 *
 * Re
  - Type: freemium
- Implementation that handles both overloads
export function createStateful
  - Context: er,
  name: string,
  description: string,
  schema: z.ZodRawShape,
  handler: (params: TParams) => Promise<TResult>
): void;

// Implementation that handles both overloads
export function createStateful
  - Type: freemium
- handlerOrSchema: ((params: TParams) => Promise<TResult>) | z.ZodRawShape, handler?: (params: TParams)
  - Context: me: string,
  descriptionOrSchema: string | z.ZodRawShape,
  handlerOrSchema: ((params: TParams) => Promise<TResult>) | z.ZodRawShape,
  handler?: (params: TParams) => Promise<TResult>
): void {
  // Det
  - Type: freemium
- Determine if description was provided
  const hasDescription = typeof d
  - Context: OrSchema: ((params: TParams) => Promise<TResult>) | z.ZodRawShape,
  handler?: (params: TParams) => Promise<TResult>
): void {
  // Determine if description was provided
  const hasDescription = typeof d
  - Type: freemium
- Determine if description was provided
  const hasDescription = typeof descriptionOrSchema === "string";

  // Extract parameters bas
  - Context: hape,
  handler?: (params: TParams) => Promise<TResult>
): void {
  // Determine if description was provided
  const hasDescription = typeof descriptionOrSchema === "string";

  // Extract parameters bas
  - Type: freemium
- Add sessionId
  - Context: hema as z.ZodRawShape);
  const toolHandler = hasDescription
    ? (handler as (params: TParams) => Promise<TResult>)
    : (handlerOrSchema as (params: TParams) => Promise<TResult>);

  // Add sessionId
  - Type: freemium
- Add sessionId parameter to the schema
  const enhancedSchema = {
    ...schema
  - Context: ? (handler as (params: TParams) => Promise<TResult>)
    : (handlerOrSchema as (params: TParams) => Promise<TResult>);

  // Add sessionId parameter to the schema
  const enhancedSchema = {
    ...schema
  - Type: freemium
- Create the tool callback that handles sta
  - Context: 
      .optional()
      .describe(
        "Session ID for maintaining state between calls. If not provided, a new session will be created."
      ),
  };

  // Create the tool callback that handles sta
  - Type: freemium
- Return MCP-formatted response with properly typed content
      return {
        content: [
          {
            type: "text" as const,
  - Context: ntext = { sessionId: session.getSessionId() };
      }

      // Return MCP-formatted response with properly typed content
      return {
        content: [
          {
            type: "text" as const,
  - Type: freemium
- Register the tool with the server using the appropriate overload
  if (hasDescription && description) {
    server.tool(name, description, enhancedSc
  - Context:   ],
        isError: true,
      };
    }
  };

  // Register the tool with the server using the appropriate overload
  if (hasDescription && description) {
    server.tool(name, description, enhancedSc
  - Type: freemium
- a unique ID, which can be provided or * generated
  - Context:  tool execution session for managing state.
 * Sessions are identified by a unique ID, which can be provided or
 * generated automatically.
 *
 * @param sessionId Session ID to retrieve
 * @returns Tool 
  - Type: freemium
- Map to store sessions by ID
const sessions = new Map<string, ToolExecutionService>();

/**
 * Create a stateful
  - Context: ort { z } from "zod";
import { ToolExecutionService } from "../services/toolService.js";

// Map to store sessions by ID
const sessions = new Map<string, ToolExecutionService>();

/**
 * Create a stateful 
  - Type: marketplace
- Implementation that handles both overloads
export function createStatefulTool<
  TParams = Record<string, unknown>,
  TResult = Record<string
  - Context:  handler: (params: TParams) => Promise<TResult>
): void;

// Implementation that handles both overloads
export function createStatefulTool<
  TParams = Record<string, unknown>,
  TResult = Record<string
  - Type: ads
- Extract parameters based on which overload was used
  const description = hasDescription
    ? (descriptionOrSchema as string)
    : undefined
  - Context: escription = typeof descriptionOrSchema === "string";

  // Extract parameters based on which overload was used
  const description = hasDescription
    ? (descriptionOrSchema as string)
    : undefined
  - Type: ads
- Add sessionId parameter to the schema
  const enhancedSchema = {
    ...schema,
    sessionId: z
  - Context: arams) => Promise<TResult>)
    : (handlerOrSchema as (params: TParams) => Promise<TResult>);

  // Add sessionId parameter to the schema
  const enhancedSchema = {
    ...schema,
    sessionId: z
     
  - Type: ads
- Add session ID to the response context
      if (result.context) {
        result.context.sessionId =
  - Context:  await session.execute(async (p) => {
        return toolHandler(p as TParams);
      });

      // Add session ID to the response context
      if (result.context) {
        result.context.sessionId = 
  - Type: ads
- Register the tool with the server using the appropriate overload
  if (hasDescription && description) {
    server.tool(name, description, enhancedSchema, toolCallb
  - Context: rror: true,
      };
    }
  };

  // Register the tool with the server using the appropriate overload
  if (hasDescription && description) {
    server.tool(name, description, enhancedSchema, toolCallb
  - Type: ads
- export interface SessionStore { getSession<T>(sessionId: string): Promise<T | null>; setSession<T>(sessionId:
  - Context:  { v4 as uuidv4 } from "uuid";

export interface SessionStore {
  getSession<T>(sessionId: string): Promise<T | null>;
  setSession<T>(sessionId: string, state: T, ttl?: number): Promise<void>;
  clearSe
  - Type: freemium
- | null>; setSession<T>(sessionId: string, state: T, ttl?: number): Promise<void>; clearSession(sessionId:
  - Context: (sessionId: string): Promise<T | null>;
  setSession<T>(sessionId: string, state: T, ttl?: number): Promise<void>;
  clearSession(sessionId: string): Promise<void>;
  getSessions(): Promise<string[]>;
  
  - Type: freemium
- T, ttl?: number): Promise<void>; clearSession(sessionId: string): Promise<void>; getSessions(): Promise<string[]>; acquireLock(sessionId:
  - Context: on<T>(sessionId: string, state: T, ttl?: number): Promise<void>;
  clearSession(sessionId: string): Promise<void>;
  getSessions(): Promise<string[]>;
  acquireLock(sessionId: string, timeout?: number): 
  - Type: freemium
- Promise<void>; clearSession(sessionId: string): Promise<void>; getSessions(): Promise<string[]>; acquireLock(sessionId: string, timeout?: number):
  - Context: T, ttl?: number): Promise<void>;
  clearSession(sessionId: string): Promise<void>;
  getSessions(): Promise<string[]>;
  acquireLock(sessionId: string, timeout?: number): Promise<string | null>;
  releas
  - Type: freemium
- acquireLock(sessionId: string, timeout?: number): Promise<string | null>; releaseLock(sessionId: string, token:
  - Context: mise<void>;
  getSessions(): Promise<string[]>;
  acquireLock(sessionId: string, timeout?: number): Promise<string | null>;
  releaseLock(sessionId: string, token: string): Promise<boolean>;
  extendSess
  - Type: freemium
- Promise<string | null>; releaseLock(sessionId: string, token: string): Promise<boolean>; extendSessionTtl(sessionId: string,
  - Context: string, timeout?: number): Promise<string | null>;
  releaseLock(sessionId: string, token: string): Promise<boolean>;
  extendSessionTtl(sessionId: string, ttl: number): Promise<boolean>;
  getSessionTtl
  - Type: freemium
- string): Promise<boolean>; extendSessionTtl(sessionId: string, ttl: number): Promise<boolean>; getSessionTtl(sessionId: string): Promise<number
  - Context: onId: string, token: string): Promise<boolean>;
  extendSessionTtl(sessionId: string, ttl: number): Promise<boolean>;
  getSessionTtl(sessionId: string): Promise<number | null>;
  createSessionIfNotExist
  - Type: freemium
- ttl: number): Promise<boolean>; getSessionTtl(sessionId: string): Promise<number | null>; createSessionIfNotExists<T>(sessionId: string,
  - Context: ndSessionTtl(sessionId: string, ttl: number): Promise<boolean>;
  getSessionTtl(sessionId: string): Promise<number | null>;
  createSessionIfNotExists<T>(sessionId: string, initialState: T): Promise<T>;

  - Type: freemium
- string, initialState: T): Promise<T>; } export interface RedisSessionStoreOptions { /**
  - Context: string): Promise<number | null>;
  createSessionIfNotExists<T>(sessionId: string, initialState: T): Promise<T>;
}

export interface RedisSessionStoreOptions {
  /**
   * Redis connection URL (e.g., redis
  - Type: freemium
- * Redis-backed implementation of the SessionStore interface.
 * Provides session management with TTL support and distributed locking.
  - Context:  */
  lockTimeout?: number;
}

/**
 * Redis-backed implementation of the SessionStore interface.
 * Provides session management with TTL support and distributed locking.
 */
export class RedisSessionStor
  - Type: freemium
- * Closes the Redis connection
  - Context: n 0
      end
    `;
  }

  /**
   * Closes the Redis connection
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.client && typeof this.client.quit === "function") {
        aw
  - Type: freemium
- */ public async getSession<T>(sessionId: string): Promise<T | null> { try
  - Context: eturns The session data or null if not found
   */
  public async getSession<T>(sessionId: string): Promise<T | null> {
    try {
      if (!this.client) {
        throw new Error("Redis client not conne
  - Type: freemium
- Optional TTL in seconds (uses default if not provided) */
  - Context: param state The session state to store
   * @param ttl Optional TTL in seconds (uses default if not provided)
   */
  public async setSession<T>(
    sessionId: string,
    state: T,
    ttl?: number
  )
  - Type: freemium
- state: T, ttl?: number ): Promise<void> { try { const
  - Context: ded)
   */
  public async setSession<T>(
    sessionId: string,
    state: T,
    ttl?: number
  ): Promise<void> {
    try {
      const ttlValue = ttl || this.defaultTtl;
      await this.client.set(
 
  - Type: freemium
- session to remove */ public async clearSession(sessionId: string): Promise<void> {
  - Context: ram sessionId The ID of the session to remove
   */
  public async clearSession(sessionId: string): Promise<void> {
    try {
      await this.client.del(this.getSessionKey(sessionId));
    } catch (erro
  - Type: freemium
- Array of session IDs */ public async getSessions(): Promise<string[]> {
  - Context:  Gets all active session IDs
   * @returns Array of session IDs
   */
  public async getSessions(): Promise<string[]> {
    try {
      const sessionKeyPattern = `${this.prefix}session:*`;
      const ke
  - Type: freemium
- milliseconds (uses default if not provided) * @returns Lock token
  - Context: ID of the session to lock
   * @param timeout Optional timeout in milliseconds (uses default if not provided)
   * @returns Lock token if successful, null if lock could not be acquired
   */
  public asy
  - Type: freemium
- string, timeout?: number ): Promise<string | null> { try {
  - Context:  not be acquired
   */
  public async acquireLock(
    sessionId: string,
    timeout?: number
  ): Promise<string | null> {
    try {
      const lockTimeout = timeout || this.lockTimeout;
      const l
  - Type: freemium
- Use the Lua sc
  - Context: alse if the token doesn't match
   */
  public async releaseLock(sessionId: string, token: string): Promise<boolean> {
    try {
      const lockKey = this.getLockKey(sessionId);

      // Use the Lua sc
  - Type: freemium
- extendSessionTtl( sessionId: string, ttl: number ): Promise<boolean> { try {
  - Context: on doesn't exist
   */
  public async extendSessionTtl(
    sessionId: string,
    ttl: number
  ): Promise<boolean> {
    try {
      const sessionKey = this.getSessionKey(sessionId);
      const result
  - Type: freemium
- exist */ public async getSessionTtl(sessionId: string): Promise<number | null> {
  - Context: in seconds, or null if session doesn't exist
   */
  public async getSessionTtl(sessionId: string): Promise<number | null> {
    try {
      const sessionKey = this.getSessionKey(sessionId);
      const 
  - Type: freemium
- First check if the session already exists
      const existingSession =
  - Context: )
   */
  public async createSessionIfNotExists<T>(
    sessionId: string,
    initialState: T
  ): Promise<T> {
    try {
      // First check if the session already exists
      const existingSession =
  - Type: freemium
- null>; releaseLock(sessionId: string, token: string): Promise<boolean>; extendSessionTtl(sessionId: string, ttl: number):
  - Context: mber): Promise<string | null>;
  releaseLock(sessionId: string, token: string): Promise<boolean>;
  extendSessionTtl(sessionId: string, ttl: number): Promise<boolean>;
  getSessionTtl(sessionId: string): Pr
  - Type: subscription
- /** * Extends the TTL of a session * @param
  - Context: d to release lock:", error);
      throw new Error("Redis operation failed");
    }
  }

  /**
   * Extends the TTL of a session
   * @param sessionId ID of the session
   * @param ttl New TTL in seconds
  
  - Type: subscription
- if session doesn't exist */ public async extendSessionTtl( sessionId: string,
  - Context: TL in seconds
   * @returns True if successful, false if session doesn't exist
   */
  public async extendSessionTtl(
    sessionId: string,
    ttl: number
  ): Promise<boolean> {
    try {
      const ses
  - Type: subscription
- If result is 1, the TTL was successfully updated
      return result ==
  - Context: ry {
      const sessionKey = this.getSessionKey(sessionId);
      const result = await this.client.expire(sessionKey, ttl);

      // If result is 1, the TTL was successfully updated
      return result ==
  - Type: subscription
- catch (error) { console.error("Failed to extend session TTL:", error); throw
  - Context: uccessfully updated
      return result === 1;
    } catch (error) {
      console.error("Failed to extend session TTL:", error);
      throw new Error("Redis operation failed");
    }
  }

  /**
   * Gets 
  - Type: subscription
- as uuidv4 } from "uuid"; export interface SessionStore { getSession<T>(sessionId:
  - Context: import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

export interface SessionStore {
  getSession<T>(sessionId: string): Promise<T | null>;
  setSession<T>(sessionId: string, state: 
  - Type: marketplace
- * Redis connection URL (e.g., redis://localhost:6379)
  - Context: sionIfNotExists<T>(sessionId: string, initialState: T): Promise<T>;
}

export interface RedisSessionStoreOptions {
  /**
   * Redis connection URL (e.g., redis://localhost:6379)
   */
  redisUrl: string;


  - Type: marketplace
- * Redis-backed implementation of the SessionStore interface.
 * Provides session management with TTL support and distributed locking.
  - Context:  (default: 30000)
   */
  lockTimeout?: number;
}

/**
 * Redis-backed implementation of the SessionStore interface.
 * Provides session management with TTL support and distributed locking.
 */
export clas
  - Type: marketplace
- distributed locking. */ export class RedisSessionStore implements SessionStore { private
  - Context:  Provides session management with TTL support and distributed locking.
 */
export class RedisSessionStore implements SessionStore {
  private client: Redis;
  private prefix: string;
  private defaultTtl: 
  - Type: marketplace
- */ export class RedisSessionStore implements SessionStore { private client: Redis;
  - Context: ment with TTL support and distributed locking.
 */
export class RedisSessionStore implements SessionStore {
  private client: Redis;
  private prefix: string;
  private defaultTtl: number;
  private lockTi
  - Type: marketplace
- * Creates a new RedisSessionStore
   * @param options Configuration options for the Redis session store
  - Context: ockTimeout: number;
  private releaseLockScript: string = "";

  /**
   * Creates a new RedisSessionStore
   * @param options Configuration options for the Redis session store
   */
  constructor(options: 
  - Type: marketplace
- options for the Redis session store */ constructor(options: RedisSessionStoreOptions) {
  - Context:   * Creates a new RedisSessionStore
   * @param options Configuration options for the Redis session store
   */
  constructor(options: RedisSessionStoreOptions) {
    this.client = new Redis(options.redisU
  - Type: marketplace
- Redis session store */ constructor(options: RedisSessionStoreOptions) { this.client = new
  - Context:  options Configuration options for the Redis session store
   */
  constructor(options: RedisSessionStoreOptions) {
    this.client = new Redis(options.redisUrl);
    this.prefix = options.prefix || "mcp:"
  - Type: marketplace
- Otherwise rethrow the original error
      throw err;
    }
  }

  /**
   * Stores a session in Redis
   * @param sessionId The ID of the session
   * @param state The session state
  - Context: w err;
      }
      // Otherwise rethrow the original error
      throw err;
    }
  }

  /**
   * Stores a session in Redis
   * @param sessionId The ID of the session
   * @param state The session state
  - Type: marketplace
- state The session state to store * @param ttl Optional
  - Context: session in Redis
   * @param sessionId The ID of the session
   * @param state The session state to store
   * @param ttl Optional TTL in seconds (uses default if not provided)
   */
  public async setSess
  - Type: marketplace
- If the error is already a "Failed to parse session data" error, just rethrow it
      if (
        err instanceof Error &&
  - Context: new Error("Failed to parse session data");
      }
    } catch (err) {
      // If the error is already a "Failed to parse session data" error, just rethrow it
      if (
        err instanceof Error &&
  - Type: ads
- caching layer * * Provides a tiered caching implementation with:
  - Context: mber | null;
}

/**
 * Redis-backed cache store with optional memory caching layer
 *
 * Provides a tiered caching implementation with:
 * 1. In-memory LRU cache for frequent access
 * 2. Redis-backed dis
  - Type: freemium
- memory caching layer * * Provides a tiered caching implementation
  - Context: piresAt: number | null;
}

/**
 * Redis-backed cache store with optional memory caching layer
 *
 * Provides a tiered caching implementation with:
 * 1. In-memory LRU cache for frequent access
 * 2. Redi
  - Type: freemium
- */ public async get<T>(key: string, namespace?: string): Promise<T | null>
  - Context: ed value or null if not found/expired
   */
  public async get<T>(key: string, namespace?: string): Promise<T | null> {
    const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);

    // 
  - Type: freemium
- value: T, ttl?: number, namespace?: string ): Promise<void> { const
  - Context:   public async set<T>(
    key: string,
    value: T,
    ttl?: number,
    namespace?: string
  ): Promise<void> {
    const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);
    const tt
  - Type: freemium
- */ public async delete(key: string, namespace?: string): Promise<void> { const
  - Context: * @param namespace Optional namespace
   */
  public async delete(key: string, namespace?: string): Promise<void> {
    const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);

    // Remo
  - Type: freemium
- Clear matching item
  - Context: aram namespace Namespace to invalidate
   */
  public async invalidateNamespace(namespace: string): Promise<void> {
    const namespacePrefix = `${this.prefix}${namespace}:*`;

    // Clear matching item
  - Type: freemium
- * Clears the entire cache (both memory and Redis)
  - Context:     }
  }

  /**
   * Clears the entire cache (both memory and Redis)
   */
  public async clear(): Promise<void> {
    // Clear memory cache if enabled
    if (this.useMemoryCache) {
      this.memCache
  - Type: freemium
- string[], namespace?: string ): Promise<Record<string, T | null>> { const
  - Context: null if not found)
   */
  public async getMany<T>(
    keys: string[],
    namespace?: string
  ): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};
    const missingK
  - Type: freemium
- number, namespace?: string ): Promise<void> { const ttlValue = ttl
  - Context: ublic async setMany<T>(
    items: Record<string, T>,
    ttl?: number,
    namespace?: string
  ): Promise<void> {
    const ttlValue = ttl ?? this.defaultTtl;
    const now = Date.now();

    // Update
  - Type: freemium
- T; timestamp: number; expiresAt: number | null; } /** *
  - Context: rface for cached item with metadata
 */
interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiresAt: number | null;
}

/**
 * Redis-backed cache store with optional memory caching layer
 *
 * Prov
  - Type: subscription
- Cached value or null if not found/expired */ public async
  - Context:  Cache key
   * @param namespace Optional namespace
   * @returns Cached value or null if not found/expired
   */
  public async get<T>(key: string, namespace?: string): Promise<T | null> {
    const cacheK
  - Type: subscription
- Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCach
  - Context:   const memItem = this.memCache.get(cacheKey);
      if (memItem) {
        // Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCach
  - Type: subscription
- Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
          ret
  - Context: che.get(cacheKey);
      if (memItem) {
        // Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
          ret
  - Type: subscription
- Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
          return memItem.value as T;
  - Context: emItem) {
        // Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
          return memItem.value as T;
      
  - Type: subscription
- Remove expired item from memory cache
          this.memCache.delete(cacheKey);
        }
      }
      this.memC
  - Context: his.memCacheStats.hits++;
          return memItem.value as T;
        } else {
          // Remove expired item from memory cache
          this.memCache.delete(cacheKey);
        }
      }
      this.memC
  - Type: subscription
- Update memory cache if enabled
  - Context:  const now = Date.now();

    const item: CacheItem<T> = {
      value,
      timestamp: now,
      expiresAt: ttlValue > 0 ? now + ttlValue * 1000 : null,
    };

    // Update memory cache if enabled
    
  - Type: subscription
- ( memItem && (memItem.expiresAt === null || memItem.expiresAt > Date.now())
  - Context:   const memItem = this.memCache.get(cacheKey);
        if (
          memItem &&
          (memItem.expiresAt === null || memItem.expiresAt > Date.now())
        ) {
          result[key] = memItem.value as
  - Type: subscription
- (memItem.expiresAt === null || memItem.expiresAt > Date.now()) ) { result[key]
  - Context: e.get(cacheKey);
        if (
          memItem &&
          (memItem.expiresAt === null || memItem.expiresAt > Date.now())
        ) {
          result[key] = memItem.value as T;
          this.memCacheSta
  - Type: subscription
- Remove expi
  - Context: is.memCacheStats.hits++;
        } else {
          if (
            memItem &&
            memItem.expiresAt !== null &&
            memItem.expiresAt <= Date.now()
          ) {
            // Remove expi
  - Type: subscription
- Remove expired item from memory cache
            thi
  - Context:           if (
            memItem &&
            memItem.expiresAt !== null &&
            memItem.expiresAt <= Date.now()
          ) {
            // Remove expired item from memory cache
            thi
  - Type: subscription
- Remove expired item from memory cache
            this.memCache.delete(cacheKey);
          }
          missingKe
  - Context: piresAt !== null &&
            memItem.expiresAt <= Date.now()
          ) {
            // Remove expired item from memory cache
            this.memCache.delete(cacheKey);
          }
          missingKe
  - Type: subscription
- Update memory cache if enab
  - Context: espace);

        const item: CacheItem<T> = {
          value,
          timestamp: now,
          expiresAt: ttlValue > 0 ? now + ttlValue * 1000 : null,
        };

        // Update memory cache if enab
  - Type: subscription
- * Configuration options for the Redis Cache Store
  - Context: m "ioredis";
import { createHash } from "crypto";

/**
 * Configuration options for the Redis Cache Store
 */
export interface RedisCacheStoreOptions {
  /**
   * Redis connection URL (e.g., redis://localh
  - Type: marketplace
- } /** * Redis-backed cache store with optional memory caching
  - Context: Item<T> {
  value: T;
  timestamp: number;
  expiresAt: number | null;
}

/**
 * Redis-backed cache store with optional memory caching layer
 *
 * Provides a tiered caching implementation with:
 * 1. In-me
  - Type: marketplace
- cache hit rate tracking */ export class RedisCacheStore { private
  - Context:  * - Batch operations for efficiency
 * - Memory cache hit rate tracking
 */
export class RedisCacheStore {
  private client: Redis;
  private prefix: string;
  private defaultTtl: number;
  private useMem
  - Type: marketplace
- * Creates a new RedisCacheStore
   * @param options Configuration options
  - Context: memCacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
  };

  /**
   * Creates a new RedisCacheStore
   * @param options Configuration options
   */
  constructor(options: RedisCacheStoreOptions) {
  
  - Type: marketplace
- Configuration options */ constructor(options: RedisCacheStoreOptions) { this.client = new Redis(options.redisUrl);
  - Context: ew RedisCacheStore
   * @param options Configuration options
   */
  constructor(options: RedisCacheStoreOptions) {
    this.client = new Redis(options.redisUrl);
    this.prefix = options.prefix || "mcp:c
  - Type: marketplace
- * Interface for cached item with metadata
  - Context: mory caching layer (default: true)
   */
  useMemoryCache?: boolean;
}

/**
 * Interface for cached item with metadata
 */
interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiresAt: number | n
  - Type: marketplace
- Memory cache implementation
  private memCache: Map<string, CacheItem<any>> = new Map();
  private memCacheSize: number;
  private memCacheStats = {
    hits: 0,
    mis
  - Context: ate useMemoryCache: boolean;

  // Memory cache implementation
  private memCache: Map<string, CacheItem<any>> = new Map();
  private memCacheSize: number;
  private memCacheStats = {
    hits: 0,
    mis
  - Type: marketplace
- } /** * Gets an item from cache * @param
  - Context: ngify(data);
    return createHash("sha256").update(jsonStr).digest("hex");
  }

  /**
   * Gets an item from cache
   * @param key Cache key
   * @param namespace Optional namespace
   * @returns Cached 
  - Type: marketplace
- Try memory cache first if enabled
    if (this.useMemoryCache) {
      const memItem = this.memCache.get(cacheKey);
      if (memItem) {
        // Check if the item is expired
  - Context: namespace);

    // Try memory cache first if enabled
    if (this.useMemoryCache) {
      const memItem = this.memCache.get(cacheKey);
      if (memItem) {
        // Check if the item is expired
       
  - Type: marketplace
- Check if the item is expired
        if (memItem.expiresAt === null || memItem.expire
  - Context: bled
    if (this.useMemoryCache) {
      const memItem = this.memCache.get(cacheKey);
      if (memItem) {
        // Check if the item is expired
        if (memItem.expiresAt === null || memItem.expire
  - Type: marketplace
- Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          th
  - Context: ) {
      const memItem = this.memCache.get(cacheKey);
      if (memItem) {
        // Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          th
  - Type: marketplace
- Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
  - Context: memCache.get(cacheKey);
      if (memItem) {
        // Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
      
  - Type: marketplace
- Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
          return memItem.value as T;
  - Context: if (memItem) {
        // Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
          return memItem.value as T;
  - Type: marketplace
- Remove expired item from memory cache
          this.memC
  - Context:  null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
          return memItem.value as T;
        } else {
          // Remove expired item from memory cache
          this.memC
  - Type: marketplace
- Remove expired item from memory cache
          this.memCache.delete(cacheKey);
        }
      }
      this.memCacheSt
  - Context: acheStats.hits++;
          return memItem.value as T;
        } else {
          // Remove expired item from memory cache
          this.memCache.delete(cacheKey);
        }
      }
      this.memCacheSt
  - Type: marketplace
- Update memory cache if enabled
      if (this.useMemo
  - Context: ata = await this.client.get(cacheKey);
      if (!data) {
        return null;
      }

      const item = JSON.parse(data) as CacheItem<T>;

      // Update memory cache if enabled
      if (this.useMemo
  - Type: marketplace
- Update memory cache if enabled
      if (this.useMemoryCache) {
        this.setMemor
  - Context: eKey);
      if (!data) {
        return null;
      }

      const item = JSON.parse(data) as CacheItem<T>;

      // Update memory cache if enabled
      if (this.useMemoryCache) {
        this.setMemor
  - Type: marketplace
- (error) { console.error("Failed to get item f
  - Context: date memory cache if enabled
      if (this.useMemoryCache) {
        this.setMemoryCache(cacheKey, item);
      }

      return item.value;
    } catch (error) {
      console.error("Failed to get item f
  - Type: marketplace
- (error) { console.error("Failed to get item from Redis cache:", error);
  - Context:       if (this.useMemoryCache) {
        this.setMemoryCache(cacheKey, item);
      }

      return item.value;
    } catch (error) {
      console.error("Failed to get item from Redis cache:", error);
  
  - Type: marketplace
- Fail open for cache issues
    }
  }

  /**
   *
  - Context: , item);
      }

      return item.value;
    } catch (error) {
      console.error("Failed to get item from Redis cache:", error);
      return null; // Fail open for cache issues
    }
  }

  /**
   * 
  - Type: marketplace
- Fail open for cache issues
    }
  }

  /**
   * Sets an item in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl TTL in seco
  - Context: dis cache:", error);
      return null; // Fail open for cache issues
    }
  }

  /**
   * Sets an item in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl TTL in seco
  - Type: marketplace
- now = Date.now(); const item: CacheItem<T> = { value, timestamp:
  - Context: y), namespace);
    const ttlValue = ttl ?? this.defaultTtl;
    const now = Date.now();

    const item: CacheItem<T> = {
      value,
      timestamp: now,
      expiresAt: ttlValue > 0 ? now + ttlValue
  - Type: marketplace
- Date.now(); const item: CacheItem<T> = { value, timestamp: now, expiresAt:
  - Context: ce);
    const ttlValue = ttl ?? this.defaultTtl;
    const now = Date.now();

    const item: CacheItem<T> = {
      value,
      timestamp: now,
      expiresAt: ttlValue > 0 ? now + ttlValue * 1000 : n
  - Type: marketplace
- Update Redis cache
    try {
      if (ttlValue > 0) {
        await this.client.se
  - Context: / Update memory cache if enabled
    if (this.useMemoryCache) {
      this.setMemoryCache(cacheKey, item);
    }

    // Update Redis cache
    try {
      if (ttlValue > 0) {
        await this.client.se
  - Type: marketplace
- (ttlValue > 0) { await this.client.set(cacheKey, JSON.stringify(item), "EX", ttlValue); }
  - Context: is cache
    try {
      if (ttlValue > 0) {
        await this.client.set(cacheKey, JSON.stringify(item), "EX", ttlValue);
      } else {
        await this.client.set(cacheKey, JSON.stringify(item));
  
  - Type: marketplace
- (error) { console.error("Failed to set item in Redis cache:", error);
  - Context: ngify(item), "EX", ttlValue);
      } else {
        await this.client.set(cacheKey, JSON.stringify(item));
      }
    } catch (error) {
      console.error("Failed to set item in Redis cache:", error);

  - Type: marketplace
- Continue even if Redis fails - we still have memory cache
    }
  - Context: t(cacheKey, JSON.stringify(item));
      }
    } catch (error) {
      console.error("Failed to set item in Redis cache:", error);
      // Continue even if Redis fails - we still have memory cache
    }

  - Type: marketplace
- Continue even if Redis fails - we still have memory cache
    }
  }

  /**
   * Adds item to memory cache with LRU eviction if needed
   * @param key Cache key
   * @param item Cache item w
  - Context: ror);
      // Continue even if Redis fails - we still have memory cache
    }
  }

  /**
   * Adds item to memory cache with LRU eviction if needed
   * @param key Cache key
   * @param item Cache item w
  - Type: marketplace
- ** * Adds item to memory cache with
  - Context: **
   * Adds item to memory cache with LRU eviction if needed
   * @param key Cache key
   * @param item Cache item with value and metadata
   */
  private setMemoryCache<T>(key: string, item: CacheItem<T
  - Type: marketplace
- s item to memory cache with
  - Context: s item to memory cache with LRU eviction if needed
   * @param key Cache key
   * @param item Cache item with value and metadata
   */
  private setMemoryCache<T>(key: string, item: CacheItem<T>): void {

  - Type: marketplace
- Clean up memory cache using LRU when it gets too large
    if (this.m
  - Context: 
   * @param item Cache item with value and metadata
   */
  private setMemoryCache<T>(key: string, item: CacheItem<T>): void {
    // Clean up memory cache using LRU when it gets too large
    if (this.m
  - Type: marketplace
- Clean up memory cache using LRU when it gets too large
    if (this.memCache.siz
  - Context: m item Cache item with value and metadata
   */
  private setMemoryCache<T>(key: string, item: CacheItem<T>): void {
    // Clean up memory cache using LRU when it gets too large
    if (this.memCache.siz
  - Type: marketplace
- } /** * Removes an item from the cache *
  - Context: if (oldestKey) {
        this.memCache.delete(oldestKey);
      }
    }

    this.memCache.set(key, item);
    this.memCacheStats.sets++;
  }

  /**
   * Removes an item from the cache
   * @param key Cac
  - Type: marketplace
- * Removes an item from the cache
   * @param key Cache key
   * @param namespace Optional namespace
  - Context: 
    }

    this.memCache.set(key, item);
    this.memCacheStats.sets++;
  }

  /**
   * Removes an item from the cache
   * @param key Cache key
   * @param namespace Optional namespace
   */
  public as
  - Type: marketplace
- (error) { console.error("Failed to delete item from Redis cache:", error);
  - Context: 
      await this.client.del(cacheKey);
    } catch (error) {
      console.error("Failed to delete item from Redis cache:", error);
    }
  }

  /**
   * Invalidates all items in a namespace
   * @param 
  - Type: marketplace
- * Invalidates all items in a namespace
   * @param namespace Namespace to invalidate
  - Context: sole.error("Failed to delete item from Redis cache:", error);
    }
  }

  /**
   * Invalidates all items in a namespace
   * @param namespace Namespace to invalidate
   */
  public async invalidateNamesp
  - Type: marketplace
- Clear matching items from memory cache if enabled
    if (this.useMemoryCache) {
      for (const key of this.memCache.
  - Context:  Promise<void> {
    const namespacePrefix = `${this.prefix}${namespace}:*`;

    // Clear matching items from memory cache if enabled
    if (this.useMemoryCache) {
      for (const key of this.memCache.
  - Type: marketplace
- Clear matching items from Redis
    try {
      const keys = await this.client.keys(namespacePrefix);
      if (keys.le
  - Context: amespace}:`)) {
          this.memCache.delete(key);
        }
      }
    }

    // Clear matching items from Redis
    try {
      const keys = await this.client.keys(namespacePrefix);
      if (keys.le
  - Type: marketplace
- * Gets multiple items from cache in a single batch
  - Context: ) {
      console.error("Failed to clear Redis cache:", error);
    }
  }

  /**
   * Gets multiple items from cache in a single batch operation
   * @param keys Array of cache keys
   * @param namespace 
  - Type: marketplace
- = key; const memItem = this.memCache.get(cacheKey); if ( memItem &&
  - Context: CacheKey(this.createKeyHash(key), namespace);
        keyMapping[cacheKey] = key;

        const memItem = this.memCache.get(cacheKey);
        if (
          memItem &&
          (memItem.expiresAt === n
  - Type: marketplace
- = this.memCache.get(cacheKey); if ( memItem && (memItem.expiresAt === null ||
  - Context: ng[cacheKey] = key;

        const memItem = this.memCache.get(cacheKey);
        if (
          memItem &&
          (memItem.expiresAt === null || memItem.expiresAt > Date.now())
        ) {
          r
  - Type: marketplace
- ( memItem && (memItem.expiresAt === null || memItem.expiresAt > Date.now())
  - Context:        const memItem = this.memCache.get(cacheKey);
        if (
          memItem &&
          (memItem.expiresAt === null || memItem.expiresAt > Date.now())
        ) {
          result[key] = memItem.v
  - Type: marketplace
- (memItem.expiresAt === null || memItem.expiresAt > Date.now()) ) { result[key]
  - Context: mCache.get(cacheKey);
        if (
          memItem &&
          (memItem.expiresAt === null || memItem.expiresAt > Date.now())
        ) {
          result[key] = memItem.value as T;
          this.memC
  - Type: marketplace
- > Date.now()) ) { result[key] = memItem.value as T; this.memCacheStats.hits++;
  - Context: emItem.expiresAt === null || memItem.expiresAt > Date.now())
        ) {
          result[key] = memItem.value as T;
          this.memCacheStats.hits++;
        } else {
          if (
            memIte
  - Type: marketplace
- } else { if ( memItem && memItem.expiresAt !== null
  - Context: tem.value as T;
          this.memCacheStats.hits++;
        } else {
          if (
            memItem &&
            memItem.expiresAt !== null &&
            memItem.expiresAt <= Date.now()
          
  - Type: marketplace
- if ( memItem && memItem.expiresAt !== null && memItem.expiresAt <=
  - Context:    this.memCacheStats.hits++;
        } else {
          if (
            memItem &&
            memItem.expiresAt !== null &&
            memItem.expiresAt <= Date.now()
          ) {
            // Remo
  - Type: marketplace
- Remove expired item from memory cache
  - Context: se {
          if (
            memItem &&
            memItem.expiresAt !== null &&
            memItem.expiresAt <= Date.now()
          ) {
            // Remove expired item from memory cache
        
  - Type: marketplace
- Remove expired item from memory cache
            this.memCache.delete(cacheKey);
          }
          missingKeys.pus
  - Context: !== null &&
            memItem.expiresAt <= Date.now()
          ) {
            // Remove expired item from memory cache
            this.memCache.delete(cacheKey);
          }
          missingKeys.pus
  - Type: marketplace
- Update memory cache if enabled
  - Context: 
          result[originalKey] = null;
          continue;
        }

        try {
          const item = JSON.parse(data as string) as CacheItem<T>;

          // Update memory cache if enabled
        
  - Type: marketplace
- Update memory cache if enabled
          if (this.useMemoryCache) {
            c
  - Context:        continue;
        }

        try {
          const item = JSON.parse(data as string) as CacheItem<T>;

          // Update memory cache if enabled
          if (this.useMemoryCache) {
            c
  - Type: marketplace
- namespace ); this.setMemoryCache(cacheKey, item); } result[originalKey] = item.value; } catch
  - Context: Hash(originalKey),
              namespace
            );
            this.setMemoryCache(cacheKey, item);
          }

          result[originalKey] = item.value;
        } catch (parseError) {
         
  - Type: marketplace
- } result[originalKey] = item.value; } catch (parseError) { console.error("Failed to
  - Context:    );
            this.setMemoryCache(cacheKey, item);
          }

          result[originalKey] = item.value;
        } catch (parseError) {
          console.error("Failed to parse Redis cache item:", 
  - Type: marketplace
- { console.error("Failed to parse Redis cache item:", parseError); result[originalKey] =
  - Context: ] = item.value;
        } catch (parseError) {
          console.error("Failed to parse Redis cache item:", parseError);
          result[originalKey] = null;
        }
      }
    } catch (error) {
     
  - Type: marketplace
- Set remaining keys to null
      for (const key of missingKey
  - Context: ult[originalKey] = null;
        }
      }
    } catch (error) {
      console.error("Failed to get items from Redis cache:", error);
      // Set remaining keys to null
      for (const key of missingKey
  - Type: marketplace
- Sets multiple items in the cache in a single batch
  - Context:       result[key] = null;
        }
      }
    }

    return result;
  }

  /**
   * Sets multiple items in the cache in a single batch operation
   * @param items Object mapping keys to values
   * @par
  - Type: marketplace
- single batch operation * @param items Object mapping keys to
  - Context: rn result;
  }

  /**
   * Sets multiple items in the cache in a single batch operation
   * @param items Object mapping keys to values
   * @param ttl TTL in seconds (optional, uses default if not specif
  - Type: marketplace
- Optional namespace */ public async setMany<T>( items: Record<string, T>, ttl?:
  - Context: ult if not specified)
   * @param namespace Optional namespace
   */
  public async setMany<T>(
    items: Record<string, T>,
    ttl?: number,
    namespace?: string
  ): Promise<void> {
    const ttlVal
  - Type: marketplace
- = this.client.pipeline(); for (const [key, value] of Object.entries(items)) { const
  - Context: y {
      const pipeline = this.client.pipeline();

      for (const [key, value] of Object.entries(items)) {
        const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);

        const 
  - Type: marketplace
- this.getCacheKey(this.createKeyHash(key), namespace); const item: CacheItem<T> = { value, timestamp: now,
  - Context: s)) {
        const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);

        const item: CacheItem<T> = {
          value,
          timestamp: now,
          expiresAt: ttlValue > 0 ? no
  - Type: marketplace
- const item: CacheItem<T> = { value, timestamp: now, expiresAt: ttlValue
  - Context:    const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);

        const item: CacheItem<T> = {
          value,
          timestamp: now,
          expiresAt: ttlValue > 0 ? now + ttlValu
  - Type: marketplace
- Add to Redis pipeline
        if (ttlValue > 0) {
          pipeline.set(ca
  - Context:  memory cache if enabled
        if (this.useMemoryCache) {
          this.setMemoryCache(cacheKey, item);
        }

        // Add to Redis pipeline
        if (ttlValue > 0) {
          pipeline.set(ca
  - Type: marketplace
- pipeline if (ttlValue > 0) { pipeline.set(cacheKey, JSON.stringify(item), "EX", ttlValue);
  - Context: / Add to Redis pipeline
        if (ttlValue > 0) {
          pipeline.set(cacheKey, JSON.stringify(item), "EX", ttlValue);
        } else {
          pipeline.set(cacheKey, JSON.stringify(item));
       
  - Type: marketplace
- } else { pipeline.set(cacheKey, JSON.stringify(item)); } } await pipeline.exec(); }
  - Context: .stringify(item), "EX", ttlValue);
        } else {
          pipeline.set(cacheKey, JSON.stringify(item));
        }
      }

      await pipeline.exec();
    } catch (error) {
      console.error("Faile
  - Type: marketplace
- * Interface for cached item with metadata
  - Context: layer (default: true)
   */
  useMemoryCache?: boolean;
}

/**
 * Interface for cached item with metadata
 */
interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiresAt: number | null;
}

/**
  - Type: ads
- Continue even if Redis fails - we still have memory cache
    }
  }

  /**
   * Adds item to memory cache with LRU eviction if needed
   * @param key Cache key
   * @param item Cache
  - Context: ", error);
      // Continue even if Redis fails - we still have memory cache
    }
  }

  /**
   * Adds item to memory cache with LRU eviction if needed
   * @param key Cache key
   * @param item Cache
  - Type: ads
- Clean up memor
  - Context: with LRU eviction if needed
   * @param key Cache key
   * @param item Cache item with value and metadata
   */
  private setMemoryCache<T>(key: string, item: CacheItem<T>): void {
    // Clean up memor
  - Type: ads
- Add to Redis pipeline
        if (ttlValue > 0) {
          pipeline.set(cacheKey, JSON.stringify(item
  - Context:     if (this.useMemoryCache) {
          this.setMemoryCache(cacheKey, item);
        }

        // Add to Redis pipeline
        if (ttlValue > 0) {
          pipeline.set(cacheKey, JSON.stringify(item
  - Type: ads
- = { debug: (message: string): void => { if (process.env.DEBUG
  - Context: ility for the application
 */
export const logger = {
  debug: (message: string): void => {
    if (process.env.DEBUG === "true") {
      console.debug(`[DEBUG] ${message}`);
    }
  },

  info: (message
  - Type: freemium
- string, useCached?: boolean ): Promise<ToolExecutionResult>; /** * Retrieves all available
  - Context: cuteTool(
    toolId: string,
    params: any,
    sessionId?: string,
    useCached?: boolean
  ): Promise<ToolExecutionResult>;

  /**
   * Retrieves all available tools
   *
   * @returns Map of tools
  - Type: freemium
- sessionId?: string): Promise<void>; /** * Clears all state and cached
  - Context:  session ID to scope invalidation
   */
  invalidateToolCache?(toolId: string, sessionId?: string): Promise<void>;

  /**
   * Clears all state and cached results for a session
   *
   * @param sessionId
  - Type: freemium
- * Disconnects any resources used by the service
  - Context:  a session
   *
   * @param sessionId Session ID to clear
   */
  clearSession?(sessionId: string): Promise<void>;

  /**
   * Disconnects any resources used by the service
   */
  disconnect?(): Promise
  - Type: freemium
- * Gets service statistics
   *
   * @returns Service statistics
  - Context: id>;

  /**
   * Gets service statistics
   *
   * @returns Service statistics
   */
  getStats?(): Promise<any>;
}

  - Type: freemium
- import fs from "fs"; import path from "path"; import crypto
  - Context: import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import os from "os
  - Type: freemium
- If it's a local directory that exists, just return it
  if (fs.existsSync(pathOr
  - Context: y cloning or updating an existing clone
 */
export async function getRepository(pathOrUrl: string): Promise<string> {
  // If it's a local directory that exists, just return it
  if (fs.existsSync(pathOr
  - Type: freemium
- Add file if it matches the extension filter or no filter is provided
        results.push(path.relative(absolutePath, fullPath));
      }
    }
  }
  
  traverseDi
  - Context: xt => file.endsWith(ext))) {
        // Add file if it matches the extension filter or no filter is provided
        results.push(path.relative(absolutePath, fullPath));
      }
    }
  }
  
  traverseDi
  - Type: freemium
- Store in cache
    await repoCacheDb.run(
      "INSERT OR REPLACE INTO repositories (url, localPath, las
  - Context: from ${pathOrUrl} to ${repoPath}`);
    execSync(`git clone ${pathOrUrl} ${repoPath}`);
    
    // Store in cache
    await repoCacheDb.run(
      "INSERT OR REPLACE INTO repositories (url, localPath, las
  - Type: marketplace
- Check if repository is already cached
  const existingRepo = await repoCacheDb.get(
    "SELECT localPath, lastUpdated FROM repos
  - Context: w new Error("Failed to initialize repository cache database");
  }

  // Check if repository is already cached
  const existingRepo = await repoCacheDb.get(
    "SELECT localPath, lastUpdated FROM repos
  - Type: ads
- } const files = fs.readdirSync(currentPath); for (const file of files)
  - Context: console.warn(`Path doesn't exist: ${currentPath}`);
      return;
    }
    
    const files = fs.readdirSync(currentPath);
    
    for (const file of files) {
      const fullPath = path.join(currentP
  - Type: ads
- Add file if it matches the extension filter or no filter is provided
        results.push(path.relativ
  - Context: 
        }
      } else if (!extensions || extensions.some(ext => file.endsWith(ext))) {
        // Add file if it matches the extension filter or no filter is provided
        results.push(path.relativ
  - Type: ads
- a consistent response format * and provide runtime validation of
  - Context:  tool responses
 *
 * These functions help ensure all tools use a consistent response format
 * and provide runtime validation of responses. Standardized responses make
 * it easier for AI agents to unde
  - Type: freemium
- agents to understand and process the results of tool *
  - Context: e validation of responses. Standardized responses make
 * it easier for AI agents to understand and process the results of tool
 * executions.
 *
 * The standard format includes:
 * - A data field contai
  - Type: freemium
- milliseconds (calculated if not provided) * @returns A standardized tool
  - Context: ated result IDs
 * @param options.executionTime - Execution time in milliseconds (calculated if not provided)
 * @returns A standardized tool response object
 *
 * @example
 * ```typescript
 * // Simple 
  - Type: freemium
- milliseconds (calculated if not provided) * @returns A standardized error
  - Context: ning operations
 * @param options.executionTime - Execution time in milliseconds (calculated if not provided)
 * @returns A standardized error response object
 *
 * @example
 * ```typescript
 * // Simple
  - Type: freemium
- Basic usage
  - Context: or chaining operations
 * @param options.relatedResults - Array of related result IDs
 * @returns A promise that resolves to a standardized tool response
 *
 * @example
 * ```typescript
 * // Basic usage
  - Type: freemium
- Basic usage
 * const response = await executeWithTiming(
 *   'analyze-code',
 *   async () => {
 *     /
  - Context: turns A promise that resolves to a standardized tool response
 *
 * @example
 * ```typescript
 * // Basic usage
 * const response = await executeWithTiming(
 *   'analyze-code',
 *   async () => {
 *     /
  - Type: freemium
- export async function executeWithTiming<T>( tool: string, fn: () => Promise<T>,
  - Context: .0'
 *   }
 * );
 * ```
 */
export async function executeWithTiming<T>(
  tool: string,
  fn: () => Promise<T>,
  options?: {
    version?: string;
    sessionId?: string;
    relatedResults?: string[];

  - Type: freemium
- relatedResults?: string[]; } ): Promise<ToolResponse<T>> { const startTime = Date.now();
  - Context: ,
  options?: {
    version?: string;
    sessionId?: string;
    relatedResults?: string[];
  }
): Promise<ToolResponse<T>> {
  const startTime = Date.now();

  try {
    const data = await fn();
    re
  - Type: freemium
- Apply transform function if provided, otherwise use array as is
  const combinedData = options?.transform
    ? options.transform(d
  - Context: ual data pieces
  const dataItems = responses.map((r) => r.data);

  // Apply transform function if provided, otherwise use array as is
  const combinedData = options?.transform
    ? options.transform(d
  - Type: freemium
- Extract the individual data pieces
  const dataItems = responses.map((r) => r.data);

  // Apply transform function if provided, otherwise use array as
  - Context: ?: (data: any[]) => T;
  }
): ToolResponse<T> {
  // Extract the individual data pieces
  const dataItems = responses.map((r) => r.data);

  // Apply transform function if provided, otherwise use array as
  - Type: marketplace
- Collect all the related results
  const relatedResults:
  - Context: ed, otherwise use array as is
  const combinedData = options?.transform
    ? options.transform(dataItems)
    : (dataItems as unknown as T);

  // Collect all the related results
  const relatedResults: 
  - Type: marketplace
- Collect all the related results
  const relatedResults: string[] = [];
  r
  - Context: array as is
  const combinedData = options?.transform
    ? options.transform(dataItems)
    : (dataItems as unknown as T);

  // Collect all the related results
  const relatedResults: string[] = [];
  r
  - Type: marketplace
- containing the actual response content * - Metadata about the
  - Context: *
 * The standard format includes:
 * - A data field containing the actual response content
 * - Metadata about the tool execution (timing, version, etc.)
 * - Status information (success/error, codes, 
  - Type: ads
- a standardized response format * that includes metadata, status information,
  - Context: nse
 *
 * This function wraps any data object in a standardized response format
 * that includes metadata, status information, and optional context. The
 * response is validated against the ToolResponse
  - Type: ads
- generating the response * @param options - Additional options for
  - Context: rializable value)
 * @param tool - The name of the tool generating the response
 * @param options - Additional options for customizing the response
 * @param options.version - Tool version (defaults to 
  - Type: ads
- Success response with additional options
 * const advancedResponse = createSuccessResponse(
 *   { dependencies: ['react', '
  - Context: se(
 *   { files: 42, lines: 1024 },
 *   'count-code-metrics'
 * );
 *
 * // Success response with additional options
 * const advancedResponse = createSuccessResponse(
 *   { dependencies: ['react', '
  - Type: ads
- Success response with additional options
 * const advancedResponse = createSuccessResponse(
 *   { dependencies: ['react', 'lodash'] },
 *   'analyze-de
  - Context:  1024 },
 *   'count-code-metrics'
 * );
 *
 * // Success response with additional options
 * const advancedResponse = createSuccessResponse(
 *   { dependencies: ['react', 'lodash'] },
 *   'analyze-de
  - Type: ads
- const response: ToolResponse<T> = { data, metadata: { tool, version:
  - Context:  - options.executionTime
      : undefined;

  const response: ToolResponse<T> = {
    data,
    metadata: {
      tool,
      version: options?.version || "1.0.0",
      executionTime: options?.executi
  - Type: ads
- Add context if we have session information
  if (options?.sessionId || options?.relatedResults) {
  - Context:  Date().toISOString(),
    },
    status: {
      success: true,
      code: 200,
    },
  };

  // Add context if we have session information
  if (options?.sessionId || options?.relatedResults) {
    
  - Type: ads
- If we need to calculate execution time
  if (startTime) {
    response.metadata.executionTime = Date.now() - startTime;
  }

  // Validate the response structure
  try {
    To
  - Context: Results,
    };
  }

  // If we need to calculate execution time
  if (startTime) {
    response.metadata.executionTime = Date.now() - startTime;
  }

  // Validate the response structure
  try {
    To
  - Type: ads
- tool generating the error * @param options - Additional options
  - Context: bing what went wrong
 * @param tool - The name of the tool generating the error
 * @param options - Additional options for customizing the error response
 * @param options.code - HTTP-like status code (
  - Type: ads
- Error with additional details
 * const detailedError = createErrorResponse(
 *   'Invalid parameter format',
 *
  - Context: eateErrorResponse(
 *   'Repository not found',
 *   'analyze-repository'
 * );
 *
 * // Error with additional details
 * const detailedError = createErrorResponse(
 *   'Invalid parameter format',
 *  
  - Type: ads
- null> = { data: options?.data || null, metadata: { tool,
  - Context:  : undefined;

  const response: ToolResponse<T | null> = {
    data: options?.data || null,
    metadata: {
      tool,
      version: options?.version || "1.0.0",
      executionTime: options?.executi
  - Type: ads
- Add context if we have session information
  if (options?.sessionId) {
    response.context = {
  - Context:  status: {
      success: false,
      code: options?.code || 400,
      message,
    },
  };

  // Add context if we have session information
  if (options?.sessionId) {
    response.context = {
      
  - Type: ads
- to execute and time * @param options - Additional options
  - Context: f the tool being executed
 * @param fn - The async function to execute and time
 * @param options - Additional options for the response
 * @param options.version - Tool version (defaults to '1.0.0')
 * 
  - Type: ads
- Perform analysis...
 *     return { complexity: 15, functions: 5 };
 *   }
 * );
 *
 * // With additional options
 * const response = await executeWithTiming(
 *   'analyze-repository',
 *   async
  - Context:   // Perform analysis...
 *     return { complexity: 15, functions: 5 };
 *   }
 * );
 *
 * // With additional options
 * const response = await executeWithTiming(
 *   'analyze-repository',
 *   async 
  - Type: ads
- to work with just the payload. * * @param response
  - Context: ield from a standard tool response,
 * which can be useful when you want to work with just the payload.
 *
 * @param response - The full tool response
 * @returns Just the data portion
 *
 * @example
 *
  - Type: ads
- * a single response. It merges metadata like execution time
  - Context:  utility takes an array of tool responses and combines them into
 * a single response. It merges metadata like execution time and related
 * results, and can optionally transform the combined data with 
  - Type: ads
- the composite tool * @param options - Additional options for
  - Context:  Array of tool responses to combine
 * @param tool - Name of the composite tool
 * @param options - Additional options for the combined response
 * @param options.version - Tool version (defaults to '1.
  - Type: ads
- = responses.reduce( (sum, r) => sum + r.metadata.executionTime, 0 );
  - Context: late total execution time
  const totalExecutionTime = responses.reduce(
    (sum, r) => sum + r.metadata.executionTime,
    0
  );

  return createSuccessResponse(combinedData, tool, {
    version: opt
  - Type: ads
- Outputs: 42
 * ```
 */
export function extract
  - Context: ript
 * const response = createSuccessResponse({ count: 42 }, 'count-things');
 * const data = extractResponseData(response);
 * console.log(data.count); // Outputs: 42
 * ```
 */
export function extract
  - Type: ads
- Outputs: 42
 * ```
 */
export function extractResponseData<T>(response: ToolResponse<T>): T {
  return response.data;
}

/**
 * Combine multiple re
  - Context: tResponseData(response);
 * console.log(data.count); // Outputs: 42
 * ```
 */
export function extractResponseData<T>(response: ToolResponse<T>): T {
  return response.data;
}

/**
 * Combine multiple re
  - Type: ads
- them. The discovery * system provides: * * 1. A
  - Context: vailable tools
 * in the MCP server, their parameters, and how to use them. The discovery
 * system provides:
 *
 * 1. A way to list all available tools with filtering options
 * 2. Detailed information 
  - Type: freemium
- need to determine which tools * are most appropriate for
  - Context: ls
 *
 * This is particularly useful for AI agents that need to determine which tools
 * are most appropriate for a given task.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
i
  - Type: freemium
- given task. */ import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; import
  - Context:  which tools
 * are most appropriate for a given task.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createSuccessResponse,
  createErrorRe
  - Type: freemium
- Whether the parameter must be provided
  - Context: able description of the parameter */
    description: string;
    /** Whether the parameter must be provided */
    required: boolean;
    /** Default value if not provided */
    default?: any;
    /** 
  - Type: freemium
- Usage examples for the tool
  - Context: 
  }[];
  /** Usage examples for the tool */
  examples?: {
    /** Description of what the example demonstrates */
    description: string;
    /** Sample parameter values */
    parameters: Record<strin
  - Type: freemium
- * * These tools provide AI agents with the ability
  - Context: ool
 * 3. visualize-tool-relationships: Visualizes how tools relate to each other
 *
 * These tools provide AI agents with the ability to discover and understand
 * the available functionality of the MCP
  - Type: freemium
- @example * ```typescript * import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
  - Context: ance to register tools with
 * @example
 * ```typescript
 * import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
 * import { registerToolDiscoveryFeatures } from "./utils/tool-discovery.j
  - Type: freemium
- list of known tools, but in a * production environment,
  - Context:  in the MCP server.
 * In this implementation, it returns a static list of known tools, but in a
 * production environment, it would introspect the server to dynamically discover
 * all registered tools 
  - Type: freemium
- "language", type: "string", description: "Programming language of the code", required:
  - Context: 
        },
        {
          name: "language",
          type: "string",
          description: "Programming language of the code",
          required: false,
          example: "javascript",
        
  - Type: freemium
- list of known tools, but in a * production environment,
  - Context:  in the MCP server.
 * In this implementation, it returns a static list of known tools, but in a
 * production environment, it would introspect the server to dynamically discover
 * all registered tools and 
  - Type: marketplace
- a tool's metadata * * This structure contains all the
  - Context: ,
  createErrorResponse,
} from "../utils/responses.js";

/**
 * Interface representing a tool's metadata
 *
 * This structure contains all the information needed to understand a tool's
 * purpose, how 
  - Type: ads
- * * @example * ```typescript * const toolMetadata: ToolMetadata =
  - Context: ow to use it, and what to expect from its response.
 *
 * @example
 * ```typescript
 * const toolMetadata: ToolMetadata = {
 *   name: "analyze-code",
 *   description: "Analyzes source code for quality
  - Type: ads
- * ```typescript * const toolMetadata: ToolMetadata = { * name:
  - Context: and what to expect from its response.
 *
 * @example
 * ```typescript
 * const toolMetadata: ToolMetadata = {
 *   name: "analyze-code",
 *   description: "Analyzes source code for quality and metrics",
  - Type: ads
- "function add(a, b) { return a + b; }" *
  - Context:     description: "Analyze a JavaScript function",
 *       parameters: {
 *         code: "function add(a, b) { return a + b; }"
 *       }
 *     }
 *   ],
 *   category: "code-analysis",
 *   tags: ["
  - Type: ads
- Unique name of the tool
  - Context: ory: "code-analysis",
 *   tags: ["javascript", "quality"]
 * };
 * ```
 */
export interface ToolMetadata {
  /** Unique name of the tool */
  name: string;
  /** Detailed description of what the tool d
  - Type: ads
- Parameter data type
  - Context: arameter name */
    name: string;
    /** Parameter data type */
    type: string;
    /** Human-readable description of the parameter */
    description: string;
    /** Whether the parameter must be 
  - Type: ads
- For now, we'll build a static list of tool metadata
      const tools = getAvailableTools(server);

      // Filter by category if specified
      l
  - Context: ementation, this would introspect the server
      // For now, we'll build a static list of tool metadata
      const tools = getAvailableTools(server);

      // Filter by category if specified
      l
  - Type: ads
- server * * This function retrieves metadata about all registered
  - Context: ;
    }
  );
}

/**
 * Get all available tools from the MCP server
 *
 * This function retrieves metadata about all registered tools in the MCP server.
 * In this implementation, it returns a static lis
  - Type: ads
- tools and their metadata. * * @param server - The
  - Context: onment, it would introspect the server to dynamically discover
 * all registered tools and their metadata.
 *
 * @param server - The MCP server instance to get tools from
 * @returns Array of tool metad
  - Type: ads
- tools from * @returns Array of tool metadata objects *
  - Context: adata.
 *
 * @param server - The MCP server instance to get tools from
 * @returns Array of tool metadata objects
 * @example
 * ```typescript
 * const server = new McpServer({ name: "my-server", versio
  - Type: ads
- For now, return a static list of known tools
  // In a full implementation, this would
  - Context: og(`Found ${tools.length} tools`);
 * ```
 */
function getAvailableTools(server: McpServer): ToolMetadata[] {
  // For now, return a static list of known tools
  // In a full implementation, this would 
  - Type: ads
- * Generate relationships between tools based on their metadata
  - Context: e: string;
  description?: string;
}

/**
 * Generate relationships between tools based on their metadata
 */
function generateToolRelationships(tools: ToolMetadata[]): {
  nodes: { id: string; name: st
  - Type: ads
- */ function generateToolRelationships(tools: ToolMetadata[]): { nodes: { id: string; name:
  - Context: ionships between tools based on their metadata
 */
function generateToolRelationships(tools: ToolMetadata[]): {
  nodes: { id: string; name: string; category: string; tags: string[] }[];
  edges: ToolRe
  - Type: ads
- Add nodes grouped by category
  const nodesByCategory: Record<string, { id: string; name: string }[]>
  - Context:  tags: string[] }[];
  edges: ToolRelationship[];
}): string {
  let mermaid = "graph TD;\n";

  // Add nodes grouped by category
  const nodesByCategory: Record<string, { id: string; name: string }[]> 
  - Type: ads
- Add edges
  relationships.edges.forEach((edge) => {
    mermaid += `  ${edge.source} --- ${edge.target
  - Context: 
      mermaid += `    ${node.id}["${node.name}"]\n`;
    });
    mermaid += "  end\n";
  });

  // Add edges
  relationships.edges.forEach((edge) => {
    mermaid += `  ${edge.source} --- ${edge.target
  - Type: ads
- Add edges
  relationships.edges.forEach((edge) => {
    dot += `  "${edge.source}" -> "${edge.target}"
  - Context: 
      dot += `    "${node.id}" [label="${node.name}"];\n`;
    });
    dot += "  }\n";
  });

  // Add edges
  relationships.edges.forEach((edge) => {
    dot += `  "${edge.source}" -> "${edge.target}"
  - Type: ads
- Ensure data directory exists
  if (!fs.existsSync(dataDir)
  - Context:  if (dbConnections[dbName]) {
    return dbConnections[dbName];
  }

  const dataDir = path.resolve(process.cwd(), config.storage.path);
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)
  - Type: freemium
- Open database with promises interface
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  - Context: ve: true });
  }
  
  const dbPath = path.join(dataDir, `${dbName}.db`);
  
  // Open database with promises interface
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
 
  - Type: freemium
- Memory database
  const memoryDb = await createDatabase("memory");
  await memoryD
  - Context: itialize all databases required by the application
 */
export async function initializeDatabases(): Promise<void> {
  // Memory database
  const memoryDb = await createDatabase("memory");
  await memoryD
  - Type: freemium
- Ensure data directory exists
  if (!f
  - Context: nnection if exists
  if (dbConnections[dbName]) {
    return dbConnections[dbName];
  }

  const dataDir = path.resolve(process.cwd(), config.storage.path);
  
  // Ensure data directory exists
  if (!f
  - Type: ads
- Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const dbPath = path.join(dataDir, `$
  - Context: e(process.cwd(), config.storage.path);
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const dbPath = path.join(dataDir, `$
  - Type: ads
- Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const dbPath = path.join(dataDir, `${dbName}.db`);
  
  // Open d
  - Context: ge.path);
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const dbPath = path.join(dataDir, `${dbName}.db`);
  
  // Open d
  - Type: ads
- Open database with promises interface
  const db = await open({
    fil
  - Context: nc(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const dbPath = path.join(dataDir, `${dbName}.db`);
  
  // Open database with promises interface
  const db = await open({
    fil
  - Type: ads
- REFERENCES insights(id) ON DELETE CASCADE, PRIMARY KEY (insightId, filePath) );
  - Context: ,
      filePath TEXT NOT NULL,
      FOREIGN KEY (insightId) REFERENCES insights(id) ON DELETE CASCADE,
      PRIMARY KEY (insightId, filePath)
    );
    
    CREATE TABLE IF NOT EXISTS tags (
      i
  - Type: ads
- Knowledge graph database
  const knowledg
  - Context: TEGER,
      tag TEXT NOT NULL,
      FOREIGN KEY (insightId) REFERENCES insights(id) ON DELETE CASCADE,
      PRIMARY KEY (insightId, tag)
    );
  `);
  
  // Knowledge graph database
  const knowledg
  - Type: ads
- (sourceId) REFERENCES nodes(id) ON DELETE CASCADE, FOREIGN KEY (targetId) REFERENCES
  - Context: LL,
      attributes TEXT NOT NULL,
      FOREIGN KEY (sourceId) REFERENCES nodes(id) ON DELETE CASCADE,
      FOREIGN KEY (targetId) REFERENCES nodes(id) ON DELETE CASCADE
    );
    
    CREATE INDEX 
  - Type: ads
- KEY (targetId) REFERENCES nodes(id) ON DELETE CASCADE ); CREATE INDEX
  - Context: RENCES nodes(id) ON DELETE CASCADE,
      FOREIGN KEY (targetId) REFERENCES nodes(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(sourceId);
  
  - Type: ads
- CREATE TABLE IF NOT EXISTS insights ( id INTEGER PRIMARY
  - Context: t memoryDb = await createDatabase("memory");
  await memoryDb.exec(`
    CREATE TABLE IF NOT EXISTS insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repositoryUrl TEXT NOT NULL,
      insightType 
  - Type: data
- NULL, FOREIGN KEY (insightId) REFERENCES insights(id) ON DELETE CASCADE, PRIMARY
  - Context: s (
      insightId INTEGER,
      filePath TEXT NOT NULL,
      FOREIGN KEY (insightId) REFERENCES insights(id) ON DELETE CASCADE,
      PRIMARY KEY (insightId, filePath)
    );
    
    CREATE TABLE IF NOT 
  - Type: data
- Knowledge graph data
  - Context: S tags (
      insightId INTEGER,
      tag TEXT NOT NULL,
      FOREIGN KEY (insightId) REFERENCES insights(id) ON DELETE CASCADE,
      PRIMARY KEY (insightId, tag)
    );
  `);
  
  // Knowledge graph data
  - Type: data
- stdio or http
  },
  features: {
    basicAnalysi
  - Context: ult configuration for the MCP server
 */
const defaultConfig = {
  server: {
    name: "CodeAnalysisPro",
    version: "1.0.0",
    transport: "stdio" // stdio or http
  },
  features: {
    basicAnalysi
  - Type: freemium
- stdio or http
  },
  features: {
    basicAnalysis: true,
    memory: true,
    visualization: true,
    knowledgeGraph: true,
    multiRepo:
  - Context: eAnalysisPro",
    version: "1.0.0",
    transport: "stdio" // stdio or http
  },
  features: {
    basicAnalysis: true,
    memory: true,
    visualization: true,
    knowledgeGraph: true,
    multiRepo: 
  - Type: freemium
- typeof defaultConfig { const configPath = path.join(process.cwd(), "config", "config.json"); try
  - Context: none exists
 */
export function loadConfig(): typeof defaultConfig {
  const configPath = path.join(process.cwd(), "config", "config.json");
  
  try {
    if (fs.existsSync(configPath)) {
      const us
  - Type: freemium
- * Load configuration from file or create default config file if none exists
  - Context: http: {
    port: 3000,
    host: "localhost"
  },
  storage: {
    path: "./data"
  }
};

/**
 * Load configuration from file or create default config file if none exists
 */
export function loadConfig
  - Type: ads
- config file if none exists */ export function loadConfig(): typeof
  - Context: 
 * Load configuration from file or create default config file if none exists
 */
export function loadConfig(): typeof defaultConfig {
  const configPath = path.join(process.cwd(), "config", "config.jso
  - Type: ads
- { const userConfig = JSON.parse(fs.readFileSync(configPath, "utf8")); return { ...defaultConfig, ...userConfig
  - Context: ig.json");
  
  try {
    if (fs.existsSync(configPath)) {
      const userConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
      return { ...defaultConfig, ...userConfig };
    }
  } catch (er
  - Type: ads
- Save default config if none exists
  try {
  - Context:     return { ...defaultConfig, ...userConfig };
    }
  } catch (error) {
    console.warn(`Error loading config: ${(error as Error).message}`);
  }
  
  // Save default config if none exists
  try {
  
  - Type: ads
- * Get the active configuration
  - Context: ;
  }
  
  return defaultConfig;
}

/**
 * Get the active configuration
 */
export const config = loadConfig(); 
  - Type: ads
- * Generate an evolution plan for a codebase based on a specific goal and timeframe
  - Context: ory/memory-manager.js";
import path from "path";
import fs from "fs";

/**
 * Generate an evolution plan for a codebase based on a specific goal and timeframe
 */
export async function generateEvolutionPl
  - Type: freemium
- a specific goal and timeframe */ export async function generateEvolutionPlan(
  - Context: an for a codebase based on a specific goal and timeframe
 */
export async function generateEvolutionPlan(
  repositoryUrl: string,
  targetGoal:
    | "modernize-architecture"
    | "improve-performance"

  - Type: freemium
- Step 1: Clone/update the repository
  con
  - Context: ionDetails: boolean = true
): Promise<any> {
  console.log(
    `Generating ${targetGoal} evolution plan for ${repositoryUrl} (${timeframe} timeframe)`
  );

  // Step 1: Clone/update the repository
  con
  - Type: freemium
- Step 5: Generate the evolution plan based on target goal and timeframe
  console.l
  - Context: ries about this repository...`);
  const memories = await retrieveMemories({
    repositoryUrl,
    limit: 10,
  });

  // Step 5: Generate the evolution plan based on target goal and timeframe
  console.l
  - Type: freemium
- Step 5: Generate the evolution plan based on target goal and timeframe
  console.log(`Generating ${targetGoal} plan...`);

  // Analyze
  - Context: ait retrieveMemories({
    repositoryUrl,
    limit: 10,
  });

  // Step 5: Generate the evolution plan based on target goal and timeframe
  console.log(`Generating ${targetGoal} plan...`);

  // Analyze
  - Type: freemium
- Analyze major frameworks and libraries used
  const frameworks = detectFrameworks(files
  - Context: erate the evolution plan based on target goal and timeframe
  console.log(`Generating ${targetGoal} plan...`);

  // Analyze major frameworks and libraries used
  const frameworks = detectFrameworks(files
  - Type: freemium
- Generate plan based on target goal
  let plan;
  switch (targetGoal) {
    case "modernize-architecture":
      p
  - Context: Analyze project structure
  const projectStructure = analyzeProjectStructure(files);

  // Generate plan based on target goal
  let plan;
  switch (targetGoal) {
    case "modernize-architecture":
      p
  - Type: freemium
- Generate plan based on target goal
  let plan;
  switch (targetGoal) {
    case "modernize-architecture":
      plan = generateModernizeArchitect
  - Context: t projectStructure = analyzeProjectStructure(files);

  // Generate plan based on target goal
  let plan;
  switch (targetGoal) {
    case "modernize-architecture":
      plan = generateModernizeArchitect
  - Type: freemium
- switch (targetGoal) { case "modernize-architecture": plan = generateModernizeArchitecturePlan( repositoryUrl, frameworks,
  - Context: n based on target goal
  let plan;
  switch (targetGoal) {
    case "modernize-architecture":
      plan = generateModernizeArchitecturePlan(
        repositoryUrl,
        frameworks,
        projectStru
  - Type: freemium
- (targetGoal) { case "modernize-architecture": plan = generateModernizeArchitecturePlan( repositoryUrl, frameworks, projectStructure,
  - Context:  switch (targetGoal) {
    case "modernize-architecture":
      plan = generateModernizeArchitecturePlan(
        repositoryUrl,
        frameworks,
        projectStructure,
        fileAnalyses,
       
  - Type: freemium
- includeImplementationDetails ); break; case "improve-performance": plan = generatePerformancePlan( repositoryUrl, frameworks,
  - Context: e,
        includeImplementationDetails
      );
      break;
    case "improve-performance":
      plan = generatePerformancePlan(
        repositoryUrl,
        frameworks,
        fileAnalyses,
       
  - Type: freemium
- ); break; case "improve-performance": plan = generatePerformancePlan( repositoryUrl, frameworks, fileAnalyses,
  - Context: tationDetails
      );
      break;
    case "improve-performance":
      plan = generatePerformancePlan(
        repositoryUrl,
        frameworks,
        fileAnalyses,
        timeframe,
        includ
  - Type: freemium
- includeImplementationDetails ); break; case "enhance-security": plan = generateSecurityPlan( repositoryUrl, frameworks,
  - Context: rame,
        includeImplementationDetails
      );
      break;
    case "enhance-security":
      plan = generateSecurityPlan(
        repositoryUrl,
        frameworks,
        fileAnalyses,
        ti
  - Type: freemium
- ); break; case "enhance-security": plan = generateSecurityPlan( repositoryUrl, frameworks, fileAnalyses,
  - Context: plementationDetails
      );
      break;
    case "enhance-security":
      plan = generateSecurityPlan(
        repositoryUrl,
        frameworks,
        fileAnalyses,
        timeframe,
        includ
  - Type: freemium
- includeImplementationDetails ); break; case "reduce-technical-debt": plan = generateTechnicalDebtPlan( repositoryUrl, frameworks,
  - Context: 
        includeImplementationDetails
      );
      break;
    case "reduce-technical-debt":
      plan = generateTechnicalDebtPlan(
        repositoryUrl,
        frameworks,
        projectStructure,
 
  - Type: freemium
- ); break; case "reduce-technical-debt": plan = generateTechnicalDebtPlan( repositoryUrl, frameworks, projectStructure,
  - Context: onDetails
      );
      break;
    case "reduce-technical-debt":
      plan = generateTechnicalDebtPlan(
        repositoryUrl,
        frameworks,
        projectStructure,
        fileAnalyses,
       
  - Type: freemium
- Return the evolution plan
  return {
    repository: {
      url: repositoryUrl,
      summary: summarizeRepository(
  - Context: efault:
      throw new Error(`Unknown target goal: ${targetGoal}`);
  }

  // Return the evolution plan
  return {
    repository: {
      url: repositoryUrl,
      summary: summarizeRepository(
        
  - Type: freemium
- * Select a representative subset of files to analyze
  - Context: es,
        frameworks,
        projectStructure
      ),
    },
    targetGoal,
    timeframe,
    plan,
  };
}

/**
 * Select a representative subset of files to analyze
 */
function selectRepresentativ
  - Type: freemium
- * Generate a plan for modernizing architecture
  - Context: pLevelDirectories: Array.from(topLevelDirs),
    fileCount: files.length,
  };
}

/**
 * Generate a plan for modernizing architecture
 */
function generateModernizeArchitecturePlan(
  repositoryUrl: strin
  - Type: freemium
- * Generate a plan for modernizing architecture
  - Context: };
}

/**
 * Generate a plan for modernizing architecture
 */
function generateModernizeArchitecturePlan(
  repositoryUrl: string,
  frameworks: Record<string, any>,
  projectStructure: Record<string, any
  - Type: freemium
- title: "Upgrade React to the latest version", description: "The project
  - Context: ion.startsWith("15.")) || version.startsWith("16.")) {
      recommendations.push({
        title: "Upgrade React to the latest version",
        description:
          "The project is using an older version
  - Type: freemium
- { summary: `The architecture modernization plan focuses on ${timeframeRecommendations.length} key
  - Context: tle,
        frameworks
      );
    }
  }

  return {
    summary: `The architecture modernization plan focuses on ${timeframeRecommendations.length} key areas to improve over the ${timeframe} timeframe.
  - Type: freemium
- * Generate a plan for improving performance
  - Context: ateSuggestedArchitecture(
      frameworks,
      projectStructure
    ),
  };
}

/**
 * Generate a plan for improving performance
 */
function generatePerformancePlan(
  repositoryUrl: string,
  framewor
  - Type: freemium
- * Generate a plan for improving performance
  - Context: ure
    ),
  };
}

/**
 * Generate a plan for improving performance
 */
function generatePerformancePlan(
  repositoryUrl: string,
  frameworks: Record<string, any>,
  fileAnalyses: Record<string, any>,
 
  - Type: freemium
- { summary: `The performance improvement plan focuses on ${timeframeRecommendations.length} key
  - Context: .title,
        frameworks
      );
    }
  }

  return {
    summary: `The performance improvement plan focuses on ${timeframeRecommendations.length} key areas to optimize over the ${timeframe} timeframe
  - Type: freemium
- * Generate a plan for enhancing security
  - Context:  ${timeframe} timeframe.`,
    recommendations: timeframeRecommendations,
  };
}

/**
 * Generate a plan for enhancing security
 */
function generateSecurityPlan(
  repositoryUrl: string,
  frameworks: Re
  - Type: freemium
- * Generate a plan for enhancing security
  - Context: Recommendations,
  };
}

/**
 * Generate a plan for enhancing security
 */
function generateSecurityPlan(
  repositoryUrl: string,
  frameworks: Record<string, any>,
  fileAnalyses: Record<string, any>,
 
  - Type: freemium
- "Implement API rate limiting", description: "Add rate limiting to API
  - Context:  || detectApiEndpoints(fileAnalyses)) {
    recommendations.push({
      title: "Implement API rate limiting",
      description: "Add rate limiting to API endpoints to prevent abuse.",
      priority: "me
  - Type: freemium
- limiting", description: "Add rate limiting to API endpoints to prevent
  - Context:     recommendations.push({
      title: "Implement API rate limiting",
      description: "Add rate limiting to API endpoints to prevent abuse.",
      priority: "medium",
      effort: "low",
      impact
  - Type: freemium
- { summary: `The security enhancement plan focuses on ${timeframeRecommendations.length} key
  - Context: rec.title,
        frameworks
      );
    }
  }

  return {
    summary: `The security enhancement plan focuses on ${timeframeRecommendations.length} key areas to improve over the ${timeframe} timeframe.
  - Type: freemium
- * Generate a plan for reducing technical debt
  - Context:  ${timeframe} timeframe.`,
    recommendations: timeframeRecommendations,
  };
}

/**
 * Generate a plan for reducing technical debt
 */
function generateTechnicalDebtPlan(
  repositoryUrl: string,
  fram
  - Type: freemium
- for automatic code formatting (e.g., Prettier, ESLint) to ensure consistent
  - Context: tent code formatting",
    description:
      "Add tooling for automatic code formatting (e.g., Prettier, ESLint) to ensure consistent code style.",
    priority: "medium",
    effort: "low",
    impact: 
  - Type: freemium
- summary: `The technical debt reduction plan focuses on ${timeframeRecommendations.length} key
  - Context: title,
        frameworks
      );
    }
  }

  return {
    summary: `The technical debt reduction plan focuses on ${timeframeRecommendations.length} key areas to improve over the ${timeframe} timeframe.
  - Type: freemium
- best practices", "Create implementation plan", "Implement changes", "Test and validate",
  - Context: n [
    "Analyze current implementation",
    "Research best practices",
    "Create implementation plan",
    "Implement changes",
    "Test and validate",
    "Document changes",
  ];
}

/**
 * Generate
  - Type: freemium
- "../../utils/repository-analyzer.js"; import { analyzeCode } from "../basic-analysis/analyzer.js"; import { buildKnowledgeGraph,
  - Context: tRepository, listFiles } from "../../utils/repository-analyzer.js";
import { analyzeCode } from "../basic-analysis/analyzer.js";
import {
  buildKnowledgeGraph,
  queryKnowledgeGraph,
} from "../knowledge-
  - Type: freemium
- targetGoal: | "modernize-architecture" | "improve-performance" | "enhance-security" | "reduce-technical-debt", timeframe:
  - Context: nerateEvolutionPlan(
  repositoryUrl: string,
  targetGoal:
    | "modernize-architecture"
    | "improve-performance"
    | "enhance-security"
    | "reduce-technical-debt",
  timeframe: "immediate" | "
  - Type: freemium
- | "year", includeImplementationDetails: boolean = true ): Promise<any> { console.log(
  - Context: ame: "immediate" | "sprint" | "quarter" | "year",
  includeImplementationDetails: boolean = true
): Promise<any> {
  console.log(
    `Generating ${targetGoal} evolution plan for ${repositoryUrl} (${time
  - Type: freemium
- Analyze project structure
  const projectStructure = analyzeProjectStructure(files);

  // Generate plan based
  - Context: eworks and libraries used
  const frameworks = detectFrameworks(files, fileAnalyses);

  // Analyze project structure
  const projectStructure = analyzeProjectStructure(files);

  // Generate plan based 
  - Type: freemium
- Analyze project structure
  const projectStructure = analyzeProjectStructure(files);

  // Generate plan based on target goal
  let plan;
  - Context:   const frameworks = detectFrameworks(files, fileAnalyses);

  // Analyze project structure
  const projectStructure = analyzeProjectStructure(files);

  // Generate plan based on target goal
  let plan;
  - Type: freemium
- Analyze project structure
  const projectStructure = analyzeProjectStructure(files);

  // Generate plan based on target goal
  let plan;
  switch (targetGoal) {
  - Context: tFrameworks(files, fileAnalyses);

  // Analyze project structure
  const projectStructure = analyzeProjectStructure(files);

  // Generate plan based on target goal
  let plan;
  switch (targetGoal) {
 
  - Type: freemium
- plan = generateModernizeArchitecturePlan( repositoryUrl, frameworks, projectStructure, fileAnalyses, timeframe, includeImplementationDetails )
  - Context: 
      plan = generateModernizeArchitecturePlan(
        repositoryUrl,
        frameworks,
        projectStructure,
        fileAnalyses,
        timeframe,
        includeImplementationDetails
      )
  - Type: freemium
- timeframe, includeImplementationDetails ); break; case "improve-performance": plan = generatePerformancePlan( repositoryUrl,
  - Context: Analyses,
        timeframe,
        includeImplementationDetails
      );
      break;
    case "improve-performance":
      plan = generatePerformancePlan(
        repositoryUrl,
        frameworks,
  
  - Type: freemium
- l-debt": plan = generateTechnicalDebtPlan( repositoryUrl, frameworks, projectStructure, fileAnalyses, timeframe, includeImplementationDetails
  - Context: l-debt":
      plan = generateTechnicalDebtPlan(
        repositoryUrl,
        frameworks,
        projectStructure,
        fileAnalyses,
        timeframe,
        includeImplementationDetails
      )
  - Type: freemium
- frameworks, projectStructure ), }, targetGoal, timeframe, plan, }; } /**
  - Context:      summary: summarizeRepository(
        files,
        fileAnalyses,
        frameworks,
        projectStructure
      ),
    },
    targetGoal,
    timeframe,
    plan,
  };
}

/**
 * Select a repre
  - Type: freemium
- * Detect frameworks and libraries used in the project
  - Context: additionalImportantFiles].slice(0, maxFiles);
}

/**
 * Detect frameworks and libraries used in the project
 */
function detectFrameworks(
  files: string[],
  fileAnalyses: Record<string, any>
): Record
  - Type: freemium
- (packageJsonFile) { try { const fullPath = path.join( process.cwd(), "data",
  - Context: ckage.json"));
    if (packageJsonFile) {
      try {
        const fullPath = path.join(
          process.cwd(),
          "data",
          "repositories",
          path.basename(packageJsonFile)
   
  - Type: freemium
- if (requirementsFile) { try { const fullPath = path.join( process.cwd(),
  - Context: .txt")
    );
    if (requirementsFile) {
      try {
        const fullPath = path.join(
          process.cwd(),
          "data",
          "repositories",
          path.basename(requirementsFile)
  
  - Type: freemium
- * Analyze the project structure
  - Context: (error as Error).message}`
        );
      }
    }
  }

  return frameworks;
}

/**
 * Analyze the project structure
 */
function analyzeProjectStructure(files: string[]): Record<string, any> {
  const 
  - Type: freemium
- * Analyze the project structure
  - Context:       }
    }
  }

  return frameworks;
}

/**
 * Analyze the project structure
 */
function analyzeProjectStructure(files: string[]): Record<string, any> {
  const directoryStructure: Record<string, num
  - Type: freemium
- string, frameworks: Record<string, any>, projectStructure: Record<string, any>, fileAnalyses: Record<string, any>,
  - Context: on generateModernizeArchitecturePlan(
  repositoryUrl: string,
  frameworks: Record<string, any>,
  projectStructure: Record<string, any>,
  fileAnalyses: Record<string, any>,
  timeframe: "immediate" | 
  - Type: freemium
- description: "The project is using an older version of React.
  - Context: ns.push({
        title: "Upgrade React to the latest version",
        description:
          "The project is using an older version of React. Upgrading will provide access to the latest features, perfo
  - Type: freemium
- older version of React. Upgrading will provide access to the
  - Context: on",
        description:
          "The project is using an older version of React. Upgrading will provide access to the latest features, performance improvements, and security patches.",
        priori
  - Type: freemium
- will provide access to the latest features, performance improvements, and
  - Context: sing an older version of React. Upgrading will provide access to the latest features, performance improvements, and security patches.",
        priority: "high",
        effort: "medium",
        impact:
  - Type: freemium
- Check for component architecture
  const hasComponentDir = projectStructure.topLevelDirectories.some(
    (dir: string) => dir === "components" || dir === "Compon
  - Context: mpact: "high",
      });
    }
  }

  // Check for component architecture
  const hasComponentDir = projectStructure.topLevelDirectories.some(
    (dir: string) => dir === "components" || dir === "Compon
  - Type: freemium
- a dedicated directory structure to improve code organization and reusability.",
  - Context: tecture",
      description:
        "Organize components into a dedicated directory structure to improve code organization and reusability.",
      priority: "medium",
      effort: "medium",
      impa
  - Type: freemium
- "Adding TypeScript will improve type safety, developer experience, and make
  - Context: s.push({
      title: "Migrate to TypeScript",
      description:
        "Adding TypeScript will improve type safety, developer experience, and make the codebase more maintainable.",
      priority: "me
  - Type: freemium
- plan focuses on ${timeframeRecommendations.length} key areas to improve over the
  - Context: : `The architecture modernization plan focuses on ${timeframeRecommendations.length} key areas to improve over the ${timeframe} timeframe.`,
    recommendations: timeframeRecommendations,
    suggestedAr
  - Type: freemium
- React.lazy", description: "Improve initial load time by splitting your code
  - Context: tions.push({
      title: "Implement code splitting with React.lazy",
      description:
        "Improve initial load time by splitting your code into smaller chunks.",
      priority: "high",
      eff
  - Type: freemium
- for images and other assets to improve page load times.",
  - Context: ize asset loading",
    description:
      "Implement lazy loading for images and other assets to improve page load times.",
    priority: "medium",
    effort: "medium",
    impact: "high",
  });

  rec
  - Type: freemium
- strategies", description: "Add appropriate caching for API responses and static
  - Context: 
  });

  recommendations.push({
    title: "Implement caching strategies",
    description: "Add appropriate caching for API responses and static assets.",
    priority: "high",
    effort: "medium",
  
  - Type: freemium
- Authentication and authorization recommendations
  recommendations.push({
    title: "Implement proper authentication and authorization",
    description:
      "Ensure all endpoints and resources ar
  - Context:  // Authentication and authorization recommendations
  recommendations.push({
    title: "Implement proper authentication and authorization",
    description:
      "Ensure all endpoints and resources ar
  - Type: freemium
- "Ensure all endpoints and resources are properly protected with authentication
  - Context: r authentication and authorization",
    description:
      "Ensure all endpoints and resources are properly protected with authentication and authorization.",
    priority: "high",
    effort: "high",
 
  - Type: freemium
- all endpoints and resources are properly protected with authentication and
  - Context: ication and authorization",
    description:
      "Ensure all endpoints and resources are properly protected with authentication and authorization.",
    priority: "high",
    effort: "high",
    impact
  - Type: freemium
- validation", description: "Add proper validation for all user inputs to
  - Context: endations.push({
    title: "Implement comprehensive input validation",
    description:
      "Add proper validation for all user inputs to prevent injection attacks.",
    priority: "high",
    effort:
  - Type: freemium
- on ${timeframeRecommendations.length} key areas to improve over the ${timeframe} timeframe.`,
  - Context: ummary: `The security enhancement plan focuses on ${timeframeRecommendations.length} key areas to improve over the ${timeframe} timeframe.`,
    recommendations: timeframeRecommendations,
  };
}

/**
 * 
  - Type: freemium
- repositoryUrl: string, frameworks: Record<string, any>, projectStructure: Record<string, any>, fileAnalyses: Record<string,
  - Context: /
function generateTechnicalDebtPlan(
  repositoryUrl: string,
  frameworks: Record<string, any>,
  projectStructure: Record<string, any>,
  fileAnalyses: Record<string, any>,
  timeframe: "immediate" | 
  - Type: freemium
- unit and integration tests to improve code reliability and enable
  - Context: ({
    title: "Increase test coverage",
    description:
      "Add unit and integration tests to improve code reliability and enable safer refactoring.",
    priority: "high",
    effort: "high",
    im
  - Type: freemium
- domain rather than by technical layer to improve maintainability.", priority:
  - Context: re",
    description:
      "Organize code by feature or domain rather than by technical layer to improve maintainability.",
    priority: "medium",
    effort: "high",
    impact: "high",
  });

  // Do
  - Type: freemium
- Documentation
  recommendations.push({
    title: "Improve documentation",
    description:
      "Add or update documentation for key components, APIs, and
  - Context: ffort: "high",
    impact: "high",
  });

  // Documentation
  recommendations.push({
    title: "Improve documentation",
    description:
      "Add or update documentation for key components, APIs, and
  - Type: freemium
- focuses on ${timeframeRecommendations.length} key areas to improve over the ${timeframe}
  - Context: ry: `The technical debt reduction plan focuses on ${timeframeRecommendations.length} key areas to improve over the ${timeframe} timeframe.`,
    recommendations: timeframeRecommendations,
  };
}

/**
 * 
  - Type: freemium
- This would normally contain more detailed, recommendation-specific steps
  // For now, we'll provide some generic steps based on the recommendation title

  if (title.includes("React.memo")) {
  - Context: {
  // This would normally contain more detailed, recommendation-specific steps
  // For now, we'll provide some generic steps based on the recommendation title

  if (title.includes("React.memo")) {
   
  - Type: freemium
- these components with React.memo", "Add proper dependency arrays to useEffect
  - Context: hat render frequently but rarely change",
      "Wrap these components with React.memo",
      "Add proper dependency arrays to useEffect and useCallback hooks",
      "Test performance before and after 
  - Type: freemium
- "Add interfaces for component props", "Add type definitions for API
  - Context: onfiguration",
      "Gradually convert files from .js to .ts",
      "Add interfaces for component props",
      "Add type definitions for API responses",
      "Configure ESLint and other tools to work
  - Type: freemium
- * Generate a suggested architecture based on frameworks and project structure
  - Context: ",
    "Document changes",
  ];
}

/**
 * Generate a suggested architecture based on frameworks and project structure
 */
function generateSuggestedArchitecture(
  frameworks: Record<string, any>,
  proj
  - Type: freemium
- frameworks: Record<string, any>, projectStructure: Record<string, any> ): any { if
  - Context:  project structure
 */
function generateSuggestedArchitecture(
  frameworks: Record<string, any>,
  projectStructure: Record<string, any>
): any {
  if (frameworks.react) {
    return {
      type: "Mode
  - Type: freemium
- directory: "src/contexts", description: "React context providers for state management", },
  - Context: c",
        },
        {
          directory: "src/contexts",
          description: "React context providers for state management",
        },
        {
          directory: "src/services",
          de
  - Type: freemium
- { directory: "src/services", description: "Business logic and external service integration",
  - Context: ontroller logic",
        },
        {
          directory: "src/services",
          description: "Business logic and external service integration",
        },
        {
          directory: "src/models",
  
  - Type: freemium
- { directory: "src/core", description: "Core business logic and application services",
  - Context: s used across features",
      },
      {
        directory: "src/core",
        description: "Core business logic and application services",
      },
      {
        directory: "src/infrastructure",
        
  - Type: freemium
- Count files by extension
  const fileExtensions: Re
  - Context: itory(
  files: string[],
  fileAnalyses: Record<string, any>,
  frameworks: Record<string, any>,
  projectStructure: Record<string, any>
): any {
  // Count files by extension
  const fileExtensions: Re
  - Type: freemium
- Determine project type based on frameworks and file structure
  let projectType = "unknown";

  if (frameworks.re
  - Context:  default:
          primaryLanguage = ext.slice(1).toUpperCase();
      }
    }
  }

  // Determine project type based on frameworks and file structure
  let projectType = "unknown";

  if (frameworks.re
  - Type: freemium
- Determine project type based on frameworks and file structure
  let projectType = "unknown";

  if (frameworks.react || frameworks.vue || frameworks.angular) {
    project
  - Context: Case();
      }
    }
  }

  // Determine project type based on frameworks and file structure
  let projectType = "unknown";

  if (frameworks.react || frameworks.vue || frameworks.angular) {
    project
  - Type: freemium
- || frameworks.vue || frameworks.angular) { projectType = "Frontend Application"; }
  - Context: let projectType = "unknown";

  if (frameworks.react || frameworks.vue || frameworks.angular) {
    projectType = "Frontend Application";
  } else if (frameworks.express || frameworks.django || framework
  - Type: freemium
- frameworks.django || frameworks.flask) { projectType = "Backend Application"; } else
  - Context: ntend Application";
  } else if (frameworks.express || frameworks.django || frameworks.flask) {
    projectType = "Backend Application";
  } else if (frameworks.next) {
    projectType = "Full-Stack Appl
  - Type: freemium
- } else if (frameworks.next) { projectType = "Full-Stack Application"; }
  - Context: || frameworks.flask) {
    projectType = "Backend Application";
  } else if (frameworks.next) {
    projectType = "Full-Stack Application";
  } else if (
    files.some(
      (file) =>
        file.incl
  - Type: freemium
- file.includes("docker-compose.yml") ) ) { projectType = "Containerized Application"; } return
  - Context: file) =>
        file.includes("Dockerfile") || file.includes("docker-compose.yml")
    )
  ) {
    projectType = "Containerized Application";
  }

  return {
    totalFiles: files.length,
    primaryLan
  - Type: freemium
- return { totalFiles: files.length, primaryLanguage, projectType, frameworks: Object.keys(frameworks).filter( (key) =>
  - Context: "Containerized Application";
  }

  return {
    totalFiles: files.length,
    primaryLanguage,
    projectType,
    frameworks: Object.keys(frameworks).filter(
      (key) => key !== "allDependencies"
 
  - Type: freemium
- "allDependencies" ), topLevelDirectories: projectStructure.topLevelDirectories, fileExtensions, }; } /** * Detect
  - Context: t.keys(frameworks).filter(
      (key) => key !== "allDependencies"
    ),
    topLevelDirectories: projectStructure.topLevelDirectories,
    fileExtensions,
  };
}

/**
 * Detect if the codebase uses a 
  - Type: freemium
- ( content.includes("componentWillMount") || content.includes("componentWillReceiveProps") || content.includes("componentWillUpdate") ) { return true;
  - Context: f (
        content.includes("componentWillMount") ||
        content.includes("componentWillReceiveProps") ||
        content.includes("componentWillUpdate")
      ) {
        return true;
      }
    }
  - Type: freemium
- Store all dependencies for reference
        frameworks.allDependencies = dependencies;
      } catch (er
  - Context: ies.vitest) {
          frameworks.vitest = { version: dependencies.vitest };
        }

        // Store all dependencies for reference
        frameworks.allDependencies = dependencies;
      } catch (er
  - Type: marketplace
- Only high priority, low effort items
      return sortedRecs
        .filter((rec) => rec.priority === "high" && rec.effort === "low")
  - Context: d on timeframe
  switch (timeframe) {
    case "immediate":
      // Only high priority, low effort items
      return sortedRecs
        .filter((rec) => rec.priority === "high" && rec.effort === "low")

  - Type: marketplace
- High and medium priority items with low to medium effort
      return sortedRecs
        .filter(
          (rec) =>
  - Context: & rec.effort === "low")
        .slice(0, 3);

    case "sprint":
      // High and medium priority items with low to medium effort
      return sortedRecs
        .filter(
          (rec) =>
            
  - Type: marketplace
- All high priority items plus medium priority with high impact
      return sortedRecs.filter(
        (rec) =>
          r
  - Context: ffort === "medium")
        )
        .slice(0, 5);

    case "quarter":
      // All high priority items plus medium priority with high impact
      return sortedRecs.filter(
        (rec) =>
          r
  - Type: marketplace
- if (!analysis.imports) continue; for (const importItem of analysis.imports) { if
  - Context: alysis of Object.values(fileAnalyses)) {
    if (!analysis.imports) continue;

    for (const importItem of analysis.imports) {
      if (
        importItem.includes("mysql") ||
        importItem.includ
  - Type: marketplace
- for (const importItem of analysis.imports) { if ( importItem.includes("mysql") ||
  - Context: lysis.imports) continue;

    for (const importItem of analysis.imports) {
      if (
        importItem.includes("mysql") ||
        importItem.includes("postgres") ||
        importItem.includes("sqlite
  - Type: marketplace
- of analysis.imports) { if ( importItem.includes("mysql") || importItem.includes("postgres") || importItem.includes("sqlite")
  - Context:  importItem of analysis.imports) {
      if (
        importItem.includes("mysql") ||
        importItem.includes("postgres") ||
        importItem.includes("sqlite") ||
        importItem.includes("mongo
  - Type: marketplace
- ( importItem.includes("mysql") || importItem.includes("postgres") || importItem.includes("sqlite") || importItem.includes("mongodb") || importItem.includes("mongoo
  - Context:  (
        importItem.includes("mysql") ||
        importItem.includes("postgres") ||
        importItem.includes("sqlite") ||
        importItem.includes("mongodb") ||
        importItem.includes("mongoo
  - Type: marketplace
- | importItem.includes("postgres") || importItem.includes("sqlite") || importItem.includes("mongodb") || importItem.includes("mongoose") || importItem.includes("sequ
  - Context: |
        importItem.includes("postgres") ||
        importItem.includes("sqlite") ||
        importItem.includes("mongodb") ||
        importItem.includes("mongoose") ||
        importItem.includes("sequ
  - Type: marketplace
- || importItem.includes("sqlite") || importItem.includes("mongodb") || importItem.includes("mongoose") || importItem.includes("sequelize") || importItem.includes("ty
  - Context: ||
        importItem.includes("sqlite") ||
        importItem.includes("mongodb") ||
        importItem.includes("mongoose") ||
        importItem.includes("sequelize") ||
        importItem.includes("ty
  - Type: marketplace
- importItem.includes("mongodb") || importItem.includes("mongoose") || importItem.includes("sequelize") || importItem.includes("typeorm") || importItem.includes("pri
  - Context: 
        importItem.includes("mongodb") ||
        importItem.includes("mongoose") ||
        importItem.includes("sequelize") ||
        importItem.includes("typeorm") ||
        importItem.includes("pri
  - Type: marketplace
- || importItem.includes("sequelize") || importItem.includes("typeorm") || importItem.includes("prisma") ) { return true;
  - Context:        importItem.includes("mongoose") ||
        importItem.includes("sequelize") ||
        importItem.includes("typeorm") ||
        importItem.includes("prisma")
      ) {
        return true;
      }
  - Type: marketplace
- importItem.includes("prisma") ) { return true; } } } return false;
  - Context:         importItem.includes("sequelize") ||
        importItem.includes("typeorm") ||
        importItem.includes("prisma")
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Dete
  - Type: marketplace
- "Implement API rate limiting", description: "Add rate limiting to API
  - Context: press || detectApiEndpoints(fileAnalyses)) {
    recommendations.push({
      title: "Implement API rate limiting",
      description: "Add rate limiting to API endpoints to prevent abuse.",
      priority: "me
  - Type: api
- rate limiting", description: "Add rate limiting to API endpoints to
  - Context: )) {
    recommendations.push({
      title: "Implement API rate limiting",
      description: "Add rate limiting to API endpoints to prevent abuse.",
      priority: "medium",
      effort: "low",
      impact
  - Type: api
- appropriate caching for API responses and static assets.", priority: "high",
  - Context: ons.push({
    title: "Implement caching strategies",
    description: "Add appropriate caching for API responses and static assets.",
    priority: "high",
    effort: "medium",
    impact: "high",
  });

  // D
  - Type: api
- Generic steps
  - Context: files from .js to .ts",
      "Add interfaces for component props",
      "Add type definitions for API responses",
      "Configure ESLint and other tools to work with TypeScript",
    ];
  }

  // Generic steps
  - Type: api
- description: "Add rate limiting to API endpoints to prevent abuse.",
  - Context: dations.push({
      title: "Implement API rate limiting",
      description: "Add rate limiting to API endpoints to prevent abuse.",
      priority: "medium",
      effort: "low",
      impact: "medium",
    });
  - Type: api
- * Detect if the codebase contains API endpoints
  - Context: {
        return true;
      }
    }
  }

  return false;
}

/**
 * Detect if the codebase contains API endpoints
 */
function detectApiEndpoints(fileAnalyses: Record<string, any>): boolean {
  // This is a simpl
  - Type: api
- fullPath = path.join(repoPath, file); const code = fs.readFileSync(fullPath, "utf8"); const
  - Context: lesToAnalyze) {
    try {
      const fullPath = path.join(repoPath, file);
      const code = fs.readFileSync(fullPath, "utf8");
      const fileLanguage = path.extname(file).slice(1);
      const anal
  - Type: ads
- remainingSlots = Math.max(0, maxFiles - selectedFiles.length); const additionalImportantFiles = importantFiles
  - Context: on't exceed maxFiles
  const remainingSlots = Math.max(0, maxFiles - selectedFiles.length);
  const additionalImportantFiles = importantFiles
    .filter((file) => !selectedFiles.includes(file))
    .sl
  - Type: ads
- return [...selectedFiles, ...additionalImportantFiles].slice(0, maxFiles); } /** * Detect frameworks and
  - Context: e) => !selectedFiles.includes(file))
    .slice(0, remainingSlots);

  return [...selectedFiles, ...additionalImportantFiles].slice(0, maxFiles);
}

/**
 * Detect frameworks and libraries used in the pr
  - Type: ads
- path.basename(packageJsonFile) ); const packageData = JSON.parse(fs.readFileSync(fullPath, "utf8")); const dependencies =
  - Context: s",
          path.basename(packageJsonFile)
        );
        const packageData = JSON.parse(fs.readFileSync(fullPath, "utf8"));

        const dependencies = {
          ...(packageData.dependencies 
  - Type: ads
- path.basename(requirementsFile) ); const requirements = fs.readFileSync(fullPath, "utf8").split("\n"); if (requirements.some((r) =>
  - Context: positories",
          path.basename(requirementsFile)
        );
        const requirements = fs.readFileSync(fullPath, "utf8").split("\n");

        if (requirements.some((r) => r.includes("django")))
  - Type: ads
- const topLevel = dir.split("/")[0] || "."; topLevelDirs.add(topLevel); } return {
  - Context:  Object.keys(directoryStructure)) {
    const topLevel = dir.split("/")[0] || ".";
    topLevelDirs.add(topLevel);
  }

  return {
    directoryStructure,
    topLevelDirectories: Array.from(topLevelDir
  - Type: ads
- title: "Upgrade React to the latest version", description: "The project
  - Context: startsWith("15.")) || version.startsWith("16.")) {
      recommendations.push({
        title: "Upgrade React to the latest version",
        description:
          "The project is using an older versio
  - Type: ads
- an older version of React. Upgrading will provide access to
  - Context: atest version",
        description:
          "The project is using an older version of React. Upgrading will provide access to the latest features, performance improvements, and security patches.",
  
  - Type: ads
- TypeScript", description: "Adding TypeScript will improve type safety, developer experience,
  - Context: 
  ) {
    recommendations.push({
      title: "Migrate to TypeScript",
      description:
        "Adding TypeScript will improve type safety, developer experience, and make the codebase more maintaina
  - Type: ads
- Add implementation details if requested
  if (includeImplementationDetails) {
    for (const rec of ti
  - Context: meRecommendations = filterRecommendationsByTimeframe(
    recommendations,
    timeframe
  );

  // Add implementation details if requested
  if (includeImplementationDetails) {
    for (const rec of ti
  - Type: ads
- description: "Improve initial load time by splitting your code into
  - Context:    title: "Implement code splitting with React.lazy",
      description:
        "Improve initial load time by splitting your code into smaller chunks.",
      priority: "high",
      effort: "medium",

  - Type: ads
- General performance recommendations
  recommendations.push({
    title: "Optimize asset loading",
    description:
      "Implement lazy loading for images and other assets to improve page loa
  - Context:   }

  // General performance recommendations
  recommendations.push({
    title: "Optimize asset loading",
    description:
      "Implement lazy loading for images and other assets to improve page loa
  - Type: ads
- "Implement lazy loading for images and other assets to improve
  - Context: ecommendations.push({
    title: "Optimize asset loading",
    description:
      "Implement lazy loading for images and other assets to improve page load times.",
    priority: "medium",
    effort: "m
  - Type: ads
- images and other assets to improve page load times.", priority:
  - Context: ding",
    description:
      "Implement lazy loading for images and other assets to improve page load times.",
    priority: "medium",
    effort: "medium",
    impact: "high",
  });

  recommendations
  - Type: ads
- caching strategies", description: "Add appropriate caching for API responses and
  - Context: high",
  });

  recommendations.push({
    title: "Implement caching strategies",
    description: "Add appropriate caching for API responses and static assets.",
    priority: "high",
    effort: "medi
  - Type: ads
- recommendations.push({ title: "Update dependencies to address security vulnerabilities", description: "Run
  - Context:  would normally use a security scanner)
  recommendations.push({
    title: "Update dependencies to address security vulnerabilities",
    description:
      "Run security scanning tools and update depe
  - Type: ads
- validation", description: "Add proper validation for all user inputs to
  - Context: commendations.push({
    title: "Implement comprehensive input validation",
    description:
      "Add proper validation for all user inputs to prevent injection attacks.",
    priority: "high",
    ef
  - Type: ads
- { recommendations.push({ title: "Add Content Security Policy (CSP)", description: "Implement
  - Context: rameworks.react || frameworks.vue || frameworks.angular) {
    recommendations.push({
      title: "Add Content Security Policy (CSP)",
      description: "Implement CSP headers to prevent XSS attacks."
  - Type: ads
- Policy (CSP)", description: "Implement CSP headers to prevent XSS attacks.",
  - Context: ations.push({
      title: "Add Content Security Policy (CSP)",
      description: "Implement CSP headers to prevent XSS attacks.",
      priority: "medium",
      effort: "medium",
      impact: "high"
  - Type: ads
- rate limiting", description: "Add rate limiting to API endpoints to
  - Context: yses)) {
    recommendations.push({
      title: "Implement API rate limiting",
      description: "Add rate limiting to API endpoints to prevent abuse.",
      priority: "medium",
      effort: "low",

  - Type: ads
- formatting", description: "Add tooling for automatic code formatting (e.g., Prettier,
  - Context:   recommendations.push({
    title: "Implement consistent code formatting",
    description:
      "Add tooling for automatic code formatting (e.g., Prettier, ESLint) to ensure consistent code style.",

  - Type: ads
- coverage", description: "Add unit and integration tests to improve code
  - Context: dium",
  });

  recommendations.push({
    title: "Increase test coverage",
    description:
      "Add unit and integration tests to improve code reliability and enable safer refactoring.",
    priorit
  - Type: ads
- documentation", description: "Add or update documentation for key components, APIs,
  - Context:  Documentation
  recommendations.push({
    title: "Improve documentation",
    description:
      "Add or update documentation for key components, APIs, and architecture decisions.",
    priority: "med
  - Type: ads
- these components with React.memo", "Add proper dependency arrays to useEffect
  - Context: ts that render frequently but rarely change",
      "Wrap these components with React.memo",
      "Add proper dependency arrays to useEffect and useCallback hooks",
      "Test performance before and a
  - Type: ads
- that aren't needed on initial load", "Use React.lazy and Suspense
  - Context: ("code splitting")) {
    return [
      "Identify large components that aren't needed on initial load",
      "Use React.lazy and Suspense to split these components",
      "Add loading fallbacks for l
  - Type: ads
- Suspense to split these components", "Add loading fallbacks for lazy-loaded
  - Context: en't needed on initial load",
      "Use React.lazy and Suspense to split these components",
      "Add loading fallbacks for lazy-loaded components",
      "Test loading performance before and after ch
  - Type: ads
- components", "Add loading fallbacks for lazy-loaded components", "Test loading performance
  - Context:    "Use React.lazy and Suspense to split these components",
      "Add loading fallbacks for lazy-loaded components",
      "Test loading performance before and after changes",
    ];
  }

  if (title.i
  - Type: ads
- fallbacks for lazy-loaded components", "Test loading performance before and after
  - Context: to split these components",
      "Add loading fallbacks for lazy-loaded components",
      "Test loading performance before and after changes",
    ];
  }

  if (title.includes("TypeScript")) {
    ret
  - Type: ads
- TypeScript configuration", "Gradually convert files from .js to .ts", "Add
  - Context:  if (title.includes("TypeScript")) {
    return [
      "Set up TypeScript configuration",
      "Gradually convert files from .js to .ts",
      "Add interfaces for component props",
      "Add type de
  - Type: ads
- files from .js to .ts", "Add interfaces for component props",
  - Context:  [
      "Set up TypeScript configuration",
      "Gradually convert files from .js to .ts",
      "Add interfaces for component props",
      "Add type definitions for API responses",
      "Configure 
  - Type: ads
- interfaces for component props", "Add type definitions for API responses",
  - Context:       "Gradually convert files from .js to .ts",
      "Add interfaces for component props",
      "Add type definitions for API responses",
      "Configure ESLint and other tools to work with TypeScri
  - Type: ads
- avoid performance issues with large repositories const filesToAnalyze = selectRepresentativeFiles(files,
  - Context:  a subset of files to avoid performance issues with large repositories
  const filesToAnalyze = selectRepresentativeFiles(files, 50);

  console.log(`Analyzing ${filesToAnalyze.length} representative fil
  - Type: ads
- * Select a representative subset of files to analyze
  - Context: frame,
    plan,
  };
}

/**
 * Select a representative subset of files to analyze
 */
function selectRepresentativeFiles(
  files: string[],
  maxFiles: number
): string[] {
  // If we have fewer files 
  - Type: ads
- Step 4: Retrieve insights from memory
  console.log(`Retrieving memories about this repository...`);
  const memories = await
  - Context: hips } = await buildKnowledgeGraph(
    repositoryUrl,
    2,
    false
  );

  // Step 4: Retrieve insights from memory
  console.log(`Retrieving memories about this repository...`);
  const memories = await
  - Type: data
- * Register code evolution features with the MCP server
  - Context:  from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateEvolutionPlan } from "./evolution-planner.js";

/**
 * Register code evolution features with the MCP server
 */
e
  - Type: freemium
- => { try { const plan = await generateEvolutionPlan( repositoryUrl,
  - Context: epositoryUrl, targetGoal, timeframe, includeImplementationDetails }) => {
      try {
        const plan = await generateEvolutionPlan(
          repositoryUrl, 
          targetGoal, 
          timeframe
  - Type: freemium
- "text", text: JSON.stringify(plan, null, 2) }] }; } catch (error)
  - Context:  
        return {
          content: [{
            type: "text",
            text: JSON.stringify(plan, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
  
  - Type: freemium
- from "@modelcontextprotocol/sdk/server/mcp.js"; import { z } from "zod"; import {
  - Context: import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateEvolutionPlan } from "./evolutio
  - Type: freemium
- repositoryUrl: z.string(), targetGoal: z.enum([ "modernize-architecture", "improve-performance", "enhance-security", "reduce-technical-debt" ]), timefr
  - Context: repositoryUrl: z.string(),
      targetGoal: z.enum([
        "modernize-architecture", 
        "improve-performance", 
        "enhance-security",
        "reduce-technical-debt"
      ]),
      timefr
  - Type: freemium
- from "path"; import { analyzeCode } from "../basic-analysis/analyzer.js"; import {
  - Context: ository-analyzer.js";
import fs from "fs";
import path from "path";
import { analyzeCode } from "../basic-analysis/analyzer.js";
import { GraphNode } from "../../types/knowledge-graph.js";

/**
 * Sanitize
  - Type: freemium
- string; format: string; }): Promise<string> { const { repositoryUrl, filePath,
  - Context: ons: {
  repositoryUrl?: string;
  filePath?: string;
  fileContent?: string;
  format: string;
}): Promise<string> {
  const { repositoryUrl, filePath, fileContent, format } = options;
  
  // Gather th
  - Type: freemium
- Analyze provided code snippet
    const analysis = analyzeCode(fileContent);
    dependencies['snippet'] = anal
  - Context: ependencies = gatherDependencies(repoPath, files);
    }
  } else if (fileContent) {
    // Analyze provided code snippet
    const analysis = analyzeCode(fileContent);
    dependencies['snippet'] = anal
  - Type: freemium
- Generate the visualization in the requested format
  switch (format) {
    case
  - Context: sis.imports;
  } else {
    throw new Error("Either repositoryUrl, filePath, or fileContent must be provided");
  }
  
  // Generate the visualization in the requested format
  switch (format) {
    case
  - Type: freemium
- showAttributes: boolean; format: string; }): Promise<string> { const { repositoryUrl,
  - Context: g;
  fileContent?: string;
  showMethods: boolean;
  showAttributes: boolean;
  format: string;
}): Promise<string> {
  const { repositoryUrl, filePath, fileContent, showMethods, showAttributes, format }
  - Type: freemium
- throw new Error("filePath must be provided when repositoryUrl is specified");
  - Context: ait getRepository(repositoryUrl);
    
    if (!filePath) {
      throw new Error("filePath must be provided when repositoryUrl is specified");
    }
    
    const fullPath = path.join(repoPath, filePat
  - Type: freemium
- Analyze the code structure
  const analysis = analyzeCode(code, language);
  - Context: Content;
  } else {
    throw new Error("Either repositoryUrl with filePath, or fileContent must be provided");
  }
  
  // Analyze the code structure
  const analysis = analyzeCode(code, language);
  
 
  - Type: freemium
- Add dependencies
    for (const importItem of imports) {
      const safeImport = sanitizeId(importItem);
      mermaid += `  ${safeFile} -->
  - Context: ode
    mermaid += `  ${safeFile}["${file}"];\n`;
    
    // Add dependencies
    for (const importItem of imports) {
      const safeImport = sanitizeId(importItem);
      mermaid += `  ${safeFile} --> 
  - Type: marketplace
- imports) { const safeImport = sanitizeId(importItem); mermaid += ` ${safeFile}
  - Context:  Add dependencies
    for (const importItem of imports) {
      const safeImport = sanitizeId(importItem);
      mermaid += `  ${safeFile} --> ${safeImport}["${importItem}"];\n`;
    }
  }
  
  return mer
  - Type: marketplace
- * Generate a DOT dependency graph
  - Context: nst safeImport = sanitizeId(importItem);
      mermaid += `  ${safeFile} --> ${safeImport}["${importItem}"];\n`;
    }
  }
  
  return mermaid;
}

/**
 * Generate a DOT dependency graph
 */
function gener
  - Type: marketplace
- Add dependencies
    for (const importItem of imports as string[]) {
      const safeImport = sanitizeId(importItem);
      dot += `  "${safeF
  - Context:    dot += `  "${safeFile}" [label="${file}"];\n`;
    
    // Add dependencies
    for (const importItem of imports as string[]) {
      const safeImport = sanitizeId(importItem);
      dot += `  "${safeF
  - Type: marketplace
- { const safeImport = sanitizeId(importItem); dot += ` "${safeFile}" ->
  - Context: ncies
    for (const importItem of imports as string[]) {
      const safeImport = sanitizeId(importItem);
      dot += `  "${safeFile}" -> "${safeImport}";\n`;
    }
  }
  
  dot += "}";
  return dot;
}

  - Type: marketplace
- `${file}\n`; for (const importItem of imports) { ascii += `
  - Context: le, imports] of Object.entries(dependencies)) {
    ascii += `${file}\n`;
    
    for (const importItem of imports) {
      ascii += `  └─> ${importItem}\n`;
    }
    
    ascii += "\n";
  }
  
  return
  - Type: marketplace
- ascii += ` └─> ${importItem}\n`; } ascii += "\n"; }
  - Context:    ascii += `${file}\n`;
    
    for (const importItem of imports) {
      ascii += `  └─> ${importItem}\n`;
    }
    
    ascii += "\n";
  }
  
  return ascii;
}

/**
 * Generate a Mermaid class diagra
  - Type: marketplace
- fullPath = path.join(repoPath, filePath); const code = fs.readFileSync(fullPath, 'utf8'); const
  - Context: Analyze specific file
      const fullPath = path.join(repoPath, filePath);
      const code = fs.readFileSync(fullPath, 'utf8');
      const fileLanguage = path.extname(filePath).slice(1);
      const 
  - Type: ads
- fullPath = path.join(repoPath, filePath); code = fs.readFileSync(fullPath, 'utf8'); language =
  - Context: yUrl is specified");
    }
    
    const fullPath = path.join(repoPath, filePath);
    code = fs.readFileSync(fullPath, 'utf8');
    language = path.extname(filePath).slice(1);
  } else if (fileContent
  - Type: ads
- const fullPath = path.join(repoPath, file); const code = fs.readFileSync(fullPath, 'utf8');
  - Context: ile of files) {
    try {
      const fullPath = path.join(repoPath, file);
      const code = fs.readFileSync(fullPath, 'utf8');
      const fileLanguage = path.extname(file).slice(1);
      const anal
  - Type: ads
- Add the file node
    mermaid += `  ${safeFile}["${file}"];\n`;
    
    // Add dependencies
    for (
  - Context: ile, imports] of Object.entries(dependencies)) {
    const safeFile = sanitizeId(file);
    
    // Add the file node
    mermaid += `  ${safeFile}["${file}"];\n`;
    
    // Add dependencies
    for (
  - Type: ads
- Add the file node
    mermaid += `  ${safeFile}["${file}"];\n`;
    
    // Add dependencies
    for (const importItem of imports) {
      const safeImport = sanitizeId(importIte
  - Context: zeId(file);
    
    // Add the file node
    mermaid += `  ${safeFile}["${file}"];\n`;
    
    // Add dependencies
    for (const importItem of imports) {
      const safeImport = sanitizeId(importIte
  - Type: ads
- Add the file node
    dot += `  "${safeFile}" [label="${file}"];\n`;
    
    // Add dependencies
  - Context: ile, imports] of Object.entries(dependencies)) {
    const safeFile = sanitizeId(file);
    
    // Add the file node
    dot += `  "${safeFile}" [label="${file}"];\n`;
    
    // Add dependencies
    
  - Type: ads
- Add the file node
    dot += `  "${safeFile}" [label="${file}"];\n`;
    
    // Add dependencies
    for (const importItem of imports as string[]) {
      const safeImport = sanitize
  - Context: file);
    
    // Add the file node
    dot += `  "${safeFile}" [label="${file}"];\n`;
    
    // Add dependencies
    for (const importItem of imports as string[]) {
      const safeImport = sanitize
  - Type: ads
- Add classes
  for (const className of classes) {
    mermaid += `  class ${className} {\n`;
    
    /
  - Context: is;
  const { showMethods, showAttributes } = options;
  
  let mermaid = "classDiagram\n";
  
  // Add classes
  for (const className of classes) {
    mermaid += `  class ${className} {\n`;
    
    /
  - Type: ads
- Add attributes and methods if available and requested
    if (showAttributes) {
      mermaid += `
  - Context: classes
  for (const className of classes) {
    mermaid += `  class ${className} {\n`;
    
    // Add attributes and methods if available and requested
    if (showAttributes) {
      mermaid += `    
  - Type: ads
- Placeholder - would need actual analysis
    }
    
    mermaid += "  }\n";
  }
  
  // Add standalone functions if no classes
  if (classes.length === 0 && functions.length > 0) {
    merma
  - Context: d()\n`;  // Placeholder - would need actual analysis
    }
    
    mermaid += "  }\n";
  }
  
  // Add standalone functions if no classes
  if (classes.length === 0 && functions.length > 0) {
    merma
  - Type: ads
- Add classes
  for (const className of classes) {
    dot += `  ${className} [label="{${className}`;
  - Context:  = options;
  
  let dot = "digraph ClassDiagram {\n";
  dot += "  node [shape=record];\n";
  
  // Add classes
  for (const className of classes) {
    dot += `  ${className} [label="{${className}`;
  
  - Type: ads
- Placeholder - would need actual analysis
    }
    
    dot += "}\";\n";
  }
  
  // Add standalone functions if no classes
  if (classes.length === 0 && functions.length > 0) {
    dot +
  - Context: method()";  // Placeholder - would need actual analysis
    }
    
    dot += "}\";\n";
  }
  
  // Add standalone functions if no classes
  if (classes.length === 0 && functions.length > 0) {
    dot +
  - Type: ads
- Add classes
  for (const className of classes) {
    ascii += `+----------------------+\n`;
    ascii
  - Context: ;
  const { showMethods, showAttributes } = options;
  
  let ascii = "Class Diagram:\n\n";
  
  // Add classes
  for (const className of classes) {
    ascii += `+----------------------+\n`;
    ascii 
  - Type: ads
- Add standalone functions if no classes
  if (classes.length === 0 && functions.length > 0) {
    ascii
  - Context: er - would need actual analysis
    }
    
    ascii += `+----------------------+\n\n`;
  }
  
  // Add standalone functions if no classes
  if (classes.length === 0 && functions.length > 0) {
    ascii
  - Type: ads
- } from "@modelcontextprotocol/sdk/server/mcp.js"; import { z } from "zod"; import
  - Context: import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateDependencyGraph, generateCodeStr
  - Type: freemium
- visualization, _metadata: format === "mermaid" ? { format: "mermaid" }
  - Context:  {
          content: [{
            type: "text",
            text: visualization,
            _metadata: format === "mermaid" ? { format: "mermaid" } : undefined
          }]
        };
      } catch 
  - Type: ads
- session to retrieve history for"), limit: z .number() .default(10) .describe("Maximum
  - Context: essionId: z
        .string()
        .describe("ID of the session to retrieve history for"),
      limit: z
        .number()
        .default(10)
        .describe("Maximum number of history entries to r
  - Type: freemium
- return"), }, async ({ sessionId, limit }) => { try
  - Context: 0)
        .describe("Maximum number of history entries to return"),
    },
    async ({ sessionId, limit }) => {
      try {
        const session = getSession(sessionId);
        const history = session.
  - Type: freemium
- Get the most recent entries up to the limit
        const limitedHistory = history.slice(-limit);

        const result = createSuccessResponse
  - Context: d);
        const history = session.getHistory();

        // Get the most recent entries up to the limit
        const limitedHistory = history.slice(-limit);

        const result = createSuccessResponse
  - Type: freemium
- Get the most recent entries up to the limit
        const limitedHistory = history.slice(-limit);

        const result = createSuccessResponse(
          {
  - Context: story = session.getHistory();

        // Get the most recent entries up to the limit
        const limitedHistory = history.slice(-limit);

        const result = createSuccessResponse(
          {
      
  - Type: freemium
- Get the most recent entries up to the limit
        const limitedHistory = history.slice(-limit);

        const result = createSuccessResponse(
          {
            sessionId,
            tot
  - Context:        // Get the most recent entries up to the limit
        const limitedHistory = history.slice(-limit);

        const result = createSuccessResponse(
          {
            sessionId,
            tot
  - Type: freemium
- { sessionId, totalEntries: history.length, returnedEntries: limitedHistory.length, history: limitedHistory, }, "get-session-history"
  - Context:     {
            sessionId,
            totalEntries: history.length,
            returnedEntries: limitedHistory.length,
            history: limitedHistory,
          },
          "get-session-history"

  - Type: freemium
- history.length, returnedEntries: limitedHistory.length, history: limitedHistory, }, "get-session-history" ); return {
  - Context: alEntries: history.length,
            returnedEntries: limitedHistory.length,
            history: limitedHistory,
          },
          "get-session-history"
        );

        return {
          conte
  - Type: freemium
- This feature provides tools for managing sessions in the MCP
  - Context: /**
 * Session Management Feature
 *
 * This feature provides tools for managing sessions in the MCP server.
 * Sessions allow maintaining state between rel
  - Type: freemium
- for state * management and provides tools for: * *
  - Context: ons and
 * enable multi-step workflows. The session manager uses XState for state
 * management and provides tools for:
 *
 * - Creating sessions
 * - Retrieving session information
 * - Managing session
  - Type: freemium
- */ import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; import { z
  - Context: aging session lifecycle
 * - Viewing execution history
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getSession,
  clearSession,
  getSessi
  - Type: freemium
- Return appropriate content type based on visualization format
        if (visualizationFormat === "mermaid") {
  - Context: ynamics,
          timeRange,
          visualizationFormat
        );
        
        // Return appropriate content type based on visualization format
        if (visualizationFormat === "mermaid") {
 
  - Type: freemium
- "text", text: results.visualization, _metadata: { format: "mermaid" } }, {
  - Context: ontent: [{
              type: "text",
              text: results.visualization,
              _metadata: { format: "mermaid" }
            }, {
              type: "text",
              text: JSON.str
  - Type: ads
- "text", text: results.visualization, _metadata: { format: "dot" } }, {
  - Context: ontent: [{
              type: "text",
              text: results.visualization,
              _metadata: { format: "dot" }
            }, {
              type: "text",
              text: JSON.stringi
  - Type: ads
- Add selected technical nodes and edges
  // Limit to important ones to avoid cluttering the graph
  const technicalNodes = nodes
    .filter(node =>
  - Context:         weight: edge.weight
      });
    }
  }
  
  // Add selected technical nodes and edges
  // Limit to important ones to avoid cluttering the graph
  const technicalNodes = nodes
    .filter(node => 
  - Type: freemium
- Limit to 50 technical nodes
  
  for (const node of technicalNodes) {
    graphNodes.push({
      id: nod
  - Context:  nodes
    .filter(node => node.type === 'file' || node.type === 'directory')
    .slice(0, 50); // Limit to 50 technical nodes
  
  for (const node of technicalNodes) {
    graphNodes.push({
      id: nod
  - Type: freemium
- Limit to 100 technical edges
  
  for (const rel of technicalEdges) {
    graphEdges.push({
      source:
  - Context: urceId) && 
             graphNodes.some(n => n.id === rel.targetId);
    })
    .slice(0, 100); // Limit to 100 technical edges
  
  for (const rel of technicalEdges) {
    graphEdges.push({
      source:
  - Type: freemium
- Add edges (limit to 100 most important to avoid cluttering)
  const prioritizedEdges = [...graph.edges]
    .sort((a
  - Context:   mermaid += `  ${sanitizeId(node.id)}["${node.name || node.id}"];\n`;
    }
  }
  
  // Add edges (limit to 100 most important to avoid cluttering)
  const prioritizedEdges = [...graph.edges]
    .sort((a
  - Type: freemium
- "Teams appear to be working in isolation with limited cross-team
  - Context:       title: "Team Isolation",
          description: "Teams appear to be working in isolation with limited cross-team collaboration.",
          details: crossTeamCollaboration,
          recommendation: 
  - Type: freemium
- "../../utils/repository-analyzer.js"; import { execSync } from "child_process"; import { buildKnowledgeGraph,
  - Context: tRepository, listFiles } from "../../utils/repository-analyzer.js";
import { execSync } from "child_process";
import { buildKnowledgeGraph, queryKnowledgeGraph } from "../knowledge-graph/graph-manager.js
  - Type: freemium
- "json" | "mermaid" | "dot" = "json" ): Promise<any> {
  - Context: e?: { start?: string, end?: string },
  visualizationFormat: "json" | "mermaid" | "dot" = "json"
): Promise<any> {
  console.log(`Analyzing socio-technical patterns for ${repositoryUrl}`);
  
  // Step 1
  - Type: freemium
- Build the git
  - Context: unction analyzeContributors(
  repoPath: string, 
  timeRange?: { start?: string, end?: string }
): Promise<any> {
  console.log(`Analyzing contributors in ${repoPath}`);
  
  try {
    // Build the git 
  - Type: freemium
- Build the git log command with appropriate filters
    let gitLogCommand = 'git log --pretty=format:"%an|%ae|%ad|%H" --date=iso';
  - Context: le.log(`Analyzing contributors in ${repoPath}`);
  
  try {
    // Build the git log command with appropriate filters
    let gitLogCommand = 'git log --pretty=format:"%an|%ae|%ad|%H" --date=iso';
    
 
  - Type: freemium
- Process the commits to get contributor information
    const contributorMap: Record<string, any> = {};
  - Context: ing();
    const commits = gitLogOutput.split('\n').filter(line => line.trim() !== '');
    
    // Process the commits to get contributor information
    const contributorMap: Record<string, any> = {};

  - Type: freemium
- string, contributorData: any): Promise<any> { console.log(`Analyzing code ownership in ${repoPath}`);
  - Context: ownership patterns
 */
async function analyzeCodeOwnership(repoPath: string, contributorData: any): Promise<any> {
  console.log(`Analyzing code ownership in ${repoPath}`);
  
  try {
    const files = l
  - Type: freemium
- Process file changes for each contributor
    for (const contributor of contributorData.contributors) {
  - Context: irectory
    const directoryContributions: Record<string, Record<string, number>> = {};
    
    // Process file changes for each contributor
    for (const contributor of contributorData.contributors) {
  - Type: freemium
- Step 1: Detec
  - Context: laboration patterns
 */
async function analyzeTeamDynamics(repoPath: string, contributorData: any): Promise<any> {
  console.log(`Analyzing team dynamics in ${repoPath}`);
  
  try {
    // Step 1: Detec
  - Type: freemium
- Sort contributors by commit count (most active first
  - Context: tering algorithm to detect teams based on collaboration patterns
  const teams: any[] = [];
  const processedContributors = new Set<string>();
  
  // Sort contributors by commit count (most active first
  - Type: freemium
- Skip if already assigned to a team
    if (processedContributors.has(contributor.email)) continue;
    
    // Identify files this contributor wor
  - Context:   for (const contributor of sortedContributors) {
    // Skip if already assigned to a team
    if (processedContributors.has(contributor.email)) continue;
    
    // Identify files this contributor wor
  - Type: freemium
- .contributors) { if ( otherContributor.email !== contributor.email && !processedContributors.has(otherContributor.email) &&
  - Context: .contributors) {
        if (
          otherContributor.email !== contributor.email && 
          !processedContributors.has(otherContributor.email) &&
          otherContributor.fileChanges[file]
     
  - Type: freemium
- Mark all team members as processed
      for (const member of teamMembers) {
        processedContributors.add(member.email);
  - Context: ),
        primaryDirectories: commonDirectories
      });
      
      // Mark all team members as processed
      for (const member of teamMembers) {
        processedContributors.add(member.email);
  
  - Type: freemium
- Mark all team members as processed
      for (const member of teamMembers) {
        processedContributors.add(member.email);
      }
    }
  }
  
  // Add remaining contributors as indivi
  - Context:      
      // Mark all team members as processed
      for (const member of teamMembers) {
        processedContributors.add(member.email);
      }
    }
  }
  
  // Add remaining contributors as indivi
  - Type: freemium
- an "Other" team const remainingContributors = sortedContributors.filter(c => !processedContributors.has(c.email)); if
  - Context: s individuals or to an "Other" team
  const remainingContributors = sortedContributors.filter(c => !processedContributors.has(c.email));
  
  if (remainingContributors.length > 0) {
    teams.push({
    
  - Type: freemium
- (const member of remainingContributors) { processedContributors.add(member.email); } } return teams;
  - Context: ,
      primaryDirectories: []
    });
    
    for (const member of remainingContributors) {
      processedContributors.add(member.email);
    }
  }
  
  return teams;
}

/**
 * Find common directories
  - Type: freemium
- Define standard business hours (9 AM to 5 PM)
    const standardHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    
    // Cal
  - Context: mitHours) {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
    
    // Define standard business hours (9 AM to 5 PM)
    const standardHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    
    // Cal
  - Type: freemium
- Insight 2: Well-distributed knowledge
  - Context: areas: highConcentrationAreas,
        recommendation: "Consider knowledge sharing sessions or pair programming to distribute expertise."
      });
    }
  }
  
  // Insight 2: Well-distributed knowledge
  - Type: freemium
- Insight 4: Non-standard work hours
  if (teamDynamicsD
  - Context: ion,
          recommendation: "Consider cross-team initiatives, shared code ownership, or rotation programs."
        });
      }
    }
  }
  
  // Insight 4: Non-standard work hours
  if (teamDynamicsD
  - Type: freemium
- contributors frequently work outside standard business hours.`, details: { contributors:
  - Context:      description: `${outsideHoursContributors.length} contributors frequently work outside standard business hours.`,
        details: {
          contributors: outsideHoursContributors
        },
        rec
  - Type: freemium
- filters let gitLogCommand = 'git log --pretty=format:"%an|%ae|%ad|%H" --date=iso'; if (timeRange?.start)
  - Context: git log command with appropriate filters
    let gitLogCommand = 'git log --pretty=format:"%an|%ae|%ad|%H" --date=iso';
    
    if (timeRange?.start) {
      gitLogCommand += ` --since="${timeRange.sta
  - Type: ads
- Try to identify teams
  for (const contributor of sortedContributors) {
    // Skip if already assigned to a team
    if (processedContributors.has(contributor.email)) continue;
    
    // Ide
  - Context: 
  
  // Try to identify teams
  for (const contributor of sortedContributors) {
    // Skip if already assigned to a team
    if (processedContributors.has(contributor.email)) continue;
    
    // Ide
  - Type: ads
- const relatedContributors = new Set<any>(); relatedContributors.add(contributor); for (const file of
  - Context: ors who work on these files
    const relatedContributors = new Set<any>();
    relatedContributors.add(contributor);
    
    for (const file of topFiles) {
      for (const otherContributor of contrib
  - Type: ads
- If we found related contributors, form a te
  - Context: or.email) &&
          otherContributor.fileChanges[file]
        ) {
          relatedContributors.add(otherContributor);
        }
      }
    }
    
    // If we found related contributors, form a te
  - Type: ads
- Add remaining contributors as individuals or to an "Other
  - Context: l team members as processed
      for (const member of teamMembers) {
        processedContributors.add(member.email);
      }
    }
  }
  
  // Add remaining contributors as individuals or to an "Other
  - Type: ads
- Add remaining contributors as individuals or to an "Other" team
  const remainingContributors = sorted
  - Context: member of teamMembers) {
        processedContributors.add(member.email);
      }
    }
  }
  
  // Add remaining contributors as individuals or to an "Other" team
  const remainingContributors = sorted
  - Type: ads
- of remainingContributors) { processedContributors.add(member.email); } } return teams; } /**
  - Context: ries: []
    });
    
    for (const member of remainingContributors) {
      processedContributors.add(member.email);
    }
  }
  
  return teams;
}

/**
 * Find common directories among team members
 
  - Type: ads
- Find directories that most team members
  - Context: dirs = new Set<string>();
    for (const file of Object.keys(contributor.fileChanges)) {
      dirs.add(path.dirname(file));
    }
    return dirs;
  });
  
  // Find directories that most team members 
  - Type: ads
- No common directories, use most active member's name
    const lead = members.sort((a, b) => b.commitCount - a.commitCount)[0];
    return `${lead.name}'s Team`;
  }
  - Context: directories.length === 0) {
    // No common directories, use most active member's name
    const lead = members.sort((a, b) => b.commitCount - a.commitCount)[0];
    return `${lead.name}'s Team`;
  }
 
  - Type: ads
- Try to derive from top directories
  const topDirectory = directories[0]
  - Context: r's name
    const lead = members.sort((a, b) => b.commitCount - a.commitCount)[0];
    return `${lead.name}'s Team`;
  }
  
  // Try to derive from top directories
  const topDirectory = directories[0]
  - Type: ads
- Only add if there's a significant collaboration
      if (weight >= 3) {
        edges.push({
          sou
  - Context: es(collaborationMap)) {
    for (const [target, weight] of Object.entries(targets)) {
      // Only add if there's a significant collaboration
      if (weight >= 3) {
        edges.push({
          sou
  - Type: ads
- Add team nodes
  if (teamDynamicsData?.teams) {
    for (const team of teamDynamicsData.teams) {
  - Context: reate graph nodes and edges
  const graphNodes: any[] = [];
  const graphEdges: any[] = [];
  
  // Add team nodes
  if (teamDynamicsData?.teams) {
    for (const team of teamDynamicsData.teams) {
     
  - Type: ads
- Add edges between teams and their members
      for (const member of team.members) {
        graphEdge
  - Context: push({
        id: team.id,
        name: team.name,
        type: 'team'
      });
      
      // Add edges between teams and their members
      for (const member of team.members) {
        graphEdge
  - Type: ads
- Add contributor nodes
  for (const contributor of contributorData.contributors) {
    graphNodes.push(
  - Context: email,
          target: team.id,
          type: 'member-of'
        });
      }
    }
  }
  
  // Add contributor nodes
  for (const contributor of contributorData.contributors) {
    graphNodes.push(
  - Type: ads
- Add collaboration edges
  if (teamDynamicsData?.collaborationGraph?.edges) {
    for (const edge of te
  - Context: tor.name,
      type: 'contributor',
      commitCount: contributor.commitCount
    });
  }
  
  // Add collaboration edges
  if (teamDynamicsData?.collaborationGraph?.edges) {
    for (const edge of te
  - Type: ads
- Add selected technical nodes and edges
  // Limit to important ones to avoid cluttering the graph
  co
  - Context: .target,
        type: 'collaborates-with',
        weight: edge.weight
      });
    }
  }
  
  // Add selected technical nodes and edges
  // Limit to important ones to avoid cluttering the graph
  co
  - Type: ads
- Add ownership edges
  if (ownershipData?.directoryOwnership) {
    for (const [directory, data] of Obj
  - Context: sh({
      id: node.id,
      name: node.name || node.id,
      type: node.type
    });
  }
  
  // Add ownership edges
  if (ownershipData?.directoryOwnership) {
    for (const [directory, data] of Obj
  - Type: ads
- Add technical dependency edges
  const technicalEdges = relationships
    .filter(rel => ['depends-on'
  - Context: ype: 'owns',
            weight: owner.percentage
          });
        }
      }
    }
  }
  
  // Add technical dependency edges
  const technicalEdges = relationships
    .filter(rel => ['depends-on'
  - Type: ads
- (const member of team.members) { uniqueContributors.add(member.email); } } return uniqueContributors.size;
  - Context: 
  
  for (const team of teams) {
    for (const member of team.members) {
      uniqueContributors.add(member.email);
    }
  }
  
  return uniqueContributors.size;
}

/**
 * Generate a Mermaid diagram
  - Type: ads
- Add nodes
  for (const node of graph.nodes) {
    let style = "";
    
    switch (node.type) {
  - Context: on
 */
function generateMermaidDiagram(graph: any): string {
  let mermaid = "graph TD;\n";
  
  // Add nodes
  for (const node of graph.nodes) {
    let style = "";
    
    switch (node.type) {
      
  - Type: ads
- adf,stroke:#333,stroke-width:2px`;
        mermaid += `  ${sanitizeId(node.id)}["👥 ${node.name}"];\n`;
  - Context: ${style};\n`;
        break;
      case "team":
        style = `style ${sanitizeId(node.id)} fill:#adf,stroke:#333,stroke-width:2px`;
        mermaid += `  ${sanitizeId(node.id)}["👥 ${node.name}"];\n`;
  - Type: ads
- Add edges (limit to 100 most important to avoid cluttering)
  const prioritizedEdges = [...graph.edges
  - Context: ult:
        mermaid += `  ${sanitizeId(node.id)}["${node.name || node.id}"];\n`;
    }
  }
  
  // Add edges (limit to 100 most important to avoid cluttering)
  const prioritizedEdges = [...graph.edges
  - Type: ads
- Add nodes
  for (const node of graph.nodes) {
    let color = "";
    let shape = "box";
    
    swit
  - Context: {
  let dot = "digraph SocioTechnical {\n";
  dot += "  node [shape=box, style=filled];\n";
  
  // Add nodes
  for (const node of graph.nodes) {
    let color = "";
    let shape = "box";
    
    swit
  - Type: ads
- aaddff\"";
        shape = "hexagon";
        dot += `  "${node.id}" [label="👥 ${node.name}", ${color},
  - Context: }", ${color}, shape=${shape}];\n`;
        break;
      case "team":
        color = "fillcolor=\"#aaddff\"";
        shape = "hexagon";
        dot += `  "${node.id}" [label="👥 ${node.name}", ${color},
  - Type: ads
- align well with team structures, creating communication overhead.", details: {
  - Context: iption: "Technical dependencies don't align well with team structures, creating communication overhead.",
        details: {
          misalignments
        },
        recommendation: "Consider reorgani
  - Type: ads
- Step 8: Generate insights
  const insights = generateInsights(
    contributorData, 
    ownershipData, 
    teamDynamicsData
  - Context: == "dot") {
    visualization = generateDotGraph(socioTechnicalGraph);
  }
  
  // Step 8: Generate insights
  const insights = generateInsights(
    contributorData, 
    ownershipData, 
    teamDynamicsData
  - Type: data
- Step 8: Generate insights
  const insights = generateInsights(
    contributorData, 
    ownershipData, 
    teamDynamicsData, 
    graphData.
  - Context: isualization = generateDotGraph(socioTechnicalGraph);
  }
  
  // Step 8: Generate insights
  const insights = generateInsights(
    contributorData, 
    ownershipData, 
    teamDynamicsData, 
    graphData.
  - Type: data
- Step 8: Generate insights
  const insights = generateInsights(
    contributorData, 
    ownershipData, 
    teamDynamicsData, 
    graphData.nodes, 
    graphDa
  - Context: rateDotGraph(socioTechnicalGraph);
  }
  
  // Step 8: Generate insights
  const insights = generateInsights(
    contributorData, 
    ownershipData, 
    teamDynamicsData, 
    graphData.nodes, 
    graphDa
  - Type: data
- teamDynamicsData ? summarizeTeamDynamics(teamDynamicsData) : null, insights }, visualization, visualizationFormat };
  - Context:  null,
      teamDynamics: teamDynamicsData ? summarizeTeamDynamics(teamDynamicsData) : null,
      insights
    },
    visualization,
    visualizationFormat
  };
}

/**
 * Analyze git history and contributo
  - Type: data
- * Generate insights from the socio-technical analysis
  - Context: ge.target}" [label="${label}", ${style}];\n`;
  }
  
  dot += "}";
  return dot;
}

/**
 * Generate insights from the socio-technical analysis
 */
function generateInsights(
  contributorData: any,
  ownershi
  - Type: data
- Insight 1: Highly concentrated knowledge
  if (ownershipData?.knowledgeDistrib
  - Context: ershipData: any,
  teamDynamicsData: any,
  nodes: any[],
  relationships: any[]
): any[] {
  const insights: any[] = [];
  
  // Insight 1: Highly concentrated knowledge
  if (ownershipData?.knowledgeDistrib
  - Type: data
- (highConcentrationAreas.length > 0) { insights.push({ type: "risk", title: "Concentrated Knowledge
  - Context: owledgeDistribution.highConcentrationAreas;
    
    if (highConcentrationAreas.length > 0) {
      insights.push({
        type: "risk",
        title: "Concentrated Knowledge Risk",
        description: `Kn
  - Type: data
- if (lowConcentrationAreas.length > 0) { insights.push({ type: "strength", title: "Well-Distributed
  - Context: knowledgeDistribution.lowConcentrationAreas;
    
    if (lowConcentrationAreas.length > 0) {
      insights.push({
        type: "strength",
        title: "Well-Distributed Knowledge",
        description: 
  - Type: data
- Threshold for low cross-team collaboration
        insights.push({
          type: "risk",
          title: "Team Isolation",
          description: "Teams app
  - Context:     if (crossTeamCollaboration.score < 0.3) { // Threshold for low cross-team collaboration
        insights.push({
          type: "risk",
          title: "Team Isolation",
          description: "Teams app
  - Type: data
- email); if (outsideHoursContributors.length > 0) { insights.push({ type: "observation", title:
  - Context: ardHours)
      .map(([email]) => email);
    
    if (outsideHoursContributors.length > 0) {
      insights.push({
        type: "observation",
        title: "Non-Standard Work Hours",
        description: 
  - Type: data
- ); if (misalignments.length > 0) { insights.push({ type: "risk", title:
  - Context:   teamDynamicsData.teams,
      relationships
    );
    
    if (misalignments.length > 0) {
      insights.push({
        type: "risk",
        title: "Architecture-Team Misalignment",
        description: 
  - Type: data
- * Calculate cross-team collaboration score
  - Context: , or refactoring the architecture to better match team boundaries."
      });
    }
  }
  
  return insights;
}

/**
 * Calculate cross-team collaboration score
 */
function calculateCrossTeamCollaboration(te
  - Type: data
- from 'fs/promises'; import path from 'path'; interface FileMetrics { filePath:
  - Context: import fs from 'fs/promises';
import path from 'path';

interface FileMetrics {
  filePath: string;
  language: string;
  
  - Type: freemium
- number; params: number; }[]; } interface ProjectMetrics { totalFiles: number;
  - Context: ame: string;
    lineCount: number;
    complexity: number;
    params: number;
  }[];
}

interface ProjectMetrics {
  totalFiles: number;
  totalLines: number;
  totalCodeLines: number;
  totalCommentLi
  - Type: freemium
- Find all code files
  const files = await findCodeFiles(repositoryPath);
  - Context: code metrics for a repository
 */
export async function analyzeCodeMetrics(repositoryPath: string): Promise<ProjectMetrics> {
  // Find all code files
  const files = await findCodeFiles(repositoryPath);
  - Type: freemium
- Find all code files
  const files = await findCodeFiles(repositoryPath);
  
  //
  - Context: rics for a repository
 */
export async function analyzeCodeMetrics(repositoryPath: string): Promise<ProjectMetrics> {
  // Find all code files
  const files = await findCodeFiles(repositoryPath);
  
  //
  - Type: freemium
- Compile project-level metrics
  const totalLines = fileMetrics.reduce((sum, file) => sum + file.lineCount, 0);
  - Context: ch (error) {
      console.error(`Error analyzing file ${file}:`, error);
    }
  }
  
  // Compile project-level metrics
  const totalLines = fileMetrics.reduce((sum, file) => sum + file.lineCount, 0);

  - Type: freemium
- a repository */ async function findCodeFiles(repositoryPath: string): Promise<string[]> { const
  - Context: **
 * Find all code files in a repository
 */
async function findCodeFiles(repositoryPath: string): Promise<string[]> {
  const patterns = [
    '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx',
    '**/*.py
  - Type: freemium
- This is a simplistic implementation; real parsing would use an AST
  // But for demonstrating the feature it gives reasonable approximation
  let currentFunction = null;
  let function
  - Context:   }[] = [];
  
  // This is a simplistic implementation; real parsing would use an AST
  // But for demonstrating the feature it gives reasonable approximation
  let currentFunction = null;
  let function
  - Type: freemium
- But for demonstrating the feature it gives reasonable approximation
  let currentFunction = null;
  let functionStartLine = 0;
  
  for (let i = 0; i < lines.l
  - Context: ntation; real parsing would use an AST
  // But for demonstrating the feature it gives reasonable approximation
  let currentFunction = null;
  let functionStartLine = 0;
  
  for (let i = 0; i < lines.l
  - Type: freemium
- detectLanguage(file); try { const content = await fs.readFile(filePath, 'utf8'); const
  - Context: , file);
    const language = detectLanguage(file);
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const metrics = analyzeFileMetrics(content, language);
      
      fi
  - Type: ads
- try { const entries = await fs.readdir(currentDir, { withFileTypes: true
  - Context: scanDir(currentDir: string, relativePath: string = '') {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const 
  - Type: ads
- "../../utils/repository-analyzer.js"; import { analyzeCode } from "../../features/basic-analysis/analyzer.js"; import { buildKnowledgeGraph,
  - Context:  listFiles } from "../../utils/repository-analyzer.js";
import { analyzeCode } from "../../features/basic-analysis/analyzer.js";
import { buildKnowledgeGraph, queryKnowledgeGraph } from "../knowledge-graph
  - Type: freemium
- Step 1: Clone/update all repositories
  const primaryRepoPath = await getRepository
  - Context: nalysisType: "dependencies" | "api-usage" | "architectural-patterns",
  contextDepth: number = 2
): Promise<any> {
  // Step 1: Clone/update all repositories
  const primaryRepoPath = await getRepository
  - Type: freemium
- Step 2: Build knowledge gr
  - Context: ies
  const primaryRepoPath = await getRepository(primaryRepoUrl);
  const relatedRepoPaths = await Promise.all(
    relatedRepoUrls.map(url => getRepository(url))
  );
  
  // Step 2: Build knowledge gr
  - Type: freemium
- related repositories`); const relatedGraphsPromises = relatedRepoUrls.map(async (url, index) => {
  - Context: uilding knowledge graphs for ${relatedRepoUrls.length} related repositories`);
  const relatedGraphsPromises = relatedRepoUrls.map(async (url, index) => {
    console.log(`Building graph for related repo
  - Type: freemium
- Step 3: Analyze cross-repository relationships based on ana
  - Context: : await buildKnowledgeGraph(url, contextDepth, false)
    };
  });
  
  const relatedGraphs = await Promise.all(relatedGraphsPromises);
  
  // Step 3: Analyze cross-repository relationships based on ana
  - Type: freemium
- Step 3: Analyze cross-repository relationships based on analysis type
  let crossRep
  - Context: ph(url, contextDepth, false)
    };
  });
  
  const relatedGraphs = await Promise.all(relatedGraphsPromises);
  
  // Step 3: Analyze cross-repository relationships based on analysis type
  let crossRep
  - Type: freemium
- await summarizeRepository(primaryRepoUrl) }, relatedRepositories: await Promise.all(relatedRepoUrls.map(async (url) => ({ url,
  - Context: Url,
      summary: await summarizeRepository(primaryRepoUrl)
    },
    relatedRepositories: await Promise.all(relatedRepoUrls.map(async (url) => ({
      url,
      summary: await summarizeRepository(u
  - Type: freemium
- Step 1: Get dependency nodes from primary repo
  co
  - Context: /
async function analyzeCrossDependencies(
  primaryRepoUrl: string,
  relatedRepoUrls: string[]
): Promise<any> {
  const results: any[] = [];
  
  // Step 1: Get dependency nodes from primary repo
  co
  - Type: freemium
- This is a more complex analysis that would identify:
  // 1. Exported functions/cla
  - Context: tories
 */
async function analyzeApiUsage(
  primaryRepoUrl: string,
  relatedRepoUrls: string[]
): Promise<any> {
  // This is a more complex analysis that would identify:
  // 1. Exported functions/cla
  - Type: freemium
- This would identify common architectural patterns like:
  // - Similar module struc
  - Context: ync function analyzeArchitecturalPatterns(
  primaryRepoUrl: string,
  relatedRepoUrls: string[]
): Promise<any> {
  // This would identify common architectural patterns like:
  // - Similar module struc
  - Type: freemium
- */ async function summarizeRepository(repositoryUrl: string): Promise<any> { try { const
  - Context: * Generate a summary of a repository
 */
async function summarizeRepository(repositoryUrl: string): Promise<any> {
  try {
    const repoPath = await getRepository(repositoryUrl);
    const files = listF
  - Type: freemium
- Try to detect package.json or other project files
    const hasPackageJson = files.some(file => file.endsWith('package.json'));
    let pac
  - Context: length > 1 ? parts[0] : '__root__';
      })
    );
    
    // Try to detect package.json or other project files
    const hasPackageJson = files.some(file => file.endsWith('package.json'));
    let pac
  - Type: freemium
- fileTypes, topLevelDirectories: Array.from(rootDirs), packageInfo, isJavaScriptProject: hasPackageJson, isPythonProject: files.some(file => file.endsWith('requirements.txt')
  - Context:    fileTypes,
      topLevelDirectories: Array.from(rootDirs),
      packageInfo,
      isJavaScriptProject: hasPackageJson,
      isPythonProject: files.some(file => file.endsWith('requirements.txt') ||
  - Type: freemium
- Array.from(rootDirs), packageInfo, isJavaScriptProject: hasPackageJson, isPythonProject: files.some(file => file.endsWith('requirements.txt') || file.endsWith('setup.py')),
  - Context: : Array.from(rootDirs),
      packageInfo,
      isJavaScriptProject: hasPackageJson,
      isPythonProject: files.some(file => file.endsWith('requirements.txt') || file.endsWith('setup.py')),
      isJa
  - Type: freemium
- => file.endsWith('requirements.txt') || file.endsWith('setup.py')), isJavaProject: files.some(file => file.endsWith('pom.xml') || file.endsWith('build.gradle'))
  - Context: ct: files.some(file => file.endsWith('requirements.txt') || file.endsWith('setup.py')),
      isJavaProject: files.some(file => file.endsWith('pom.xml') || file.endsWith('build.gradle'))
    };
  } catch
  - Type: freemium
- relatedRepository: relatedUrl, type: "shared-dependencies", items: sharedDependencies.map(dep => ({ name: dep.name,
  - Context: primaryRepoUrl,
        relatedRepository: relatedUrl,
        type: "shared-dependencies",
        items: sharedDependencies.map(dep => ({
          name: dep.name,
          details: dep.attributes
    
  - Type: marketplace
- * Analyze API usage between repositories
  - Context:      details: dep.attributes
        }))
      });
    }
  }
  
  return results;
}

/**
 * Analyze API usage between repositories
 */
async function analyzeApiUsage(
  primaryRepoUrl: string,
  relatedRepoUrl
  - Type: api
- For now, return a placeholder implementation
  return {
    message: "API usage analysis not fully implemented yet",
    primaryRepository: primaryRepoUrl,
    relatedRepositories
  - Context: orts in related repos
  
  // For now, return a placeholder implementation
  return {
    message: "API usage analysis not fully implemented yet",
    primaryRepository: primaryRepoUrl,
    relatedRepositories
  - Type: api
- = path.join(repoPath, 'package.json'); const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8'); const packageData
  - Context: onst packageJsonPath = path.join(repoPath, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageData = JSON.parse(packageJsonContent);
     
  - Type: ads
- file.endsWith('pom.xml') || file.endsWith('build.gradle')) }; } catch (error) { console.error(`Error summarizing
  - Context: p.py')),
      isJavaProject: files.some(file => file.endsWith('pom.xml') || file.endsWith('build.gradle'))
    };
  } catch (error) {
    console.error(`Error summarizing repository: ${(error as Error)
  - Type: ads
- .optional() .describe("Optional file pattern to limit search (e.g., '*.ts')"), maxResults:
  - Context:    filePattern: z
        .string()
        .optional()
        .describe("Optional file pattern to limit search (e.g., '*.ts')"),
      maxResults: z
        .number()
        .default(10)
        .descri
  - Type: freemium
- This feature provides specialized tools for developers working with the
  - Context: /**
 * Developer Tools Feature
 *
 * This feature provides specialized tools for developers working with the MCP codebase.
 * These tools are designed to
  - Type: freemium
- are designed to enhance developer productivity by providing quick access
  - Context: ools for developers working with the MCP codebase.
 * These tools are designed to enhance developer productivity by providing quick access
 * to common tasks, code insights, and documentation.
 *
 * Feat
  - Type: freemium
- to enhance developer productivity by providing quick access * to
  - Context: ers working with the MCP codebase.
 * These tools are designed to enhance developer productivity by providing quick access
 * to common tasks, code insights, and documentation.
 *
 * Features include:
 *
  - Type: freemium
- Understanding the current state of the project */ import {
  - Context: kly accessing documentation
 * - Analyzing dependencies
 * - Understanding the current state of the project
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zo
  - Type: freemium
- */ import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; import { z
  - Context: es
 * - Understanding the current state of the project
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { existsSync, readFileSync } from "fs";
im
  - Type: freemium
- join, resolve } from "path"; import { execSync } from
  - Context: nc, readFileSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responses.js";


  - Type: freemium
- Tool to show project info
  server.tool("project-info", {}, async () => {
    try {
      const packageJsonPath = jo
  - Context:           },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool to show project info
  server.tool("project-info", {}, async () => {
    try {
      const packageJsonPath = jo
  - Type: freemium
- Tool to show project info
  server.tool("project-info", {}, async () => {
    try {
      const packageJsonPath = join(process.cwd(), "package.j
  - Context:         isError: true,
        };
      }
    }
  );

  // Tool to show project info
  server.tool("project-info", {}, async () => {
    try {
      const packageJsonPath = join(process.cwd(), "package.j
  - Type: freemium
- => { try { const packageJsonPath = join(process.cwd(), "package.json"); let
  - Context: t info
  server.tool("project-info", {}, async () => {
    try {
      const packageJsonPath = join(process.cwd(), "package.json");
      let packageInfo = {};

      if (existsSync(packageJsonPath)) {
 
  - Type: freemium
- timestamp: new Date().toISOString(), }, "project-info" ); return { content: [
  - Context:    gitInfo,
          fileStats,
          timestamp: new Date().toISOString(),
        },
        "project-info"
      );

      return {
        content: [
          {
            type: "text",
       
  - Type: freemium
- instanceof Error ? error.message : String(error), "project-info" ), null, 2
  - Context: rResponse(
                error instanceof Error ? error.message : String(error),
                "project-info"
              ),
              null,
              2
            ),
          },
        
  - Type: freemium
- }) => { try { const filePath = resolve(process.cwd(), path);
  - Context: ,
    },
    async ({ path, startLine, endLine }) => {
      try {
        const filePath = resolve(process.cwd(), path);

        if (!existsSync(filePath)) {
          throw new Error(`File not found: 
  - Type: freemium
- }) => { try { const dirPath = resolve(process.cwd(), path);
  - Context: ders to show"),
    },
    async ({ path, depth }) => {
      try {
        const dirPath = resolve(process.cwd(), path);

        if (!existsSync(dirPath)) {
          throw new Error(`Directory not fou
  - Type: freemium
- are designed to enhance developer productivity by providing quick access
  - Context: ools for developers working with the MCP codebase.
 * These tools are designed to enhance developer productivity by providing quick access
 * to common tasks, code insights, and documentation.
 *
 * Features
  - Type: marketplace
- import { existsSync, readFileSync } from "fs"; import { join,
  - Context: r } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process"
  - Type: ads
- ${searchPattern} -r "${query}" src --color=never | head -n ${maxResults}`; let
  - Context: tern}"` : "";
        const command = `grep -n ${searchPattern} -r "${query}" src --color=never | head -n ${maxResults}`;

        let results;
        try {
          results = execSync(command, { enco
  - Type: ads
- if (existsSync(packageJsonPath)) { const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")); packageInfo =
  - Context: ackageInfo = {};

      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
        packageInfo = {
          name: packageJson.name,
      
  - Type: ads
- not found: ${path}`); } const content = readFileSync(filePath, "utf8"); const
  - Context: Path)) {
          throw new Error(`File not found: ${path}`);
        }

        const content = readFileSync(filePath, "utf8");
        const lines = content.split("\n");

        let fileContent;
   
  - Type: ads
- Adjust for 0-based indexing
          const start = Math.max(0, startLine - 1);
          const end =
  - Context: s = content.split("\n");

        let fileContent;
        if (startLine && endLine) {
          // Adjust for 0-based indexing
          const start = Math.max(0, startLine - 1);
          const end = 
  - Type: ads
- = `find ${dirPath} -type d | sort | head -n
  - Context: ectory not found: ${path}`);
        }

        const command = `find ${dirPath} -type d | sort | head -n 100 | awk 'BEGIN {FS="/"}{for(i=1;i<=NF;i++){if(i==NF){printf("%s\\n", $i)}else{printf("%s/", $i
  - Type: ads
- to common tasks, code insights, and documentation. * * Features
  - Context: s are designed to enhance developer productivity by providing quick access
 * to common tasks, code insights, and documentation.
 *
 * Features include:
 * - Searching for code in the repository
 * - Quickly 
  - Type: data
- from "@modelcontextprotocol/sdk/server/mcp.js"; import { z } from "zod"; import path
  - Context: import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import path from 'path';

export function registe
  - Type: freemium
- Analyze each file
      const results = await Promise.all(
        files.map(async (file: { path: string; content: string }) => {
          const ext
  - Context: }) => {
      const { files } = args;
      
      // Analyze each file
      const results = await Promise.all(
        files.map(async (file: { path: string; content: string }) => {
          const ext
  - Type: freemium
- Helper function to calculate metrics for a file
  - Context: Line + 1,
    recommendations: [
      "Consider breaking this function into smaller parts",
      "Add more descriptive variable names"
    ]
  };
}

// Helper function to calculate metrics for a file

  - Type: ads
- from "../../registry/index.js"; /** * Register basic code analysis features with
  - Context: ../types/responses.js";
import { getToolRegistry } from "../../registry/index.js";

/**
 * Register basic code analysis features with the MCP server
 *
 * This function registers a set of tools for analyzi
  - Type: freemium
- * and metrics. These tools provide the foundation for understanding
  - Context: on registers a set of tools for analyzing code structure, dependencies,
 * and metrics. These tools provide the foundation for understanding code repositories
 * and individual files, which can be used b
  - Type: freemium
- URL * - review-code: A prompt for requesting human-like code
  - Context: * - analysis-results: A resource for accessing detailed analysis results by URL
 * - review-code: A prompt for requesting human-like code reviews
 *
 * @param server - The MCP server instance to register
  - Type: freemium
- from "@modelcontextprotocol/sdk/server/mcp.js"; * import { registerBasicAnalysisFeatures } from "./features/basic-analysis/index.js"; *
  - Context: escript
 * import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
 * import { registerBasicAnalysisFeatures } from "./features/basic-analysis/index.js";
 *
 * const server = new McpServer({ n
  - Type: freemium
- } from "./features/basic-analysis/index.js"; * * const server = new McpServer({
  - Context: delcontextprotocol/sdk/server/mcp.js";
 * import { registerBasicAnalysisFeatures } from "./features/basic-analysis/index.js";
 *
 * const server = new McpServer({ name: "code-analyzer", version: "1.0.0" })
  - Type: freemium
- new McpServer({ name: "code-analyzer", version: "1.0.0" }); * registerBasicAnalysisFeatures(server); *
  - Context: ex.js";
 *
 * const server = new McpServer({ name: "code-analyzer", version: "1.0.0" });
 * registerBasicAnalysisFeatures(server);
 * ```
 */
export function registerBasicAnalysisFeatures(server: McpServer
  - Type: freemium
- Import the tool registry
  const registry = getToolRegist
  - Context: , version: "1.0.0" });
 * registerBasicAnalysisFeatures(server);
 * ```
 */
export function registerBasicAnalysisFeatures(server: McpServer) {
  // Import the tool registry
  const registry = getToolRegist
  - Type: freemium
- Import the tool registry
  const registry = getToolRegistry();
  const source = "basic-analysis";

  // Tool for analyzing code dependencies - only register if not already registered
  i
  - Context:  McpServer) {
  // Import the tool registry
  const registry = getToolRegistry();
  const source = "basic-analysis";

  // Tool for analyzing code dependencies - only register if not already registered
  i
  - Type: freemium
- .string() .optional() .describe( "Programming language of the code (e.g., 'javascript',
  - Context:  ),
        language: z
          .string()
          .optional()
          .describe(
            "Programming language of the code (e.g., 'javascript', 'python', 'typescript', 'rust')"
          ),
   
  - Type: freemium
- Prompt for requesting code review
  server.prompt(
    "review-code",
    {
      code: z.string().desc
  - Context: Path}`,
            mimeType: "application/json",
          },
        ],
      };
    }
  );

  // Prompt for requesting code review
  server.prompt(
    "review-code",
    {
      code: z.string().desc
  - Type: freemium
- Prompt for requesting code review
  server.prompt(
    "review-code",
    {
      code: z.string().describe("The source code to review"),
      la
  - Context: json",
          },
        ],
      };
    }
  );

  // Prompt for requesting code review
  server.prompt(
    "review-code",
    {
      code: z.string().describe("The source code to review"),
      la
  - Type: freemium
- * It first registers the basic analysis features, then adds
  - Context: 
 * analyze-repository tool that combines multiple analysis capabilities.
 * It first registers the basic analysis features, then adds the composite
 * analyze-repository tool on top.
 *
 * The analyze-rep
  - Type: freemium
- registerAnalysisTools } from "./features/basic-analysis/index.js"; * * const server = new
  - Context: rom "@modelcontextprotocol/sdk/server/mcp.js";
 * import { registerAnalysisTools } from "./features/basic-analysis/index.js";
 *
 * const server = new McpServer({ name: "code-analyzer", version: "1.0.0" })
  - Type: freemium
- toolName, schema, handler, "basic-analysis" ); } catch (error) { console.error(`Error
  - Context: try.registerWithServer(
        server,
        toolName,
        schema,
        handler,
        "basic-analysis"
      );
    } catch (error) {
      console.error(`Error registering ${toolName}:`, erro
  - Type: freemium
- Probe for existing tools using a temporary tool
  const probeResult = registerAnalyzerToolWithRegistry(
  - Context: {
      console.error(`Error registering ${toolName}:`, error);
      return false;
    }
  }

  // Probe for existing tools using a temporary tool
  const probeResult = registerAnalyzerToolWithRegistry(
  - Type: freemium
- Probe for existing tools using a temporary tool
  const probeResult = registerAnalyzerToolWithRegistry(
    server,
    "_temp_analyze_tool_probe",
    {
  - Context: error);
      return false;
    }
  }

  // Probe for existing tools using a temporary tool
  const probeResult = registerAnalyzerToolWithRegistry(
    server,
    "_temp_analyze_tool_probe",
    {
     
  - Type: freemium
- Handler will never be called as this
  - Context: ry tool
  const probeResult = registerAnalyzerToolWithRegistry(
    server,
    "_temp_analyze_tool_probe",
    {
      repoUrl: z.string().optional(),
    },
    // Handler will never be called as this 
  - Type: freemium
- Handler will never be called as this is just a probe
    async () => ({})
  );

  if (probeResult) {
    // The temporary tool was registered successf
  - Context: 
      repoUrl: z.string().optional(),
    },
    // Handler will never be called as this is just a probe
    async () => ({})
  );

  if (probeResult) {
    // The temporary tool was registered successf
  - Type: freemium
- Handler will never be called as this is just a probe
    async () => ({})
  );

  if (probeResult) {
    // The temporary tool was registered successfully, which means no tools exist yet
  - Context:     },
    // Handler will never be called as this is just a probe
    async () => ({})
  );

  if (probeResult) {
    // The temporary tool was registered successfully, which means no tools exist yet
  
  - Type: freemium
- Register the basic analysis features
    registerBasicAnalysisFeatures(server);
  } else {
    // Error during registr
  - Context:  The temporary tool was registered successfully, which means no tools exist yet
    // Register the basic analysis features
    registerBasicAnalysisFeatures(server);
  } else {
    // Error during registr
  - Type: freemium
- Register the basic analysis features
    registerBasicAnalysisFeatures(server);
  } else {
    // Error during registration indicates tools are already re
  - Context: uccessfully, which means no tools exist yet
    // Register the basic analysis features
    registerBasicAnalysisFeatures(server);
  } else {
    // Error during registration indicates tools are already re
  - Type: freemium
- Always register the anal
  - Context: during registration indicates tools are already registered
    console.log(
      "[Registry] Info: Probe tool registration failed, assuming tools already exist"
    );
  }

  // Always register the anal
  - Type: freemium
- Tool for analyzing code dependencies - only register if not already registered
  if (!registry.isToolRegistered("analyze-dependencies")) {
    // Only register if not
  - Context: st source = "basic-analysis";

  // Tool for analyzing code dependencies - only register if not already registered
  if (!registry.isToolRegistered("analyze-dependencies")) {
    // Only register if not
  - Type: ads
- Only register if not already in the registry
    server.tool(
      "analyze-dependencies",
      {
        repositoryUrl: z
  - Context: istered
  if (!registry.isToolRegistered("analyze-dependencies")) {
    // Only register if not already in the registry
    server.tool(
      "analyze-dependencies",
      {
        repositoryUrl: z
  
  - Type: ads
- content to analyze directly instead of from a repository" ),
  - Context:          .optional()
          .describe(
            "Source code content to analyze directly instead of from a repository"
          ),
        language: z
          .string()
          .optional()
  
  - Type: ads
- Implementation already registered with server
        return null;
      },
      source
    );
  }

  // Tool for calcul
  - Context:        fileContent?: string;
        language?: string;
      }) => {
        // Implementation already registered with server
        return null;
      },
      source
    );
  }

  // Tool for calcul
  - Type: ads
- = path.join(repoPath, filePath); const content = fs.readFileSync(fullPath, "utf8"); const analysis
  - Context: pository(repoUrl);
      const fullPath = path.join(repoPath, filePath);
      const content = fs.readFileSync(fullPath, "utf8");
      const analysis = analyzeCode(content, path.extname(filePath).slice
  - Type: ads
- the basic analysis features, then adds the composite * analyze-repository
  - Context: at combines multiple analysis capabilities.
 * It first registers the basic analysis features, then adds the composite
 * analyze-repository tool on top.
 *
 * The analyze-repository tool is particularl
  - Type: ads
- Error during registration indicates tools are already registered
    console.log(
      "[Registry] Info: Probe tool registration failed, assuming tools
  - Context: rBasicAnalysisFeatures(server);
  } else {
    // Error during registration indicates tools are already registered
    console.log(
      "[Registry] Info: Probe tool registration failed, assuming tools
  - Type: ads
- Always register the analyze-repository tool, replacing if needed
  registe
  - Context: istered
    console.log(
      "[Registry] Info: Probe tool registration failed, assuming tools already exist"
    );
  }

  // Always register the analyze-repository tool, replacing if needed
  registe
  - Type: ads
- by AI agents to gain insights into codebases. * *
  - Context: for understanding code repositories
 * and individual files, which can be used by AI agents to gain insights into codebases.
 *
 * Registered tools:
 * - analyze-dependencies: Analyzes dependencies between co
  - Type: data
- { z } from "zod"; import { McpServer } from
  - Context: port { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CodeAnalysisResult } from "../../types/responses.js";
import {
  
  - Type: freemium
- string, language?: string ): Promise<any> { return executeWithTiming("analyze-repository", async ()
  - Context: unction analyzeRepository(
  repositoryUrl?: string,
  fileContent?: string,
  language?: string
): Promise<any> {
  return executeWithTiming("analyze-repository", async () => {
    if (repositoryUrl) {

  - Type: freemium
- * Analyze a single code snippet
  - Context: OString(),
      };
    } else {
      throw new Error("Either repositoryUrl or fileContent must be provided");
    }
  });
}

/**
 * Analyze a single code snippet
 */
export function analyzeCode(
  code
  - Type: freemium
- This would ideally use a language-specific parser
  // For demonstration, we'll do a simple analysis
  const functions = extractFunctions(code, language);
  const
  - Context:  string
): DetailedAnalysisResult {
  // This would ideally use a language-specific parser
  // For demonstration, we'll do a simple analysis
  const functions = extractFunctions(code, language);
  const 
  - Type: freemium
- Basic metrics
  const lines = code.split("\n");
  const avgLineLength =
    lines.reduce((sum, line) => s
  - Context:  * metrics.complexity.cognitive
  );

  const issues: string[] = [];
  let readability = 100;

  // Basic metrics
  const lines = code.split("\n");
  const avgLineLength =
    lines.reduce((sum, line) => s
  - Type: freemium
- analysis */ export async function getMetrics(options: MetricsOptions): Promise<any> { const
  - Context: ics for files or a previous analysis
 */
export async function getMetrics(options: MetricsOptions): Promise<any> {
  const {
    repositoryUrl,
    filePath,
    fileContent,
    language,
    metrics,
 
  - Type: freemium
- If analysisId is provided, retrieve from cache
  if (analysisId) {
    const cachedAnalysis = analysisCache.get(analysis
  - Context: Content,
    language,
    metrics,
    analysisId,
    type,
  } = options;

  // If analysisId is provided, retrieve from cache
  if (analysisId) {
    const cachedAnalysis = analysisCache.get(analysis
  - Type: freemium
- Analyze provided content
    return calculateMetrics(fileContent, language, metrics);
  } else {
    throw new
  - Context: calculateMetrics(code, language, metrics);
  } else if (fileContent !== undefined) {
    // Analyze provided content
    return calculateMetrics(fileContent, language, metrics);
  } else {
    throw new 
  - Type: freemium
- * Extract imported modules from code
  - Context: ics);
  } else {
    throw new Error(
      "Either repositoryUrl, filePath, or fileContent must be provided"
    );
  }
}

/**
 * Extract imported modules from code
 */
function extractImports(code: str
  - Type: freemium
- Basic implementation - would be replaced with language-specific parsers
  const imports: string[] = [];
  - Context: ted modules from code
 */
function extractImports(code: string, language?: string): string[] {
  // Basic implementation - would be replaced with language-specific parsers
  const imports: string[] = [];


  - Type: freemium
- Basic implementation - would be replaced with language-specific parsers
  const functions: string[] = [];
  - Context: ion names from code
 */
function extractFunctions(code: string, language?: string): string[] {
  // Basic implementation - would be replaced with language-specific parsers
  const functions: string[] = [];
  - Type: freemium
- Basic implementation - would be replaced with language-specific parsers
  const classes: string[] = [];
  - Context: class names from code
 */
function extractClasses(code: string, language?: string): string[] {
  // Basic implementation - would be replaced with language-specific parsers
  const classes: string[] = [];


  - Type: freemium
- Calculate basic metrics
  const lines = code.split("\n");
  const avgLineLength =
    lines.reduce((sum, line) => s
  - Context:   cognitive: 0,
        maintainability: 100,
      },
      issues: [],
    };
  }

  // Calculate basic metrics
  const lines = code.split("\n");
  const avgLineLength =
    lines.reduce((sum, line) => s
  - Type: freemium
- Basic implementation
      console.log("Analyzing repository:", args.repositoryUrl);

      // Handle spe
  - Context:   .optional()
        .describe("Specific files to analyze"),
    },
    async (args) => {
      // Basic implementation
      console.log("Analyzing repository:", args.repositoryUrl);

      // Handle spe
  - Type: freemium
- Handle specific files if provided
      if (args.specificFiles && args.specificFiles.length > 0) {
        console.log("Analyzin
  - Context: 
      console.log("Analyzing repository:", args.repositoryUrl);

      // Handle specific files if provided
      if (args.specificFiles && args.specificFiles.length > 0) {
        console.log("Analyzin
  - Type: freemium
- (not comprehensive) const classRegex = /class\s+(\w+)(?:\s+extends\s+\w+)?/g; let match; while ((match
  - Context: ple regex to find class declarations (not comprehensive)
    const classRegex = /class\s+(\w+)(?:\s+extends\s+\w+)?/g;
    let match;
    while ((match = classRegex.exec(code)) !== null) {
      classes.pus
  - Type: subscription
- Store results in cache
      const results = {
        repositoryUrl,
        analysisId,
        depende
  - Context: dency analysis
      const dependencies = extractDependencies(repoPath, files, language);

      // Store results in cache
      const results = {
        repositoryUrl,
        analysisId,
        depende
  - Type: marketplace
- number; } interface AnalysisResult { readability: number; maintainability: number; complexity:
  - Context: clomatic: number;
  cognitive: number;
  maintainability: number;
}

interface AnalysisResult {
  readability: number;
  maintainability: number;
  complexity: number;
  issues: string[];
}

interface D
  - Type: ads
- issues: string[]; } interface DetailedAnalysisResult { readability: number; maintainability: number;
  - Context: bility: number;
  complexity: number;
  issues: string[];
}

interface DetailedAnalysisResult {
  readability: number;
  maintainability: number;
  complexity: ComplexityMetrics;
  issues: string[];
}


  - Type: ads
- Basic metrics
  const lines = code.split("\n");
  const avgLineLength =
    lin
  - Context: yclomatic) -
      0.23 * metrics.complexity.cognitive
  );

  const issues: string[] = [];
  let readability = 100;

  // Basic metrics
  const lines = code.split("\n");
  const avgLineLength =
    lin
  - Type: ads
- Count long fu
  - Context: ines.reduce((sum, line) => sum + line.length, 0) / lines.length;

  if (avgLineLength > 80) {
    readability -= 10;
    issues.push("Average line length exceeds 80 characters");
  }

  // Count long fu
  - Type: ads
- complexity (${metrics.complexity.cyclomatic})` ); } return { readability: Math.max(0, readability), maintainability:
  - Context: 
      `High cyclomatic complexity (${metrics.complexity.cyclomatic})`
    );
  }

  return {
    readability: Math.max(0, readability),
    maintainability: Math.max(0, maintainability),
    complexity
  - Type: ads
- ); } return { readability: Math.max(0, readability), maintainability: Math.max(0, maintainability),
  - Context: omplexity (${metrics.complexity.cyclomatic})`
    );
  }

  return {
    readability: Math.max(0, readability),
    maintainability: Math.max(0, maintainability),
    complexity: metrics.complexity,
   
  - Type: ads
- = path.join(repoPath, filePath); const code = fs.readFileSync(fullPath, "utf8"); return calculateMetrics(code,
  - Context: Analyze specific file
      const fullPath = path.join(repoPath, filePath);
      const code = fs.readFileSync(fullPath, "utf8");
      return calculateMetrics(code, language, metrics);
    } else {
   
  - Type: ads
- const fullPath = path.join(repoPath, file); const code = fs.readFileSync(fullPath, "utf8");
  - Context: onst file of files) {
        const fullPath = path.join(repoPath, file);
        const code = fs.readFileSync(fullPath, "utf8");
        allMetrics[file] = calculateMetrics(
          code,
          p
  - Type: ads
- Analyze local file
    const code = fs.readFileSync(filePath, "utf8");
    return calculateMetrics(code, language, metrics);
  } else if (fileC
  - Context:   return allMetrics;
    }
  } else if (filePath) {
    // Analyze local file
    const code = fs.readFileSync(filePath, "utf8");
    return calculateMetrics(code, language, metrics);
  } else if (fileC
  - Type: ads
- = path.join(repoPath, file); try { const code = fs.readFileSync(fullPath, "utf8");
  - Context:  file of files) {
    const fullPath = path.join(repoPath, file);
    try {
      const code = fs.readFileSync(fullPath, "utf8");
      const fileLanguage = language || path.extname(file).slice(1);
    
  - Type: ads
- (error) { console.warn(`Error reading file ${file}: ${(error as Error).message}`); }
  - Context: ncies[file] = extractImports(code, fileLanguage);
    } catch (error) {
      console.warn(`Error reading file ${file}: ${(error as Error).message}`);
    }
  }

  return dependencies;
}

/**
 * Calcula
  - Type: ads
- Handle empty files
  if (!code.trim()) {
    return {
      readability: 100,
      maintainability: 100,
      complexity: {
        cyclomatic: 1,
        cogniti
  - Context: ng[]
): DetailedAnalysisResult {
  // Handle empty files
  if (!code.trim()) {
    return {
      readability: 100,
      maintainability: 100,
      complexity: {
        cyclomatic: 1,
        cogniti
  - Type: ads
- 0) / lines.length; let readability = 100; const issues: string[]
  - Context: const avgLineLength =
    lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
  let readability = 100;
  const issues: string[] = [];

  if (avgLineLength > 80) {
    readability -= 10;
  
  - Type: ads
- Calculate cyc
  - Context: .length;
  let readability = 100;
  const issues: string[] = [];

  if (avgLineLength > 80) {
    readability -= 10;
    issues.push("Average line length exceeds 80 characters");
  }

  // Calculate cyc
  - Type: ads
- Add nesting complexity only for actual control structures
  const nestingLevels = codeStructures.filte
  - Context: const matches = codeLine.match(structure) || [];
      cognitive += matches.length;
    }
  }

  // Add nesting complexity only for actual control structures
  const nestingLevels = codeStructures.filte
  - Type: ads
- 5.2 * Math.log(cyclomatic) - 0.23 * cognitive ); return {
  - Context: y = Math.max(
    0,
    171 - 5.2 * Math.log(cyclomatic) - 0.23 * cognitive
  );

  return {
    readability: Math.max(0, readability),
    maintainability: Math.max(0, maintainability),
    complexity
  - Type: ads
- - 0.23 * cognitive ); return { readability: Math.max(0, readability),
  - Context: 171 - 5.2 * Math.log(cyclomatic) - 0.23 * cognitive
  );

  return {
    readability: Math.max(0, readability),
    maintainability: Math.max(0, maintainability),
    complexity: {
      cyclomatic,
   
  - Type: ads
- string, language?: string ): { readability: number; maintainability: number; complexity:
  - Context: ode quality metrics
 */
function calculateCodeQuality(
  code: string,
  language?: string
): {
  readability: number;
  maintainability: number;
  complexity: number;
  issues: string[];
} {
  const is
  - Type: ads
- Basic metrics
  const lines = code.split("\n");
  - Context: ility: number;
  complexity: number;
  issues: string[];
} {
  const issues: string[] = [];
  let readability = 100;
  let maintainability = 100;

  // Basic metrics
  const lines = code.split("\n");
  
  - Type: ads
- cyclomatic complexity (${complexity.cyclomatic})`); } return { readability: Math.max(0, readability), maintainability:
  - Context: ) {
    issues.push(`High cyclomatic complexity (${complexity.cyclomatic})`);
  }

  return {
    readability: Math.max(0, readability),
    maintainability: Math.max(0, maintainability),
    complexity
  - Type: ads
- (${complexity.cyclomatic})`); } return { readability: Math.max(0, readability), maintainability: Math.max(0, maintainability),
  - Context:  cyclomatic complexity (${complexity.cyclomatic})`);
  }

  return {
    readability: Math.max(0, readability),
    maintainability: Math.max(0, maintainability),
    complexity: complexity.cyclomatic,

  - Type: ads
- ["complexity", "maintainability"] }) => { const code = fs.readFileSync(filePath, "utf8");
  - Context: 
    async ({ filePath, metrics = ["complexity", "maintainability"] }) => {
      const code = fs.readFileSync(filePath, "utf8");
      const language = path.extname(filePath).slice(1);

      const res
  - Type: ads
- ({ filePath, metrics }) => { const code = fs.readFileSync(filePath,
  - Context: cific metrics to calculate"),
    },
    async ({ filePath, metrics }) => {
      const code = fs.readFileSync(filePath, "utf8");
      const result = calculateMetrics(
        code,
        path.extnam
  - Type: ads
- string, language?: string, metrics: string[] = ["readability", "maintainability", "complexity"] ):
  - Context:  );
}

function analyzeCodeDetailed(
  code: string,
  language?: string,
  metrics: string[] = ["readability", "maintainability", "complexity"]
): DetailedAnalysisResult {
  const result: DetailedAnaly
  - Type: ads
- const result: DetailedAnalysisResult = { readability: 0, maintainability: 0, complexity:
  - Context: bility", "complexity"]
): DetailedAnalysisResult {
  const result: DetailedAnalysisResult = {
    readability: 0,
    maintainability: 0,
    complexity: {
      cyclomatic: 0,
      cognitive: 0,
     
  - Type: ads
- }, issues: [], }; if (metrics.includes("readability")) { result.readability = calculateReadability(code,
  - Context:      cognitive: 0,
      maintainability: 0,
    },
    issues: [],
  };

  if (metrics.includes("readability")) {
    result.readability = calculateReadability(code, language);
  }

  if (metrics.inclu
  - Type: ads
- issues: [], }; if (metrics.includes("readability")) { result.readability = calculateReadability(code, language);
  - Context: ntainability: 0,
    },
    issues: [],
  };

  if (metrics.includes("readability")) {
    result.readability = calculateReadability(code, language);
  }

  if (metrics.includes("maintainability")) {
  
  - Type: ads
- }; if (metrics.includes("readability")) { result.readability = calculateReadability(code, language); } if
  - Context: 
    issues: [],
  };

  if (metrics.includes("readability")) {
    result.readability = calculateReadability(code, language);
  }

  if (metrics.includes("maintainability")) {
    result.maintainabilit
  - Type: ads
- result; } function calculateReadability(code: string, language?: string): number { let
  - Context:  result.complexity = calculateMetrics(code, language);
  }

  return result;
}

function calculateReadability(code: string, language?: string): number {
  let readability = 100;
  const lines = code.spl
  - Type: ads
- language?: string): number { let readability = 100; const lines
  - Context:  return result;
}

function calculateReadability(code: string, language?: string): number {
  let readability = 100;
  const lines = code.split("\n");
  const avgLineLength =
    lines.reduce((sum, line
  - Type: ads
- / lines.length; if (avgLineLength > 80) { readability -= 10;
  - Context: ines.reduce((sum, line) => sum + line.length, 0) / lines.length;

  if (avgLineLength > 80) {
    readability -= 10;
  }

  return Math.max(0, readability);
}

function calculateMaintainability(code: st
  - Type: ads
- { readability -= 10; } return Math.max(0, readability); } function
  - Context:  0) / lines.length;

  if (avgLineLength > 80) {
    readability -= 10;
  }

  return Math.max(0, readability);
}

function calculateMaintainability(code: string, language?: string): number {
  const co
  - Type: ads
- ({ repositoryUrl, insightTypes, tags, relatedFile, limit })
  - Context: onal(),
      tags: z.array(z.string()).optional(),
      relatedFile: z.string().optional(),
      limit: z.number().optional()
    },
    async ({ repositoryUrl, insightTypes, tags, relatedFile, limit })
  - Type: freemium
- ({ repositoryUrl, insightTypes, tags, relatedFile, limit }) => { try
  - Context:    limit: z.number().optional()
    },
    async ({ repositoryUrl, insightTypes, tags, relatedFile, limit }) => {
      try {
        const memories = await retrieveMemories({
          repositoryUrl,
    
  - Type: freemium
- repositoryUrl, insightTypes, tags, relatedFile, limit: limit || 10 }); return
  - Context: {
          repositoryUrl,
          insightTypes,
          tags,
          relatedFile,
          limit: limit || 10
        });
        
        return {
          content: [{
            type: "text",

  - Type: freemium
- import { z } from "zod"; import { storeMemory, retrieveMemories,
  - Context:  { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { 
  storeMemory, 
  retrieveMemories, 
  updateMemory, 
  categorizeInsight 
} from "./memory-manager.js";

/
  - Type: marketplace
- Tool to store insights about a codebase
  server.tool(
    "store-codebase-insight",
    {
      repositoryUrl: z
  - Context: es with the MCP server
 */
export function registerMemoryFeatures(server: McpServer) {
  // Tool to store insights about a codebase
  server.tool(
    "store-codebase-insight",
    {
      repositoryUrl: z
  - Type: marketplace
- Tool to store insights about a codebase
  server.tool(
    "store-codebase-insight",
    {
      repositoryUrl: z.string(),
      insightType: z.enum([
        "arch
  - Context: emoryFeatures(server: McpServer) {
  // Tool to store insights about a codebase
  server.tool(
    "store-codebase-insight",
    {
      repositoryUrl: z.string(),
      insightType: z.enum([
        "arch
  - Type: marketplace
- Categorize and store the insight
        const category = await categorizeInsight(insightContent, insightType);
  - Context: yUrl, insightType, insightContent, relatedFiles, tags }) => {
      try {
        // Categorize and store the insight
        const category = await categorizeInsight(insightContent, insightType);
        
  - Type: marketplace
- = await categorizeInsight(insightContent, insightType); const memoryId = await storeMemory({ repositoryUrl,
  - Context: nst category = await categorizeInsight(insightContent, insightType);
        const memoryId = await storeMemory({
          repositoryUrl,
          insightType,
          category,
          insightConten
  - Type: marketplace
- "text", text: `Successfully stored insight with ID: ${memoryId}` }] };
  - Context:   
        return {
          content: [{
            type: "text",
            text: `Successfully stored insight with ID: ${memoryId}`
          }]
        };
      } catch (error) {
        return {
   
  - Type: marketplace
- Tool to store insights about a codebase
  server.tool(
    "store-codebase-insight",
    {
      repositoryUrl: z.string()
  - Context: h the MCP server
 */
export function registerMemoryFeatures(server: McpServer) {
  // Tool to store insights about a codebase
  server.tool(
    "store-codebase-insight",
    {
      repositoryUrl: z.string()
  - Type: data
- Tool to retrieve insights about a codebase
  server.tool(
    "retrieve-codebase-insights",
    {
      repositoryUrl: z.stri
  - Context: essage}`
          }],
          isError: true
        };
      }
    }
  );

  // Tool to retrieve insights about a codebase
  server.tool(
    "retrieve-codebase-insights",
    {
      repositoryUrl: z.stri
  - Type: data
- Tool to retrieve insights about a codebase
  server.tool(
    "retrieve-codebase-insights",
    {
      repositoryUrl: z.string(),
      insightTypes: z.array(z.string()).optional(),
  - Context: }
    }
  );

  // Tool to retrieve insights about a codebase
  server.tool(
    "retrieve-codebase-insights",
    {
      repositoryUrl: z.string(),
      insightTypes: z.array(z.string()).optional(),
      
  - Type: data
- "text", text: `Error retrieving insights: ${(error as Error).message}` }], isError:
  - Context:        return {
          content: [{
            type: "text",
            text: `Error retrieving insights: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );


  - Type: data
- Base query
  let sql = `
    SELECT 
      i.id, 
      i.repositoryUrl,
  - Context: w Error("Database not initialized");
  }

  const { repositoryUrl, insightTypes, tags, relatedFile, limit } = query;
  
  // Base query
  let sql = `
    SELECT 
      i.id, 
      i.repositoryUrl, 
      
  - Type: freemium
- Ensure all tags match
  }
  
  // Add order and limit
  sql += ` ORDER BY i.timestamp DESC`;
  
  if (limit) {
    sql += ` LIMIT ?`;
    params.push(lim
  - Context:  )
    `;
    params.push(...tags, tags.length); // Ensure all tags match
  }
  
  // Add order and limit
  sql += ` ORDER BY i.timestamp DESC`;
  
  if (limit) {
    sql += ` LIMIT ?`;
    params.push(lim
  - Type: freemium
- Add order and limit
  sql += ` ORDER BY i.timestamp DESC`;
  
  if (limit) {
    sql += ` LIMIT ?`;
    params.push(limit);
  }
  
  // Execute query
  const insights = awai
  - Context: sure all tags match
  }
  
  // Add order and limit
  sql += ` ORDER BY i.timestamp DESC`;
  
  if (limit) {
    sql += ` LIMIT ?`;
    params.push(limit);
  }
  
  // Execute query
  const insights = awai
  - Type: freemium
- Add order and limit
  sql += ` ORDER BY i.timestamp DESC`;
  
  if (limit) {
    sql += ` LIMIT ?`;
    params.push(limit);
  }
  
  // Execute query
  const insights = await db.all(sql, params);
  - Context: }
  
  // Add order and limit
  sql += ` ORDER BY i.timestamp DESC`;
  
  if (limit) {
    sql += ` LIMIT ?`;
    params.push(limit);
  }
  
  // Execute query
  const insights = await db.all(sql, params);
  - Type: freemium
- Execute query
  const insights = await db.all(sql, params);
  
  // For each insight,
  - Context: mit
  sql += ` ORDER BY i.timestamp DESC`;
  
  if (limit) {
    sql += ` LIMIT ?`;
    params.push(limit);
  }
  
  // Execute query
  const insights = await db.all(sql, params);
  
  // For each insight,
  - Type: freemium
- Initialize the database if it hasn't been initialized
  if (!db) {
    db = awai
  - Context: tore a new memory/insight about a codebase
 */
export async function storeMemory(insight: Insight): Promise<number> {
  // Initialize the database if it hasn't been initialized
  if (!db) {
    db = awai
  - Type: freemium
- async function retrieveMemories(query: MemoryQuery): Promise<Insight[]> { if (!db) { db
  - Context: /insights based on query parameters
 */
export async function retrieveMemories(query: MemoryQuery): Promise<Insight[]> {
  if (!db) {
    db = await createDatabase("memory");
  }

  if (!db) {
    throw 
  - Type: freemium
- string[]; }): Promise<void> { if (!db) { db = await
  - Context:  insightContent?: string;
  insightType?: string;
  relatedFiles?: string[];
  tags?: string[];
}): Promise<void> {
  if (!db) {
    db = await createDatabase("memory");
  }
  
  if (!db) {
    throw new
  - Type: freemium
- Begin transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Update basic insight data if provided
    if (insightContent || insightType) {
      let sql = `UPDATE insights
  - Context: = updates;
  
  // Begin transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Update basic insight data if provided
    if (insightContent || insightType) {
      let sql = `UPDATE insights 
  - Type: freemium
- Update basic insight data if provided
    if (insightContent || insightType) {
      let sql = `UPDATE insights SET`;
      const pa
  - Context: in transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Update basic insight data if provided
    if (insightContent || insightType) {
      let sql = `UPDATE insights SET`;
      const pa
  - Type: freemium
- Execute update
      await db.run(sql, params);
    }
    
    // Update related files if provided
    if (relatedFiles) {
      // Delete existing relationships
      await db.run(`DELETE FROM
  - Context: 
      // Execute update
      await db.run(sql, params);
    }
    
    // Update related files if provided
    if (relatedFiles) {
      // Delete existing relationships
      await db.run(`DELETE FROM
  - Type: freemium
- Update tags if provided
    if (tags) {
      // Delete existing tags
      await db.run(`DELETE FROM tags WHERE insig
  - Context: ePath) VALUES (?, ?)`,
          [id, filePath]
        );
      }
    }
    
    // Update tags if provided
    if (tags) {
      // Delete existing tags
      await db.run(`DELETE FROM tags WHERE insig
  - Type: freemium
- Simple heuristic for categorization - would be replaced with actual ML/
  - Context: /
export async function categorizeInsight(
  insightContent: string, 
  insightType: InsightType
): Promise<InsightCategory> {
  // Simple heuristic for categorization - would be replaced with actual ML/
  - Type: freemium
- Check for medium-priority keywords
  const mediumKeywords = ["important", "should", "improve", "refactor"];
  if (mediumKeywords.some(keyword => insightContent.toLowerCase().includes(keyword
  - Context: 
  }
  
  // Check for medium-priority keywords
  const mediumKeywords = ["important", "should", "improve", "refactor"];
  if (mediumKeywords.some(keyword => insightContent.toLowerCase().includes(keyword
  - Type: freemium
- * Store a new memory/insight about a codebase
  - Context: alize database connection
let db: Database | undefined; // Will be initialized on first use

/**
 * Store a new memory/insight about a codebase
 */
export async function storeMemory(insight: Insight): Prom
  - Type: marketplace
- Start transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Insert the insight
    const insightResult
  - Context: amp } = insight;
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  // Start transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Insert the insight
    const insightResult 
  - Type: marketplace
- Start transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Insert the insight
    const insightResult = await db.run(
      `INSERT INTO
  - Context:   throw new Error("Database not initialized");
  }
  
  // Start transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Insert the insight
    const insightResult = await db.run(
      `INSERT INTO 
  - Type: marketplace
- Commit transaction
    await db.exec('COMMIT');
    
    return insightId;
  } catch (error) {
    // Rollback transac
  - Context: ightId, tag) VALUES (?, ?)`,
          [insightId, tag]
        );
      }
    }
    
    // Commit transaction
    await db.exec('COMMIT');
    
    return insightId;
  } catch (error) {
    // Rollback transac
  - Type: marketplace
- Rollback transaction on error
    await db.exec('ROLLBACK');
    throw error;
  }
}

/**
 * Retrieve memories/insights b
  - Context: saction
    await db.exec('COMMIT');
    
    return insightId;
  } catch (error) {
    // Rollback transaction on error
    await db.exec('ROLLBACK');
    throw error;
  }
}

/**
 * Retrieve memories/insights b
  - Type: marketplace
- Begin transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Update basic insight data if provided
    i
  - Context: ");
  }
  
  const { id, insightContent, insightType, relatedFiles, tags } = updates;
  
  // Begin transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Update basic insight data if provided
    i
  - Type: marketplace
- Begin transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Update basic insight data if provided
    if (insightContent || insightType) {
  - Context: tent, insightType, relatedFiles, tags } = updates;
  
  // Begin transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Update basic insight data if provided
    if (insightContent || insightType) {
  - Type: marketplace
- Add conditions for related files
  if (relatedFile) {
    sql += `
      JOIN relatedFiles rf ON i.id
  - Context: nt, 
      i.timestamp
    FROM insights i
  `;
  
  const params: any[] = [repositoryUrl];
  
  // Add conditions for related files
  if (relatedFile) {
    sql += `
      JOIN relatedFiles rf ON i.id 
  - Type: ads
- Add conditions for insight types
  if (insightTypes && insightTypes.length > 0) {
    sql += ` AND i.i
  - Context:    `;
    params.push(relatedFile);
  } else {
    sql += ` WHERE i.repositoryUrl = ?`;
  }
  
  // Add conditions for insight types
  if (insightTypes && insightTypes.length > 0) {
    sql += ` AND i.i
  - Type: ads
- Add conditions for tags
  if (tags && tags.length > 0) {
    sql += `
      AND i.id IN (
        SELE
  - Context: tType IN (${insightTypes.map(() => '?').join(',')})`;
    params.push(...insightTypes);
  }
  
  // Add conditions for tags
  if (tags && tags.length > 0) {
    sql += `
      AND i.id IN (
        SELE
  - Type: ads
- Ensure all tags match
  }
  
  // Add order and limit
  sql += ` ORDER BY i.timestamp DESC`;
  
  if (limit) {
    sql += ` LIMIT ?`;
  - Context: tag) = ?
      )
    `;
    params.push(...tags, tags.length); // Ensure all tags match
  }
  
  // Add order and limit
  sql += ` ORDER BY i.timestamp DESC`;
  
  if (limit) {
    sql += ` LIMIT ?`;
  
  - Type: ads
- Insert the insight
    const insightResult = await db.run(
      `INSERT INTO insights (repositoryUrl, insightType, category, insightContent, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
  - Context: ');
  
  try {
    // Insert the insight
    const insightResult = await db.run(
      `INSERT INTO insights (repositoryUrl, insightType, category, insightContent, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
 
  - Type: data
- * Retrieve memories/insights based on query parameters
  - Context: ransaction on error
    await db.exec('ROLLBACK');
    throw error;
  }
}

/**
 * Retrieve memories/insights based on query parameters
 */
export async function retrieveMemories(query: MemoryQuery): Promise<I
  - Type: data
- Add conditions for related files
  if (r
  - Context: yUrl, 
      i.insightType, 
      i.category, 
      i.insightContent, 
      i.timestamp
    FROM insights i
  `;
  
  const params: any[] = [repositoryUrl];
  
  // Add conditions for related files
  if (r
  - Type: data
- Execute query
  const insights = await db.all(sql, params);
  
  // For each insight, fetch related files and tags
  for (const in
  - Context: 
  
  if (limit) {
    sql += ` LIMIT ?`;
    params.push(limit);
  }
  
  // Execute query
  const insights = await db.all(sql, params);
  
  // For each insight, fetch related files and tags
  for (const in
  - Type: data
- For each insight, fetch related files and tags
  for (const insight of insights) {
    // Get related files
    insight.relatedFiles = await db.all(
      `SELECT filePath FROM re
  - Context: db.all(sql, params);
  
  // For each insight, fetch related files and tags
  for (const insight of insights) {
    // Get related files
    insight.relatedFiles = await db.all(
      `SELECT filePath FROM re
  - Type: data
- * Update an existing insight
  - Context: ghtId = ?`,
      [insight.id]
    ).then(rows => rows.map((row: any) => row.tag));
  }
  
  return insights;
}

/**
 * Update an existing insight
 */
export async function updateMemory(updates: {
  id: numbe
  - Type: data
- { let sql = `UPDATE insights SET`; const params: any[]
  - Context: ate basic insight data if provided
    if (insightContent || insightType) {
      let sql = `UPDATE insights SET`;
      const params: any[] = [];
      
      if (insightContent) {
        sql += ` insightCo
  - Type: data
- nodes WHERE name = ? LIMIT 1`, [name] ); if
  - Context: t result = await db.get(
    `SELECT id, type, name, attributes FROM nodes
     WHERE name = ?
     LIMIT 1`,
    [name]
  );
  
  if (!result) {
    return null;
  }
  
  return {
    id: result.id,
    t
  - Type: freemium
- uuidv4 } from "uuid"; import { analyzeCode } from "../basic-analysis/analyzer.js";
  - Context: "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { analyzeCode } from "../basic-analysis/analyzer.js";
import { GraphNode, GraphRelationship, GraphQueryResult, GraphQuery } from "
  - Type: freemium
- Initialize db if needed
  if (!db) {
    db =
  - Context: aph(
  repositoryUrl: string,
  depth: number = 2,
  includeExternalDependencies: boolean = true
): Promise<{ nodes: number, relationships: number }> {
  // Initialize db if needed
  if (!db) {
    db = 
  - Type: freemium
- Process each file
    for (const file of files) {
      const fullPath = path.join(repoPath, file);
  - Context:   url: repositoryUrl,
        fileCount: files.length
      }
    });
    nodesCount++;
    
    // Process each file
    for (const file of files) {
      const fullPath = path.join(repoPath, file);
   
  - Type: freemium
- Process imports/dependencies
        for (const importItem of analysis.imports) {
          let targetI
  - Context: s, classes, functions
        const analysis = analyzeCode(code, fileLanguage);
        
        // Process imports/dependencies
        for (const importItem of analysis.imports) {
          let targetI
  - Type: freemium
- Process classes
        for (const className of analysis.classes) {
          const classId = `class:${
  - Context:          attributes: {}
          });
          relationshipsCount++;
        }
        
        // Process classes
        for (const className of analysis.classes) {
          const classId = `class:${
  - Type: freemium
- Process functions
        for (const funcName of analysis.functions) {
          const funcId = `func:$
  - Context:          attributes: {}
          });
          relationshipsCount++;
        }
        
        // Process functions
        for (const funcName of analysis.functions) {
          const funcId = `func:$
  - Type: freemium
- catch (error) { console.warn(`Error processing file ${file}: ${(error as Error).message}`);
  - Context:   });
          relationshipsCount++;
        }
      } catch (error) {
        console.warn(`Error processing file ${file}: ${(error as Error).message}`);
      }
    }
    
    await db.exec('COMMIT');
  - Type: freemium
- * Query the knowledge graph
  - Context: 
/**
 * Query the knowledge graph
 */
export async function queryKnowledgeGraph(query: GraphQuery): Promise<GraphQueryResult> {
  // Simple implementation for demonstration
  // A real implementation wou
  - Type: freemium
- Simple implementation for demonstration
  // A real implementation would use a graph query language
  
  const { repositoryUrl, co
  - Context:  queryKnowledgeGraph(query: GraphQuery): Promise<GraphQueryResult> {
  // Simple implementation for demonstration
  // A real implementation would use a graph query language
  
  const { repositoryUrl, co
  - Type: freemium
- Start with a basic implementation that returns nodes related to a repository
  let nodes: GraphNode[] = [];
  let rela
  - Context: a graph query language
  
  const { repositoryUrl, contextDepth = 1 } = query;
  
  // Start with a basic implementation that returns nodes related to a repository
  let nodes: GraphNode[] = [];
  let rela
  - Type: freemium
- } ): Promise<void> { if (!db) { db = await
  - Context: s?: GraphRelationship[];
    removeNodeIds?: string[];
    removeRelationshipIds?: string[];
  }
): Promise<void> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw 
  - Type: freemium
- GraphQueryResult, format: string): Promise<string> { const { nodes, relationships }
  - Context: c format
 */
export async function exportKnowledgeGraph(results: GraphQueryResult, format: string): Promise<string> {
  const { nodes, relationships } = results;
  
  switch (format) {
    case "json":
 
  - Type: freemium
- * Add a node to the knowledge graph
  - Context: at}`);
  }
}

/**
 * Add a node to the knowledge graph
 */
async function addNode(node: GraphNode): Promise<void> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw 
  - Type: freemium
- function addRelationship(relationship: GraphRelationship): Promise<void> { if (!db) { db =
  - Context: ionship to the knowledge graph
 */
async function addRelationship(relationship: GraphRelationship): Promise<void> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw 
  - Type: freemium
- * Find a node by name
  - Context: tributes)
    ]
  );
}

/**
 * Find a node by name
 */
async function findNodeByName(name: string): Promise<GraphNode | null> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) 
  - Type: freemium
- string, attributeValue: any): Promise<GraphNode[]> { if (!db) { db =
  - Context: ttribute value
 */
async function findNodesByAttribute(attributeName: string, attributeValue: any): Promise<GraphNode[]> {
  if (!db) {
    db = await createDatabase("knowledge");
  }

  if (!db) {
    t
  - Type: freemium
- * Find nodes by their IDs
  - Context: ibutes)
    }));
}

/**
 * Find nodes by their IDs
 */
async function findNodesById(ids: string[]): Promise<GraphNode[]> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
   
  - Type: freemium
- */ async function findRelationshipsBySourceId(sourceId: string): Promise<GraphRelationship[]> { if (!db) {
  - Context: * Find relationships by source ID
 */
async function findRelationshipsBySourceId(sourceId: string): Promise<GraphRelationship[]> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!d
  - Type: freemium
- async function findRelationshipsBySourceIds(sourceIds: string[]): Promise<GraphRelationship[]> { if (!db) { db
  - Context: nships by multiple source IDs
 */
async function findRelationshipsBySourceIds(sourceIds: string[]): Promise<GraphRelationship[]> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!d
  - Type: freemium
- * Remove a node from the knowledge graph
  - Context: ));
}

/**
 * Remove a node from the knowledge graph
 */
async function removeNode(nodeId: string): Promise<void> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw 
  - Type: freemium
- async function removeRelationship(relationshipId: string): Promise<void> { if (!db) { throw
  - Context: elationship from the knowledge graph
 */
async function removeRelationship(relationshipId: string): Promise<void> {
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  await db.run(`DE
  - Type: freemium
- async function removeRelationshipsByNodeId(nodeId: string): Promise<void> { if (!db) { throw
  - Context: l relationships connected to a node
 */
async function removeRelationshipsByNodeId(nodeId: string): Promise<void> {
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  await db.run(`DE
  - Type: freemium
- Process imports/dependencies
        for (const importItem of analysis.imports) {
          let targetId: string;
          
          // Check if the import
  - Context: Code(code, fileLanguage);
        
        // Process imports/dependencies
        for (const importItem of analysis.imports) {
          let targetId: string;
          
          // Check if the import 
  - Type: marketplace
- as a node const existingNode = await findNodeByName(importItem); if (existingNode)
  - Context: ck if the import already exists as a node
          const existingNode = await findNodeByName(importItem);
          if (existingNode) {
            targetId = existingNode.id;
          } else {
        
  - Type: marketplace
- targetId, type: "dependency", name: importItem, attributes: { isExternal: !files.some(f =>
  - Context:   addNode({
              id: targetId,
              type: "dependency",
              name: importItem,
              attributes: {
                isExternal: !files.some(f => f.endsWith(importItem) ||
  - Type: marketplace
- attributes: { isExternal: !files.some(f => f.endsWith(importItem) || f.includes(importItem)) } });
  - Context: portItem,
              attributes: {
                isExternal: !files.some(f => f.endsWith(importItem) || f.includes(importItem))
              }
            });
            nodesCount++;
          }
 
  - Type: marketplace
- isExternal: !files.some(f => f.endsWith(importItem) || f.includes(importItem)) } }); nodesCount++; }
  - Context: tributes: {
                isExternal: !files.some(f => f.endsWith(importItem) || f.includes(importItem))
              }
            });
            nodesCount++;
          }
          
          // Lin
  - Type: marketplace
- Add repository node
    const repoId = `repo:${uuidv4()}`;
    addNode({
  - Context: stFiles(repoPath);
  
  let nodesCount = 0;
  let relationshipsCount = 0;
  
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Add repository node
    const repoId = `repo:${uuidv4()}`;
    addNode({
     
  - Type: marketplace
- Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
  - Context: odes, addRelationships, removeNodeIds, removeRelationshipIds } = updates;
  
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
       
  - Type: marketplace
- Add repository node
    const repoId = `repo:${uuidv4()}`;
    addNode({
      id: repoId,
      type:
  - Context: Count = 0;
  let relationshipsCount = 0;
  
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Add repository node
    const repoId = `repo:${uuidv4()}`;
    addNode({
      id: repoId,
      type:
  - Type: ads
- Add repository node
    const repoId = `repo:${uuidv4()}`;
    addNode({
      id: repoId,
      type: "repository",
      name: path.basename(repositoryUrl),
  - Context: GIN TRANSACTION');
  
  try {
    // Add repository node
    const repoId = `repo:${uuidv4()}`;
    addNode({
      id: repoId,
      type: "repository",
      name: path.basename(repositoryUrl),
      
  - Type: ads
- fullPath = path.join(repoPath, file); try { const code = fs.readFileSync(fullPath,
  - Context: of files) {
      const fullPath = path.join(repoPath, file);
      try {
        const code = fs.readFileSync(fullPath, 'utf8');
        const fileLanguage = path.extname(file).slice(1);
        
     
  - Type: ads
- Create file node
        const fileId = `file:${uuidv4()}`;
        addNode({
          id: fileId,
          type: "file",
          name: file,
          attributes: {
  - Context: ).slice(1);
        
        // Create file node
        const fileId = `file:${uuidv4()}`;
        addNode({
          id: fileId,
          type: "file",
          name: file,
          attributes: {

  - Type: ads
- Link file to repository
        addRelationship({
          id: `rel:${uuidv4()}`,
          type: "contains",
          sourceId: rep
  - Context: e
          }
        });
        nodesCount++;
        
        // Link file to repository
        addRelationship({
          id: `rel:${uuidv4()}`,
          type: "contains",
          sourceId: rep
  - Type: ads
- Check if the import already exists as a node
          const existingNode = await findNodeByName(importItem);
          if (ex
  - Context: analysis.imports) {
          let targetId: string;
          
          // Check if the import already exists as a node
          const existingNode = await findNodeByName(importItem);
          if (ex
  - Type: ads
- Create a new node for the import
            targetId = `dep:${uuidv4()}`;
            addNode({
              id: targetId,
              type: "dependency",
              name: importItem
  - Context:           // Create a new node for the import
            targetId = `dep:${uuidv4()}`;
            addNode({
              id: targetId,
              type: "dependency",
              name: importItem
  - Type: ads
- Link file to dependency
          addRelationship({
            id: `rel:${uuidv4()}`,
            type: "imports",
            sourceId
  - Context: });
            nodesCount++;
          }
          
          // Link file to dependency
          addRelationship({
            id: `rel:${uuidv4()}`,
            type: "imports",
            sourceId
  - Type: ads
- of analysis.classes) { const classId = `class:${uuidv4()}`; addNode({ id: classId,
  - Context: or (const className of analysis.classes) {
          const classId = `class:${uuidv4()}`;
          addNode({
            id: classId,
            type: "class",
            name: className,
           
  - Type: ads
- Link class to file
          addRelationship({
            id: `rel:${uuidv4()}`,
            type: "defines",
            sourceId
  - Context:        }
          });
          nodesCount++;
          
          // Link class to file
          addRelationship({
            id: `rel:${uuidv4()}`,
            type: "defines",
            sourceId
  - Type: ads
- of analysis.functions) { const funcId = `func:${uuidv4()}`; addNode({ id: funcId,
  - Context: for (const funcName of analysis.functions) {
          const funcId = `func:${uuidv4()}`;
          addNode({
            id: funcId,
            type: "function",
            name: funcName,
          
  - Type: ads
- Link function to file
          addRelationship({
            id: `rel:${uuidv4()}`,
            type: "defines",
            sourceId
  - Context:     }
          });
          nodesCount++;
          
          // Link function to file
          addRelationship({
            id: `rel:${uuidv4()}`,
            type: "defines",
            sourceId
  - Type: ads
- If depth > 1, get additional levels of relationships
    if (contextDepth > 1) {
      for (let i = 1; i < contextDepth;
  - Context: desById(directNodeIds);
    nodes.push(...repoNodes, ...directNodes);
    
    // If depth > 1, get additional levels of relationships
    if (contextDepth > 1) {
      for (let i = 1; i < contextDepth;
  - Type: ads
- async function updateKnowledgeGraph( repositoryUrl: string, updates: { addNodes?: GraphNode[]; addRelationships?:
  - Context: formation
 */
export async function updateKnowledgeGraph(
  repositoryUrl: string,
  updates: {
    addNodes?: GraphNode[];
    addRelationships?: GraphRelationship[];
    removeNodeIds?: string[];
    
  - Type: ads
- repositoryUrl: string, updates: { addNodes?: GraphNode[]; addRelationships?: GraphRelationship[]; removeNodeIds?: string[];
  - Context: unction updateKnowledgeGraph(
  repositoryUrl: string,
  updates: {
    addNodes?: GraphNode[];
    addRelationships?: GraphRelationship[];
    removeNodeIds?: string[];
    removeRelationshipIds?: stri
  - Type: ads
- new Error("Database not initialized"); } const { addNodes, addRelationships, removeNodeIds,
  - Context: "knowledge");
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  const { addNodes, addRelationships, removeNodeIds, removeRelationshipIds } = updates;
  
  await db.exec('BEGI
  - Type: ads
- Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
        await addNode(node);
  - Context: eIds, removeRelationshipIds } = updates;
  
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
        await addNode(node);
  
  - Type: ads
- Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
        await addNode(node);
      }
    }
    
    /
  - Context: ipIds } = updates;
  
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
        await addNode(node);
      }
    }
    
    /
  - Type: ads
- Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
        await addNode(node);
      }
    }
    
    // Add new relationships
    if (addRe
  - Context: ('BEGIN TRANSACTION');
  
  try {
    // Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
        await addNode(node);
      }
    }
    
    // Add new relationships
    if (addRe
  - Type: ads
- Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
        await addNode(node);
      }
    }
    
    // Add new relationships
    if (addRelationships) {
      for (
  - Context:   try {
    // Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
        await addNode(node);
      }
    }
    
    // Add new relationships
    if (addRelationships) {
      for (
  - Type: ads
- Add new relationships
    if (addRelationships) {
      for (const relationship of addRelationships) {
  - Context: odes) {
      for (const node of addNodes) {
        await addNode(node);
      }
    }
    
    // Add new relationships
    if (addRelationships) {
      for (const relationship of addRelationships) {
  - Type: ads
- Add new relationships
    if (addRelationships) {
      for (const relationship of addRelationships) {
        await addRelationship
  - Context: of addNodes) {
        await addNode(node);
      }
    }
    
    // Add new relationships
    if (addRelationships) {
      for (const relationship of addRelationships) {
        await addRelationship
  - Type: ads
- Add new relationships
    if (addRelationships) {
      for (const relationship of addRelationships) {
        await addRelationship(relationship);
      }
    }
    
    // Remove node
  - Context:    }
    
    // Add new relationships
    if (addRelationships) {
      for (const relationship of addRelationships) {
        await addRelationship(relationship);
      }
    }
    
    // Remove node
  - Type: ads
- Remove nodes (and their relationships)
    if
  - Context: hips
    if (addRelationships) {
      for (const relationship of addRelationships) {
        await addRelationship(relationship);
      }
    }
    
    // Remove nodes (and their relationships)
    if
  - Type: ads
- * Add a node to the knowledge graph
  - Context: ps);
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Add a node to the knowledge graph
 */
async function addNode(node: GraphNode): Promise<void> {
  if (!
  - Type: ads
- * Add a relationship to the knowledge graph
  - Context:  (?, ?, ?, ?)`,
    [node.id, node.type, node.name, JSON.stringify(node.attributes)]
  );
}

/**
 * Add a relationship to the knowledge graph
 */
async function addRelationship(relationship: GraphRelati
  - Type: ads
- Add nodes
  for (const node of nodes) {
    const safeId = sanitizeId(node.id);
    mermaid += `  ${sa
  - Context: : GraphNode[], relationships: GraphRelationship[]): string {
  let mermaid = "graph TD;\n";
  
  // Add nodes
  for (const node of nodes) {
    const safeId = sanitizeId(node.id);
    mermaid += `  ${sa
  - Type: ads
- Add relationships
  for (const rel of relationships) {
    const sourceId = sanitizeId(rel.sourceId);
  - Context:  = sanitizeId(node.id);
    mermaid += `  ${safeId}["${node.name} (${node.type})"];\n`;
  }
  
  // Add relationships
  for (const rel of relationships) {
    const sourceId = sanitizeId(rel.sourceId);

  - Type: ads
- Add nodes
  for (const node of nodes) {
    const safeId = sanitizeId(node.id);
    dot += `  "${safeI
  - Context: ip[]): string {
  let dot = "digraph KnowledgeGraph {\n";
  dot += "  node [shape=box];\n";
  
  // Add nodes
  for (const node of nodes) {
    const safeId = sanitizeId(node.id);
    dot += `  "${safeI
  - Type: ads
- Get direct relationships
    const directRelationships = await findRelationshipsBySourceId(repoId);
    relationships.push(...directRelationsh
  - Context: ;
    }
    
    const repoId = repoNodes[0].id;
    
    // Get direct relationships
    const directRelationships = await findRelationshipsBySourceId(repoId);
    relationships.push(...directRelationsh
  - Type: ads
- Get target nodes of direct relationships
    const directNodeIds = direct
  - Context: onst directRelationships = await findRelationshipsBySourceId(repoId);
    relationships.push(...directRelationships);
    
    // Get target nodes of direct relationships
    const directNodeIds = direct
  - Type: ads
- Get target nodes of direct relationships
    const directNodeIds = directRelationships.map(rel => rel.targetId);
    const directNodes = await findNodesById(directNodeIds);
  - Context: tRelationships);
    
    // Get target nodes of direct relationships
    const directNodeIds = directRelationships.map(rel => rel.targetId);
    const directNodes = await findNodesById(directNodeIds);
 
  - Type: ads
- } from "@modelcontextprotocol/sdk/server/mcp.js"; import { z } from "zod"; import
  - Context: import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { 
  buildKnowledgeGraph, 
  queryKnowledg
  - Type: freemium
- "text", text: visualization, _metadata: { format: "mermaid" } }] };
  - Context:        content: [{
              type: "text",
              text: visualization,
              _metadata: { format: "mermaid" }
            }]
          };
        }
        
        if (outputFormat =
  - Type: ads
- text: exported, _metadata: format === "mermaid" ? { format: "mermaid"
  - Context: eturn {
          content: [{
            type: "text",
            text: exported,
            _metadata: format === "mermaid" ? { format: "mermaid" } : undefined
          }]
        };
      } catch 
  - Type: ads
- * Format graph query results as readable text
  - Context: }],
          isError: true
        };
      }
    }
  );
}

/**
 * Format graph query results as readable text
 */
function formatGraphResultsAsText(results: any): string {
  const { nodes, relationshi
  - Type: ads
- Add node information
  text += "Nodes:\n";
  nodes.forEach((node: any, index: number) => {
    text +=
  - Context: xt = `Query returned ${nodes.length} nodes and ${relationships.length} relationships.\n\n`;
  
  // Add node information
  text += "Nodes:\n";
  nodes.forEach((node: any, index: number) => {
    text +=
  - Type: ads
- Add relationship information
  text += "\nRelationships:\n";
  relationships.forEach((rel: any, index:
  - Context: gth > 0) {
      text += `   Attributes: ${JSON.stringify(node.attributes)}\n`;
    }
  });
  
  // Add relationship information
  text += "\nRelationships:\n";
  relationships.forEach((rel: any, index:
  - Type: ads
- path from 'path'; import { exec } from 'child_process'; import
  - Context: import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'ut
  - Type: freemium
- import { exec } from 'child_process'; import { promisify }
  - Context: import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface DependencyNo
  - Type: freemium
- { exec } from 'child_process'; import { promisify } from
  - Context: port fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface DependencyNode {
  name: string
  - Type: freemium
- promisify } from 'util'; const execAsync = promisify(exec); interface DependencyNode
  - Context:  'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface DependencyNode {
  name: string;
  version?: string;
  type: 'direct' | 'de
  - Type: freemium
- */ export async function analyzeDependencies(repositoryPath: string): Promise<{ graph: DependencyGraph; summary:
  - Context: dependencies in a repository
 */
export async function analyzeDependencies(repositoryPath: string): Promise<{
  graph: DependencyGraph;
  summary: {
    totalDependencies: number;
    directDependencies:
  - Type: freemium
- Detect project type
  const projectType = await detectProjectType(repositoryPath);
  
  let dependencyGraph: D
  - Context: > {
  if (!repositoryPath) {
    throw new Error("Repository path is required");
  }
  
  // Detect project type
  const projectType = await detectProjectType(repositoryPath);
  
  let dependencyGraph: D
  - Type: freemium
- Detect project type
  const projectType = await detectProjectType(repositoryPath);
  
  let dependencyGraph: DependencyGraph;
  - Context: Path) {
    throw new Error("Repository path is required");
  }
  
  // Detect project type
  const projectType = await detectProjectType(repositoryPath);
  
  let dependencyGraph: DependencyGraph;
  
  
  - Type: freemium
- Detect project type
  const projectType = await detectProjectType(repositoryPath);
  
  let dependencyGraph: DependencyGraph;
  
  // Analyze based on projec
  - Context: r("Repository path is required");
  }
  
  // Detect project type
  const projectType = await detectProjectType(repositoryPath);
  
  let dependencyGraph: DependencyGraph;
  
  // Analyze based on projec
  - Type: freemium
- Analyze based on project type
  switch (projectType) {
    case 'node':
      dependencyGraph = await analyzeNodeDepende
  - Context: ectProjectType(repositoryPath);
  
  let dependencyGraph: DependencyGraph;
  
  // Analyze based on project type
  switch (projectType) {
    case 'node':
      dependencyGraph = await analyzeNodeDepende
  - Type: freemium
- Analyze based on project type
  switch (projectType) {
    case 'node':
      dependencyGraph = await analyzeNodeDependencies(repositoryPath);
  - Context: ryPath);
  
  let dependencyGraph: DependencyGraph;
  
  // Analyze based on project type
  switch (projectType) {
    case 'node':
      dependencyGraph = await analyzeNodeDependencies(repositoryPath);

  - Type: freemium
- * Detect the type of project in the repository
  - Context: length
  };
  
  return {
    graph: dependencyGraph,
    summary
  };
}

/**
 * Detect the type of project in the repository
 */
async function detectProjectType(repositoryPath: string): Promise<string>
  - Type: freemium
- Check for package.json (Node.js)
    if (await fileExists(path.join(re
  - Context: the type of project in the repository
 */
async function detectProjectType(repositoryPath: string): Promise<string> {
  try {
    // Check for package.json (Node.js)
    if (await fileExists(path.join(re
  - Type: freemium
- * Analyze Node.js dependencies
  - Context:  // Default to generic
    return 'generic';
  } catch (error) {
    console.error('Error detecting project type:', error);
    return 'generic';
  }
}

/**
 * Analyze Node.js dependencies
 */
async func
  - Type: freemium
- async function analyzeNodeDependencies(repositoryPath: string): Promise<DependencyGraph> { const nodes: DependencyNode[] =
  - Context:  * Analyze Node.js dependencies
 */
async function analyzeNodeDependencies(repositoryPath: string): Promise<DependencyGraph> {
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];

  - Type: freemium
- async function analyzePythonDependencies(repositoryPath: string): Promise<DependencyGraph> { const nodes: DependencyNode[] =
  - Context: * Analyze Python dependencies
 */
async function analyzePythonDependencies(repositoryPath: string): Promise<DependencyGraph> {
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];

  - Type: freemium
- Simplified implementation for Java
  const nodes: DependencyNode[] = []
  - Context: **
 * Analyze Java dependencies
 */
async function analyzeJavaDependencies(repositoryPath: string): Promise<DependencyGraph> {
  // Simplified implementation for Java
  const nodes: DependencyNode[] = []
  - Type: freemium
- async function analyzeGenericDependencies(repositoryPath: string): Promise<DependencyGraph> { const nodes: DependencyNode[] =
  - Context: cy analysis for any codebase
 */
async function analyzeGenericDependencies(repositoryPath: string): Promise<DependencyGraph> {
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];

  - Type: freemium
- function findFiles(dir: string, extensions: string[]): Promise<string[]> { const files: string[]
  - Context: specific extensions in a directory
 */
async function findFiles(dir: string, extensions: string[]): Promise<string[]> {
  const files: string[] = [];
  
  async function scanDir(currentDir: string, relat
  - Type: freemium
- * Check if a file exists
  - Context: ;
  return files;
}

/**
 * Check if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false
  - Type: freemium
- case 'java': dependencyGraph = await analyzeJavaDependencies(repositoryPath); break; default: dependencyGraph =
  - Context: Dependencies(repositoryPath);
      break;
    case 'java':
      dependencyGraph = await analyzeJavaDependencies(repositoryPath);
      break;
    default:
      dependencyGraph = await analyzeGenericD
  - Type: ads
- Check for pom.xml or build.gradle (Java)
    if (
      await fileExists(path.join(repositoryPath, 'pom.xml')) ||
      await fileE
  - Context: oryPath, 'setup.py'))
    ) {
      return 'python';
    }
    
    // Check for pom.xml or build.gradle (Java)
    if (
      await fileExists(path.join(repositoryPath, 'pom.xml')) ||
      await fileE
  - Type: ads
- Default to generic
    return 'generic';
  } ca
  - Context: (path.join(repositoryPath, 'pom.xml')) ||
      await fileExists(path.join(repositoryPath, 'build.gradle'))
    ) {
      return 'java';
    }
    
    // Default to generic
    return 'generic';
  } ca
  - Type: ads
- Read package.json to extract dependencies
    const packageJsonPath = path.join(repositoryPath, 'package
  - Context: > {
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];
  
  try {
    // Read package.json to extract dependencies
    const packageJsonPath = path.join(repositoryPath, 'package
  - Type: ads
- 'package.json'); const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8'); const packageJson =
  - Context: kageJsonPath = path.join(repositoryPath, 'package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // A
  - Type: ads
- Add direct dependencies
    if (packageJson.dependencies) {
      for (const [name, version] of Object
  - Context: dFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Add direct dependencies
    if (packageJson.dependencies) {
      for (const [name, version] of Object
  - Type: ads
- Add dev dependencies
    if (packageJson.devDependencies) {
      for (const [name, version] of Object
  - Context:          version: version as string,
          type: 'direct'
        });
      }
    }
    
    // Add dev dependencies
    if (packageJson.devDependencies) {
      for (const [name, version] of Object
  - Type: ads
- Extract imports
      const imports = extractImports(content
  - Context: f files) {
      const fullPath = path.join(repositoryPath, file);
      const content = await fs.readFile(fullPath, 'utf8');
      
      // Extract imports
      const imports = extractImports(content
  - Type: ads
- Add node if it doesn't exist
          if (!nodes.some(n => n.path === relativePath)) {
            no
  - Context: ;
          const relativePath = path.relative(repositoryPath, targetPath);
          
          // Add node if it doesn't exist
          if (!nodes.some(n => n.path === relativePath)) {
            no
  - Type: ads
- Add edge
          edges.push({
            source: file,
            target: relativePath,
  - Context: e: 'internal',
              path: relativePath
            });
          }
          
          // Add edge
          edges.push({
            source: file,
            target: relativePath,
          
  - Type: ads
- Add edge to the dependency
          edges.push({
            source: file,
            target: packag
  - Context: rnal package import
          const packageName = importPath.split('/')[0];
          
          // Add edge to the dependency
          edges.push({
            source: file,
            target: packag
  - Type: ads
- Read requirements.txt if it exists
    const requirementsPath = path.join(repositoryPath, 'requirements.
  - Context: > {
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];
  
  try {
    // Read requirements.txt if it exists
    const requirementsPath = path.join(repositoryPath, 'requirements.
  - Type: ads
- { const content = await fs.readFile(requirementsPath, 'utf8'); const lines =
  - Context: 'requirements.txt');
    if (await fileExists(requirementsPath)) {
      const content = await fs.readFile(requirementsPath, 'utf8');
      const lines = content.split('\n');
      
      for (const lin
  - Type: ads
- Extract Python imports
      const lines = content.split('\n
  - Context: f files) {
      const fullPath = path.join(repositoryPath, file);
      const content = await fs.readFile(fullPath, 'utf8');
      
      // Extract Python imports
      const lines = content.split('\n
  - Type: ads
- Add edge
          edges.push({
            source: file,
            target: moduleName,
  - Context:  (importMatch) {
          const moduleName = importMatch[1].split('.')[0];
          
          // Add edge
          edges.push({
            source: file,
            target: moduleName,
            
  - Type: ads
- * Analyze Java dependencies
  - Context: turn { nodes: [], edges: [] };
  }
}

/**
 * Analyze Java dependencies
 */
async function analyzeJavaDependencies(repositoryPath: string): Promise<DependencyGraph> {
  // Simplified implementation for J
  - Type: ads
- In a real implementation, you would parse pom.xml or build.gradle
  // and analyze import statements in Java files
  
  return { nodes, edges };
}

/**
 * Generic
  - Context:  edges: DependencyEdge[] = [];
  
  // In a real implementation, you would parse pom.xml or build.gradle
  // and analyze import statements in Java files
  
  return { nodes, edges };
}

/**
 * Generic 
  - Type: ads
- Add each file as a node
    for (const file of files) {
      nodes.push({
        name: file,
  - Context: go', '.rb', '.php'];
    const files = await findFiles(repositoryPath, fileExtensions);
    
    // Add each file as a node
    for (const file of files) {
      nodes.push({
        name: file,
       
  - Type: ads
- Check for references to other files
      for (const otherFi
  - Context: f files) {
      const fullPath = path.join(repositoryPath, file);
      const content = await fs.readFile(fullPath, 'utf8');
      
      // Check for references to other files
      for (const otherFi
  - Type: ads
- { const entries = await fs.readdir(currentDir, { withFileTypes: true });
  - Context: nc function scanDir(currentDir: string, relativePath: string = '') {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryR
  - Type: ads
- repositoryUrl, repositoryPath, or fileContent must be provided" ); } console.log(
  - Context:  {
        throw new Error(
          "Either repositoryUrl, repositoryPath, or fileContent must be provided"
        );
      }

      console.log(
        `Analyzing dependencies in: ${repoPath || "pro
  - Type: freemium
- Perform the analysis
      const analysis = await analyzeDepende
  - Context: provided"
        );
      }

      console.log(
        `Analyzing dependencies in: ${repoPath || "provided content"}`
      );

      // Perform the analysis
      const analysis = await analyzeDepende
  - Type: freemium
- Replace characters that are problematic in Mermaid IDs
  return name.replace(/[^a-zA-Z0-9]/g, "_");
}
  - Context: valid in Mermaid
 */
function formatNodeId(name: string): string {
  // Replace characters that are problematic in Mermaid IDs
  return name.replace(/[^a-zA-Z0-9]/g, "_");
}

  - Type: freemium
- * Format a node name to be valid in Mermaid
  - Context: 
  } else {
    console.log(
      "Skipping registration of analyze-dependencies tool since it already exists"
    );
  }
}

/**
 * Format a node name to be valid in Mermaid
 */
function formatNodeId(n
  - Type: ads
- path from 'path'; import { glob } from 'glob'; import
  - Context: import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { analyzeCodeMetrics } from '..
  - Type: freemium
- description: 'Avoid console statements in production code', languages: ['js', 'jsx',
  - Context:  id: 'no-console',
    name: 'No Console Statements',
    description: 'Avoid console statements in production code',
    languages: ['js', 'jsx', 'ts', 'tsx'],
    severity: 'warning',
    analyze: (con
  - Type: freemium
- 1, message: 'Console statement should be removed in production code',
  - Context: le: filePath,
            line: i + 1,
            message: 'Console statement should be removed in production code',
            rule: 'no-console',
            context: line.trim()
          });
      
  - Type: freemium
- 'warning' | 'info'; } = {} ): Promise<QualityAnalysisResult> { const
  - Context: ths?: string[];
    maxIssues?: number;
    minSeverity?: 'error' | 'warning' | 'info';
  } = {}
): Promise<QualityAnalysisResult> {
  const {
    includePaths = ['**/*.*'],
    excludePaths = ['**/node_
  - Type: freemium
- description: 'Avoid console statements in production code', languages: ['js', 'jsx',
  - Context:  id: 'no-console',
    name: 'No Console Statements',
    description: 'Avoid console statements in production code',
    languages: ['js', 'jsx', 'ts', 'tsx'],
    severity: 'warning',
    analyze: (content
  - Type: marketplace
- 1, message: 'Console statement should be removed in production code',
  - Context: le: filePath,
            line: i + 1,
            message: 'Console statement should be removed in production code',
            rule: 'no-console',
            context: line.trim()
          });
        }

  - Type: marketplace
- warnings: number; info: number }>; }; metadata: { analyzedFiles: number;
  - Context: umber }>;
    byRule: Record<string, { errors: number; warnings: number; info: number }>;
  };
  metadata: {
    analyzedFiles: number;
    languageBreakdown: Record<string, number>;
  };
}

// Rule reg
  - Type: ads
- description: 'TODO comments should be addressed', languages: ['*'], severity: 'info',
  - Context:     id: 'no-todo-comments',
    name: 'No TODO Comments',
    description: 'TODO comments should be addressed',
    languages: ['*'],
    severity: 'info',
    analyze: (content, filePath) => {
      co
  - Type: ads
- Add this mapping function somewhere at the top of the file
function getSeverityKey(severity: string):
  - Context: context: line.trim()
          });
        }
      });
      
      return issues;
    }
  }
];

// Add this mapping function somewhere at the top of the file
function getSeverityKey(severity: string): 
  - Type: ads
- Track language breakdown
  fo
  - Context:  errors: 0, warnings: 0, info: 0 },
    issues: [],
    summary: { byFile: {}, byRule: {} },
    metadata: { analyzedFiles: files.length, languageBreakdown: {} }
  };

  // Track language breakdown
  fo
  - Type: ads
- { const ext = path.extname(file).toLowerCase(); result.metadata.languageBreakdown[ext] = (result.metadata.languageBreakdown[ext] || 0)
  - Context: kdown
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    result.metadata.languageBreakdown[ext] = (result.metadata.languageBreakdown[ext] || 0) + 1;
  }

  try {
    // 
  - Type: ads
- Get code metrics for complexity-based issu
  - Context: nst ext = path.extname(file).toLowerCase();
    result.metadata.languageBreakdown[ext] = (result.metadata.languageBreakdown[ext] || 0) + 1;
  }

  try {
    // Get code metrics for complexity-based issu
  - Type: ads
- Apply rules to this file
        let fileIssues = applyR
  - Context: th, file);
        const ext = path.extname(file).toLowerCase();
        const content = await fs.readFile(fullPath, 'utf8');
        
        // Apply rules to this file
        let fileIssues = applyR
  - Type: ads
- Add complexity-based issues by integrating with metrics data
        const fileMetrics = metricsResult
  - Context: ply rules to this file
        let fileIssues = applyRules(content, file, ext);
        
        // Add complexity-based issues by integrating with metrics data
        const fileMetrics = metricsResult
  - Type: ads
- Add issues to result
        result.issues.push(...fileIssues);
        issueCount += fileIssues.lengt
  - Context:         result.summary.byRule[issue.rule][severityKey]++;
          }
        }
        
        // Add issues to result
        result.issues.push(...fileIssues);
        issueCount += fileIssues.lengt
  - Type: ads
- * Add a custom rule to the registry
  - Context: xIssues) {
    result.issues = result.issues.slice(0, maxIssues);
  }
  
  return result;
}

/**
 * Add a custom rule to the registry
 */
export function addQualityRule(rule: QualityRule): void {
  // C
  - Type: ads
- Check if rule with this ID already exists
  const existingRuleIndex = ruleRegistry.findIndex(r => r.id === rule.id);
  if (existingRu
  - Context: y
 */
export function addQualityRule(rule: QualityRule): void {
  // Check if rule with this ID already exists
  const existingRuleIndex = ruleRegistry.findIndex(r => r.id === rule.id);
  if (existingRu
  - Type: ads
- * Get all registered rules
  - Context:  >= 0) {
    // Replace existing rule
    ruleRegistry[existingRuleIndex] = rule;
  } else {
    // Add new rule
    ruleRegistry.push(rule);
  }
}

/**
 * Get all registered rules
 */
export function g
  - Type: ads

### Summary Tier Features

#### By Type
- No description available

#### By Priority
- No description available

#### By Feature
- No description available

## Development Goals

Please help me continue development, taking into account:

1. The previous session's context
2. Established architecture patterns
3. Current monetization strategy
4. Project phase requirements
5. Documentation needs

Focus areas:

1. Maintaining code quality and test coverage
2. Following established patterns
3. Updating relevant documentation
4. Considering monetization implications

Please provide guidance on the next steps while maintaining consistency with our established patterns and strategies.
