// Memory leak test component
export class TestComponent extends HTMLElement {
  private _shadow: ShadowRoot;
  private listeners: Array<() => void> = [];

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();

    // Add event listeners without cleanup
    const handleClick = () => this.handleClick();
    const handleInput = () => this.handleInput();

    this.addEventListener('click', handleClick);
    this.addEventListener('input', handleInput);

    this.listeners.push(
      () => this.removeEventListener('click', handleClick),
      () => this.removeEventListener('input', handleInput),
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
    this._shadow.innerHTML = `
      <div>
        <button>Click me</button>
        <input type="text" />
      </div>
    `;
  }
}

// Define the custom element
customElements.define('test-component', TestComponent);
