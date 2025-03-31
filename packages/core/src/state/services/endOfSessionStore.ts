/**
 * End of Session Store Service
 *
 * This service provides functionality to store and retrieve end-of-session data
 * using the MCP session store infrastructure. It handles the persistence of
 * session summaries, metrics, and context for future reference.
 */

import { SessionStore } from './types.js';
import { v4 as uuidv4 } from 'uuid';

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

export class EndOfSessionStore {
  private sessionStore: SessionStore;
  private readonly prefix: string;

  constructor(sessionStore: SessionStore, prefix: string = 'mcp:end-of-session:') {
    this.sessionStore = sessionStore;
    this.prefix = prefix;
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
    const sessions = await this.sessionStore.getSessions();
    return sessions.filter(id => id.startsWith(this.prefix));
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
}
