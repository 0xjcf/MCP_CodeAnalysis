/**
 * Simple event emitter utility for MCP Code Analysis
 * @module @mcp/core
 */

type EventHandler = (...args: unknown[]) => void;

export class EventEmitter {
  private events: Map<string, Set<EventHandler>> = new Map();

  /**
   * Emit an event with the given arguments
   * @param event The event name
   * @param args The arguments to pass to the event handlers
   * @returns true if the event had listeners, false otherwise
   */
  emit(event: string, ...args: unknown[]): boolean {
    const handlers = this.events.get(event);
    if (!handlers) {
      return false;
    }

    handlers.forEach(handler => {
      try {
        handler(...args);
      } catch (error) {
        // Prevent errors in one handler from affecting others
        console.error(`Error in event handler for ${event}:`, error);
      }
    });

    return true;
  }

  /**
   * Add an event listener
   * @param event The event name
   * @param handler The event handler
   * @returns this for chaining
   */
  on(event: string, handler: EventHandler): this {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);
    return this;
  }

  /**
   * Remove an event listener
   * @param event The event name
   * @param handler The event handler to remove
   * @returns this for chaining
   */
  off(event: string, handler: EventHandler): this {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.events.delete(event);
      }
    }
    return this;
  }

  /**
   * Remove all event listeners
   * @param event Optional event name to clear specific event listeners
   * @returns this for chaining
   */
  clear(event?: string): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
}
