# Complexity Analyzer Documentation

## Overview

The Complexity Analyzer is a Rust-based tool that provides detailed code complexity metrics for your codebase. It analyzes cyclomatic complexity, cognitive complexity, and Halstead metrics to help identify areas that may need refactoring.

## Installation

### Prerequisites

- Rust and Cargo installed (version 1.70.0 or later)
- Python 3.8 or later (for integration scripts)

### Building the Analyzer

```bash
# Navigate to the complexity analyzer directory
cd tools/complexity_analyzer

# Build the analyzer in release mode
cargo build --release
```

## Usage

### Basic Usage

```bash
# Basic usage with default options
cargo run --release -- -p <directory> -f <format> -t <threshold>

# Example: Analyze entire src directory
cargo run --release -- -p ../../src -f json -o ../../complexity_analysis.json -t 10

# Example: Analyze specific directory with text output
cargo run --release -- -p ../../src/state -f text -o ../../state_complexity.txt -t 15
```

### Command Line Options

- `-p, --path`: Directory to analyze (required)
- `-f, --format`: Output format (json or text, default: json)
- `-o, --output`: Output file path (default: stdout)
- `-t, --threshold`: Complexity threshold for highlighting functions (default: 10)
- `--help`: Show help message

## Configuration

### Output Formats

#### JSON Format

```json
{
  "files": [
    {
      "path": "src/example.rs",
      "functions": [
        {
          "name": "process_data",
          "cyclomatic_complexity": 8,
          "cognitive_complexity": 12,
          "halstead_metrics": {
            "vocabulary": 50,
            "volume": 200,
            "difficulty": 15,
            "effort": 3000
          }
        }
      ],
      "metrics": {
        "total_cyclomatic_complexity": 25,
        "total_cognitive_complexity": 35,
        "high_complexity_functions": 2
      }
    }
  ],
  "summary": {
    "total_files": 10,
    "total_cyclomatic_complexity": 150,
    "total_cognitive_complexity": 180,
    "high_complexity_functions": 5
  }
}
```

#### Text Format

```
File: src/example.rs
Function: process_data
  Cyclomatic Complexity: 8
  Cognitive Complexity: 12
  Halstead Metrics:
    Vocabulary: 50
    Volume: 200
    Difficulty: 15
    Effort: 3000

Summary:
  Total Files: 10
  Total Cyclomatic Complexity: 150
  Total Cognitive Complexity: 180
  High Complexity Functions: 5
```

## Integration

### Session Management

The complexity analyzer is integrated with the session management system:

```bash
# Run analysis as part of session continuation
./tools/session_continuation.sh

# Run standalone analysis
cd tools/complexity_analyzer
cargo run --release -- -p ../../src -f json -o ../../complexity_analysis.json -t 10
```

### CI/CD Integration

Add the following to your CI pipeline:

```yaml
- name: Run Complexity Analysis
  run: |
    cd tools/complexity_analyzer
    cargo run --release -- -p ../../src -f json -o ../../complexity_analysis.json -t 10
```

## Best Practices

1. **Regular Analysis**

   - Run analysis before major refactoring
   - Include in CI/CD pipeline
   - Review results during code reviews

2. **Threshold Guidelines**

   - Cyclomatic Complexity: Keep under 10
   - Cognitive Complexity: Keep under 15
   - High complexity functions: Consider refactoring

3. **Output Management**
   - Store historical results for trend analysis
   - Use JSON format for programmatic processing
   - Use text format for human readability

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Ensure Rust is up to date
   - Check for missing dependencies
   - Verify Cargo.toml configuration

2. **Analysis Errors**

   - Check file permissions
   - Verify directory structure
   - Ensure sufficient memory

3. **Output Issues**
   - Verify output directory exists
   - Check file permissions
   - Ensure sufficient disk space

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributing to the complexity analyzer.
