/**
 * End of Session Store Service
 *
 * This service provides functionality to store and retrieve end-of-session data
 * using the MCP session store infrastructure. It handles the persistence of
 * session summaries, metrics, and context for future reference.
 */

import { SessionStore } from './types.js';
import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';
import { RedisSessionStore } from './redisSessionStore.js';

export interface EndOfSessionData {
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

interface ListRecordsOptions {
  limit?: number;
  offset?: number;
  filter?: Record<string, any>;
}

interface SessionRecord {
  id: string;
  timestamp: number;
  data: Record<string, any>;
}

export class EndOfSessionStore {
  private sessionStore: SessionStore;
  private readonly prefix: string;
  private redis: Redis;
  private sessionId: string;

  constructor(options: { redisUrl: string; sessionId: string; prefix?: string }) {
    const url = new URL(options.redisUrl);
    this.redis = new Redis({
      host: url.hostname,
      port: parseInt(url.port),
      password: url.password || undefined,
    });
    this.sessionId = options.sessionId;
    this.prefix = options.prefix || 'mcp:end-of-session:';
    this.sessionStore = new RedisSessionStore({
      redisUrl: options.redisUrl,
      prefix: this.prefix,
      defaultTtl: 3600,
      lockTimeout: 30000,
    });
  }

  /**
   * Save end-of-session data
   * @param data The end-of-session data to save
   * @returns The session ID
   */
  async saveEndOfSession(data: EndOfSessionData): Promise<string> {
    const sessionId = data.session_id || `${this.prefix}${uuidv4()}`;
    await this.sessionStore.setSession(sessionId, data);
    return sessionId;
  }

  /**
   * Retrieve end-of-session data
   * @param sessionId The session ID to retrieve
   * @returns The end-of-session data or null if not found
   */
  async getEndOfSession(sessionId: string): Promise<EndOfSessionData | null> {
    return this.sessionStore.getSession<EndOfSessionData>(sessionId);
  }

  /**
   * List all end-of-session records
   * @returns Array of session IDs
   */
  async listEndOfSessions(): Promise<string[]> {
    try {
      const sessions = await this.sessionStore.getSessions();
      return sessions;
    } catch (error) {
      console.error('Error listing end-of-session records:', error);
      throw new Error('Failed to list end-of-session records');
    }
  }

  /**
   * Delete end-of-session data
   * @param sessionId The session ID to delete
   */
  async deleteEndOfSession(sessionId: string): Promise<void> {
    await this.sessionStore.clearSession(sessionId);
  }

  /**
   * Clear all end-of-session data
   */
  async clearAll(): Promise<void> {
    const sessions = await this.listEndOfSessions();
    await Promise.all(sessions.map(id => this.deleteEndOfSession(id)));
  }

  async listRecords(options: ListRecordsOptions = {}): Promise<SessionRecord[]> {
    try {
      const { limit = 10, offset = 0, filter = {} } = options;
      const records = await this.redis.zrange(this.getRecordsKey(), offset, offset + limit - 1);

      return records
        .map((record: string) => {
          try {
            const parsed = JSON.parse(record);
            // Apply filters if provided
            if (Object.keys(filter).length > 0) {
              return Object.entries(filter).every(([key, value]) => parsed[key] === value)
                ? parsed
                : null;
            }
            return parsed;
          } catch (error) {
            console.error('Failed to parse record:', error);
            return null;
          }
        })
        .filter((record): record is SessionRecord => record !== null);
    } catch (error) {
      console.error('Failed to list records:', error);
      throw new Error('Failed to list records');
    }
  }

  private getRecordsKey(): string {
    return `session:records:${this.sessionId}`;
  }
}
