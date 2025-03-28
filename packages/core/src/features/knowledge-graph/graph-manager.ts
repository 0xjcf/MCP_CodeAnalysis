import { createDatabase } from "../../utils/database.js";
import { getRepository, listFiles } from "../../utils/repository-analyzer.js";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { analyzeCode } from "../basic-analysis/analyzer.js";
import { GraphNode, GraphRelationship, GraphQueryResult, GraphQuery } from "../../types/knowledge-graph.js";
import { Database } from "sqlite";

let db: Database | undefined; // Will be initialized on first use

/**
 * Build or update the knowledge graph for a repository
 */
export async function buildKnowledgeGraph(
  repositoryUrl: string,
  depth: number = 2,
  includeExternalDependencies: boolean = true
): Promise<{ nodes: number, relationships: number }> {
  // Initialize db if needed
  if (!db) {
    db = await createDatabase("knowledge");
  }

  if (!db) {
    throw new Error("Database not initialized");
  }
  
  // Get repository
  const repoPath = await getRepository(repositoryUrl);
  const files = listFiles(repoPath);
  
  let nodesCount = 0;
  let relationshipsCount = 0;
  
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Add repository node
    const repoId = `repo:${uuidv4()}`;
    addNode({
      id: repoId,
      type: "repository",
      name: path.basename(repositoryUrl),
      attributes: {
        url: repositoryUrl,
        fileCount: files.length
      }
    });
    nodesCount++;
    
    // Process each file
    for (const file of files) {
      const fullPath = path.join(repoPath, file);
      try {
        const code = fs.readFileSync(fullPath, 'utf8');
        const fileLanguage = path.extname(file).slice(1);
        
        // Create file node
        const fileId = `file:${uuidv4()}`;
        addNode({
          id: fileId,
          type: "file",
          name: file,
          attributes: {
            language: fileLanguage,
            size: code.length,
            path: file
          }
        });
        nodesCount++;
        
        // Link file to repository
        addRelationship({
          id: `rel:${uuidv4()}`,
          type: "contains",
          sourceId: repoId,
          targetId: fileId,
          attributes: {}
        });
        relationshipsCount++;
        
        // Analyze code to get dependencies, classes, functions
        const analysis = analyzeCode(code, fileLanguage);
        
        // Process imports/dependencies
        for (const importItem of analysis.imports) {
          let targetId: string;
          
          // Check if the import already exists as a node
          const existingNode = await findNodeByName(importItem);
          if (existingNode) {
            targetId = existingNode.id;
          } else {
            // Create a new node for the import
            targetId = `dep:${uuidv4()}`;
            addNode({
              id: targetId,
              type: "dependency",
              name: importItem,
              attributes: {
                isExternal: !files.some(f => f.endsWith(importItem) || f.includes(importItem))
              }
            });
            nodesCount++;
          }
          
          // Link file to dependency
          addRelationship({
            id: `rel:${uuidv4()}`,
            type: "imports",
            sourceId: fileId,
            targetId: targetId,
            attributes: {}
          });
          relationshipsCount++;
        }
        
        // Process classes
        for (const className of analysis.classes) {
          const classId = `class:${uuidv4()}`;
          addNode({
            id: classId,
            type: "class",
            name: className,
            attributes: {
              file: file
            }
          });
          nodesCount++;
          
          // Link class to file
          addRelationship({
            id: `rel:${uuidv4()}`,
            type: "defines",
            sourceId: fileId,
            targetId: classId,
            attributes: {}
          });
          relationshipsCount++;
        }
        
        // Process functions
        for (const funcName of analysis.functions) {
          const funcId = `func:${uuidv4()}`;
          addNode({
            id: funcId,
            type: "function",
            name: funcName,
            attributes: {
              file: file
            }
          });
          nodesCount++;
          
          // Link function to file
          addRelationship({
            id: `rel:${uuidv4()}`,
            type: "defines",
            sourceId: fileId,
            targetId: funcId,
            attributes: {}
          });
          relationshipsCount++;
        }
      } catch (error) {
        console.warn(`Error processing file ${file}: ${(error as Error).message}`);
      }
    }
    
    await db.exec('COMMIT');
    return { nodes: nodesCount, relationships: relationshipsCount };
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}

/**
 * Query the knowledge graph
 */
export async function queryKnowledgeGraph(query: GraphQuery): Promise<GraphQueryResult> {
  // Simple implementation for demonstration
  // A real implementation would use a graph query language
  
  const { repositoryUrl, contextDepth = 1 } = query;
  
  // Start with a basic implementation that returns nodes related to a repository
  let nodes: GraphNode[] = [];
  let relationships: GraphRelationship[] = [];
  
  if (repositoryUrl) {
    // Get all nodes and relationships for the repository
    const repoNodes = await findNodesByAttribute("url", repositoryUrl);
    
    if (repoNodes.length === 0) {
      return { nodes: [], relationships: [] };
    }
    
    const repoId = repoNodes[0].id;
    
    // Get direct relationships
    const directRelationships = await findRelationshipsBySourceId(repoId);
    relationships.push(...directRelationships);
    
    // Get target nodes of direct relationships
    const directNodeIds = directRelationships.map(rel => rel.targetId);
    const directNodes = await findNodesById(directNodeIds);
    nodes.push(...repoNodes, ...directNodes);
    
    // If depth > 1, get additional levels of relationships
    if (contextDepth > 1) {
      for (let i = 1; i < contextDepth; i++) {
        const currentNodeIds = nodes.map(node => node.id);
        const relationshipsResult = await findRelationshipsBySourceIds(currentNodeIds);
        const nextRelationships = relationshipsResult.filter((rel: GraphRelationship) => 
          !relationships.some(r => r.id === rel.id));
        
        if (nextRelationships.length === 0) {
          break;
        }
        
        relationships.push(...nextRelationships);
        
        const nextNodeIds = nextRelationships.map((rel: GraphRelationship) => rel.targetId)
          .filter((id: string) => !nodes.some(node => node.id === id));
        
        if (nextNodeIds.length === 0) {
          break;
        }
        
        const nextNodes = await findNodesById(nextNodeIds);
        nodes.push(...nextNodes);
      }
    }
  }
  
  return { nodes, relationships };
}

/**
 * Update the knowledge graph with new information
 */
export async function updateKnowledgeGraph(
  repositoryUrl: string,
  updates: {
    addNodes?: GraphNode[];
    addRelationships?: GraphRelationship[];
    removeNodeIds?: string[];
    removeRelationshipIds?: string[];
  }
): Promise<void> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  const { addNodes, addRelationships, removeNodeIds, removeRelationshipIds } = updates;
  
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Add new nodes
    if (addNodes) {
      for (const node of addNodes) {
        await addNode(node);
      }
    }
    
    // Add new relationships
    if (addRelationships) {
      for (const relationship of addRelationships) {
        await addRelationship(relationship);
      }
    }
    
    // Remove nodes (and their relationships)
    if (removeNodeIds) {
      for (const nodeId of removeNodeIds) {
        await removeRelationshipsByNodeId(nodeId);
        await removeNode(nodeId);
      }
    }
    
    // Remove relationships
    if (removeRelationshipIds) {
      for (const relationshipId of removeRelationshipIds) {
        await removeRelationship(relationshipId);
      }
    }
    
    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}

/**
 * Export the knowledge graph to a specific format
 */
export async function exportKnowledgeGraph(results: GraphQueryResult, format: string): Promise<string> {
  const { nodes, relationships } = results;
  
  switch (format) {
    case "json":
      return JSON.stringify({ nodes, relationships }, null, 2);
    
    case "mermaid":
      return exportToMermaid(nodes, relationships);
    
    case "dot":
      return exportToDot(nodes, relationships);
    
    case "cypher":
      return exportToCypher(nodes, relationships);
    
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Add a node to the knowledge graph
 */
async function addNode(node: GraphNode): Promise<void> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  await db.run(
    `INSERT OR REPLACE INTO nodes (id, type, name, attributes)
    VALUES (?, ?, ?, ?)`,
    [node.id, node.type, node.name, JSON.stringify(node.attributes)]
  );
}

/**
 * Add a relationship to the knowledge graph
 */
async function addRelationship(relationship: GraphRelationship): Promise<void> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  await db.run(
    `INSERT OR REPLACE INTO relationships (id, type, sourceId, targetId, attributes)
    VALUES (?, ?, ?, ?, ?)`,
    [
      relationship.id,
      relationship.type,
      relationship.sourceId,
      relationship.targetId,
      JSON.stringify(relationship.attributes)
    ]
  );
}

/**
 * Find a node by name
 */
async function findNodeByName(name: string): Promise<GraphNode | null> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  const result = await db.get(
    `SELECT id, type, name, attributes FROM nodes
     WHERE name = ?
     LIMIT 1`,
    [name]
  );
  
  if (!result) {
    return null;
  }
  
  return {
    id: result.id,
    type: result.type,
    name: result.name,
    attributes: JSON.parse(result.attributes)
  };
}

/**
 * Find nodes by a specific attribute value
 */
async function findNodesByAttribute(attributeName: string, attributeValue: any): Promise<GraphNode[]> {
  if (!db) {
    db = await createDatabase("knowledge");
  }

  if (!db) {
    throw new Error("Database not initialized");
  }
  
  const allNodes = await db.all(`
    SELECT id, type, name, attributes FROM nodes
  `);
  
  return allNodes
    .filter(node => {
      const attributes = JSON.parse(node.attributes);
      return attributes[attributeName] === attributeValue;
    })
    .map(node => ({
      id: node.id,
      type: node.type,
      name: node.name,
      attributes: JSON.parse(node.attributes)
    }));
}

/**
 * Find nodes by their IDs
 */
async function findNodesById(ids: string[]): Promise<GraphNode[]> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  if (ids.length === 0) {
    return [];
  }
  
  const placeholders = ids.map(() => '?').join(',');
  const nodes = await db.all(`
    SELECT id, type, name, attributes FROM nodes
    WHERE id IN (${placeholders})
  `, ...ids);
  
  return nodes.map(node => ({
    id: node.id,
    type: node.type,
    name: node.name,
    attributes: JSON.parse(node.attributes)
  }));
}

/**
 * Find relationships by source ID
 */
async function findRelationshipsBySourceId(sourceId: string): Promise<GraphRelationship[]> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  const relationships = await db.all(`
    SELECT id, type, sourceId, targetId, attributes FROM relationships
    WHERE sourceId = ?
  `, sourceId);
  
  return relationships.map(rel => ({
    id: rel.id,
    type: rel.type,
    sourceId: rel.sourceId,
    targetId: rel.targetId,
    attributes: JSON.parse(rel.attributes)
  }));
}

/**
 * Find relationships by multiple source IDs
 */
async function findRelationshipsBySourceIds(sourceIds: string[]): Promise<GraphRelationship[]> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  if (sourceIds.length === 0) {
    return [];
  }
  
  const placeholders = sourceIds.map(() => '?').join(',');
  const relationships = await db.all(`
    SELECT id, type, sourceId, targetId, attributes FROM relationships
    WHERE sourceId IN (${placeholders})
  `, ...sourceIds);
  
  return relationships.map(rel => ({
    id: rel.id,
    type: rel.type,
    sourceId: rel.sourceId,
    targetId: rel.targetId,
    attributes: JSON.parse(rel.attributes)
  }));
}

/**
 * Remove a node from the knowledge graph
 */
async function removeNode(nodeId: string): Promise<void> {
  if (!db) {
    db = await createDatabase("knowledge");
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  await db.run(`DELETE FROM nodes WHERE id = ?`, [nodeId]);
}

/**
 * Remove a relationship from the knowledge graph
 */
async function removeRelationship(relationshipId: string): Promise<void> {
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  await db.run(`DELETE FROM relationships WHERE id = ?`, [relationshipId]);
}

/**
 * Remove all relationships connected to a node
 */
async function removeRelationshipsByNodeId(nodeId: string): Promise<void> {
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  await db.run(`DELETE FROM relationships WHERE sourceId = ? OR targetId = ?`, [nodeId, nodeId]);
}

/**
 * Export the knowledge graph to Mermaid format
 */
function exportToMermaid(nodes: GraphNode[], relationships: GraphRelationship[]): string {
  let mermaid = "graph TD;\n";
  
  // Add nodes
  for (const node of nodes) {
    const safeId = sanitizeId(node.id);
    mermaid += `  ${safeId}["${node.name} (${node.type})"];\n`;
  }
  
  // Add relationships
  for (const rel of relationships) {
    const sourceId = sanitizeId(rel.sourceId);
    const targetId = sanitizeId(rel.targetId);
    mermaid += `  ${sourceId} -- ${rel.type} --> ${targetId};\n`;
  }
  
  return mermaid;
}

/**
 * Export the knowledge graph to DOT format
 */
function exportToDot(nodes: GraphNode[], relationships: GraphRelationship[]): string {
  let dot = "digraph KnowledgeGraph {\n";
  dot += "  node [shape=box];\n";
  
  // Add nodes
  for (const node of nodes) {
    const safeId = sanitizeId(node.id);
    dot += `  "${safeId}" [label="${node.name} (${node.type})"];\n`;
  }
  
  // Add relationships
  for (const rel of relationships) {
    const sourceId = sanitizeId(rel.sourceId);
    const targetId = sanitizeId(rel.targetId);
    dot += `  "${sourceId}" -> "${targetId}" [label="${rel.type}"];\n`;
  }
  
  dot += "}";
  return dot;
}

/**
 * Export the knowledge graph to Cypher queries for Neo4j
 */
function exportToCypher(nodes: GraphNode[], relationships: GraphRelationship[]): string {
  let cypher = "";
  
  // Create nodes
  for (const node of nodes) {
    const attributesString = Object.entries(node.attributes)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
    
    cypher += `CREATE (n:${node.type} {id: "${node.id}", name: "${node.name}", ${attributesString}});\n`;
  }
  
  cypher += "\n";
  
  // Create relationships
  for (const rel of relationships) {
    const sourceNode = nodes.find(n => n.id === rel.sourceId);
    const targetNode = nodes.find(n => n.id === rel.targetId);
    
    if (sourceNode && targetNode) {
      const attributesString = Object.entries(rel.attributes)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(', ');
      
      cypher += `MATCH (a:${sourceNode.type} {id: "${rel.sourceId}"}), (b:${targetNode.type} {id: "${rel.targetId}"})
CREATE (a)-[r:${rel.type} {id: "${rel.id}", ${attributesString}}]->(b);\n`;
    }
  }
  
  return cypher;
}

/**
 * Sanitize an ID for use in graph formats
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9]/g, '_');
} 