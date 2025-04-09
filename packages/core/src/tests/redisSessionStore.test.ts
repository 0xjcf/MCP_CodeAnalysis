import type { ISessionData } from '@mcp/types';
import { Redis } from 'ioredis';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

import { RedisSessionStore, RedisSessionStoreError } from '../state/services/redisSessionStore.js';


interface IMockRedisClient {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  setex: ReturnType<typeof vi.fn>;
  del: ReturnType<typeof vi.fn>;
  exists: ReturnType<typeof vi.fn>;
  keys: ReturnType<typeof vi.fn>;
  ttl: ReturnType<typeof vi.fn>;
  expire: ReturnType<typeof vi.fn>;
  eval: ReturnType<typeof vi.fn>;
  quit: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
}

// Create a comprehensive mock Redis client with proper types
const mockRedisClient: IMockRedisClient = {
  get: vi.fn().mockImplementation((key: string) => {
    if (key === 'mcp:session:exists') {
      return Promise.resolve(
        JSON.stringify({
          id: 'test-id',
          createdAt: Date.now(),
          lastAccessed: Date.now(),
          data: { key: 'value' },
        }),
      );
    }
    if (key === 'mcp:session:invalid-json') {
      return Promise.resolve('not-valid-json');
    }
    return Promise.resolve(null);
  }),
  set: vi.fn().mockResolvedValue('OK'),
  setex: vi.fn().mockResolvedValue('OK'),
  del: vi.fn().mockResolvedValue(1),
  keys: vi.fn().mockResolvedValue(['mcp:session:1', 'mcp:session:2']),
  ttl: vi.fn().mockImplementation((key: string) => {
    if (key === 'mcp:session:exists') {
      return Promise.resolve(300);
    }
    return Promise.resolve(-2);
  }),
  expire: vi.fn().mockImplementation((key: string) => {
    if (key === 'mcp:session:exists') {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  exists: vi.fn().mockImplementation((key: string) => {
    if (key === 'mcp:session:exists') {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  eval: vi.fn().mockImplementation((script: string, numKeys: number, ...args: unknown[]) => {
    if (script.includes('releaseLock')) {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  quit: vi.fn().mockResolvedValue('OK'),
  on: vi.fn().mockReturnThis(),
};

// Mock the ioredis module
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => mockRedisClient),
    Redis: vi.fn().mockImplementation(() => mockRedisClient),
  };
});

describe('RedisSessionStore', () => {
  let store: RedisSessionStore<ISessionData>;
  let mockClient: IMockRedisClient;

  beforeEach(() => {
    mockClient = { ...mockRedisClient };
    store = new RedisSessionStore({
      redisUrl: 'redis://localhost:6379',
      prefix: 'mcp:session:',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should get session data', async () => {
    const sessionId = 'exists';
    const result = await store.getSession(sessionId);
    expect(result).toBeDefined();
    expect(result?.id).toBe('test-id');
    expect(mockClient.get).toHaveBeenCalledWith(`mcp:session:${sessionId}`);
  });

  test('should return null for non-existent session', async () => {
    const sessionId = 'non-existent';
    const result = await store.getSession(sessionId);
    expect(result).toBeNull();
    expect(mockClient.get).toHaveBeenCalledWith(`mcp:session:${sessionId}`);
  });

  test('should handle invalid JSON data', async () => {
    const sessionId = 'invalid-json';
    await expect(store.getSession(sessionId)).rejects.toThrow('Failed to parse session data');
    expect(mockClient.get).toHaveBeenCalledWith(`mcp:session:${sessionId}`);
  });

  test('should set session data', async () => {
    const sessionId = 'test-session';
    const data: ISessionData = {
      id: sessionId,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      data: { key: 'value' },
    };

    await store.setSession(sessionId, data);
    expect(mockClient.setex).toHaveBeenCalledWith(
      `mcp:session:${sessionId}`,
      expect.any(Number),
      JSON.stringify(data),
    );
  });

  test('should delete session', async () => {
    const sessionId = 'test-session';
    await store.deleteSession(sessionId);
    expect(mockClient.del).toHaveBeenCalledWith(`mcp:session:${sessionId}`);
  });

  test('should clear session', async () => {
    const sessionId = 'test-session';
    await store.clearSession(sessionId);
    expect(mockClient.del).toHaveBeenCalledWith(`mcp:session:${sessionId}`);
  });

  test('should get all sessions', async () => {
    const sessions = await store.getSessions();
    expect(sessions).toEqual(['1', '2']);
    expect(mockClient.keys).toHaveBeenCalledWith('mcp:session:*');
  });

  test('should clear all sessions', async () => {
    await store.clear();
    expect(mockClient.keys).toHaveBeenCalledWith('mcp:session:*');
    expect(mockClient.del).toHaveBeenCalledWith('mcp:session:1', 'mcp:session:2');
  });

  test('should extend session TTL', async () => {
    const sessionId = 'exists';
    const result = await store.extendSessionTtl(sessionId, 600);
    expect(result).toBe(true);
    expect(mockClient.expire).toHaveBeenCalledWith(`mcp:session:${sessionId}`, 600);
  });

  test('should get session TTL', async () => {
    const sessionId = 'exists';
    const result = await store.getSessionTtl(sessionId);
    expect(result).toBe(300);
    expect(mockClient.ttl).toHaveBeenCalledWith(`mcp:session:${sessionId}`);
  });

  test('should acquire lock', async () => {
    const sessionId = 'test-session';
    const result = await store.acquireLock(sessionId);
    expect(result).toBeDefined();
    expect(mockClient.set).toHaveBeenCalledWith(
      `mcp:session:lock:${sessionId}`,
      expect.any(String),
      'PX',
      expect.any(Number),
      'NX',
    );
  });

  test('should release lock', async () => {
    const sessionId = 'test-session';
    const token = 'test-token';
    const result = await store.releaseLock(sessionId, token);
    expect(result).toBe(true);
    expect(mockClient.eval).toHaveBeenCalledWith(
      expect.any(String),
      1,
      `mcp:session:lock:${sessionId}`,
      token,
    );
  });

  test('should create session if not exists', async () => {
    const sessionId = 'new-session';
    const initialState: ISessionData = {
      id: sessionId,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      data: { key: 'value' },
    };

    const result = await store.createSessionIfNotExists(sessionId, initialState);
    expect(result).toEqual(initialState);
    expect(mockClient.exists).toHaveBeenCalledWith(`mcp:session:${sessionId}`);
    expect(mockClient.setex).toHaveBeenCalledWith(
      `mcp:session:${sessionId}`,
      expect.any(Number),
      JSON.stringify(initialState),
    );
  });

  test('should return existing session if exists', async () => {
    const sessionId = 'exists';
    const initialState: ISessionData = {
      id: sessionId,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      data: { key: 'value' },
    };

    const result = await store.createSessionIfNotExists(sessionId, initialState);
    expect(result).toBeDefined();
    expect(result?.id).toBe('test-id');
    expect(mockClient.exists).toHaveBeenCalledWith(`mcp:session:${sessionId}`);
  });

  test('should disconnect', async () => {
    await store.disconnect();
    expect(mockClient.quit).toHaveBeenCalled();
  });

  test('should close', async () => {
    await store.close();
    expect(mockClient.quit).toHaveBeenCalled();
  });
});
