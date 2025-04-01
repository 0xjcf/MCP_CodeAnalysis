/**
 * Redis-backed Tool Execution Service for MCP SDK
 *
 * This service extends the base ToolExecutionService to provide Redis-based
 * state persistence for tool execution. It ensures that tool state is maintained
 * across service restarts and can be shared across multiple instances.
 *
 * @module redisToolExecutionService
 */

import { RedisSessionStore, type RedisSessionStoreOptions } from '../../redisSessionStore.js';
import { ToolExecutionService, type ExecutionResult } from './toolService.js';
import { ToolResponse } from '../../types/responses.js';
import { Tool } from '../../tools/interfaces.js';
import { v4 as uuidv4 } from 'uuid';

interface SessionData {
  state: { value: string };
  context: Record<string, any>;
}

export interface RedisToolExecutionServiceOptions {
  /**
   * Redis connection URL (e.g., redis://localhost:6379)
   */
  redisUrl: string;

  /**
   * Key prefix for Redis keys (default: "mcp:tool:")
   */
  prefix?: string;

  /**
   * Default TTL for tool state in seconds (default: 3600)
   */
  defaultTtl?: number;

  /**
   * Service ID for the tool execution (optional)
   */
  serviceId?: string;

  /**
   * Session ID for the tool execution (optional)
   */
  sessionId?: string;

  /**
   * Map of available tools
   */
  tools: Map<string, Tool<any, any>>;
}

/**
 * Redis-backed implementation of the ToolExecutionService
 */
export class RedisToolExecutionService extends ToolExecutionService {
  private sessionStore: RedisSessionStore;
  private serviceId: string;
  private isInitialized = false;
  private lockToken: string | null = null;

  constructor(options: RedisToolExecutionServiceOptions) {
    super(options.sessionId || uuidv4());
    this.serviceId = options.serviceId || uuidv4();
    const url = new URL(options.redisUrl);
    this.sessionStore = new RedisSessionStore({
      host: url.hostname,
      port: parseInt(url.port),
      keyPrefix: options.prefix || 'mcp:tool:',
      ttl: options.defaultTtl || 3600,
      db: 0,
      password: url.password || undefined,
    });
  }

  /**
   * Initializes the service state from Redis
   */
  public async initializeState(): Promise<void> {
    try {
      const exists = await this.sessionStore.exists(this.serviceId);
      if (!exists) {
        await this.acquireLock();
        try {
          await this.sessionStore.set(this.serviceId, {
            success: true,
            data: {
              state: { value: 'idle' },
              context: { sessionId: this.serviceId },
            },
          });
        } finally {
          await this.releaseLock();
        }
      }

      const session = await this.sessionStore.get(this.serviceId);
      if (session && session.data) {
        const sessionData = session.data as SessionData;
        const context = this.getContext();
        if (context.toolName) {
          await this.selectTool(context.toolName);
          if (context.parameters) {
            await this.setParameters(context.parameters);
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize state:', error);
      throw new Error('Redis operation failed');
    }
  }

  /**
   * Override selectTool to persist state changes
   */
  async selectTool(toolName: string): Promise<void> {
    await this.acquireLock();
    try {
      await super.selectTool(toolName);
      await this.sessionStore.set(this.serviceId, {
        success: true,
        data: {
          state: { value: 'tool_selected' },
          context: this.getContext(),
        },
      });
      await this.sessionStore.extendSessionTtl(this.serviceId);
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Override setParameters to persist state changes
   */
  async setParameters(parameters: Record<string, any>): Promise<void> {
    await this.acquireLock();
    try {
      await super.setParameters(parameters);
      await this.sessionStore.set(this.serviceId, {
        success: true,
        data: {
          state: { value: 'parameters_set' },
          context: this.getContext(),
        },
      });
      await this.sessionStore.extendSessionTtl(this.serviceId);
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Override execute to persist state changes
   */
  async execute<T>(
    executeFunction: (params: Record<string, any>) => Promise<T>,
  ): Promise<ToolResponse<T>> {
    await this.acquireLock();
    try {
      const result = await super.execute(executeFunction);
      await this.sessionStore.set(this.serviceId, {
        success: true,
        data: {
          state: { value: 'executed' },
          context: this.getContext(),
        },
      });
      await this.sessionStore.extendSessionTtl(this.serviceId);
      return result;
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Override reset to persist state changes
   */
  async reset(): Promise<void> {
    await this.acquireLock();
    try {
      await super.reset();
      await this.sessionStore.set(this.serviceId, {
        success: true,
        data: {
          state: { value: 'idle' },
          context: this.getContext(),
        },
      });
      await this.sessionStore.extendSessionTtl(this.serviceId);
    } finally {
      await this.releaseLock();
    }
  }

  /**
   * Acquires a lock for state modification
   */
  private async acquireLock(): Promise<void> {
    this.lockToken = await this.sessionStore.acquireLock(this.serviceId);
    if (!this.lockToken) {
      throw new Error('Failed to acquire lock');
    }
  }

  /**
   * Releases the state modification lock
   */
  private async releaseLock(): Promise<void> {
    if (this.lockToken) {
      await this.sessionStore.releaseLock(this.serviceId, this.lockToken);
      this.lockToken = null;
    }
  }

  /**
   * Closes the Redis connection
   */
  public async close(): Promise<void> {
    try {
      if (this.lockToken) {
        await this.releaseLock();
      }
      await this.sessionStore.close();
    } catch (error) {
      console.error('Error closing Redis tool execution service:', error);
      throw new Error('Failed to close Redis tool execution service');
    }
  }
}
