class BadComponent extends HTMLElement {
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    if (!this._shadow) return;

    this._shadow.innerHTML = `
      <style>
        .container {
          color: #000;
          background-color: #fff;
        }
        .clickable {
          cursor: pointer;
        }
      </style>
      <div class="container">
        <div class="clickable" onclick="this.handleClick()">Click me</div>
        <img src="image.jpg" />
        <table>
          <tr>
            <td>Data</td>
          </tr>
        </table>
        <iframe src="content.html"></iframe>
        <video src="video.mp4"></video>
        <div innerHTML="<p>Dynamic content</p>"></div>
        <input type="text" />
        <h2>Heading</h2>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    `;
  }

  private handleClick() {
    // No keyboard support
  }
}

customElements.define('bad-component', BadComponent);
