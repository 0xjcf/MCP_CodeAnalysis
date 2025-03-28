import { Shared } from '@ignite/core';
import { LitElement, html } from 'lit';

@Shared('test-component')
export class TestComponent extends LitElement {
  private listeners: EventListener[] = [];

  connectedCallback() {
    super.connectedCallback();

    // Add event listeners without cleanup
    this.listeners.push(
      this.addEventListener('click', this.handleClick),
      this.addEventListener('input', this.handleInput),
    );
  }

  disconnectedCallback() {
    // Missing cleanup
  }

  handleClick() {
    console.log('Click event handled');
  }

  handleInput() {
    console.log('Input event handled');
  }

  render() {
    return html`
      <div>
        <button>Click me</button>
        <input type="text" />
      </div>
    `;
  }
}
