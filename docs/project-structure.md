# Project Structure and Best Practices

## Directory Structure

```
MCP_CodeAnalysis/
├── packages/                 # Main packages
│   ├── core/                # Core analysis framework
│   ├── web-components/      # Web Components analyzer
│   ├── xstate/             # XState analyzer
│   ├── eslint-config/      # Shared ESLint configuration
│   ├── tsconfig/           # Shared TypeScript configuration
│   └── test-utils/         # Shared testing utilities
├── tools/                   # Development tools
│   └── complexity_analyzer/ # Rust-based complexity analyzer
├── docs/                    # Documentation
│   ├── archive/            # Archived documentation
│   └── templates/          # Documentation templates
├── templates/              # Project templates
│   ├── session/           # Session management templates
│   └── analysis/          # Analysis templates
├── data/                   # Data storage
├── bin/                    # Executable scripts
├── config/                 # Configuration files
└── dist/                   # Build outputs (gitignored)
```

## Root-Level Files

### Configuration Files (Keep at root)

- `.gitignore` - Git ignore rules
- `.prettierrc` - Prettier configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts
- `pnpm-workspace.yaml` - PNPM workspace configuration
- `vitest.config.ts` - Vitest configuration

### Documentation Files (Move to docs/)

- All `.md` files containing documentation
- Analysis reports
- Enhancement plans
- Client/SDK specifications

### Session/Template Files (Move to templates/)

- Session prompts
- Session goals
- End-of-session reports
- Analysis templates

### Development Tools (Move to tools/)

- Shell scripts
- Node.js utilities
- Python scripts
- Analysis tools

### Analysis Output Files (Gitignored)

- `ai-context.json`
- `monetization_analysis.json`
- `knowledge_graph.json`
- `complexity_analysis.json`

## Best Practices for New Features

### 1. Package Organization

- Create new packages in the `packages/` directory
- Follow the established package structure:
  ```
  packages/package-name/
  ├── src/           # Source code
  ├── tests/         # Test files
  ├── package.json   # Package configuration
  ├── tsconfig.json  # TypeScript configuration
  └── README.md      # Package documentation
  ```

### 2. Code Organization

- Keep related code together in appropriate directories
- Use clear, descriptive names for files and directories
- Follow the established naming conventions
- Maintain separation of concerns

### 3. Testing

- Write tests for all new features
- Place tests in the `tests/` directory
- Follow the established test patterns
- Maintain test coverage above 80%

### 4. Documentation

- Document all public APIs
- Include usage examples
- Keep README files up to date
- Document breaking changes

### 5. Dependencies

- Use workspace dependencies when possible
- Keep dependencies up to date
- Document dependency requirements
- Follow the established versioning strategy

### 6. Configuration

- Use shared configurations from `packages/eslint-config` and `packages/tsconfig`
- Follow the established configuration patterns
- Document configuration options
- Keep configuration files minimal

### 7. Analysis Tools

- Place analysis tools in the `tools/` directory
- Follow the established tool patterns
- Document tool usage and requirements
- Keep tools focused and maintainable

### 8. Templates

- Place templates in the `templates/` directory
- Follow the established template patterns
- Document template usage
- Keep templates up to date

### 9. Data Storage

- Place data files in the `data/` directory
- Follow the established data patterns
- Document data structures
- Keep data organized and clean

### 10. Build Outputs

- Place build outputs in the `dist/` directory
- Follow the established build patterns
- Document build requirements
- Keep build outputs clean and organized

## File Naming Conventions

### Source Files

- Use PascalCase for class names
- Use camelCase for function and variable names
- Use kebab-case for file names
- Use `.ts` extension for TypeScript files
- Use `.test.ts` for test files

### Documentation Files

- Use PascalCase for documentation files
- Use `.md` extension for Markdown files
- Use descriptive names that indicate content
- Include version numbers when applicable

### Configuration Files

- Use lowercase for configuration files
- Use appropriate extensions (`.json`, `.ts`, `.js`)
- Use descriptive names that indicate purpose
- Follow established naming patterns

### Template Files

- Use kebab-case for template files
- Use `.template` suffix for template files
- Use descriptive names that indicate purpose
- Follow established template patterns

## Directory Naming Conventions

### Main Directories

- Use lowercase for main directories
- Use kebab-case for multi-word directories
- Use descriptive names that indicate purpose
- Follow established directory patterns

### Package Directories

- Use kebab-case for package names
- Use descriptive names that indicate purpose
- Follow established package patterns
- Keep package names consistent

### Tool Directories

- Use kebab-case for tool names
- Use descriptive names that indicate purpose
- Follow established tool patterns
- Keep tool names consistent

### Documentation Directories

- Use lowercase for documentation directories
- Use descriptive names that indicate purpose
- Follow established documentation patterns
- Keep documentation organized

## Version Control

### Git Ignore Rules

- Ignore build outputs
- Ignore temporary files
- Ignore analysis outputs
- Ignore sensitive data
- Follow established ignore patterns

### Commit Messages

- Use clear, descriptive messages
- Follow established commit patterns
- Reference issues when applicable
- Keep commits focused and atomic

### Branching Strategy

- Use feature branches
- Follow established branch patterns
- Keep branches up to date
- Clean up merged branches

## Continuous Integration

### Build Process

- Use workspace scripts
- Follow established build patterns
- Document build requirements
- Keep builds clean and efficient

### Test Process

- Run tests on all changes
- Follow established test patterns
- Document test requirements
- Keep tests focused and efficient

### Deployment Process

- Use workspace scripts
- Follow established deployment patterns
- Document deployment requirements
- Keep deployments clean and efficient
