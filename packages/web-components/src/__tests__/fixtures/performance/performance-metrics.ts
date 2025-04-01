export class PerformanceMetricsComponent extends HTMLElement {
  private _shadow: ShadowRoot;
  private _container: HTMLElement | null = null;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    // Cache DOM queries
    this._container = this._shadow.querySelector('#container');
    if (this._container) {
      // Use cached element
      this._container.classList.add('loaded');
    }
    this.addEventListener('scroll', this.handleScroll);
  }

  disconnectedCallback() {
    // Clean up event listeners
    this.removeEventListener('scroll', this.handleScroll);
  }

  private render() {
    if (!this._shadow) return;

    this._shadow.innerHTML = `
      <style>
        .content {
          padding: 1rem;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        li {
          padding: 0.5rem;
          border-bottom: 1px solid #eee;
        }
      </style>
      <div>
        <div id="container">${this.renderList()}</div>
        <div class="content">${this.getContent()}</div>
      </div>
    `;
  }

  private renderList() {
    const items = Array.from({ length: 100 }, (_, i) => i);
    return `
      <ul>
        ${items.map(i => `<li>Item ${i}</li>`).join('')}
      </ul>
    `;
  }

  private getContent() {
    return 'Content';
  }

  private handleScroll = () => {
    // Handle scroll event
  };
}

// Define the custom element
customElements.define('performance-metrics', PerformanceMetricsComponent);
