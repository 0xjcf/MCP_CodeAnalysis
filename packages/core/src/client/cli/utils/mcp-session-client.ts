/**
 * MCP Session Client
 *
 * This client provides a clean interface for interacting with the MCP server's
 * session management tools. It handles session creation, retrieval, and
 * management through a simple API.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Ora } from 'ora';
import ora from 'ora';
import chalk from 'chalk';
import { spawn } from 'child_process';

export interface SessionInfo {
  sessionId: string;
  selectedTool?: string;
  lastExecutionTime?: string;
  executionHistory: number;
  hasError: boolean;
}

export interface SessionHistoryEntry {
  timestamp: string;
  tool: string;
  arguments: any;
  result?: any;
  error?: string;
}

export interface SessionHistory {
  sessionId: string;
  totalEntries: number;
  returnedEntries: number;
  history: SessionHistoryEntry[];
}

export interface ActiveSession {
  sessionId: string;
  toolsUsed: number;
  lastActivity?: string;
}

export interface SessionList {
  activeSessions: number;
  sessions: ActiveSession[];
}

export interface CreateSessionResult {
  sessionId: string;
  created: string;
}

export interface ClearSessionResult {
  cleared: boolean;
  timestamp: string;
}

export interface EndOfSessionResult {
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
   */
  async connect(serverPath: string, debug = false): Promise<void> {
    if (this.client) {
      return;
    }

    this.spinner = ora('Connecting to MCP server...').start();

    try {
      const transport = new StdioClientTransport({
        command: 'node',
        args: [serverPath],
      });

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
  async createSession(description?: string): Promise<CreateSessionResult> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'create-session',
      arguments: { description },
    })) as unknown as CreateSessionResult;

    return result;
  }

  /**
   * Get information about a session
   * @param sessionId ID of the session to retrieve
   * @returns Session information
   */
  async getSessionInfo(sessionId: string): Promise<SessionInfo> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'get-session-info',
      arguments: { sessionId },
    })) as unknown as SessionInfo;

    return result;
  }

  /**
   * Get execution history for a session
   * @param sessionId ID of the session to retrieve history for
   * @param limit Maximum number of history entries to return
   * @returns Session history
   */
  async getSessionHistory(sessionId: string, limit = 10): Promise<SessionHistory> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'get-session-history',
      arguments: { sessionId, limit },
    })) as unknown as SessionHistory;

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
    })) as unknown as ClearSessionResult;

    return result.cleared;
  }

  /**
   * List all active sessions
   * @returns List of active sessions
   */
  async listSessions(): Promise<SessionList> {
    if (!this.client) {
      throw new Error('Client not connected to server');
    }

    const result = (await this.client.callTool({
      name: 'list-sessions',
      arguments: {},
    })) as unknown as SessionList;

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
    })) as unknown as EndOfSessionResult;

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
    })) as unknown as EndOfSessionResult;

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
