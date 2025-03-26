# MCP Client Tools

This directory contains various client tools for interacting with the MCP server.

## Client Implementation Overview

The MCP clients are designed to communicate with the server through different transport mechanisms:

- **HTTP** - For web-based communication
- **stdio** - For direct process communication
- **SSE** - For server-sent events

## Available Clients

- `simple-client.js` - Basic client for testing server communication
- `mcp-raw-client.js` - Direct stdio-based client with rich output formatting
- `tool-discovery-client.js` - Tool discovery client that can use raw stdio approach
- `http-tool-discovery.js` - HTTP-based tool discovery client
- `ai-analyzer.js` - AI-assisted code analysis client

## Parameter Handling

All clients now use the standardized parameter handling utility located at `./lib/parameter-handler.js`. This provides consistent command-line argument parsing, validation, and help text generation across all tools.

### Features

- Consistent parameter syntax (`--param value` or `-p value`)
- Type validation and conversion
- Required parameter enforcement
- Default values
- Environment variable support (`MCP_PARAMETER_NAME`)
- Automatic help text generation (`--help` or `-h`)
- Custom validation functions

### Example

```javascript
import MCPParameterHandler from "./lib/parameter-handler.js";

// Define command with parameters
const myCommand = {
  name: "my-tool",
  description: "Description of what my tool does",
  parameters: [
    {
      name: "server",
      alias: "s",
      description: "Server URL",
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
  ],
};

// Parse parameters
const paramHandler = new MCPParameterHandler(myCommand);
const params = paramHandler.parse(process.argv.slice(2));

// Use the parameters
console.log(`Connecting to ${params.server}`);
if (params.verbose) {
  console.log("Verbose mode enabled");
}
```

### Testing the Parameter Handler

Run the test script to see the parameter handler in action:

```bash
# Show help
node tools/test-parameter-handler.js --help

# Basic usage (with required parameter)
node tools/test-parameter-handler.js --path ./src

# Using aliases
node tools/test-parameter-handler.js -p ./src -v -l 2

# Array parameter
node tools/test-parameter-handler.js -p ./src --tags security,performance
```

## Usage

Most clients support the following common parameters:

- `--server` or `-s` - Server URL or path (default: varies by client)
- `--verbose` or `-v` - Enable verbose output
- `--help` or `-h` - Show help text

See individual client's help text for specific parameters:

```bash
node tools/simple-client.js --help
node tools/mcp-raw-client.js --help
node tools/http-tool-discovery.js --help
```

## Tool Discovery Client

The main tool discovery client is `tool-discovery-client.js`, which allows you to list all available tools registered with the MCP server.

### Usage

```bash
# Basic usage (uses raw client approach by default)
node tools/tool-discovery-client.js

# Use the raw client approach explicitly
node tools/tool-discovery-client.js --raw

# Connect to a custom server
node tools/tool-discovery-client.js --server http://localhost:8080
```

### How It Works

The tool discovery client supports two approaches:

1. **Raw Client Approach** (default): This approach starts a new MCP server instance with STDIO transport and sends JSON-RPC requests directly to it. This is the most reliable method and works in all scenarios.

2. **HTTP Client Approach**: This approach sends HTTP requests to the running MCP server. However, it requires an SSE connection to be established first, which is currently not fully supported in the client.

### Options

- `--raw`: Use the raw client approach (starts a new server with STDIO transport)
- `--http`: Use the HTTP client approach (requires SSE connection)
- `--server <url>`: Specify a custom server URL (default: http://localhost:3000)

## HTTP Tool Discovery Client

A simplified client for demonstrating HTTP connection to the MCP server is available at `http-tool-discovery.js`.

### Usage

```bash
# Basic usage
node tools/http-tool-discovery.js

# Connect to a custom server
node tools/http-tool-discovery.js --url http://localhost:8080
```

### How It Works

The HTTP client:

1. Connects to the MCP server via HTTP and checks its health
2. Uses the raw client approach for tool discovery by spawning the main tool discovery client

## Development

When developing new tools, the tool discovery clients are useful for verifying that your tools are properly registered with the server. The raw client approach is recommended for general testing as it provides the most reliable results.

For advanced HTTP-based tool invocation, additional work is needed to implement proper SSE connection handling in the clients.
