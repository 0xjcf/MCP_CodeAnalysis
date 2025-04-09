/**
 * Tests for Tool Machine
 *
 * This file contains tests for the state machine that powers tool execution.
 * It validates the state transitions, context updates, and overall behavior
 * of the tool execution state machine.
 */

import { IToolResult, IExecutionResult } from '@mcp/types';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Actor } from 'xstate';
import { createActor } from 'xstate';

import {
  toolMachine,
  getSession,
  clearSession,
  getSessionIds,
  createToolExecutionService,
} from '../state/machines/toolMachine.js';
import type { IToolMachineContext } from '../state/machines/toolMachine.types.js';

// Define the type for our state machine actor
type ToolMachineActor = Actor<typeof toolMachine>;

describe('Tool Machine', () => {
  // Clear all sessions before each test
  beforeEach(() => {
    // Clear any existing sessions
    getSessionIds().forEach(clearSession);
  });

  describe('State Transitions', () => {
    // Shared actor for all tests in this describe block
    let actor: ToolMachineActor;

    beforeEach(() => {
      // Create and start the actor before each test
      actor = createActor(toolMachine, {
        input: {
          sessionId: 'test-session',
          toolId: 'test-tool',
        },
      }).start();
    });

    afterEach(() => {
      // Stop the actor after each test
      actor.stop();
    });

    it('should start in the idle state', () => {
      expect(actor.getSnapshot().value).toBe('idle');
    });

    it('should transition to toolSelected state when SELECT_TOOL event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });

      const snapshot = actor.getSnapshot();
      const context = snapshot.context;
      expect(context.toolName).toBe('testTool');
    });

    it('should transition to parametersSet state when SET_PARAMETERS event is sent after SELECT_TOOL', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });

      const snapshot = actor.getSnapshot();
      const context = snapshot.context;
      expect(context.parameters).toEqual({ param1: 'value1' });
    });

    it('should transition to executing state when EXECUTE event is sent after SET_PARAMETERS', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });

      expect(actor.getSnapshot().value).toBe('executing');
    });

    it('should transition to succeeded state when RECEIVED_RESULT event is sent after EXECUTE', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });

      const result = {
        data: 'testResult',
        context: {},
        status: 'success' as const,
        timestamp: Date.now(),
        metadata: {
          tool: 'testTool',
          version: '1.0.0',
          executionTime: 0,
        },
      };

      actor.send({ type: 'RECEIVED_RESULT', result });

      expect(actor.getSnapshot().value).toBe('succeeded');
    });

    it('should transition to failed state when ERROR event is sent after EXECUTE', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });
      actor.send({ type: 'ERROR', error: new Error('Test error') });

      expect(actor.getSnapshot().value).toBe('failed');
    });

    it('should transition to cancelled state when CANCEL event is sent after EXECUTE', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });
      actor.send({ type: 'CANCEL' });

      expect(actor.getSnapshot().value).toBe('cancelled');
    });

    it('should reset state when RESET event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'RESET' });

      const snapshot = actor.getSnapshot();
      const context = snapshot.context;
      expect(actor.getSnapshot().value).toBe('idle');
      expect(context.toolName).toBeNull();
      expect(context.parameters).toBeNull();
    });

    it('should handle tool selection', () => {
      const actor = createActor(toolMachine);
      actor.start();
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      const snapshot = actor.getSnapshot();
      if (!snapshot) return;

      const context = snapshot.context;
      expect(context.toolName).toBe('testTool');
      expect(context.selectedTool).toBeNull();
    });

    it('should transition to toolSelected state when tool is selected', () => {
      const actor = createActor(toolMachine);
      actor.start();
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      expect(actor.getSnapshot().value).toBe('toolSelected');
    });
  });

  describe('Context Management', () => {
    // Shared actor for all tests in this describe block
    let actor: ToolMachineActor;

    beforeEach(() => {
      // Create and start the actor before each test
      actor = createActor(toolMachine, {
        input: {
          sessionId: 'test-session',
          toolId: 'test-tool',
        },
      }).start();
    });

    afterEach(() => {
      // Stop the actor after each test
      actor.stop();
    });

    it('should update context with tool name when SELECT_TOOL event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });

      const snapshot = actor.getSnapshot();
      const context = snapshot.context;
      expect(context.toolName).toBe('testTool');
    });

    it('should update context with parameters when SET_PARAMETERS event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1', param2: 42 } });

      const snapshot = actor.getSnapshot();
      const context = snapshot.context;
      expect(context.parameters).toEqual({ param1: 'value1', param2: 42 });
    });

    it('should update context with result when RECEIVED_RESULT event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });

      const result = {
        data: 'testResult',
        metadata: { executionTime: 100 },
        context: {},
        status: 'success' as const,
        timestamp: Date.now(),
      };
      actor.send({ type: 'RECEIVED_RESULT', result });

      const snapshot = actor.getSnapshot();
      const context = snapshot.context;
      expect(context.result).toEqual(result);
    });

    it('should update context with error when ERROR event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });

      const error = new Error('Test error');
      actor.send({ type: 'ERROR', error });

      const snapshot = actor.getSnapshot();
      const context = snapshot.context;
      expect(context.error).toBe(error);
      expect(context.result).toBeNull();
    });

    it('should add to history when a result is received', () => {
      actor.send({ type: 'SELECT_TOOL', tool: 'testTool', handler: null });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });

      const resultData = { data: 'testResult' };
      const result = {
        data: resultData,
        context: {},
        status: 'success' as const,
        timestamp: Date.now(),
        metadata: {
          tool: 'testTool',
          version: '1.0.0',
          executionTime: 0,
        },
      };

      actor.send({ type: 'RECEIVED_RESULT', result });

      const snapshot = actor.getSnapshot();
      const context = snapshot.context;
      expect(context.history.length).toBe(1);
      expect(context.history[0].tool).toBe('testTool');
      expect(context.history[0].result?.result).toEqual(resultData);
      expect(context.history[0].timestamp).toBeDefined();
    });
  });

  describe('Session Management', () => {
    it('should create a new session with a generated ID', () => {
      const session = createToolExecutionService();
      expect(session).toBeDefined();
      expect(session.getSessionId()).toBeDefined();

      const sessionIds = getSessionIds();
      expect(sessionIds).toContain(session.getSessionId());
    });

    it('should create a new session with a provided ID', () => {
      const sessionId = 'test-session-id';
      const session = createToolExecutionService(sessionId);
      expect(session.getSessionId()).toBe(sessionId);

      const sessionIds = getSessionIds();
      expect(sessionIds).toContain(sessionId);
    });

    it('should retrieve an existing session by ID', () => {
      const sessionId = 'test-session-id';
      const session1 = getSession(sessionId);
      const session2 = getSession(sessionId);

      expect(session1).toBe(session2);
      expect(session1.getSessionId()).toBe(sessionId);
    });

    it('should clear a session by ID', () => {
      const sessionId = 'test-session-id';
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
  });
});
