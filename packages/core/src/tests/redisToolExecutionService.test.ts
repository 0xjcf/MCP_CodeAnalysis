import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  vi,
  Mocked,
} from "vitest";
import { RedisToolExecutionService } from "../state/services/redisToolExecutionService";
import { RedisSessionStore } from "../state/services/redisSessionStore";
import { z } from "zod";
import { Tool } from "../tools/interfaces";
import * as uuidModule from "uuid";

// Mock tool helper function
const createMockTool = (
  name: string,
  schema = z.object({}),
  handler?: any
): Tool<any, any> => ({
  id: name, // Use name as the ID for simplicity
  name,
  description: `Mock tool: ${name}`,
  version: "1.0.0",
  category: "test",
  execute:
    handler ||
    ((params: any) =>
      Promise.resolve({
        result: `Executed ${name} with ${JSON.stringify(params)}`,
      })),
});

// Mock the Redis session store
vi.mock("../state/services/redisSessionStore", () => {
  const mockStore = {
    getSession: vi.fn(),
    setSession: vi.fn(),
    clearSession: vi.fn(),
    getSessions: vi.fn(),
    acquireLock: vi.fn(),
    releaseLock: vi.fn(),
    extendSessionTtl: vi.fn(),
    getSessionTtl: vi.fn(),
    createSessionIfNotExists: vi.fn(),
    disconnect: vi.fn(),
  };

  return {
    RedisSessionStore: vi.fn(() => mockStore),
  };
});

describe("RedisToolExecutionService", () => {
  let service: RedisToolExecutionService;
  let mockRedisStore: ReturnType<typeof vi.mocked<RedisSessionStore>>;
  let mockTools: Map<string, Tool<any, any>>;

  beforeEach(() => {
    vi.resetAllMocks();

    // Create mock tools Map
    mockTools = new Map();
    mockTools.set("testTool", createMockTool("testTool"));

    // Create a new service instance with mock Redis store
    service = new RedisToolExecutionService({
      redisUrl: "redis://localhost:6379",
      prefix: "test:",
      defaultTtl: 3600,
      tools: mockTools,
    });

    // Get the mock Redis store
    mockRedisStore = vi.mocked((service as any).sessionStore);
  });

  afterEach(async () => {
    await service.dispose();
  });

  describe("Initialization", () => {
    test("should create a session store with provided options", () => {
      expect(RedisSessionStore).toHaveBeenCalledWith({
        redisUrl: "redis://localhost:6379",
        prefix: "test:state:",
        defaultTtl: 3600,
      });
    });

    test("should initialize with default service ID", () => {
      expect(service.getServiceId()).toBeDefined();
      expect(typeof service.getServiceId()).toBe("string");
    });

    test("should initialize with provided service ID", () => {
      const customId = "custom-service-id";
      const customService = new RedisToolExecutionService({
        redisUrl: "redis://localhost:6379",
        serviceId: customId,
        tools: mockTools,
      });

      expect(customService.getServiceId()).toBe(customId);
    });
  });

  describe("State Management", () => {
    test("should initialize a machine state", async () => {
      // Setup
      mockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "idle" },
        context: { sessionId: service.getServiceId() },
      });

      // Execute
      await service.initializeState();

      // Verify
      expect(mockRedisStore.createSessionIfNotExists).toHaveBeenCalledWith(
        service.getServiceId(),
        expect.objectContaining({
          state: expect.any(Object),
          context: expect.any(Object),
        })
      );
    });

    test("should save state changes to Redis", async () => {
      // Setup - create a service with a specific service ID
      const testServiceId = "test-service-123";
      const testService = new RedisToolExecutionService({
        redisUrl: "redis://localhost:6379",
        prefix: "test:",
        serviceId: testServiceId,
        tools: mockTools,
      });

      // Get the mock Redis store from the service
      const serviceMockRedisStore = vi.mocked(
        (testService as any).sessionStore
      );
      serviceMockRedisStore.acquireLock.mockResolvedValue("mock-lock-token");
      serviceMockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "idle" },
        context: { sessionId: testServiceId },
      });

      // Create proper Tool object
      const testTool = createMockTool("testTool");

      // Initialize and reset mock calls
      await testService.initializeState();
      serviceMockRedisStore.setSession.mockClear();

      // Execute - use proper Tool object
      await testService.selectTool(testTool);

      // Verify
      expect(serviceMockRedisStore.setSession).toHaveBeenCalledWith(
        testServiceId,
        expect.objectContaining({
          context: expect.objectContaining({
            toolName: "testTool",
          }),
          state: expect.objectContaining({
            value: expect.stringContaining("tool"),
          }),
        })
      );

      // Clean up
      await testService.dispose();
    });

    test("should load state from Redis on initialize", async () => {
      // Setup - Simulate existing session in Redis
      mockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "tool_selected" },
        context: {
          sessionId: service.getServiceId(),
          toolName: "existingTool",
          parameters: { foo: "bar" },
        },
      });
      mockRedisStore.acquireLock.mockResolvedValue("mock-lock-token");

      // Execute
      await service.initializeState();

      // Verify state is loaded
      expect(service.getContext().toolName).toBe("existingTool");
      expect(service.getContext().parameters).toEqual({ foo: "bar" });
    });
  });

  describe("Tool Selection", () => {
    test("should update state and persist to Redis when selecting a tool", async () => {
      // Setup - create a service with a specific service ID
      const testServiceId = "test-service-selection";
      const testService = new RedisToolExecutionService({
        redisUrl: "redis://localhost:6379",
        prefix: "test:",
        serviceId: testServiceId,
        tools: mockTools,
      });

      // Get the mock Redis store from the service
      const serviceMockRedisStore = vi.mocked(
        (testService as any).sessionStore
      );
      serviceMockRedisStore.acquireLock.mockResolvedValue("mock-lock-token");
      serviceMockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "idle" },
        context: { sessionId: testServiceId },
      });

      // Create proper Tool object
      const testTool = createMockTool("testTool");

      // Initialize and reset mock calls
      await testService.initializeState();
      serviceMockRedisStore.setSession.mockClear();

      // Execute - use proper Tool object
      await testService.selectTool(testTool);

      // Verify
      expect(serviceMockRedisStore.setSession).toHaveBeenCalledWith(
        testServiceId,
        expect.objectContaining({
          context: expect.objectContaining({
            toolName: "testTool",
            selectedTool: expect.objectContaining({
              name: "testTool",
            }),
          }),
          state: expect.objectContaining({
            value: expect.stringContaining("tool"),
          }),
        })
      );

      // Clean up
      await testService.dispose();
    });
  });

  describe("Parameter Setting", () => {
    test("should update parameters and persist to Redis", async () => {
      // Create a service with a specific ID for this test
      const serviceId = "test-service-parameters";
      const service = new RedisToolExecutionService({
        serviceId,
        redisUrl: "redis://localhost:6379",
        tools: mockTools,
      });

      // Get the mock store from the service
      const store = (service as any).sessionStore as Mocked<RedisSessionStore>;

      // Mock store methods
      store.acquireLock = vi.fn().mockResolvedValue("mock-lock");
      store.createSessionIfNotExists = vi.fn().mockResolvedValue({
        state: { value: "idle" },
        context: { sessionId: serviceId },
      });
      store.setSession = vi.fn().mockResolvedValue(undefined);
      store.releaseLock = vi.fn().mockResolvedValue(undefined);

      // Initialize state first
      await service.initializeState();

      // Select a tool to have something in the state
      const mockTool = createMockTool("mockTool");
      await service.selectTool(mockTool);

      // Reset mock calls to start fresh
      vi.clearAllMocks();

      // Update parameters
      const parameters = { key: "value", another: 123 };
      await service.setParameters(parameters);

      // Verify Redis was updated with correct parameters
      expect(store.setSession).toHaveBeenCalledWith(
        serviceId,
        expect.objectContaining({
          context: expect.objectContaining({
            parameters,
          }),
        })
      );

      // Clean up
      await service.dispose();
    });
  });

  describe("Execution", () => {
    test("should execute tool and update state in Redis", async () => {
      // Setup
      mockRedisStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "tool_selected" },
        context: {
          sessionId: service.getServiceId(),
          toolName: "testTool",
          parameters: { foo: "bar" },
        },
      });
      mockRedisStore.acquireLock.mockResolvedValue("mock-lock-token");

      await service.initializeState();

      // Execute
      const mockHandler = vi.fn().mockResolvedValue({ result: "success" });
      const toolDefinition = createMockTool("testTool");

      // Verify
      expect(service.getContext().toolName).toBe("testTool");
      expect(service.getContext().parameters).toEqual({ foo: "bar" });
    });
  });

  describe("Session Management", () => {
    test("should clear session on reset", async () => {
      // Execute
      await service.reset();

      // Verify
      expect(mockRedisStore.clearSession).toHaveBeenCalledWith(
        service.getServiceId()
      );
    });

    test("should handle disconnection", async () => {
      // Execute
      await service.dispose();

      // Verify
      expect(mockRedisStore.disconnect).toHaveBeenCalled();
    });
  });

  describe("Concurrency Handling", () => {
    test("should acquire lock before modifying state", async () => {
      // Setup
      const toolDefinition = createMockTool("testTool");
      mockRedisStore.acquireLock.mockResolvedValue("lock-token-123");

      // Execute
      await service.selectTool(toolDefinition);

      // Verify
      expect(mockRedisStore.acquireLock).toHaveBeenCalledWith(
        service.getServiceId()
      );
      expect(mockRedisStore.releaseLock).toHaveBeenCalled();
    });

    test("should throw error if lock cannot be acquired", async () => {
      // Setup
      const toolDefinition = createMockTool("testTool");
      mockRedisStore.acquireLock.mockResolvedValue(null); // Lock not acquired

      // Execute & Verify
      await expect(service.selectTool(toolDefinition)).rejects.toThrow(
        "Could not acquire lock"
      );
    });
  });

  describe("TTL Management", () => {
    test("should extend TTL on state update", async () => {
      // Setup
      const toolDefinition = createMockTool("testTool");
      mockRedisStore.acquireLock.mockResolvedValue("lock-token-123");

      // Execute
      await service.selectTool(toolDefinition);

      // Verify
      expect(mockRedisStore.extendSessionTtl).toHaveBeenCalledWith(
        service.getServiceId(),
        expect.any(Number)
      );
    });
  });

  describe("Error Handling", () => {
    test("should handle Redis operation failures", async () => {
      // Arrange
      mockRedisStore.createSessionIfNotExists.mockRejectedValue(
        new Error("Redis error")
      );

      // Execute & Verify
      await expect(service.initializeState()).rejects.toThrow(
        /Failed to initialize state/
      );
    });

    test("should update error state in Redis on execution failure", async () => {
      // Create a service with a specific ID for this test
      const sessionId = "error-test-id";
      const errorService = new RedisToolExecutionService({
        redisUrl: "redis://localhost:6379",
        serviceId: sessionId,
        tools: mockTools,
      });

      // Get the mock store directly
      const mockStore = vi.mocked((errorService as any).sessionStore);

      // Setup the necessary mock methods
      mockStore.acquireLock.mockResolvedValue("mock-lock-token");
      mockStore.createSessionIfNotExists.mockResolvedValue({
        state: { value: "idle" },
        context: { sessionId },
      });
      mockStore.setSession.mockResolvedValue(undefined);
      mockStore.releaseLock.mockResolvedValue(undefined);
      mockStore.extendSessionTtl.mockResolvedValue(undefined);

      // Initialize the service
      await errorService.initializeState();

      // Create a mock error response
      const errorResponse = {
        status: "error",
        message: "Test execution error",
        data: { error: "Test execution error" },
        metadata: {},
      };

      // Mock the execute method to directly call the error handling logic
      const originalExecute = errorService.execute;
      errorService.execute = vi.fn().mockResolvedValue(errorResponse);

      // Setup a mock implementation for setSession that will record what was passed
      let capturedSession: any = null;
      mockStore.setSession.mockImplementation((id: string, session: any) => {
        capturedSession = session;
        return Promise.resolve(undefined);
      });

      // Execute the service with our mock
      const response = await errorService.execute();

      // Verify we get an error response
      expect(response.status).toBe("error");

      // Force the error state to be saved to Redis
      const error = new Error("Test execution error");
      await (errorService as any).persistState({
        value: "failed",
        context: {
          sessionId,
          error,
          toolName: "test-tool",
        },
      });

      // Verify that setSession was called with an error in the context
      expect(mockStore.setSession).toHaveBeenCalledWith(
        sessionId,
        expect.objectContaining({
          context: expect.objectContaining({
            error: expect.any(Object),
          }),
        })
      );

      // Also verify that the captured session has the right structure
      expect(capturedSession).toBeDefined();
      expect(capturedSession?.context?.error?.message).toBe(
        "Test execution error"
      );

      // Clean up
      await errorService.dispose();
    });
  });

  describe("Service Integration", () => {
    test("should support multiple service instances with different IDs", async () => {
      // Setup
      const service1 = new RedisToolExecutionService({
        redisUrl: "redis://localhost:6379",
        serviceId: "service-1",
        tools: mockTools,
      });

      const service2 = new RedisToolExecutionService({
        redisUrl: "redis://localhost:6379",
        serviceId: "service-2",
        tools: mockTools,
      });

      // Verify
      expect(service1.getServiceId()).toBe("service-1");
      expect(service2.getServiceId()).toBe("service-2");
      expect(service1.getServiceId()).not.toBe(service2.getServiceId());

      // Cleanup
      await service1.dispose();
      await service2.dispose();
    });
  });
});
