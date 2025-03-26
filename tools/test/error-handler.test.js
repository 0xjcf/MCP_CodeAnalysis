/**
 * Test suite for the MCP Error Handler module
 */

import assert from 'assert';
import {
  ErrorType,
  ErrorSeverity,
  MCPError,
  createConnectionError,
  createTimeoutError,
  createToolNotFoundError,
  createParameterError,
  createParsingError,
  retry,
  handleError
} from '../lib/error-handler.js';

// Test suite message
console.log('MCP Error Handler Test Suite');

let passed = 0;
let failed = 0;

// Helper to track test results
function runTest(name, testFn) {
  try {
    testFn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
    failed++;
  }
}

// Mock console for testing
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
let errorLogs = [];
let warnLogs = [];

function setupMocks() {
  errorLogs = [];
  warnLogs = [];
  console.error = (message) => errorLogs.push(message);
  console.warn = (message) => warnLogs.push(message);
}

function restoreConsole() {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
}

//----------------------------------------------------------------------
// Test MCPError class
//----------------------------------------------------------------------
console.log('\n1. Testing MCPError class');

runTest('MCPError constructor with minimal args', () => {
  const error = new MCPError('Test error message', ErrorType.UNKNOWN);
  assert.strictEqual(error.message, 'Test error message');
  assert.strictEqual(error.type, ErrorType.UNKNOWN);
  assert.strictEqual(error.severity, ErrorSeverity.ERROR);
  assert.strictEqual(error.retryable, false);
  assert.strictEqual(error.code, 500);
  assert.deepStrictEqual(error.details, {});
  assert.strictEqual(error.suggestion, undefined);
});

runTest('MCPError constructor with all options', () => {
  const options = {
    severity: ErrorSeverity.FATAL,
    retryable: true,
    code: 404,
    details: { id: 123 },
    suggestion: 'Try again'
  };
  
  const error = new MCPError('Full error message', ErrorType.CONNECTION_FAILED, options);
  assert.strictEqual(error.message, 'Full error message');
  assert.strictEqual(error.type, ErrorType.CONNECTION_FAILED);
  assert.strictEqual(error.severity, ErrorSeverity.FATAL);
  assert.strictEqual(error.retryable, true);
  assert.strictEqual(error.code, 404);
  assert.deepStrictEqual(error.details, { id: 123 });
  assert.strictEqual(error.suggestion, 'Try again');
});

runTest('MCPError toJSON method', () => {
  const error = new MCPError('JSON test', ErrorType.INVALID_PARAMETERS, {
    suggestion: 'Fix params'
  });
  
  const json = error.toJSON();
  assert.strictEqual(json.name, 'MCPError');
  assert.strictEqual(json.message, 'JSON test');
  assert.strictEqual(json.type, ErrorType.INVALID_PARAMETERS);
  assert.strictEqual(json.suggestion, 'Fix params');
});

runTest('MCPError format method', () => {
  const error = new MCPError('Format test', ErrorType.TIMEOUT, {
    severity: ErrorSeverity.WARNING,
    suggestion: 'Increase timeout',
    details: { timeout: 1000 }
  });
  
  const formatted = error.format();
  assert.ok(formatted.includes('[WARNING]'));
  assert.ok(formatted.includes('Format test'));
  assert.ok(formatted.includes('timeout'));
  assert.ok(formatted.includes('Suggestion: Increase timeout'));
  assert.ok(formatted.includes('"timeout": 1000'));
});

//----------------------------------------------------------------------
// Test factory functions
//----------------------------------------------------------------------
console.log('\n2. Testing error factory functions');

runTest('createConnectionError', () => {
  const error = createConnectionError('Connection failed to localhost');
  assert.strictEqual(error.type, ErrorType.CONNECTION_FAILED);
  assert.strictEqual(error.message, 'Connection failed to localhost');
  assert.strictEqual(error.severity, ErrorSeverity.ERROR);
  assert.strictEqual(error.retryable, true);
  assert.strictEqual(error.code, 503);
  assert.ok(error.suggestion.includes('server status'));
});

runTest('createTimeoutError', () => {
  const error = createTimeoutError();
  assert.strictEqual(error.type, ErrorType.TIMEOUT);
  assert.strictEqual(error.message, 'Operation timed out');
  assert.strictEqual(error.retryable, true);
  assert.strictEqual(error.code, 408);
});

runTest('createToolNotFoundError', () => {
  const error = createToolNotFoundError('test-tool');
  assert.strictEqual(error.type, ErrorType.TOOL_NOT_FOUND);
  assert.ok(error.message.includes('test-tool'));
  assert.strictEqual(error.retryable, false);
  assert.strictEqual(error.code, 404);
});

runTest('createParameterError', () => {
  const error = createParameterError('Invalid parameter: port');
  assert.strictEqual(error.type, ErrorType.INVALID_PARAMETERS);
  assert.strictEqual(error.message, 'Invalid parameter: port');
  assert.strictEqual(error.retryable, false);
  assert.strictEqual(error.code, 400);
});

runTest('createParsingError', () => {
  const error = createParsingError('Failed to parse JSON');
  assert.strictEqual(error.type, ErrorType.PARSING_ERROR);
  assert.strictEqual(error.message, 'Failed to parse JSON');
  assert.strictEqual(error.retryable, false);
  assert.strictEqual(error.code, 500);
});

//----------------------------------------------------------------------
// Test handleError function
//----------------------------------------------------------------------
console.log('\n3. Testing handleError function');

runTest('handleError with MCPError', () => {
  setupMocks();
  const mcpError = new MCPError('Test MCPError', ErrorType.TIMEOUT);
  const result = handleError(mcpError);
  
  assert.strictEqual(result.type, ErrorType.TIMEOUT);
  assert.strictEqual(result.message, 'Test MCPError');
  assert.strictEqual(errorLogs.length, 1);
  assert.ok(errorLogs[0].includes('Test MCPError'));
  restoreConsole();
});

runTest('handleError with standard Error', () => {
  setupMocks();
  const stdError = new Error('Standard error');
  const result = handleError(stdError);
  
  assert.strictEqual(result.type, ErrorType.UNKNOWN);
  assert.strictEqual(result.message, 'Standard error');
  assert.strictEqual(errorLogs.length, 1);
  assert.ok(errorLogs[0].includes('Standard error'));
  restoreConsole();
});

runTest('handleError with custom logger', () => {
  setupMocks();
  let customLoggerCalled = false;
  const customLogger = (message) => {
    customLoggerCalled = true;
    assert.ok(message.includes('Custom error'));
  };
  
  handleError(new Error('Custom error'), { logger: customLogger });
  assert.strictEqual(customLoggerCalled, true);
  assert.strictEqual(errorLogs.length, 0);
  restoreConsole();
});

//----------------------------------------------------------------------
// Test retry mechanism
//----------------------------------------------------------------------
console.log('\n4. Testing retry mechanism (async tests)');

// For async tests, we need to make them awaitable
async function runAsyncTests() {
  try {
    // Test successful operation
    await runTest('retry with successful operation', async () => {
      let counter = 0;
      const result = await retry(async () => {
        counter++;
        return 'success';
      });
      
      assert.strictEqual(result, 'success');
      assert.strictEqual(counter, 1);
    });
    
    // Test retryable error case
    await runTest('retry with retryable error', async () => {
      setupMocks();
      let counter = 0;
      const result = await retry(
        async () => {
          counter++;
          if (counter < 3) {
            throw createTimeoutError('Test timeout');
          }
          return 'success after retry';
        },
        { maxRetries: 3, initialDelay: 10 }
      );
      
      assert.strictEqual(result, 'success after retry');
      assert.strictEqual(counter, 3);
      assert.ok(counter > 1, 'Should have attempted retries');
      restoreConsole();
    });
    
    // Test max retries exceeded
    await runTest('retry with max retries exceeded', async () => {
      setupMocks();
      let counter = 0;
      
      try {
        await retry(
          async () => {
            counter++;
            throw createTimeoutError('Test timeout exceeded');
          },
          { maxRetries: 2, initialDelay: 10 }
        );
        
        // Should not reach here
        throw new Error('Should have thrown after max retries');
      } catch (error) {
        assert.strictEqual(error.type, ErrorType.TIMEOUT);
        assert.ok(counter > 0, 'Should have attempted at least once');
        assert.ok(counter > 1, 'Should have attempted retries');
      }
      
      restoreConsole();
    });
    
    // Test non-retryable error
    await runTest('retry with non-retryable error', async () => {
      setupMocks();
      let counter = 0;
      
      try {
        await retry(
          async () => {
            counter++;
            throw createParameterError('Invalid parameter');
          },
          { maxRetries: 3, initialDelay: 10 }
        );
        
        // Should not reach here
        throw new Error('Should have thrown on non-retryable error');
      } catch (error) {
        assert.strictEqual(error.type, ErrorType.INVALID_PARAMETERS);
        assert.strictEqual(counter, 1, 'Should only attempt once for non-retryable error');
        assert.strictEqual(warnLogs.length, 0, 'No retry attempts should be made');
      }
      
      restoreConsole();
    });
    
  } catch (error) {
    console.error('Async test error:', error);
    failed++;
  }
}

// Run async tests
await runAsyncTests();

// Report test results
console.log(`\nTest Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}

// Add to package.json scripts later:
// "test:error-handler": "node tools/test/error-handler.test.js" 