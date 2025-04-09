/**
 * In-Memory Session Store for MCP SDK Tools
 *
 * This module provides a memory-based storage implementation for MCP SDK tool sessions.
 * It's intended for development and testing environments where Redis is not available.
 * NOT RECOMMENDED FOR PRODUCTION USE due to lack of persistence across server restarts
 * and inability to share sessions across multiple server instances.
 *
 * The memory session store handles:
 * - Session data storage in a Map
 * - TTL-based session management via setTimeout
 * - Simple locking mechanism for concurrent operations
 *
 * @module memorySessionStore
 */

import type { ISessionStore, ISessionData } from '@mcp/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Error class for memory session store operations
 */
export class MemorySessionStoreError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'MemorySessionStoreError';
  }
}

/**
 * Memory Session Store Options
 */
interface IMemorySessionStoreOptions {
  /**
   * Key prefix for session keys (default: "memory:")
   */
  prefix?: string;

  /**
   * Default TTL for sessions in seconds (default: 3600)
   */
  defaultTtl?: number;

  /**
   * Default lock timeout in milliseconds (default: 30000)
   */
  lockTimeout?: number;
}

/**
 * Interface for session data with TTL
 */
interface ISessionDataWithTtl<T extends ISessionData = ISessionData> {
  data: T;
  ttl: number;
  timeout: NodeJS.Timeout;
}

/**
 * Interface for lock data
 */
interface ILockData {
  token: string;
  timeout: NodeJS.Timeout;
}

/**
 * In-memory implementation of the SessionStore interface.
 * This implementation is suitable for development and testing.
 */
export class MemorySessionStore<T extends ISessionData = ISessionData> implements ISessionStore<T> {
  private sessions: Map<string, ISessionDataWithTtl<T>> = new Map();
  private locks: Map<string, ILockData> = new Map();
  private readonly prefix: string;
  private readonly defaultTtl: number;
  private readonly lockTimeout: number;

  /**
   * Creates a new MemorySessionStore
   * @param options Configuration options
   */
  constructor(options: IMemorySessionStoreOptions = {}) {
    this.prefix = options.prefix || 'memory:';
    this.defaultTtl = options.defaultTtl || 3600;
    this.lockTimeout = options.lockTimeout || 30000;
  }

  private getKey(sessionId: string): string {
    return `${this.prefix}${sessionId}`;
  }

  private clearSessionTimeout(session: ISessionDataWithTtl<T>): void {
    if (session.timeout) {
      clearTimeout(session.timeout);
    }
  }

  private setSessionTimeout(key: string, ttl: number): void {
    const session = this.sessions.get(key);
    if (session) {
      this.clearSessionTimeout(session);
      session.timeout = setTimeout(() => {
        this.sessions.delete(key);
      }, ttl * 1000);
    }
  }

  /**
   * Get session data by ID
   * @param sessionId Unique session identifier
   * @returns Promise resolving to session data or null if not found
   */
  async getSession(sessionId: string): Promise<T | null> {
    try {
      const key = this.getKey(sessionId);
      const session = this.sessions.get(key);
      if (!session) {
        return null;
      }
      return session.data;
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to get session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GET_SESSION_ERROR',
      );
    }
  }

  /**
   * Set session data
   * @param sessionId Unique session identifier
   * @param data Session data to store
   * @param ttl Optional TTL override (in seconds)
   */
  async setSession(sessionId: string, data: T, ttl?: number): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      const sessionTtl = ttl ?? this.defaultTtl;

      // Clear any existing timeout
      const existingSession = this.sessions.get(key);
      if (existingSession) {
        this.clearSessionTimeout(existingSession);
      }

      // Create new session with timeout
      const session: ISessionDataWithTtl<T> = {
        data,
        ttl: sessionTtl,
        timeout: setTimeout(() => {
          this.sessions.delete(key);
        }, sessionTtl * 1000),
      };

      this.sessions.set(key, session);
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to set session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SET_SESSION_ERROR',
      );
    }
  }

  /**
   * Removes a session from memory
   * @param sessionId The ID of the session to remove
   */
  async clearSession(sessionId: string): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      const session = this.sessions.get(key);
      if (session) {
        this.clearSessionTimeout(session);
        this.sessions.delete(key);
      }
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to clear session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CLEAR_SESSION_ERROR',
      );
    }
  }

  /**
   * Deletes a session from memory
   * @param sessionId The ID of the session to delete
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      const session = this.sessions.get(key);
      if (session) {
        this.clearSessionTimeout(session);
        this.sessions.delete(key);
      }
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to delete session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DELETE_SESSION_ERROR',
      );
    }
  }

  /**
   * Gets all active session IDs
   * @returns Array of session IDs
   */
  async getSessions(): Promise<string[]> {
    try {
      return Array.from(this.sessions.keys()).map(key => key.slice(this.prefix.length));
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to get sessions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GET_SESSIONS_ERROR',
      );
    }
  }

  /**
   * Clears all sessions from memory
   */
  async clear(): Promise<void> {
    try {
      // Clear all timeouts
      for (const session of this.sessions.values()) {
        this.clearSessionTimeout(session);
      }
      this.sessions.clear();
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to clear sessions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CLEAR_SESSIONS_ERROR',
      );
    }
  }

  /**
   * Acquires a lock on a session
   * @param sessionId The ID of the session to lock
   * @param timeout Optional timeout in milliseconds
   * @returns Lock token if successful, null if lock could not be acquired
   */
  async acquireLock(sessionId: string, timeout?: number): Promise<string | null> {
    try {
      const lockTimeout = timeout || this.lockTimeout;
      const lockToken = uuidv4(); // Use UUID instead of Math.random()

      // Check if lock already exists
      if (this.locks.has(sessionId)) {
        return null;
      }

      const timeoutId = setTimeout(() => {
        this.locks.delete(sessionId);
      }, lockTimeout);

      this.locks.set(sessionId, { token: lockToken, timeout: timeoutId });
      return lockToken;
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to acquire lock: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ACQUIRE_LOCK_ERROR',
      );
    }
  }

  /**
   * Releases a lock on a session
   * @param sessionId The ID of the session
   * @param lockToken The lock token to release
   * @returns True if the lock was released, false otherwise
   */
  async releaseLock(sessionId: string, lockToken: string): Promise<boolean> {
    try {
      const lock = this.locks.get(sessionId);
      if (lock && lock.token === lockToken) {
        clearTimeout(lock.timeout);
        this.locks.delete(sessionId);
        return true;
      }
      return false;
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to release lock: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'RELEASE_LOCK_ERROR',
      );
    }
  }

  /**
   * Extends the TTL of a session
   * @param sessionId ID of the session
   * @param ttl New TTL in seconds
   * @returns True if successful, false if session doesn't exist
   */
  async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean> {
    try {
      const key = this.getKey(sessionId);
      const session = this.sessions.get(key);
      if (!session) {
        return false;
      }
      this.setSessionTimeout(key, ttl);
      session.ttl = ttl;
      return true;
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to extend session TTL: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'EXTEND_TTL_ERROR',
      );
    }
  }

  /**
   * Gets the remaining TTL for a session
   * @param sessionId ID of the session
   * @returns Remaining TTL in seconds, or null if session doesn't exist
   */
  async getSessionTtl(sessionId: string): Promise<number | null> {
    try {
      const key = this.getKey(sessionId);
      const session = this.sessions.get(key);
      if (!session) {
        return null;
      }
      return session.ttl;
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to get session TTL: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GET_TTL_ERROR',
      );
    }
  }

  /**
   * Creates a session if it doesn't exist, or returns the existing session
   * @param sessionId The ID of the session
   * @param initialState The initial state if the session needs to be created
   * @returns The session state (either existing or newly created)
   */
  async createSessionIfNotExists(sessionId: string, initialState: T): Promise<T> {
    try {
      const session = await this.getSession(sessionId);
      if (!session) {
        await this.setSession(sessionId, initialState);
        return initialState;
      }
      return session;
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CREATE_SESSION_ERROR',
      );
    }
  }

  /**
   * Disconnect from the store
   * No-op for memory implementation since there's no connection to close
   */
  async disconnect(): Promise<void> {
    try {
      // Clear all timeouts
      for (const session of this.sessions.values()) {
        this.clearSessionTimeout(session);
      }
      for (const lock of this.locks.values()) {
        clearTimeout(lock.timeout);
      }
    } catch (error) {
      throw new MemorySessionStoreError(
        `Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DISCONNECT_ERROR',
      );
    }
  }
}
