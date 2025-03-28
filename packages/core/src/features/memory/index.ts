import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { 
  storeMemory, 
  retrieveMemories, 
  updateMemory, 
  categorizeInsight 
} from "./memory-manager.js";

/**
 * Register memory features with the MCP server
 */
export function registerMemoryFeatures(server: McpServer) {
  // Tool to store insights about a codebase
  server.tool(
    "store-codebase-insight",
    {
      repositoryUrl: z.string(),
      insightType: z.enum([
        "architectural-decision", 
        "performance-bottleneck", 
        "security-concern", 
        "code-pattern", 
        "refactoring-opportunity",
        "other"
      ]),
      insightContent: z.string(),
      relatedFiles: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional()
    },
    async ({ repositoryUrl, insightType, insightContent, relatedFiles, tags }) => {
      try {
        // Categorize and store the insight
        const category = await categorizeInsight(insightContent, insightType);
        const memoryId = await storeMemory({
          repositoryUrl,
          insightType,
          category,
          insightContent,
          relatedFiles: relatedFiles || [],
          tags: tags || [],
          timestamp: new Date().toISOString()
        });
        
        return {
          content: [{
            type: "text",
            text: `Successfully stored insight with ID: ${memoryId}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error storing insight: ${(error as Error).message}`
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
      repositoryUrl: z.string(),
      insightTypes: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      relatedFile: z.string().optional(),
      limit: z.number().optional()
    },
    async ({ repositoryUrl, insightTypes, tags, relatedFile, limit }) => {
      try {
        const memories = await retrieveMemories({
          repositoryUrl,
          insightTypes,
          tags,
          relatedFile,
          limit: limit || 10
        });
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(memories, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error retrieving insights: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );

  // Tool to update an existing insight
  server.tool(
    "update-codebase-insight",
    {
      insightId: z.number(),
      insightContent: z.string().optional(),
      insightType: z.string().optional(),
      relatedFiles: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional()
    },
    async ({ insightId, insightContent, insightType, relatedFiles, tags }) => {
      try {
        await updateMemory({
          id: insightId,
          insightContent,
          insightType,
          relatedFiles,
          tags
        });
        
        return {
          content: [{
            type: "text",
            text: `Successfully updated insight with ID: ${insightId}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error updating insight: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );
} 