import { html } from "lit-html";
import { igniteCore } from "../../IgniteCore";
import { setGlobalStyles } from "../../globalStyles";
import { RenderArgs } from "../../RenderArgs";
import { advancedMachine } from "./advancedCounterMachine";

setGlobalStyles("./dist/styles.css");

const { shared, isolated, Shared } = igniteCore({
  adapter: "xstate",
  source: advancedMachine,
});

// Shared Counter Component (XState)
shared("my-counter-xstate", ({ state, send }) => {
  return html`
    <div class="p-4 bg-green-100 border rounded-md mb-2">
      <h3 class="text-lg font-bold">Shared Counter (XState)</h3>
      <p class="text-xl">Count: ${state.context.count}</p>
      <div class="mt-4 space-x-2">
        <button
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          @click=${() => send({ type: "DEC" })}
        >
          -
        </button>
        <button
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          @click=${() => send({ type: "INC" })}
        >
          +
        </button>
      </div>
    </div>
  `;
});

// Shared Display Component (XState)
shared("shared-display-xstate", ({ state }) => {
  return html`
    <div class="p-4 bg-blue-100 border rounded-md mb-2">
      <h3 class="text-lg font-bold text-blue-800">
        Shared State Display (XState)
      </h3>
      <p class="text-xl text-blue-700">Shared Count: ${state.context.count}</p>
    </div>
  `;
});

// Isolated Counter Component (XState)
isolated("another-counter-xstate", ({ state, send }) => {
  return html`
    <div class="p-4 bg-yellow-100 border rounded-md mb-2">
      <h3 class="text-lg font-bold text-yellow-800">
        Isolated Counter (XState)
      </h3>
      <p class="text-xl text-yellow-700">Count: ${state.context.count}</p>
      <div class="mt-4 space-x-2">
        <button
          class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          @click=${() => send({ type: "DEC" })}
        >
          -
        </button>
        <button
          class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          @click=${() => send({ type: "INC" })}
        >
          +
        </button>
      </div>
    </div>
  `;
});

isolated("gradient-tally", ({ state }) => {
  const { count } = state.context;

  return html`
    <style>
      .box {
        height: 1rem;
        width: 1rem;
        border-radius: 50px; /* rounded-full */
      }
    </style>
    <div
      class="box"
      style="
        background: linear-gradient(
          90deg,
          rgba(34, 197, 94, 1) 0%,
          rgba(59, 130, 246, ${(count + 1) / 10}) 100%
        );
      "
    ></div>
  `;
});

@Shared("advanced-shared-counter")
export class AdvancedSharedCounter {
  render({ state, send }: RenderArgs<typeof advancedMachine>) {
    const { count, darkMode } = state.context;
    const containerClasses = darkMode
      ? "p-4 bg-gray-800 text-white border rounded-md mb-2"
      : "p-4 bg-gray-100 text-black border rounded-md mb-2";

    return html`
      <div class=${containerClasses}>
        <h3 class="text-lg font-bold">Advanced Counter</h3>

        <!-- Display the count -->
        <p class="text-xl">Count: ${count}</p>

        <!-- Buttons -->
        <div class="mt-4 space-x-2">
          <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            @click=${() => {
              send({ type: "DEC" });
            }}
          >
            -
          </button>
          <button
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            @click=${() => {
              send({ type: "INC" });
            }}
          >
            +
          </button>
        </div>

        <!-- Dark Mode Toggle -->
        <div class="mt-4">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click=${() => {
              send({ type: "TOGGLE_DARK" });
            }}
          >
            Toggle Dark Mode
          </button>
        </div>

        <div
          class="mt-4 grid gap-2 justify-start"
          style="grid-template-columns: repeat(auto-fill, minmax(1rem, 1fr));grid-auto-flow: row;"
        >
          ${Array.from({ length: count }).map(
            () => html`<gradient-tally></gradient-tally>`
          )}
        </div>
      </div>
    `;
  }
}
