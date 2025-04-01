import { describe, it, expect, beforeEach } from 'vitest';
import { ToolRegistry, ToolDefinition } from './tool-registry.js';

describe('ToolRegistry', () => {
  let registry: ToolRegistry;

  beforeEach(() => {
    registry = ToolRegistry.getInstance();
    registry.clear(); // Clear the registry before each test
  });

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = ToolRegistry.getInstance();
      const instance2 = ToolRegistry.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('registerTool', () => {
    it('should register a tool successfully', () => {
      const toolId = 'test-tool';
      const schema = { type: 'object' };
      const handler = async () => 'test';
      const source = 'test-source';

      const result = registry.registerTool(toolId, schema, handler, source);
      expect(result).toBe(true);
      expect(registry.isToolRegistered(toolId)).toBe(true);
    });

    it('should not register duplicate tools', () => {
      const toolId = 'test-tool';
      const schema = { type: 'object' };
      const handler = async () => 'test';
      const source = 'test-source';

      registry.registerTool(toolId, schema, handler, source);
      const result = registry.registerTool(toolId, schema, handler, source);
      expect(result).toBe(false);
    });
  });

  describe('getTool', () => {
    it('should return undefined for non-existent tool', () => {
      const tool = registry.getTool('non-existent');
      expect(tool).toBeUndefined();
    });

    it('should return registered tool', () => {
      const toolId = 'test-tool';
      const schema = { type: 'object' };
      const handler = async () => 'test';
      const source = 'test-source';

      registry.registerTool(toolId, schema, handler, source);
      const tool = registry.getTool(toolId);
      expect(tool).toBeDefined();
      expect(tool?.id).toBe(toolId);
    });
  });

  describe('getAllTools', () => {
    it('should return all registered tools', () => {
      const toolId = 'test-tool';
      const schema = { type: 'object' };
      const handler = async () => 'test';
      const source = 'test-source';

      registry.registerTool(toolId, schema, handler, source);
      const tools = registry.getAllTools();
      expect(tools.size).toBe(1);
      expect(tools.get(toolId)).toBeDefined();
    });
  });

  describe('clear', () => {
    it('should clear all registered tools', () => {
      const toolId = 'test-tool';
      const schema = { type: 'object' };
      const handler = async () => 'test';
      const source = 'test-source';

      registry.registerTool(toolId, schema, handler, source);
      registry.clear();
      expect(registry.getAllTools().size).toBe(0);
    });
  });
});
