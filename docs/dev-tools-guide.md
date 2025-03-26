# Developer Tools Guide

This guide explains how to leverage the MCP server's developer tools to enhance your AI-assisted development workflow.

## Overview

The Developer Tools feature provides specialized tools for developers working with this codebase. These tools are designed to enhance developer productivity by providing quick access to common tasks, code insights, and documentation.

## AI Context Generation

The AI Context Client (`tools/ai-context-client.js`) provides a unified interface for generating rich context for AI interactions. It supports both HTTP and MCP protocols, and includes code analysis and metrics.

### Usage

```bash
node tools/ai-context-client.js --task="Your task description" [options]
```

### Options

- `--task, -t`: Task description (required)
- `--files, -f`: File patterns to analyze (e.g., "src/\*_/_.ts")
- `--search, -s`: Search term to find in code
- `--output, -o`: Output file path (default: ai-context.json)
- `--session-id, -i`: Session ID for context tracking
- `--protocol, -p`: Protocol to use (mcp or http, default: mcp)
- `--server, -S`: Server URL for HTTP protocol
- `--metrics, -m`: Metrics to calculate (default: complexity,maintainability)
- `--verbose, -v`: Enable verbose output

### Example

```bash
# Generate context for implementing a new feature
node tools/ai-context-client.js \
  --task="Implement user authentication" \
  --files="src/auth/**/*.ts" \
  --search="login" \
  --metrics="complexity,maintainability,readability"
```

### Output Format

The generated context includes:

```json
{
  "task": "Task description",
  "timestamp": "ISO timestamp",
  "sessionId": "unique-session-id",
  "projectInfo": {
    "name": "Project name",
    "version": "Project version",
    "dependencies": {}
  },
  "codeSearchResults": {
    "resultsCount": 10,
    "matches": []
  },
  "relevantFiles": [
    {
      "path": "file path",
      "totalLines": 100,
      "content": "file content"
    }
  ],
  "folderStructure": {
    "count": 50,
    "directories": []
  },
  "metrics": {
    "file-path": {
      "complexity": {
        "cyclomatic": 5,
        "cognitive": 10,
        "maintainability": 85
      },
      "quality": {
        "readability": 90,
        "maintainability": 85,
        "complexity": 5,
        "issues": []
      }
    }
  }
}
```

## Available Tools

### `search-code`

Search for specific code patterns across the repository.

**Parameters:**

- `query` (string): The search query to find code in the repository
- `filePattern` (string, optional): Optional file pattern to limit search (e.g., '\*.ts')
- `maxResults` (number, default: 10): Maximum number of results to return

**Example:**

```javascript
const results = await client.executeTool("search-code", {
  query: "registerFeatures",
  filePattern: "*.ts",
  maxResults: 5,
});
```

### `project-info`

Get information about the current project, including package details, git status, and file statistics.

**Parameters:** None

**Example:**

```javascript
const info = await client.executeTool("project-info", {});
```

### `get-file`

Retrieve the contents of a specific file, with optional line range selection.

**Parameters:**

- `path` (string): Relative path to the file
- `startLine` (number, optional): Starting line number (1-based)
- `endLine` (number, optional): Ending line number (1-based)

**Example:**

```javascript
const fileContent = await client.executeTool("get-file", {
  path: "src/server.ts",
  startLine: 10,
  endLine: 20,
});
```

### `calculate-metrics`

Calculate code metrics for a file.

**Parameters:**

- `filePath` (string): Path to the file
- `metrics` (array): Metrics to calculate (complexity, maintainability, readability)

**Example:**

```javascript
const metrics = await client.executeTool("calculate-metrics", {
  filePath: "src/features/auth.ts",
  metrics: ["complexity", "maintainability"],
});
```

### `folder-structure`

Get the directory structure of a specified folder.

**Parameters:**

- `path` (string, default: "."): Relative path to the directory
- `depth` (number, default: 2): Depth of folders to show

**Example:**

```javascript
const structure = await client.executeTool("folder-structure", {
  path: "src/features",
  depth: 3,
});
```

## Using with AI Assistants

These tools are particularly useful when working with AI assistants to improve their understanding of your codebase. Here are some common scenarios:

### Helping AIs Understand Your Codebase

When working with an AI assistant, you can instruct it to use the MCP tools to better understand your codebase:

```
"Please use the MCP 'project-info' tool to understand the project structure,
then use 'search-code' to find implementations related to the feature I'm working on."
```

### Context Sharing Between Sessions

Combined with the Session Manager tools, you can maintain context across multiple AI interactions:

1. Create a session for a specific development task
2. Use dev tools to add code context to the session
3. Reference the session in future AI interactions

Example session creation:

```javascript
const session = await client.executeTool("create-session", {
  sessionId: "dev-" + Date.now(),
  metadata: {
    purpose: "Development assistance",
    features: ["dev-tools"],
  },
});
```

### Code Quality Analysis

The AI Context Client includes code quality metrics that help AI assistants understand:

- Code complexity (cyclomatic and cognitive)
- Maintainability scores
- Readability metrics
- Potential issues and improvements

Use these metrics to guide AI suggestions and improvements:

```bash
# Generate context with detailed metrics
node tools/ai-context-client.js \
  --task="Review and improve code quality" \
  --files="src/**/*.ts" \
  --metrics="complexity,maintainability,readability"
```

## Best Practices

1. **Session Management**

   - Create new sessions for distinct tasks
   - Use meaningful session IDs
   - Include relevant metadata

2. **File Selection**

   - Use specific file patterns to focus analysis
   - Include related files for better context
   - Consider excluding generated files

3. **Metrics Usage**

   - Start with basic metrics for quick analysis
   - Add detailed metrics for deeper insights
   - Use metrics to guide improvements

4. **Context Generation**
   - Keep context focused and relevant
   - Include necessary project information
   - Use search terms to find related code

## Extending the Tools

If you need additional developer tools, you can extend the functionality by modifying `src/features/dev-tools/index.ts` and adding new tools following the existing patterns.
