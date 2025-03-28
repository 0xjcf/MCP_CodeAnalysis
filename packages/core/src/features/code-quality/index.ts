import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { analyzeCodeQuality, getQualityRules } from "./quality-analyzer.js";

export function registerCodeQualityTools(server: McpServer) {
  // Register the analyze-quality tool
  server.tool(
    "analyze-quality",
    {
      repositoryPath: z.string().describe("Path to the repository to analyze"),
      includePaths: z.array(z.string()).optional().describe("Patterns of files to include"),
      excludePaths: z.array(z.string()).optional().describe("Patterns of files to exclude"),
      maxIssues: z.number().optional().describe("Maximum number of issues to report"),
      minSeverity: z.enum(["error", "warning", "info"]).optional().describe("Minimum severity level to report")
    },
    async ({ repositoryPath, includePaths, excludePaths, maxIssues, minSeverity }) => {
      try {
        console.log(`Analyzing code quality in: ${repositoryPath}`);
        
        // Perform the analysis
        const qualityReport = await analyzeCodeQuality(repositoryPath, {
          includePaths,
          excludePaths,
          maxIssues,
          minSeverity
        });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(qualityReport, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error analyzing code quality: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );
  
  // Register the list-quality-rules tool
  server.tool(
    "list-quality-rules",
    {},
    async () => {
      try {
        const rules = getQualityRules();
        return {
          content: [{
            type: "text",
            text: JSON.stringify(rules, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error retrieving quality rules: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );
} 