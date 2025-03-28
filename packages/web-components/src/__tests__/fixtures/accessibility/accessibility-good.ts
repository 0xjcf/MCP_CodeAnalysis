import { html } from 'lit-html';
import { igniteCore, RenderArgs } from 'ignite-element';
import { createMachine } from 'xstate';

// Initialize Ignite-core
const { Shared } = igniteCore({
  adapter: 'xstate',
  source: createMachine({
    id: 'accessibility-good',
    initial: 'idle',
    states: {
      idle: {},
    },
  }),
});

@Shared('good-component')
export class GoodComponent {
  render({ state }: RenderArgs<any, any>) {
    return html`
      <div role="main" aria-label="Main content">
        <button @click=${this.handleClick} @keydown=${this.handleKeyDown} aria-label="Click me">
          Click me
        </button>
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

  private handleClick() {
    // Handle click with keyboard support
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.handleClick();
    }
  }
}
