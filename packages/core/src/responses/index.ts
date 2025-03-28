/**
 * Response utilities for MCP Code Analysis system.
 * This file contains functions for creating standardized API responses.
 */

/**
 * Creates a standardized success response
 * @param data The data to include in the response
 * @param source The source identifier (optional)
 * @param metadata Additional metadata (optional)
 * @returns A standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  source?: string,
  metadata?: Record<string, any>
): {
  status: { success: true; message?: string };
  data: T;
  metadata?: Record<string, any>;
} {
  return {
    status: {
      success: true,
      message: 'Operation completed successfully'
    },
    data,
    ...(metadata ? { metadata: { source, ...metadata } } : { metadata: { source } })
  };
}

/**
 * Creates a standardized error response
 * @param message The error message
 * @param code The error code or source
 * @param details Additional error details (optional)
 * @returns A standardized error response
 */
export function createErrorResponse(
  message: string,
  code: string,
  details?: any
): {
  status: { success: false; message: string };
  error: { message: string; code: string; details?: any };
} {
  return {
    status: {
      success: false,
      message
    },
    error: {
      message,
      code,
      ...(details !== undefined ? { details } : {})
    }
  };
}

/**
 * Creates a standardized partial response for operations in progress
 * @param data The partial data to include
 * @param percentage Completion percentage (0-100)
 * @param progressMessage Progress status message
 * @returns A standardized partial response
 */
export function createPartialResponse<T>(
  data: T,
  percentage?: number,
  progressMessage?: string
): {
  status: { success: true; partial: true; message?: string };
  data: T;
  progress: { percentage?: number; message?: string };
} {
  return {
    status: {
      success: true,
      partial: true,
      message: progressMessage || 'Operation in progress'
    },
    data,
    progress: {
      percentage,
      message: progressMessage
    }
  };
} 