import { html } from 'lit-html';
import { igniteCore, RenderArgs } from 'ignite-element';
import { createMachine } from 'xstate';

// Initialize Ignite-core
const { Shared } = igniteCore({
  adapter: 'xstate',
  source: createMachine({
    id: 'accessibility-bad',
    initial: 'idle',
    states: {
      idle: {},
    },
  }),
});

@Shared('bad-component')
export class BadComponent {
  render(_args: RenderArgs<any, any>) {
    return html`
      <div style="color: #000; background-color: #fff;">
        <div onclick="handleClick()">Click me</div>
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
