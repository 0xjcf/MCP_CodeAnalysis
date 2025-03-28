/**
 * Tests for Tool Machine
 * 
 * This file contains tests for the state machine that powers tool execution.
 * It validates the state transitions, context updates, and overall behavior
 * of the tool execution state machine.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createActor, Actor } from 'xstate';
import { 
  toolMachine, 
  ToolMachineContext, 
  getSession, 
  clearSession, 
  getSessionIds, 
  createToolExecutionService 
} from '../state/machines/toolMachine';

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
      actor = createActor(toolMachine).start();
    });

    afterEach(() => {
      // Stop the actor after each test
      actor.stop();
    });

    it('should start in the idle state', () => {
      expect(actor.getSnapshot().value).toBe('idle');
    });

    it('should transition to toolSelected state when SELECT_TOOL event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      
      expect(actor.getSnapshot().value).toBe('toolSelected');
      expect(actor.getSnapshot().context.toolName).toBe('testTool');
      expect(actor.getSnapshot().context.selectedTool).toBe('testTool');
    });

    it('should transition from toolSelected to parametersSet when SET_PARAMETERS event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      
      expect(actor.getSnapshot().value).toBe('parametersSet');
      expect(actor.getSnapshot().context.parameters).toEqual({ param1: 'value1' });
    });

    it('should transition from parametersSet to executing when EXECUTE event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });
      
      expect(actor.getSnapshot().value).toBe('executing');
    });

    it('should transition from executing to succeeded when RECEIVED_RESULT event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });
      actor.send({ type: 'RECEIVED_RESULT', result: { data: 'testResult' } });
      
      expect(actor.getSnapshot().value).toBe('succeeded');
      expect(actor.getSnapshot().context.result).toEqual({ data: 'testResult' });
    });

    it('should transition from executing to failed when ERROR event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });
      
      const error = new Error('Test error');
      actor.send({ type: 'ERROR', error });
      
      expect(actor.getSnapshot().value).toBe('failed');
      expect(actor.getSnapshot().context.error).toBe(error);
    });

    it('should transition from executing to cancelled when CANCEL event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });
      actor.send({ type: 'CANCEL' });
      
      expect(actor.getSnapshot().value).toBe('cancelled');
    });

    it('should reset state when RESET event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'RESET' });
      
      expect(actor.getSnapshot().value).toBe('idle');
      expect(actor.getSnapshot().context.toolName).toBeNull();
      expect(actor.getSnapshot().context.parameters).toBeNull();
    });
  });

  describe('Context Management', () => {
    // Shared actor for all tests in this describe block
    let actor: ToolMachineActor;

    beforeEach(() => {
      // Create and start the actor before each test
      actor = createActor(toolMachine).start();
    });

    afterEach(() => {
      // Stop the actor after each test
      actor.stop();
    });

    it('should update context with tool name when SELECT_TOOL event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      
      const context = actor.getSnapshot().context;
      expect(context.toolName).toBe('testTool');
      expect(context.selectedTool).toBe('testTool');
      expect(context.parameters).toBeNull();
      expect(context.result).toBeNull();
      expect(context.error).toBeNull();
    });

    it('should update context with parameters when SET_PARAMETERS event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1', param2: 42 } });
      
      const context = actor.getSnapshot().context;
      expect(context.parameters).toEqual({ param1: 'value1', param2: 42 });
    });

    it('should update context with result when RECEIVED_RESULT event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });
      
      const result = { data: 'testResult', metadata: { executionTime: 100 } };
      actor.send({ type: 'RECEIVED_RESULT', result });
      
      const context = actor.getSnapshot().context;
      expect(context.result).toEqual(result);
    });

    it('should update context with error when ERROR event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });
      
      const error = new Error('Test error');
      actor.send({ type: 'ERROR', error });
      
      const context = actor.getSnapshot().context;
      expect(context.error).toBe(error);
      expect(context.result).toBeNull();
    });

    it('should add to history when a result is received', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'EXECUTE' });
      
      const result = { data: 'testResult' };
      actor.send({ type: 'RECEIVED_RESULT', result });
      
      const context = actor.getSnapshot().context;
      expect(context.history.length).toBe(2);
      expect(context.history[0].tool).toBe('testTool');
      expect(context.history[0].result).toEqual(expect.objectContaining(result));
      expect(context.history[0].timestamp).toBeDefined();
    });

    it('should reset context when RESET event is sent', () => {
      actor.send({ type: 'SELECT_TOOL', toolName: 'testTool' });
      actor.send({ type: 'SET_PARAMETERS', parameters: { param1: 'value1' } });
      actor.send({ type: 'RESET' });
      
      const context = actor.getSnapshot().context;
      expect(context.toolName).toBeNull();
      expect(context.selectedTool).toBeNull();
      expect(context.parameters).toBeNull();
      expect(context.result).toBeNull();
      expect(context.error).toBeNull();
      // History should remain intact after reset
      expect(context.history).toEqual([]);
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