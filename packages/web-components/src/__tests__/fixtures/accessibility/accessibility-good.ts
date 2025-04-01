// Example of a web component with good accessibility practices
export class GoodComponent extends HTMLElement {
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
      <style>
        .container {
          padding: 1rem;
        }
        button {
          padding: 0.5rem 1rem;
          margin: 0.5rem 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        td {
          padding: 0.5rem;
          border: 1px solid #ddd;
        }
        iframe {
          width: 100%;
          height: 200px;
          margin: 1rem 0;
        }
        video {
          width: 100%;
          margin: 1rem 0;
        }
        input {
          padding: 0.5rem;
          margin: 0.5rem 0;
          width: 100%;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }
        li {
          padding: 0.5rem;
          border-bottom: 1px solid #eee;
        }
      </style>
      <div class="container" role="main" aria-label="Main content">
        <button aria-label="Click me">Click me</button>
        <img src="image.jpg" alt="Descriptive text" />
        <table role="grid" aria-label="Data table">
          <tr>
            <td>Data</td>
          </tr>
        </table>
        <iframe src="content.html" title="Content frame" aria-label="Content frame"></iframe>
        <video src="video.mp4" controls aria-label="Video player"></video>
        <div role="region" aria-label="Dynamic content">
          <p>Dynamic content</p>
        </div>
        <input type="text" aria-label="Text input" placeholder="Enter text" />
        <h2>Heading</h2>
        <ul role="list">
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    `;
  }

  private setupEventListeners() {
    const button = this._shadow.querySelector('button');
    if (button) {
      button.addEventListener('click', this.handleClick);
      button.addEventListener('keydown', this.handleKeyDown);
    }
  }

  private handleClick = () => {
    // Handle click with keyboard support
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      this.handleClick();
    }
  };
}

// Define the custom element
customElements.define('good-component', GoodComponent);
