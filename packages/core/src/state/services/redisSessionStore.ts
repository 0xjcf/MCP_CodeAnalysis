/**
 * Redis Session Store for MCP SDK
 */

import type { IRedisSessionStoreOptions, ISessionStore, ISessionData } from '@mcp/types';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

/**
 * Error class for Redis session store operations
 */
export class RedisSessionStoreError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'RedisSessionStoreError';
  }
}

/**
 * Redis-backed implementation of the SessionStore interface.
 * Provides session management with TTL support and distributed locking.
 */
export class RedisSessionStore<T extends ISessionData = ISessionData> implements ISessionStore<T> {
  private readonly redisClient: Redis;
  private readonly prefix: string;
  private readonly defaultTtl: number;
  private readonly lockTimeout: number;
  private readonly releaseLockScript = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

  /**
   * Creates a new RedisSessionStore
   * @param options Configuration options for the Redis session store
   */
  constructor(options: IRedisSessionStoreOptions) {
    this.redisClient = new Redis(options.redisUrl);
    this.prefix = options.prefix || 'mcp:session:';
    this.defaultTtl = options.defaultTtl || 3600; // 1 hour default
    this.lockTimeout = options.lockTimeout || 30000; // 30 seconds default

    // Handle Redis client events
    this.redisClient.on('error', (err: Error) => {
      throw new RedisSessionStoreError(err.message, 'REDIS_ERROR');
    });
  }

  /**
   * Gets the Redis key for a session ID
   * @param sessionId The session ID
   * @returns The Redis key
   */
  private getKey(sessionId: string): string {
    return `${this.prefix}${sessionId}`;
  }

  /**
   * Gets the Redis key for a session lock
   * @param sessionId The session ID
   * @returns The Redis lock key
   */
  private getLockKey(sessionId: string): string {
    return `${this.prefix}lock:${sessionId}`;
  }

  /**
   * Retrieves a session from Redis
   * @param sessionId The ID of the session to retrieve
   * @returns The session data or null if not found
   */
  async getSession(sessionId: string): Promise<T | null> {
    try {
      const data = await this.redisClient.get(this.getKey(sessionId));
      if (!data) {
        return null;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to get session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GET_SESSION_ERROR',
      );
    }
  }

  /**
   * Stores a session in Redis
   * @param sessionId The ID of the session
   * @param data The session data to store
   * @param ttl Optional TTL in seconds (uses default if not provided)
   */
  async setSession(sessionId: string, data: T, ttl?: number): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      const ttlValue = ttl ?? this.defaultTtl;
      await this.redisClient.setex(key, ttlValue, JSON.stringify(data));
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to set session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SET_SESSION_ERROR',
      );
    }
  }

  /**
   * Removes a session from Redis
   * @param sessionId The ID of the session to remove
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      await this.redisClient.del(this.getKey(sessionId));
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to delete session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DELETE_SESSION_ERROR',
      );
    }
  }

  /**
   * Removes a session from Redis (alias for deleteSession)
   * @param sessionId The ID of the session to remove
   */
  async clearSession(sessionId: string): Promise<void> {
    await this.deleteSession(sessionId);
  }

  /**
   * Gets all active session IDs
   * @returns Array of session IDs
   */
  async getSessions(): Promise<string[]> {
    try {
      const keys = await this.redisClient.keys(`${this.prefix}*`);
      return keys.map(key => key.slice(this.prefix.length));
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to get sessions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GET_SESSIONS_ERROR',
      );
    }
  }

  /**
   * Clears all sessions from Redis
   */
  async clear(): Promise<void> {
    try {
      const keys = await this.redisClient.keys(`${this.prefix}*`);
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
      }
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to clear sessions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CLEAR_SESSIONS_ERROR',
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
      const sessionKey = this.getKey(sessionId);
      const result = await this.redisClient.expire(sessionKey, ttl);
      return result === 1;
    } catch (error) {
      throw new RedisSessionStoreError(
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
      const sessionKey = this.getKey(sessionId);
      const ttl = await this.redisClient.ttl(sessionKey);
      return ttl >= 0 ? ttl : null;
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to get session TTL: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GET_TTL_ERROR',
      );
    }
  }

  /**
   * Acquires a distributed lock on a session
   * @param sessionId The ID of the session to lock
   * @param timeout Optional timeout in milliseconds (uses default if not provided)
   * @returns Lock token if successful, null if lock could not be acquired
   */
  async acquireLock(sessionId: string, timeout?: number): Promise<string | null> {
    try {
      const lockTimeout = timeout ?? this.lockTimeout;
      const lockToken = uuidv4();
      const lockKey = this.getLockKey(sessionId);

      const result = await this.redisClient.set(lockKey, lockToken, 'PX', lockTimeout, 'NX');
      return result === 'OK' ? lockToken : null;
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to acquire lock: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ACQUIRE_LOCK_ERROR',
      );
    }
  }

  /**
   * Releases a distributed lock
   * @param sessionId The ID of the session
   * @param token The lock token returned from acquireLock
   * @returns True if the lock was released, false if the token doesn't match
   */
  async releaseLock(sessionId: string, token: string): Promise<boolean> {
    try {
      const lockKey = this.getLockKey(sessionId);
      const result = await this.redisClient.eval(this.releaseLockScript, 1, lockKey, token);
      return result === 1;
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to release lock: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'RELEASE_LOCK_ERROR',
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
      const key = this.getKey(sessionId);
      const exists = await this.redisClient.exists(key);

      if (!exists) {
        await this.setSession(sessionId, initialState);
        return initialState;
      }

      const data = await this.getSession(sessionId);
      return data ?? initialState;
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CREATE_SESSION_ERROR',
      );
    }
  }

  /**
   * Closes the Redis connection
   */
  async disconnect(): Promise<void> {
    try {
      await this.redisClient.quit();
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'DISCONNECT_ERROR',
      );
    }
  }

  /**
   * Closes the Redis connection (alias for disconnect)
   */
  async close(): Promise<void> {
    await this.disconnect();
  }

  /**
   * Static method to check if Redis is available at a given URL
   * @param redisUrl Redis connection URL
   * @returns Promise resolving to true if Redis is available, false otherwise
   */
  static async isRedisAvailable(redisUrl: string): Promise<boolean> {
    const redis = new Redis(redisUrl);
    try {
      await redis.ping();
      return true;
    } catch {
      return false;
    } finally {
      await redis.quit();
    }
  }
}
