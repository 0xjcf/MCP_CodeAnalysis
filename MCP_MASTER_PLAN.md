# MCP Code Analysis Master Plan

## Overview

This document outlines the master plan for the MCP Code Analysis project, including components, workflows, and integration points.

## Components

### 1. Core SDK

- TypeScript-based SDK for Model Context Protocol
- Stateful tool execution framework
- Session management with Redis and in-memory stores

### 2. Analysis Tools

- **Complexity Analyzer** (Rust): Analyzes code complexity metrics
  - Cyclomatic complexity: Measures the number of independent paths through code
  - Cognitive complexity: Measures how difficult code is to understand
  - Halstead metrics: Measures vocabulary, volume, difficulty, and effort
  - File and directory analysis with recursive scanning
  - JSON/Text output formats with threshold filtering
  - Comprehensive test suite including edge cases
  - Property-based testing for robustness
  - Robust Unicode handling for international code
  - Ability to save analysis results to files

### 3. Frontend Components

- Web dashboard for viewing analysis results
- Integration with VS Code extension

## Workflows

### Session Management

- Use `session-goal.json` to track session objectives
- Start each session by updating the session goal file
- During the session, record progress metrics
- At the end of the session, update `end-of-session.json` with results

### Code Analysis Workflow

1. Run complexity analysis on codebase
   ```
   cd tools/complexity_analyzer
   cargo run -- -p ../../src -f json -o ../../complexity_analysis.json -t 10
   ```
2. Save results to JSON files
3. Include analysis in context for AI assistants
4. Make refactoring recommendations based on complexity metrics

## Integration Points

### AI Context Integration

- Include complexity analysis in `ai-context.json`
- Use analysis results to guide AI assistance
- Prioritize complex functions for refactoring

### VS Code Extension

- Display complexity metrics in editor
- Highlight high-complexity areas
- Suggest refactoring opportunities

## Development Guidelines

### Session Structure

1. **Session Start**

   - Create/update `session-goal.json`
   - Run initial complexity analysis to establish baseline

2. **During Session**

   - Follow tasks defined in session goals
   - Track progress against goals

3. **Session End**
   - Update `end-of-session.json` with results
   - Run final complexity analysis to measure improvements
   - Include analysis in `ai-context.json` for next session

## Refactoring Guidelines for High-Complexity Functions

Functions with high complexity metrics should be refactored following these principles:

1. **Extract Method**: Break down large functions into smaller, focused sub-functions
2. **Simplify Conditionals**: Replace complex nested conditions with early returns or guard clauses
3. **Replace Nested Conditionals**: Use polymorphism or strategy pattern where appropriate
4. **Reduce Cognitive Load**: Simplify logical expressions and break complex calculations into steps
5. **Improve Naming**: Use clear, descriptive names that explain purpose and intent

### Complexity Thresholds

| Metric                | Low  | Medium   | High      | Very High |
| --------------------- | ---- | -------- | --------- | --------- |
| Cyclomatic Complexity | 1-5  | 6-10     | 11-15     | 16+       |
| Cognitive Complexity  | 1-5  | 6-15     | 16-30     | 31+       |
| Halstead Effort       | <250 | 250-1000 | 1001-3000 | 3001+     |

## Roadmap

### Phase 1: Foundation

- ✅ Core SDK implementation
- ✅ Redis and in-memory session stores
- ✅ Complexity analyzer tool
- ✅ Edge case test coverage

### Phase 2: Integration

- ✅ Refactoring guidelines
- 🔄 Property-based testing
- AI context integration
- VS Code extension
- Web dashboard prototype

### Phase 3: Expansion

- Additional analysis tools
- Performance optimization
- Multi-language support
