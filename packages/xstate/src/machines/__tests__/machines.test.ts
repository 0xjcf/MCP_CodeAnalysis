import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { MCPStateMachine } from '../MCPStateMachine';
import { MCPStateMachineWithHistory } from '../MCPStateMachineWithHistory';

describe('MCPStateMachine', () => {
  it('should start in idle state', () => {
    const actor = createActor(MCPStateMachine).start();
    expect(actor.getSnapshot().value).toBe('idle');
    actor.stop();
  });

  it('should transition to running on START', () => {
    const actor = createActor(MCPStateMachine).start();
    actor.send({ type: 'START' });
    expect(actor.getSnapshot().value).toBe('running');
    actor.stop();
  });

  it('should transition to paused on PAUSE', () => {
    const actor = createActor(MCPStateMachine).start();
    actor.send({ type: 'START' });
    actor.send({ type: 'PAUSE' });
    expect(actor.getSnapshot().value).toBe('paused');
    actor.stop();
  });

  it('should transition back to running on RESUME', () => {
    const actor = createActor(MCPStateMachine).start();
    actor.send({ type: 'START' });
    actor.send({ type: 'PAUSE' });
    actor.send({ type: 'RESUME' });
    expect(actor.getSnapshot().value).toBe('running');
    actor.stop();
  });

  it('should transition to stopped on STOP', () => {
    const actor = createActor(MCPStateMachine).start();
    actor.send({ type: 'START' });
    actor.send({ type: 'STOP' });
    expect(actor.getSnapshot().value).toBe('stopped');
    actor.stop();
  });

  it('should transition to error on ERROR', () => {
    const actor = createActor(MCPStateMachine).start();
    actor.send({ type: 'ERROR', error: 'Test error' });
    expect(actor.getSnapshot().value).toBe('error');
    expect(actor.getSnapshot().context.error).toBe('Test error');
    actor.stop();
  });
});

describe('MCPStateMachineWithHistory', () => {
  it('should start in idle state', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();
    expect(actor.getSnapshot().value).toBe('idle');
    actor.stop();
  });

  it('should transition to running on START', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();
    actor.send({ type: 'START' });
    expect(actor.getSnapshot().value).toBe('running');
    actor.stop();
  });

  it('should transition to paused on PAUSE', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();
    actor.send({ type: 'START' });
    actor.send({ type: 'PAUSE' });
    expect(actor.getSnapshot().value).toBe('paused');
    actor.stop();
  });

  it('should transition back to running on RESUME', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();
    actor.send({ type: 'START' });
    actor.send({ type: 'PAUSE' });
    actor.send({ type: 'RESUME' });
    expect(actor.getSnapshot().value).toBe('running');
    actor.stop();
  });

  it('should transition to stopped on STOP', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();
    actor.send({ type: 'START' });
    actor.send({ type: 'STOP' });
    expect(actor.getSnapshot().value).toBe('stopped');
    actor.stop();
  });

  it('should transition to error on ERROR', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();
    actor.send({ type: 'ERROR', error: 'Test error' });
    expect(actor.getSnapshot().value).toBe('error');
    expect(actor.getSnapshot().context.error).toBe('Test error');
    actor.stop();
  });

  it('should maintain history of previous states', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();

    // Start -> Running
    actor.send({ type: 'START' });
    expect(actor.getSnapshot().value).toBe('running');

    // Running -> Paused
    actor.send({ type: 'PAUSE' });
    expect(actor.getSnapshot().value).toBe('paused');

    // Paused -> Running
    actor.send({ type: 'RESUME' });
    expect(actor.getSnapshot().value).toBe('running');

    // Running -> Stopped
    actor.send({ type: 'STOP' });
    expect(actor.getSnapshot().value).toBe('stopped');

    // Check history
    const history = actor.getSnapshot().context.history;
    expect(history).toHaveLength(4);
    expect(history).toEqual(['idle', 'running', 'paused', 'running']);

    actor.stop();
  });

  it('should handle multiple state transitions correctly', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();

    // Start -> Running
    actor.send({ type: 'START' });
    expect(actor.getSnapshot().value).toBe('running');

    // Running -> Paused
    actor.send({ type: 'PAUSE' });
    expect(actor.getSnapshot().value).toBe('paused');

    // Paused -> Running
    actor.send({ type: 'RESUME' });
    expect(actor.getSnapshot().value).toBe('running');

    // Running -> Paused
    actor.send({ type: 'PAUSE' });
    expect(actor.getSnapshot().value).toBe('paused');

    // Paused -> Stopped
    actor.send({ type: 'STOP' });
    expect(actor.getSnapshot().value).toBe('stopped');

    // Verify history
    const history = actor.getSnapshot().context.history;
    expect(history).toEqual(['idle', 'running', 'paused', 'running', 'paused']);

    actor.stop();
  });

  it('should handle error state correctly', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();

    // Send error event
    actor.send({ type: 'ERROR', error: 'Test error message' });

    // Verify error state
    expect(actor.getSnapshot().value).toBe('error');
    expect(actor.getSnapshot().context.error).toBe('Test error message');

    // Verify history includes error state
    const history = actor.getSnapshot().context.history;
    expect(history).toEqual(['idle', 'error']);

    actor.stop();
  });

  it('should maintain correct history after error', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();

    // Start -> Running
    actor.send({ type: 'START' });
    expect(actor.getSnapshot().value).toBe('running');

    // Running -> Error
    actor.send({ type: 'ERROR', error: 'Test error' });
    expect(actor.getSnapshot().value).toBe('error');

    // Verify history
    const history = actor.getSnapshot().context.history;
    expect(history).toEqual(['idle', 'running', 'error']);

    actor.stop();
  });

  it('should handle rapid state transitions', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();

    // Rapid state transitions
    actor.send({ type: 'START' });
    actor.send({ type: 'PAUSE' });
    actor.send({ type: 'RESUME' });
    actor.send({ type: 'PAUSE' });
    actor.send({ type: 'RESUME' });
    actor.send({ type: 'STOP' });

    // Verify final state
    expect(actor.getSnapshot().value).toBe('stopped');

    // Verify history
    const history = actor.getSnapshot().context.history;
    expect(history).toEqual(['idle', 'running', 'paused', 'running', 'paused', 'running']);

    actor.stop();
  });

  it('should handle invalid transitions gracefully', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();

    // Try to pause from idle state (invalid transition)
    actor.send({ type: 'PAUSE' });
    expect(actor.getSnapshot().value).toBe('idle');

    // Try to resume from idle state (invalid transition)
    actor.send({ type: 'RESUME' });
    expect(actor.getSnapshot().value).toBe('idle');

    // Try to stop from idle state (invalid transition)
    actor.send({ type: 'STOP' });
    expect(actor.getSnapshot().value).toBe('idle');

    // Verify history remains unchanged
    const history = actor.getSnapshot().context.history;
    expect(history).toEqual(['idle']);

    actor.stop();
  });

  it('should handle error events in any state', () => {
    const actor = createActor(MCPStateMachineWithHistory).start();

    // Test error in idle state
    actor.send({ type: 'ERROR', error: 'Idle error' });
    expect(actor.getSnapshot().value).toBe('error');
    expect(actor.getSnapshot().context.error).toBe('Idle error');

    // Reset and test error in running state
    actor.stop();
    const actor2 = createActor(MCPStateMachineWithHistory).start();
    actor2.send({ type: 'START' });
    actor2.send({ type: 'ERROR', error: 'Running error' });
    expect(actor2.getSnapshot().value).toBe('error');
    expect(actor2.getSnapshot().context.error).toBe('Running error');

    // Reset and test error in paused state
    actor2.stop();
    const actor3 = createActor(MCPStateMachineWithHistory).start();
    actor3.send({ type: 'START' });
    actor3.send({ type: 'PAUSE' });
    actor3.send({ type: 'ERROR', error: 'Paused error' });
    expect(actor3.getSnapshot().value).toBe('error');
    expect(actor3.getSnapshot().context.error).toBe('Paused error');

    actor3.stop();
  });
});
