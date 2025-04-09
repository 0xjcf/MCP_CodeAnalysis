/**
 * End of Session Store Service
 *
 * This service provides functionality to store and retrieve end-of-session data
 * using the MCP session store infrastructure. It handles the persistence of
 * session summaries, metrics, and context for future reference.
 */

import type { ISessionStore, ISessionData } from '@mcp/types';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

import { RedisSessionStore } from './redisSessionStore.js';

/**
 * Error class for end of session store operations
 */
export class EndOfSessionStoreError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'EndOfSessionStoreError';
  }
}

/**
 * Interface for end of session data
 */
export interface IEndOfSessionData extends Record<string, unknown> {
  session_id?: string;
  timestamp: string;
  status: 'completed' | 'in_progress';
  next_session?: {
    date: string;
    focus: string;
    goals: string[];
    priority: 'high' | 'medium' | 'low';
    context: {
      current_phase: string;
      focus_area: string;
      project_status: string;
      active_development: {
        component: string;
        status: string;
        progress: number;
        features_to_implement: string[];
        current_metrics: {
          implementation_status: string;
          test_coverage: string;
          documentation: string;
        };
      };
    };
  };
  completed_tasks: string[];
  next_steps: string[];
  notes: string[];
  session_summary: {
    date: string;
    duration: string;
    main_activities: string[];
    key_decisions: string[];
    next_steps: string[];
  };
  technical_notes: {
    dependencies: {
      added: string[];
      removed: string[];
      updated: string[];
    };
    file_changes: {
      modified: string[];
      created: string[];
      deleted: string[];
    };
  };
  session_metrics: {
    files_modified: number;
    lines_added: number;
    lines_removed: number;
    new_files: number;
    deleted_files: number;
    renamed_files: number;
  };
}

/**
 * Type alias for end of session data
 */
export type EndOfSessionData = IEndOfSessionData;

/**
 * Interface for list records options
 */
interface IListRecordsOptions {
  limit?: number;
  offset?: number;
}

/**
 * Interface for session record
 */
interface ISessionRecord {
  id: string;
  timestamp: number;
  data: IEndOfSessionData;
}

/**
 * End of session store implementation
 */
export class EndOfSessionStore {
  private sessionStore: ISessionStore;
  private sessionId: string;
  private readonly prefix: string;

  /**
   * Creates a new EndOfSessionStore
   * @param options Configuration options
   */
  constructor(options: { redisUrl: string; sessionId: string; prefix?: string }) {
    try {
      this.sessionId = options.sessionId;
      this.prefix = options.prefix || 'eos:';
      this.sessionStore = new RedisSessionStore({
        redisUrl: options.redisUrl,
        prefix: this.prefix,
      });
    } catch (error) {
      throw new EndOfSessionStoreError(
        `Failed to initialize EndOfSessionStore: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'INITIALIZATION_ERROR',
      );
    }
  }

  /**
   * Get the current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Get the underlying session store
   */
  getStore(): ISessionStore {
    return this.sessionStore;
  }

  /**
   * Save end of session data
   */
  async saveEndOfSession(data: IEndOfSessionData): Promise<string> {
    try {
      const sessionId = data.session_id
        ? data.session_id.startsWith(this.prefix)
          ? data.session_id
          : `${this.prefix}${data.session_id}`
        : `${this.prefix}${uuidv4()}`;

      const sessionData: ISessionData = {
        id: sessionId,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        data,
      };

      await this.sessionStore.setSession(sessionId, sessionData);
      return sessionId;
    } catch (error) {
      throw new EndOfSessionStoreError(
        `Failed to save end of session data: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'SAVE_ERROR',
      );
    }
  }

  /**
   * Get end of session data
   */
  async getEndOfSession(sessionId: string): Promise<IEndOfSessionData | null> {
    try {
      const sessionData = await this.sessionStore.getSession(sessionId);
      return (sessionData?.data as IEndOfSessionData) ?? null;
    } catch (error) {
      throw new EndOfSessionStoreError(
        `Failed to get end of session data: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'GET_ERROR',
      );
    }
  }

  /**
   * List all end of session IDs
   */
  async listEndOfSessions(): Promise<string[]> {
    try {
      const sessions = await this.sessionStore.getSessions();
      // Remove the prefix from session IDs if they have it
      return sessions.map(sessionId =>
        sessionId.startsWith(this.prefix) ? sessionId.slice(this.prefix.length) : sessionId,
      );
    } catch (error) {
      throw new EndOfSessionStoreError(
        `Failed to list end of sessions: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'LIST_ERROR',
      );
    }
  }

  /**
   * Delete end of session data
   */
  async deleteEndOfSession(sessionId: string): Promise<void> {
    try {
      await this.sessionStore.deleteSession(sessionId);
    } catch (error) {
      throw new EndOfSessionStoreError(
        `Failed to delete end of session data: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'DELETE_ERROR',
      );
    }
  }

  /**
   * Clear all end of session data
   */
  async clearAll(): Promise<void> {
    try {
      await this.sessionStore.clear();
    } catch (error) {
      throw new EndOfSessionStoreError(
        `Failed to clear all end of session data: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        'CLEAR_ERROR',
      );
    }
  }

  /**
   * List session records with options
   */
  async listRecords(options: IListRecordsOptions = {}): Promise<ISessionRecord[]> {
    try {
      const { limit = 10, offset = 0 } = options;
      const sessions = await this.listEndOfSessions();
      const records: ISessionRecord[] = [];

      for (const sessionId of sessions.slice(offset, offset + limit)) {
        const data = await this.getEndOfSession(sessionId);
        if (data) {
          records.push({
            id: sessionId,
            timestamp: new Date(data.timestamp).getTime(),
            data,
          });
        }
      }

      return records;
    } catch (error) {
      throw new EndOfSessionStoreError(
        `Failed to list records: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'LIST_RECORDS_ERROR',
      );
    }
  }
}
