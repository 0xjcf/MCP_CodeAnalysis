/**
 * Tests for RedisToolExecutionService
 *
 * @module redisToolExecutionService.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RedisToolExecutionService } from './redisToolExecutionService.js';
import { createSuccessResponse } from '../../utils/responses.js';
import { Tool, ToolResult } from '../../tools/interfaces.js';
import { RedisSessionStore } from '../../redisSessionStore.js';

// Mock RedisSessionStore
const mockSessionStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
  exists: vi.fn(),
  extendSessionTtl: vi.fn(),
  close: vi.fn(),
  acquireLock: vi.fn(),
  releaseLock: vi.fn(),
};

vi.mock('../../redisSessionStore.js', () => ({
  RedisSessionStore: vi.fn().mockImplementation(() => mockSessionStore),
}));

// Helper function to create a mock tool
const createMockTool = (name: string): Tool<any, any> => ({
  id: name,
  name,
  description: `Mock tool: ${name}`,
  version: '1.0.0',
  category: 'test',
  execute: async (): Promise<ToolResult<any>> => ({
    result: { success: true },
  }),
});

describe('RedisToolExecutionService', () => {
  let service: RedisToolExecutionService;
  let mockTools: Map<string, Tool<any, any>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockTools = new Map();
    service = new RedisToolExecutionService({
      redisUrl: 'redis://localhost:6379',
      sessionId: 'test-session',
      tools: mockTools,
    });

    // Setup mock tools
    mockTools.set('test-tool', createMockTool('test-tool'));
  });

  afterEach(async () => {
    await service.close();
  });

  describe('initialization', () => {
    it('should create a new service with default options', () => {
      const service = new RedisToolExecutionService({
        redisUrl: 'redis://localhost:6379',
        tools: new Map(),
      });
      expect(service).toBeDefined();
      expect(service.getSessionId()).toBeDefined();
    });

    it('should use provided session ID', () => {
      const sessionId = 'custom-session-id';
      const service = new RedisToolExecutionService({
        redisUrl: 'redis://localhost:6379',
        sessionId,
        tools: new Map(),
      });
      expect(service.getSessionId()).toBe(sessionId);
    });
  });

  describe('state persistence', () => {
    it('should persist state when selecting a tool', async () => {
      const toolName = 'test-tool';
      mockSessionStore.acquireLock.mockResolvedValue('lock-token');
      mockSessionStore.get.mockResolvedValue({
        success: true,
        data: {
          state: { value: 'idle' },
          context: {},
        },
      });

      await service.selectTool(toolName);

      expect(mockSessionStore.acquireLock).toHaveBeenCalled();
      expect(mockSessionStore.set).toHaveBeenCalled();
      expect(mockSessionStore.releaseLock).toHaveBeenCalled();
    });

    it('should persist state when setting parameters', async () => {
      const params = { key: 'value' };
      mockSessionStore.acquireLock.mockResolvedValue('lock-token');
      mockSessionStore.get.mockResolvedValue({
        success: true,
        data: {
          state: { value: 'tool_selected' },
          context: { selectedTool: 'test-tool' },
        },
      });

      await service.selectTool('test-tool');
      await service.setParameters(params);

      expect(mockSessionStore.acquireLock).toHaveBeenCalled();
      expect(mockSessionStore.set).toHaveBeenCalled();
      expect(mockSessionStore.releaseLock).toHaveBeenCalled();
    });

    it('should restore state from Redis on initialization', async () => {
      const savedState = {
        success: true,
        data: {
          state: { value: 'tool_selected' },
          context: {
            toolName: 'saved-tool',
            parameters: { key: 'value' },
          },
        },
      };

      mockSessionStore.exists.mockResolvedValue(true);
      mockSessionStore.get.mockResolvedValue(savedState);

      await service.initializeState();

      expect(mockSessionStore.get).toHaveBeenCalled();
    });
  });

  describe('tool execution', () => {
    it('should persist state after successful execution', async () => {
      const toolName = 'test-tool';
      const params = { key: 'value' };
      const result = { data: 'success' };

      mockSessionStore.acquireLock.mockResolvedValue('lock-token');
      mockSessionStore.get.mockResolvedValue({
        success: true,
        data: {
          state: { value: 'tool_selected' },
          context: { selectedTool: 'test-tool' },
        },
      });

      await service.selectTool(toolName);
      await service.setParameters(params);

      await service.execute(async () => result);

      expect(mockSessionStore.acquireLock).toHaveBeenCalled();
      expect(mockSessionStore.set).toHaveBeenCalled();
      expect(mockSessionStore.releaseLock).toHaveBeenCalled();
    });

    it('should persist state after error execution', async () => {
      const toolName = 'test-tool';
      const params = { key: 'value' };

      mockSessionStore.acquireLock.mockResolvedValue('lock-token');
      mockSessionStore.get.mockResolvedValue({
        success: true,
        data: {
          state: { value: 'tool_selected' },
          context: { selectedTool: 'test-tool' },
        },
      });

      await service.selectTool(toolName);
      await service.setParameters(params);

      try {
        await service.execute(async () => {
          throw new Error('Test error');
        });
      } catch (error) {
        // Expected error
      }

      expect(mockSessionStore.acquireLock).toHaveBeenCalled();
      expect(mockSessionStore.set).toHaveBeenCalled();
      expect(mockSessionStore.releaseLock).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should close Redis connection on close', async () => {
      await service.close();
      expect(mockSessionStore.close).toHaveBeenCalled();
    });
  });
});
