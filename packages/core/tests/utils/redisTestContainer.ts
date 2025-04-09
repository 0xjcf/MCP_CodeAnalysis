import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Redis } from 'ioredis';

export class RedisTestContainer {
  private container: StartedTestContainer | null = null;
  private redisClient: Redis | null = null;
  private port: number | null = null;

  async start(): Promise<{ port: number; client: Redis }> {
    if (this.container) {
      return { port: this.port!, client: this.redisClient! };
    }

    this.container = await new GenericContainer('redis:7-alpine').withExposedPorts(6379).start();

    this.port = this.container.getMappedPort(6379);
    const host = this.container.getHost();

    this.redisClient = new Redis({
      host,
      port: this.port,
      retryStrategy: times => Math.min(times * 50, 2000),
    });

    // Wait for Redis to be ready
    await this.redisClient.ping();

    return { port: this.port, client: this.redisClient };
  }

  async stop(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
      this.redisClient = null;
    }

    if (this.container) {
      await this.container.stop();
      this.container = null;
    }
  }

  async clear(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.flushall();
    }
  }
}
