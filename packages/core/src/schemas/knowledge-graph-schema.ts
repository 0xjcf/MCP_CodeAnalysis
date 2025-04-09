/**
 * Schema definitions for the knowledge graph
 * @module @mcp/core
 */

import { z } from 'zod';

/**
 * Schema for node types in the knowledge graph
 * Defines the valid types of nodes that can exist in the knowledge graph
 * Each node type represents a different kind of entity in the codebase:
 * - function: Represents a function or method
 * - file: Represents a source code file
 * - class: Represents a class or interface
 * - variable: Represents a variable or constant
 * - dependency: Represents a dependency or import
 * - concept: Represents a conceptual entity
 * - repository: Represents a code repository
 */
export const nodeTypeSchema = z.enum([
  'function',
  'file',
  'class',
  'variable',
  'dependency',
  'concept',
  'repository',
]);

/**
 * Type inference for node types
 */
export type NodeType = z.infer<typeof nodeTypeSchema>;
