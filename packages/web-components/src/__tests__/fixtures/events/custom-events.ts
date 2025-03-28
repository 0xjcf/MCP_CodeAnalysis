import { html } from 'lit-html';
import { igniteCore, RenderArgs } from 'ignite-element';
import { createMachine } from 'xstate';

// Initialize Ignite-core
const { Shared } = igniteCore({
  adapter: 'xstate',
  source: createMachine({
    id: 'custom-events',
    initial: 'idle',
    states: {
      idle: {},
    },
  }),
});

@Shared('custom-events')
export class CustomEventsComponent extends HTMLElement {
  render(_args: RenderArgs<any, any>) {
    return html`
      <div>
        <button @click=${this.dispatchCustomEvent}>Trigger Event</button>
      </div>
    `;
  }

  private dispatchCustomEvent() {
    const event = new CustomEvent('custom-event', {
      bubbles: true,
      composed: true,
      detail: { data: 'test' },
    });
    this.dispatchEvent(event);
  }
}
