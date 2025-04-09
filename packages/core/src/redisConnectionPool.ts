/**
 * Redis connection pool implementation for MCP Code Analysis
 * @module @mcp/core
 */

import { EventEmitter } from 'events';

import { Redis, type Cluster } from 'ioredis';

export interface IRedisConnectionPoolOptions {
  redisUrl: string;
  maxConnections?: number;
  minConnections?: number;
  healthCheckInterval?: number;
  connectionTimeout?: number;
  retryStrategy?: (times: number) => number;
}

export interface IRedisConnection {
  client: Redis | Cluster;
  lastUsed: number;
  isHealthy: boolean;
}

export class RedisConnectionPool extends EventEmitter {
  private pool: IRedisConnection[] = [];
  private options: Required<IRedisConnectionPoolOptions>;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private initializationError: Error | null = null;

  constructor(options: IRedisConnectionPoolOptions) {
    super();
    this.options = {
      redisUrl: options.redisUrl,
      maxConnections: options.maxConnections ?? 10,
      minConnections: options.minConnections ?? 2,
      healthCheckInterval: options.healthCheckInterval ?? 30000,
      connectionTimeout: options.connectionTimeout ?? 5000,
      retryStrategy: options.retryStrategy ?? ((times: number) => Math.min(times * 50, 2000)),
    };

    this.initializePool().catch((error: Error) => {
      this.initializationError = error;
      this.emit('error', error);
    });
    this.startHealthChecks();
  }

  private async initializePool(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      for (let i = 0; i < this.options.minConnections; i++) {
        await this.createConnection();
      }
      this.isInitialized = true;
    } catch (error) {
      this.initializationError =
        error instanceof Error ? error : new Error('Failed to initialize connection pool');
      throw this.initializationError;
    }
  }

  private async createConnection(): Promise<IRedisConnection> {
    const client = new Redis(this.options.redisUrl, {
      retryStrategy: this.options.retryStrategy,
      connectTimeout: this.options.connectionTimeout,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });

    const connection: IRedisConnection = {
      client,
      lastUsed: Date.now(),
      isHealthy: true,
    };

    client.on('error', (error: Error) => {
      connection.isHealthy = false;
      this.emit('error', error);
    });

    client.on('connect', () => {
      connection.isHealthy = true;
      this.emit('connect', connection);
    });

    client.on('close', () => {
      connection.isHealthy = false;
      this.emit('close', connection);
    });

    try {
      await client.ping();
      this.pool.push(connection);
      return connection;
    } catch (error) {
      await client.quit();
      throw error instanceof Error ? error : new Error('Failed to create Redis connection');
    }
  }

  private startHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(() => {
      this.checkConnections().catch(error => {
        this.emit('error', error);
      });
    }, this.options.healthCheckInterval);
  }

  private async checkConnections(): Promise<void> {
    for (const connection of this.pool) {
      try {
        await connection.client.ping();
        connection.isHealthy = true;
      } catch (error) {
        connection.isHealthy = false;
        this.emit('healthCheckFailed', connection, error);
      }
    }
  }

  async getConnection(): Promise<IRedisConnection> {
    if (this.initializationError) {
      throw this.initializationError;
    }

    if (!this.isInitialized) {
      await this.initializePool();
    }

    const healthyConnection = this.pool.find(conn => conn.isHealthy);

    if (healthyConnection) {
      healthyConnection.lastUsed = Date.now();
      return healthyConnection;
    }

    if (this.pool.length < this.options.maxConnections) {
      return this.createConnection();
    }

    throw new Error('No healthy connections available in the pool');
  }

  async releaseConnection(connection: IRedisConnection): Promise<void> {
    if (!this.pool.includes(connection)) {
      throw new Error('Connection not found in pool');
    }
    connection.lastUsed = Date.now();
    await Promise.resolve();
  }

  async close(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    await Promise.all(
      this.pool.map(async connection => {
        try {
          await connection.client.quit();
        } catch (error: unknown) {
          this.emit(
            'error',
            error instanceof Error ? error : new Error('Failed to close connection'),
          );
        }
      }),
    );

    this.pool = [];
    this.isInitialized = false;
  }

  getPoolSize(): number {
    return this.pool.length;
  }

  getHealthyConnections(): number {
    return this.pool.filter(conn => conn.isHealthy).length;
  }

  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}
