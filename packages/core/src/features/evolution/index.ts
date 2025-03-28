import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateEvolutionPlan } from "./evolution-planner.js";

/**
 * Register code evolution features with the MCP server
 */
export function registerEvolutionFeatures(server: McpServer) {
  // Tool to generate evolution pathways for codebases
  server.tool(
    "evolution-pathway",
    {
      repositoryUrl: z.string(),
      targetGoal: z.enum([
        "modernize-architecture", 
        "improve-performance", 
        "enhance-security",
        "reduce-technical-debt"
      ]),
      timeframe: z.enum(["immediate", "sprint", "quarter", "year"]),
      includeImplementationDetails: z.boolean().default(true)
    },
    async ({ repositoryUrl, targetGoal, timeframe, includeImplementationDetails }) => {
      try {
        const plan = await generateEvolutionPlan(
          repositoryUrl, 
          targetGoal, 
          timeframe,
          includeImplementationDetails
        );
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(plan, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error generating evolution pathway: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );
} 