import chalk from 'chalk';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: Record<string, unknown> | undefined;
}

export class Logger {
  private context: string;
  private static logHandlers: ((entry: LogEntry) => void)[] = [];

  constructor(context: string) {
    this.context = context;
  }

  static addHandler(handler: (entry: LogEntry) => void): void {
    this.logHandlers.push(handler);
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      metadata,
    };

    // Call all registered handlers
    Logger.logHandlers.forEach(handler => handler(entry));

    // Default console output
    const formattedMessage = this.formatMessage(entry);
    switch (level) {
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV !== 'production') {
          console.debug(formattedMessage);
        }
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = chalk.gray(`[${entry.timestamp}]`);
    const level = this.getLevelColor(entry.level)(`[${entry.level}]`);
    const context = chalk.cyan(`[${entry.context}]`);
    const message = entry.message;
    const metadata = entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : '';

    return `${timestamp} ${level} ${context} ${message}${metadata}`;
  }

  private getLevelColor(level: LogLevel): (text: string) => string {
    switch (level) {
      case LogLevel.DEBUG:
        return chalk.blue;
      case LogLevel.INFO:
        return chalk.green;
      case LogLevel.WARN:
        return chalk.yellow;
      case LogLevel.ERROR:
        return chalk.red;
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }
}
