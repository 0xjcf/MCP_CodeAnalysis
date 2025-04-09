export class BadMonetization extends HTMLElement {
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    this._shadow.innerHTML = `
      <div>
        <div class="ad-container">
          <div class="ad" style="position: fixed; top: 0; left: 0; width: 100%;">
            <img src="ad.jpg" />
          </div>
        </div>
        <div class="content">
          <h1>Main Content</h1>
          <p>Some text here...</p>
          <div class="popup-ad" style="position: absolute; z-index: 9999;">
            <button>×</button>
            <img src="popup.jpg" />
          </div>
        </div>
      </div>
    `;

    // Add event listener for the close button
    const closeButton = this._shadow.querySelector('.popup-ad button');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        const popupAd = this._shadow.querySelector('.popup-ad');
        if (popupAd) {
          popupAd.remove();
        }
      });
    }
  }
}

// Define the custom element
customElements.define('bad-monetization', BadMonetization);
