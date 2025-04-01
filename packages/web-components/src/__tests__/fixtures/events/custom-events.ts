export class CustomEventsComponent extends HTMLElement {
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
        <button>Trigger Event</button>
      </div>
    `;
  }

  private setupEventListeners() {
    const button = this._shadow.querySelector('button');
    if (button) {
      button.addEventListener('click', this.dispatchCustomEvent);
    }
  }

  private dispatchCustomEvent = () => {
    const event = new CustomEvent('custom-event', {
      bubbles: true,
      composed: true,
      detail: { data: 'test' },
    });
    this.dispatchEvent(event);
  };
}

// Define the custom element
customElements.define('custom-events', CustomEventsComponent);
