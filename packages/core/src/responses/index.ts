/**
 * Response utilities for MCP Code Analysis system.
 * This file contains functions for creating standardized API responses.
 */

/**
 * Type definition for metadata in responses
 */
export interface IResponseMetadata {
  source?: string;
  [key: string]: unknown;
}

/**
 * Type definition for error details
 */
export interface IErrorDetails {
  [key: string]: unknown;
}

/**
 * Type definition for success response
 */
export interface ISuccessResponse<T> {
  status: { success: true; message?: string };
  data: T;
  metadata?: IResponseMetadata;
}

/**
 * Type definition for error response
 */
export interface IErrorResponse {
  status: { success: false; message: string };
  error: { message: string; code: string; details?: IErrorDetails };
}

/**
 * Type definition for partial response
 */
export interface IPartialResponse<T> {
  status: { success: true; partial: true; message?: string };
  data: T;
  progress: { percentage?: number; message?: string };
}

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
  metadata?: IResponseMetadata,
): ISuccessResponse<T> {
  const responseMetadata: IResponseMetadata = {};
  if (source) responseMetadata.source = source;
  if (metadata) Object.assign(responseMetadata, metadata);

  return {
    status: {
      success: true,
      message: 'Operation completed successfully',
    },
    data,
    metadata: Object.keys(responseMetadata).length > 0 ? responseMetadata : undefined,
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
  details?: IErrorDetails,
): IErrorResponse {
  return {
    status: {
      success: false,
      message,
    },
    error: {
      message,
      code,
      ...(details ? { details } : {}),
    },
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
  progressMessage?: string,
): IPartialResponse<T> {
  return {
    status: {
      success: true,
      partial: true,
      message: progressMessage || 'Operation in progress',
    },
    data,
    progress: {
      ...(percentage !== undefined ? { percentage } : {}),
      ...(progressMessage ? { message: progressMessage } : {}),
    },
  };
}
