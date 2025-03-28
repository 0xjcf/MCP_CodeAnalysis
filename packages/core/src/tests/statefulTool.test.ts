/**
 * Tests for Stateful Tool
 * 
 * This file contains tests for the stateful tool integration helper,
 * which provides a way to integrate MCP tools with XState state machines.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  createStatefulTool, 
  getSession, 
  clearSession, 
  getSessionIds 
} from '../state/helpers/statefulTool';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { z } from "zod";

// Create a type for our mock server
type MockServer = {
  tool: ReturnType<typeof vi.fn>;
};

describe('Stateful Tool', () => {
  // Mock server and handler to be used in multiple tests
  let mockServer: MockServer & Partial<McpServer>;
  let handler: ReturnType<typeof vi.fn>;
  
  // Clear all sessions before each test and setup mocks
  beforeEach(() => {
    // Clear any existing sessions
    getSessionIds().forEach(clearSession);
    
    // Reset and recreate mocks for each test
    mockServer = {
      tool: vi.fn()
    };
    
    handler = vi.fn();
  });

  afterEach(() => {
    // Clear any mocks
    vi.resetAllMocks();
  });

  describe('Tool Registration', () => {
    it('should register a tool with the MCP server', () => {
      const schema = {
        param1: z.string(),
        param2: z.number()
      };
      handler.mockResolvedValue('test result');
      
      createStatefulTool(mockServer as unknown as McpServer, 'testTool', schema, handler);
      
      expect(mockServer.tool).toHaveBeenCalledWith(
        'testTool',
        expect.objectContaining({
          param1: expect.any(Object),
          param2: expect.any(Object),
          sessionId: expect.any(Object)
        }),
        expect.any(Function)
      );
    });

    it('should add sessionId parameter to the schema', () => {
      const schema = {
        param1: z.string()
      };
      handler.mockResolvedValue('test result');
      
      createStatefulTool(mockServer as unknown as McpServer, 'testTool', schema, handler);
      
      // Extract the handler function from the tool call
      const toolHandler = mockServer.tool.mock.calls[0][2];
      expect(toolHandler).toBeDefined();
      
      // Call the handler to ensure it doesn't throw
      expect(async () => {
        await toolHandler({ param1: 'test', sessionId: 'test-session' });
      }).not.toThrow();
    });
  });

  describe('Tool Execution', () => {
    // Schema to be reused in multiple tests
    const schema = {
      param1: z.string(),
      param2: z.number()
    };
    
    beforeEach(() => {
      // Setup common scenario for all execution tests
      handler.mockResolvedValue('test result');
      createStatefulTool(mockServer as unknown as McpServer, 'testTool', schema, handler);
    });
    
    it('should call the handler with the provided parameters', async () => {
      // Extract the handler function from the tool call
      const toolHandler = mockServer.tool.mock.calls[0][2];
      
      // Call the handler
      await toolHandler({ param1: 'test', param2: 42, sessionId: 'test-session' });
      
      // Verify the handler was called with the correct parameters
      expect(handler).toHaveBeenCalledWith({ param1: 'test', param2: 42 });
    });

    it('should return an MCP-formatted response', async () => {
      // Set up a specific result for this test
      handler.mockReset();
      handler.mockResolvedValue({ success: true, data: 'test result' });
      
      // Extract the handler function from the tool call
      const toolHandler = mockServer.tool.mock.calls[0][2];
      
      // Call the handler
      const response = await toolHandler({ param1: 'test', param2: 1, sessionId: 'test-session' });
      
      // Verify the response format
      expect(response).toHaveProperty('content');
      expect(response.content).toBeInstanceOf(Array);
      expect(response.content[0]).toHaveProperty('type', 'text');
      expect(response.content[0]).toHaveProperty('text');
      
      // The text should be a JSON string with our result
      const parsedResult = JSON.parse(response.content[0].text);
      expect(parsedResult).toHaveProperty('data');
      expect(parsedResult).toHaveProperty('status');
      expect(parsedResult).toHaveProperty('metadata');
      expect(parsedResult).toHaveProperty('context');
      expect(parsedResult.context).toHaveProperty('sessionId');
    });

    it('should handle errors and return error responses', async () => {
      // Set up an error for this test
      handler.mockReset();
      const error = new Error('Test error');
      handler.mockRejectedValue(error);
      
      // Extract the handler function from the tool call
      const toolHandler = mockServer.tool.mock.calls[0][2];
      
      // Call the handler
      const response = await toolHandler({ param1: 'test', param2: 1, sessionId: 'test-session' });
      
      // Verify the error response format
      expect(response).toHaveProperty('content');
      expect(response.content).toBeInstanceOf(Array);
      expect(response.content[0]).toHaveProperty('type', 'text');
      expect(response.content[0]).toHaveProperty('text', 'Test error');
      expect(response).toHaveProperty('isError', true);
    });
  });

  describe('Session Management', () => {
    // Schema to be reused in multiple tests
    const schema = {
      param1: z.string()
    };
    
    beforeEach(() => {
      handler.mockResolvedValue('test result');
      createStatefulTool(mockServer as unknown as McpServer, 'testTool', schema, handler);
    });
    
    it('should create a new session when no sessionId is provided', async () => {
      // Extract the handler function from the tool call
      const toolHandler = mockServer.tool.mock.calls[0][2];
      
      // Call the handler without a sessionId
      const response = await toolHandler({ param1: 'test' });
      
      // Parse the response to get the session ID
      const parsedResult = JSON.parse(response.content[0].text);
      
      // Verify a session ID was created
      expect(parsedResult.context).toHaveProperty('sessionId');
      expect(parsedResult.context.sessionId).toBeDefined();
    });

    it('should reuse an existing session when sessionId is provided', async () => {
      // Extract the handler function from the tool call
      const toolHandler = mockServer.tool.mock.calls[0][2];
      
      // Call the handler with a sessionId
      const sessionId = 'test-session';
      const response1 = await toolHandler({ param1: 'test1', sessionId });
      
      // Call the handler again with the same sessionId
      const response2 = await toolHandler({ param1: 'test2', sessionId });
      
      // Parse the responses to verify the session ID
      const parsedResult1 = JSON.parse(response1.content[0].text);
      const parsedResult2 = JSON.parse(response2.content[0].text);
      
      // Verify the same session ID was used
      expect(parsedResult1.context.sessionId).toBe(sessionId);
      expect(parsedResult2.context.sessionId).toBe(sessionId);
    });
  });

  describe('Session Helper Functions', () => {
    it('should get a session by ID, creating one if it does not exist', () => {
      const sessionId = 'test-session';
      const session = getSession(sessionId);
      
      expect(session).toBeDefined();
      expect(session.getSessionId()).toBe(sessionId);
    });

    it('should generate a session ID if none is provided', () => {
      const session = getSession();
      
      expect(session).toBeDefined();
      expect(session.getSessionId()).toBeDefined();
      expect(typeof session.getSessionId()).toBe('string');
    });

    it('should clear a session by ID', () => {
      const sessionId = 'test-session';
      getSession(sessionId); // Create the session
      
      const result = clearSession(sessionId);
      expect(result).toBe(true);
      
      const sessionIds = getSessionIds();
      expect(sessionIds).not.toContain(sessionId);
    });

    it('should return false when clearing a non-existent session', () => {
      const result = clearSession('non-existent-session');
      expect(result).toBe(false);
    });

    it('should get all active session IDs', () => {
      // Clear any existing sessions
      getSessionIds().forEach(clearSession);
      
      // Create some sessions
      const session1 = getSession('session1');
      const session2 = getSession('session2');
      const session3 = getSession(); // Generated ID
      
      const sessionIds = getSessionIds();
      expect(sessionIds).toContain('session1');
      expect(sessionIds).toContain('session2');
      expect(sessionIds).toContain(session3.getSessionId());
      expect(sessionIds.length).toBe(3);
    });
  });

  describe('State Persistence', () => {
    it('should maintain state between calls with the same session', async () => {
      // Create a session and execute a tool
      const sessionId = 'test-state-session';
      const session = getSession(sessionId);
      
      // Execute operations on the session
      session.selectTool('firstTool');
      session.setParameters({ param: 'value1' });
      
      // Check that another session with the same ID has the same state
      const sameSession = getSession(sessionId);
      expect(sameSession.getContext().toolName).toBe('firstTool');
      expect(sameSession.getContext().parameters).toEqual({ param: 'value1' });
      
      // Change the state and verify it affects the original session
      sameSession.selectTool('secondTool');
      
      // Force reading the latest state
      const context = session.getContext();
      expect(context.toolName).toBe('secondTool');
    });
  });
}); 