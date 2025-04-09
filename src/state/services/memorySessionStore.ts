export interface IMemorySessionStoreOptions {
  ttl?: number;
  lockTtl?: number;
}

interface IMemorySession {
  data: any;
  expiresAt?: number;
  lockExpiresAt?: number;
  timeoutRef?: NodeJS.Timeout;
  lockTimeoutRef?: NodeJS.Timeout;
}
