import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { analyzeMultipleRepositories } from "./multi-repo-analyzer.js";

/**
 * Register multi-repository analysis features with the MCP server
 */
export function registerMultiRepoFeatures(server: McpServer) {
  // Tool to analyze relationships between multiple repositories
  server.tool(
    "cross-repo-analysis",
    {
      primaryRepoUrl: z.string(),
      relatedRepoUrls: z.array(z.string()),
      analysisType: z.enum(["dependencies", "api-usage", "architectural-patterns"]).default("dependencies"),
      contextDepth: z.number().min(1).max(3).default(2)
    },
    async ({ primaryRepoUrl, relatedRepoUrls, analysisType, contextDepth }) => {
      try {
        const results = await analyzeMultipleRepositories(
          primaryRepoUrl, 
          relatedRepoUrls, 
          analysisType,
          contextDepth
        );
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(results, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error in cross-repository analysis: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );
} 