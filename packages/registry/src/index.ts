import type { McpServer, RequestHandlerExtra, IToolDefinition } from '@mcp/types';
import type { ZodType } from 'zod';

import { ToolRegistry, getToolRegistry } from './tool-registry.js';

/**
 * Initialize the tool registry with verbosity setting
 */
export function initializeToolRegistry(verbose = false): ToolRegistry {
  try {
    const registry = getToolRegistry();
    registry.setVerbose(verbose);
    return registry;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Registry] Failed to initialize tool registry:', error);
    throw error;
  }
}

/**
 * Register tools with both the registry and server
 *
 * This function ensures tools are only registered once while
 * maintaining the existing defensive programming approach
 */
export function registerToolsWithRegistry(
  server: McpServer,
  registerFn: (server: McpServer) => void,
  source: string,
  verbose = false,
): void {
  try {
    const registry = getToolRegistry();
    // Track the number of tools registered by this function
    const initialToolCount = registry.getAllTools().size;

    if (verbose) {
      // eslint-disable-next-line no-console
      console.log(`[Registry] Registering tools from '${source}'...`);
    }

    // Create a proxy that intercepts tool registrations
    const serverProxy = new Proxy(server, {
      get(target: McpServer, prop: string | symbol): unknown {
        // If someone is calling the tool method
        if (prop === 'tool') {
          return function (
            id: string,
            schema: Record<string, ZodType>,
            handler: (
              args: Record<string, unknown>,
              extra: RequestHandlerExtra,
            ) => Promise<unknown>,
          ) {
            // Check if this tool is already registered in our registry
            if (registry.isToolRegistered(id)) {
              if (verbose) {
                // eslint-disable-next-line no-console
                console.log(
                  `[Registry] Skipped: Tool '${id}' is already registered by '${
                    registry.getTool(id)?.source
                  }', not registering from '${source}'`,
                );
              }
              return target; // Return the server instance for chaining
            }

            // Register with the registry
            registry.registerTool(id, schema, handler, source);

            // Call the real method with properly typed arguments
            return target.tool(id, schema, handler);
          };
        }

        // For any other property, return the original
        return Reflect.get(target, prop);
      },
    });

    // Register the tools with our proxy
    registerFn(serverProxy);

    // Report how many tools were registered in this module
    const finalToolCount = registry.getAllTools().size;
    const newToolsCount = finalToolCount - initialToolCount;

    if (verbose && newToolsCount > 0) {
      // eslint-disable-next-line no-console
      console.log(`[Registry] Successfully registered ${newToolsCount} tools from '${source}'`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[Registry] Error registering tools from '${source}':`, error);
    throw error;
  }
}

export { ToolRegistry, getToolRegistry, type IToolDefinition };
