export class TestComponent extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Create container div
    const container = document.createElement('div');
    container.style.width = '100px';
    container.style.height = '100px';
    container.style.margin = '10px';
    this.shadow.appendChild(container as Node);

    // Create content span
    const content = document.createElement('span');
    content.textContent = 'Content';
    container.appendChild(content as Node);

    // Forced layout
    const height = container.offsetHeight;
    container.style.height = `${height}px`;
  }
}

customElements.define('test-component', TestComponent);
