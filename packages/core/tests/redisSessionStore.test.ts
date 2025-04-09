import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RedisSessionStore } from '../src/state/store/redisSessionStore.js';
import { RedisTestContainer } from './utils/redisTestContainer.js';
import { RedisTestUtils, ITestSessionData } from './utils/redisTestUtils.js';

describe('RedisSessionStore', () => {
  let redisContainer: RedisTestContainer;
  let redisStore: RedisSessionStore;
  let testData: ITestSessionData;

  beforeEach(async () => {
    redisContainer = new RedisTestContainer();
    const { port } = await redisContainer.start();

    redisStore = new RedisSessionStore({
      redisUrl: `redis://localhost:${port}`,
      prefix: 'test:',
      defaultTtl: 3600,
      lockTimeout: 10000,
    });

    testData = RedisTestUtils.generateTestSessionData();
  });

  afterEach(async () => {
    await redisContainer.clear();
    await redisContainer.stop();
  });

  describe('Session Management', () => {
    it('should store and retrieve a session', async () => {
      const sessionId = 'test-session';
      await redisStore.setSession(sessionId, testData);

      const retrievedData = await redisStore.getSession(sessionId);
      expect(retrievedData).toEqual(testData);
    });

    it('should return null for non-existent session', async () => {
      const sessionId = 'non-existent-session';
      const retrievedData = await redisStore.getSession(sessionId);
      expect(retrievedData).toBeNull();
    });

    it('should clear a session', async () => {
      const sessionId = 'test-session';
      await redisStore.setSession(sessionId, testData);
      await redisStore.clearSession(sessionId);

      const retrievedData = await redisStore.getSession(sessionId);
      expect(retrievedData).toBeNull();
    });

    it('should respect TTL when setting session', async () => {
      const sessionId = 'test-session';
      const ttl = 1; // 1 second
      await redisStore.setSession(sessionId, testData, ttl);

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 1100));

      const retrievedData = await redisStore.getSession(sessionId);
      expect(retrievedData).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle Redis connection errors', async () => {
      await redisContainer.stop();

      const sessionId = 'test-session';
      await expect(redisStore.setSession(sessionId, testData)).rejects.toThrow(
        'Failed to set session',
      );
    });

    it('should handle invalid session data', async () => {
      const sessionId = 'test-session';
      const invalidData = {
        id: 'invalid',
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        data: {},
        testField: 'invalid',
        testNumber: 123,
        testArray: ['invalid'],
      } as ITestSessionData;

      await expect(redisStore.setSession(sessionId, invalidData)).rejects.toThrow(
        'Invalid session data',
      );
    });
  });

  describe('Concurrency', () => {
    it('should handle concurrent session operations', async () => {
      const sessionId = 'test-session';
      const operations = Array(10)
        .fill(null)
        .map(async (_, i) => {
          const data = {
            ...testData,
            testNumber: i,
            lastAccessed: Date.now(),
          };
          await redisStore.setSession(sessionId, data);
          return redisStore.getSession(sessionId) as Promise<ITestSessionData>;
        });

      const results = await Promise.all(operations);
      const lastResult = results[results.length - 1];
      expect(lastResult?.testNumber).toBe(9);
    });
  });
});
