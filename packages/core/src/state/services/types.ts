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
 * Session data structure for tool state persistence
 *
 * Defines the shape of data that will be stored and retrieved from
 * session storage implementations (memory, Redis, etc.).
 */
export interface SessionData {
  /**
   * Name of the currently selected tool
   */
  toolName?: string | null;

  /**
   * Current parameters for the tool
   */
  parameters?: Record<string, any> | null;

  /**
   * Result of the last tool execution
   */
  result?: any;

  /**
   * Tool execution history
   */
  history?: Array<{
    tool: string;
    result: any;
    timestamp: string;
  }>;

  /**
   * Additional metadata for the session
   */
  metadata?: Record<string, any>;

  /**
   * Timestamp of the last update
   */
  timestamp?: string;

  /**
   * Custom state data specific to the tool implementation
   */
  state?: Record<string, any>;

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
 * Session store interface for MCP SDK
 *
 * Defines the contract for session storage implementations
 * that can be used with the stateful tools framework.
 */
export interface SessionStore {
  /**
   * Get session data by ID
   *
   * @param sessionId Unique session identifier
   * @returns Promise resolving to session data or null if not found
   */
  getSession<T = SessionData>(sessionId: string): Promise<T | null>;

  /**
   * Set session data
   *
   * @param sessionId Unique session identifier
   * @param data Session data to store
   * @param ttl Optional TTL override (in seconds)
   */
  setSession<T = SessionData>(
    sessionId: string,
    data: T,
    ttl?: number
  ): Promise<void>;

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
  createSessionIfNotExists<T = SessionData>(
    sessionId: string,
    initialState: T
  ): Promise<T>;

  /**
   * Disconnects from the storage backend
   */
  disconnect(): Promise<void>;
}

/**
 * Tool execution result interface for MCP SDK
 *
 * Defines the structure of results returned by tool executions.
 * This format aligns with MCP SDK expectations for tool responses,
 * including context for stateful operations and status information.
 */
export interface ExecutionResult<T = any> {
  /**
   * The result data returned by the tool
   */
  data: T;

  /**
   * Execution context information that can be used for
   * tracking state and managing tool sessions
   */
  context?: Record<string, any>;

  /**
   * Status of the execution (success, error, etc.)
   */
  status: "success" | "error" | "cancelled" | "pending";

  /**
   * Error message if the execution failed
   */
  error?: string;

  /**
   * Timestamp when the execution completed
   */
  timestamp: string;
}
