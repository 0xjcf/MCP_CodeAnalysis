import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { analyzeSocioTechnicalPatterns } from "./socio-technical-analyzer.js";

/**
 * Register socio-technical analysis features with the MCP server
 */
export function registerSocioTechnicalFeatures(server: McpServer) {
  // Tool to analyze socio-technical patterns in repositories
  server.tool(
    "socio-technical-analysis",
    {
      repositoryUrl: z.string(),
      includeContributorPatterns: z.boolean().default(true),
      includeTeamDynamics: z.boolean().default(true),
      timeRange: z.object({
        start: z.string().optional(),
        end: z.string().optional()
      }).optional(),
      visualizationFormat: z.enum(["json", "mermaid", "dot"]).default("json")
    },
    async ({ repositoryUrl, includeContributorPatterns, includeTeamDynamics, timeRange, visualizationFormat }) => {
      try {
        const results = await analyzeSocioTechnicalPatterns(
          repositoryUrl, 
          includeContributorPatterns,
          includeTeamDynamics,
          timeRange,
          visualizationFormat
        );
        
        // Return appropriate content type based on visualization format
        if (visualizationFormat === "mermaid") {
          return {
            content: [{
              type: "text",
              text: results.visualization,
              _metadata: { format: "mermaid" }
            }, {
              type: "text",
              text: JSON.stringify(results.analysis, null, 2)
            }]
          };
        } else if (visualizationFormat === "dot") {
          return {
            content: [{
              type: "text",
              text: results.visualization,
              _metadata: { format: "dot" }
            }, {
              type: "text",
              text: JSON.stringify(results.analysis, null, 2)
            }]
          };
        } else {
          return {
            content: [{
              type: "text",
              text: JSON.stringify(results, null, 2)
            }]
          };
        }
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error in socio-technical analysis: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );
} 