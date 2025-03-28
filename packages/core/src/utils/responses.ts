/**
 * Utility functions for creating standardized tool responses
 *
 * These functions help ensure all tools use a consistent response format
 * and provide runtime validation of responses. Standardized responses make
 * it easier for AI agents to understand and process the results of tool
 * executions.
 *
 * The standard format includes:
 * - A data field containing the actual response content
 * - Metadata about the tool execution (timing, version, etc.)
 * - Status information (success/error, codes, messages)
 * - Optional context for chaining operations
 */

import { z } from "zod";
import {
  ToolResponse,
  ToolResponseSchema,
  CodeAnalysisResult,
  DependencyAnalysisResult,
  CodeMetricsResult,
} from "../types/responses.js";

/**
 * Creates a standardized successful tool response
 *
 * This function wraps any data object in a standardized response format
 * that includes metadata, status information, and optional context. The
 * response is validated against the ToolResponseSchema to ensure it
 * meets the expected structure.
 *
 * @param data - The response data object (any valid JSON-serializable value)
 * @param tool - The name of the tool generating the response
 * @param options - Additional options for customizing the response
 * @param options.version - Tool version (defaults to '1.0.0')
 * @param options.sessionId - Session identifier for chaining operations
 * @param options.relatedResults - Array of related result IDs
 * @param options.executionTime - Execution time in milliseconds (calculated if not provided)
 * @returns A standardized tool response object
 *
 * @example
 * ```typescript
 * // Simple success response
 * const response = createSuccessResponse(
 *   { files: 42, lines: 1024 },
 *   'count-code-metrics'
 * );
 *
 * // Success response with additional options
 * const advancedResponse = createSuccessResponse(
 *   { dependencies: ['react', 'lodash'] },
 *   'analyze-dependencies',
 *   {
 *     version: '1.2.0',
 *     sessionId: 'abc123',
 *     executionTime: 350
 *   }
 * );
 * ```
 */
export function createSuccessResponse<T>(
  data: T,
  tool: string,
  options?: {
    version?: string;
    sessionId?: string;
    relatedResults?: string[];
    executionTime?: number;
  }
): ToolResponse<T> {
  const startTime =
    options?.executionTime !== undefined
      ? Date.now() - options.executionTime
      : undefined;

  const response: ToolResponse<T> = {
    data,
    metadata: {
      tool,
      version: options?.version || "1.0.0",
      executionTime: options?.executionTime || 0,
      timestamp: new Date().toISOString(),
    },
    status: {
      success: true,
      code: 200,
    },
  };

  // Add context if we have session information
  if (options?.sessionId || options?.relatedResults) {
    response.context = {
      sessionId: options?.sessionId,
      relatedResults: options?.relatedResults,
    };
  }

  // If we need to calculate execution time
  if (startTime) {
    response.metadata.executionTime = Date.now() - startTime;
  }

  // Validate the response structure
  try {
    ToolResponseSchema.parse(response);
  } catch (error) {
    console.error("Invalid response structure:", error);
    // Still return the response even if validation fails
  }

  return response;
}

/**
 * Creates a standardized error response
 *
 * This function creates an error response in the standardized format,
 * allowing tools to report errors in a consistent way. The response
 * includes an error message, status code, and optional error data.
 *
 * @param message - Error message describing what went wrong
 * @param tool - The name of the tool generating the error
 * @param options - Additional options for customizing the error response
 * @param options.code - HTTP-like status code (defaults to 400)
 * @param options.data - Optional data to include with the error
 * @param options.version - Tool version (defaults to '1.0.0')
 * @param options.sessionId - Session identifier for chaining operations
 * @param options.executionTime - Execution time in milliseconds (calculated if not provided)
 * @returns A standardized error response object
 *
 * @example
 * ```typescript
 * // Simple error response
 * const error = createErrorResponse(
 *   'Repository not found',
 *   'analyze-repository'
 * );
 *
 * // Error with additional details
 * const detailedError = createErrorResponse(
 *   'Invalid parameter format',
 *   'calculate-metrics',
 *   {
 *     code: 422,
 *     data: { invalidParams: ['depth'] },
 *     sessionId: 'abc123'
 *   }
 * );
 * ```
 */
export function createErrorResponse<T = null>(
  message: string,
  tool: string,
  options?: {
    code?: number;
    data?: T;
    version?: string;
    sessionId?: string;
    executionTime?: number;
  }
): ToolResponse<T | null> {
  const startTime =
    options?.executionTime !== undefined
      ? Date.now() - options.executionTime
      : undefined;

  const response: ToolResponse<T | null> = {
    data: options?.data || null,
    metadata: {
      tool,
      version: options?.version || "1.0.0",
      executionTime: options?.executionTime || 0,
      timestamp: new Date().toISOString(),
    },
    status: {
      success: false,
      code: options?.code || 400,
      message,
    },
  };

  // Add context if we have session information
  if (options?.sessionId) {
    response.context = {
      sessionId: options?.sessionId,
    };
  }

  // If we need to calculate execution time
  if (startTime) {
    response.metadata.executionTime = Date.now() - startTime;
  }

  // Validate the response structure
  try {
    ToolResponseSchema.parse(response);
  } catch (error) {
    console.error("Invalid error response structure:", error);
    // Still return the response even if validation fails
  }

  return response;
}

/**
 * Helper to time the execution of a function and include it in the response
 *
 * This utility wraps an asynchronous function execution, times how long it
 * takes to complete, and includes that timing information in the response.
 * It also handles errors by converting them to standardized error responses.
 *
 * @param tool - Name of the tool being executed
 * @param fn - The async function to execute and time
 * @param options - Additional options for the response
 * @param options.version - Tool version (defaults to '1.0.0')
 * @param options.sessionId - Session identifier for chaining operations
 * @param options.relatedResults - Array of related result IDs
 * @returns A promise that resolves to a standardized tool response
 *
 * @example
 * ```typescript
 * // Basic usage
 * const response = await executeWithTiming(
 *   'analyze-code',
 *   async () => {
 *     // Perform analysis...
 *     return { complexity: 15, functions: 5 };
 *   }
 * );
 *
 * // With additional options
 * const response = await executeWithTiming(
 *   'analyze-repository',
 *   async () => {
 *     const result = await expensiveAnalysis();
 *     return result;
 *   },
 *   {
 *     sessionId: 'user-session-123',
 *     version: '2.1.0'
 *   }
 * );
 * ```
 */
export async function executeWithTiming<T>(
  tool: string,
  fn: () => Promise<T>,
  options?: {
    version?: string;
    sessionId?: string;
    relatedResults?: string[];
  }
): Promise<ToolResponse<T>> {
  const startTime = Date.now();

  try {
    const data = await fn();
    return createSuccessResponse(data, tool, {
      ...options,
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    return createErrorResponse(
      error instanceof Error ? error.message : String(error),
      tool,
      {
        ...options,
        executionTime: Date.now() - startTime,
        code: 500,
      }
    );
  }
}

/**
 * Validate that a response conforms to the standard format
 *
 * This function checks if a response object matches the expected
 * ToolResponseSchema structure. It throws an error if the response
 * is invalid, which can be useful for debugging.
 *
 * @param response - The response object to validate
 * @returns true if valid, throws an error if invalid
 *
 * @example
 * ```typescript
 * try {
 *   validateResponse(myResponse);
 *   console.log('Response is valid');
 * } catch (error) {
 *   console.error('Invalid response:', error);
 * }
 * ```
 */
export function validateResponse<T>(response: ToolResponse<T>): boolean {
  ToolResponseSchema.parse(response);
  return true;
}

/**
 * Extract just the data portion from a tool response
 *
 * This utility extracts the data field from a standard tool response,
 * which can be useful when you want to work with just the payload.
 *
 * @param response - The full tool response
 * @returns Just the data portion
 *
 * @example
 * ```typescript
 * const response = createSuccessResponse({ count: 42 }, 'count-things');
 * const data = extractResponseData(response);
 * console.log(data.count); // Outputs: 42
 * ```
 */
export function extractResponseData<T>(response: ToolResponse<T>): T {
  return response.data;
}

/**
 * Combine multiple related tool responses into a single response
 *
 * This utility takes an array of tool responses and combines them into
 * a single response. It merges metadata like execution time and related
 * results, and can optionally transform the combined data with a custom
 * function.
 *
 * @param responses - Array of tool responses to combine
 * @param tool - Name of the composite tool
 * @param options - Additional options for the combined response
 * @param options.version - Tool version (defaults to '1.0.0')
 * @param options.sessionId - Session identifier for chaining operations
 * @param options.transform - Optional function to transform the combined data
 * @returns A combined tool response
 *
 * @example
 * ```typescript
 * // Combine responses with default array output
 * const combinedResponse = combineResponses(
 *   [codeResponse, dependencyResponse, metricsResponse],
 *   'full-analysis'
 * );
 *
 * // Combine with custom transformation
 * const customResponse = combineResponses(
 *   [codeResponse, dependencyResponse],
 *   'composite-analysis',
 *   {
 *     transform: (data) => ({
 *       summary: {
 *         files: data[0].fileCount,
 *         dependencies: data[1].dependencyCount,
 *         score: calculateScore(data[0], data[1])
 *       }
 *     })
 *   }
 * );
 * ```
 */
export function combineResponses<T>(
  responses: ToolResponse<any>[],
  tool: string,
  options?: {
    version?: string;
    sessionId?: string;
    transform?: (data: any[]) => T;
  }
): ToolResponse<T> {
  // Extract the individual data pieces
  const dataItems = responses.map((r) => r.data);

  // Apply transform function if provided, otherwise use array as is
  const combinedData = options?.transform
    ? options.transform(dataItems)
    : (dataItems as unknown as T);

  // Collect all the related results
  const relatedResults: string[] = [];
  responses.forEach((r) => {
    if (r.context?.relatedResults) {
      relatedResults.push(...r.context.relatedResults);
    }
  });

  // Calculate total execution time
  const totalExecutionTime = responses.reduce(
    (sum, r) => sum + r.metadata.executionTime,
    0
  );

  return createSuccessResponse(combinedData, tool, {
    version: options?.version || "1.0.0",
    sessionId: options?.sessionId || responses[0]?.context?.sessionId,
    relatedResults: relatedResults.length > 0 ? relatedResults : undefined,
    executionTime: totalExecutionTime,
  });
}
