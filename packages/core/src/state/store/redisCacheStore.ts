import { createHash } from 'crypto';

import { Logger } from '@mcp/utils';
import { Redis } from 'ioredis';


/**
 * Configuration options for the Redis Cache Store
 */
interface IRedisCacheStoreOptions {
  /**
   * Redis connection URL (e.g., redis://localhost:6379)
   */
  redisUrl: string;

  /**
   * Key prefix for Redis cache keys (default: "mcp:cache:")
   */
  prefix?: string;

  /**
   * Default TTL for cache entries in seconds (default: 300)
   */
  defaultTtl?: number;

  /**
   * Maximum size for the memory cache (default: 1000)
   */
  memCacheSize?: number;

  /**
   * Enable memory caching layer (default: true)
   */
  useMemoryCache?: boolean;
}

/**
 * Interface for cached item with metadata
 */
interface ICacheItem<T> {
  value: T;
  timestamp: number;
  expiresAt: number | null;
}

/**
 * Interface for cache statistics
 */
interface ICacheStats {
  memory: {
    hits: number;
    misses: number;
    evictions: number;
    hitRate: string;
  };
  redis: {
    keys: number;
    memory: number;
  };
}

/**
 * Redis-backed cache store with optional memory caching layer
 *
 * Provides a tiered caching implementation with:
 * 1. In-memory LRU cache for frequent access
 * 2. Redis-backed distributed cache for persistence
 *
 * Features:
 * - Automatic cache invalidation based on TTL
 * - Support for cache namespaces/categories
 * - Batch operations for efficiency
 * - Memory cache hit rate tracking
 */
export class RedisCacheStore {
  private client: Redis;
  private prefix: string;
  private defaultTtl: number;
  private useMemoryCache: boolean;
  private logger: Logger;

  // Memory cache implementation
  private memCache: Map<string, ICacheItem<unknown>> = new Map();
  private memCacheSize: number;
  private memCacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };

  /**
   * Creates a new RedisCacheStore
   * @param options Configuration options
   */
  constructor(options: IRedisCacheStoreOptions) {
    this.client = new Redis(options.redisUrl);
    this.prefix = options.prefix || 'mcp:cache:';
    this.defaultTtl = options.defaultTtl || 300; // 5 minutes default
    this.memCacheSize = options.memCacheSize || 1000;
    this.useMemoryCache = options.useMemoryCache !== false;
    this.logger = new Logger('RedisCacheStore');

    // Set up error handler for Redis client
    if (typeof this.client.on === 'function') {
      this.client.on('error', (err: Error) => {
        this.logger.error('Redis client error', { errorMessage: err.message });
      });
    }
  }

  /**
   * Closes the Redis connection
   */
  public async disconnect(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to disconnect Redis client', { errorMessage: message });
    }
  }

  /**
   * Gets a cache key with namespace
   * @param key Base cache key
   * @param namespace Optional namespace (category)
   * @returns Full Redis key with prefix and namespace
   */
  private getCacheKey(key: string, namespace?: string): string {
    if (namespace) {
      return `${this.prefix}${namespace}:${key}`;
    }
    return `${this.prefix}${key}`;
  }

  /**
   * Creates a hash for complex keys
   * @param data Data to hash
   * @returns SHA-256 hash string
   */
  private createKeyHash(data: any): string {
    if (typeof data === 'string') {
      return data;
    }

    const jsonStr = JSON.stringify(data);
    return createHash('sha256').update(jsonStr).digest('hex');
  }

  private isValidCacheItem<T>(data: unknown): data is ICacheItem<T> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'value' in data &&
      'timestamp' in data &&
      'expiresAt' in data &&
      typeof (data as { timestamp: unknown }).timestamp === 'number' &&
      (typeof (data as { expiresAt: unknown }).expiresAt === 'number' ||
        (data as { expiresAt: unknown }).expiresAt === null)
    );
  }

  /**
   * Gets an item from cache
   * @param key Cache key
   * @param namespace Optional namespace
   * @returns Cached value or null if not found/expired
   */
  public async get<T>(key: string, namespace?: string): Promise<T | null> {
    const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);

    // Try memory cache first if enabled
    if (this.useMemoryCache) {
      const memItem = this.memCache.get(cacheKey);
      if (memItem) {
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
          return memItem.value as T;
        }
        this.memCache.delete(cacheKey);
      }
      this.memCacheStats.misses++;
    }

    try {
      const data = await this.client.get(cacheKey);
      if (!data) {
        return null;
      }

      const parsedData = JSON.parse(data);
      if (!this.isValidCacheItem<T>(parsedData)) {
        this.logger.warn(`Invalid cache item format for key: ${cacheKey}`);
        return null;
      }

      // Update memory cache if enabled
      if (this.useMemoryCache) {
        this.setMemoryCache(cacheKey, parsedData);
      }

      return parsedData.value;
    } catch (error) {
      this.logger.error(
        `Error getting cache item: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return null;
    }
  }

  /**
   * Sets an item in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl TTL in seconds (optional, uses default if not specified)
   * @param namespace Optional namespace
   */
  public async set<T>(key: string, value: T, ttl?: number, namespace?: string): Promise<void> {
    const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);
    const ttlValue = ttl ?? this.defaultTtl;
    const now = Date.now();

    const item: ICacheItem<T> = {
      value,
      timestamp: now,
      expiresAt: ttlValue > 0 ? now + ttlValue * 1000 : null,
    };

    // Update memory cache if enabled
    if (this.useMemoryCache) {
      this.setMemoryCache(cacheKey, item);
    }

    // Update Redis cache
    try {
      if (ttlValue > 0) {
        await this.client.set(cacheKey, JSON.stringify(item), 'EX', ttlValue);
      } else {
        await this.client.set(cacheKey, JSON.stringify(item));
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to set item in Redis cache', {
        errorMessage: message,
        cacheKey,
        namespace,
      });
      // Continue even if Redis fails - we still have memory cache
    }
  }

  /**
   * Adds item to memory cache with LRU eviction if needed
   * @param key Cache key
   * @param item Cache item with value and metadata
   */
  private setMemoryCache<T>(key: string, item: ICacheItem<T>): void {
    // Clean up memory cache using LRU when it gets too large
    if (this.memCache.size > this.memCacheSize) {
      // Find the oldest key
      let oldestKey: string | undefined;
      let oldestTimestamp = Date.now();

      for (const [cacheKey, entry] of this.memCache.entries()) {
        if (entry.timestamp < oldestTimestamp) {
          oldestTimestamp = entry.timestamp;
          oldestKey = cacheKey;
        }
      }

      // Remove the oldest entry
      if (oldestKey) {
        this.memCache.delete(oldestKey);
      }
    }

    this.memCache.set(key, item);
    this.memCacheStats.evictions++;
  }

  /**
   * Removes an item from the cache
   * @param key Cache key
   * @param namespace Optional namespace
   */
  public async delete(key: string, namespace?: string): Promise<void> {
    const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);

    // Remove from memory cache if enabled
    if (this.useMemoryCache) {
      this.memCache.delete(cacheKey);
    }

    // Remove from Redis cache
    try {
      await this.client.del(cacheKey);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to delete item from Redis cache', {
        errorMessage: message,
        cacheKey,
        namespace,
      });
    }
  }

  /**
   * Invalidates all items in a namespace
   * @param namespace Namespace to invalidate
   */
  public async invalidateNamespace(namespace: string): Promise<void> {
    try {
      const pattern = this.getCacheKey('*', namespace);
      const keys = await this.client.keys(pattern);

      if (keys.length > 0) {
        // Remove from memory cache if enabled
        if (this.useMemoryCache) {
          for (const key of keys) {
            this.memCache.delete(key);
          }
        }

        // Remove from Redis cache
        await this.client.del(...keys);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to invalidate namespace in Redis cache', {
        errorMessage: message,
        namespace,
      });
    }
  }

  /**
   * Clears the entire cache (both memory and Redis)
   */
  public async clear(): Promise<void> {
    try {
      // Clear memory cache if enabled
      if (this.useMemoryCache) {
        this.memCache.clear();
      }

      // Clear Redis cache
      const pattern = this.getCacheKey('*');
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to clear Redis cache', { errorMessage: message });
    }
  }

  /**
   * Gets multiple items from cache in a single batch operation
   * @param keys Array of cache keys
   * @param namespace Optional namespace
   * @returns Object with keys mapped to their cached values (or null if not found)
   */
  public async getMany<T>(keys: string[], namespace?: string): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};
    const redisKeys: string[] = [];
    const keyMap = new Map<string, string>();

    // Process memory cache first if enabled
    if (this.useMemoryCache) {
      for (const key of keys) {
        const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);
        const memItem = this.memCache.get(cacheKey);
        if (memItem) {
          if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
            this.memCacheStats.hits++;
            result[key] = memItem.value as T;
          } else {
            this.memCache.delete(cacheKey);
            redisKeys.push(cacheKey);
            keyMap.set(cacheKey, key);
          }
        } else {
          this.memCacheStats.misses++;
          redisKeys.push(cacheKey);
          keyMap.set(cacheKey, key);
        }
      }
    } else {
      // If memory cache is disabled, process all keys in Redis
      for (const key of keys) {
        const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);
        redisKeys.push(cacheKey);
        keyMap.set(cacheKey, key);
      }
    }

    // Process remaining keys in Redis
    if (redisKeys.length > 0) {
      try {
        const values = await this.client.mget(redisKeys);
        for (let i = 0; i < redisKeys.length; i++) {
          const cacheKey = redisKeys[i];
          const originalKey = keyMap.get(cacheKey);
          const value = values[i];

          if (value && originalKey) {
            const item = JSON.parse(value) as ICacheItem<T>;
            result[originalKey] = item.value;

            // Update memory cache if enabled
            if (this.useMemoryCache) {
              this.setMemoryCache(cacheKey, item);
            }
          } else if (originalKey) {
            result[originalKey] = null;
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error('Failed to get items from Redis cache', {
          errorMessage: message,
          keys: redisKeys,
          namespace,
        });
      }
    }

    return result;
  }

  /**
   * Sets multiple items in the cache in a single batch operation
   * @param items Object mapping keys to values
   * @param ttl TTL in seconds (optional, uses default if not specified)
   * @param namespace Optional namespace
   */
  public async setMany<T>(
    items: Record<string, T>,
    ttl?: number,
    namespace?: string,
  ): Promise<void> {
    const ttlValue = ttl ?? this.defaultTtl;
    const now = Date.now();

    // Update Redis cache using pipeline for efficiency
    try {
      const pipeline = this.client.pipeline();

      for (const [key, value] of Object.entries(items)) {
        const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);

        const item: ICacheItem<T> = {
          value,
          timestamp: now,
          expiresAt: ttlValue > 0 ? now + ttlValue * 1000 : null,
        };

        // Update memory cache if enabled
        if (this.useMemoryCache) {
          this.setMemoryCache(cacheKey, item);
        }

        // Add to Redis pipeline
        if (ttlValue > 0) {
          pipeline.set(cacheKey, JSON.stringify(item), 'EX', ttlValue);
        } else {
          pipeline.set(cacheKey, JSON.stringify(item));
        }
      }

      await pipeline.exec();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to set items in Redis cache', {
        errorMessage: message,
        keys: Object.keys(items),
        namespace,
      });
      // Continue even if Redis fails - we still have memory cache
    }
  }

  /**
   * Get cache statistics
   * @returns Cache statistics object
   */
  public async getStats(): Promise<ICacheStats> {
    try {
      const hitRate =
        this.memCacheStats.hits / (this.memCacheStats.hits + this.memCacheStats.misses) || 0;

      const redisInfo = await this.client.info('memory');
      const memoryMatch = redisInfo.match(/used_memory:(\d+)/);
      const memory = memoryMatch ? parseInt(memoryMatch[1], 10) : 0;

      return {
        memory: {
          hits: this.memCacheStats.hits,
          misses: this.memCacheStats.misses,
          evictions: this.memCacheStats.evictions,
          hitRate: hitRate.toFixed(2),
        },
        redis: {
          keys: this.memCache.size,
          memory,
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Failed to get Redis cache stats', { errorMessage: message });
      throw error;
    }
  }
}
