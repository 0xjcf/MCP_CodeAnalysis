import { describe, test, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import Redis from 'ioredis';
import { RedisSessionStore } from '../redisSessionStore.js';
import { AnalysisResult } from '../index.js';

// Define types for the mock Redis client
interface MockRedisClient {
  on: (event: string, callback: (error: Error) => void) => MockRedisClient;
  disconnect: () => Promise<void>;
  set: Mock;
  get: Mock;
  del: Mock;
  keys: Mock;
  expire: Mock;
  ttl: Mock;
  exists: Mock;
  eval: Mock;
  setex: Mock;
  quit: () => Promise<void>;
  _errorCallback: ((error: Error) => void) | null;
  _simulateError: (error: Error) => void;
}

// Create a comprehensive mock Redis client with proper types
const mockRedisClient: MockRedisClient = {
  on: vi.fn((event: string, callback: (error: Error) => void) => {
    if (event === 'error') {
      mockRedisClient._errorCallback = callback;
    }
    return mockRedisClient;
  }),
  disconnect: vi.fn().mockResolvedValue(undefined),
  quit: vi.fn().mockResolvedValue(undefined),
  set: vi.fn().mockResolvedValue('OK'),
  setex: vi.fn().mockResolvedValue('OK'),
  get: vi.fn().mockImplementation((key: string) => {
    if (key === 'mcp:session:exists') {
      return Promise.resolve(JSON.stringify({ success: true, data: { key: 'value' } }));
    }
    if (key === 'mcp:session:invalid-json') {
      return Promise.resolve('not-valid-json');
    }
    return Promise.resolve(null);
  }),
  del: vi.fn().mockResolvedValue(1),
  keys: vi.fn().mockResolvedValue(['mcp:session:1', 'mcp:session:2']),
  expire: vi.fn().mockImplementation((key: string) => {
    if (key === 'mcp:session:exists') {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  ttl: vi.fn().mockImplementation((key: string) => {
    if (key === 'mcp:session:exists') {
      return Promise.resolve(300);
    }
    return Promise.resolve(-2);
  }),
  exists: vi.fn().mockImplementation((key: string) => {
    if (key === 'mcp:session:exists' || key === 'mcp:session:lock:exists') {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  eval: vi.fn().mockImplementation((script: string, keys: number, ...args: any[]) => {
    if (args[1] === 'valid-token') {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  _errorCallback: null,
  _simulateError: function (error: Error) {
    if (this._errorCallback) {
      this._errorCallback(error);
    }
  },
};

// Mock the ioredis module
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => mockRedisClient),
    Redis: vi.fn().mockImplementation(() => mockRedisClient),
  };
});

describe('RedisSessionStore', () => {
  let store: RedisSessionStore;

  beforeEach(() => {
    vi.clearAllMocks();
    store = new RedisSessionStore({
      host: 'localhost',
      port: 6379,
      keyPrefix: 'mcp:session:',
      ttl: 3600,
      lockTimeout: 30000,
    });
  });

  afterEach(async () => {
    await store.close();
  });

  describe('Session Management', () => {
    test('get should retrieve a session from Redis', async () => {
      const sessionId = 'test-session-1';
      const sessionData: AnalysisResult = { success: true, data: { foo: 'bar', count: 42 } };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(sessionData));

      const result = await store.get(sessionId);

      expect(mockRedisClient.get).toHaveBeenCalledWith('mcp:session:test-session-1');
      expect(result).toEqual(sessionData);
    });

    test('get should return null for non-existent session', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await store.get('nonexistent');

      expect(result).toBeNull();
    });

    test('set should store session data in Redis', async () => {
      const sessionId = 'test-session-2';
      const sessionData: AnalysisResult = {
        success: true,
        data: { name: 'Test Session', items: [1, 2, 3] },
      };
      mockRedisClient.setex.mockResolvedValue('OK');

      await store.set(sessionId, sessionData);

      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        'mcp:session:test-session-2',
        3600,
        JSON.stringify(sessionData),
      );
    });

    test('delete should remove a session from Redis', async () => {
      const sessionId = 'test-session-4';
      mockRedisClient.del.mockResolvedValue(1);

      await store.delete(sessionId);

      expect(mockRedisClient.del).toHaveBeenCalledWith('mcp:session:test-session-4');
    });
  });

  describe('Session Locking', () => {
    test('acquireLock should obtain a lock when available', async () => {
      const sessionId = 'test-session-7';
      mockRedisClient.set.mockResolvedValue('OK');

      const token = await store.acquireLock(sessionId);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'mcp:session:lock:test-session-7',
        expect.any(String),
        'PX',
        30000,
        'NX',
      );
      expect(token).toBeTruthy();
    });

    test('acquireLock should return null when lock is unavailable', async () => {
      const sessionId = 'test-session-8';
      mockRedisClient.set.mockResolvedValue(null);

      const token = await store.acquireLock(sessionId);

      expect(token).toBeNull();
    });

    test('releaseLock should release a lock with valid token', async () => {
      const sessionId = 'test-session-8';
      const token = 'valid-token-1234';
      mockRedisClient.eval.mockResolvedValue(1);

      const result = await store.releaseLock(sessionId, token);

      expect(mockRedisClient.eval).toHaveBeenCalledWith(
        expect.any(String),
        1,
        'mcp:session:lock:test-session-8',
        token,
      );
      expect(result).toBe(true);
    });

    test('releaseLock should fail with invalid token', async () => {
      const sessionId = 'test-session-8';
      const token = 'invalid-token';
      mockRedisClient.eval.mockResolvedValue(0);

      const result = await store.releaseLock(sessionId, token);

      expect(result).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('get should handle Redis errors', async () => {
      const sessionId = 'error-test-session';
      mockRedisClient.get.mockRejectedValue(new Error('Redis connection error'));

      await expect(store.get(sessionId)).rejects.toThrow('Redis operation failed');
    });

    test('get should handle invalid JSON format', async () => {
      const sessionId = 'corrupted-session';
      mockRedisClient.get.mockResolvedValue('not-valid-json');

      await expect(store.get(sessionId)).rejects.toThrow('Failed to parse session data');
    });
  });

  describe('TTL Management', () => {
    test('extendSessionTtl should update the expiration time', async () => {
      const sessionId = 'test-session-5';
      mockRedisClient.expire.mockResolvedValue(1);

      await store.extendSessionTtl(sessionId);

      expect(mockRedisClient.expire).toHaveBeenCalledWith('mcp:session:test-session-5', 3600);
    });
  });
});
