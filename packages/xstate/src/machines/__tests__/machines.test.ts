import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { MCPStateMachine } from '../MCPStateMachine.js';
import { MCPStateMachineWithHistory } from '../MCPStateMachineWithHistory.js';

describe('MCPStateMachine', () => {
  it('should start in idle state', () => {
    const actor = createActor(MCPStateMachine, {
      input: {},
    }).start();

    expect(actor.getSnapshot().value).toBe('idle');
  });

  it('should transition to running state on START', () => {
    const actor = createActor(MCPStateMachine, {
      input: {},
    }).start();

    actor.send({ type: 'START' });
    expect(actor.getSnapshot().value).toBe('running');
  });

  it('should transition back to idle state on STOP', () => {
    const actor = createActor(MCPStateMachine, {
      input: {},
    }).start();

    actor.send({ type: 'START' });
    actor.send({ type: 'STOP' });
    expect(actor.getSnapshot().value).toBe('stopped');
  });

  it('should handle error state', () => {
    const actor = createActor(MCPStateMachine, {
      input: {},
    }).start();

    actor.send({ type: 'ERROR', error: 'Test error' });
    expect(actor.getSnapshot().value).toBe('error');
    expect(actor.getSnapshot().context.error).toBe('Test error');
  });

  it('should recover from error state', () => {
    const actor = createActor(MCPStateMachine, {
      input: {},
    }).start();

    actor.send({ type: 'ERROR', error: 'Test error' });
    actor.send({ type: 'START' });
    expect(actor.getSnapshot().value).toBe('running');
  });

  it('should handle pause and resume', () => {
    const actor = createActor(MCPStateMachine, {
      input: {},
    }).start();

    actor.send({ type: 'START' });
    actor.send({ type: 'PAUSE' });
    expect(actor.getSnapshot().value).toBe('paused');
    actor.send({ type: 'RESUME' });
    expect(actor.getSnapshot().value).toBe('running');
  });
});

describe('MCPStateMachineWithHistory', () => {
  it('should start in idle state', () => {
    const actor = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    expect(actor.getSnapshot().value).toBe('idle');
  });

  it('should transition to running state on START', () => {
    const actor = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    actor.send({ type: 'START' });
    expect(actor.getSnapshot().value).toBe('running');
  });

  it('should transition back to idle state on STOP', () => {
    const actor = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    actor.send({ type: 'START' });
    actor.send({ type: 'STOP' });
    expect(actor.getSnapshot().value).toBe('stopped');
  });

  it('should handle error state', () => {
    const actor = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    actor.send({ type: 'ERROR', error: 'Test error' });
    expect(actor.getSnapshot().value).toBe('error');
    expect(actor.getSnapshot().context.error).toBe('Test error');
  });

  it('should recover from error state', () => {
    const actor = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    actor.send({ type: 'ERROR', error: 'Test error' });
    actor.send({ type: 'START' });
    expect(actor.getSnapshot().value).toBe('running');
  });

  it('should handle pause and resume', () => {
    const actor = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    actor.send({ type: 'START' });
    actor.send({ type: 'PAUSE' });
    expect(actor.getSnapshot().value).toBe('paused');
    actor.send({ type: 'RESUME' });
    expect(actor.getSnapshot().value).toBe('running');
  });

  it('should maintain history of states', () => {
    const actor = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    actor.send({ type: 'START' });
    actor.send({ type: 'PAUSE' });
    actor.send({ type: 'ERROR', error: 'Test error' });
    actor.send({ type: 'START' });

    const history = actor.getSnapshot().context.history;
    expect(history).toEqual(['idle', 'running', 'paused', 'error', 'idle']);
  });

  it('should handle multiple state transitions', () => {
    const actor = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    actor.send({ type: 'START' });
    actor.send({ type: 'PAUSE' });
    actor.send({ type: 'RESUME' });
    actor.send({ type: 'STOP' });

    const history = actor.getSnapshot().context.history;
    expect(history).toEqual(['idle', 'running', 'paused', 'running', 'stopped']);
  });

  it('should handle error recovery', () => {
    const actor = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    actor.send({ type: 'START' });
    actor.send({ type: 'ERROR', error: 'Test error' });
    actor.send({ type: 'START' });
    actor.send({ type: 'START' });

    const history = actor.getSnapshot().context.history;
    expect(history).toEqual(['idle', 'running', 'error', 'idle', 'running']);
  });

  it('should handle multiple actors', () => {
    const actor1 = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    const actor2 = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    const actor3 = createActor(MCPStateMachineWithHistory, {
      input: {},
    }).start();

    actor1.send({ type: 'START' });
    actor2.send({ type: 'START' });
    actor3.send({ type: 'START' });

    expect(actor1.getSnapshot().value).toBe('running');
    expect(actor2.getSnapshot().value).toBe('running');
    expect(actor3.getSnapshot().value).toBe('running');
  });
});
