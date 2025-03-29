/**
 * Redis-backed Tool Execution Service for MCP SDK
 *
 * This service extends the base ToolExecutionService to provide Redis-based
 * state persistence for tool execution. It ensures that tool state is maintained
 * across service restarts and can be shared across multiple instances.
 *
 * @module redisToolExecutionService
 */

import { Redis } from 'ioredis';
import { ToolExecutionService, type ExecutionResult } from './toolService.js';
import { ToolResponse } from '../../types/responses.js';
import { RedisSessionStore, type RedisSessionStoreOptions } from '../../redisSessionStore.js';
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

  constructor(options: RedisToolExecutionServiceOptions) {
    super(options.sessionId || uuidv4());
    this.serviceId = options.serviceId || uuidv4();
    const url = new URL(options.redisUrl);
    const storeOptions: RedisSessionStoreOptions = {
      host: url.hostname,
      port: parseInt(url.port),
      keyPrefix: options.prefix || 'mcp:tool:',
      ttl: options.defaultTtl || 3600,
      db: 0,
      password: url.password || undefined,
    };
    this.sessionStore = new RedisSessionStore(storeOptions);

    // Initialize state from Redis if it exists
    this.initializeState();
  }

  /**
   * Gets the service ID
   */
  public getServiceId(): string {
    return this.serviceId;
  }

  /**
   * Initializes the service state from Redis
   */
  public async initializeState(): Promise<void> {
    try {
      const exists = await this.sessionStore.exists(this.serviceId);
      if (!exists) {
        await this.sessionStore.set(this.serviceId, {
          success: true,
          data: {
            state: { value: 'idle' },
            context: { sessionId: this.serviceId },
          },
        });
      }

      const session = await this.sessionStore.get(this.serviceId);
      if (session && session.data) {
        const sessionData = session.data as SessionData;
        const context = this.getContext();
        if (context.toolName) {
          this.selectTool(context.toolName);
          if (context.parameters) {
            this.setParameters(context.parameters);
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize state:', error);
    }
  }

  /**
   * Override selectTool to persist state changes
   */
  async selectTool(toolName: string): Promise<void> {
    await super.selectTool(toolName);
    await this.sessionStore.set(this.serviceId, {
      success: true,
      data: {
        state: { value: 'tool_selected' },
        context: this.getContext(),
      },
    });
  }

  /**
   * Override setParameters to persist state changes
   */
  async setParameters(parameters: Record<string, any>): Promise<void> {
    await super.setParameters(parameters);
    await this.sessionStore.set(this.serviceId, {
      success: true,
      data: {
        state: { value: 'parameters_set' },
        context: this.getContext(),
      },
    });
  }

  /**
   * Override execute to persist state changes
   */
  async execute<T>(
    executeFunction: (params: Record<string, any>) => Promise<T>,
  ): Promise<ToolResponse<T>> {
    const result = await super.execute(executeFunction);
    await this.sessionStore.set(this.serviceId, {
      success: true,
      data: {
        state: { value: 'executed' },
        context: this.getContext(),
      },
    });
    return result;
  }

  /**
   * Override cancel to persist state changes
   */
  async cancel(): Promise<void> {
    await super.cancel();
    await this.sessionStore.set(this.serviceId, {
      success: true,
      data: {
        state: { value: 'cancelled' },
        context: this.getContext(),
      },
    });
  }

  /**
   * Override reset to persist state changes
   */
  async reset(): Promise<void> {
    await super.reset();
    await this.sessionStore.set(this.serviceId, {
      success: true,
      data: {
        state: { value: 'idle' },
        context: this.getContext(),
      },
    });
  }

  /**
   * Closes the Redis connection
   */
  public async dispose(): Promise<void> {
    try {
      await this.sessionStore.close();
    } catch (error) {
      console.error('Error disposing Redis tool execution service:', error);
    }
  }

  /**
   * Closes the service
   */
  public async close(): Promise<void> {
    await this.dispose();
  }
}
