import { html } from 'lit-html';
import { Shared } from 'ignite-element';
import { createMachine } from 'xstate';

@Shared('event-handlers')
export class EventHandlersComponent {
  private render() {
    return html`
      <div>
        <button @click=${this.handleClick}>Click me</button>
        <input @keydown=${this.handleKeyDown} />
      </div>
    `;
  }

  private handleClick(e: Event) {
    e.preventDefault();
    // Handle click
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      // Handle enter key
    }
  }
}
