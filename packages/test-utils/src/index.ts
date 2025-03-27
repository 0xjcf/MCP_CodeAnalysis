import { setup } from 'xstate';
import type { AnyStateMachine } from 'xstate';

/**
 * Creates a simple test state machine for analyzer testing
 */
export const createTestMachine = (
  config: {
    states?: number;
    guards?: number;
    actions?: number;
    services?: number;
  } = {},
): AnyStateMachine => {
  const { states = 1, guards = 0, actions = 0, services = 0 } = config;

  const stateObj: Record<string, any> = {};
  const guardObj: Record<string, () => boolean> = {};
  const actionObj: Record<string, () => void> = {};

  // Create guards
  for (let i = 0; i < guards; i++) {
    guardObj[`guard${i + 1}`] = () => true;
  }

  // Create actions
  for (let i = 0; i < actions; i++) {
    actionObj[`action${i + 1}`] = () => {};
  }

  // Create states
  for (let i = 0; i < states; i++) {
    const stateNumber = i + 1;
    const nextStateNumber = ((i + 1) % states) + 1;

    stateObj[`state${stateNumber}`] = {
      on: {
        NEXT: [
          {
            target: `state${nextStateNumber}`,
            ...(stateNumber <= guards ? { guard: `guard${stateNumber}` } : {}),
            ...(actions >= stateNumber ? { actions: [`action${stateNumber}`] } : {}),
          },
        ],
      },
      ...(services >= stateNumber
        ? {
            invoke: {
              id: `service${stateNumber}`,
              src: `service${stateNumber}`,
            },
          }
        : {}),
    };
  }

  return setup({
    types: {
      context: {} as Record<string, never>,
      events: {} as { type: 'NEXT' },
    },
    guards: guardObj,
    actions: actionObj,
  }).createMachine({
    id: 'test',
    initial: 'state1',
    context: {},
    states: stateObj,
  });
};

interface TestComponentConfig {
  properties?: string[];
  events?: string[];
  slots?: string[];
}

/**
 * Creates a test web component class for analyzer testing
 */
export const createTestComponent = (config: TestComponentConfig = {}): typeof HTMLElement => {
  const { properties = [], events = [], slots = [] } = config;

  return class TestComponent extends HTMLElement {
    static get observedAttributes(): string[] {
      return properties;
    }

    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });

      // Create slots
      slots.forEach((slot: string) => {
        const slotElement = document.createElement('slot');
        slotElement.name = slot;
        shadow.appendChild(slotElement);
      });

      // Add property getters/setters
      properties.forEach((prop: string) => {
        Object.defineProperty(this, prop, {
          get(): string | null {
            return this.getAttribute(prop);
          },
          set(value: string) {
            this.setAttribute(prop, value);
          },
        });
      });

      // Add event dispatchers
      events.forEach((event: string) => {
        (this as any)[`dispatch${event}`] = () => {
          this.dispatchEvent(new CustomEvent(event.toLowerCase()));
        };
      });
    }
  };
};
