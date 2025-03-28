/**
 * Isolated Test for Tool Execution Service - No Tool Selected Case
 * 
 * This file contains a specific test for the case where a tool execution is attempted
 * without selecting a tool first.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToolExecutionService } from '../state/services/toolService';
import { clearSession, getSessionIds } from '../state/machines/toolMachine';

describe('ToolExecutionService - No Tool Selected', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Clear all sessions
    getSessionIds().forEach(clearSession);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should reject when no tool is selected', async () => {
    const mockExecuteFunction = vi.fn();
    const emptyService = new ToolExecutionService();
    
    // Just check that it rejects with an Error object
    await expect(emptyService.execute(mockExecuteFunction))
      .rejects
      .toThrow();
    
    // Verify the mock was not called
    expect(mockExecuteFunction).not.toHaveBeenCalled();
  });
}); 