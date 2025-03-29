# XState Task Manager Example

This example project demonstrates the use of ignite-element with XState, lit-html, and Tailwind CSS.

## Features

- XState state machine implementation
- Web Components using ignite-element
- Tailwind CSS styling
- MCP Code Analysis integration

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- MCP server running locally (see [MCP Core Documentation](../../packages/core/README.md))

### Installation

```bash
# Install dependencies
pnpm install

# Build CSS
pnpm build:css

# Start development server
pnpm dev
```

### Running Analysis

This project includes integration with the MCP Code Analysis framework. To analyze the code:

1. Ensure the MCP server is running (default: http://localhost:3000)

2. Run the analysis:

   ```bash
   # Run all analyzers
   pnpm analyze

   # Run specific analyzers
   pnpm analyze:xstate
   pnpm analyze:web-components
   pnpm analyze:metrics
   ```

The analysis will provide insights about:

- XState machine structure and transitions
- Web Components usage and patterns
- Code metrics and quality indicators

## Project Structure

```
task-manager/
├── src/
│   ├── taskManagerMachine.ts    # XState machine definition
│   ├── xstateExample.ts         # Example usage
│   └── styles.css               # Tailwind CSS
├── mcp-analysis.ts              # MCP analysis integration
└── package.json                 # Project configuration
```

## Analysis Results

The MCP analysis tools will provide:

1. **XState Analysis**:

   - State machine structure
   - Transitions and events
   - Guards and actions
   - Service integration

2. **Web Components Analysis**:

   - Component lifecycle
   - Shadow DOM usage
   - Property and event analysis
   - Performance metrics

3. **Code Metrics**:
   - Complexity analysis
   - Code quality indicators
   - Performance suggestions
   - Best practices recommendations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC

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
import { setGlobalStyles } from 'ignite-element';

setGlobalStyles('./dist/styles.css');
```

---

## ignite-element and XState

### Accessing State and Context in ignite-element

With the updated `XStateAdapter`, you can access state values directly from `state` or through `state.context`. This provides flexibility for different use cases:

- **Direct Access**: Access flattened `context` values directly from `state` (e.g., `state.count`).
- **Context Access**: Access the original `context` object via `state.context` for compatibility with XState conventions.

#### Example Usage with Decorators

```typescript
@Shared('counter-component')
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
            @click=${() => send({ type: 'DEC' })}
          >
            -
          </button>
          <button
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            @click=${() => send({ type: 'INC' })}
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
import { createMachine } from 'xstate';

const counterMachine = createMachine({
  id: 'counter',
  initial: 'active',
  context: { count: 0 },
  states: {
    active: {
      on: {
        INC: { actions: 'increment' },
        DEC: { actions: 'decrement' },
      },
    },
  },
});
```

---

#### 2. Apply Global Styles

Add global styles for TailwindCSS using `setGlobalStyles`:

```typescript
import { setGlobalStyles } from 'ignite-element';

setGlobalStyles('./dist/styles.css');
```

---

#### 3. Initialize ignite-element

Restructure `igniteCore` to export `shared` and `isolated` methods directly:

```typescript
import { igniteCore } from 'ignite-element';
import counterMachine from './counterMachine';

export const { shared, isolated } = igniteCore({
  adapter: 'xstate',
  source: counterMachine,
});
```

---

#### 4. Define Components

##### Shared Counter

```typescript
shared('shared-counter', (state, send) => {
  return html`
    <div class="p-4 bg-gray-100 border rounded-md mb-2">
      <h3 class="text-lg font-bold">Shared Counter (XState)</h3>
      <p class="text-xl">Count: ${state.context.count}</p>
      <div class="mt-4 space-x-2">
        <button
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          @click=${() => send({ type: 'DEC' })}
        >
          -
        </button>
        <button
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          @click=${() => send({ type: 'INC' })}
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
isolated('isolated-counter', (state, send) => {
  return html`
    <div class="p-4 bg-yellow-100 border rounded-md mb-2">
      <h3 class="text-lg font-bold text-yellow-800">Isolated Counter (XState)</h3>
      <p class="text-xl text-yellow-700">Count: ${state.context.count}</p>
      <div class="mt-4 space-x-2">
        <button
          class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          @click=${() => send({ type: 'DEC' })}
        >
          -
        </button>
        <button
          class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          @click=${() => send({ type: 'INC' })}
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
<shared-counter></shared-counter> <isolated-counter></isolated-counter>
```
