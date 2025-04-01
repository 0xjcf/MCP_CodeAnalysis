export class EventHandlersComponent extends HTMLElement {
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private render() {
    if (!this._shadow) return;

    this._shadow.innerHTML = `
      <div>
        <button>Click me</button>
        <input type="text" />
      </div>
    `;
  }

  private setupEventListeners() {
    const button = this._shadow.querySelector('button');
    const input = this._shadow.querySelector('input');

    if (button) {
      button.addEventListener('click', this.handleClick);
    }

    if (input) {
      input.addEventListener('keydown', this.handleKeyDown);
    }
  }

  private handleClick = (e: Event) => {
    e.preventDefault();
    // Handle click
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Handle enter key
    }
  };
}

// Define the custom element
customElements.define('event-handlers', EventHandlersComponent);
