// @ts-nocheck - Temporarily disable type checking while fixing ESM issues
/**
 * Tests for response utilities
 * @vitest-environment node
 */

import { describe, it, expect, vi } from 'vitest';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  executeWithTiming,
  validateResponse,
  extractResponseData,
  combineResponses
} from '../utils/responses';

import { ToolResponseSchema } from '../types/responses';

describe('Response Utilities', () => {
  
  describe('createSuccessResponse', () => {
    it('should create a valid success response', () => {
      const data = { test: 'data' };
      const response = createSuccessResponse(data, 'test-tool');
      
      expect(response.data).toEqual(data);
      expect(response.metadata.tool).toEqual('test-tool');
      expect(response.status.success).toBe(true);
      expect(response.status.code).toBe(200);
      
      // Should be valid according to schema
      const validation = ToolResponseSchema.safeParse(response);
      expect(validation.success).toBe(true);
    });
    
    it('should include session context when provided', () => {
      const data = { test: 'data' };
      const sessionId = 'test-session';
      const response = createSuccessResponse(data, 'test-tool', { sessionId });
      
      expect(response.context).toBeDefined();
      expect(response.context?.sessionId).toEqual(sessionId);
    });
    
    it('should calculate execution time when provided', () => {
      const data = { test: 'data' };
      const response = createSuccessResponse(data, 'test-tool', { executionTime: 100 });
      
      expect(response.metadata.executionTime).toEqual(100);
    });
  });
  
  describe('createErrorResponse', () => {
    it('should create a valid error response', () => {
      const message = 'Test error message';
      const response = createErrorResponse(message, 'test-tool');
      
      expect(response.data).toBeNull();
      expect(response.metadata.tool).toEqual('test-tool');
      expect(response.status.success).toBe(false);
      expect(response.status.code).toBe(400);
      expect(response.status.message).toEqual(message);
      
      // Should be valid according to schema
      const validation = ToolResponseSchema.safeParse(response);
      expect(validation.success).toBe(true);
    });
    
    it('should include custom error code when provided', () => {
      const message = 'Test error message';
      const response = createErrorResponse(message, 'test-tool', { code: 404 });
      
      expect(response.status.code).toEqual(404);
    });
    
    it('should include data when provided', () => {
      const message = 'Test error message';
      const data = { additionalInfo: 'error details' };
      const response = createErrorResponse(message, 'test-tool', { data });
      
      expect(response.data).toEqual(data);
    });
  });
  
  describe('executeWithTiming', () => {
    it('should time function execution and return success response', async () => {
      const mockFn = vi.fn().mockResolvedValue({ result: 'success' });
      
      const response = await executeWithTiming('test-tool', mockFn);
      
      expect(mockFn).toHaveBeenCalled();
      expect(response.data).toEqual({ result: 'success' });
      expect(response.status.success).toBe(true);
      expect(response.metadata.executionTime).toBeGreaterThanOrEqual(0);
    });
    
    it('should handle errors and return error response', async () => {
      const error = new Error('Test error');
      const mockFn = vi.fn().mockRejectedValue(error);
      
      const response = await executeWithTiming('test-tool', mockFn);
      
      expect(mockFn).toHaveBeenCalled();
      expect(response.status.success).toBe(false);
      expect(response.status.message).toEqual('Test error');
      expect(response.metadata.executionTime).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('validateResponse', () => {
    it('should return true for valid responses', () => {
      const response = createSuccessResponse('test', 'test-tool');
      expect(validateResponse(response)).toBe(true);
    });
    
    it('should throw for invalid responses', () => {
      const invalidResponse = {
        // Missing required fields
        data: 'test',
        status: { success: true }
      };
      
      // @ts-ignore - deliberately testing invalid type
      expect(() => validateResponse(invalidResponse)).toThrow();
    });
  });
  
  describe('extractResponseData', () => {
    it('should extract only the data portion', () => {
      const data = { key: 'value' };
      const response = createSuccessResponse(data, 'test-tool');
      
      expect(extractResponseData(response)).toEqual(data);
    });
  });
  
  describe('combineResponses', () => {
    it('should combine multiple responses', () => {
      const response1 = createSuccessResponse({ first: true }, 'tool-1', { executionTime: 100 });
      const response2 = createSuccessResponse({ second: true }, 'tool-2', { executionTime: 150 });
      
      const combined = combineResponses([response1, response2], 'combined-tool');
      
      expect(combined.data).toHaveLength(2);
      expect(combined.data[0]).toEqual({ first: true });
      expect(combined.data[1]).toEqual({ second: true });
      // Allow for small variations in execution time calculation
      expect(combined.metadata.executionTime).toBeGreaterThanOrEqual(249);
      expect(combined.metadata.executionTime).toBeLessThanOrEqual(251);
    });
    
    it('should use transform function when provided', () => {
      const response1 = createSuccessResponse({ value: 10 }, 'tool-1');
      const response2 = createSuccessResponse({ value: 20 }, 'tool-2');
      
      const transform = (data: any[]) => ({ sum: data.reduce((acc, item) => acc + item.value, 0) });
      const combined = combineResponses([response1, response2], 'combined-tool', { transform });
      
      expect(combined.data).toEqual({ sum: 30 });
    });
    
    it('should collect related results', () => {
      const response1 = createSuccessResponse({ first: true }, 'tool-1', { 
        relatedResults: ['result-a', 'result-b'] 
      });
      const response2 = createSuccessResponse({ second: true }, 'tool-2', { 
        relatedResults: ['result-c'] 
      });
      
      const combined = combineResponses([response1, response2], 'combined-tool');
      
      expect(combined.context?.relatedResults).toContain('result-a');
      expect(combined.context?.relatedResults).toContain('result-b');
      expect(combined.context?.relatedResults).toContain('result-c');
    });
  });
}); 