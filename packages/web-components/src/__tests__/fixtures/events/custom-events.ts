import { Shared } from '@ignite/core';
import { LitElement, html } from 'lit';

@Shared('test-component')
export class TestComponent extends LitElement {
  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(
      new CustomEvent('custom-event', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleCustomEvent() {
    this.addEventListener('custom-event', () => {
      console.log('Custom event handled');
    });
  }

  render() {
    return html`
      <div>
        <button @click=${this.handleCustomEvent}>Listen for custom event</button>
      </div>
    `;
  }
}
