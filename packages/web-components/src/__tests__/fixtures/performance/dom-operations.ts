import { Shared } from '@ignite/core';
import { LitElement, html } from 'lit';

@Shared('test-component')
export class TestComponent extends LitElement {
  connectedCallback() {
    super.connectedCallback();

    // Multiple DOM operations
    this.shadowRoot.querySelector('div').style.width = '100px';
    this.shadowRoot.querySelector('div').style.height = '100px';
    this.shadowRoot.querySelector('div').style.margin = '10px';

    // Forced layout
    const height = this.shadowRoot.querySelector('div').offsetHeight;
    this.shadowRoot.querySelector('div').style.height = height + 'px';
  }

  render() {
    return html`
      <div>
        <span>Content</span>
      </div>
    `;
  }
}
