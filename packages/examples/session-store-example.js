/**
 * Session Store Example
 * 
 * This example demonstrates how to use the session store factory to create
 * and use session stores with different backends.
 * 
 * Usage:
 *   node examples/session-store-example.js
 */

import { createSessionStore, createMemorySessionStore, isRedisAvailable } from '../dist/state/services/sessionStoreFactory.js';

// Simple wrapper to print section headers
function section(title) {
  console.log('\n' + '='.repeat(50));
  console.log(' ' + title);
  console.log('='.repeat(50));
}

async function runExample() {
  try {
    section('Checking Redis Availability');
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redisAvailable = await isRedisAvailable(redisUrl);
    
    console.log(`Redis available at ${redisUrl}: ${redisAvailable ? 'YES' : 'NO'}`);
    console.log('Redis is optional - the system will use memory storage if Redis is not available');

    section('Using Memory Session Store');
    const memoryStore = createMemorySessionStore({
      prefix: 'example:memory:',
      defaultTtl: 3600, // 1 hour
    });

    // Store a session
    const memorySessionId = 'memory-session-' + Date.now();
    console.log(`Creating memory session ${memorySessionId}...`);
    
    await memoryStore.setSession(memorySessionId, {
      toolName: 'example-tool',
      parameters: { source: 'memory-example' },
      timestamp: new Date().toISOString(),
    });

    // Retrieve the session
    const memorySession = await memoryStore.getSession(memorySessionId);
    console.log('Memory session data:', memorySession);

    // Clean up
    await memoryStore.clearSession(memorySessionId);
    console.log('Memory session cleared');
    await memoryStore.disconnect();

    section('Using Automatic Backend Detection');
    console.log('Creating session store with automatic backend detection...');
    console.log('This will use Redis if available, otherwise fall back to memory store');
    
    const autoStore = await createSessionStore({
      redisUrl,
      prefix: 'example:auto:',
      verbose: true,
    });

    // Store a session
    const autoSessionId = 'auto-session-' + Date.now();
    console.log(`\nCreating session ${autoSessionId} with auto-detected backend...`);
    
    await autoStore.setSession(autoSessionId, {
      toolName: 'example-tool',
      parameters: { source: 'auto-detected-example' },
      timestamp: new Date().toISOString(),
    });

    // Retrieve the session
    const autoSession = await autoStore.getSession(autoSessionId);
    console.log('Session data:', autoSession);

    // Update the session
    console.log('\nUpdating session...');
    await autoStore.setSession(autoSessionId, {
      ...autoSession,
      result: { status: 'completed' },
      timestamp: new Date().toISOString(),
    });

    // Retrieve updated session
    const updatedSession = await autoStore.getSession(autoSessionId);
    console.log('Updated session data:', updatedSession);

    // List all sessions
    const sessions = await autoStore.getSessions();
    console.log(`\nFound ${sessions.length} sessions with prefix 'example:auto:'`);

    // Clean up
    await autoStore.clearSession(autoSessionId);
    console.log('Session cleared');
    await autoStore.disconnect();

    section('Forcing Memory Store (Even if Redis is Available)');
    const forcedMemoryStore = await createSessionStore({
      redisUrl,
      prefix: 'example:forced-memory:',
      preferMemory: true,
      verbose: true,
    });

    console.log('Session store created. Check the output above to confirm it used memory store.');
    await forcedMemoryStore.disconnect();

    section('Example Complete');
    console.log('This example demonstrated:');
    console.log('1. Checking Redis availability');
    console.log('2. Using an explicit memory session store');
    console.log('3. Using automatic backend detection');
    console.log('4. Forcing memory store even if Redis is available');
    console.log('');
    console.log('For more details, see: docs/session-store.md');

  } catch (error) {
    console.error('Error in session store example:', error);
  }
}

// Run the example
runExample(); 