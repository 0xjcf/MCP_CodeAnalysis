import { Shared } from '@ignite/core';
import { LitElement, html } from 'lit';

@Shared('test-component')
export class TestComponent extends LitElement {
  render() {
    // Large render method with many DOM operations
    return html`
      <div>
        ${Array(100)
          .fill()
          .map(() => '<span>Item</span>')
          .join('')}
      </div>
    `;
  }

  updated(changedProperties) {
    // Forced reflow
    this.shadowRoot.querySelector('div').offsetHeight;

    // Expensive property observer
    if (changedProperties.has('data')) {
      this.processData(this.data);
    }
  }

  processData(data) {
    // Expensive operation
    const result = data.map(item => ({
      ...item,
      processed: this.expensiveOperation(item),
    }));
  }

  expensiveOperation(item) {
    // Simulate expensive operation
    return JSON.parse(JSON.stringify(item));
  }
}
