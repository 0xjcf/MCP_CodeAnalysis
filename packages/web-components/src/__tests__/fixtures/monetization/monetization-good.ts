import { html } from 'lit-html';
import { igniteCore, RenderArgs } from 'ignite-element';
import { createMachine } from 'xstate';

// Initialize Ignite-core
const { Shared } = igniteCore({
  adapter: 'xstate',
  source: createMachine({
    id: 'monetization-good',
    initial: 'idle',
    states: {
      idle: {},
    },
  }),
});

@Shared('good-monetization')
export class GoodMonetization {
  render({ state }: RenderArgs<any, any>) {
    return html`
      <div>
        <div class="content">
          <h1>Main Content</h1>
          <p>Some text here...</p>

          <div class="ad-container" role="complementary" aria-label="Advertisement">
            <div class="ad">
              <img src="ad.jpg" alt="Advertisement" />
            </div>
          </div>

          <div class="premium-content" role="region" aria-label="Premium content">
            <h2>Premium Features</h2>
            <p>Upgrade to access exclusive content</p>
            <button
              @click=${this.handleUpgrade}
              @keydown=${this.handleKeyDown}
              aria-label="Upgrade to premium"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private handleUpgrade() {
    // Handle upgrade flow
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.handleUpgrade();
    }
  }
}
