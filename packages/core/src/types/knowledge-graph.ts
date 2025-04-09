/**
 * Represents valid attribute values in the knowledge graph
 */
export type GraphAttributeValue =
  | string
  | number
  | boolean
  | null
  | GraphAttributeValue[]
  | { [key: string]: GraphAttributeValue };

/**
 * Represents a node in the knowledge graph
 */
export interface IGraphNode {
  id: string;
  type: 'function' | 'file' | 'class' | 'variable' | 'dependency' | 'concept' | 'repository';
  name: string;
  attributes: Record<string, GraphAttributeValue>;
}

/**
 * Represents a relationship between nodes in the knowledge graph
 */
export interface IGraphRelationship {
  id: string;
  type:
    | 'imports'
    | 'calls'
    | 'defines'
    | 'extends'
    | 'implements'
    | 'uses'
    | 'contains'
    | 'relates_to';
  sourceId: string;
  targetId: string;
  attributes: Record<string, GraphAttributeValue>;
}

/**
 * Structure for query results from the knowledge graph
 */
export interface IGraphQueryResult {
  nodes: IGraphNode[];
  relationships: IGraphRelationship[];
}

/**
 * Parameters for querying the knowledge graph
 */
export interface IGraphQuery {
  query: string;
  repositoryUrl?: string;
  contextDepth?: number;
  includeExternalKnowledge?: boolean;
}
