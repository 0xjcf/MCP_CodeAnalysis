import { setup, type AnyStateMachine } from 'xstate';

interface TestMachineConfig {
  states?: number;
  guards?: number;
  actions?: number;
  services?: number;
}

interface TestComponentConfig {
  properties?: string[];
  events?: string[];
  slots?: string[];
}

interface TestComponent extends HTMLElement {
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  dispatchEvent(event: Event): boolean;
}

type TestComponentConstructor = {
  new (): TestComponent;
  observedAttributes: string[];
};

/**
 * Creates a simple test state machine for analyzer testing
 */
export const createTestMachine = (config: TestMachineConfig = {}): AnyStateMachine => {
  const { states = 1, guards = 0, actions = 0, services = 0 } = config;

  const stateObj: Record<string, Record<string, unknown>> = {};
  const guardObj: Record<string, () => boolean> = {};
  const actionObj: Record<string, () => void> = {};

  // Create guards
  for (let i = 0; i < guards; i++) {
    guardObj[`guard${i + 1}`] = (): boolean => true;
  }

  // Create actions
  for (let i = 0; i < actions; i++) {
    actionObj[`action${i + 1}`] = (): void => {};
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

/**
 * Creates a test web component class for analyzer testing
 */
export const createTestComponent = (config: TestComponentConfig = {}): TestComponentConstructor => {
  const { properties = [], events = [], slots = [] } = config;

  class TestWebComponent extends HTMLElement {
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
            return HTMLElement.prototype.getAttribute.call(this, prop);
          },
          set(value: string): void {
            HTMLElement.prototype.setAttribute.call(this, prop, value);
          },
        });
      });

      // Add event dispatchers
      events.forEach((event: string) => {
        const dispatchMethod = `dispatch${event}`;
        Object.defineProperty(this, dispatchMethod, {
          value: (): void => {
            this.dispatchEvent(new CustomEvent(event.toLowerCase()));
          },
          writable: false,
          configurable: true,
        });
      });
    }
  }

  return TestWebComponent as TestComponentConstructor;
};
