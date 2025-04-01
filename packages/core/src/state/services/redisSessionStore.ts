import { Redis } from 'ioredis';
import { SessionStore, SessionData } from './types.js';
import { v4 as uuidv4 } from 'uuid';

export interface RedisSessionStoreOptions {
  /**
   * Redis connection URL (e.g., redis://localhost:6379)
   */
  redisUrl: string;

  /**
   * Key prefix for Redis keys (default: "mcp:")
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
 * Redis-backed implementation of the SessionStore interface.
 * Provides session management with TTL support and distributed locking.
 */
export class RedisSessionStore implements SessionStore {
  private redis: Redis;
  private prefix: string;
  private defaultTtl: number;
  private lockTimeout: number;
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
  constructor(options: RedisSessionStoreOptions) {
    this.redis = new Redis(options.redisUrl);
    this.prefix = options.prefix || 'mcp:session:';
    this.defaultTtl = options.defaultTtl || 3600; // 1 hour default
    this.lockTimeout = options.lockTimeout || 30000; // 30 seconds default

    // Handle Redis client events
    this.redis.on('error', (err: Error) => {
      console.error('Redis client error:', err);
    });
  }

  private getKey(sessionId: string): string {
    return `${this.prefix}${sessionId}`;
  }

  private getLockKey(sessionId: string): string {
    return `${this.prefix}lock:${sessionId}`;
  }

  /**
   * Retrieves a session from Redis
   * @param sessionId The ID of the session to retrieve
   * @returns The session data or null if not found
   */
  async getSession<T = SessionData>(sessionId: string): Promise<T | null> {
    try {
      const data = await this.redis.get(this.getKey(sessionId));
      if (!data) {
        return null;
      }
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error(`Failed to parse session data for ${sessionId}:`, error);
        throw new Error('Failed to parse session data');
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Failed to parse session data') {
        throw error;
      }
      console.error(`Error retrieving session ${sessionId}:`, error);
      throw new Error('Redis operation failed');
    }
  }

  /**
   * Stores a session in Redis
   * @param sessionId The ID of the session
   * @param data The session data to store
   * @param ttl Optional TTL in seconds (uses default if not provided)
   */
  async setSession<T = SessionData>(sessionId: string, data: T, ttl?: number): Promise<void> {
    const key = this.getKey(sessionId);
    const ttlValue = ttl || this.defaultTtl;
    await this.redis.setex(key, ttlValue, JSON.stringify(data));
  }

  /**
   * Removes a session from Redis
   * @param sessionId The ID of the session to remove
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.redis.del(this.getKey(sessionId));
  }

  /**
   * Removes a session from Redis
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
    const keys = await this.redis.keys(`${this.prefix}*`);
    return keys.map(key => key.slice(this.prefix.length));
  }

  /**
   * Clears all sessions from Redis
   */
  async clear(): Promise<void> {
    const keys = await this.redis.keys(`${this.prefix}*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  /**
   * Acquires a distributed lock on a session
   * @param sessionId The ID of the session to lock
   * @param timeout Optional timeout in milliseconds (uses default if not provided)
   * @returns Lock token if successful, null if lock could not be acquired
   */
  async acquireLock(sessionId: string, timeout?: number): Promise<string | null> {
    const lockTimeout = timeout || this.lockTimeout;
    const lockToken = uuidv4();
    const lockKey = this.getLockKey(sessionId);

    // Try to set the lock key with NX option (only if it doesn't exist)
    const result = await this.redis.set(lockKey, lockToken, 'PX', lockTimeout, 'NX');

    return result === 'OK' ? lockToken : null;
  }

  /**
   * Releases a distributed lock
   * @param sessionId The ID of the session
   * @param token The lock token returned from acquireLock
   * @returns True if the lock was released, false if the token doesn't match
   */
  async releaseLock(sessionId: string, token: string): Promise<boolean> {
    const lockKey = this.getLockKey(sessionId);

    // Use the Lua script to atomically check and release the lock
    const result = await this.redis.eval(
      this.releaseLockScript,
      1, // Number of keys
      lockKey,
      token,
    );

    return result === 1;
  }

  /**
   * Extends the TTL of a session
   * @param sessionId ID of the session
   * @param ttl New TTL in seconds
   * @returns True if successful, false if session doesn't exist
   */
  async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean> {
    const sessionKey = this.getKey(sessionId);
    const result = await this.redis.expire(sessionKey, ttl);
    return result === 1;
  }

  /**
   * Gets the remaining TTL for a session
   * @param sessionId ID of the session
   * @returns Remaining TTL in seconds, or null if session doesn't exist
   */
  async getSessionTtl(sessionId: string): Promise<number | null> {
    const sessionKey = this.getKey(sessionId);
    const ttl = await this.redis.ttl(sessionKey);
    return ttl >= 0 ? ttl : null;
  }

  /**
   * Creates a session if it doesn't exist, or returns the existing session
   * @param sessionId The ID of the session
   * @param initialState The initial state if the session needs to be created
   * @returns The session state (either existing or newly created)
   */
  async createSessionIfNotExists<T = SessionData>(sessionId: string, initialState: T): Promise<T> {
    const key = this.getKey(sessionId);
    const exists = await this.redis.exists(key);

    if (!exists) {
      await this.setSession(sessionId, initialState);
      return initialState;
    }

    const data = await this.getSession<T>(sessionId);
    return data || initialState;
  }

  /**
   * Closes the Redis connection
   */
  async disconnect(): Promise<void> {
    await this.redis.quit();
  }

  /**
   * Static method to check if Redis is available at a given URL
   * @param redisUrl Redis connection URL
   * @returns Promise resolving to true if Redis is available, false otherwise
   */
  static async isRedisAvailable(redisUrl: string): Promise<boolean> {
    try {
      const redis = new Redis(redisUrl);
      await redis.ping();
      await redis.quit();
      return true;
    } catch (error) {
      return false;
    }
  }
}
