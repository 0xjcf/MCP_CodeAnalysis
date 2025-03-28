import { Shared } from '@ignite/core';
import { LitElement, html } from 'lit';

@Shared('test-component')
export class TestComponent extends LitElement {
  handleClick() {
    console.log('Click event handled');
  }

  onInput() {
    console.log('Input event handled');
  }

  render() {
    return html`
      <div>
        <button @click=${this.handleClick}>Click me</button>
        <input @input=${this.onInput} />
      </div>
    `;
  }
}
