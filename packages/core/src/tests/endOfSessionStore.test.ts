/**
 * Tests for EndOfSessionStore
 */

import { Redis } from 'ioredis';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import type { IEndOfSessionData } from '../state/services/endOfSessionStore.js';
import { EndOfSessionStore } from '../state/services/endOfSessionStore.js';
import { RedisSessionStore } from '../state/services/redisSessionStore.js';

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
    if (key === 'eos:exists') {
      return Promise.resolve(
        JSON.stringify({
          id: 'eos:exists',
          createdAt: Date.now(),
          lastAccessed: Date.now(),
          data: {
            session_id: 'test-session-1',
            timestamp: new Date().toISOString(),
            status: 'completed',
            completed_tasks: ['task1', 'task2'],
            next_steps: ['step1', 'step2'],
            notes: ['note1', 'note2'],
            session_summary: {
              date: '2024-03-28',
              duration: '30 minutes',
              main_activities: ['activity1', 'activity2'],
              key_decisions: ['decision1', 'decision2'],
              next_steps: ['step1', 'step2'],
            },
            technical_notes: {
              dependencies: {
                added: [],
                removed: [],
                updated: [],
              },
              file_changes: {
                modified: ['file1', 'file2'],
                created: [],
                deleted: [],
              },
            },
            session_metrics: {
              files_modified: 2,
              lines_added: 150,
              lines_removed: 100,
              new_files: 0,
              deleted_files: 0,
              renamed_files: 0,
            },
          },
        }),
      );
    }
    return Promise.resolve(null);
  }),
  set: vi.fn().mockResolvedValue('OK'),
  setex: vi.fn().mockResolvedValue('OK'),
  del: vi.fn().mockResolvedValue(1),
  keys: vi.fn().mockResolvedValue(['eos:1', 'eos:2']),
  ttl: vi.fn().mockImplementation((key: string) => {
    if (key === 'eos:exists') {
      return Promise.resolve(300);
    }
    return Promise.resolve(-2);
  }),
  expire: vi.fn().mockImplementation((key: string) => {
    if (key === 'eos:exists') {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  exists: vi.fn().mockImplementation((key: string) => {
    if (key === 'eos:exists') {
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

describe('EndOfSessionStore', () => {
  let store: EndOfSessionStore;
  let mockClient: IMockRedisClient;

  beforeEach(() => {
    mockClient = { ...mockRedisClient };
    store = new EndOfSessionStore({
      redisUrl: 'redis://localhost:6379',
      sessionId: 'test-session',
      prefix: 'eos:',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockEndOfSessionData: IEndOfSessionData = {
    session_id: 'test-session-1',
    timestamp: new Date().toISOString(),
    status: 'completed',
    completed_tasks: ['task1', 'task2'],
    next_steps: ['step1', 'step2'],
    notes: ['note1', 'note2'],
    session_summary: {
      date: '2024-03-28',
      duration: '30 minutes',
      main_activities: ['activity1', 'activity2'],
      key_decisions: ['decision1', 'decision2'],
      next_steps: ['step1', 'step2'],
    },
    technical_notes: {
      dependencies: {
        added: [],
        removed: [],
        updated: [],
      },
      file_changes: {
        modified: ['file1', 'file2'],
        created: [],
        deleted: [],
      },
    },
    session_metrics: {
      files_modified: 2,
      lines_added: 150,
      lines_removed: 100,
      new_files: 0,
      deleted_files: 0,
      renamed_files: 0,
    },
  };

  it('should save and retrieve end of session data', async () => {
    const sessionId = await store.saveEndOfSession(mockEndOfSessionData);
    const result = await store.getEndOfSession(sessionId);

    expect(result).toBeDefined();
    expect(result?.session_id).toBe('test-session-1');
    expect(result?.status).toBe('completed');
    expect(result?.completed_tasks).toEqual(['task1', 'task2']);
  });

  it('should generate a new session ID if not provided', async () => {
    const dataWithoutId = { ...mockEndOfSessionData };
    delete dataWithoutId.session_id;

    const sessionId = await store.saveEndOfSession(dataWithoutId);
    expect(sessionId).toMatch(/^eos:/);
  });

  it('should list all end of session IDs', async () => {
    const sessions = await store.listEndOfSessions();
    expect(sessions).toEqual(['1', '2']);
    expect(mockClient.keys).toHaveBeenCalledWith('eos:*');
  });

  it('should delete end of session data', async () => {
    const sessionId = 'test-session';
    await store.deleteEndOfSession(sessionId);
    expect(mockClient.del).toHaveBeenCalledWith(`eos:${sessionId}`);
  });

  it('should clear all end of session data', async () => {
    await store.clearAll();
    expect(mockClient.keys).toHaveBeenCalledWith('eos:*');
    expect(mockClient.del).toHaveBeenCalledWith('eos:1', 'eos:2');
  });
});
