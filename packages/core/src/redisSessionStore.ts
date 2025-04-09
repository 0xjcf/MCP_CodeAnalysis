/**
 * Redis session store implementation for MCP Code Analysis
 * @module @mcp/core
 */

import type { ISessionStore, ISessionData } from '@mcp/types';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

import { Logger } from './utils/logger.js';

import type { IAnalysisResult } from './index.js';

export interface IRedisSessionStoreOptions {
  redisUrl: string;
  prefix?: string;
  defaultTtl?: number; // Time to live in seconds
  lockTimeout?: number; // Lock timeout in milliseconds
}

export interface IAnalysisSessionData extends ISessionData {
  analysisResult: IAnalysisResult;
}

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
  private readonly logger: Logger;
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
    this.logger = new Logger('RedisSessionStore');

    // Handle Redis client events
    this.redisClient.on('error', (err: Error) => {
      this.logger.error('Redis client error', err);
      this.redisClient.emit('storeError', new RedisSessionStoreError(err.message, 'REDIS_ERROR'));
    });

    this.redisClient.on('connect', () => {
      this.logger.info('Redis client connected');
      this.redisClient.emit('storeConnected');
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
  async getSession(sessionId: string): Promise<T | null> {
    try {
      const data = await this.redisClient.get(this.getKey(sessionId));
      if (!data) {
        return null;
      }
      try {
        return JSON.parse(data) as T;
      } catch (parseError) {
        throw new RedisSessionStoreError('Failed to parse session data', 'PARSE_ERROR');
      }
    } catch (error) {
      if (error instanceof RedisSessionStoreError) {
        throw error;
      }
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
      const serializedData = JSON.stringify(data);
      await this.redisClient.setex(key, ttlValue, serializedData);
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to set session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SET_SESSION_ERROR',
      );
    }
  }

  /**
   * Deletes a session from Redis
   * @param sessionId The ID of the session to delete
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
   * Clears a session from Redis
   * @param sessionId The ID of the session to clear
   */
  async clearSession(sessionId: string): Promise<void> {
    try {
      await this.redisClient.del(this.getKey(sessionId));
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to clear session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CLEAR_SESSION_ERROR',
      );
    }
  }

  /**
   * Gets all session IDs
   * @returns Array of session IDs
   */
  async getSessions(): Promise<string[]> {
    try {
      const keys = await this.redisClient.keys(`${this.prefix}*`);
      return keys.map(key => key.replace(this.prefix, ''));
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to get sessions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GET_SESSIONS_ERROR',
      );
    }
  }

  /**
   * Clears all sessions
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
        'CLEAR_ERROR',
      );
    }
  }

  /**
   * Acquires a lock for a session
   * @param sessionId The ID of the session
   * @param timeout Optional timeout in milliseconds
   * @returns Lock token or null if lock could not be acquired
   */
  async acquireLock(sessionId: string, timeout?: number): Promise<string | null> {
    try {
      const lockKey = this.getLockKey(sessionId);
      const token = uuidv4();
      const timeoutMs = timeout ?? this.lockTimeout;
      const result = await this.redisClient.set(lockKey, token, 'PX', timeoutMs, 'NX');
      return result === 'OK' ? token : null;
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to acquire lock: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ACQUIRE_LOCK_ERROR',
      );
    }
  }

  /**
   * Releases a lock for a session
   * @param sessionId The ID of the session
   * @param token The lock token
   * @returns true if lock was released, false otherwise
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
   * Extends the TTL of a session
   * @param sessionId The ID of the session
   * @param ttl The new TTL in seconds
   * @returns true if TTL was extended, false otherwise
   */
  async extendSessionTtl(sessionId: string, ttl: number): Promise<boolean> {
    try {
      const result = await this.redisClient.expire(this.getKey(sessionId), ttl);
      return result === 1;
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to extend session TTL: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'EXTEND_TTL_ERROR',
      );
    }
  }

  /**
   * Gets the TTL of a session
   * @param sessionId The ID of the session
   * @returns TTL in seconds or null if session does not exist
   */
  async getSessionTtl(sessionId: string): Promise<number | null> {
    try {
      const ttl = await this.redisClient.ttl(this.getKey(sessionId));
      return ttl >= 0 ? ttl : null;
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to get session TTL: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'GET_TTL_ERROR',
      );
    }
  }

  /**
   * Creates a session if it does not exist
   * @param sessionId The ID of the session
   * @param initialState The initial state of the session
   * @returns The session data
   */
  async createSessionIfNotExists(sessionId: string, initialState: T): Promise<T> {
    try {
      const exists = await this.redisClient.exists(this.getKey(sessionId));
      if (exists === 0) {
        await this.setSession(sessionId, initialState);
      }
      const session = await this.getSession(sessionId);
      if (!session) {
        throw new RedisSessionStoreError(
          'Failed to retrieve created session',
          'SESSION_RETRIEVAL_ERROR',
        );
      }
      return session;
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CREATE_SESSION_ERROR',
      );
    }
  }

  /**
   * Disconnects from Redis
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
   * Closes the Redis connection
   */
  async close(): Promise<void> {
    try {
      await this.redisClient.quit();
    } catch (error) {
      throw new RedisSessionStoreError(
        `Failed to close connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CLOSE_ERROR',
      );
    }
  }

  /**
   * Checks if Redis is available
   * @param redisUrl The Redis URL to check
   * @returns true if Redis is available, false otherwise
   */
  static async isRedisAvailable(redisUrl: string): Promise<boolean> {
    try {
      const client = new Redis(redisUrl);
      await client.ping();
      await client.quit();
      return true;
    } catch {
      return false;
    }
  }
}
