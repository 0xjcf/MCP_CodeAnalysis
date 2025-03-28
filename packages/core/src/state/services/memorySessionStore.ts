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

import { SessionData, SessionStore } from "./types.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Memory Session Store Options
 */
export interface MemorySessionStoreOptions {
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
 * In-memory session store implementation
 *
 * Provides non-persistent storage of tool sessions using JavaScript Map,
 * with support for TTL management, and locking. Not suitable for production
 * use or distributed environments.
 */
export class MemorySessionStore implements SessionStore {
  private readonly sessions: Map<string, any> = new Map();
  private readonly locks: Map<
    string,
    { token: string; timeout: NodeJS.Timeout }
  > = new Map();
  private readonly timeouts: Map<string, NodeJS.Timeout> = new Map();
  private readonly prefix: string;
  private readonly defaultTtl: number;
  private readonly lockTimeout: number;

  /**
   * Create a new memory session store
   *
   * @param options Memory session store options
   */
  constructor(options: MemorySessionStoreOptions = {}) {
    const {
      prefix = "memory:",
      defaultTtl = 3600,
      lockTimeout = 30000,
    } = options;

    this.prefix = prefix;
    this.defaultTtl = defaultTtl;
    this.lockTimeout = lockTimeout;
  }

  /**
   * Get session data by ID
   *
   * @param sessionId Unique session identifier
   * @returns Promise resolving to session data or null if not found
   * @throws Error if operation fails
   */
  async getSession<T = SessionData>(sessionId: string): Promise<T | null> {
    try {
      const key = this.getSessionKey(sessionId);
      const data = this.sessions.get(key);
      return data ? (data as T) : null;
    } catch (err) {
      console.error(`Error retrieving session ${sessionId}:`, err);
      throw new Error(
        `Memory session operation failed: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * Set session data
   *
   * @param sessionId Unique session identifier
   * @param data Session data to store
   * @param ttl Optional TTL override (in seconds)
   * @throws Error if operation fails
   */
  async setSession<T = SessionData>(
    sessionId: string,
    data: T,
    ttl?: number
  ): Promise<void> {
    try {
      const key = this.getSessionKey(sessionId);
      const sessionTtl = ttl || this.defaultTtl;

      // Clear any existing timeout
      this.clearSessionTimeout(sessionId);

      // Store the session data
      this.sessions.set(key, data);

      // Set TTL timeout if not infinite
      if (sessionTtl > 0) {
        this.setSessionTimeout(sessionId, sessionTtl);
      }
    } catch (err) {
      console.error(`Error saving session ${sessionId}:`, err);
      throw new Error(
        `Memory session operation failed: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * Clear a session by ID
   *
   * @param sessionId Unique session identifier
   * @throws Error if operation fails
   */
  async clearSession(sessionId: string): Promise<void> {
    try {
      const key = this.getSessionKey(sessionId);
      this.clearSessionTimeout(sessionId);
      this.sessions.delete(key);
    } catch (err) {
      console.error(`Error deleting session ${sessionId}:`, err);
      throw new Error(
        `Memory session operation failed: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }

  /**
   * List all active session IDs
   *
   * @returns Promise resolving to array of session IDs
   */
  async getSessions(): Promise<string[]> {
    try {
      const prefixLength = this.prefix.length;
      return Array.from(this.sessions.keys()).map((key) =>
        key.substring(prefixLength)
      );
    } catch (err) {
      console.error("Error listing sessions:", err);
      return [];
    }
  }

  /**
   * Acquire a lock on a session
   *
   * @param sessionId Unique session identifier
   * @param timeout Lock timeout in milliseconds
   * @returns Promise resolving to a lock token if successful, null otherwise
   */
  async acquireLock(
    sessionId: string,
    timeout?: number
  ): Promise<string | null> {
    const lockKey = this.getLockKey(sessionId);
    const lockTimeoutMs = timeout || this.lockTimeout;

    // If lock already exists, return null
    if (this.locks.has(lockKey)) {
      return null;
    }

    // Create a new lock with token
    const token = uuidv4();

    // Create timeout to automatically release lock
    const timeoutHandle = setTimeout(() => {
      this.locks.delete(lockKey);
    }, lockTimeoutMs);

    // Store the lock
    this.locks.set(lockKey, { token, timeout: timeoutHandle });

    return token;
  }

  /**
   * Release a lock on a session
   *
   * @param sessionId Unique session identifier
   * @param token Lock token from acquireLock
   * @returns Promise resolving to true if successful, false if token didn't match
   */
  async releaseLock(sessionId: string, token: string): Promise<boolean> {
    const lockKey = this.getLockKey(sessionId);
    const lock = this.locks.get(lockKey);

    if (!lock) {
      return false;
    }

    if (lock.token !== token) {
      return false;
    }

    // Clear timeout and delete lock
    clearTimeout(lock.timeout);
    this.locks.delete(lockKey);

    return true;
  }

  /**
   * Extend the TTL of a session
   *
   * @param sessionId Unique session identifier
   * @param ttl New TTL in seconds
   * @returns Promise resolving to true if successful, false if session does not exist
   */
  async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean> {
    const key = this.getSessionKey(sessionId);

    if (!this.sessions.has(key)) {
      return false;
    }

    this.clearSessionTimeout(sessionId);
    this.setSessionTimeout(sessionId, ttl);

    return true;
  }

  /**
   * Get the remaining TTL of a session
   *
   * @param sessionId Unique session identifier
   * @returns Promise resolving to TTL in seconds, or null if session doesn't exist
   */
  async getSessionTtl(sessionId: string): Promise<number | null> {
    // We can't actually determine the exact TTL in the memory implementation
    // as JavaScript's setTimeout doesn't provide access to the remaining time
    // This is a limitation of the memory implementation
    const key = this.getSessionKey(sessionId);
    return this.sessions.has(key) ? this.defaultTtl : null;
  }

  /**
   * Create a session if it doesn't exist
   *
   * @param sessionId Unique session identifier
   * @param initialState Initial state to set if session doesn't exist
   * @returns Promise resolving to existing or newly created session data
   */
  async createSessionIfNotExists<T = SessionData>(
    sessionId: string,
    initialState: T
  ): Promise<T> {
    const existingSession = await this.getSession<T>(sessionId);

    if (existingSession) {
      return existingSession;
    }

    await this.setSession(sessionId, initialState);
    return initialState;
  }

  /**
   * Disconnect from the store
   * No-op for memory implementation since there's no connection to close
   */
  async disconnect(): Promise<void> {
    // No-op for memory implementation
  }

  /**
   * Get the internal key for a session
   *
   * @param sessionId Session ID
   * @returns Prefixed key
   */
  private getSessionKey(sessionId: string): string {
    return `${this.prefix}${sessionId}`;
  }

  /**
   * Get the internal key for a session lock
   *
   * @param sessionId Session ID
   * @returns Prefixed lock key
   */
  private getLockKey(sessionId: string): string {
    return `lock:${this.prefix}${sessionId}`;
  }

  /**
   * Set a session timeout for automatic cleanup
   *
   * @param sessionId Session ID
   * @param ttl TTL in seconds
   */
  private setSessionTimeout(sessionId: string, ttl: number): void {
    const key = this.getSessionKey(sessionId);

    const timeout = setTimeout(() => {
      this.sessions.delete(key);
      this.timeouts.delete(sessionId);
    }, ttl * 1000);

    this.timeouts.set(sessionId, timeout);
  }

  /**
   * Clear a session timeout
   *
   * @param sessionId Session ID
   */
  private clearSessionTimeout(sessionId: string): void {
    const timeout = this.timeouts.get(sessionId);

    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(sessionId);
    }
  }
}
