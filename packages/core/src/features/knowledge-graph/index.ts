import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { 
  buildKnowledgeGraph, 
  queryKnowledgeGraph, 
  updateKnowledgeGraph,
  exportKnowledgeGraph
} from "./graph-manager.js";

/**
 * Register knowledge graph features with the MCP server
 */
export function registerKnowledgeGraphFeatures(server: McpServer) {
  // Tool to build or update the knowledge graph for a repository
  server.tool(
    "build-knowledge-graph",
    {
      repositoryUrl: z.string(),
      depth: z.number().default(2),
      includeExternalDependencies: z.boolean().default(true)
    },
    async ({ repositoryUrl, depth, includeExternalDependencies }) => {
      try {
        const result = await buildKnowledgeGraph(
          repositoryUrl, 
          depth, 
          includeExternalDependencies
        );
        
        return {
          content: [{
            type: "text",
            text: `Knowledge graph built successfully. Nodes: ${result.nodes}, Relationships: ${result.relationships}`
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error building knowledge graph: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );

  // Tool to query the knowledge graph
  server.tool(
    "query-knowledge-graph",
    {
      query: z.string(),
      repositoryUrl: z.string().optional(),
      contextDepth: z.number().default(2),
      includeExternalKnowledge: z.boolean().default(true),
      outputFormat: z.enum(["text", "json", "visualization"]).default("json")
    },
    async ({ query, repositoryUrl, contextDepth, includeExternalKnowledge, outputFormat }) => {
      try {
        const results = await queryKnowledgeGraph({
          query,
          repositoryUrl,
          contextDepth,
          includeExternalKnowledge
        });
        
        if (outputFormat === "visualization") {
          // Convert results to a visualization
          const visualization = await exportKnowledgeGraph(results, "mermaid");
          return {
            content: [{
              type: "text",
              text: visualization,
              _metadata: { format: "mermaid" }
            }]
          };
        }
        
        if (outputFormat === "text") {
          // Format results as descriptive text
          return {
            content: [{
              type: "text",
              text: formatGraphResultsAsText(results)
            }]
          };
        }
        
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
            text: `Error querying knowledge graph: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );

  // Tool to export the knowledge graph
  server.tool(
    "export-knowledge-graph",
    {
      repositoryUrl: z.string(),
      format: z.enum(["json", "mermaid", "dot", "cypher"]).default("json")
    },
    async ({ repositoryUrl, format }) => {
      try {
        // First query the graph to get all nodes and relationships
        const results = await queryKnowledgeGraph({
          query: "MATCH (n)-[r]-(m) WHERE n.repository = $repositoryUrl RETURN n, r, m",
          repositoryUrl
        });
        
        // Export in requested format
        const exported = await exportKnowledgeGraph(results, format);
        
        return {
          content: [{
            type: "text",
            text: exported,
            _metadata: format === "mermaid" ? { format: "mermaid" } : undefined
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error exporting knowledge graph: ${(error as Error).message}`
          }],
          isError: true
        };
      }
    }
  );
}

/**
 * Format graph query results as readable text
 */
function formatGraphResultsAsText(results: any): string {
  const { nodes, relationships } = results;
  
  let text = `Query returned ${nodes.length} nodes and ${relationships.length} relationships.\n\n`;
  
  // Add node information
  text += "Nodes:\n";
  nodes.forEach((node: any, index: number) => {
    text += `${index + 1}. [${node.type}] ${node.name}\n`;
    if (Object.keys(node.attributes).length > 0) {
      text += `   Attributes: ${JSON.stringify(node.attributes)}\n`;
    }
  });
  
  // Add relationship information
  text += "\nRelationships:\n";
  relationships.forEach((rel: any, index: number) => {
    const source = nodes.find((n: any) => n.id === rel.sourceId);
    const target = nodes.find((n: any) => n.id === rel.targetId);
    
    text += `${index + 1}. ${source?.name || rel.sourceId} [${rel.type}] ${target?.name || rel.targetId}\n`;
  });
  
  return text;
} 