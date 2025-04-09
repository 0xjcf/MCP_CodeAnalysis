import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { ISessionData } from '@mcp/types';

export interface ITestSessionData extends ISessionData {
  testField: string;
  testNumber: number;
  testArray: string[];
}

export class RedisTestUtils {
  static generateTestSessionData(): ITestSessionData {
    const now = Date.now();
    return {
      id: uuidv4(),
      createdAt: now,
      lastAccessed: now,
      data: {},
      testField: `test-${uuidv4()}`,
      testNumber: Math.floor(Math.random() * 1000),
      testArray: ['item1', 'item2', 'item3'],
    };
  }

  static async waitForRedisOperation(
    redis: Redis,
    operation: () => Promise<any>,
    timeoutMs: number = 5000,
  ): Promise<any> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    while (Date.now() - startTime < timeoutMs) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    throw new Error(`Operation timed out after ${timeoutMs}ms. Last error: ${lastError?.message}`);
  }

  static async verifyKeyExists(redis: Redis, key: string): Promise<boolean> {
    return (await redis.exists(key)) === 1;
  }

  static async verifyKeyTtl(redis: Redis, key: string): Promise<number> {
    return await redis.ttl(key);
  }

  static async verifyKeyValue(redis: Redis, key: string, expectedValue: any): Promise<boolean> {
    const value = await redis.get(key);
    if (!value) return false;

    try {
      const parsedValue = JSON.parse(value);
      return JSON.stringify(parsedValue) === JSON.stringify(expectedValue);
    } catch {
      return value === expectedValue;
    }
  }
}
