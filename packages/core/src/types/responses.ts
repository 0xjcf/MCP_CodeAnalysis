/**
 * Standard response types for MCP tools
 *
 * This file defines the standard response format that all tools should use
 * to ensure consistent output structure for AI agents to consume. Using a
 * standardized format makes it easier for AI to understand and process tool
 * results, regardless of which specific tool was called.
 *
 * Key features:
 * - Consistent structure with data, metadata, and status sections
 * - Runtime validation using Zod schemas
 * - Type safety through TypeScript interfaces
 * - Support for context data to enable multi-step workflows
 */

import { z } from "zod";

/**
 * Base response schema that all tool responses must follow
 *
 * This schema defines the structure that all tool responses must adhere to.
 * It includes:
 * - data: The actual response content (can be any valid JSON value)
 * - metadata: Information about the tool execution
 * - status: Success/error status and related information
 * - context: Optional data for maintaining state across calls
 *
 * @example
 * ```typescript
 * // Example of a valid response structure
 * const response = {
 *   data: { fileCount: 42, lineCount: 1024 },
 *   metadata: {
 *     tool: 'repository-analysis',
 *     version: '1.0.0',
 *     executionTime: 350,
 *     timestamp: '2023-07-15T12:34:56Z'
 *   },
 *   status: {
 *     success: true,
 *     code: 200
 *   },
 *   context: {
 *     sessionId: 'abc123',
 *     relatedResults: ['analysis-123', 'metrics-456']
 *   }
 * };
 * ```
 */
export const ToolResponseSchema = z.object({
  data: z
    .any()
    .describe("The actual response data - can be any valid JSON value"),
  metadata: z.object({
    tool: z.string().describe("Name of the tool that generated this response"),
    version: z.string().describe("Version of the tool"),
    executionTime: z
      .number()
      .describe("Time taken to execute the tool (in milliseconds)"),
    timestamp: z
      .string()
      .describe("ISO timestamp of when the response was generated"),
  }),
  status: z.object({
    success: z.boolean().describe("Whether the operation succeeded"),
    code: z.number().describe("HTTP-like status code (200, 400, 500, etc.)"),
    message: z
      .string()
      .optional()
      .describe("Optional status message, especially useful for errors"),
  }),
  context: z
    .object({
      sessionId: z
        .string()
        .optional()
        .describe("Session identifier for related operations"),
      relatedResults: z
        .array(z.string())
        .optional()
        .describe("References to related result IDs"),
    })
    .optional()
    .describe("Optional context for chaining operations"),
});

/**
 * Type derived from the schema
 * Generic T represents the type of the data field
 *
 * This type provides strong typing for tool responses while allowing
 * different data types for different tools. It inherits all properties
 * from the Zod schema but allows specifying the concrete type for the data.
 *
 * @template T The type of the data field
 * @example
 * ```typescript
 * // Type-safe response with specific data type
 * interface MetricsData {
 *   complexity: number;
 *   linesOfCode: number;
 *   maintainability: number;
 * }
 *
 * const response: ToolResponse<MetricsData> = {
 *   data: {
 *     complexity: 15,
 *     linesOfCode: 250,
 *     maintainability: 85
 *   },
 *   metadata: {
 *     tool: 'code-metrics',
 *     version: '1.0.0',
 *     executionTime: 120,
 *     timestamp: new Date().toISOString()
 *   },
 *   status: {
 *     success: true,
 *     code: 200
 *   }
 * };
 * ```
 */
export type ToolResponse<T = any> = z.infer<typeof ToolResponseSchema> & {
  data: T;
};

/**
 * Schema for basic code analysis result
 *
 * This schema defines the structure for basic code analysis results,
 * including information about functions, classes, imports, and complexity.
 * It's used by tools that perform static analysis of code.
 *
 * @example
 * ```typescript
 * const analysis: CodeAnalysisResult = {
 *   functions: ['renderComponent', 'fetchData', 'processResults'],
 *   classes: ['DataService', 'UserComponent'],
 *   imports: ['react', 'axios', 'lodash'],
 *   complexity: 12
 * };
 * ```
 */
export const ComplexityMetricsSchema = z.object({
  cyclomatic: z.number().describe("Cyclomatic complexity score"),
  cognitive: z.number().describe("Cognitive complexity score"),
  maintainability: z.number().describe("Maintainability index"),
});

export const CodeAnalysisResultSchema = z.object({
  functions: z
    .array(z.string())
    .describe("List of functions found in the code"),
  classes: z.array(z.string()).describe("List of classes found in the code"),
  imports: z.array(z.string()).describe("List of imports found in the code"),
  complexity: ComplexityMetricsSchema.optional().describe(
    "Detailed complexity metrics"
  ),
});

export type CodeAnalysisResult = z.infer<typeof CodeAnalysisResultSchema>;

/**
 * Schema for dependency analysis result
 *
 * This schema defines the structure for dependency analysis results,
 * including a graph representation of dependencies and lists of direct
 * and transitive dependencies. This is used by tools that analyze
 * package dependencies or internal code dependencies.
 *
 * @example
 * ```typescript
 * const dependencyAnalysis: DependencyAnalysisResult = {
 *   graph: {
 *     nodes: [
 *       { id: 'n1', name: 'app', type: 'module' },
 *       { id: 'n2', name: 'react', type: 'package', version: '18.2.0' }
 *     ],
 *     edges: [
 *       { source: 'n1', target: 'n2', type: 'imports' }
 *     ]
 *   },
 *   directDependencies: ['react', 'lodash'],
 *   transitiveDependencies: ['object-assign', 'scheduler']
 * };
 * ```
 */
export const DependencyAnalysisResultSchema = z.object({
  graph: z.object({
    nodes: z.array(
      z.object({
        id: z.string().describe("Unique identifier for the node"),
        name: z.string().describe("Name of the dependency or module"),
        type: z
          .string()
          .describe("Type of dependency (package, module, file, etc.)"),
        version: z
          .string()
          .optional()
          .describe("Version of the dependency if applicable"),
      })
    ),
    edges: z.array(
      z.object({
        source: z.string().describe("ID of the source node"),
        target: z.string().describe("ID of the target node"),
        type: z
          .string()
          .optional()
          .describe("Type of relationship (imports, requires, uses, etc.)"),
      })
    ),
  }),
  directDependencies: z
    .array(z.string())
    .describe("List of direct dependencies"),
  transitiveDependencies: z
    .array(z.string())
    .optional()
    .describe("List of indirect dependencies"),
});

export type DependencyAnalysisResult = z.infer<
  typeof DependencyAnalysisResultSchema
>;

/**
 * Schema for code metrics result
 *
 * This schema defines the structure for code metrics results,
 * including various measurements like lines of code, comment lines,
 * complexity, and counts of functions and classes. These metrics
 * help evaluate code quality and size.
 *
 * @example
 * ```typescript
 * const metrics: CodeMetricsResult = {
 *   linesOfCode: 1250,
 *   commentLines: 325,
 *   complexity: 24,
 *   maintainability: 68,
 *   functions: 32,
 *   classes: 8
 * };
 * ```
 */
export const CodeMetricsResultSchema = z.object({
  linesOfCode: z.number().describe("Total lines of code"),
  commentLines: z.number().optional().describe("Total lines of comments"),
  complexity: z.number().optional().describe("Cyclomatic complexity score"),
  maintainability: z
    .number()
    .optional()
    .describe("Maintainability index (0-100)"),
  functions: z.number().optional().describe("Number of functions"),
  classes: z.number().optional().describe("Number of classes"),
});

export type CodeMetricsResult = z.infer<typeof CodeMetricsResultSchema>;
