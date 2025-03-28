/**
 * MCP Server Main Entry Point
 *
 * This is the main entry point for the MCP server. It uses the startServer
 * function to create and connect an MCP server with auto-detected backends.
 *
 * Environment variables:
 * - PORT: HTTP port for the server (default: 3000)
 * - STDIO_TRANSPORT: Use stdio transport instead of HTTP (set to "true")
 * - REDIS_URL: Redis connection URL (default: redis://localhost:6379)
 * - FORCE_MEMORY_SESSION: Force in-memory session storage (set to "true")
 * - VERBOSE: Show verbose logs (set to "true")
 */

import { startServer } from "./server/startServer.js";

// Parse environment variables
const options = {
  useStdio: process.env.STDIO_TRANSPORT === "true",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  redisUrl: process.env.REDIS_URL,
  forceMemorySessionStore: process.env.FORCE_MEMORY_SESSION === "true",
  verbose: process.env.VERBOSE === "true",
};

console.log("Starting MCP server with options:", {
  ...options,
  // Hide sensitive information from logs
  redisUrl: options.redisUrl ? "[CONFIGURED]" : undefined,
});

// Start the server
startServer(options)
  .then(({ server }) => {
    console.log("MCP server started successfully");
  })
  .catch((error) => {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  });
