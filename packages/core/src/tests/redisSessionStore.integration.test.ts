/**
 * Redis session store integration tests for MCP Code Analysis
 * @module @mcp/core/tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import type { IAnalysisResult } from '../index.js';
import type { RedisSessionStore } from '../state/services/redisSessionStore.js';
import { RedisTestUtils } from '../test/redisTestUtils.js';

describe('RedisSessionStore Integration', () => {
  let testUtils: RedisTestUtils;
  let store: RedisSessionStore;

  beforeEach(async () => {
    try {
      testUtils = new RedisTestUtils();
      await testUtils.startRedisContainer();
      store = testUtils.createSessionStore({
        prefix: 'mcp:session:',
        defaultTtl: 3600,
        lockTimeout: 30000,
      });
      await testUtils.clearRedis();
    } catch (error) {
      throw new Error(
        `Failed to setup test environment: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  });

  afterEach(async () => {
    try {
      await testUtils.clearRedis();
      await testUtils.stopRedisContainer();
    } catch (error) {
      throw new Error(
        `Failed to cleanup test environment: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  });

  const createTestAnalysisResult = (id: string): IAnalysisResult => ({
    success: true,
    data: {
      id,
      type: 'test',
      metadata: {
        timestamp: Date.now(),
        source: 'test',
      },
      relationships: [],
    },
  });

  const createTestSessionData = (id: string) => ({
    id,
    createdAt: Date.now(),
    lastAccessed: Date.now(),
    data: {},
    analysisResult: createTestAnalysisResult(id),
  });

  it('should create and retrieve a session', async () => {
    const sessionId = 'test-session';
    const sessionData = createTestSessionData(sessionId);

    await store.setSession(sessionId, sessionData);
    const retrievedData = await store.getSession(sessionId);

    expect(retrievedData).toEqual(sessionData);
  });

  it('should update an existing session', async () => {
    const sessionId = 'test-session';
    const initialData = createTestSessionData(sessionId);
    const updatedData = {
      ...initialData,
      data: { key: 'value' },
    };

    await store.setSession(sessionId, initialData);
    await store.setSession(sessionId, updatedData);
    const retrievedData = await store.getSession(sessionId);

    expect(retrievedData).toEqual(updatedData);
  });

  it('should delete a session', async () => {
    const sessionId = 'test-session';
    const sessionData = createTestSessionData(sessionId);

    await store.setSession(sessionId, sessionData);
    await store.deleteSession(sessionId);
    const retrievedData = await store.getSession(sessionId);

    expect(retrievedData).toBeNull();
  });

  it('should clear all sessions', async () => {
    const session1 = createTestSessionData('session-1');
    const session2 = createTestSessionData('session-2');

    await store.setSession('session-1', session1);
    await store.setSession('session-2', session2);
    await store.clear();

    const sessions = await store.getSessions();
    expect(sessions).toHaveLength(0);
  });

  it('should extend session TTL', async () => {
    const sessionId = 'test-session';
    const sessionData = createTestSessionData(sessionId);

    await store.setSession(sessionId, sessionData);
    const result = await store.extendSessionTtl(sessionId, 7200);

    expect(result).toBe(true);
  });

  it('should get session TTL', async () => {
    const sessionId = 'test-session';
    const sessionData = createTestSessionData(sessionId);

    await store.setSession(sessionId, sessionData);
    const ttl = await store.getSessionTtl(sessionId);

    expect(ttl).toBeGreaterThan(0);
  });

  it('should acquire and release a lock', async () => {
    const sessionId = 'test-session';
    const lockToken = await store.acquireLock(sessionId);

    expect(lockToken).toBeDefined();

    const result = await store.releaseLock(sessionId, lockToken!);
    expect(result).toBe(true);
  });

  it('should create session if not exists', async () => {
    const sessionId = 'test-session';
    const sessionData = createTestSessionData(sessionId);

    const result = await store.createSessionIfNotExists(sessionId, sessionData);
    expect(result).toEqual(sessionData);

    const retrievedData = await store.getSession(sessionId);
    expect(retrievedData).toEqual(sessionData);
  });

  it('should return existing session if exists', async () => {
    const sessionId = 'test-session';
    const initialData = createTestSessionData(sessionId);
    const newData = {
      ...initialData,
      data: { key: 'value' },
    };

    await store.setSession(sessionId, initialData);
    const result = await store.createSessionIfNotExists(sessionId, newData);

    expect(result).toEqual(initialData);
  });
});
