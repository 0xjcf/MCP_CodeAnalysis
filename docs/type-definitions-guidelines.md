# Type Definitions Guidelines

## Purpose

This document provides guidelines for handling type definitions in the MCP Code Analysis project, ensuring we properly leverage TypeScript's type system and follow best practices.

## Core Principles

1. **Prefer Implicit Types**: Let TypeScript infer types whenever possible
2. **Use Utility Types**: Leverage TypeScript's built-in utility types
3. **Avoid any/unknown**: Use specific types instead of any or unknown
4. **Minimize Type Casting**: Use proper type guards and narrowing instead
5. **Type Safety**: Maintain strict type safety throughout the codebase
6. **Documentation**: Document type decisions and rationale
7. **Consistency**: Follow consistent type definition patterns

## Type Definition Hierarchy

When adding new types, follow this hierarchy:

1. **Implicit Types**

   - Let TypeScript infer types from values
   - Use const assertions for literal types
   - Leverage type inference in function returns

2. **Utility Types**

   - Use built-in utility types (Pick, Omit, Partial, etc.)
   - Create custom utility types for common patterns
   - Leverage mapped and conditional types

3. **Dependency Types**

   - Use types directly from dependencies
   - Import and reuse existing type definitions
   - Extend dependency types when needed

4. **Project Types**
   - Create project-specific types only when necessary
   - Document why custom types are needed
   - Follow established naming conventions

## Implementation Guidelines

### 1. Implicit Types

```typescript
// BAD: Explicit type when not needed
const name: string = 'John';

// GOOD: Let TypeScript infer the type
const name = 'John';

// BAD: Explicit return type when obvious
function add(a: number, b: number): number {
  return a + b;
}

// GOOD: Let TypeScript infer return type
function add(a: number, b: number) {
  return a + b;
}
```

### 2. Utility Types

```typescript
// GOOD: Using utility types
type UserConfig = Pick<User, 'id' | 'name'>;
type OptionalUser = Partial<User>;
type ReadonlyUser = Readonly<User>;

// GOOD: Custom utility type
type WithTimestamp<T> = T & { timestamp: Date };

// BAD: Recreating utility type functionality
interface PartialUser {
  id?: string;
  name?: string;
  // ... manually listing all optional properties
}
```

### 3. Avoiding any/unknown

```typescript
// BAD: Using any
function processData(data: any) {
  // ...
}

// GOOD: Using specific type
function processData(data: UserData) {
  // ...
}

// BAD: Using unknown without type guard
function handleValue(value: unknown) {
  return value; // Unsafe
}

// GOOD: Using type guard
function handleValue(value: unknown) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  throw new Error('Invalid value type');
}
```

### 4. Type Guards and Narrowing

```typescript
// BAD: Type casting
const result = data as ResultType;

// GOOD: Type guard
function isResult(data: unknown): data is ResultType {
  return typeof data === 'object' && data !== null && 'status' in data && 'value' in data;
}

if (isResult(data)) {
  // Type is narrowed to ResultType
  return data.value;
}
```

### 5. Type Import Patterns

```typescript
// Import specific types
import { SpecificType } from 'dependency';

// Import type and value
import { Type, value } from 'dependency';

// Import type namespace
import type * as Types from 'dependency';
```

## Common Scenarios

### 1. Function Parameters and Returns

```typescript
// BAD: Unnecessary type annotations
function process<T>(data: T): T {
  return data;
}

// GOOD: Let TypeScript infer
function process<T>(data: T) {
  return data;
}

// BAD: Using any in generics
function processAny(data: any) {
  return data;
}

// GOOD: Using proper generic constraints
function process<T extends Record<string, unknown>>(data: T) {
  return data;
}
```

### 2. Object Types

```typescript
// BAD: Explicit interface when not needed
interface Point {
  x: number;
  y: number;
}

// GOOD: Type inference
const point = { x: 0, y: 0 };
type Point = typeof point;

// BAD: Using any for object properties
interface Config {
  [key: string]: any;
}

// GOOD: Using proper type constraints
interface Config {
  [key: string]: string | number | boolean;
}
```

## Type Definition Checklist

Before creating a new type:

- [ ] Can TypeScript infer this type?
- [ ] Can I use a utility type instead?
- [ ] Is there an existing type I can reuse?
- [ ] Do I need to create a new type?
- [ ] Can I avoid using any/unknown?
- [ ] Can I use type guards instead of casting?
- [ ] Document why new type is needed
- [ ] Follow naming conventions
- [ ] Add proper type documentation
- [ ] Consider type reusability

## Best Practices

1. **Type Inference**

   - Let TypeScript infer types when possible
   - Use const assertions for literal types
   - Leverage contextual typing

2. **Utility Types**

   - Use built-in utility types
   - Create custom utility types for patterns
   - Document utility type usage

3. **Type Safety**

   - Avoid any and unknown
   - Use proper type guards
   - Implement runtime type checking

4. **Type Organization**
   - Group related types
   - Use consistent naming
   - Maintain clear type hierarchies

## Common Pitfalls to Avoid

1. **Unnecessary Type Annotations**

   - Don't add types when TypeScript can infer them
   - Avoid redundant type information
   - Don't use explicit types for simple values

2. **Overuse of any/unknown**

   - Don't use any as a quick fix
   - Avoid unknown without proper type guards
   - Don't use type assertions to bypass type checking

3. **Excessive Type Casting**
   - Don't use type assertions as a primary solution
   - Avoid unsafe type casting
   - Use proper type guards instead

## Examples

### Good Practices

```typescript
// Using type inference
const user = { id: 1, name: 'John' };

// Using utility types
type UserPreview = Pick<User, 'id' | 'name'>;

// Using type guards
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data && 'name' in data;
}

// Using generics with constraints
function process<T extends Record<string, unknown>>(data: T) {
  return data;
}
```

### Bad Practices

```typescript
// Unnecessary type annotation
const count: number = 0;

// Using any
function process(data: any) {
  return data;
}

// Unsafe type casting
const result = data as ResultType;

// Redundant interface
interface Point {
  x: number;
  y: number;
}
// When const point = { x: 0, y: 0 } would suffice
```

## Type Definition Tools

1. **Type Exploration**

   - IDE type hints
   - TypeScript compiler
   - Dependency documentation

2. **Type Validation**

   - TypeScript compiler
   - Type checking tools
   - Runtime type checking

3. **Utility Types**
   - TypeScript built-in utilities
   - Custom utility type creation
   - Type composition tools

## References

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [@mcp/types Documentation](https://github.com/modelcontextprotocol/types)
- [Project Type Guidelines](link-to-project-guidelines)
