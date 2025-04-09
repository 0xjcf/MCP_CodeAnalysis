import type { RequestHandlerExtra, CallToolResult, IToolDefinition } from '@mcp/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { z } from 'zod';

import { ToolRegistry, getToolRegistry } from '../tool-registry.js';

describe('ToolRegistry', () => {
  let registry: ToolRegistry;

  beforeEach(() => {
    registry = getToolRegistry();
    registry.clear();
  });

  it('should be a singleton', () => {
    const registry1 = getToolRegistry();
    const registry2 = getToolRegistry();
    expect(registry1).toBe(registry2);
  });

  it('should register and retrieve tools', () => {
    const toolName = 'test-tool';
    const toolDescription = 'A test tool';
    const toolParameters = {
      param1: z.string(),
      param2: z.number(),
    };
    const toolCallback = async (
      _args: Record<string, unknown>,
      _extra: RequestHandlerExtra,
    ): Promise<CallToolResult> => {
      await new Promise(resolve => setTimeout(resolve, 0));
      return {
        success: true,
        content: [{ type: 'text', text: 'test response' }],
      };
    };

    registry.registerTool(toolName, toolParameters, toolCallback, 'test', {
      description: toolDescription,
    });

    const tool = registry.getTool(toolName);
    expect(tool).toBeDefined();
    if (!tool) {
      throw new Error('Tool should be defined');
    }
    const { handler, description, schema } = tool;
    expect(handler).toBe(toolCallback);
    expect(description).toBe(toolDescription);
    expect(schema).toBe(toolParameters);
  });

  it('should handle unknown tools', () => {
    const unknownTool = 'unknown-tool';

    expect(registry.getTool(unknownTool)).toBeUndefined();
    expect(registry.getToolsByCategory(unknownTool)).toHaveLength(0);
  });

  it('should register a tool successfully', () => {
    const schema = { name: z.string() };
    const handler = vi.fn();
    const result = registry.registerTool('test-tool', schema, handler, 'test-module');
    expect(result).toBe(true);
    expect(registry.isToolRegistered('test-tool')).toBe(true);
  });

  it('should not register duplicate tools', () => {
    const schema = { name: z.string() };
    const handler = vi.fn();
    registry.registerTool('test-tool', schema, handler, 'test-module');
    const result = registry.registerTool('test-tool', schema, handler, 'another-module');
    expect(result).toBe(false);
  });

  it('should validate schema before registration', () => {
    const invalidSchema = { name: null as unknown as z.ZodType };
    const handler = vi.fn();
    const result = registry.registerTool('test-tool', invalidSchema, handler, 'test-module');
    expect(result).toBe(false);
    expect(registry.isToolRegistered('test-tool')).toBe(false);
  });

  it('should track registration counts by source', () => {
    const schema = { name: z.string() };
    const handler = vi.fn();
    registry.registerTool('tool1', schema, handler, 'module1');
    registry.registerTool('tool2', schema, handler, 'module1');
    registry.registerTool('tool3', schema, handler, 'module2');

    const summary = registry.getRegistrationSummary();
    expect(summary).toContain('module1: 2 tools');
    expect(summary).toContain('module2: 1 tools');
  });

  it('should get tools by category', () => {
    const schema = { name: z.string() };
    const handler = vi.fn();
    registry.registerTool('tool1', schema, handler, 'module1', { category: 'category1' });
    registry.registerTool('tool2', schema, handler, 'module1', { category: 'category2' });
    registry.registerTool('tool3', schema, handler, 'module2', { category: 'category1' });

    const category1Tools = registry.getToolsByCategory('category1');
    expect(category1Tools).toHaveLength(2);

    // Get and validate tools
    const tools1 = category1Tools.filter(
      (t): t is IToolDefinition => t !== undefined && t !== null,
    );
    const tool1 = tools1.find(t => t.id === 'tool1');
    const tool3 = tools1.find(t => t.id === 'tool3');
    expect(tool1).toBeDefined();
    expect(tool3).toBeDefined();
    expect(tool1?.id).toBe('tool1');
    expect(tool3?.id).toBe('tool3');

    const category2Tools = registry.getToolsByCategory('category2');
    expect(category2Tools).toHaveLength(1);

    // Get and validate tool
    const tools2 = category2Tools.filter(
      (t): t is IToolDefinition => t !== undefined && t !== null,
    );
    const tool2 = tools2.find(t => t.id === 'tool2');
    expect(tool2).toBeDefined();
    expect(tool2?.id).toBe('tool2');
  });

  it('should clear all registered tools', () => {
    const schema = { name: z.string() };
    const handler = vi.fn();
    registry.registerTool('tool1', schema, handler, 'module1');
    registry.registerTool('tool2', schema, handler, 'module2');

    registry.clear();
    expect(registry.isToolRegistered('tool1')).toBe(false);
    expect(registry.isToolRegistered('tool2')).toBe(false);
    expect(registry.getRegistrationSummary()).toBe(
      'Tool Registration Summary:\n------------------------',
    );
  });
});
