/**
 * Redis test utilities for MCP Code Analysis
 * @module @mcp/core/test
 */

import { Redis } from 'ioredis';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';

import { RedisSessionStore } from '../state/services/redisSessionStore.js';

export class RedisTestUtils {
  private container: StartedTestContainer | null = null;
  private redisClient: Redis | null = null;
  private redisUrl: string | null = null;

  async startRedisContainer(): Promise<void> {
    if (this.container) {
      return;
    }

    this.container = await new GenericContainer('redis:7-alpine').withExposedPorts(6379).start();

    const host = this.container.getHost();
    const port = this.container.getMappedPort(6379);
    this.redisUrl = `redis://${host}:${port}`;

    this.redisClient = new Redis(this.redisUrl, {
      retryStrategy: (times: number): number => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    // Wait for Redis to be ready
    await this.waitForRedis();
  }

  async stopRedisContainer(): Promise<void> {
    if (this.container) {
      await this.container.stop();
      this.container = null;
      this.redisUrl = null;
    }
  }

  getRedisUrl(): string {
    if (!this.redisUrl) {
      throw new Error('Redis container not started');
    }
    return this.redisUrl;
  }

  createSessionStore(
    options: Partial<ConstructorParameters<typeof RedisSessionStore>[0]> = {},
  ): RedisSessionStore {
    if (!this.redisUrl) {
      throw new Error('Redis container not started');
    }

    return new RedisSessionStore({
      redisUrl: this.redisUrl,
      prefix: 'test:',
      defaultTtl: 3600,
      lockTimeout: 30000,
      ...options,
    });
  }

  async clearRedis(): Promise<void> {
    if (!this.redisUrl) {
      throw new Error('Redis container not started');
    }

    const store = this.createSessionStore();
    await store.clear();
    await store.disconnect();
  }

  async waitForRedis(): Promise<void> {
    if (!this.redisClient) {
      throw new Error('Redis client not initialized');
    }

    let attempts = 0;
    const maxAttempts = 10;
    const delay = 1000;

    while (attempts < maxAttempts) {
      try {
        await this.redisClient.ping();
        return;
      } catch (error: unknown) {
        attempts++;
        if (attempts === maxAttempts) {
          throw new Error(
            `Redis not ready after ${maxAttempts} attempts: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
          );
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}
