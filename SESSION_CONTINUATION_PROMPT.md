# Session Continuation Prompt

To continue a session, you have two options:

1. **Recommended Default**: Non-interactive mode (displays without vim):

```bash
EDITOR=cat ./tools/session_continuation.sh
```

2. Interactive mode (opens vim for editing):

```bash
./tools/session_continuation.sh
```

This script will:

1. Load context from `end-of-session.json`
2. Back up and update session goals
3. Run complexity analysis
4. Update session goals with latest metrics
5. Generate knowledge graph (if available)
6. Update monetization analysis (if available)
7. Merge all contexts into a session prompt

Important: After running the script, review and update your `session-goal.json` based on:

- Complexity analysis results in `complexity_analysis.json`
- Knowledge graph insights in `knowledge_graph.json` (if available)
- Monetization analysis in `monetization_analysis.json` (if available)

This ensures your session goals align with the current state of the codebase and any newly identified areas that need attention.

After updating the goals, you can start your session by saying "use the prompt in @SESSION_CONTINUATION_PROMPT.md".

## Project Context

{Load end-of-session.json and insert relevant details}

- Last Session: [last_session_date]
- Current Phase: [project_phase]
- Focus Area: [current_focus]

## Active Development

Currently working on:

- Component: [active_components[0].name]
- Status: [active_components[0].status]
- Progress: [active_components[0].completion_percentage]%
- Features Implemented: [active_components[0].details.features_implemented]
- Current Metrics: [active_components[0].details.current_metrics]
- Next Steps: [active_components[0].details.next_steps]

## Development Status

Completed:
[development_status.completed]

In Progress:
[development_status.in_progress]

Next Priorities:
[development_status.next_priorities]

## Documentation Status

Recently Updated:
[documentation.updated]

Needs Attention:
[documentation.needs_update]

## Goals for This Session

{Load session-goal.json and insert goals}

I'd like to:

1. [goal1_description] (Priority: [goal1_priority])
2. [goal2_description] (Priority: [goal2_priority])

Please help me continue development, taking into account:

1. The previous session's context from end-of-session.json
2. Current development status and metrics
3. Established architecture patterns
4. Current monetization strategy
5. Project phase requirements
6. Documentation needs

Focus areas:

1. Maintaining code quality and test coverage
2. Following established patterns
3. Updating relevant documentation
4. Considering monetization implications
5. Addressing technical debt
6. Improving test coverage

## Using the Complexity Analyzer

The complexity analyzer is a Rust-based tool that provides detailed code complexity metrics. Here are the available commands:

```bash
# Build the analyzer (only needed first time or after changes)
cd tools/complexity_analyzer
cargo build --release

# Basic usage
cargo run -- -p <directory> -f <format> -t <number>

# Example: Analyze entire src directory
cargo run -- -p ../../src -f json -o ../../complexity_analysis.json -t 10

# Example: Analyze specific directory with text output
cargo run -- -p ../../src/state -f text -o ../../state_complexity.txt -t 15

# Get help
cargo run -- --help
```

Available options:

- `-p`: Directory to analyze
- `-f`: Output format (json or text)
- `-o`: Output file path
- `-t`: Complexity threshold for highlighting functions

## Session Management

To effectively manage your development session:

1. **Before Starting**:

   ```bash
   # Run the session continuation script
   ./tools/session-continuation.sh

   # Review and update session goals
   $EDITOR session-goal.json
   ```

2. **During Development**:

   ```bash
   # Update session goals as tasks are completed
   $EDITOR session-goal.json

   # Run incremental complexity analysis
   cd tools/complexity_analyzer
   cargo run -- -p ../../src/component-name -f json \
       -o ../../complexity_component.json -t 10
   cd ../..
   ```

3. **At Session End**:

   ```bash
   # Run final complexity analysis
   cd tools/complexity_analyzer
   cargo run -- -p ../../src -f json \
       -o ../../complexity_analysis_final.json -t 10
   cd ../..

   # Update session context
   python tools/session_manager.py save-context
   ```

## Notes

- The session continuation script creates backups of existing files
- All analysis results are stored in JSON format for easy parsing
- The context merger preserves previous session information
- AI context is automatically updated during session continuation
- End-of-session data is preserved between sessions
- Focus on testing highest complexity functions first
- Consider extracting common functionality
- Property-based testing framework in place
- Edge case handling significantly improved reliability
