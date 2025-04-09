import type { McpServer } from '@mcp/types';
import { McpServer as SdkMcpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import express, { json } from 'express';

import { adaptServer } from './adapters/server-adapter.js';
import { Logger } from './utils/logger.js';

// Create SDK server instance
const sdkServer = new SdkMcpServer(
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

// Create adapted server that implements our local McpServer interface
const server: McpServer = adaptServer(sdkServer);
const logger = new Logger('MCP Server');

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

// Store active transport
let activeTransport: SSEServerTransport | null = null;

// SSE endpoint for client connections
app.get('/mcp', (_req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const transport = new SSEServerTransport('/messages', res);
  activeTransport = transport;

  server.connect(transport).catch((err: Error) => {
    logger.error('Failed to connect server to SSE transport', err);
    activeTransport = null;
    res.end();
  });

  // Clean up on connection close
  res.on('close', () => {
    activeTransport = null;
  });
});

// Client message endpoint
app.post('/messages', json(), async (req, res) => {
  try {
    if (!activeTransport) {
      res.status(400).json({ error: 'No SSE connection established' });
      return;
    }
    await activeTransport.handlePostMessage(req, res);
  } catch (error) {
    logger.error(
      'Error handling client message',
      error instanceof Error ? error : new Error(String(error)),
    );
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function start(): Promise<void> {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  await new Promise<void>((resolve, reject) => {
    const server = app.listen(port, () => {
      logger.info(`Server running at http://localhost:${port}`);
      resolve();
    });
    server.on('error', reject);
  });
}

export { server, start };
