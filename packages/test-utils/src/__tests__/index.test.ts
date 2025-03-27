import { describe, it, expect, beforeAll } from 'vitest';
import { createTestMachine, createTestComponent } from '../index';
import { JSDOM } from 'jsdom';

describe('Test Utilities', () => {
  beforeAll(() => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.window = dom.window as any;
    global.document = dom.window.document;
    global.customElements = dom.window.customElements;
    global.HTMLElement = dom.window.HTMLElement;
    global.CustomEvent = dom.window.CustomEvent;
  });

  describe('createTestMachine', () => {
    it('should create a simple state machine', () => {
      const machine = createTestMachine();
      expect(machine.states).toBeDefined();
      expect(Object.keys(machine.states)).toHaveLength(1);
      expect(machine.states.state1).toBeDefined();
    });

    it('should create a machine with multiple states', () => {
      const machine = createTestMachine({ states: 3 });
      expect(Object.keys(machine.states)).toHaveLength(3);
      expect(machine.states.state1).toBeDefined();
      expect(machine.states.state2).toBeDefined();
      expect(machine.states.state3).toBeDefined();
    });

    it('should create a machine with guards', () => {
      const config = { states: 2, guards: 2 };
      console.log('Creating machine with config:', config);
      const machine = createTestMachine(config);
      console.log('Machine states:', JSON.stringify(machine.states, null, 2));
      console.log('Machine guards:', JSON.stringify((machine.config as any).guards, null, 2));

      const state1 = machine.states.state1;
      const state2 = machine.states.state2;

      expect(state1.on.NEXT).toBeDefined();
      expect(state2.on.NEXT).toBeDefined();

      const state1NextEvent = state1.on.NEXT[0] as unknown as { guard: string };
      const state2NextEvent = state2.on.NEXT[0] as unknown as { guard: string };

      console.log('State1 Next Event:', JSON.stringify(state1NextEvent, null, 2));
      console.log('State2 Next Event:', JSON.stringify(state2NextEvent, null, 2));

      expect(state1NextEvent.guard).toBe('guard1');
      expect(state2NextEvent.guard).toBe('guard2');
    });

    it('should create a machine with actions', () => {
      const machine = createTestMachine({ states: 2, actions: 2 });
      const state1NextEvent = machine.states.state1.on.NEXT[0] as any;
      const state2NextEvent = machine.states.state2.on.NEXT[0] as any;
      expect(state1NextEvent).toBeDefined();
      expect(state2NextEvent).toBeDefined();
      expect(state1NextEvent.actions).toEqual(['action1']);
      expect(state2NextEvent.actions).toEqual(['action2']);
    });

    it('should create a machine with services', () => {
      const machine = createTestMachine({ states: 2, services: 2 });
      expect(machine.states.state1.invoke).toBeDefined();
      expect(machine.states.state2.invoke).toBeDefined();
      expect(JSON.stringify(machine.states.state1.invoke)).toContain('service1');
      expect(JSON.stringify(machine.states.state2.invoke)).toContain('service2');
    });
  });

  describe('createTestComponent', () => {
    it('should create a basic web component', () => {
      const TestComponent = createTestComponent();
      customElements.define('test-component', TestComponent);
      const element = document.createElement('test-component');
      expect(element).toBeInstanceOf(HTMLElement);
      expect(element.shadowRoot).toBeDefined();
    });

    it('should create a component with properties', () => {
      const TestComponent = createTestComponent({
        properties: ['name', 'value'],
      });
      customElements.define('test-component-props', TestComponent);
      const element = document.createElement('test-component-props');
      element.setAttribute('name', 'test');
      expect(element.getAttribute('name')).toBe('test');
    });

    it('should create a component with slots', () => {
      const TestComponent = createTestComponent({
        slots: ['header', 'content'],
      });
      customElements.define('test-component-slots', TestComponent);
      const element = document.createElement('test-component-slots');
      const slots = element.shadowRoot?.querySelectorAll('slot');
      expect(slots).toHaveLength(2);
      expect(slots?.[0].name).toBe('header');
      expect(slots?.[1].name).toBe('content');
    });

    it('should create a component with events', () => {
      const TestComponent = createTestComponent({
        events: ['Change', 'Submit'],
      });
      customElements.define('test-component-events', TestComponent);
      const element = document.createElement('test-component-events') as any;
      expect(typeof element.dispatchChange).toBe('function');
      expect(typeof element.dispatchSubmit).toBe('function');
    });
  });
});
