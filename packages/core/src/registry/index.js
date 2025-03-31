import { ToolRegistry, getToolRegistry } from "./tool-registry.js";
/**
 * Initialize the tool registry with verbosity setting
 */
export function initializeToolRegistry(verbose = false) {
    const registry = getToolRegistry();
    registry.setVerbose(verbose);
    return registry;
}
/**
 * Register tools with both the registry and server
 *
 * This function ensures tools are only registered once while
 * maintaining the existing defensive programming approach
 */
export function registerToolsWithRegistry(server, registerFn, source, verbose = false) {
    const registry = getToolRegistry();
    // Track the number of tools registered by this function
    const initialToolCount = registry.getAllTools().size;
    try {
        if (verbose) {
            console.log(`[Registry] Registering tools from '${source}'...`);
        }
        // Create a proxy that intercepts tool registrations
        const serverProxy = new Proxy(server, {
            get(target, prop) {
                // If someone is calling the tool method
                if (prop === "tool") {
                    return function (id, schema, handler) {
                        // Check if this tool is already registered in our registry
                        if (registry.isToolRegistered(id)) {
                            if (verbose) {
                                console.log(`[Registry] Skipped: Tool '${id}' is already registered by '${registry.getTool(id)?.source}', not registering from '${source}'`);
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
                return target[prop];
            },
        });
        // Register the tools with our proxy
        registerFn(serverProxy);
        // Report how many tools were registered in this module
        const finalToolCount = registry.getAllTools().size;
        const newToolsCount = finalToolCount - initialToolCount;
        if (verbose && newToolsCount > 0) {
            console.log(`[Registry] Successfully registered ${newToolsCount} tools from '${source}'`);
        }
    }
    catch (error) {
        console.error(`[Registry] Error registering tools from '${source}': ${error}`);
    }
}
// Export the registry module
export { ToolRegistry, getToolRegistry };
//# sourceMappingURL=index.js.map