# XState Example with ignite-element

This example demonstrates how to use ignite-element with XState, lit-html, and TailwindCSS for styling.

---

## Features

- State management with XState, showcasing shared and isolated components.
- Unified API for accessing state values, with options to use `state` or `state.context`.
- Styling with TailwindCSS.
- Integration with ignite-element for seamless web component creation.

---

## Setup

### 1. Install Dependencies

Run the following command to install all necessary dependencies:

```bash
npm install
```

### 2. Run the Example

To start the development server:

```bash
npm run dev
```

#### Output

When running the example, you'll see:

- **Shared Counter Component**: A counter component using a shared global state.
- **Isolated Counter Component**: A counter component with isolated state for each instance.

---

## Styling with TailwindCSS

This example uses TailwindCSS for component styling. To apply global styles, use the `setGlobalStyles` function to reference the compiled Tailwind CSS file:

```typescript
import { setGlobalStyles } from "ignite-element";

setGlobalStyles("./dist/styles.css");
```

---

## ignite-element and XState

### Accessing State and Context in ignite-element

With the updated `XStateAdapter`, you can access state values directly from `state` or through `state.context`. This provides flexibility for different use cases:

- **Direct Access**: Access flattened `context` values directly from `state` (e.g., `state.count`).
- **Context Access**: Access the original `context` object via `state.context` for compatibility with XState conventions.

#### Example Usage with Decorators

```typescript
@Shared("counter-component")
export class CounterComponent {
  render({ state, send }: RenderArgs<typeof counterMachine>) {
    const { count } = state; // Direct access to count from state
    // const { count } = state.context; - Or access through context explicitly

    return html`
      <div class="p-4 bg-gray-100 border rounded-md">
        <h3 class="text-lg font-bold">Counter Component</h3>
        <p class="text-xl">Count: ${count}</p>
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
  }
}
```

### Setting Up ignite-element with XState

#### 1. Define a State Machine

Create an XState machine for managing the component's state:

```typescript
import { createMachine } from "xstate";

const counterMachine = createMachine({
  id: "counter",
  initial: "active",
  context: { count: 0 },
  states: {
    active: {
      on: {
        INC: { actions: "increment" },
        DEC: { actions: "decrement" },
      },
    },
  },
});
```

---

#### 2. Apply Global Styles

Add global styles for TailwindCSS using `setGlobalStyles`:

```typescript
import { setGlobalStyles } from "ignite-element";

setGlobalStyles("./dist/styles.css");
```

---

#### 3. Initialize ignite-element

Restructure `igniteCore` to export `shared` and `isolated` methods directly:

```typescript
import { igniteCore } from "ignite-element";
import counterMachine from "./counterMachine";

export const { shared, isolated } = igniteCore({
  adapter: "xstate",
  source: counterMachine,
});
```

---

#### 4. Define Components

##### Shared Counter

```typescript
shared("shared-counter", (state, send) => {
  return html`
    <div class="p-4 bg-gray-100 border rounded-md mb-2">
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
```

##### Isolated Counter

```typescript
isolated("isolated-counter", (state, send) => {
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
```

---

#### 5. Add Components to HTML

Use the custom elements in your HTML file:

```html
<shared-counter></shared-counter>
<isolated-counter></isolated-counter>
```
