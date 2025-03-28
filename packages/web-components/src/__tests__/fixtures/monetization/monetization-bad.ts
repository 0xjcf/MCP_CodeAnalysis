import { html } from 'lit-html';
import { igniteCore, RenderArgs } from 'ignite-element';
import { createMachine } from 'xstate';

// Initialize Ignite-core
const { Shared } = igniteCore({
  adapter: 'xstate',
  source: createMachine({
    id: 'monetization-bad',
    initial: 'idle',
    states: {
      idle: {},
    },
  }),
});

@Shared('bad-monetization')
export class BadMonetization {
  render({ state }: RenderArgs<any, any>) {
    return html`
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
            <button onclick="closeAd()">×</button>
            <img src="popup.jpg" />
          </div>
        </div>
      </div>
    `;
  }
}
