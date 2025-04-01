export class PerformanceIssuesComponent extends HTMLElement {
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    // Force reflow
    const width = this.getWidth();
    // Force repaint
    this.style.backgroundColor = 'red';
    this.style.backgroundColor = 'blue';
  }

  private render() {
    if (!this._shadow) return;

    this._shadow.innerHTML = `
      <div>
        <div id="container">${this.renderLargeList()}</div>
        <div style="width: ${this.getWidth()}px"></div>
        <div innerHTML=${this.getDynamicContent()}></div>
      </div>
    `;
  }

  private renderLargeList() {
    const items = Array.from({ length: 1000 }, (_, i) => i);
    return `
      <ul>
        ${items.map(i => `<li>Item ${i}</li>`).join('')}
      </ul>
    `;
  }

  private getWidth() {
    const element = this._shadow.querySelector('#container') as HTMLElement;
    return element?.offsetWidth || 0;
  }

  private getDynamicContent() {
    return '<div>Dynamic content</div>';
  }
}

// Define the custom element
customElements.define('performance-issues', PerformanceIssuesComponent);
