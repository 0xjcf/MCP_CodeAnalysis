// Import types first
import type { IRedisSessionStoreOptions, ISessionData, ISessionStore } from '@mcp/types';
import type { Redis as RedisType, RedisOptions } from 'ioredis';

// Then value imports
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

/**
 * Error codes for Redis session store operations
 */
export enum RedisSessionStoreErrorCode {
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  REDIS_URL_MISSING = 'REDIS_URL_MISSING',
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
  INVALID_SESSION_DATA = 'INVALID_SESSION_DATA',
  REDIS_ERROR = 'REDIS_ERROR',
  LOCK_ACQUISITION_FAILED = 'LOCK_ACQUISITION_FAILED',
  LOCK_RELEASE_FAILED = 'LOCK_RELEASE_FAILED',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  OPERATION_TIMEOUT = 'OPERATION_TIMEOUT',
}

/**
 * Custom error class for Redis session store operations
 */
export class RedisSessionStoreError extends Error {
  constructor(
    public readonly code: RedisSessionStoreErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'RedisSessionStoreError';
  }

  static fromError(code: RedisSessionStoreErrorCode, error: unknown): RedisSessionStoreError {
    if (error instanceof RedisSessionStoreError) {
      return error;
    }
    return new RedisSessionStoreError(
      code,
      error instanceof Error ? error.message : 'Unknown error',
      error,
    );
  }
}

/**
 * Type guard for Redis errors
 */
function isRedisError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Redis-backed implementation of the SessionStore interface.
 * Provides session management with TTL support and distributed locking.
 */
export class RedisSessionStore implements ISessionStore {
  private readonly redis: RedisType;
  private readonly prefix: string;
  private readonly defaultTtl: number;
  private readonly lockTimeout: number;
  private readonly releaseLockScript: string;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private isConnected: boolean = false;

  /**
   * Creates a new RedisSessionStore
   * @param options Configuration options for the Redis session store
   * @throws {RedisSessionStoreError} If Redis connection fails
   */
  constructor(options: IRedisSessionStoreOptions) {
    if (!options.redisUrl) {
      throw new RedisSessionStoreError(
        RedisSessionStoreErrorCode.REDIS_URL_MISSING,
        'Redis URL is required',
      );
    }

    this.prefix = options.prefix ?? 'mcp:';
    this.defaultTtl = options.defaultTtl ?? 3600; // 1 hour
    this.lockTimeout = options.lockTimeout ?? 30000; // 30 seconds
    this.maxRetries = options.retryStrategy?.maxRetries ?? 3;
    this.retryDelay = options.retryStrategy?.retryDelay ?? 1000;

    const redisOptions: RedisOptions = {
      ...options.redisOptions,
      retryStrategy: (times: number): number => {
        if (times > this.maxRetries) {
          return -1; // Stop retrying
        }
        return Math.min(times * this.retryDelay, 2000);
      },
      reconnectOnError: (err: Error) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    };

    try {
      this.redis = new Redis(options.redisUrl, redisOptions);
      this.setupEventHandlers();
    } catch (error) {
      throw RedisSessionStoreError.fromError(
        RedisSessionStoreErrorCode.INITIALIZATION_FAILED,
        error,
      );
    }

    this.releaseLockScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
  }

  private setupEventHandlers(): void {
    this.redis.on('connect', () => {
      this.isConnected = true;
    });

    this.redis.on('error', (error: Error) => {
      this.isConnected = false;
      throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.CONNECTION_ERROR, error);
    });

    this.redis.on('reconnecting', () => {
      this.isConnected = false;
    });
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.redis.ping();
        this.isConnected = true;
      } catch (error) {
        throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.CONNECTION_ERROR, error);
      }
    }
  }

  private getSessionKey(sessionId: string): string {
    return `${this.prefix}${sessionId}`;
  }

  private getLockKey(sessionId: string): string {
    return `${this.prefix}lock:${sessionId}`;
  }

  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.maxRetries,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.ensureConnection();
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        }
      }
    }

    throw RedisSessionStoreError.fromError(
      RedisSessionStoreErrorCode.OPERATION_TIMEOUT,
      lastError instanceof Error
        ? lastError.message
        : `Operation failed after ${maxRetries} retries`,
    );
  }

  private isValidSessionData(data: unknown): data is ISessionData {
    return (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      typeof (data as { id: unknown }).id === 'string' &&
      'createdAt' in data &&
      typeof (data as { createdAt: unknown }).createdAt === 'number' &&
      'updatedAt' in data &&
      typeof (data as { updatedAt: unknown }).updatedAt === 'number'
    );
  }

  /**
   * Retrieves a session from Redis
   * @param sessionId The ID of the session to retrieve
   * @returns The session data or null if not found
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async getSession<T extends ISessionData>(sessionId: string): Promise<T | null> {
    try {
      const data = await this.redis.get(this.getSessionKey(sessionId));
      if (!data) {
        return null;
      }

      const parsedData = JSON.parse(data);
      if (!this.isValidSessionData(parsedData)) {
        throw new RedisSessionStoreError(
          RedisSessionStoreErrorCode.INVALID_SESSION_DATA,
          'Invalid session data format',
        );
      }

      return parsedData as T;
    } catch (error) {
      throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.REDIS_ERROR, error);
    }
  }

  /**
   * Stores a session in Redis
   * @param sessionId The ID of the session to store
   * @param data The session data to store
   * @param ttl Optional TTL in milliseconds
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async setSession<T extends ISessionData = ISessionData>(
    sessionId: string,
    data: T,
    ttl?: number,
  ): Promise<void> {
    try {
      const key = this.getSessionKey(sessionId);
      const serializedData = JSON.stringify(data);
      const actualTtl = Math.floor((ttl ?? this.defaultTtl) / 1000); // Convert to seconds

      await this.redis.setex(key, actualTtl, serializedData);
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.REDIS_ERROR, error);
      }
      throw error;
    }
  }

  /**
   * Deletes a session from Redis
   * @param sessionId The ID of the session to delete
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      const key = this.getSessionKey(sessionId);
      await this.redis.del(key);
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.REDIS_ERROR, error);
      }
      throw error;
    }
  }

  /**
   * Clears all data for a session
   * @param sessionId The ID of the session to clear
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async clearSession(sessionId: string): Promise<void> {
    try {
      const key = this.getSessionKey(sessionId);
      await this.redis.del(key);
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.REDIS_ERROR, error);
      }
      throw error;
    }
  }

  /**
   * Gets all session IDs
   * @returns Array of session IDs
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async getSessions(): Promise<string[]> {
    try {
      const pattern = `${this.prefix}*`;
      const keys = await this.redis.keys(pattern);
      return keys.map((key: string) => key.slice(this.prefix.length));
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.REDIS_ERROR, error);
      }
      throw error;
    }
  }

  /**
   * Clears all sessions
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async clear(): Promise<void> {
    try {
      const pattern = `${this.prefix}*`;
      const keys = await this.redis.keys(pattern);

      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.REDIS_ERROR, error);
      }
      throw error;
    }
  }

  /**
   * Acquires a lock for a session
   * @param sessionId The ID of the session to lock
   * @param timeout Optional timeout in milliseconds
   * @returns Lock token if successful, null if failed
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async acquireLock(sessionId: string, timeout?: number): Promise<string | null> {
    try {
      const key = this.getLockKey(sessionId);
      const lockId = uuidv4();
      const lockTimeout = timeout ?? this.lockTimeout;

      const acquired = await this.redis.set(key, lockId, 'PX', lockTimeout, 'NX');
      return acquired ? lockId : null;
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(
          RedisSessionStoreErrorCode.LOCK_ACQUISITION_FAILED,
          error,
        );
      }
      throw error;
    }
  }

  /**
   * Releases a lock for a session
   * @param sessionId The ID of the session to unlock
   * @param lockToken The token received when acquiring the lock
   * @returns True if lock was released, false if token didn't match
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async releaseLock(sessionId: string, lockId: string): Promise<boolean> {
    try {
      const key = this.getLockKey(sessionId);
      const result = (await this.redis.eval(this.releaseLockScript, 1, key, lockId)) as number;
      return result === 1;
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(
          RedisSessionStoreErrorCode.LOCK_RELEASE_FAILED,
          error,
        );
      }
      throw error;
    }
  }

  /**
   * Extends the TTL of a session
   * @param sessionId The ID of the session
   * @param ttl Optional new TTL in milliseconds
   * @returns True if TTL was extended, false if session doesn't exist
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async extendSessionTtl(sessionId: string, ttl?: number): Promise<boolean> {
    try {
      const key = this.getSessionKey(sessionId);
      const actualTtl = ttl ?? this.defaultTtl;
      const exists = await this.redis.exists(key);

      if (exists) {
        await this.redis.expire(key, actualTtl);
        return true;
      }

      return false;
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.REDIS_ERROR, error);
      }
      throw error;
    }
  }

  /**
   * Gets the remaining TTL of a session in milliseconds
   * @param sessionId The ID of the session
   * @returns TTL in milliseconds, -2 if key doesn't exist, -1 if no TTL
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async getSessionTtl(sessionId: string): Promise<number> {
    try {
      const key = this.getSessionKey(sessionId);
      const ttl = await this.redis.ttl(key);
      return ttl;
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.REDIS_ERROR, error);
      }
      throw error;
    }
  }

  /**
   * Creates a new session if it doesn't exist
   * @param sessionId The ID of the session
   * @param data The session data
   * @param ttl Optional TTL in milliseconds
   * @returns The session data
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async createSessionIfNotExists<T extends ISessionData = ISessionData>(
    sessionId: string,
    data: T,
    ttl?: number,
  ): Promise<T> {
    try {
      const key = this.getSessionKey(sessionId);
      const serializedData = JSON.stringify(data);
      const actualTtl = ttl ?? this.defaultTtl;

      const created = await this.redis.set(key, serializedData, 'EX', actualTtl, 'NX');

      if (!created) {
        const existingData = await this.redis.get(key);
        if (!existingData) {
          throw new RedisSessionStoreError(
            RedisSessionStoreErrorCode.SESSION_NOT_FOUND,
            'Session not found',
          );
        }
        return JSON.parse(existingData) as T;
      }

      return data;
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.REDIS_ERROR, error);
      }
      throw error;
    }
  }

  /**
   * Disconnects from Redis
   * @throws {RedisSessionStoreError} If Redis operation fails
   */
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      if (isRedisError(error)) {
        throw RedisSessionStoreError.fromError(RedisSessionStoreErrorCode.REDIS_ERROR, error);
      }
      throw error;
    }
  }
}
