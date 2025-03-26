# Client Parameter Handling Specification

## Overview

This document outlines the standardized approach for parameter handling across all MCP clients.
Consistent parameter handling will improve reliability, user experience, and maintainability.

## Goals

- Create a unified parameter handling mechanism across all clients
- Support command-line arguments, configuration files, and environment variables
- Provide clear validation and helpful error messages
- Enable parameter documentation generation

## Core Requirements

### 1. Parameter Definition Interface

```typescript
interface ParameterDefinition {
  name: string; // Parameter name (e.g., 'server')
  alias?: string; // Short form alias (e.g., 's')
  description: string; // Human-readable description
  type: "string" | "number" | "boolean" | "array"; // Parameter data type
  default?: any; // Default value if not provided
  required?: boolean; // Whether parameter is required
  choices?: any[]; // Allowed values (for validation)
  group?: string; // Grouping for related parameters
  hidden?: boolean; // Hide from help output
  validator?: (val: any) => boolean | string; // Custom validation function
}
```

### 2. Command Definition Interface

```typescript
interface CommandDefinition {
  name: string; // Command name
  description: string; // Human-readable description
  parameters: ParameterDefinition[]; // Parameters for this command
  subcommands?: CommandDefinition[]; // Nested commands (if applicable)
  handler?: (params: Record<string, any>) => Promise<any>; // Command implementation
}
```

### 3. Core Features

- Parameter parsing from command line arguments
- Loading from configuration files (.mcprc, JSON, etc.)
- Environment variable support (MCP\_\*)
- Type coercion and validation
- Automatic help generation
- Error reporting with suggestions
- Default value application

## Implementation Plan

### Phase 1: Core Parser

1. Create base parameter parsing utility
2. Implement command-line argument handling
3. Add basic validation and error reporting
4. Write tests for core functionality

### Phase 2: Extended Features

1. Add configuration file support
2. Implement environment variable handling
3. Enhance validation and error messages
4. Create automatic help generation

### Phase 3: Client Integration

1. Update simple-client.js to use the new parameter system
2. Integrate with mcp-raw-client.js
3. Retrofit existing working clients
4. Add to documentation

## Usage Example

```javascript
// Define command with parameters
const analyzeCommand = {
  name: "analyze",
  description: "Analyze code quality",
  parameters: [
    {
      name: "server",
      alias: "s",
      description: "MCP server URL",
      type: "string",
      default: "http://localhost:3000",
      required: false,
    },
    {
      name: "path",
      alias: "p",
      description: "Path to analyze",
      type: "string",
      required: true,
    },
    {
      name: "verbose",
      alias: "v",
      description: "Enable verbose output",
      type: "boolean",
      default: false,
    },
  ],
  handler: async (params) => {
    // Implementation using params.server, params.path, etc.
  },
};

// Initialize parameter handler with command definition
const paramHandler = new MCPParameterHandler(analyzeCommand);

// Parse parameters from command line
const params = paramHandler.parse(process.argv.slice(2));

// Execute command with parsed parameters
analyzeCommand.handler(params);
```

## Error Handling

The parameter handling utility should provide clear, actionable error messages:

```
Error: Missing required parameter: path
Usage: mcp-client analyze --path <string> [options]

Options:
  -s, --server  MCP server URL (default: http://localhost:3000)
  -p, --path    Path to analyze (required)
  -v, --verbose Enable verbose output (default: false)
  -h, --help    Show help
```

## Integration Requirements

- Must be compatible with Node.js 14+
- Should be importable as CommonJS and ESM
- Zero or minimal dependencies
- Support for TypeScript type definitions
- Comprehensive test coverage

## Next Steps

1. Create base parameter handling utility class
2. Implement core parsing functionality
3. Add validation and error reporting
4. Update simple-client.js as first integration target
