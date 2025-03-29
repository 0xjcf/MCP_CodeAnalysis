import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const server = new McpServer(
  {
    name: 'mcp-code-analysis',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  },
);

const app = express();

// Add CORS headers
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Health check endpoint
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    server: 'MCP Code Analysis Server',
    version: '1.0.0',
  });
});

// SSE endpoint for client connections
app.get('/mcp', (_req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const transport = new SSEServerTransport('/messages', res);
  server.connect(transport).catch(err => {
    console.error('Failed to connect server to SSE transport:', err);
    res.end();
  });
});

// Client message endpoint
app.post('/messages', express.json(), async (req, res) => {
  try {
    const transport = new SSEServerTransport('/messages', res);
    await transport.handlePostMessage(req, res);
  } catch (error) {
    console.error('Error handling client message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function start() {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  return new Promise<void>((resolve, reject) => {
    app
      .listen(port, () => {
        console.log(`MCP Server running at http://localhost:${port}`);
        resolve();
      })
      .on('error', reject);
  });
}

export { server, start };
