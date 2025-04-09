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

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { getToolRegistry } from '../registry/index.js';
import { createSuccessResponse, createErrorResponse } from '../utils/responses.js';

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
interface IToolMetadata {
  /** Unique name of the tool */
  name: string;
  /** Detailed description of what the tool does */
  description?: string;
  /** Category the tool belongs to (e.g., "code-analysis", "visualization") */
  category?: string;
  /** Schema of the tool */
  schema: z.ZodType<any>;
  /** Source of the tool */
  source: string;
  /** Timeout for the tool */
  timeout?: number;
  /** Rate limit for the tool */
  rateLimit?: {
    requests: number;
    period: number;
  };
  /** Tags associated with the tool */
  tags?: string[];
}

/**
 * Register tool discovery features with the MCP server
 *
 * This function registers three discovery tools:
 * 1. list-tools: Lists all available tools with filtering options
 * 2. get-tool-details: Gets detailed information about a specific tool
 * 3. get-tools-by-category: Gets tools by category
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
    'list-tools',
    {
      category: z.string().optional().describe('Optional category to filter tools by'),
    },
    async ({ category }) => {
      const tools = getAvailableTools(server);
      const filteredTools = category ? tools.filter(tool => tool.category === category) : tools;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              createSuccessResponse({ tools: filteredTools }, 'list-tools'),
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  // Register a tool to get detailed information about a specific tool
  server.tool(
    'get-tool-details',
    {
      toolName: z
        .string()
        .describe("Name of the tool to get details for (e.g., 'analyze-repository')"),
    },
    async ({ toolName }) => {
      const registry = getToolRegistry();
      const tool = registry.getTool(toolName);

      if (!tool) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                createErrorResponse(`Tool '${toolName}' not found`, 'get-tool-details', {
                  code: 404,
                }),
                null,
                2,
              ),
            },
          ],
          isError: true,
        };
      }

      // Create a standard response
      const response = createSuccessResponse(
        {
          tool: {
            name: tool.id,
            description: tool.description,
            category: tool.category,
            schema: tool.schema,
            source: tool.source,
            timeout: tool.timeout,
            rateLimit: tool.rateLimit,
          },
        },
        'get-tool-details',
      );

      // Return MCP-formatted response
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    },
  );

  // Register a tool to get tools by category
  server.tool(
    'get-tools-by-category',
    {
      category: z.string().describe('Category to get tools for'),
    },
    async ({ category }) => {
      const registry = getToolRegistry();
      const tools = registry.getToolsByCategory(category);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              createSuccessResponse({ tools }, 'get-tools-by-category'),
              null,
              2,
            ),
          },
        ],
      };
    },
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
function getAvailableTools(server: McpServer): IToolMetadata[] {
  const registry = getToolRegistry();
  const tools = registry.getAllTools();

  return Array.from(tools.values()).map(tool => ({
    name: tool.id,
    description: tool.description,
    category: tool.category,
    schema: tool.schema as z.ZodType<any>,
    source: tool.source,
    timeout: tool.timeout,
    rateLimit: tool.rateLimit
      ? {
          requests: tool.rateLimit.maxRequests,
          period: tool.rateLimit.windowMs,
        }
      : undefined,
    tags: (tool as any).tags || [],
  }));
}

/**
 * Interface representing a relationship between tools
 */
interface IToolRelationship {
  source: string;
  target: string;
  type: string;
  description?: string;
}

/**
 * Generate relationships between tools based on their metadata
 */
function generateToolRelationships(tools: IToolMetadata[]): {
  nodes: { id: string; name: string; category: string; tags: string[] }[];
  edges: IToolRelationship[];
} {
  const nodes = tools.map(tool => ({
    id: tool.name,
    name: tool.name,
    category: tool.category || 'uncategorized',
    tags: tool.tags || [],
  }));

  // A simple algorithm to infer relationships between tools
  // In a real implementation, this would be more sophisticated
  const edges: IToolRelationship[] = [];

  // Group tools by category
  const categoriesMap: Record<string, string[]> = {};
  tools.forEach(tool => {
    const category = tool.category || 'uncategorized';
    if (!categoriesMap[category]) {
      categoriesMap[category] = [];
    }
    categoriesMap[category].push(tool.name);
  });

  // Connect tools within the same category
  Object.keys(categoriesMap).forEach(category => {
    const toolsInCategory = categoriesMap[category];
    if (toolsInCategory.length > 1) {
      for (let i = 0; i < toolsInCategory.length; i++) {
        for (let j = i + 1; j < toolsInCategory.length; j++) {
          edges.push({
            source: toolsInCategory[i],
            target: toolsInCategory[j],
            type: 'related',
            description: `Both in category: ${category}`,
          });
        }
      }
    }
  });

  // Connect tools that share tags
  const tagsMap: Record<string, string[]> = {};
  tools.forEach(tool => {
    (tool.tags || []).forEach(tag => {
      if (!tagsMap[tag]) {
        tagsMap[tag] = [];
      }
      tagsMap[tag].push(tool.name);
    });
  });

  Object.keys(tagsMap).forEach(tag => {
    const toolsWithTag = tagsMap[tag];
    if (toolsWithTag.length > 1) {
      for (let i = 0; i < toolsWithTag.length; i++) {
        for (let j = i + 1; j < toolsWithTag.length; j++) {
          // Avoid duplicates
          const existingEdge = edges.find(
            e =>
              (e.source === toolsWithTag[i] && e.target === toolsWithTag[j]) ||
              (e.source === toolsWithTag[j] && e.target === toolsWithTag[i]),
          );

          if (!existingEdge) {
            edges.push({
              source: toolsWithTag[i],
              target: toolsWithTag[j],
              type: 'tag-related',
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
  edges: IToolRelationship[];
}): string {
  let mermaid = 'graph TD;\n';

  // Add nodes grouped by category
  const nodesByCategory: Record<string, { id: string; name: string }[]> = {};
  relationships.nodes.forEach(node => {
    if (!nodesByCategory[node.category]) {
      nodesByCategory[node.category] = [];
    }
    nodesByCategory[node.category].push({ id: node.id, name: node.name });
  });

  // Subgraphs for categories
  Object.keys(nodesByCategory).forEach(category => {
    mermaid += `  subgraph ${category}\n`;
    nodesByCategory[category].forEach(node => {
      mermaid += `    ${node.id}["${node.name}"]\n`;
    });
    mermaid += '  end\n';
  });

  // Add edges
  relationships.edges.forEach(edge => {
    mermaid += `  ${edge.source} --- ${edge.target}\n`;
  });

  return mermaid;
}

/**
 * Generate a DOT diagram from tool relationships
 */
function generateDotDiagram(relationships: {
  nodes: { id: string; name: string; category: string; tags: string[] }[];
  edges: IToolRelationship[];
}): string {
  let dot = 'digraph ToolRelationships {\n';

  // Graph settings
  dot += '  rankdir=TD;\n';
  dot += '  node [shape=box, style=filled, fontname=Arial];\n';

  // Group nodes by category
  const nodesByCategory: Record<string, { id: string; name: string }[]> = {};
  relationships.nodes.forEach(node => {
    if (!nodesByCategory[node.category]) {
      nodesByCategory[node.category] = [];
    }
    nodesByCategory[node.category].push({ id: node.id, name: node.name });
  });

  // Subgraphs for categories
  Object.keys(nodesByCategory).forEach(category => {
    dot += `  subgraph cluster_${category.replace(/[^a-zA-Z0-9]/g, '_')} {\n`;
    dot += `    label="${category}";\n`;
    nodesByCategory[category].forEach(node => {
      dot += `    "${node.id}" [label="${node.name}"];\n`;
    });
    dot += '  }\n';
  });

  // Add edges
  relationships.edges.forEach(edge => {
    dot += `  "${edge.source}" -> "${edge.target}" [label="${edge.type}"];\n`;
  });

  dot += '}\n';
  return dot;
}
