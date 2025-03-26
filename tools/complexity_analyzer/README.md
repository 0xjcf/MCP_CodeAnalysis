# Complexity Analyzer

A tool for analyzing code complexity in Rust projects. This tool calculates various complexity metrics including cyclomatic complexity, cognitive complexity, and Halstead metrics.

## Features

- Cyclomatic complexity analysis
- Cognitive complexity analysis
- Halstead metrics calculation
- Function-level analysis
- Directory-wide analysis
- JSON output format
- Configurable complexity thresholds

## Installation

```bash
cargo install --path tools/complexity_analyzer
```

## Usage

### Analyze a single file

```bash
complexity_analyzer -p path/to/file.rs -t 10
```

### Analyze a directory

```bash
complexity_analyzer -p path/to/directory -t 10
```

### Options

- `-p, --path`: Path to analyze (file or directory)
- `-t, --threshold`: Complexity threshold (default: 10)

## Output

The tool outputs JSON containing:

- File path
- Function analysis:
  - Name
  - Line number
  - Cyclomatic complexity
  - Cognitive complexity
  - Halstead metrics
  - Parameters
  - Return type
  - Async/unsafe/public flags
  - Lines of code
- Total metrics:
  - Cyclomatic complexity
  - Cognitive complexity
  - Halstead metrics
  - Lines of code
  - Threshold exceeded flag

## Example Output

```json
[
  {
    "path": "src/lib.rs",
    "functions": [
      {
        "name": "complex",
        "line_number": 2,
        "cyclomatic_complexity": 6,
        "cognitive_complexity": 9,
        "halstead_metrics": {
          "n1": 10,
          "n2": 5,
          "N1": 20,
          "N2": 10
        },
        "parameters": ["x: i32", "y: i32"],
        "return_type": "i32",
        "is_async": true,
        "is_unsafe": true,
        "is_public": true,
        "loc": 15
      }
    ],
    "total_metrics": {
      "cyclomatic": 6,
      "cognitive": 9,
      "halstead": {
        "n1": 10,
        "n2": 5,
        "N1": 20,
        "N2": 10
      },
      "loc": 15,
      "exceeds_threshold": false
    }
  }
]
```

## Development

### Building

```bash
cargo build
```

### Testing

```bash
cargo test
```

### Running

```bash
cargo run -- -p path/to/analyze -t 10
```

## License

MIT
