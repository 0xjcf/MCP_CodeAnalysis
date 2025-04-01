/**
 * Redis session store implementation for MCP Code Analysis
 * @module @mcp/core
 */

import { Redis } from 'ioredis';
import { AnalysisResult } from './index.js';

export interface RedisSessionStoreOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  ttl?: number; // Time to live in seconds
  lockTimeout?: number; // Lock timeout in milliseconds
}

export class RedisSessionStore {
  private client: Redis;
  private keyPrefix: string;
  private ttl: number;
  private lockTimeout: number;

  constructor(options: RedisSessionStoreOptions = {}) {
    const {
      host = 'localhost',
      port = 6379,
      password,
      db = 0,
      keyPrefix = 'mcp:session:',
      ttl = 3600, // 1 hour default
      lockTimeout = 30000, // 30 seconds default
    } = options;

    this.client = new Redis({
      host,
      port,
      password,
      db,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.keyPrefix = keyPrefix;
    this.ttl = ttl;
    this.lockTimeout = lockTimeout;

    // Handle connection errors
    this.client.on('error', (error: Error) => {
      console.error('Redis connection error:', error);
    });
  }

  private getKey(sessionId: string): string {
    return `${this.keyPrefix}${sessionId}`;
  }

  private getLockKey(sessionId: string): string {
    return `${this.keyPrefix}lock:${sessionId}`;
  }

  async set(sessionId: string, data: AnalysisResult): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      await this.client.setex(key, this.ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting session data:', error);
      throw new Error('Redis operation failed');
    }
  }

  async get(sessionId: string): Promise<AnalysisResult | null> {
    try {
      const data = await this.client.get(`${this.keyPrefix}${sessionId}`);
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

  async delete(sessionId: string): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      await this.client.del(key);
    } catch (error) {
      console.error('Error deleting session data:', error);
      throw new Error('Redis operation failed');
    }
  }

  async exists(sessionId: string): Promise<boolean> {
    try {
      const key = this.getKey(sessionId);
      return (await this.client.exists(key)) === 1;
    } catch (error) {
      console.error('Error checking session existence:', error);
      throw new Error('Redis operation failed');
    }
  }

  async acquireLock(sessionId: string): Promise<string | null> {
    try {
      const lockKey = this.getLockKey(sessionId);
      const lockToken = Math.random().toString(36).substring(2);
      const result = await this.client.set(lockKey, lockToken, 'PX', this.lockTimeout, 'NX');
      return result === 'OK' ? lockToken : null;
    } catch (error) {
      console.error('Error acquiring lock:', error);
      throw new Error('Redis operation failed');
    }
  }

  async releaseLock(sessionId: string, lockToken: string): Promise<boolean> {
    try {
      const lockKey = this.getLockKey(sessionId);
      const script = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `;
      const result = await this.client.eval(script, 1, lockKey, lockToken);
      return result === 1;
    } catch (error) {
      console.error('Error releasing lock:', error);
      throw new Error('Redis operation failed');
    }
  }

  async extendSessionTtl(sessionId: string): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      await this.client.expire(key, this.ttl);
    } catch (error) {
      console.error('Error extending session TTL:', error);
      throw new Error('Redis operation failed');
    }
  }

  async close(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      console.error('Error closing Redis connection:', error);
      throw new Error('Redis operation failed');
    }
  }

  async getSessions(): Promise<string[]> {
    try {
      const pattern = `${this.keyPrefix}*`;
      const keys = await this.client.keys(pattern);
      return keys.map(key => key.substring(this.keyPrefix.length));
    } catch (error) {
      console.error('Error listing sessions:', error);
      throw new Error('Redis operation failed');
    }
  }
}
