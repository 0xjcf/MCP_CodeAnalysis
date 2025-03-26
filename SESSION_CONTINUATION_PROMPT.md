# Session Continuation Prompt

To continue a session, simply run:

```bash
./tools/session-continuation.sh
```

This script will:

1. Back up and update session goals
2. Run complexity analysis
3. Update session goals with latest metrics
4. Generate knowledge graph (if available)
5. Update monetization analysis (if available)
6. Merge all contexts into a session prompt

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

## Code Complexity Analysis

{Load complexity_analysis.json and insert key metrics}

- Total Functions: [total_functions]
- High Complexity Functions: [high_complexity_functions_count]
- Average Cyclomatic Complexity: [avg_cyclomatic_complexity]
- Average Cognitive Complexity: [avg_cognitive_complexity]

### Top 5 Complex Functions:

1. [function1_name] (CC: [cyclomatic], Cog: [cognitive])
2. [function2_name] (CC: [cyclomatic], Cog: [cognitive])
3. [function3_name] (CC: [cyclomatic], Cog: [cognitive])
4. [function4_name] (CC: [cyclomatic], Cog: [cognitive])
5. [function5_name] (CC: [cyclomatic], Cog: [cognitive])

## Active Development

Currently working on:

- Component: [active_components[0].name]
- Status: [active_components[0].status]
- Progress: [active_components[0].completion_percentage]%

## Recent Changes

Last completed:

- Component: [recent_changes[0].component]
- Status: [recent_changes[0].status]
- Details: [recent_changes[0].details]

## Pending Tasks

Next priority:

- Task: [pending_tasks[0].task]
- Priority: [pending_tasks[0].priority]
- Dependencies: [pending_tasks[0].dependencies]

## Documentation Status

- Recently Updated: [updated_docs]
- Needs Attention: [needs_update]

## Development Environment

- Branch: [current_branch]
- Node Version: [environment.node_version]
- Workspace: [environment.workspace]

## Knowledge Graph Context

The following components and relationships are relevant to our current work:

1. [List relevant components from knowledge graph]
2. [List key relationships and dependencies]
3. [List any technical decisions or rationales]

## Monetization Status

Current tier implementation:

- Free Tier Features: [List active free features]
- Pro Tier Features: [List active pro features]
- Enterprise Features: [List active enterprise features]

## Goals for This Session

{Load session-goal.json and insert goals}

I'd like to:

1. [goal1_description] (Priority: [goal1_priority])
2. [goal2_description] (Priority: [goal2_priority])

Please help me continue development, taking into account the previous session's context and maintaining consistency with the established architecture and monetization strategy.

## Using the Complexity Analyzer

The complexity analyzer is a Rust-based tool that provides detailed code complexity metrics. Here are the available commands:

```bash
# Build the analyzer (only needed first time or after changes)
cd tools/complexity_analyzer
cargo build --release

# Basic usage
cargo run --release -- -p <directory> -f <format> -t <number>

# Example: Analyze entire src directory
cargo run --release -- -p ../../src -f json -o ../../complexity_analysis.json -t 10

# Example: Analyze specific directory with text output
cargo run --release -- -p ../../src/state -f text -o ../../state_complexity.txt -t 15

# Get help
cargo run -- --help
```

Available options:

- `-p`: Directory to analyze
- `-f`: Output format (json or text)
- `-o`: Output file path
- `-t`: Complexity threshold for highlighting functions

To use this prompt effectively:

1. **Before Starting a New Session**:

   ```bash
   # Create or update session goals
   if [ ! -f session-goal.json ]; then
       cp session-goal.json.template session-goal.json
   else
       cp session-goal.json session-goal.json.bak
   fi
   $EDITOR session-goal.json

   # Run complexity analysis
   cd tools/complexity_analyzer
   cargo run --release -- -p ../../src -f json -o ../../complexity_analysis.json -t 10
   cd ../..

   # Optional: Generate additional context if tools are available
   [ -f tools/knowledge_graph_generator.py ] && \
       python tools/knowledge_graph_generator.py --output knowledge_graph.json
   [ -d .cursor/rules/monetization_analysis ] && \
       python .cursor/rules/monetization_analysis/revenue_potential_analyzer.py --update
   [ -f tools/context_merger.py ] && \
       python tools/context_merger.py \
           --session-context end-of-session.json \
           --complexity-analysis complexity_analysis.json \
           --session-goals session-goal.json \
           $([ -f knowledge_graph.json ] && echo "--knowledge-graph knowledge_graph.json") \
           $([ -f monetization_analysis.json ] && echo "--monetization-status monetization_analysis.json") \
           --output session_prompt.md
   ```

2. **During the Session**:

   ```bash
   # Update session goals as tasks are completed
   $EDITOR session-goal.json

   # Run incremental complexity analysis on modified components
   cd tools/complexity_analyzer
   cargo run --release -- -p ../../src/component-name -f json \
       -o ../../complexity_component.json -t 10
   cd ../..
   ```

3. **At the End of the Session**:

   ```bash
   # Run final complexity analysis
   cd tools/complexity_analyzer
   cargo run --release -- -p ../../src -f json \
       -o ../../complexity_analysis_final.json -t 10
   cd ../..

   # Update end-of-session document
   if [ -f tools/session_context_generator.py ]; then
       python tools/session_context_generator.py --save end-of-session.json \
           --complexity-analysis complexity_analysis_final.json \
           --session-goals session-goal.json
   else
       echo "Session context generator not found, please update end-of-session.json manually"
       cp complexity_analysis_final.json end-of-session.json
   fi

   # Update AI context with latest information
   if [ -f tools/context_merger.py ]; then
       python tools/context_merger.py \
           --session-context end-of-session.json \
           --complexity-analysis complexity_analysis_final.json \
           --output ai-context.json
   fi
   ```

4. **Key Elements to Always Include**:

   - Current phase and focus from `session-goal.json`
   - Complexity analysis results from latest run
   - Active development status
   - Pending tasks and dependencies
   - Documentation needs
   - Environment details
   - Monetization context (if applicable)

5. **Optional Elements Based on Context**:
   - Performance metrics from complexity analysis
   - Test coverage statistics (if available)
   - User feedback or bug reports
   - External API status
   - Infrastructure changes

Example Usage:

```bash
# Quick session start
./tools/start-session.sh  # If available

# Manual session start
cp session-goal.json.template session-goal.json
$EDITOR session-goal.json
cd tools/complexity_analyzer && cargo run --release -- -p ../../src -f json \
    -o ../../complexity_analysis.json -t 10
```

This will set up your development environment with all necessary context from your previous session, making it easier to continue work effectively.

Note: Some tools mentioned in this prompt may not be available in your installation. The script handles these cases gracefully by skipping unavailable tools while still providing core functionality through the complexity analyzer.
