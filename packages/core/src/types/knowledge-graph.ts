/**
 * Represents a node in the knowledge graph
 */
export interface GraphNode {
  id: string;
  type: "function" | "file" | "class" | "variable" | "dependency" | "concept" | "repository";
  name: string;
  attributes: Record<string, any>;
}

/**
 * Represents a relationship between nodes in the knowledge graph
 */
export interface GraphRelationship {
  id: string;
  type: "imports" | "calls" | "defines" | "extends" | "implements" | "uses" | "contains" | "relates_to";
  sourceId: string;
  targetId: string;
  attributes: Record<string, any>;
}

/**
 * Structure for query results from the knowledge graph
 */
export interface GraphQueryResult {
  nodes: GraphNode[];
  relationships: GraphRelationship[];
}

/**
 * Parameters for querying the knowledge graph
 */
export interface GraphQuery {
  query: string;
  repositoryUrl?: string;
  contextDepth?: number;
  includeExternalKnowledge?: boolean;
} 