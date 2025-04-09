/**
 * Redis-backed Tool Execution Service for MCP SDK
 *
 * This service extends the base ToolExecutionService to provide Redis-based
 * state persistence for tool execution. It ensures that tool state is maintained
 * across service restarts and can be shared across multiple instances.
 *
 * @module redisToolExecutionService
 */

// Import types first
import type {
  IRedisSessionStoreOptions,
  ISessionData,
  ISessionStore,
  IToolResponse,
} from '@mcp/types';


// Then value imports
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

import type { ITool } from '../../tools/interfaces.js';
import { Logger } from '../../utils/logger.js';
import type { IToolExecutionResult } from '../interfaces/toolExecutionService.js';
import type { IToolMachineContext } from '../machines/toolMachine.types.js';

import { RedisSessionStore } from './redisSessionStore.js';
import { ToolExecutionService } from './toolService.js';
import type { ToolParameters } from './types.js';

/**
 * Interface for tool execution service session data
 */
interface IToolExecutionSessionData extends ISessionData {
  id: string;
  createdAt: number;
  lastAccessed: number;
  data: {
    serviceId: string;
    state: string;
    lastUpdated: number;
    lockToken?: string;
    tools?: Map<string, ITool>;
    history?: Array<{
      tool: string;
      result: IToolResponse<unknown>;
      timestamp: string;
    }>;
  };
}

/**
 * Interface for Redis tool execution service options
 */
interface IRedisToolExecutionServiceOptions extends IRedisSessionStoreOptions {
  sessionId?: string;
  serviceId?: string;
  tools?: Map<string, ITool>;
}

/**
 * Interface for service statistics
 */
interface IServiceStats {
  activeSessions: number;
  totalTools: number;
  lastUpdated: number;
}

/**
 * Interface for tool execution metadata
 */
interface IToolExecutionMetadata {
  tool: string;
  version: string;
  executionTime: number;
  timestamp: string;
  error?: string;
}

/**
 * Redis-backed implementation of the tool execution service
 */
export class RedisToolExecutionService extends ToolExecutionService {
  private readonly redis: Redis;
  private readonly sessionStore: RedisSessionStore;
  private readonly serviceId: string;
  private lockToken: string | null = null;

  constructor(options: IRedisToolExecutionServiceOptions) {
    super(options.sessionId);
    this.redis = new Redis(options.redisUrl);
    this.sessionStore = new RedisSessionStore(options);
    this.serviceId = options.serviceId || uuidv4();
    if (options.tools) {
      for (const [id, tool] of options.tools) {
        this.registerTool(id, tool);
      }
    }
  }

  private registerTool(id: string, tool: ITool): void {
    super.getTools().set(id, tool);
  }

  /**
   * Initialize the service
   */
  public async initialize(): Promise<void> {
    const session = await this.sessionStore.getSession(this.serviceId);
    if (!session) {
      const now = Date.now();
      await this.sessionStore.setSession(this.serviceId, {
        id: this.serviceId,
        createdAt: now,
        lastAccessed: now,
        data: {
          serviceId: this.serviceId,
          state: 'idle',
          lastUpdated: now,
          tools: super.getTools(),
          history: [],
        },
      });
    }
  }

  /**
   * Get the current session data
   */
  public async getSessionData(): Promise<IToolExecutionSessionData | null> {
    const session = await this.sessionStore.getSession(this.serviceId);
    return session as IToolExecutionSessionData | null;
  }

  /**
   * Update the session data
   */
  public async updateSessionData(data: Partial<IToolExecutionSessionData['data']>): Promise<void> {
    const currentData = await this.getSessionData();
    if (currentData) {
      await this.sessionStore.setSession(this.serviceId, {
        ...currentData,
        lastAccessed: Date.now(),
        data: {
          ...currentData.data,
          ...data,
          lastUpdated: Date.now(),
        },
      });
    }
  }

  /**
   * Acquire a lock on the session
   */
  public async acquireLock(): Promise<boolean> {
    this.lockToken = await this.sessionStore.acquireLock(this.serviceId);
    if (this.lockToken) {
      await this.updateSessionData({ lockToken: this.lockToken });
      return true;
    }
    return false;
  }

  /**
   * Release the session lock
   */
  public async releaseLock(): Promise<boolean> {
    if (this.lockToken) {
      const result = await this.sessionStore.releaseLock(this.serviceId, this.lockToken);
      if (result) {
        await this.updateSessionData({ lockToken: undefined });
        this.lockToken = null;
        return true;
      }
    }
    return false;
  }

  /**
   * Execute a tool with the given parameters and session ID
   */
  public override async executeTool(
    toolId: string,
    params: Record<string, unknown>,
    sessionId?: string,
    useCached = false,
  ): Promise<IToolExecutionResult> {
    const tool = super.getTools().get(toolId);
    if (!tool) {
      return {
        executionId: uuidv4(),
        toolId,
        sessionId: sessionId || this.serviceId,
        params,
        result: null,
        error: `Tool ${toolId} not found`,
        status: 'error',
        executionTimeMs: 0,
        timestamp: new Date().toISOString(),
        fromCache: false,
      };
    }

    const executionId = uuidv4();
    const startTime = Date.now();

    try {
      // Execute tool
      const result = await tool.execute({ toolId, params });

      const executionResult: IToolExecutionResult = {
        executionId,
        toolId,
        sessionId: sessionId || this.serviceId,
        params,
        result,
        status: 'success',
        executionTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        fromCache: useCached,
      };

      // Update history
      const currentData = await this.getSessionData();
      if (currentData) {
        const history = currentData.data.history || [];
        history.push({
          tool: toolId,
          result: {
            data: result,
            status: { success: true, code: 200 },
            metadata: {
              tool: toolId,
              version: '1.0.0',
              executionTime: executionResult.executionTimeMs,
              timestamp: executionResult.timestamp,
            } as IToolExecutionMetadata,
          },
          timestamp: executionResult.timestamp,
        });
        await this.updateSessionData({ history });
      }

      return executionResult;
    } catch (error) {
      const errorResult: IToolExecutionResult = {
        executionId,
        toolId,
        sessionId: sessionId || this.serviceId,
        params,
        result: null,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
        executionTimeMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        fromCache: useCached,
      };

      // Update history with error
      const currentData = await this.getSessionData();
      if (currentData) {
        const history = currentData.data.history || [];
        history.push({
          tool: toolId,
          result: {
            data: null,
            status: { success: false, code: 500 },
            metadata: {
              tool: toolId,
              version: '1.0.0',
              executionTime: errorResult.executionTimeMs,
              timestamp: errorResult.timestamp,
              error: errorResult.error,
            } as IToolExecutionMetadata,
          },
          timestamp: errorResult.timestamp,
        });
        await this.updateSessionData({ history });
      }

      return errorResult;
    }
  }

  /**
   * Get registered tools
   */
  public override getTools(): Map<string, ITool> {
    return super.getTools();
  }

  /**
   * Invalidate tool cache
   */
  public override async invalidateToolCache(toolId: string, sessionId?: string): Promise<void> {
    // No caching in this implementation yet
    return;
  }

  /**
   * Clear session data
   */
  public override async clearSession(sessionId: string): Promise<void> {
    await this.sessionStore.deleteSession(sessionId);
  }

  /**
   * Disconnect from Redis
   */
  public override async disconnect(): Promise<void> {
    await this.redis.quit();
    await this.sessionStore.disconnect();
  }

  /**
   * Get service statistics
   */
  public override async getStats(): Promise<IServiceStats> {
    const currentData = await this.getSessionData();
    return {
      activeSessions: 1,
      totalTools: super.getTools().size,
      lastUpdated: currentData?.data.lastUpdated || Date.now(),
    };
  }
}
