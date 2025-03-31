/**
 * Tests for EndOfSessionStore
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EndOfSessionStore, EndOfSessionData } from '../state/services/endOfSessionStore.js';
import { MemorySessionStore } from '../state/services/memorySessionStore.js';

describe('EndOfSessionStore', () => {
  let sessionStore: MemorySessionStore;
  let endOfSessionStore: EndOfSessionStore;

  beforeEach(() => {
    sessionStore = new MemorySessionStore();
    endOfSessionStore = new EndOfSessionStore(sessionStore);
  });

  afterEach(async () => {
    await endOfSessionStore.clearAll();
  });

  const mockEndOfSessionData: EndOfSessionData = {
    session_id: 'test-session-1',
    timestamp: new Date().toISOString(),
    status: 'completed',
    next_session: {
      date: '2024-03-28',
      focus: 'Testing Analyzers',
      goals: ['Test XState analyzer', 'Test Web Components analyzer'],
      priority: 'high',
      context: {
        current_phase: 'Testing',
        focus_area: 'Analyzer Implementation',
        project_status: 'in_progress',
        active_development: {
          component: 'Analyzer Testing',
          status: 'in_progress',
          progress: 0,
          features_to_implement: ['XState analysis', 'Web Components analysis'],
          current_metrics: {
            implementation_status: 'ready_for_testing',
            test_coverage: 'pending',
            documentation: 'needs_update',
          },
        },
      },
    },
    completed_tasks: ['Updated session files', 'Prepared for analyzer testing'],
    next_steps: ['Start MCP server', 'Configure analyzers'],
    notes: ['Session files updated successfully', 'Ready to begin analyzer testing'],
    session_summary: {
      date: '2024-03-28',
      duration: '30 minutes',
      main_activities: ['Updated session files', 'Prepared testing environment'],
      key_decisions: ['Focus on XState and Web Components analyzers'],
      next_steps: ['Start MCP server', 'Configure analyzers'],
    },
    technical_notes: {
      dependencies: {
        added: [],
        removed: [],
        updated: [],
      },
      file_changes: {
        modified: ['templates/end-of-session.json'],
        created: [],
        deleted: [],
      },
    },
    session_metrics: {
      files_modified: 2,
      lines_added: 150,
      lines_removed: 100,
      new_files: 0,
      deleted_files: 0,
      renamed_files: 0,
    },
  };

  it('should save and retrieve end-of-session data', async () => {
    const sessionId = await endOfSessionStore.saveEndOfSession(mockEndOfSessionData);
    const retrieved = await endOfSessionStore.getEndOfSession(sessionId);

    expect(retrieved).toBeTruthy();
    expect(retrieved?.session_id).toBe(mockEndOfSessionData.session_id);
    expect(retrieved?.status).toBe(mockEndOfSessionData.status);
    expect(retrieved?.completed_tasks).toEqual(mockEndOfSessionData.completed_tasks);
  });

  it('should generate a new session ID if not provided', async () => {
    const dataWithoutId = { ...mockEndOfSessionData };
    delete dataWithoutId.session_id;

    const sessionId = await endOfSessionStore.saveEndOfSession(dataWithoutId);
    expect(sessionId).toMatch(/^mcp:end-of-session:/);
  });

  it('should list all end-of-session records', async () => {
    await endOfSessionStore.saveEndOfSession(mockEndOfSessionData);
    const sessions = await endOfSessionStore.listEndOfSessions();

    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toBe(mockEndOfSessionData.session_id);
  });

  it('should delete end-of-session data', async () => {
    const sessionId = await endOfSessionStore.saveEndOfSession(mockEndOfSessionData);
    await endOfSessionStore.deleteEndOfSession(sessionId);

    const retrieved = await endOfSessionStore.getEndOfSession(sessionId);
    expect(retrieved).toBeNull();
  });

  it('should clear all end-of-session data', async () => {
    await endOfSessionStore.saveEndOfSession(mockEndOfSessionData);
    await endOfSessionStore.saveEndOfSession({
      ...mockEndOfSessionData,
      session_id: 'test-session-2',
    });

    await endOfSessionStore.clearAll();
    const sessions = await endOfSessionStore.listEndOfSessions();
    expect(sessions).toHaveLength(0);
  });
});
