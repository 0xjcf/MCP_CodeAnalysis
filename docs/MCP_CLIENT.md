Quickstart
For Client Developers
Get started building your own client that can integrate with all MCP servers.

In this tutorial, you’ll learn how to build a LLM-powered chatbot client that connects to MCP servers. It helps to have gone through the Server quickstart that guides you through the basic of building your first server.

Python
Node
Java
Kotlin
You can find the complete code for this tutorial here.

System Requirements
Before starting, ensure your system meets these requirements:

Mac or Windows computer
Node.js 16 or higher installed
Latest version of npm installed
Anthropic API key (Claude)
Setting Up Your Environment
First, let’s create and set up our project:

MacOS/Linux

Windows

Copy

# Create project directory

mkdir mcp-client-typescript
cd mcp-client-typescript

# Initialize npm project

npm init -y

# Install dependencies

npm install @anthropic-ai/sdk @modelcontextprotocol/sdk dotenv

# Install dev dependencies

npm install -D @types/node typescript

# Create source file

touch index.ts
Update your package.json to set type: "module" and a build script:

package.json

Copy
{
"type": "module",
"scripts": {
"build": "tsc && chmod 755 build/index.js"
}
}
Create a tsconfig.json in the root of your project:

tsconfig.json

Copy
{
"compilerOptions": {
"target": "ES2022",
"module": "Node16",
"moduleResolution": "Node16",
"outDir": "./build",
"rootDir": "./",
"strict": true,
"esModuleInterop": true,
"skipLibCheck": true,
"forceConsistentCasingInFileNames": true
},
"include": ["index.ts"],
"exclude": ["node_modules"]
}
Setting Up Your API Key
You’ll need an Anthropic API key from the Anthropic Console.

Create a .env file to store it:

Copy
echo "ANTHROPIC_API_KEY=<your key here>" > .env
Add .env to your .gitignore:

Copy
echo ".env" >> .gitignore
Make sure you keep your ANTHROPIC_API_KEY secure!

Creating the Client
Basic Client Structure
First, let’s set up our imports and create the basic client class in index.ts:

Copy
import { Anthropic } from "@anthropic-ai/sdk";
import {
MessageParam,
Tool,
} from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import readline from "readline/promises";
import dotenv from "dotenv";

dotenv.config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
throw new Error("ANTHROPIC_API_KEY is not set");
}

class MCPClient {
private mcp: Client;
private anthropic: Anthropic;
private transport: StdioClientTransport | null = null;
private tools: Tool[] = [];

constructor() {
this.anthropic = new Anthropic({
apiKey: ANTHROPIC_API_KEY,
});
this.mcp = new Client({ name: "mcp-client-cli", version: "1.0.0" });
}
// methods will go here
}
Server Connection Management
Next, we’ll implement the method to connect to an MCP server:

Copy
async connectToServer(serverScriptPath: string) {
try {
const isJs = serverScriptPath.endsWith(".js");
const isPy = serverScriptPath.endsWith(".py");
if (!isJs && !isPy) {
throw new Error("Server script must be a .js or .py file");
}
const command = isPy
? process.platform === "win32"
? "python"
: "python3"
: process.execPath;

    this.transport = new StdioClientTransport({
      command,
      args: [serverScriptPath],
    });
    this.mcp.connect(this.transport);

    const toolsResult = await this.mcp.listTools();
    this.tools = toolsResult.tools.map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema,
      };
    });
    console.log(
      "Connected to server with tools:",
      this.tools.map(({ name }) => name)
    );

} catch (e) {
console.log("Failed to connect to MCP server: ", e);
throw e;
}
}
Query Processing Logic
Now let’s add the core functionality for processing queries and handling tool calls:

Copy
async processQuery(query: string) {
const messages: MessageParam[] = [
{
role: "user",
content: query,
},
];

const response = await this.anthropic.messages.create({
model: "claude-3-5-sonnet-20241022",
max_tokens: 1000,
messages,
tools: this.tools,
});

const finalText = [];
const toolResults = [];

for (const content of response.content) {
if (content.type === "text") {
finalText.push(content.text);
} else if (content.type === "tool_use") {
const toolName = content.name;
const toolArgs = content.input as { [x: string]: unknown } | undefined;

      const result = await this.mcp.callTool({
        name: toolName,
        arguments: toolArgs,
      });
      toolResults.push(result);
      finalText.push(
        `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
      );

      messages.push({
        role: "user",
        content: result.content as string,
      });

      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        messages,
      });

      finalText.push(
        response.content[0].type === "text" ? response.content[0].text : ""
      );
    }

}

return finalText.join("\n");
}
Interactive Chat Interface
Now we’ll add the chat loop and cleanup functionality:

Copy
async chatLoop() {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
});

try {
console.log("\nMCP Client Started!");
console.log("Type your queries or 'quit' to exit.");

    while (true) {
      const message = await rl.question("\nQuery: ");
      if (message.toLowerCase() === "quit") {
        break;
      }
      const response = await this.processQuery(message);
      console.log("\n" + response);
    }

} finally {
rl.close();
}
}

async cleanup() {
await this.mcp.close();
}
Main Entry Point
Finally, we’ll add the main execution logic:

Copy
async function main() {
if (process.argv.length < 3) {
console.log("Usage: node index.ts <path_to_server_script>");
return;
}
const mcpClient = new MCPClient();
try {
await mcpClient.connectToServer(process.argv[2]);
await mcpClient.chatLoop();
} finally {
await mcpClient.cleanup();
process.exit(0);
}
}

main();
Running the Client
To run your client with any MCP server:

Copy

# Build TypeScript

npm run build

# Run the client

node build/index.js path/to/server.py # python server
node build/index.js path/to/build/index.js # node server
If you’re continuing the weather tutorial from the server quickstart, your command might look something like this: node build/index.js .../quickstart-resources/weather-server-typescript/build/index.js

The client will:

Connect to the specified server
List available tools
Start an interactive chat session where you can:
Enter queries
See tool executions
Get responses from Claude
How It Works
When you submit a query:

The client gets the list of available tools from the server
Your query is sent to Claude along with tool descriptions
Claude decides which tools (if any) to use
The client executes any requested tool calls through the server
Results are sent back to Claude
Claude provides a natural language response
The response is displayed to you
Best practices
Error Handling

Use TypeScript’s type system for better error detection
Wrap tool calls in try-catch blocks
Provide meaningful error messages
Gracefully handle connection issues
Security

Store API keys securely in .env
Validate server responses
Be cautious with tool permissions
Troubleshooting
Server Path Issues
Double-check the path to your server script is correct
Use the absolute path if the relative path isn’t working
For Windows users, make sure to use forward slashes (/) or escaped backslashes (\) in the path
Verify the server file has the correct extension (.js for Node.js or .py for Python)
Example of correct path usage:

Copy

# Relative path

node build/index.js ./server/build/index.js

# Absolute path

node build/index.js /Users/username/projects/mcp-server/build/index.js

# Windows path (either format works)

node build/index.js C:/projects/mcp-server/build/index.js
node build/index.js C:\\projects\\mcp-server\\build\\index.js
Response Timing
The first response might take up to 30 seconds to return
This is normal and happens while:
The server initializes
Claude processes the query
Tools are being executed
Subsequent responses are typically faster
Don’t interrupt the process during this initial waiting period
Common Error Messages
If you see:

Error: Cannot find module: Check your build folder and ensure TypeScript compilation succeeded
Connection refused: Ensure the server is running and the path is correct
Tool execution failed: Verify the tool’s required environment variables are set
ANTHROPIC_API_KEY is not set: Check your .env file and environment variables
TypeError: Ensure you’re using the correct types for tool arguments
