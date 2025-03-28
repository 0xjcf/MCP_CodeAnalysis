import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import Redis from "ioredis";
import { RedisSessionStore } from "../state/store/redisSessionStore";

// Create a comprehensive mock Redis client
const mockRedisClient = {
  on: vi.fn((event, callback) => {
    if (event === "error") {
      // Store the error callback for testing
      mockRedisClient._errorCallback = callback;
    }
    return mockRedisClient;
  }),
  disconnect: vi.fn().mockResolvedValue(undefined),
  set: vi.fn().mockResolvedValue("OK"),
  get: vi.fn().mockImplementation((key) => {
    if (key === "session:exists") {
      return Promise.resolve(
        JSON.stringify({ id: "exists", data: { key: "value" } })
      );
    }
    if (key === "session:invalid-json") {
      return Promise.resolve("not-valid-json");
    }
    return Promise.resolve(null);
  }),
  del: vi.fn().mockResolvedValue(1),
  keys: vi.fn().mockResolvedValue(["session:1", "session:2"]),
  expire: vi.fn().mockImplementation((key) => {
    if (key === "session:exists") {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  ttl: vi.fn().mockImplementation((key) => {
    if (key === "session:exists") {
      return Promise.resolve(300);
    }
    return Promise.resolve(-2);
  }),
  exists: vi.fn().mockImplementation((key) => {
    if (key === "session:exists" || key === "lock:exists") {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  eval: vi.fn().mockImplementation((script, keys, args) => {
    if (args[1] === "valid-token") {
      return Promise.resolve(1);
    }
    return Promise.resolve(0);
  }),
  // Store error callback for testing
  _errorCallback: null as ((error: Error) => void) | null,
  // Method to simulate Redis error
  _simulateError: function (error: Error) {
    if (this._errorCallback) {
      this._errorCallback(error);
    }
  },
};

// Mock the ioredis module
vi.mock("ioredis", () => {
  return {
    default: vi.fn().mockImplementation(() => mockRedisClient),
  };
});

describe("RedisSessionStore", () => {
  let store: RedisSessionStore;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    store = new RedisSessionStore({
      redisUrl: "redis://localhost:6379",
      prefix: "mcp:",
      defaultTtl: 3600,
      lockTimeout: 30000,
    });
  });

  afterEach(async () => {
    // Clean up after each test
    await store.disconnect();
  });

  describe("Session Management", () => {
    test("getSession should retrieve a session from Redis", async () => {
      // Setup
      const sessionId = "test-session-1";
      const sessionData = { foo: "bar", count: 42 };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(sessionData));

      // Execute
      const result = await store.getSession(sessionId);

      // Verify
      expect(mockRedisClient.get).toHaveBeenCalledWith(
        "mcp:session:test-session-1"
      );
      expect(result).toEqual(sessionData);
    });

    test("getSession should return null for non-existent session", async () => {
      // Setup
      mockRedisClient.get.mockResolvedValue(null);

      // Execute
      const result = await store.getSession("nonexistent");

      // Verify
      expect(result).toBeNull();
    });

    test("setSession should store session data in Redis", async () => {
      // Setup
      const sessionId = "test-session-2";
      const sessionData = { name: "Test Session", items: [1, 2, 3] };
      mockRedisClient.set.mockResolvedValue("OK");

      // Execute
      await store.setSession(sessionId, sessionData);

      // Verify
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "mcp:session:test-session-2",
        JSON.stringify(sessionData),
        "EX",
        3600
      );
    });

    test("setSession should use custom TTL when provided", async () => {
      // Setup
      const sessionId = "test-session-3";
      const sessionData = { value: "custom-ttl-test" };
      const customTtl = 600; // 10 minutes
      mockRedisClient.set.mockResolvedValue("OK");

      // Execute
      await store.setSession(sessionId, sessionData, customTtl);

      // Verify
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "mcp:session:test-session-3",
        JSON.stringify(sessionData),
        "EX",
        600
      );
    });

    test("clearSession should remove a session from Redis", async () => {
      // Setup
      const sessionId = "test-session-4";
      mockRedisClient.del.mockResolvedValue(1);

      // Execute
      await store.clearSession(sessionId);

      // Verify
      expect(mockRedisClient.del).toHaveBeenCalledWith(
        "mcp:session:test-session-4"
      );
    });

    test("getSessions should return all session IDs", async () => {
      // Setup
      const sessionKeys = [
        "mcp:session:session-1",
        "mcp:session:session-2",
        "mcp:session:session-3",
      ];
      mockRedisClient.keys.mockResolvedValue(sessionKeys);

      // Execute
      const sessions = await store.getSessions();

      // Verify
      expect(mockRedisClient.keys).toHaveBeenCalledWith("mcp:session:*");
      expect(sessions).toEqual(["session-1", "session-2", "session-3"]);
    });
  });

  describe("TTL Management", () => {
    test("extendSessionTtl should update the expiration time", async () => {
      // Setup
      const sessionId = "test-session-5";
      const newTtl = 7200; // 2 hours
      mockRedisClient.expire.mockResolvedValue(1); // 1 means key exists and TTL was set

      // Execute
      const result = await store.extendSessionTtl(sessionId, newTtl);

      // Verify
      expect(mockRedisClient.expire).toHaveBeenCalledWith(
        "mcp:session:test-session-5",
        7200
      );
      expect(result).toBe(true);
    });

    test("extendSessionTtl should return false if session does not exist", async () => {
      // Setup
      mockRedisClient.expire.mockResolvedValue(0); // 0 means key doesn't exist

      // Execute
      const result = await store.extendSessionTtl("nonexistent", 3600);

      // Verify
      expect(result).toBe(false);
    });

    test("getSessionTtl should return remaining TTL for a session", async () => {
      // Setup
      const sessionId = "test-session-6";
      mockRedisClient.ttl.mockResolvedValue(1800); // 30 minutes remaining

      // Execute
      const ttl = await store.getSessionTtl(sessionId);

      // Verify
      expect(mockRedisClient.ttl).toHaveBeenCalledWith(
        "mcp:session:test-session-6"
      );
      expect(ttl).toBe(1800);
    });

    test("getSessionTtl should return null for non-existent session", async () => {
      // Setup
      mockRedisClient.ttl.mockResolvedValue(-2); // -2 means key doesn't exist

      // Execute
      const ttl = await store.getSessionTtl("nonexistent");

      // Verify
      expect(ttl).toBeNull();
    });
  });

  describe("Session Locking", () => {
    test("acquireLock should obtain a lock when available", async () => {
      // Setup
      const sessionId = "test-session-7";
      mockRedisClient.set.mockResolvedValue("OK"); // 'OK' means lock acquired

      // Execute
      const lockToken = await store.acquireLock(sessionId);

      // Verify
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        "mcp:lock:test-session-7",
        expect.any(String), // lock token
        "PX",
        30000,
        "NX"
      );
      expect(lockToken).toBeTruthy();
    });

    test("acquireLock should return null when lock is unavailable", async () => {
      // Setup
      mockRedisClient.set.mockResolvedValue(null); // null means lock not acquired

      // Execute
      const lockToken = await store.acquireLock("locked-session");

      // Verify
      expect(lockToken).toBeNull();
    });

    test("releaseLock should release a lock with valid token", async () => {
      // Setup
      const sessionId = "test-session-8";
      const lockToken = "valid-token-1234";

      // Mock eval to simulate successful release
      mockRedisClient.eval.mockResolvedValue(1); // 1 means successful release

      // Execute
      const released = await store.releaseLock(sessionId, lockToken);

      // Verify
      expect(mockRedisClient.eval).toHaveBeenCalledWith(
        expect.any(String), // Lua script
        1, // Number of keys
        "mcp:lock:test-session-8", // Key
        lockToken // Token
      );
      expect(released).toBe(true);
    });

    test("releaseLock should fail with invalid token", async () => {
      // Setup
      const sessionId = "test-session-9";
      const invalidToken = "invalid-token";

      // Mock eval to simulate failed release
      mockRedisClient.eval.mockResolvedValue(0); // 0 means failed release

      // Execute
      const released = await store.releaseLock(sessionId, invalidToken);

      // Verify
      expect(mockRedisClient.eval).toHaveBeenCalled();
      expect(released).toBe(false);
    });
  });

  describe("Error Handling", () => {
    test("getSession should handle Redis errors", async () => {
      // Setup
      mockRedisClient.get.mockRejectedValue(
        new Error("Redis connection error")
      );

      // Execute & Verify
      await expect(store.getSession("error-test-session")).rejects.toThrow(
        "Redis operation failed"
      );
    });

    test("getSession should handle invalid JSON format", async () => {
      // Setup - Return invalid JSON
      mockRedisClient.get.mockResolvedValue("{invalid-json}");

      // Execute & Verify
      await expect(store.getSession("corrupted-session")).rejects.toThrow(
        "Failed to parse session data"
      );
    });
  });

  describe("Session Creation", () => {
    test("createSessionIfNotExists should create a new session if it does not exist", async () => {
      // Setup
      const sessionId = "new-session";
      const initialState = { created: Date.now(), data: "initial" };

      // Mock the getSession to return null (session doesn't exist)
      mockRedisClient.get.mockResolvedValue(null);
      mockRedisClient.set.mockResolvedValue("OK");

      // Execute
      const result = await store.createSessionIfNotExists(
        sessionId,
        initialState
      );

      // Verify
      expect(mockRedisClient.get).toHaveBeenCalled();
      expect(mockRedisClient.set).toHaveBeenCalled();
      expect(result).toEqual(initialState);
    });

    test("createSessionIfNotExists should retrieve existing session without creating new one", async () => {
      // Setup
      const sessionId = "existing-session";
      const existingState = { created: 123456789, data: "existing" };
      const initialState = { created: Date.now(), data: "initial" };

      // Mock the getSession to return an existing session
      mockRedisClient.get.mockResolvedValue(JSON.stringify(existingState));

      // Execute
      const result = await store.createSessionIfNotExists(
        sessionId,
        initialState
      );

      // Verify
      expect(mockRedisClient.get).toHaveBeenCalled();
      expect(mockRedisClient.set).not.toHaveBeenCalled();
      expect(result).toEqual(existingState);
    });
  });
});
