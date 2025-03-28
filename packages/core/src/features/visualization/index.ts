import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateDependencyGraph, generateCodeStructureVisualization } from "./visualizer.js";

/**
 * Register visualization features with the MCP server
 */
export function registerVisualizationFeatures(server: McpServer) {
  // Tool to generate dependency graph visualization
  server.tool(
    "visualize-dependencies",
    {
      repositoryUrl: z.string().optional(),
      filePath: z.string().optional(),
      path: z.string().optional(),
      fileContent: z.string().optional(),
      format: z.enum(["ascii", "mermaid", "dot"]).default("mermaid")
    },
    async ({ repositoryUrl, filePath, path, fileContent, format }) => {
      try {
        const targetPath = path || repositoryUrl || filePath;
        
        const visualization = await generateDependencyGraph({
          repositoryUrl: targetPath,
          filePath,
          fileContent,
          format
        });
        
        return {
          content: [{
            type: "text",
            text: visualization,
            _metadata: format === "mermaid" ? { format: "mermaid" } : undefined
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error generating visualization: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );

  // Tool to visualize code structure
  server.tool(
    "visualize-code-structure",
    {
      repositoryUrl: z.string().optional(),
      filePath: z.string().optional(),
      fileContent: z.string().optional(),
      showMethods: z.boolean().default(true),
      showAttributes: z.boolean().default(true),
      format: z.enum(["ascii", "mermaid", "dot"]).default("mermaid")
    },
    async ({ repositoryUrl, filePath, fileContent, showMethods, showAttributes, format }) => {
      try {
        const visualization = await generateCodeStructureVisualization({
          repositoryUrl,
          filePath,
          fileContent,
          showMethods,
          showAttributes,
          format
        });
        
        return {
          content: [{
            type: "text",
            text: visualization,
            _metadata: format === "mermaid" ? { format: "mermaid" } : undefined
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error generating visualization: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );
} 