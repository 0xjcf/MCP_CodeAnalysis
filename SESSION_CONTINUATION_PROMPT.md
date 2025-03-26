# Session Continuation Prompt

I'm continuing work on the MCP Code Analysis project. Here's the context from my previous session:

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

````

To use this prompt effectively:

1. **Before Starting a New Session**:

   ```bash
   # Update session goals
   cp session-goal.json session-goal.json.template
   vim session-goal.json  # Edit with current session goals

   # Run complexity analysis on key components and save to JSON
   cd tools/complexity_analyzer
   cargo run -- -p ../../src -f json -o ../../complexity_analysis.json -t 10

   # Generate updated knowledge graph
   python tools/knowledge_graph_generator.py --output knowledge_graph.json

   # Update monetization analysis
   python .cursor/rules/monetization_analysis/revenue_potential_analyzer.py --update

   # Merge contexts
   python tools/context_merger.py \
     --session-context end-of-session.json \
     --complexity-analysis complexity_analysis.json \
     --session-goals session-goal.json \
     --knowledge-graph knowledge_graph.json \
     --monetization-status monetization_analysis.json \
     --output session_prompt.md
````

2. **During the Session**:

   ```bash
   # Update session goals as tasks are completed
   vim session-goal.json  # Update status of completed goals

   # Run incremental complexity analysis on modified components
   cd tools/complexity_analyzer
   cargo run -- -p ../../src/component-name -f json -o ../../complexity_component.json -t 10
   ```

3. **At the End of the Session**:

   ```bash
   # Run final complexity analysis to measure improvements
   cd tools/complexity_analyzer
   cargo run -- -p ../../src -f json -o ../../complexity_analysis.json -t 10

   # Update end-of-session document
   python tools/session_context_generator.py --save end-of-session.json \
     --complexity-analysis complexity_analysis.json \
     --session-goals session-goal.json

   # Update AI context with latest information
   python tools/context_merger.py \
     --session-context end-of-session.json \
     --complexity-analysis complexity_analysis.json \
     --output ai-context.json
   ```

4. **Key Elements to Always Include**:

   - Current phase and focus
   - Complexity analysis results
   - Active development status
   - Pending tasks and dependencies
   - Documentation needs
   - Environment details
   - Monetization context

5. **Optional Elements Based on Context**:
   - Performance metrics
   - Test coverage statistics
   - User feedback or bug reports
   - External API status
   - Infrastructure changes

Example Usage:

```bash
# At the end of each session
python tools/session_context_generator.py --save end-of-session.json

# At the start of new session
python tools/session_context_generator.py --load end-of-session.json --format prompt
```

This will generate a formatted prompt with all the necessary context from your previous session, making it easier for the AI to understand the current state of the project and provide more relevant assistance.
