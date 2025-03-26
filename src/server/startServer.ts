/**
 * Server Initialization
 *
 * This module provides a factory function to start an MCP server with
 * automatic detection of storage backends. It attempts to use Redis for
 * session and cache storage if available, but gracefully falls back to
 * in-memory implementations when Redis is not available.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

import { registerAnalysisTools } from "../features/basic-analysis/index.js";
import { registerCodeMetricsTools } from "../features/code-metrics/index.js";
import { registerDependencyAnalysisTools } from "../features/dependency-analysis/index.js";
import { registerIdeTools } from "../features/basic-analysis/ide-analyzer.js";
import { registerCodeQualityTools } from "../features/code-quality/index.js";
import { registerKnowledgeGraphFeatures } from "../features/knowledge-graph/index.js";
import { registerVisualizationFeatures } from "../features/visualization/index.js";
import { registerMemoryFeatures } from "../features/memory/index.js";
import { registerSocioTechnicalFeatures } from "../features/socio-technical/index.js";
import { registerMultiRepoFeatures } from "../features/multi-repo/index.js";
import { registerEvolutionFeatures } from "../features/evolution/index.js";
import { registerSessionTools } from "../features/session-manager/index.js";
import { registerDevTools } from "../features/dev-tools/index.js";
import { registerRedisBackedServices } from "./registerRedisBackedServices.js";
import { registerToolDiscoveryFeatures } from "../utils/tool-discovery.js";

/**
 * Server configuration options
 */
export interface ServerOptions {
  /**
   * Server name
   */
  name?: string;

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
   */
  port?: number;

  /**
   * Redis connection URL (e.g., "redis://localhost:6379")
   */
  redisUrl?: string;

  /**
   * Force use of in-memory session store instead of Redis
   */
  forceMemorySessionStore?: boolean;

  /**
   * Enable memory caching layer (default: true)
   */
  useMemoryCache?: boolean;

  /**
   * Show verbose logs
   */
  verbose?: boolean;
}

/**
 * Start an MCP server with automatic backend detection
 *
 * This creates a new MCP server with all tools registered, and tries to
 * connect to Redis for session and cache storage. If Redis is not available,
 * it will fall back to in-memory implementations.
 *
 * @param options Server configuration options
 * @returns A promise that resolves when the server is ready
 */
export async function startServer(options: ServerOptions = {}): Promise<{
  server: McpServer;
}> {
  const {
    name = "codeanalysis-mcp",
    version = "1.0.0",
    useStdio = process.env.STDIO_TRANSPORT === "true",
    port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    redisUrl = process.env.REDIS_URL || "redis://localhost:6379",
    forceMemorySessionStore = process.env.FORCE_MEMORY_SESSION === "true",
    useMemoryCache = true,
    verbose = false,
  } = options;

  // Create the server instance
  const server = new McpServer({ name, version });

  if (verbose) {
    console.log(`Creating MCP server: ${name}@${version}`);
  }

  // Register all tool features
  const registerFunctions = [
    { name: "Analysis", fn: registerAnalysisTools },
    { name: "Code Metrics", fn: registerCodeMetricsTools },
    { name: "Dependency Analysis", fn: registerDependencyAnalysisTools },
    { name: "IDE Tools", fn: registerIdeTools },
    { name: "Code Quality", fn: registerCodeQualityTools },
    { name: "Knowledge Graph", fn: registerKnowledgeGraphFeatures },
    { name: "Visualization", fn: registerVisualizationFeatures },
    { name: "Memory", fn: registerMemoryFeatures },
    { name: "Socio-Technical", fn: registerSocioTechnicalFeatures },
    { name: "Multi-Repo", fn: registerMultiRepoFeatures },
    { name: "Evolution", fn: registerEvolutionFeatures },
    { name: "Session Manager", fn: registerSessionTools },
    { name: "Developer Tools", fn: registerDevTools },
    { name: "Tool Discovery", fn: registerToolDiscoveryFeatures },
  ];

  // Track registered tools to avoid duplicates
  const registeredTools = new Set<string>();

  // Helper function to register tools only once
  function registerToolsOnce(
    name: string,
    registerFn: (server: McpServer) => void
  ) {
    try {
      if (verbose) {
        console.log(`• Registering ${name} features...`);
      }

      // Save original tool method
      const originalToolMethod = server.tool.bind(server);

      // Override the tool method to prevent duplicate registrations
      server.tool = function (this: McpServer, id: string, ...args: any[]) {
        if (registeredTools.has(id)) {
          if (verbose) {
            console.log(
              `  - Tool ${id} is already registered, skipping duplicate registration`
            );
          }
          return this;
        }

        // Add to tracking set
        registeredTools.add(id);

        // Call original method with properly typed arguments
        return (originalToolMethod as any)(id, ...(args as [any, any]));
      };

      // Register the tools
      registerFn(server);

      // Restore original method
      server.tool = originalToolMethod;

      if (verbose) {
        console.log(`✓ ${name} features registered`);
      }
    } catch (error) {
      console.error(`Error registering ${name} tools: ${error}`);
    }
  }

  // Register all features
  for (const { name, fn } of registerFunctions) {
    registerToolsOnce(name, fn);
  }

  // Set up Redis-backed services if available
  try {
    const services = await registerRedisBackedServices(server, {
      redisUrl,
      prefix: "mcp:",
      defaultTtl: 3600,
      useMemoryCache,
      forceMemorySessionStore,
      verbose,
    });

    if (verbose) {
      console.log(`✓ Services initialized successfully`);
      console.log(
        `  - Session store: ${services.sessionStore.constructor.name}`
      );
      console.log(`  - Cache store: ${services.cacheStore.constructor.name}`);
      console.log(
        `  - Tool execution service: ${services.toolService.constructor.name}`
      );
    }
  } catch (error) {
    console.warn(
      `Warning: Could not initialize Redis-backed services: ${error}`
    );
  }

  // Connect server using appropriate transport
  if (useStdio) {
    // For stdio transport
    if (verbose) {
      console.log("Server configured for stdio transport");
    }

    const transport = new StdioServerTransport();

    // Connect using stdio transport
    await server
      .connect(transport)
      .then(() => {
        console.log("✓ Server connected and ready to handle stdio requests");
      })
      .catch((err) => {
        console.error("Failed to start server with stdio transport:", err);
        throw err;
      });
  } else {
    // For HTTP transport with SSE
    if (verbose) {
      console.log(`Server configured for HTTP transport on port ${port}`);
    }

    // Create Express app
    const app = express();
    app.use(express.json());

    // Set up SSE endpoint for client connections
    app.get("/mcp", (req, res) => {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const transport = new SSEServerTransport("/messages", res);

      // Connect the MCP server to this transport
      server.connect(transport).catch((err) => {
        console.error("Failed to connect server to SSE transport:", err);
        res.end();
      });
    });

    // Set up endpoint for client messages
    app.post("/messages", express.json(), async (req, res) => {
      try {
        // Forward message to the server
        const transport = new SSEServerTransport("/messages", res);
        await transport.handlePostMessage(req, res);
      } catch (error) {
        console.error("Error handling client message:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Simple health check endpoint
    app.get("/", (req, res) => {
      res.status(200).json({
        status: "ok",
        server: name,
        version,
        transport: "HTTP+SSE",
      });
    });

    // Start the HTTP server
    await new Promise<void>((resolve) => {
      app.listen(port, () => {
        console.log(`✓ Server listening on port ${port}`);
        console.log("✓ MCP server ready to handle HTTP requests");
        resolve();
      });
    });
  }

  return { server };
}
