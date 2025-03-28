import { html } from 'lit-html';
import { igniteCore, RenderArgs } from 'ignite-element';
import { createMachine } from 'xstate';

// Define the state machine for the component
const buttonMachine = createMachine({
  id: 'button',
  initial: 'idle',
  context: {
    label: 'Click me',
    disabled: false,
  },
  states: {
    idle: {
      on: {
        CLICK: { actions: 'handleClick' },
        KEYDOWN: { actions: 'handleKeyDown' },
      },
    },
  },
});

// Initialize ignite-core with XState adapter
const { Shared } = igniteCore({
  adapter: 'xstate',
  source: buttonMachine,
});

@Shared('test-component')
export class TestComponent {
  render({ state, send }: RenderArgs<typeof buttonMachine>) {
    const { label, disabled } = state.context;

    return html`
      <button
        ?disabled=${disabled}
        @click=${() => send({ type: 'CLICK' })}
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            send({ type: 'KEYDOWN', key: e.key });
          }
        }}
        aria-label=${label}
        role="button"
        tabindex="0"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>${label}</span>
      </button>
    `;
  }
}
