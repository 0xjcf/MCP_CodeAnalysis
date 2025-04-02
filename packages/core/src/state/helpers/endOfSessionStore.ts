/**
 * End of Session Store Helper
 *
 * This module exports a singleton instance of the EndOfSessionStore
 * that can be used throughout the application.
 */

import { createSessionStore } from '../services/sessionStoreFactory.js';
import { EndOfSessionStore } from '../services/endOfSessionStore.js';
import { v4 as uuidv4 } from 'uuid';

// Create a singleton instance of the EndOfSessionStore
let storeInstance: EndOfSessionStore | null = null;

export async function getEndOfSessionStore(): Promise<EndOfSessionStore> {
  if (!storeInstance) {
    const sessionStore = await createSessionStore();
    const sessionId = uuidv4();
    storeInstance = new EndOfSessionStore({
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      sessionId,
      prefix: 'mcp:end-of-session:',
    });
  }
  return storeInstance;
}

// Export a promise that resolves to the store instance
export const endOfSessionStore = getEndOfSessionStore();
