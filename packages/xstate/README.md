# @mcp/xstate

XState analyzer for state machine analysis in the MCP Code Analysis framework.

## Features

- Analyzes XState state machines for complexity and structure
- Identifies states, transitions, and services
- Calculates performance metrics and complexity scores
- Provides detailed analysis of guards and actions
- Supports both simple and complex state machines

## Installation

```bash
npm install @mcp/xstate
```

## Usage

```typescript
import { XStateAnalyzer } from '@mcp/xstate';

const analyzer = new XStateAnalyzer({
  strict: true,
  verbose: false,
  timeout: 5000,
});

const result = await analyzer.analyze(sourceCode);
```

## Analysis Results

The analyzer provides detailed information about the state machine:

```typescript
interface XStateAnalysisData {
  states: string[]; // List of all states
  transitions: Array<{
    // List of all transitions
    from: string; // Source state
    to: string; // Target state
    event: string; // Triggering event
    guards?: string[]; // Optional guards
    actions?: string[]; // Optional actions
  }>;
  services: Array<{
    // List of all services
    name: string; // Service name
    type: string; // Service type (internal/external)
    implementation?: string; // Implementation details
  }>;
  guards: Array<{
    // List of all guards
    name: string; // Guard name
    implementation?: string; // Implementation details
  }>;
  actions: Array<{
    // List of all actions
    name: string; // Action name
    implementation?: string; // Implementation details
  }>;
  performance: {
    // Performance metrics
    stateCount: number; // Total number of states
    transitionCount: number; // Total number of transitions
    serviceCount: number; // Total number of services
    complexity: 'low' | 'medium' | 'high'; // Complexity score
  };
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## License

MIT
