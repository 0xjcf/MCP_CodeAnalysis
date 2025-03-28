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

import { SessionStore } from "./types.js";
import { RedisSessionStore } from "./redisSessionStore.js";
import { MemorySessionStore } from "./memorySessionStore.js";

export interface SessionStoreFactoryOptions {
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
 * Check if Redis is available at the given URL
 *
 * @param redisUrl Redis connection URL
 * @returns Promise resolving to true if Redis is available, false otherwise
 */
export async function isRedisAvailable(redisUrl?: string): Promise<boolean> {
  // If no Redis URL provided, Redis is not available
  if (!redisUrl) {
    return false;
  }

  try {
    return await RedisSessionStore.isRedisAvailable(redisUrl);
  } catch (error) {
    return false;
  }
}

/**
 * Create a session store with automatic backend detection
 *
 * This function will attempt to use Redis if a URL is provided and
 * if Redis is available. If Redis is unavailable or if memory is
 * preferred, it will fall back to the memory session store.
 *
 * @param options Session store options
 * @returns Promise resolving to a SessionStore instance
 */
export async function createSessionStore(
  options: SessionStoreFactoryOptions = {}
): Promise<SessionStore> {
  const redisUrl = options.redisUrl || "redis://localhost:6379";
  const preferMemory = options.preferMemory || false;
  const verbose = options.verbose || false;

  // If memory store is preferred, use it directly
  if (preferMemory) {
    if (verbose) {
      console.log("Using memory session store (explicitly preferred)");
    }
    return createMemorySessionStore(options);
  }

  // Try to use Redis if available
  try {
    const redisAvailable = await isRedisAvailable(redisUrl);

    if (redisAvailable) {
      if (verbose) {
        console.log(`Using Redis session store (${redisUrl})`);
      }
      return createRedisSessionStore(options);
    } else {
      if (verbose) {
        console.log(
          `Redis not available at ${redisUrl}, falling back to memory session store`
        );
      }
      return createMemorySessionStore(options);
    }
  } catch (error) {
    if (verbose) {
      console.warn(
        `Error checking Redis availability: ${error}, falling back to memory session store`
      );
    }
    return createMemorySessionStore(options);
  }
}

/**
 * Create a memory session store
 *
 * @param options Session store options
 * @returns A MemorySessionStore instance
 */
export function createMemorySessionStore(
  options: SessionStoreFactoryOptions = {}
): MemorySessionStore {
  return new MemorySessionStore({
    prefix: options.prefix || "mcp:session:",
    defaultTtl: options.defaultTtl || 3600,
    lockTimeout: options.lockTimeout || 30000,
  });
}

/**
 * Create a Redis session store
 *
 * @param options Session store options
 * @returns A RedisSessionStore instance
 */
export function createRedisSessionStore(
  options: SessionStoreFactoryOptions = {}
): RedisSessionStore {
  return new RedisSessionStore({
    redisUrl: options.redisUrl || "redis://localhost:6379",
    prefix: options.prefix || "mcp:session:",
    defaultTtl: options.defaultTtl || 3600,
    lockTimeout: options.lockTimeout || 30000,
  });
}
