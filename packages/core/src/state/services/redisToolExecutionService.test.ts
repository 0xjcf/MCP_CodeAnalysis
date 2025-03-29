/**
 * Tests for RedisToolExecutionService
 *
 * @module redisToolExecutionService.test
 */

import { Redis } from 'ioredis';
import { RedisToolExecutionService } from './redisToolExecutionService.js';
import { createSuccessResponse } from '../../utils/responses.js';
import { Tool, ToolResult } from '../../tools/interfaces.js';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Redis client
const mockGet = vi.fn().mockResolvedValue(null);
const mockSet = vi.fn().mockResolvedValue('OK');
const mockQuit = vi.fn().mockResolvedValue('OK');

vi.mock('ioredis', () => {
  const Redis = vi.fn().mockImplementation(() => ({
    get: mockGet,
    set: mockSet,
    quit: mockQuit,
  }));
  return { Redis };
});

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
  let mockRedis: Redis;
  let service: RedisToolExecutionService;
  let mockTools: Map<string, Tool<any, any>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRedis = new Redis();
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
      await service.selectTool(toolName);

      // Wait for Redis operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockSet).toHaveBeenCalledWith(
        expect.stringContaining('test-session'),
        expect.any(String),
        'EX',
        3600,
      );
    });

    it('should persist state when setting parameters', async () => {
      const params = { key: 'value' };
      await service.selectTool('test-tool');
      await service.setParameters(params);

      // Wait for Redis operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockSet).toHaveBeenCalledWith(
        expect.stringContaining('test-session'),
        expect.any(String),
        'EX',
        3600,
      );
    });

    it('should restore state from Redis on initialization', async () => {
      const savedState = {
        context: {
          toolName: 'saved-tool',
          parameters: { key: 'value' },
        },
      };

      mockGet.mockResolvedValueOnce(JSON.stringify(savedState));

      const service = new RedisToolExecutionService({
        redisUrl: 'redis://localhost:6379',
        sessionId: 'test-session',
        tools: new Map(),
      });

      // Wait for Redis operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      const context = service.getContext();
      expect(context.toolName).toBe('saved-tool');
      expect(context.parameters).toEqual({ key: 'value' });
    });
  });

  describe('tool execution', () => {
    it('should persist state after successful execution', async () => {
      const toolName = 'test-tool';
      const params = { key: 'value' };
      const result = { data: 'success' };

      await service.selectTool(toolName);
      await service.setParameters(params);

      await service.execute(async () => result);

      // Wait for Redis operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockSet).toHaveBeenCalledWith(
        expect.stringContaining('test-session'),
        expect.any(String),
        'EX',
        3600,
      );
    });

    it('should persist state after error execution', async () => {
      const toolName = 'test-tool';
      const params = { key: 'value' };

      await service.selectTool(toolName);
      await service.setParameters(params);

      try {
        await service.execute(async () => {
          throw new Error('Test error');
        });
      } catch (error) {
        // Expected error
      }

      // Wait for Redis operations to complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockSet).toHaveBeenCalledWith(
        expect.stringContaining('test-session'),
        expect.any(String),
        'EX',
        3600,
      );
    });
  });

  describe('cleanup', () => {
    it('should close Redis connection on close', async () => {
      await service.close();
      expect(mockQuit).toHaveBeenCalled();
    });
  });
});
