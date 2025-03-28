import { Shared } from '@ignite/core';
import { LitElement, html } from 'lit';

@Shared('test-component')
export class TestComponent extends LitElement {
  render() {
    return html`
      <div role="button" tabindex="0" aria-label="Click me">
        <span>Click me</span>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.dispatchEvent(new CustomEvent('click'));
    }
  }
}
