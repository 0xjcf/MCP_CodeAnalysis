/**
 * Logger utility for MCP Code Analysis
 * @module @mcp/core
 */

import { EventEmitter } from './eventEmitter.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  error?: Error;
  metadata?: Record<string, unknown>;
}

export class Logger extends EventEmitter {
  private context: string;

  constructor(context: string) {
    super();
    this.context = context;
  }

  private log(
    level: LogLevel,
    message: string,
    error?: Error,
    metadata?: Record<string, unknown>,
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: this.context,
      error,
      metadata,
    };

    this.emit('log', entry);
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, undefined, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, undefined, metadata);
  }

  warn(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log('warn', message, error, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log('error', message, error, metadata);
  }

  // Override the on method to provide proper typing for the log event
  on(event: string, handler: (...args: unknown[]) => void): this {
    return super.on(event, handler);
  }
}

// Create a default logger instance
export const defaultLogger = new Logger('default');

// Add a default console handler
defaultLogger.on('log', (...args: unknown[]) => {
  const entry = args[0] as LogEntry;
  const timestamp = entry.timestamp.toISOString();
  const context = entry.context ? `[${entry.context}]` : '';
  const message = `${timestamp} ${context} ${entry.message}`;

  if (entry.error) {
    console.error(message, entry.error);
  } else {
    switch (entry.level) {
      case 'debug':
        console.debug(message);
        break;
      case 'info':
        console.info(message);
        break;
      case 'warn':
        console.warn(message);
        break;
      case 'error':
        console.error(message);
        break;
    }
  }
});
