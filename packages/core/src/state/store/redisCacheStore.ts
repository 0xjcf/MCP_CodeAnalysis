import Redis from "ioredis";
import { createHash } from "crypto";

/**
 * Configuration options for the Redis Cache Store
 */
export interface RedisCacheStoreOptions {
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
interface CacheItem<T> {
  value: T;
  timestamp: number;
  expiresAt: number | null;
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

  // Memory cache implementation
  private memCache: Map<string, CacheItem<any>> = new Map();
  private memCacheSize: number;
  private memCacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
  };

  /**
   * Creates a new RedisCacheStore
   * @param options Configuration options
   */
  constructor(options: RedisCacheStoreOptions) {
    this.client = new Redis(options.redisUrl);
    this.prefix = options.prefix || "mcp:cache:";
    this.defaultTtl = options.defaultTtl || 300; // 5 minutes default
    this.memCacheSize = options.memCacheSize || 1000;
    this.useMemoryCache = options.useMemoryCache !== false;

    // Set up error handler for Redis client
    if (typeof this.client.on === "function") {
      this.client.on("error", (err: Error) => {
        console.error("Redis cache client error:", err);
      });
    }
  }

  /**
   * Closes the Redis connection
   */
  public async disconnect(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      console.error("Error disconnecting Redis cache client:", error);
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
    if (typeof data === "string") {
      return data;
    }

    const jsonStr = JSON.stringify(data);
    return createHash("sha256").update(jsonStr).digest("hex");
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
        // Check if the item is expired
        if (memItem.expiresAt === null || memItem.expiresAt > Date.now()) {
          this.memCacheStats.hits++;
          return memItem.value as T;
        } else {
          // Remove expired item from memory cache
          this.memCache.delete(cacheKey);
        }
      }
      this.memCacheStats.misses++;
    }

    // Try Redis cache
    try {
      const data = await this.client.get(cacheKey);
      if (!data) {
        return null;
      }

      const item = JSON.parse(data) as CacheItem<T>;

      // Update memory cache if enabled
      if (this.useMemoryCache) {
        this.setMemoryCache(cacheKey, item);
      }

      return item.value;
    } catch (error) {
      console.error("Failed to get item from Redis cache:", error);
      return null; // Fail open for cache issues
    }
  }

  /**
   * Sets an item in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl TTL in seconds (optional, uses default if not specified)
   * @param namespace Optional namespace
   */
  public async set<T>(
    key: string,
    value: T,
    ttl?: number,
    namespace?: string
  ): Promise<void> {
    const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);
    const ttlValue = ttl ?? this.defaultTtl;
    const now = Date.now();

    const item: CacheItem<T> = {
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
        await this.client.set(cacheKey, JSON.stringify(item), "EX", ttlValue);
      } else {
        await this.client.set(cacheKey, JSON.stringify(item));
      }
    } catch (error) {
      console.error("Failed to set item in Redis cache:", error);
      // Continue even if Redis fails - we still have memory cache
    }
  }

  /**
   * Adds item to memory cache with LRU eviction if needed
   * @param key Cache key
   * @param item Cache item with value and metadata
   */
  private setMemoryCache<T>(key: string, item: CacheItem<T>): void {
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
    this.memCacheStats.sets++;
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
    } catch (error) {
      console.error("Failed to delete item from Redis cache:", error);
    }
  }

  /**
   * Invalidates all items in a namespace
   * @param namespace Namespace to invalidate
   */
  public async invalidateNamespace(namespace: string): Promise<void> {
    const namespacePrefix = `${this.prefix}${namespace}:*`;

    // Clear matching items from memory cache if enabled
    if (this.useMemoryCache) {
      for (const key of this.memCache.keys()) {
        if (key.startsWith(`${this.prefix}${namespace}:`)) {
          this.memCache.delete(key);
        }
      }
    }

    // Clear matching items from Redis
    try {
      const keys = await this.client.keys(namespacePrefix);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error("Failed to invalidate namespace in Redis cache:", error);
    }
  }

  /**
   * Clears the entire cache (both memory and Redis)
   */
  public async clear(): Promise<void> {
    // Clear memory cache if enabled
    if (this.useMemoryCache) {
      this.memCache.clear();
      this.memCacheStats = { hits: 0, misses: 0, sets: 0 };
    }

    // Clear Redis cache
    try {
      const keys = await this.client.keys(`${this.prefix}*`);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error("Failed to clear Redis cache:", error);
    }
  }

  /**
   * Gets multiple items from cache in a single batch operation
   * @param keys Array of cache keys
   * @param namespace Optional namespace
   * @returns Object with keys mapped to their cached values (or null if not found)
   */
  public async getMany<T>(
    keys: string[],
    namespace?: string
  ): Promise<Record<string, T | null>> {
    const result: Record<string, T | null> = {};
    const missingKeys: string[] = [];
    const keyMapping: Record<string, string> = {};

    // Check memory cache first if enabled
    if (this.useMemoryCache) {
      for (const key of keys) {
        const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);
        keyMapping[cacheKey] = key;

        const memItem = this.memCache.get(cacheKey);
        if (
          memItem &&
          (memItem.expiresAt === null || memItem.expiresAt > Date.now())
        ) {
          result[key] = memItem.value as T;
          this.memCacheStats.hits++;
        } else {
          if (
            memItem &&
            memItem.expiresAt !== null &&
            memItem.expiresAt <= Date.now()
          ) {
            // Remove expired item from memory cache
            this.memCache.delete(cacheKey);
          }
          missingKeys.push(key);
          this.memCacheStats.misses++;
        }
      }
    } else {
      // If memory cache is disabled, all keys need to be fetched from Redis
      missingKeys.push(...keys);
      for (const key of keys) {
        const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);
        keyMapping[cacheKey] = key;
      }
    }

    // If all keys were found in memory cache, return immediately
    if (missingKeys.length === 0) {
      return result;
    }

    // Fetch missing keys from Redis using pipeline for efficiency
    try {
      const pipeline = this.client.pipeline();

      for (const key of missingKeys) {
        const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);
        pipeline.get(cacheKey);
      }

      const responses = await pipeline.exec();
      if (!responses) return result;

      for (let i = 0; i < responses.length; i++) {
        const [err, data] = responses[i];
        const originalKey = missingKeys[i];

        if (err || !data) {
          result[originalKey] = null;
          continue;
        }

        try {
          const item = JSON.parse(data as string) as CacheItem<T>;

          // Update memory cache if enabled
          if (this.useMemoryCache) {
            const cacheKey = this.getCacheKey(
              this.createKeyHash(originalKey),
              namespace
            );
            this.setMemoryCache(cacheKey, item);
          }

          result[originalKey] = item.value;
        } catch (parseError) {
          console.error("Failed to parse Redis cache item:", parseError);
          result[originalKey] = null;
        }
      }
    } catch (error) {
      console.error("Failed to get items from Redis cache:", error);
      // Set remaining keys to null
      for (const key of missingKeys) {
        if (!(key in result)) {
          result[key] = null;
        }
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
    namespace?: string
  ): Promise<void> {
    const ttlValue = ttl ?? this.defaultTtl;
    const now = Date.now();

    // Update Redis cache using pipeline for efficiency
    try {
      const pipeline = this.client.pipeline();

      for (const [key, value] of Object.entries(items)) {
        const cacheKey = this.getCacheKey(this.createKeyHash(key), namespace);

        const item: CacheItem<T> = {
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
          pipeline.set(cacheKey, JSON.stringify(item), "EX", ttlValue);
        } else {
          pipeline.set(cacheKey, JSON.stringify(item));
        }
      }

      await pipeline.exec();
    } catch (error) {
      console.error("Failed to set items in Redis cache:", error);
      // Continue even if Redis fails - we still have memory cache
    }
  }

  /**
   * Gets cache statistics
   * @returns Object with cache statistics
   */
  public getStats(): any {
    const hitRate =
      this.memCacheStats.hits + this.memCacheStats.misses > 0
        ? this.memCacheStats.hits /
          (this.memCacheStats.hits + this.memCacheStats.misses)
        : 0;

    return {
      memoryCache: {
        enabled: this.useMemoryCache,
        size: this.memCache.size,
        maxSize: this.memCacheSize,
        hits: this.memCacheStats.hits,
        misses: this.memCacheStats.misses,
        sets: this.memCacheStats.sets,
        hitRate: hitRate.toFixed(2),
      },
    };
  }
}
