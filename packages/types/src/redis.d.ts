/**
 * Redis-related types for the application
 */
/**
 * Represents session data stored in Redis
 */
export interface ISessionData {
  id: string;
  createdAt: number;
  lastAccessed: number;
  data: Record<string, unknown>;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    [key: string]: unknown;
  };
}
/**
 * Interface for session store operations
 */
export interface ISessionStore<T extends ISessionData = ISessionData> {
  getSession(sessionId: string): Promise<T | null>;
  setSession(sessionId: string, data: T, ttl?: number): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  clearSession(sessionId: string): Promise<void>;
  getSessions(): Promise<string[]>;
  clear(): Promise<void>;
  acquireLock(sessionId: string, timeout?: number): Promise<string | null>;
  releaseLock(sessionId: string, lockToken: string): Promise<boolean>;
  extendSessionTtl(sessionId: string, ttl: number): Promise<boolean>;
  getSessionTtl(sessionId: string): Promise<number | null>;
  createSessionIfNotExists(sessionId: string, initialState: T): Promise<T>;
}
/**
 * Configuration options for Redis session store
 */
export interface IRedisSessionStoreOptions {
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
  /**
   * Connection retry options
   */
  retryStrategy?: {
    maxRetries?: number;
    retryDelay?: number;
  };
  /**
   * Enable/disable connection pooling
   */
  enablePooling?: boolean;
  /**
   * Pool size for connection pooling
   */
  poolSize?: number;
  /**
   * Additional Redis client options
   */
  redisOptions?: import('ioredis').RedisOptions;
}
/**
 * Configuration options for Redis tool execution service
 */
export interface IRedisToolExecutionServiceOptions {
  /**
   * Maximum number of concurrent tool executions
   */
  maxConcurrentExecutions?: number;
  /**
   * Timeout for tool execution in milliseconds
   */
  executionTimeout?: number;
  /**
   * Retry configuration for failed executions
   */
  retryConfig?: {
    maxRetries: number;
    backoffFactor: number;
    initialDelay: number;
  };
  /**
   * Enable/disable request batching
   */
  enableBatching?: boolean;
  /**
   * Batch size for request batching
   */
  batchSize?: number;
  /**
   * Batch timeout in milliseconds
   */
  batchTimeout?: number;
}
/**
 * Generic data interface for Redis operations
 */
export interface IData {
  id: string;
  type: string;
  data: unknown;
  metadata?: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}
/**
 * Generic store interface for Redis operations
 */
export interface IStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  ttl(key: string): Promise<number | null>;
  keys(pattern: string): Promise<string[]>;
}
/**
 * Generic result interface for Redis operations
 */
export interface IResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    executionTime?: number;
    [key: string]: unknown;
  };
}
