/**
 * MCP Error Handler
 * 
 * Standardized error handling for MCP client tools.
 * Provides consistent error types, formatting, and recovery mechanisms.
 */

/**
 * Standard error types for MCP client tools
 * @enum {string}
 */
export const ErrorType = {
  // Connection Errors
  CONNECTION_FAILED: 'connection_failed',
  TIMEOUT: 'timeout',
  SERVER_UNAVAILABLE: 'server_unavailable',
  
  // Tool Errors
  TOOL_NOT_FOUND: 'tool_not_found',
  TOOL_EXECUTION_FAILED: 'tool_execution_failed',
  
  // Parameter Errors
  INVALID_PARAMETERS: 'invalid_parameters',
  MISSING_REQUIRED_PARAMETER: 'missing_required_parameter',
  
  // Data Errors
  INVALID_RESPONSE: 'invalid_response',
  PARSING_ERROR: 'parsing_error',
  
  // File System Errors
  FILE_NOT_FOUND: 'file_not_found',
  PERMISSION_DENIED: 'permission_denied',
  
  // Session Errors
  SESSION_EXPIRED: 'session_expired',
  SESSION_CREATION_FAILED: 'session_creation_failed',
  
  // Generic Errors
  UNKNOWN: 'unknown_error',
  INTERNAL: 'internal_error'
};

/**
 * Severity levels for errors
 * @enum {string}
 */
export const ErrorSeverity = {
  FATAL: 'fatal',     // Application cannot continue
  ERROR: 'error',     // Operation failed but application can continue
  WARNING: 'warning', // Operation succeeded with issues
  INFO: 'info'        // Informational message
};

/**
 * Standard MCP Error class
 */
export class MCPError extends Error {
  /**
   * Create a new MCP Error
   * @param {string} message - Human-readable error message
   * @param {string} type - Error type from ErrorType enum
   * @param {Object} options - Additional error options
   * @param {string} [options.severity=ErrorSeverity.ERROR] - Error severity
   * @param {boolean} [options.retryable=false] - Whether the operation can be retried
   * @param {number} [options.code=500] - Error code
   * @param {Object} [options.details={}] - Additional error details
   * @param {string} [options.suggestion] - Suggested solution for the error
   */
  constructor(message, type, options = {}) {
    super(message);
    this.name = 'MCPError';
    this.type = type || ErrorType.UNKNOWN;
    this.severity = options.severity || ErrorSeverity.ERROR;
    this.retryable = options.retryable || false;
    this.code = options.code || 500;
    this.details = options.details || {};
    this.suggestion = options.suggestion;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MCPError);
    }
  }

  /**
   * Convert error to a plain object for logging or serialization
   * @returns {Object} Plain object representation of the error
   */
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      severity: this.severity,
      retryable: this.retryable,
      code: this.code,
      details: this.details,
      suggestion: this.suggestion,
      timestamp: this.timestamp
    };
  }

  /**
   * Format the error for display
   * @returns {string} Formatted error message
   */
  format() {
    let output = `[${this.severity.toUpperCase()}] ${this.message} (${this.type})`;
    
    if (this.suggestion) {
      output += `\nSuggestion: ${this.suggestion}`;
    }
    
    if (Object.keys(this.details).length > 0) {
      output += `\nDetails: ${JSON.stringify(this.details, null, 2)}`;
    }
    
    return output;
  }
}

/**
 * Error factory functions for common error types
 */
export const createConnectionError = (message, details = {}, retryable = true) => {
  return new MCPError(message, ErrorType.CONNECTION_FAILED, {
    severity: ErrorSeverity.ERROR,
    retryable,
    code: 503,
    details,
    suggestion: 'Check server status and network connectivity'
  });
};

export const createTimeoutError = (message, details = {}) => {
  return new MCPError(message || 'Operation timed out', ErrorType.TIMEOUT, {
    severity: ErrorSeverity.ERROR,
    retryable: true,
    code: 408,
    details,
    suggestion: 'Try again with a longer timeout or when server load is lower'
  });
};

export const createToolNotFoundError = (toolName, details = {}) => {
  return new MCPError(`Tool '${toolName}' not found`, ErrorType.TOOL_NOT_FOUND, {
    severity: ErrorSeverity.ERROR,
    retryable: false,
    code: 404,
    details,
    suggestion: 'Check the tool name and ensure the tool is registered on the server'
  });
};

export const createParameterError = (message, details = {}) => {
  return new MCPError(message, ErrorType.INVALID_PARAMETERS, {
    severity: ErrorSeverity.ERROR,
    retryable: false,
    code: 400,
    details,
    suggestion: 'Check the parameter values and try again'
  });
};

export const createParsingError = (message, details = {}) => {
  return new MCPError(message || 'Failed to parse response', ErrorType.PARSING_ERROR, {
    severity: ErrorSeverity.ERROR,
    retryable: false,
    code: 500,
    details,
    suggestion: 'Check that the response format matches the expected schema'
  });
};

/**
 * Retry mechanism for retryable errors
 * @param {Function} operation - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} [options.maxRetries=3] - Maximum number of retry attempts
 * @param {number} [options.initialDelay=1000] - Initial delay in milliseconds
 * @param {number} [options.maxDelay=30000] - Maximum delay in milliseconds
 * @param {Function} [options.shouldRetry] - Function to determine if retry should be attempted
 * @returns {Promise<any>} Result of the operation
 */
export const retry = async (operation, options = {}) => {
  const maxRetries = options.maxRetries || 3;
  const initialDelay = options.initialDelay || 1000;
  const maxDelay = options.maxDelay || 30000;
  const shouldRetry = options.shouldRetry || ((error) => error.retryable === true);
  
  let lastError;
  let attempt = 0;
  
  while (attempt <= maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      attempt += 1;
      
      // Check if we should retry
      if (attempt > maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      // Calculate backoff delay with exponential backoff and jitter
      const delay = Math.min(
        initialDelay * Math.pow(2, attempt - 1) * (0.5 + Math.random()),
        maxDelay
      );
      
      // Log retry attempt
      console.warn(`Retry attempt ${attempt}/${maxRetries} after ${Math.round(delay)}ms: ${error.message}`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // This should never happen, but just in case
  throw lastError;
};

/**
 * Handle errors consistently
 * @param {Error} error - Error to handle
 * @param {Object} options - Handling options
 * @param {boolean} [options.exitOnFatal=true] - Whether to exit process on fatal errors
 * @param {Function} [options.logger=console.error] - Logging function
 * @returns {Object} Standardized error object
 */
export const handleError = (error, options = {}) => {
  const exitOnFatal = options.exitOnFatal !== false;
  const logger = options.logger || console.error;
  
  // Convert to MCPError if it's not already
  const mcpError = error instanceof MCPError 
    ? error 
    : new MCPError(error.message || 'Unknown error occurred', ErrorType.UNKNOWN, {
        severity: ErrorSeverity.ERROR,
        retryable: false,
        code: 500,
        details: { originalError: error.toString() }
      });
  
  // Log the error
  logger(mcpError.format());
  
  // Exit on fatal errors if configured to do so
  if (exitOnFatal && mcpError.severity === ErrorSeverity.FATAL) {
    process.exit(1);
  }
  
  return mcpError.toJSON();
}; 