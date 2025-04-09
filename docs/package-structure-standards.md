# Package Structure Standards

This document outlines the standardized structure for all packages in the MCP Code Analysis project to ensure consistency, maintainability, and clarity across the codebase.

## Directory Structure

Each package should follow this standardized directory structure:

```
packages/[package-name]/
├── src/                  # Source code
│   ├── index.ts          # Main entry point
│   ├── types.ts          # Type definitions
│   ├── [feature].ts      # Feature-specific modules
│   └── [feature].test.ts # Tests for feature modules
├── __tests__/            # Integration tests
├── dist/                 # Compiled output (generated)
├── node_modules/         # Dependencies (generated)
├── .eslintrc.json        # ESLint configuration
├── package.json          # Package metadata and dependencies
├── README.md             # Package documentation
└── tsconfig.json         # TypeScript configuration
```

## File Naming Conventions

- Use kebab-case for directory names: `feature-name/`
- Use camelCase for file names: `featureName.ts`
- Use PascalCase for class and interface names: `FeatureName`
- Use camelCase for function and variable names: `featureName`

## Type Definitions

- Place all type definitions in `types.ts`
- Prefix interfaces with `I`: `IFeatureName`
- Use descriptive type names that reflect their purpose
- Group related types together
- Export all types that will be used by other packages

## Module Organization

- Each feature should be in its own module file
- Keep modules focused on a single responsibility
- Use index.ts to export public API
- Implement proper error handling in all modules
- Include JSDoc comments for public functions and classes

## Testing

- Place unit tests next to the files they test: `feature.test.ts`
- Place integration tests in the `__tests__` directory
- Follow the naming convention: `[feature].test.ts`
- Ensure tests cover all public API functionality
- Include edge case testing

## Documentation

- Each package must have a README.md with:
  - Package description
  - Installation instructions
  - Usage examples
  - API documentation
  - Dependencies
  - Development setup

## Dependencies

- Minimize external dependencies
- Use workspace dependencies when possible: `@mcp/core`
- Specify exact versions in package.json
- Document why each dependency is needed
- Use `@mcp/types` for shared type definitions across packages
- Extend base ESLint configuration from `@mcp/eslint-config`

## Configuration Files

- Extend base configurations from the project root
- Customize only what's necessary for the package
- Follow the project's ESLint and TypeScript standards
- Use `@mcp/eslint-config` as the base ESLint configuration
- Import shared types from `@mcp/types` package

## Best Practices

- Follow the Single Responsibility Principle
- Implement proper error handling
- Use TypeScript's strict mode
- Write self-documenting code
- Include appropriate comments for complex logic
- Ensure backward compatibility when making changes
- Follow the project's coding style guidelines

## Package-Specific Guidelines

### Core Package

- Contains fundamental functionality used by other packages
- Minimize dependencies on other packages
- Provide clear, stable APIs

### Feature Packages

- Focus on a specific feature or functionality
- Depend on core package for shared functionality
- Maintain clear boundaries with other packages

### Utility Packages

- Provide reusable utilities across the project
- Keep dependencies minimal
- Focus on performance and reusability

## Migration Plan

For existing packages that don't follow these standards:

1. Document the current structure
2. Create a migration plan
3. Refactor incrementally
4. Update documentation
5. Verify functionality after each step

## Enforcement

- Use ESLint to enforce coding standards
- Use TypeScript to enforce type safety
- Regular code reviews to ensure compliance
- Automated CI/CD checks for structure compliance
