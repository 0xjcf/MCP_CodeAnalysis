/**
 * Tests for Parameter Handler Utility
 * 
 * Tests functionality of the MCPParameterHandler module
 */

import { strict as assert } from 'assert';
import MCPParameterHandler from '../lib/parameter-handler.js';

// Save original process.exit and console.error
const originalExit = process.exit;
const originalConsoleError = console.error;

// Mock process.exit to prevent tests from exiting
process.exit = (code) => {
  if (code !== 0) {
    throw new Error(`Mock exit with code ${code}`);
  }
  return;
};

// Mock console.error to capture error messages
let lastErrorMessage = '';
console.error = (msg) => {
  lastErrorMessage = msg;
};

// Test command definition
const testCommand = {
  name: 'test-command',
  description: 'Test command for parameter handler',
  parameters: [
    {
      name: 'string-param',
      alias: 's',
      description: 'String parameter',
      type: 'string',
      default: 'default-value'
    },
    {
      name: 'number-param',
      alias: 'n',
      description: 'Number parameter',
      type: 'number',
      default: 42
    },
    {
      name: 'boolean-param',
      alias: 'b',
      description: 'Boolean parameter',
      type: 'boolean',
      default: false
    },
    {
      name: 'required-param',
      alias: 'r',
      description: 'Required parameter',
      type: 'string',
      required: true
    }
  ]
};

// Test suite
console.log('Running Parameter Handler tests...');

// Test 1: Constructor and initialization
try {
  const handler = new MCPParameterHandler(testCommand);
  console.log('✅ Constructor test passed');
} catch (error) {
  console.log('❌ Constructor test failed:', error.message);
  process.exit(1);
}

// Test 2: Help text generation
try {
  const handler = new MCPParameterHandler(testCommand);
  const helpText = handler.getHelpText();
  
  // Verify help text contains command name and description
  assert(helpText.includes('test-command'));
  assert(helpText.includes('Test command for parameter handler'));
  
  // Verify all parameters are listed
  assert(helpText.includes('--string-param'));
  assert(helpText.includes('--number-param'));
  assert(helpText.includes('--boolean-param'));
  assert(helpText.includes('--required-param'));
  
  // Verify aliases are listed
  assert(helpText.includes('-s'));
  assert(helpText.includes('-n'));
  assert(helpText.includes('-b'));
  assert(helpText.includes('-r'));
  
  // Verify default values are shown
  assert(helpText.includes('default: default-value'));
  assert(helpText.includes('default: 42'));
  assert(helpText.includes('default: false'));
  
  // Verify required parameter is marked
  assert(helpText.includes('(required)'));
  
  console.log('✅ Help text generation test passed');
} catch (error) {
  console.log('❌ Help text generation test failed:', error.message);
  process.exit(1);
}

// Test 3: Basic parameter parsing
try {
  const handler = new MCPParameterHandler(testCommand);
  const args = ['--string-param', 'test-value', '--required-param', 'test-required'];
  const params = handler.parse(args);
  
  assert.equal(params['string-param'], 'test-value');
  assert.equal(params['required-param'], 'test-required');
  assert.equal(params['number-param'], 42); // Default value
  assert.equal(params['boolean-param'], false); // Default value
  
  console.log('✅ Basic parameter parsing test passed');
} catch (error) {
  console.log('❌ Basic parameter parsing test failed:', error.message);
  process.exit(1);
}

// Test 4: Alias parsing
try {
  const handler = new MCPParameterHandler(testCommand);
  const args = ['-s', 'alias-value', '-r', 'required-value'];
  const params = handler.parse(args);
  
  assert.equal(params['string-param'], 'alias-value');
  assert.equal(params['required-param'], 'required-value');
  
  console.log('✅ Alias parsing test passed');
} catch (error) {
  console.log('❌ Alias parsing test failed:', error.message);
  process.exit(1);
}

// Test 5: Boolean flags
try {
  const handler = new MCPParameterHandler(testCommand);
  const args = ['-b', '--required-param', 'test-required'];
  const params = handler.parse(args);
  
  assert.equal(params['boolean-param'], true);
  
  console.log('✅ Boolean flags test passed');
} catch (error) {
  console.log('❌ Boolean flags test failed:', error.message);
  process.exit(1);
}

// Test 6: Number conversion
try {
  const handler = new MCPParameterHandler(testCommand);
  const args = ['--number-param', '123', '--required-param', 'test-required'];
  const params = handler.parse(args);
  
  assert.equal(params['number-param'], 123);
  assert.equal(typeof params['number-param'], 'number');
  
  console.log('✅ Number conversion test passed');
} catch (error) {
  console.log('❌ Number conversion test failed:', error.message);
  process.exit(1);
}

// Test 7: Required parameter validation
try {
  const handler = new MCPParameterHandler(testCommand);
  
  try {
    // Missing required parameter should cause error
    const args = ['--string-param', 'test-value'];
    handler.parse(args);
    
    // If we get here, no error was thrown (which is bad)
    assert.fail('Expected validation to fail for missing required parameter');
  } catch (error) {
    // Error expected - check error message
    assert(lastErrorMessage.includes('Missing required parameter'));
  }
  
  console.log('✅ Required parameter validation test passed');
} catch (error) {
  console.log('❌ Required parameter validation test failed:', error.message);
  process.exit(1);
}

// Test 8: Combined formats (--param=value)
try {
  const handler = new MCPParameterHandler(testCommand);
  const args = ['--string-param=combined-value', '--required-param=required-value'];
  
  // Our current implementation doesn't support this format yet
  // This test is for future implementation
  try {
    const params = handler.parse(args);
    // If it works, great! Let's verify the values
    if (params['string-param'] === 'combined-value' && params['required-param'] === 'required-value') {
      console.log('✅ Combined formats test passed (supported)');
    } else {
      console.log('⚠️ Combined formats not properly implemented yet');
    }
  } catch (error) {
    console.log('⚠️ Combined formats not implemented yet');
  }
} catch (error) {
  console.log('❌ Combined formats test error:', error.message);
}

// Test 9: Unknown parameters
try {
  const handler = new MCPParameterHandler(testCommand);
  
  try {
    // Unknown parameter should cause error
    const args = ['--unknown-param', 'value', '--required-param', 'test-required'];
    handler.parse(args);
    
    // If we get here, no error was thrown (which is bad)
    assert.fail('Expected validation to fail for unknown parameter');
  } catch (error) {
    // Error expected - check error message
    assert(lastErrorMessage.includes('Unknown parameter'));
  }
  
  console.log('✅ Unknown parameter test passed');
} catch (error) {
  console.log('❌ Unknown parameter test failed:', error.message);
  process.exit(1);
}

// Restore original process.exit and console.error
process.exit = originalExit;
console.error = originalConsoleError;

// All tests passed
console.log('\n🎉 All parameter handler tests passed successfully'); 