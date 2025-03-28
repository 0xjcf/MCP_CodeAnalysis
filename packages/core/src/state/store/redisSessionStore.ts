import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

export interface SessionStore {
  getSession<T>(sessionId: string): Promise<T | null>;
  setSession<T>(sessionId: string, state: T, ttl?: number): Promise<void>;
  clearSession(sessionId: string): Promise<void>;
  getSessions(): Promise<string[]>;
  acquireLock(sessionId: string, timeout?: number): Promise<string | null>;
  releaseLock(sessionId: string, token: string): Promise<boolean>;
  extendSessionTtl(sessionId: string, ttl: number): Promise<boolean>;
  getSessionTtl(sessionId: string): Promise<number | null>;
  createSessionIfNotExists<T>(sessionId: string, initialState: T): Promise<T>;
}

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
  private client: Redis;
  private prefix: string;
  private defaultTtl: number;
  private lockTimeout: number;
  private releaseLockScript: string = "";

  /**
   * Creates a new RedisSessionStore
   * @param options Configuration options for the Redis session store
   */
  constructor(options: RedisSessionStoreOptions) {
    this.client = new Redis(options.redisUrl);
    this.prefix = options.prefix || "mcp:";
    this.defaultTtl = options.defaultTtl || 3600; // 1 hour default
    this.lockTimeout = options.lockTimeout || 30000; // 30 seconds default

    // Handle Redis client events - with safety check for tests
    if (typeof this.client.on === "function") {
      this.client.on("error", (err: Error) => {
        console.error("Redis client error:", err);
      });
    }

    // Initialize Lua script for atomic lock release
    this.initializeLockScript();
  }

  /**
   * Initializes Lua script for atomic lock release
   * The script ensures the lock token matches before deleting the lock
   */
  private initializeLockScript(): void {
    // Lua script for atomic lock release operations
    this.releaseLockScript = `
      -- Check if the lock exists and has the correct token
      if redis.call('get', KEYS[1]) == ARGV[1] then
        -- If token matches, delete the lock
        return redis.call('del', KEYS[1])
      else
        -- Token doesn't match or lock doesn't exist
        return 0
      end
    `;
  }

  /**
   * Closes the Redis connection
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.client && typeof this.client.quit === "function") {
        await this.client.quit();
      }
    } catch (error) {
      console.error("Error disconnecting from Redis:", error);
    }
  }

  /**
   * Gets the full Redis key with prefix for a session
   * @param sessionId The session ID
   * @returns The full Redis key
   */
  private getSessionKey(sessionId: string): string {
    return `${this.prefix}session:${sessionId}`;
  }

  /**
   * Gets the full Redis key with prefix for a session lock
   * @param sessionId The session ID
   * @returns The full Redis key for the lock
   */
  private getLockKey(sessionId: string): string {
    return `${this.prefix}lock:${sessionId}`;
  }

  /**
   * Retrieves a session from Redis
   * @param sessionId The ID of the session to retrieve
   * @returns The session data or null if not found
   */
  public async getSession<T>(sessionId: string): Promise<T | null> {
    try {
      if (!this.client) {
        throw new Error("Redis client not connected");
      }

      const key = this.getSessionKey(sessionId);
      let data;

      try {
        data = await this.client.get(key);
      } catch (err) {
        console.error(`Error retrieving session ${sessionId} from Redis:`, err);
        throw new Error(
          `Redis operation failed: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }

      if (!data) {
        return null;
      }

      try {
        return JSON.parse(data) as T;
      } catch (err) {
        console.error(`Error parsing session data for ${sessionId}:`, err);
        throw new Error("Failed to parse session data");
      }
    } catch (err) {
      // If the error is already a "Failed to parse session data" error, just rethrow it
      if (
        err instanceof Error &&
        err.message === "Failed to parse session data"
      ) {
        throw err;
      }
      // Otherwise rethrow the original error
      throw err;
    }
  }

  /**
   * Stores a session in Redis
   * @param sessionId The ID of the session
   * @param state The session state to store
   * @param ttl Optional TTL in seconds (uses default if not provided)
   */
  public async setSession<T>(
    sessionId: string,
    state: T,
    ttl?: number
  ): Promise<void> {
    try {
      const ttlValue = ttl || this.defaultTtl;
      await this.client.set(
        this.getSessionKey(sessionId),
        JSON.stringify(state),
        "EX",
        ttlValue
      );
    } catch (error) {
      console.error("Failed to set session in Redis:", error);
      throw new Error("Redis operation failed");
    }
  }

  /**
   * Removes a session from Redis
   * @param sessionId The ID of the session to remove
   */
  public async clearSession(sessionId: string): Promise<void> {
    try {
      await this.client.del(this.getSessionKey(sessionId));
    } catch (error) {
      console.error("Failed to clear session from Redis:", error);
      throw new Error("Redis operation failed");
    }
  }

  /**
   * Gets all active session IDs
   * @returns Array of session IDs
   */
  public async getSessions(): Promise<string[]> {
    try {
      const sessionKeyPattern = `${this.prefix}session:*`;
      const keys = await this.client.keys(sessionKeyPattern);

      // Extract just the session ID part from the keys
      return keys.map((key: string) => {
        const prefixLength = `${this.prefix}session:`.length;
        return key.substring(prefixLength);
      });
    } catch (error) {
      console.error("Failed to get sessions from Redis:", error);
      throw new Error("Redis operation failed");
    }
  }

  /**
   * Acquires a distributed lock on a session
   * @param sessionId The ID of the session to lock
   * @param timeout Optional timeout in milliseconds (uses default if not provided)
   * @returns Lock token if successful, null if lock could not be acquired
   */
  public async acquireLock(
    sessionId: string,
    timeout?: number
  ): Promise<string | null> {
    try {
      const lockTimeout = timeout || this.lockTimeout;
      const lockToken = uuidv4();
      const lockKey = this.getLockKey(sessionId);

      // Try to set the lock key with NX option (only if it doesn't exist)
      const result = await this.client.set(
        lockKey,
        lockToken,
        "PX", // Millisecond expiration
        lockTimeout,
        "NX" // Only set if the key does not exist
      );

      // If result is 'OK', we acquired the lock successfully
      if (result === "OK") {
        return lockToken;
      }

      // Lock acquisition failed
      return null;
    } catch (error) {
      console.error("Failed to acquire lock:", error);
      throw new Error("Redis operation failed");
    }
  }

  /**
   * Releases a distributed lock
   * @param sessionId The ID of the session
   * @param token The lock token returned from acquireLock
   * @returns True if the lock was released, false if the token doesn't match
   */
  public async releaseLock(sessionId: string, token: string): Promise<boolean> {
    try {
      const lockKey = this.getLockKey(sessionId);

      // Use the Lua script to atomically check and release the lock
      const result = await this.client.eval(
        this.releaseLockScript,
        1, // Number of keys
        lockKey, // KEYS[1]
        token // ARGV[1]
      );

      // If result is 1, the lock was successfully released
      return result === 1;
    } catch (error) {
      console.error("Failed to release lock:", error);
      throw new Error("Redis operation failed");
    }
  }

  /**
   * Extends the TTL of a session
   * @param sessionId ID of the session
   * @param ttl New TTL in seconds
   * @returns True if successful, false if session doesn't exist
   */
  public async extendSessionTtl(
    sessionId: string,
    ttl: number
  ): Promise<boolean> {
    try {
      const sessionKey = this.getSessionKey(sessionId);
      const result = await this.client.expire(sessionKey, ttl);

      // If result is 1, the TTL was successfully updated
      return result === 1;
    } catch (error) {
      console.error("Failed to extend session TTL:", error);
      throw new Error("Redis operation failed");
    }
  }

  /**
   * Gets the remaining TTL for a session
   * @param sessionId ID of the session
   * @returns Remaining TTL in seconds, or null if session doesn't exist
   */
  public async getSessionTtl(sessionId: string): Promise<number | null> {
    try {
      const sessionKey = this.getSessionKey(sessionId);
      const ttl = await this.client.ttl(sessionKey);

      // If TTL is -2, the key doesn't exist
      // If TTL is -1, the key exists but has no expiration
      if (ttl === -2) {
        return null;
      }

      return ttl;
    } catch (error) {
      console.error("Failed to get session TTL:", error);
      throw new Error("Redis operation failed");
    }
  }

  /**
   * Creates a session if it doesn't exist, or returns the existing session
   * @param sessionId The ID of the session
   * @param initialState The initial state if the session needs to be created
   * @returns The session state (either existing or newly created)
   */
  public async createSessionIfNotExists<T>(
    sessionId: string,
    initialState: T
  ): Promise<T> {
    try {
      // First check if the session already exists
      const existingSession = await this.getSession<T>(sessionId);
      if (existingSession) {
        return existingSession;
      }

      // If no existing session, create a new one
      await this.setSession<T>(sessionId, initialState);
      return initialState;
    } catch (err) {
      console.error(`Failed to create session: ${err}`);
      throw new Error(`Failed to create or retrieve session: ${err}`);
    }
  }
}
