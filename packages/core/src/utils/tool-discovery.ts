/**
 * Tool discovery utilities for MCP server
 *
 * These utilities help AI agents discover and understand the available tools
 * in the MCP server, their parameters, and how to use them. The discovery
 * system provides:
 *
 * 1. A way to list all available tools with filtering options
 * 2. Detailed information about specific tools including parameters and examples
 * 3. Visualization of relationships between tools
 *
 * This is particularly useful for AI agents that need to determine which tools
 * are most appropriate for a given task.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../utils/responses.js";

/**
 * Interface representing a tool's metadata
 *
 * This structure contains all the information needed to understand a tool's
 * purpose, how to use it, and what to expect from its response.
 *
 * @example
 * ```typescript
 * const toolMetadata: ToolMetadata = {
 *   name: "analyze-code",
 *   description: "Analyzes source code for quality and metrics",
 *   parameters: [
 *     {
 *       name: "code",
 *       type: "string",
 *       description: "The source code to analyze",
 *       required: true
 *     }
 *   ],
 *   examples: [
 *     {
 *       description: "Analyze a JavaScript function",
 *       parameters: {
 *         code: "function add(a, b) { return a + b; }"
 *       }
 *     }
 *   ],
 *   category: "code-analysis",
 *   tags: ["javascript", "quality"]
 * };
 * ```
 */
export interface ToolMetadata {
  /** Unique name of the tool */
  name: string;
  /** Detailed description of what the tool does */
  description: string;
  /** Parameters the tool accepts */
  parameters: {
    /** Parameter name */
    name: string;
    /** Parameter data type */
    type: string;
    /** Human-readable description of the parameter */
    description: string;
    /** Whether the parameter must be provided */
    required: boolean;
    /** Default value if not provided */
    default?: any;
    /** Example value for the parameter */
    example?: any;
  }[];
  /** Usage examples for the tool */
  examples?: {
    /** Description of what the example demonstrates */
    description: string;
    /** Sample parameter values */
    parameters: Record<string, any>;
    /** Expected response (optional) */
    response?: any;
  }[];
  /** Category the tool belongs to (e.g., "code-analysis", "visualization") */
  category?: string;
  /** Tags for filtering and discovery */
  tags?: string[];
}

/**
 * Register tool discovery features with the MCP server
 *
 * This function registers three discovery tools:
 * 1. list-available-tools: Lists all available tools with filtering options
 * 2. get-tool-details: Gets detailed information about a specific tool
 * 3. visualize-tool-relationships: Visualizes how tools relate to each other
 *
 * These tools provide AI agents with the ability to discover and understand
 * the available functionality of the MCP server.
 *
 * @param server - The MCP server instance to register tools with
 * @example
 * ```typescript
 * import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
 * import { registerToolDiscoveryFeatures } from "./utils/tool-discovery.js";
 *
 * const server = new McpServer({ name: "my-server", version: "1.0.0" });
 * registerToolDiscoveryFeatures(server);
 * ```
 */
export function registerToolDiscoveryFeatures(server: McpServer) {
  // Register a tool to list all available tools
  server.tool(
    "list-available-tools",
    {
      category: z
        .string()
        .optional()
        .describe(
          "Filter tools by category (e.g., 'code-analysis', 'visualization')"
        ),
      tag: z
        .string()
        .optional()
        .describe("Filter tools by tag (e.g., 'javascript', 'performance')"),
      includeExamples: z
        .boolean()
        .default(true)
        .describe("Include example usage in the response for each tool"),
    },
    async ({ category, tag, includeExamples }) => {
      // In a real implementation, this would introspect the server
      // For now, we'll build a static list of tool metadata
      const tools = getAvailableTools(server);

      // Filter by category if specified
      let filteredTools = tools;
      if (category) {
        filteredTools = filteredTools.filter((t) => t.category === category);
      }

      // Filter by tag if specified
      if (tag) {
        filteredTools = filteredTools.filter((t) => t.tags?.includes(tag));
      }

      // Remove examples if not requested (to reduce response size)
      if (!includeExamples) {
        filteredTools = filteredTools.map((tool) => ({
          ...tool,
          examples: undefined,
        }));
      }

      // Create a standard response
      const response = createSuccessResponse(
        { tools: filteredTools },
        "list-available-tools"
      );

      // Return MCP-formatted response
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }
  );

  // Register a tool to get detailed information about a specific tool
  server.tool(
    "get-tool-details",
    {
      toolName: z
        .string()
        .describe(
          "Name of the tool to get details for (e.g., 'analyze-repository')"
        ),
    },
    async ({ toolName }) => {
      const tools = getAvailableTools(server);
      const tool = tools.find((t) => t.name === toolName);

      if (!tool) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                createErrorResponse(
                  `Tool '${toolName}' not found`,
                  "get-tool-details",
                  { code: 404 }
                ),
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }

      // Create a standard response
      const response = createSuccessResponse({ tool }, "get-tool-details");

      // Return MCP-formatted response
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }
  );

  // Register a tool to visualize tool relationships
  server.tool(
    "visualize-tool-relationships",
    {
      format: z
        .enum(["json", "mermaid", "dot"])
        .default("json")
        .describe(
          "Output format for the visualization: 'json' for raw data, 'mermaid' for Mermaid diagram syntax, 'dot' for GraphViz DOT format"
        ),
    },
    async ({ format }) => {
      const tools = getAvailableTools(server);
      const relationships = generateToolRelationships(tools);

      let visualization;
      switch (format) {
        case "mermaid":
          visualization = generateMermaidDiagram(relationships);
          break;
        case "dot":
          visualization = generateDotDiagram(relationships);
          break;
        default:
          visualization = relationships;
      }

      // Create a standard response
      const response = createSuccessResponse(
        { visualization, format },
        "visualize-tool-relationships"
      );

      // Return MCP-formatted response
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }
  );
}

/**
 * Get all available tools from the MCP server
 *
 * This function retrieves metadata about all registered tools in the MCP server.
 * In this implementation, it returns a static list of known tools, but in a
 * production environment, it would introspect the server to dynamically discover
 * all registered tools and their metadata.
 *
 * @param server - The MCP server instance to get tools from
 * @returns Array of tool metadata objects
 * @example
 * ```typescript
 * const server = new McpServer({ name: "my-server", version: "1.0.0" });
 * const tools = getAvailableTools(server);
 * console.log(`Found ${tools.length} tools`);
 * ```
 */
function getAvailableTools(server: McpServer): ToolMetadata[] {
  // For now, return a static list of known tools
  // In a full implementation, this would introspect the server

  return [
    {
      name: "analyze-repository",
      description:
        "Analyzes a code repository for structure, dependencies, and metrics",
      parameters: [
        {
          name: "repositoryUrl",
          type: "string",
          description: "URL of the repository to analyze",
          required: true,
          example: "https://github.com/example/repo",
        },
        {
          name: "depth",
          type: "number",
          description: "Analysis depth",
          required: false,
          default: 2,
          example: 3,
        },
        {
          name: "includeDependencies",
          type: "boolean",
          description: "Include dependency analysis",
          required: false,
          default: true,
          example: true,
        },
        {
          name: "includeComplexity",
          type: "boolean",
          description: "Include complexity analysis",
          required: false,
          default: true,
          example: true,
        },
        {
          name: "specificFiles",
          type: "string[]",
          description: "Specific files to analyze",
          required: false,
          example: ["src/main.ts", "src/utils/*.ts"],
        },
      ],
      examples: [
        {
          description: "Analyze a GitHub repository",
          parameters: {
            repositoryUrl: "https://github.com/example/repo",
            depth: 2,
            includeDependencies: true,
          },
        },
      ],
      category: "code-analysis",
      tags: ["repository", "analysis", "dependencies"],
    },
    {
      name: "analyze-dependencies",
      description: "Analyzes dependencies within code or a repository",
      parameters: [
        {
          name: "repositoryUrl",
          type: "string",
          description: "URL of the repository to analyze",
          required: false,
          example: "https://github.com/example/repo",
        },
        {
          name: "fileContent",
          type: "string",
          description: "Source code content to analyze",
          required: false,
          example: "const fs = require('fs'); const path = require('path');",
        },
        {
          name: "language",
          type: "string",
          description: "Programming language of the code",
          required: false,
          example: "javascript",
        },
      ],
      examples: [
        {
          description: "Analyze dependencies in JavaScript code",
          parameters: {
            fileContent:
              "const fs = require('fs'); const path = require('path');",
            language: "javascript",
          },
        },
      ],
      category: "code-analysis",
      tags: ["dependencies", "imports", "modules"],
    },
    {
      name: "calculate-metrics",
      description: "Calculates code quality metrics for files or repositories",
      parameters: [
        {
          name: "repositoryUrl",
          type: "string",
          description: "URL of the repository to analyze",
          required: false,
          example: "https://github.com/example/repo",
        },
        {
          name: "filePath",
          type: "string",
          description: "Path to the file within the repository",
          required: false,
          example: "src/main.ts",
        },
        {
          name: "fileContent",
          type: "string",
          description: "Source code content to analyze",
          required: false,
          example: "function calculateSum(a, b) { return a + b; }",
        },
        {
          name: "language",
          type: "string",
          description: "Programming language of the code",
          required: false,
          example: "javascript",
        },
        {
          name: "metrics",
          type: "string[]",
          description: "Specific metrics to calculate",
          required: false,
          default: ["complexity", "linesOfCode", "maintainability"],
          example: ["complexity", "linesOfCode"],
        },
      ],
      examples: [
        {
          description: "Calculate metrics for JavaScript code",
          parameters: {
            fileContent: "function calculateSum(a, b) { return a + b; }",
            language: "javascript",
            metrics: ["complexity", "linesOfCode"],
          },
        },
      ],
      category: "code-metrics",
      tags: ["metrics", "complexity", "quality"],
    },
    // Tool discovery tools (self-reference)
    {
      name: "list-available-tools",
      description:
        "Lists all available tools with their descriptions and parameters",
      parameters: [
        {
          name: "category",
          type: "string",
          description: "Filter tools by category",
          required: false,
          example: "code-analysis",
        },
        {
          name: "tag",
          type: "string",
          description: "Filter tools by tag",
          required: false,
          example: "dependencies",
        },
        {
          name: "includeExamples",
          type: "boolean",
          description: "Include example usage in the response",
          required: false,
          default: true,
          example: true,
        },
      ],
      examples: [
        {
          description: "List all code analysis tools",
          parameters: {
            category: "code-analysis",
            includeExamples: true,
          },
        },
      ],
      category: "tool-discovery",
      tags: ["meta", "discovery", "help"],
    },
    {
      name: "get-tool-details",
      description: "Gets detailed information about a specific tool",
      parameters: [
        {
          name: "toolName",
          type: "string",
          description: "Name of the tool to get details for",
          required: true,
          example: "analyze-repository",
        },
      ],
      examples: [
        {
          description: "Get details about the analyze-repository tool",
          parameters: {
            toolName: "analyze-repository",
          },
        },
      ],
      category: "tool-discovery",
      tags: ["meta", "discovery", "help"],
    },
    {
      name: "visualize-tool-relationships",
      description: "Visualizes relationships between different tools",
      parameters: [
        {
          name: "format",
          type: "enum",
          description: "Output format for the visualization",
          required: false,
          default: "json",
          example: "mermaid",
        },
      ],
      examples: [
        {
          description: "Generate a Mermaid diagram of tool relationships",
          parameters: {
            format: "mermaid",
          },
        },
      ],
      category: "tool-discovery",
      tags: ["meta", "visualization", "relationships"],
    },
  ];
}

/**
 * Interface representing a relationship between tools
 */
interface ToolRelationship {
  source: string;
  target: string;
  type: string;
  description?: string;
}

/**
 * Generate relationships between tools based on their metadata
 */
function generateToolRelationships(tools: ToolMetadata[]): {
  nodes: { id: string; name: string; category: string; tags: string[] }[];
  edges: ToolRelationship[];
} {
  const nodes = tools.map((tool) => ({
    id: tool.name,
    name: tool.name,
    category: tool.category || "uncategorized",
    tags: tool.tags || [],
  }));

  // A simple algorithm to infer relationships between tools
  // In a real implementation, this would be more sophisticated
  const edges: ToolRelationship[] = [];

  // Group tools by category
  const categoriesMap: Record<string, string[]> = {};
  tools.forEach((tool) => {
    const category = tool.category || "uncategorized";
    if (!categoriesMap[category]) {
      categoriesMap[category] = [];
    }
    categoriesMap[category].push(tool.name);
  });

  // Connect tools within the same category
  Object.keys(categoriesMap).forEach((category) => {
    const toolsInCategory = categoriesMap[category];
    if (toolsInCategory.length > 1) {
      for (let i = 0; i < toolsInCategory.length; i++) {
        for (let j = i + 1; j < toolsInCategory.length; j++) {
          edges.push({
            source: toolsInCategory[i],
            target: toolsInCategory[j],
            type: "related",
            description: `Both in category: ${category}`,
          });
        }
      }
    }
  });

  // Connect tools that share tags
  const tagsMap: Record<string, string[]> = {};
  tools.forEach((tool) => {
    (tool.tags || []).forEach((tag) => {
      if (!tagsMap[tag]) {
        tagsMap[tag] = [];
      }
      tagsMap[tag].push(tool.name);
    });
  });

  Object.keys(tagsMap).forEach((tag) => {
    const toolsWithTag = tagsMap[tag];
    if (toolsWithTag.length > 1) {
      for (let i = 0; i < toolsWithTag.length; i++) {
        for (let j = i + 1; j < toolsWithTag.length; j++) {
          // Avoid duplicates
          const existingEdge = edges.find(
            (e) =>
              (e.source === toolsWithTag[i] && e.target === toolsWithTag[j]) ||
              (e.source === toolsWithTag[j] && e.target === toolsWithTag[i])
          );

          if (!existingEdge) {
            edges.push({
              source: toolsWithTag[i],
              target: toolsWithTag[j],
              type: "tag-related",
              description: `Both have tag: ${tag}`,
            });
          }
        }
      }
    }
  });

  return { nodes, edges };
}

/**
 * Generate a Mermaid diagram from tool relationships
 */
function generateMermaidDiagram(relationships: {
  nodes: { id: string; name: string; category: string; tags: string[] }[];
  edges: ToolRelationship[];
}): string {
  let mermaid = "graph TD;\n";

  // Add nodes grouped by category
  const nodesByCategory: Record<string, { id: string; name: string }[]> = {};
  relationships.nodes.forEach((node) => {
    if (!nodesByCategory[node.category]) {
      nodesByCategory[node.category] = [];
    }
    nodesByCategory[node.category].push({ id: node.id, name: node.name });
  });

  // Subgraphs for categories
  Object.keys(nodesByCategory).forEach((category) => {
    mermaid += `  subgraph ${category}\n`;
    nodesByCategory[category].forEach((node) => {
      mermaid += `    ${node.id}["${node.name}"]\n`;
    });
    mermaid += "  end\n";
  });

  // Add edges
  relationships.edges.forEach((edge) => {
    mermaid += `  ${edge.source} --- ${edge.target}\n`;
  });

  return mermaid;
}

/**
 * Generate a DOT diagram from tool relationships
 */
function generateDotDiagram(relationships: {
  nodes: { id: string; name: string; category: string; tags: string[] }[];
  edges: ToolRelationship[];
}): string {
  let dot = "digraph ToolRelationships {\n";

  // Graph settings
  dot += "  rankdir=TD;\n";
  dot += "  node [shape=box, style=filled, fontname=Arial];\n";

  // Group nodes by category
  const nodesByCategory: Record<string, { id: string; name: string }[]> = {};
  relationships.nodes.forEach((node) => {
    if (!nodesByCategory[node.category]) {
      nodesByCategory[node.category] = [];
    }
    nodesByCategory[node.category].push({ id: node.id, name: node.name });
  });

  // Subgraphs for categories
  Object.keys(nodesByCategory).forEach((category) => {
    dot += `  subgraph cluster_${category.replace(/[^a-zA-Z0-9]/g, "_")} {\n`;
    dot += `    label="${category}";\n`;
    nodesByCategory[category].forEach((node) => {
      dot += `    "${node.id}" [label="${node.name}"];\n`;
    });
    dot += "  }\n";
  });

  // Add edges
  relationships.edges.forEach((edge) => {
    dot += `  "${edge.source}" -> "${edge.target}" [label="${edge.type}"];\n`;
  });

  dot += "}\n";
  return dot;
}
