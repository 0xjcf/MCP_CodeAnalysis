import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { analyzeCodeMetrics } from "./metrics-analyzer.js";
import { ToolResponseSchema } from "../../types/responses.js";

export function registerCodeMetricsTools(server: McpServer) {
  server.tool(
    "analyze-metrics",
    {
      repositoryPath: z.string().describe("Path to the repository to analyze"),
      includeFiles: z
        .boolean()
        .optional()
        .default(true)
        .describe("Include file-level metrics in the output"),
      includeFunctions: z
        .boolean()
        .optional()
        .default(false)
        .describe("Include function-level metrics in the output"),
    },
    async ({ repositoryPath, includeFiles, includeFunctions }) => {
      try {
        console.log(`Analyzing code metrics in: ${repositoryPath}`);

        // Perform the analysis
        const metrics = await analyzeCodeMetrics(repositoryPath);

        // Filter the output based on options
        if (!includeFiles) {
          delete metrics.files;
        } else if (!includeFunctions) {
          // Remove function details from file metrics
          for (const file of metrics?.files ?? []) {
            delete file.functions;
          }
        }

        // Return response in MCP format
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(metrics, null, 2),
            },
          ],
          _meta: {
            tool: "analyze-metrics",
            version: "1.0.0",
            executionTime: 0, // TODO: Track actual execution time
            timestamp: new Date().toISOString(),
          },
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error analyzing code metrics: ${(error as Error).message}`,
            },
          ],
          _meta: {
            tool: "analyze-metrics",
            version: "1.0.0",
            executionTime: 0,
            timestamp: new Date().toISOString(),
          },
          isError: true,
        };
      }
    }
  );
}
