#!/usr/bin/env node

/**
 * Test script for MemorySessionStore
 * 
 * This script tests the memory session store implementation
 * to verify that it works correctly without Redis.
 */

import { createMemorySessionStore } from "./dist/state/services/sessionStoreFactory.js";

// Create a memory-based session store
const sessionStore = createMemorySessionStore({
  prefix: "test:",
  defaultTtl: 3600
});

// Function to run tests
async function runTests() {
  console.log("Testing MemorySessionStore...");
  
  // Test session creation
  console.log("Creating session...");
  const sessionId = "test-session-1";
  await sessionStore.setSession(sessionId, { 
    data: { 
      hello: "world", 
      timestamp: new Date().toISOString() 
    } 
  });
  console.log(`Session created: ${sessionId}`);
  
  // Test session retrieval
  console.log("Retrieving session...");
  const session = await sessionStore.getSession(sessionId);
  console.log("Session data:", session);
  
  // Test getting all sessions
  console.log("Getting all sessions...");
  const sessions = await sessionStore.getSessions();
  console.log(`Found ${sessions.length} sessions`);
  
  // Test lock acquisition
  console.log("Testing lock functionality...");
  const lockToken = await sessionStore.acquireLock(sessionId, 10);
  console.log(`Acquired lock with token: ${lockToken}`);
  
  // Test lock release
  console.log("Releasing lock...");
  const released = await sessionStore.releaseLock(sessionId, lockToken);
  console.log(`Lock released: ${released}`);
  
  // Test session TTL
  console.log("Testing TTL functionality...");
  const ttl = await sessionStore.getSessionTtl(sessionId);
  console.log(`Session TTL: ${ttl} seconds`);
  
  // Test extending TTL
  console.log("Extending TTL...");
  await sessionStore.extendSessionTtl(sessionId, 7200);
  const newTtl = await sessionStore.getSessionTtl(sessionId);
  console.log(`New session TTL: ${newTtl} seconds`);
  
  // Test session clearing
  console.log("Clearing session...");
  await sessionStore.clearSession(sessionId);
  const clearedSession = await sessionStore.getSession(sessionId);
  console.log("After clearing:", clearedSession);
  
  console.log("Tests completed successfully!");
}

// Run the tests
runTests().catch(error => {
  console.error("Test failed:", error);
  process.exit(1);
}); 