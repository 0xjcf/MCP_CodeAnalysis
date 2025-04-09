/**
 * Session Store Factory Module
 *
 * This module provides factory functions for creating SessionStore instances
 * with automatic backend detection and fallback mechanisms.
 *
 * Key features:
 * - Redis-backed storage for production environments
 * - Memory-backed storage for development and testing
 * - Automatic fallback if Redis is unavailable
 * - Configurable session options
 */

import type { ISessionStore, ISessionData } from '@mcp/types';
import { Redis } from 'ioredis';

import { MemorySessionStore } from './memorySessionStore.js';
import { RedisSessionStore } from './redisSessionStore.js';

/**
 * Error class for session store factory operations
 */
export class SessionStoreFactoryError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'SessionStoreFactoryError';
  }
}

/**
 * Enum defining the available session store types
 */
export enum SessionStoreType {
  Redis = 'redis',
  Memory = 'memory',
}

/**
 * Interface for session store factory options
 */
export interface ISessionStoreFactoryOptions {
  /**
   * Redis connection URL (default: redis://localhost:6379)
   */
  redisUrl?: string;

  /**
   * Key prefix for Redis keys (default: "mcp:session:")
   */
  prefix?: string;

  /**
   * Default TTL for session entries in seconds (default: 3600 - 1 hour)
   */
  defaultTtl?: number;

  /**
   * Lock timeout in milliseconds (default: 30000 - 30 seconds)
   */
  lockTimeout?: number;

  /**
   * Prefer memory store even if Redis is available
   */
  preferMemory?: boolean;

  /**
   * Whether to show verbose logs
   */
  verbose?: boolean;
}

/**
 * Type guard for ISessionStoreFactoryOptions
 */
export function isSessionStoreFactoryOptions(value: unknown): value is ISessionStoreFactoryOptions {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const options = value as ISessionStoreFactoryOptions;
  return (
    (!('redisUrl' in options) || typeof options.redisUrl === 'string') &&
    (!('prefix' in options) || typeof options.prefix === 'string') &&
    (!('defaultTtl' in options) || typeof options.defaultTtl === 'number') &&
    (!('lockTimeout' in options) || typeof options.lockTimeout === 'number') &&
    (!('preferMemory' in options) || typeof options.preferMemory === 'boolean') &&
    (!('verbose' in options) || typeof options.verbose === 'boolean')
  );
}

/**
 * Validates session store factory options
 * @param options Options to validate
 * @throws SessionStoreFactoryError if options are invalid
 */
function validateOptions(options: ISessionStoreFactoryOptions): void {
  if (!isSessionStoreFactoryOptions(options)) {
    throw new SessionStoreFactoryError('Invalid session store factory options', 'INVALID_OPTIONS');
  }

  if (options.defaultTtl !== undefined && options.defaultTtl <= 0) {
    throw new SessionStoreFactoryError('Default TTL must be positive', 'INVALID_TTL');
  }

  if (options.lockTimeout !== undefined && options.lockTimeout <= 0) {
    throw new SessionStoreFactoryError('Lock timeout must be positive', 'INVALID_LOCK_TIMEOUT');
  }
}

/**
 * Checks if Redis is available at the given URL
 * @param redisUrl Optional Redis URL to check
 * @returns Promise that resolves to true if Redis is available
 */
export async function isRedisAvailable(redisUrl?: string): Promise<boolean> {
  let redis: Redis | null = null;
  try {
    redis = new Redis(redisUrl || 'redis://localhost:6379');
    await redis.ping();
    return true;
  } catch (error) {
    return false;
  } finally {
    if (redis) {
      await redis.quit();
    }
  }
}

/**
 * Creates a session store based on the provided options
 * @param options Session store factory options
 * @returns Promise that resolves to a session store instance
 */
export async function createSessionStore<T extends ISessionData = ISessionData>(
  options: ISessionStoreFactoryOptions = {},
): Promise<ISessionStore<T>> {
  try {
    validateOptions(options);
    const { redisUrl = 'redis://localhost:6379', preferMemory = false, verbose = false } = options;

    if (preferMemory) {
      if (verbose) {
        console.log('Creating memory session store (preferred)');
      }
      return createMemorySessionStore<T>(options);
    }

    const redisAvailable = await isRedisAvailable(redisUrl);
    if (redisAvailable) {
      if (verbose) {
        console.log('Creating Redis session store');
      }
      return createRedisSessionStore<T>(options);
    }

    if (verbose) {
      console.log('Redis not available, falling back to memory session store');
    }
    return createMemorySessionStore<T>(options);
  } catch (error) {
    throw new SessionStoreFactoryError(
      `Failed to create session store: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'CREATE_STORE_ERROR',
    );
  }
}

/**
 * Creates a memory session store
 * @param options Session store factory options
 * @returns Memory session store instance
 */
export function createMemorySessionStore<T extends ISessionData = ISessionData>(
  options: ISessionStoreFactoryOptions = {},
): MemorySessionStore<T> {
  try {
    validateOptions(options);
    const { prefix = 'mcp:session:', defaultTtl = 3600, lockTimeout = 30000 } = options;
    return new MemorySessionStore<T>({
      prefix,
      defaultTtl,
      lockTimeout,
    });
  } catch (error) {
    throw new SessionStoreFactoryError(
      `Failed to create memory session store: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      'CREATE_MEMORY_STORE_ERROR',
    );
  }
}

/**
 * Creates a Redis session store
 * @param options Session store factory options
 * @returns Redis session store instance
 */
export function createRedisSessionStore<T extends ISessionData = ISessionData>(
  options: ISessionStoreFactoryOptions = {},
): RedisSessionStore<T> {
  try {
    validateOptions(options);
    const {
      redisUrl = 'redis://localhost:6379',
      prefix = 'mcp:session:',
      defaultTtl = 3600,
      lockTimeout = 30000,
    } = options;
    return new RedisSessionStore<T>({
      redisUrl,
      prefix,
      defaultTtl,
      lockTimeout,
    });
  } catch (error) {
    throw new SessionStoreFactoryError(
      `Failed to create Redis session store: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      'CREATE_REDIS_STORE_ERROR',
    );
  }
}
