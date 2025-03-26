# Parameter Handler

The `parameter-handler.js` utility provides standardized parameter handling across all MCP client tools. It
supports command-line arguments with consistent formats, automatic help generation, and parameter validation.

## Features

- **Unified parameter format** across all MCP client scripts
- **Type conversion** for strings, numbers, and booleans
- **Default values** for optional parameters
- **Required parameter** validation
- **Automatic help text** generation
- **Alias support** for shorter command-line flags
- **Error handling** with informative messages

## Usage

To use the parameter handler in your script:

```javascript
import MCPParameterHandler from "./lib/parameter-handler.js";

// Define your command parameters
const myCommand = {
  name: "my-command",
  description: "Description of your command",
  parameters: [
    {
      name: "server",
      alias: "s",
      description: "MCP server URL",
      type: "string",
      default: "http://localhost:3000",
    },
    {
      name: "verbose",
      alias: "v",
      description: "Enable verbose output",
      type: "boolean",
      default: false,
    },
    {
      name: "required-param",
      alias: "r",
      description: "A required parameter",
      type: "string",
      required: true,
    },
  ],
};

// Parse parameters
const paramHandler = new MCPParameterHandler(myCommand);

// Check for help flag first (optional)
const hasHelpFlag =
  process.argv.includes("--help") || process.argv.includes("-h");
if (hasHelpFlag) {
  console.log(paramHandler.getHelpText());
  process.exit(0);
}

// Parse actual parameters
const params = paramHandler.parse(process.argv.slice(2));

// Now use the parsed parameters
console.log(`Server: ${params.server}`);
if (params.verbose) {
  console.log("Verbose mode enabled");
}
console.log(`Required parameter: ${params["required-param"]}`);
```

## Parameter Options

Each parameter can have the following options:

| Option        | Type    | Description                                          |
| ------------- | ------- | ---------------------------------------------------- |
| `name`        | string  | Parameter name (required)                            |
| `alias`       | string  | Short form alias (e.g., 's' for --server)            |
| `description` | string  | Human-readable description                           |
| `type`        | string  | Data type: 'string', 'number', 'boolean', or 'array' |
| `default`     | any     | Default value if parameter not provided              |
| `required`    | boolean | Whether parameter is required                        |
| `choices`     | array   | Allowed values for validation                        |
| `hidden`      | boolean | Hide from help text                                  |

## Examples

### Basic Example

```javascript
const simpleCommand = {
  name: "simple-client",
  description: "A simple client for MCP",
  parameters: [
    {
      name: "port",
      alias: "p",
      description: "Port number",
      type: "number",
      default: 3000,
    },
  ],
};

const paramHandler = new MCPParameterHandler(simpleCommand);
const params = paramHandler.parse(process.argv.slice(2));

// Use the parameters
startServer(params.port);
```

### Complex Example with Required Parameters

```javascript
const analyzerCommand = {
  name: "analyzer",
  description: "Code analyzer for MCP",
  parameters: [
    {
      name: "task",
      alias: "t",
      description: "Task to analyze",
      type: "string",
      required: true,
    },
    {
      name: "files",
      alias: "f",
      description: "Files to analyze",
      type: "string",
      default: "**/*.js",
    },
    {
      name: "verbose",
      alias: "v",
      description: "Verbose output",
      type: "boolean",
      default: false,
    },
  ],
};

const paramHandler = new MCPParameterHandler(analyzerCommand);

// Check for help first
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(paramHandler.getHelpText());
  process.exit(0);
}

try {
  const params = paramHandler.parse(process.argv.slice(2));

  // Use the parameters
  analyze(params.task, params.files, params.verbose);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
```

## Best Practices

1. **Always provide descriptive parameter names** and descriptions
2. **Use consistent parameter names** across different client scripts
3. **Check for help flag first** before parsing parameters
4. **Include sensible default values** where appropriate
5. **Make parameter types explicit** for better documentation
6. **Use 'required' sparingly** for essential parameters only
7. **Add a `verbose` flag** for detailed output in all client scripts

## Implementing New Client Scripts

When creating a new client script with parameter handling:

1. **Define a clear command structure** with a descriptive name and description
2. **List all parameters** with appropriate types and defaults
3. **Create a parameter handler** instance with your command definition
4. **Check for the help flag** before parsing parameters
5. **Parse the parameters** from command-line arguments
6. **Handle errors gracefully** with informative messages
7. **Use the parsed parameters** in your script logic

## Testing

You can run the parameter handler tests using:

```bash
npm run test:params
```

These tests validate parameter parsing, help text generation, error handling, and type conversion.
