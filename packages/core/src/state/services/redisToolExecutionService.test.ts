/**
 * Tests for RedisToolExecutionService
 *
 * @module redisToolExecutionService.test
 */

import type { ISessionStore} from '@mcp/types';
import { ISessionData } from '@mcp/types';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import type { ITool } from '../../tools/interfaces.js';

import { RedisSessionStore } from './redisSessionStore.js';
import { RedisToolExecutionService } from './redisToolExecutionService.js';


// Mock Redis client
const mockRedis = {
  on: vi.fn(),
  quit: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  keys: vi.fn(),
};

vi.mock('ioredis', () => ({
  default: vi.fn().mockImplementation(() => mockRedis),
}));

// Mock RedisSessionStore
const mockSessionStore = {
  getSession: vi.fn(),
  setSession: vi.fn(),
  deleteSession: vi.fn(),
  clearSession: vi.fn(),
  getSessions: vi.fn(),
  clear: vi.fn(),
  acquireLock: vi.fn(),
  releaseLock: vi.fn(),
  extendSessionTtl: vi.fn(),
  getSessionTtl: vi.fn(),
  createSessionIfNotExists: vi.fn(),
} as unknown as ISessionStore;

vi.mock('./redisSessionStore.js', () => ({
  RedisSessionStore: vi.fn().mockImplementation(() => mockSessionStore),
}));

describe('RedisToolExecutionService', () => {
  let service: RedisToolExecutionService;
  const mockTool: ITool = {
    id: 'test-tool',
    name: 'Test Tool',
    description: 'A test tool',
    execute: vi.fn(),
  };

  beforeEach(() => {
    service = new RedisToolExecutionService({
      redisUrl: 'redis://localhost:6379',
      prefix: 'test:',
      defaultTtl: 3600,
      lockTimeout: 30000,
      tools: new Map([['test-tool', mockTool]]),
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize correctly', async () => {
    await service.initialize();
    expect(mockSessionStore.getSession).toHaveBeenCalled();
    expect(mockSessionStore.setSession).toHaveBeenCalled();
  });

  it('should get session data', async () => {
    const mockData = {
      serviceId: 'test',
      state: 'idle',
      lastUpdated: Date.now(),
    };
    vi.mocked(mockSessionStore.getSession).mockResolvedValue(mockData);
    const data = await service.getSessionData();
    expect(data).toEqual(mockData);
  });

  it('should update session data', async () => {
    const mockData = {
      serviceId: 'test',
      state: 'idle',
      lastUpdated: Date.now(),
    };
    vi.mocked(mockSessionStore.getSession).mockResolvedValue(mockData);
    await service.updateSessionData({ state: 'running' });
    expect(mockSessionStore.setSession).toHaveBeenCalled();
  });

  it('should acquire lock', async () => {
    vi.mocked(mockSessionStore.acquireLock).mockResolvedValue('lock-token');
    const result = await service.acquireLock();
    expect(result).toBe(true);
    expect(mockSessionStore.acquireLock).toHaveBeenCalled();
  });

  it('should release lock', async () => {
    vi.mocked(mockSessionStore.acquireLock).mockResolvedValue('lock-token');
    vi.mocked(mockSessionStore.releaseLock).mockResolvedValue(true);
    await service.acquireLock();
    const result = await service.releaseLock();
    expect(result).toBe(true);
    expect(mockSessionStore.releaseLock).toHaveBeenCalled();
  });

  it('should close resources', async () => {
    await service.close();
    expect(mockSessionStore.releaseLock).toHaveBeenCalled();
    expect(mockRedis.quit).toHaveBeenCalled();
  });

  describe('Tool Execution', () => {
    it('should execute a tool successfully', async () => {
      const params = { test: 'value' };
      const mockResult = { result: { success: true } };
      vi.mocked(mockTool.execute).mockResolvedValue(mockResult);

      const result = await service.executeTool('test-tool', params);

      expect(result.status).toBe('success');
      expect(result.result).toEqual(mockResult);
      expect(result.toolId).toBe('test-tool');
      expect(result.params).toEqual(params);
      expect(result.fromCache).toBe(false);
      expect(mockTool.execute).toHaveBeenCalledWith(params);
    });

    it('should throw error for non-existent tool', async () => {
      await expect(service.executeTool('non-existent', {})).rejects.toThrow(
        'Tool non-existent not found',
      );
    });

    it('should handle tool execution errors', async () => {
      const error = new Error('Test error');
      vi.mocked(mockTool.execute).mockRejectedValue(error);

      const result = await service.executeTool('test-tool', {});

      expect(result.status).toBe('error');
      expect(result.error).toBe('Test error');
      expect(result.result).toBeNull();
    });

    it('should use cached results when available', async () => {
      const params = { test: 'value' };
      const cachedResult = { cached: true };
      const cacheKey = 'test-tool:{"test":"value"}';

      vi.mocked(mockRedis.get).mockResolvedValue(JSON.stringify(cachedResult));

      const result = await service.executeTool('test-tool', params, undefined, true);

      expect(result.status).toBe('success');
      expect(result.result).toEqual(cachedResult);
      expect(result.fromCache).toBe(true);
      expect(mockTool.execute).not.toHaveBeenCalled();
      expect(mockRedis.get).toHaveBeenCalledWith(cacheKey);
    });

    it('should cache successful results', async () => {
      const params = { test: 'value' };
      const mockResult = { result: { success: true } };
      const cacheKey = 'test-tool:{"test":"value"}';

      vi.mocked(mockTool.execute).mockResolvedValue(mockResult);

      await service.executeTool('test-tool', params, undefined, true);

      expect(mockRedis.set).toHaveBeenCalledWith(cacheKey, JSON.stringify(mockResult));
    });
  });

  describe('Cache Management', () => {
    it('should invalidate tool cache', async () => {
      const keys = ['test-tool:key1', 'test-tool:key2'];
      vi.mocked(mockRedis.keys).mockResolvedValue(keys);

      await service.invalidateToolCache('test-tool');

      expect(mockRedis.keys).toHaveBeenCalledWith('test-tool:*');
      expect(mockRedis.del).toHaveBeenCalledWith(...keys);
    });

    it('should clear session data', async () => {
      const sessionId = 'test-session';
      await service.clearSession(sessionId);

      expect(mockSessionStore.deleteSession).toHaveBeenCalledWith(sessionId);
    });
  });

  describe('Service Information', () => {
    it('should get service statistics', async () => {
      const mockData = {
        serviceId: 'test',
        state: 'idle',
        lastUpdated: Date.now(),
        history: [{ tool: 'test-tool', result: {}, timestamp: '2024-01-01' }],
      };
      vi.mocked(mockSessionStore.getSession).mockResolvedValue(mockData);

      const stats = await service.getStats();

      expect(stats).toEqual({
        serviceId: expect.any(String),
        state: 'idle',
        lastUpdated: expect.any(Number),
        toolCount: 1,
        historyCount: 1,
      });
    });

    it('should get registered tools', () => {
      const tools = service.getTools();
      expect(tools.size).toBe(1);
      expect(tools.get('test-tool')).toBe(mockTool);
    });
  });
});
