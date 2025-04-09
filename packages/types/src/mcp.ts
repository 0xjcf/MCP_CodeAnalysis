import type { ZodType } from 'zod';

export interface RequestHandlerExtra {
  requestId: string;
  timestamp: number;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    correlationId?: string;
    [key: string]: unknown;
  };
  severity?: 'info' | 'warning' | 'error';
  context?: {
    userId?: string;
    sessionId?: string;
    [key: string]: unknown;
  };
}

export interface McpServer {
  tool(
    id: string,
    schema: Record<string, ZodType>,
    handler: (args: Record<string, unknown>, extra: RequestHandlerExtra) => Promise<unknown>,
  ): McpServer;
  connect(transport: unknown): Promise<void>;
  emit(event: string, ...args: unknown[]): boolean;
  on(event: string, listener: (...args: unknown[]) => void): McpServer;
  off(event: string, listener: (...args: unknown[]) => void): McpServer;
}

export interface RateLimit {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

export interface IToolDefinition {
  id: string;
  schema: Record<string, ZodType>;
  handler: (args: Record<string, unknown>, extra: RequestHandlerExtra) => Promise<unknown>;
  source: string;
  description?: string;
  category?: string;
  timeout?: number;
  rateLimit?: RateLimit;
  version?: string;
  tags?: string[];
  dependencies?: string[];
}

export interface CallToolResult {
  success: boolean;
  content?: unknown;
  result?: unknown;
  error?: {
    message: string;
    code: string;
    details?: unknown;
    stack?: string;
    timestamp: number;
    requestId?: string;
  };
  metadata?: {
    executionTime: number;
    toolId: string;
    timestamp: number;
    [key: string]: unknown;
  };
}
