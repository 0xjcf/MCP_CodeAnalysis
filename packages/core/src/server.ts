import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

import { registerAnalysisTools } from "./features/basic-analysis/index.js";
import { registerCodeMetricsTools } from "./features/code-metrics/index.js";
import { registerDependencyAnalysisTools } from "./features/dependency-analysis/index.js";
import { registerIdeTools } from "./features/basic-analysis/ide-analyzer.js";
import { registerCodeQualityTools } from "./features/code-quality/index.js";
import { registerKnowledgeGraphFeatures } from "./features/knowledge-graph/index.js";
import { registerVisualizationFeatures } from "./features/visualization/index.js";
import { registerMemoryFeatures } from "./features/memory/index.js";
import { registerSocioTechnicalFeatures } from "./features/socio-technical/index.js";
import { registerMultiRepoFeatures } from "./features/multi-repo/index.js";
import { registerEvolutionFeatures } from "./features/evolution/index.js";
import { registerSessionTools } from "./features/session-manager/index.js";
import { registerDevTools } from "./features/dev-tools/index.js";

// Import the centralized tool registry
import {
  initializeToolRegistry,
  registerToolsWithRegistry,
  getToolRegistry,
} from "./registry/index.js";

// Create a new server instance with a name and version
const server = new McpServer({
  name: "codeanalysis-mcp",
  version: "1.0.0",
});

// Enable verbose logging if requested
const verbose = process.env.VERBOSE === "true";

// Initialize the tool registry with verbosity setting
initializeToolRegistry(verbose);

// Register all feature modules with their source names
registerToolsWithRegistry(
  server,
  registerAnalysisTools,
  "basic-analysis",
  verbose
);
registerToolsWithRegistry(
  server,
  registerCodeMetricsTools,
  "code-metrics",
  verbose
);
registerToolsWithRegistry(
  server,
  registerDependencyAnalysisTools,
  "dependency-analysis",
  verbose
);
registerToolsWithRegistry(server, registerIdeTools, "ide-tools", verbose);
registerToolsWithRegistry(
  server,
  registerCodeQualityTools,
  "code-quality",
  verbose
);
registerToolsWithRegistry(
  server,
  registerKnowledgeGraphFeatures,
  "knowledge-graph",
  verbose
);
registerToolsWithRegistry(
  server,
  registerVisualizationFeatures,
  "visualization",
  verbose
);
registerToolsWithRegistry(server, registerMemoryFeatures, "memory", verbose);
registerToolsWithRegistry(
  server,
  registerSocioTechnicalFeatures,
  "socio-technical",
  verbose
);
registerToolsWithRegistry(
  server,
  registerMultiRepoFeatures,
  "multi-repo",
  verbose
);
registerToolsWithRegistry(
  server,
  registerEvolutionFeatures,
  "evolution",
  verbose
);
registerToolsWithRegistry(
  server,
  registerSessionTools,
  "session-manager",
  verbose
);
registerToolsWithRegistry(server, registerDevTools, "dev-tools", verbose);

// Display the tool registration summary
const registry = getToolRegistry();
console.log("✓ Tool registration complete");
console.log(registry.getRegistrationSummary());

// Check if we should use stdio transport
if (process.env.STDIO_TRANSPORT === "true") {
  console.log("Server configured for stdio transport");
  const stdioTransport = new StdioServerTransport();
  server
    .connect(stdioTransport)
    .then(() => {
      console.log("✓ Server connected and ready to handle stdio requests");
    })
    .catch((err) => {
      console.error("Failed to connect to stdio transport:", err);
    });
} else {
  // Setup HTTP transport
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const app = express();

  // Add headers to fix CORS issues
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // Define route for GET /
  app.get("/", (req, res) => {
    res.json({
      status: "ok",
      server: "MCP Code Analysis Server",
      version: "1.0.0",
    });
  });

  // Set up SSE endpoint for client connections
  app.get("/mcp", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Create SSE transport for this connection
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

  // Start the HTTP server
  app.listen(port, () => {
    console.log(`✓ Server listening on port ${port}`);
    console.log("✓ MCP server ready to handle HTTP requests");
  });

  // Output the transport info
  console.log(`Server configured for HTTP transport on port ${port}`);
}
