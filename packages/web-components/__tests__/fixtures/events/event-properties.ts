import { Shared } from '@ignite/core';
import { LitElement, html } from 'lit';

@Shared('test-component')
export class TestComponent extends LitElement {
  onsubmit: () => void;
  onchange: (event: Event) => void;

  render() {
    return html`
      <form @submit=${this.onsubmit}>
        <input @change=${this.onchange} />
        <button type="submit">Submit</button>
      </form>
    `;
  }
}
