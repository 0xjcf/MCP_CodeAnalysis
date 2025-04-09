/**
 * MCP Session Client
 *
 * This client provides a clean interface for interacting with the MCP server's
 * session management tools. It handles session creation, retrieval, and
 * management through a simple API.
 */

import { spawn } from 'child_process';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import chalk from 'chalk';
import type { Ora } from 'ora';
import ora from 'ora';

interface ISessionInfo {
  sessionId: string;
  selectedTool?: string;
  lastExecutionTime?: string;
  executionHistory: number;
  hasError: boolean;
}

interface ISessionHistoryEntry {
  timestamp: string;
  tool: string;
  arguments: any;
  result?: any;
  error?: string;
}

interface ISessionHistory {
  sessionId: string;
  totalEntries: number;
  returnedEntries: number;
  history: ISessionHistoryEntry[];
}

interface IActiveSession {
  sessionId: string;
  toolsUsed: number;
  lastActivity?: string;
}

interface ISessionList {
  activeSessions: number;
  sessions: IActiveSession[];
}

interface ICreateSessionResult {
  sessionId: string;
  created: string;
}

interface IClearSessionResult {
  cleared: boolean;
  timestamp: string;
}

interface IEndOfSessionResult {
  sessionId: string;
  data: any;
}

export class McpSessionClient {
  private client: Client | null = null;
  private spinner: Ora | null = null;

  /**
   * Connect to the MCP server
   * @param serverPath Path to the server script
   * @param debug Enable debug logging
   * @param port Optional port number to connect to existing server
   */
  async connect(serverPath: string, debug = false, port?: number): Promise<void> {
    if (this.client) {
      return;
    }

    this.spinner = ora('Connecting to MCP server...').start();

    try {
      let transport;

      if (port) {
        // Connect to existing server using SSE
        const baseUrl = new URL(`http://localhost:${port}`);
        transport = new SSEClientTransport(baseUrl);
      } else {
        // Spawn new server
        transport = new StdioClientTransport({
          command: 'node',
          args: [serverPath],
        });
      }

      this.client = new Client(
        { name: 'mcp-session-client', version: '1.0.0' },
        { capabilities: { tools: {}, resources: {}, prompts: {} } },
      );

      await this.client.connect(transport);

      if (debug) {
        console.log(chalk.gray('Debug: Connected to MCP server'));
      }

      this.spinner.succeed('Connected to MCP server');
    } catch (error) {
      if (this.spinner) {
        this.spinner.fail(`Failed to connect to server: ${(error as Error).message}`);
      }
      throw error;
    }
  }

  /**
   * Close the connection to the MCP server
   */
  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }

  /**
   * Create a new session
   * @param description Optional description for the session
   * @returns Session ID and creation timestamp
   */
  async createSession(description?: string): Promise<ICreateSessionResult> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'create-session',
      arguments: { description },
    })) as unknown as ICreateSessionResult;

    return result;
  }

  /**
   * Get information about a session
   * @param sessionId ID of the session to retrieve
   * @returns Session information
   */
  async getSessionInfo(sessionId: string): Promise<ISessionInfo> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'get-session-info',
      arguments: { sessionId },
    })) as unknown as ISessionInfo;

    return result;
  }

  /**
   * Get execution history for a session
   * @param sessionId ID of the session to retrieve history for
   * @param limit Maximum number of history entries to return
   * @returns Session history
   */
  async getSessionHistory(sessionId: string, limit = 10): Promise<ISessionHistory> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'get-session-history',
      arguments: { sessionId, limit },
    })) as unknown as ISessionHistory;

    return result;
  }

  /**
   * Clear a session
   * @param sessionId ID of the session to clear
   * @returns Whether the session was cleared
   */
  async clearSession(sessionId: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'clear-session',
      arguments: { sessionId },
    })) as unknown as IClearSessionResult;

    return result.cleared;
  }

  /**
   * List all active sessions
   * @returns List of active sessions
   */
  async listSessions(): Promise<ISessionList> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'list-sessions',
      arguments: {},
    })) as unknown as ISessionList;

    return result;
  }

  /**
   * Save end-of-session data
   * @param data The end-of-session data to save
   * @returns The session ID
   */
  async saveEndOfSession(data: any): Promise<string> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'save-end-of-session',
      arguments: { data },
    })) as unknown as IEndOfSessionResult;

    return result.sessionId;
  }

  /**
   * Get end-of-session data
   * @param sessionId The session ID to retrieve
   * @returns The end-of-session data
   */
  async getEndOfSession(sessionId: string): Promise<any> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'get-end-of-session',
      arguments: { sessionId },
    })) as unknown as IEndOfSessionResult;

    return result.data;
  }

  /**
   * List all end-of-session records
   * @returns Array of session IDs
   */
  async listEndOfSessions(): Promise<string[]> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'list-end-of-sessions',
      arguments: {},
    })) as unknown as string[];

    return result;
  }
}
