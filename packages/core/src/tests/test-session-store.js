/**
 * Test script for session store factory
 * 
 * This script tests the session store factory's ability to:
 * 1. Detect Redis availability
 * 2. Fall back to memory store when Redis is unavailable
 * 3. Create sessions and persist data
 * 
 * Usage: node src/tests/test-session-store.js
 */

import { createSessionStore, isRedisAvailable } from '../state/services/sessionStoreFactory.js';

async function testSessionStore() {
  console.log('Session Store Factory Test\n');
  
  // Check if Redis is available
  console.log('Testing Redis availability...');
  const redisAvailable = await isRedisAvailable('redis://localhost:6379');
  console.log(`Redis available: ${redisAvailable ? 'YES' : 'NO'}`);
  
  // Create session store with automatic detection
  console.log('\nCreating session store with automatic detection...');
  const sessionStore = await createSessionStore({
    redisUrl: 'redis://localhost:6379',
    verbose: true
  });
  
  // Test basic session operations
  console.log('\nTesting basic session operations...');
  
  const sessionId = 'test-session-' + Date.now();
  
  // Create session
  console.log(`Creating session ${sessionId}...`);
  const testData = {
    toolName: 'test-tool',
    parameters: { param1: 'value1' },
    state: { count: 1 },
    metadata: { testRun: true, created: Date.now() },
    timestamp: new Date().toISOString()
  };
  
  await sessionStore.setSession(sessionId, testData);
  
  // Retrieve session
  console.log(`Retrieving session ${sessionId}...`);
  const session = await sessionStore.getSession(sessionId);
  console.log('Session data:', session);
  
  // Update session
  console.log(`Updating session ${sessionId}...`);
  if (session) {
    const updatedData = {
      ...session,
      state: { 
        ...session.state,
        count: ((session.state?.count) || 0) + 1
      },
      timestamp: new Date().toISOString()
    };
    await sessionStore.setSession(sessionId, updatedData);
  }
  
  // Retrieve updated session
  console.log(`Retrieving updated session ${sessionId}...`);
  const updatedSession = await sessionStore.getSession(sessionId);
  console.log('Updated session data:', updatedSession);
  
  // List all sessions
  console.log('\nListing all sessions...');
  const sessions = await sessionStore.getSessions();
  console.log(`Found ${sessions.length} sessions:`, sessions);
  
  // Clean up
  console.log(`\nCleaning up session ${sessionId}...`);
  await sessionStore.clearSession(sessionId);
  
  // Verify cleanup
  console.log(`Verifying session ${sessionId} was cleared...`);
  const clearedSession = await sessionStore.getSession(sessionId);
  console.log('Session after clearing:', clearedSession);
  
  // Disconnect
  console.log('\nDisconnecting from session store...');
  await sessionStore.disconnect();
  
  console.log('\nTest completed successfully!');
}

// Run the test
testSessionStore().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
}); 