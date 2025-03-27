/**
 * Redis session store implementation for MCP Code Analysis
 * @module @mcp/core
 */

import Redis from 'ioredis';
import { IAnalysisResult } from './index';

export interface RedisSessionStoreOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
  ttl?: number; // Time to live in seconds
}

export class RedisSessionStore {
  private client: Redis;
  private keyPrefix: string;
  private ttl: number;

  constructor(options: RedisSessionStoreOptions = {}) {
    const {
      host = 'localhost',
      port = 6379,
      password,
      db = 0,
      keyPrefix = 'mcp:session:',
      ttl = 3600, // 1 hour default
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

    // Handle connection errors
    this.client.on('error', (error: Error) => {
      console.error('Redis connection error:', error);
    });
  }

  private getKey(sessionId: string): string {
    return `${this.keyPrefix}${sessionId}`;
  }

  async set(sessionId: string, data: IAnalysisResult): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      await this.client.setex(key, this.ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting session data:', error);
      throw new Error('Failed to store session data');
    }
  }

  async get(sessionId: string): Promise<IAnalysisResult | null> {
    try {
      const key = this.getKey(sessionId);
      const data = await this.client.get(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('Error getting session data:', error);
      throw new Error('Failed to retrieve session data');
    }
  }

  async delete(sessionId: string): Promise<void> {
    try {
      const key = this.getKey(sessionId);
      await this.client.del(key);
    } catch (error) {
      console.error('Error deleting session data:', error);
      throw new Error('Failed to delete session data');
    }
  }

  async exists(sessionId: string): Promise<boolean> {
    try {
      const key = this.getKey(sessionId);
      return (await this.client.exists(key)) === 1;
    } catch (error) {
      console.error('Error checking session existence:', error);
      throw new Error('Failed to check session existence');
    }
  }

  async close(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      console.error('Error closing Redis connection:', error);
      throw new Error('Failed to close Redis connection');
    }
  }
}
