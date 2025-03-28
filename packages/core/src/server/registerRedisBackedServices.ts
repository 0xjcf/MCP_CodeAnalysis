// import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// import { RedisSessionStore } from '@mcp/core';
// import { RedisCacheStore } from '../state/store/redisCacheStore.js';
// import { createSessionStore } from '../state/services/sessionStoreFactory.js';
// import { SessionStore } from '../state/services/types.js';
// import { ToolExecutionService } from '../state/services/toolService.js';

// export interface RedisBackedServicesOptions {
//   /**
//    * Redis connection URL (e.g., redis://localhost:6379)
//    */
//   redisUrl: string;

//   /**
//    * Key prefix for Redis keys (default: "mcp:")
//    */
//   prefix?: string;

//   /**
//    * Default TTL for cache entries in seconds (default: 3600 - 1 hour)
//    */
//   defaultTtl?: number;

//   /**
//    * Enable memory caching layer (default: true)
//    */
//   useMemoryCache?: boolean;

//   /**
//    * Force use of in-memory session store instead of Redis
//    */
//   forceMemorySessionStore?: boolean;

//   /**
//    * Whether to show verbose logs
//    */
//   verbose?: boolean;
// }

// /**
//  * Registers storage and execution services with the MCP server
//  *
//  * This function sets up:
//  * 1. Session store (Redis if available, otherwise in-memory)
//  * 2. Redis cache store for performance optimization
//  * 3. Redis-backed tool execution service
//  *
//  * @param server MCP server instance
//  * @param options Configuration options
//  * @returns The registered service instances
//  */
// export async function registerRedisBackedServices(
//   server: McpServer,
//   options: RedisBackedServicesOptions,
// ): Promise<{
//   sessionStore: SessionStore;
//   cacheStore: RedisCacheStore;
//   toolService: ToolExecutionService;
// }> {
//   if (options.verbose) {
//     console.log('Registering storage and execution services...');
//   }

//   const prefix = options.prefix || 'mcp:';

//   // Create session store with auto-detection of backends
//   const sessionStore = await createSessionStore({
//     redisUrl: options.redisUrl,
//     prefix: `${prefix}session:`,
//     defaultTtl: options.defaultTtl || 3600,
//     preferMemory: options.forceMemorySessionStore,
//     verbose: options.verbose,
//   });

//   // Create Redis cache store
//   const cacheStore = new RedisCacheStore({
//     redisUrl: options.redisUrl,
//     prefix: `${prefix}cache:`,
//     defaultTtl: options.defaultTtl || 3600,
//     useMemoryCache: options.useMemoryCache,
//   });

//   // Create tool execution service with empty tools
//   // The actual tools will be registered by other parts of the codebase
//   const toolService = new ToolExecutionService();

//   // Attempt to set session store on server (using type assertion for compatibility)
//   try {
//     const serverAny = server as any;
//     if (typeof serverAny.setSessionStore === 'function') {
//       serverAny.setSessionStore(sessionStore);
//       if (options.verbose) {
//         console.log('Session store registered with server');
//       }
//     } else {
//       console.warn(
//         'Server does not support setSessionStore method - using alternative session management',
//       );
//     }
//   } catch (error) {
//     console.warn(`Could not set session store: ${error}`);
//   }

//   if (options.verbose) {
//     console.log('Storage and execution services registered successfully');
//   }

//   return {
//     sessionStore,
//     cacheStore,
//     toolService,
//   };
// }
