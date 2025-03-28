import { html } from 'lit-html';
import { Shared } from 'ignite-element';
import { createMachine } from 'xstate';

@Shared('performance-issues')
export class PerformanceIssuesComponent {
  private render() {
    return html`
      <div>
        <div id="container">${this.renderLargeList()}</div>
        <div style="width: ${this.getWidth()}px"></div>
        <div innerHTML=${this.getDynamicContent()}></div>
      </div>
    `;
  }

  private renderLargeList() {
    const items = Array.from({ length: 1000 }, (_, i) => i);
    return html`
      <ul>
        ${items.map(i => html`<li>Item ${i}</li>`)}
      </ul>
    `;
  }

  private getWidth() {
    const element = document.getElementById('container');
    return element?.offsetWidth || 0;
  }

  private getDynamicContent() {
    return '<div>Dynamic content</div>';
  }

  private connectedCallback() {
    // Force reflow
    const width = this.getWidth();
    // Force repaint
    this.style.backgroundColor = 'red';
    this.style.backgroundColor = 'blue';
  }
}
