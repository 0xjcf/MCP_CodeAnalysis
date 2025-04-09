/**
 * Type Definitions for MCP SDK State Management
 *
 * This module provides shared type definitions for the MCP SDK state management system.
 * It defines the core interfaces and types used by the session store and tool execution
 * services, ensuring consistent typing across the state management infrastructure.
 *
 * These types support the stateful tool functionality of the MCP SDK, providing
 * a foundation for building persistent, distributed, and resilient tool execution.
 *
 * @module stateTypes
 */

/**
 * Base type for tool parameters
 */
export type ToolParameterValue = string | number | boolean | null;

/**
 * Type for tool parameters
 */
export type ToolParameters = Record<string, ToolParameterValue>;

/**
 * Type for tool result
 */
export type ToolResult = {
  data: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Type for tool history entry
 */
export interface IToolHistoryEntry {
  tool: string;
  result: ToolResult;
  timestamp: string;
}

/**
 * Type for session metadata
 */
export type SessionMetadata = Record<string, ToolParameterValue>;

/**
 * Type for tool state
 */
export type ToolState = Record<string, ToolParameterValue>;

/**
 * Type guard for ToolResult
 */
export function isToolResult(value: unknown): value is ToolResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    (!('error' in value) || typeof value.error === 'string') &&
    (!('metadata' in value) || typeof value.metadata === 'object')
  );
}

/**
 * Type guard for IToolHistoryEntry
 */
export function isToolHistoryEntry(value: unknown): value is IToolHistoryEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    'tool' in value &&
    typeof value.tool === 'string' &&
    'result' in value &&
    isToolResult(value.result) &&
    'timestamp' in value &&
    typeof value.timestamp === 'string'
  );
}

/**
 * Session data structure for tool state persistence
 *
 * Defines the shape of data that will be stored and retrieved from
 * session storage implementations (memory, Redis, etc.).
 */
export interface ISessionData {
  /**
   * Name of the currently selected tool
   */
  toolName?: string | null;

  /**
   * Current parameters for the tool
   */
  parameters?: ToolParameters | null;

  /**
   * Result of the last tool execution
   */
  result?: ToolResult;

  /**
   * Tool execution history
   */
  history?: IToolHistoryEntry[];

  /**
   * Additional metadata for the session
   */
  metadata?: SessionMetadata;

  /**
   * Timestamp of the last update
   */
  timestamp?: string;

  /**
   * Custom state data specific to the tool implementation
   */
  state?: ToolState;

  /**
   * Information about the last operation performed
   */
  lastOperation?: {
    operationId: string;
    toolName: string;
    timestamp: string;
  };
}

/**
 * Type guard for ISessionData
 */
export function isSessionData(value: unknown): value is ISessionData {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const data = value as ISessionData;
  return (
    (!('toolName' in data) || data.toolName === null || typeof data.toolName === 'string') &&
    (!('parameters' in data) || data.parameters === null || typeof data.parameters === 'object') &&
    (!('result' in data) || isToolResult(data.result)) &&
    (!('history' in data) ||
      (Array.isArray(data.history) && data.history.every(isToolHistoryEntry))) &&
    (!('metadata' in data) || typeof data.metadata === 'object') &&
    (!('timestamp' in data) || typeof data.timestamp === 'string') &&
    (!('state' in data) || typeof data.state === 'object') &&
    (!('lastOperation' in data) ||
      (typeof data.lastOperation === 'object' &&
        data.lastOperation !== null &&
        typeof data.lastOperation.operationId === 'string' &&
        typeof data.lastOperation.toolName === 'string' &&
        typeof data.lastOperation.timestamp === 'string'))
  );
}

/**
 * Session store interface for MCP SDK
 *
 * Defines the contract for session storage implementations
 * that can be used with the stateful tools framework.
 */
export interface ISessionStore<T extends ISessionData = ISessionData> {
  /**
   * Get session data by ID
   *
   * @param sessionId Unique session identifier
   * @returns Promise resolving to session data or null if not found
   */
  getSession(sessionId: string): Promise<T | null>;

  /**
   * Set session data
   *
   * @param sessionId Unique session identifier
   * @param data Session data to store
   * @param ttl Optional TTL override (in seconds)
   */
  setSession(sessionId: string, data: T, ttl?: number): Promise<void>;

  /**
   * Clear a session by ID
   *
   * @param sessionId Unique session identifier
   */
  clearSession(sessionId: string): Promise<void>;

  /**
   * List all active session IDs
   *
   * @returns Promise resolving to array of session IDs
   */
  getSessions(): Promise<string[]>;

  /**
   * Acquire a lock on a session
   *
   * @param sessionId Unique session identifier
   * @param timeout Lock timeout in milliseconds
   * @returns Promise resolving to a lock token if successful, null otherwise
   */
  acquireLock(sessionId: string, timeout?: number): Promise<string | null>;

  /**
   * Release a lock on a session
   *
   * @param sessionId Unique session identifier
   * @param token Lock token from acquireLock
   * @returns Promise resolving to true if successful, false if token didn't match
   */
  releaseLock(sessionId: string, token: string): Promise<boolean>;

  /**
   * Extends the TTL of a session
   *
   * @param sessionId ID of the session
   * @param ttl New TTL in seconds
   * @returns True if successful, false if session doesn't exist
   */
  extendSessionTtl(sessionId: string, ttl: number): Promise<boolean>;

  /**
   * Gets the remaining TTL for a session
   *
   * @param sessionId ID of the session
   * @returns Remaining TTL in seconds, or null if session doesn't exist
   */
  getSessionTtl(sessionId: string): Promise<number | null>;

  /**
   * Creates a session if it doesn't exist already
   *
   * @param sessionId ID of the session
   * @param initialState Initial state if session is created
   * @returns Existing session or newly created one
   */
  createSessionIfNotExists(sessionId: string, initialState: T): Promise<T>;

  /**
   * Disconnects from the storage backend
   */
  disconnect(): Promise<void>;
}

/**
 * Execution status types
 */
export type ExecutionStatus =
  | 'success'
  | 'error'
  | 'cancelled'
  | 'pending'
  | 'timeout'
  | 'invalid_input'
  | 'rate_limited';

/**
 * Interface for tool execution results
 */
export interface IExecutionResult<T = ToolResult> {
  /**
   * The result data returned by the tool
   */
  data: T;

  /**
   * Execution context information that can be used for
   * tracking state and managing tool sessions
   */
  context?: Record<string, ToolParameterValue>;

  /**
   * Status of the execution
   */
  status: ExecutionStatus;

  /**
   * Error message if the execution failed
   */
  error?: string;

  /**
   * Timestamp when the execution completed
   */
  timestamp: string;
}

/**
 * Type guard for IExecutionResult
 */
export function isExecutionResult<T = ToolResult>(value: unknown): value is IExecutionResult<T> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const result = value as IExecutionResult<T>;
  return (
    'data' in result &&
    'status' in result &&
    typeof result.status === 'string' &&
    [
      'success',
      'error',
      'cancelled',
      'pending',
      'timeout',
      'invalid_input',
      'rate_limited',
    ].includes(result.status) &&
    (!('error' in result) || typeof result.error === 'string') &&
    'timestamp' in result &&
    typeof result.timestamp === 'string'
  );
}
