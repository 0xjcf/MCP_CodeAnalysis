# MCP Error Handler

A standardized error handling utility for MCP client tools that provides consistent error types, formatting, and recovery mechanisms. This implementation is now complete and fully integrated into all MCP client tools.

## Status: ✅ COMPLETED

The error handling system has been fully implemented and integrated into all major components:

- Integrated with `http-client.js` for API communication
- Integrated with `ai-analyzer.js` for analysis operations
- Integrated with parameter handling in all client tools
- Provides standardized error recovery mechanisms

## Features

- **Standard Error Types**: Predefined error types for common failure scenarios
- **Consistent Error Format**: Standardized error objects with helpful metadata
- **Factory Functions**: Helper functions for creating common error types
- **Retry Mechanism**: Built-in retry functionality with exponential backoff
- **Error Recovery**: Strategies for handling and recovering from errors
- **Actionable Messages**: Error messages with suggestions for resolution
- **Integration**: Full integration with all MCP client tools
- **Type Safety**: Complete TypeScript type definitions

## Installation

The error handler is included in the MCP codebase and can be imported directly:

```javascript
const errorHandler = require("./tools/lib/error-handler");
```

## Usage Examples

### Basic Error Handling

```javascript
const { handleError } = require("./tools/lib/error-handler");

try {
  // Your code that might throw an error
  makeApiCall();
} catch (error) {
  // Handle and format the error consistently
  const formattedError = handleError(error);
  console.log(`Operation failed: ${formattedError.message}`);
}
```

### Creating Typed Errors

```javascript
const {
  createConnectionError,
  createTimeoutError,
  createParameterError,
} = require("./tools/lib/error-handler");

// Connection error
if (!isServerConnected) {
  throw createConnectionError("Failed to connect to MCP server", {
    url: serverUrl,
  });
}

// Timeout error
if (isTimeout) {
  throw createTimeoutError("Request timed out after 30s");
}

// Parameter validation error
if (!isValidPort(port)) {
  throw createParameterError("Invalid port number", { port });
}
```

### Using the Retry Mechanism

```javascript
const { retry } = require("./tools/lib/error-handler");

const fetchData = async () => {
  // Operation that might fail temporarily
  return await fetch("https://api.example.com/data");
};

// Retry the operation with exponential backoff
retry(fetchData, {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
})
  .then((result) => console.log("Success:", result))
  .catch((error) => console.error("All retries failed:", error));
```

### Advanced Retry Configuration

```javascript
const { retry, ErrorType } = require("./tools/lib/error-handler");

// Custom retry condition
const shouldRetry = (error) => {
  // Only retry connection or timeout errors
  return (
    error.type === ErrorType.CONNECTION_FAILED ||
    error.type === ErrorType.TIMEOUT
  );
};

retry(makeApiCall, {
  maxRetries: 5,
  initialDelay: 500,
  maxDelay: 30000,
  shouldRetry,
});
```

## API Reference

### Error Types

```javascript
const { ErrorType } = require("./tools/lib/error-handler");

// Available error types
ErrorType.CONNECTION_FAILED; // Connection issues
ErrorType.TIMEOUT; // Operation timed out
ErrorType.SERVER_UNAVAILABLE; // Server is down or unreachable
ErrorType.TOOL_NOT_FOUND; // Requested tool does not exist
ErrorType.TOOL_EXECUTION_FAILED; // Tool execution error
ErrorType.INVALID_PARAMETERS; // Invalid input parameters
ErrorType.MISSING_REQUIRED_PARAMETER; // Required parameter missing
ErrorType.INVALID_RESPONSE; // Response format or validation error
ErrorType.PARSING_ERROR; // Data parsing error
ErrorType.FILE_NOT_FOUND; // File system error - file not found
ErrorType.PERMISSION_DENIED; // Access permission error
ErrorType.SESSION_EXPIRED; // Session has expired
ErrorType.SESSION_CREATION_FAILED; // Failed to create session
ErrorType.UNKNOWN; // Unclassified error
ErrorType.INTERNAL; // Internal system error
```

### Error Severity Levels

```javascript
const { ErrorSeverity } = require("./tools/lib/error-handler");

// Available severity levels
ErrorSeverity.FATAL; // Application cannot continue
ErrorSeverity.ERROR; // Operation failed but application can continue
ErrorSeverity.WARNING; // Operation succeeded with issues
ErrorSeverity.INFO; // Informational message
```

### MCPError Class

```javascript
const { MCPError } = require("./tools/lib/error-handler");

// Create a custom error
const error = new MCPError(
  "Custom error message",
  ErrorType.TOOL_EXECUTION_FAILED,
  {
    severity: ErrorSeverity.ERROR,
    retryable: true,
    code: 500,
    details: { toolName: "example-tool" },
    suggestion: "Check that the tool parameters are correct",
  }
);

// Format the error for display
console.error(error.format());

// Convert to plain object for logging
console.log(JSON.stringify(error.toJSON(), null, 2));
```

### Factory Functions

```javascript
const {
  createConnectionError,
  createTimeoutError,
  createToolNotFoundError,
  createParameterError,
  createParsingError,
} = require("./tools/lib/error-handler");

// Create common error types
const connError = createConnectionError("Failed to connect to server");
const timeoutError = createTimeoutError("Operation timed out after 5s");
const toolError = createToolNotFoundError("analyze-code");
const paramError = createParameterError("Invalid parameter: port");
const parseError = createParsingError("Failed to parse JSON response");
```

### Retry Function

```javascript
const { retry } = require("./tools/lib/error-handler");

/**
 * Retry an operation with exponential backoff
 * @param {Function} operation - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} [options.maxRetries=3] - Maximum retry attempts
 * @param {number} [options.initialDelay=1000] - Initial delay in ms
 * @param {number} [options.maxDelay=30000] - Maximum delay in ms
 * @param {Function} [options.shouldRetry] - Function to determine if retry should occur
 * @returns {Promise<any>} Result of the operation
 */
```

### Handle Error Function

```javascript
const { handleError } = require("./tools/lib/error-handler");

/**
 * Handle errors consistently
 * @param {Error} error - Error to handle
 * @param {Object} options - Handling options
 * @param {boolean} [options.exitOnFatal=true] - Exit process on fatal errors
 * @param {Function} [options.logger=console.error] - Logging function
 * @returns {Object} Standardized error object
 */
```

## Integration with MCP Clients

### Adding to HTTP Tool Discovery

```javascript
const {
  createConnectionError,
  handleError,
  retry,
} = require("./lib/error-handler");

// In a client connection function
async function connectToServer(url) {
  return retry(
    async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw createConnectionError(`Server returned ${response.status}`, {
            status: response.status,
            url,
          });
        }
        return await response.json();
      } catch (error) {
        throw createConnectionError(
          `Failed to connect to server: ${error.message}`,
          { url, originalError: error.message }
        );
      }
    },
    { maxRetries: 3, initialDelay: 1000 }
  );
}

// Later in your code
try {
  const serverInfo = await connectToServer("http://localhost:3000");
  console.log("Connected to server:", serverInfo.name);
} catch (error) {
  handleError(error);
  process.exit(1);
}
```

## Error Recovery Strategies

The error handler supports various recovery strategies:

1. **Automatic Retry**: For transient errors like network issues
2. **Graceful Degradation**: Continue with limited functionality when possible
3. **Fallback Options**: Try alternative approaches when primary method fails
4. **User Notification**: Provide actionable feedback for user-resolvable issues

## Best Practices

1. **Use Specific Error Types**: Always use the most specific error type for better error handling
2. **Include Context**: Add relevant details to error objects for debugging
3. **Provide Suggestions**: Include actionable suggestions in error messages
4. **Retry Selectively**: Only retry operations that might succeed on a subsequent attempt
5. **Handle Errors Locally**: Handle errors at the appropriate level in your application

## Testing

Run the error handler tests:

```bash
npm run test:error
```
