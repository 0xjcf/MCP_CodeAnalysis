import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { getToolRegistry } from "../../registry/index.js";

import { analyzeDependencies } from "./dependency-analyzer.js";

/**
 * Generate a Mermaid diagram from dependency graph
 */
function generateMermaidGraph(graph: any): string {
  // Implementation details...
  return "graph TD;\n  A-->B;";
}

/**
 * Generate a DOT graph from dependency graph
 */
function generateDotGraph(graph: any): string {
  // Implementation details...
  return "digraph G { A -> B; }";
}

export function registerDependencyAnalysisTools(server: McpServer) {
  const registry = getToolRegistry();
  const source = "dependency-analysis";

  // Define the schema and handler for analyze-dependencies tool
  const schema = {
    repositoryUrl: z
      .string()
      .optional()
      .describe("URL or path to the repository to analyze"),
    repositoryPath: z
      .string()
      .optional()
      .describe("Path to the repository to analyze"),
    fileContent: z.string().optional().describe("File content to analyze"),
    format: z
      .enum(["json", "mermaid", "dot"])
      .optional()
      .describe("Output format for the dependency graph"),
  };

  const handler = async ({
    repositoryUrl,
    repositoryPath,
    fileContent,
    format = "json",
  }: {
    repositoryUrl?: string;
    repositoryPath?: string;
    fileContent?: string;
    format?: "json" | "mermaid" | "dot";
  }) => {
    try {
      const repoPath = repositoryPath || repositoryUrl; // Use either one
      if (!repoPath && !fileContent) {
        throw new Error(
          "Either repositoryUrl, repositoryPath, or fileContent must be provided"
        );
      }

      console.log(
        `Analyzing dependencies in: ${repoPath || "provided content"}`
      );

      // Perform the analysis
      const analysis = await analyzeDependencies(repoPath || ".");

      // Format the result based on requested format
      let formattedResult;
      switch (format) {
        case "mermaid":
          formattedResult = generateMermaidGraph(analysis.graph);
          break;
        case "dot":
          formattedResult = generateDotGraph(analysis.graph);
          break;
        default:
          formattedResult = JSON.stringify(analysis, null, 2);
      }

      return {
        content: [
          {
            type: "text",
            text: formattedResult,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error analyzing dependencies: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  };

  // Register with the centralized registry and server
  if (
    registry.registerWithServer(
      server,
      "analyze-dependencies",
      schema,
      handler,
      source
    )
  ) {
    // console.log("Successfully registered analyze-dependencies tool");
  } else {
    console.log(
      "Skipping registration of analyze-dependencies tool since it already exists"
    );
  }
}

/**
 * Format a node name to be valid in Mermaid
 */
function formatNodeId(name: string): string {
  // Replace characters that are problematic in Mermaid IDs
  return name.replace(/[^a-zA-Z0-9]/g, "_");
}
