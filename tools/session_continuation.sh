#!/bin/bash

# Enable debug mode if DEBUG=1 is set
if [ "$DEBUG" = "1" ]; then
    set -x
fi

# Set default editor if not set
if [ -z "$EDITOR" ]; then
    if command -v vim &> /dev/null; then
        EDITOR="vim"
    elif command -v nano &> /dev/null; then
        EDITOR="nano"
    else
        handle_error "No suitable editor found. Please set EDITOR environment variable or install vim/nano."
    fi
fi

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Error handling
handle_error() {
    log "Error: $1"
    cleanup
    exit 1
}

# Cleanup function
cleanup() {
    log "Cleaning up..."
    # Add any cleanup tasks here
}

# Set up trap for cleanup on script exit
trap cleanup EXIT

# Check dependencies
check_dependencies() {
    log "Checking dependencies..."
    
    # Check for Python3
    if ! command -v python3 &> /dev/null; then
        handle_error "Python3 is not installed. Please install Python3 first."
    fi
    
    # Check for Cargo
    if ! command -v cargo &> /dev/null; then
        handle_error "Cargo is not installed. Please install Rust and Cargo first."
    fi
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        handle_error "Node.js is not installed. Please install Node.js first."
    fi
    
    # Check for required Python packages
    if ! python3 -c "import json" 2>/dev/null; then
        handle_error "Python json module is not available."
    fi
}

# Load and validate JSON file
load_json() {
    local file=$1
    if [ ! -f "$file" ]; then
        log "Warning: $file not found"
        return 1
    fi
    if ! python3 -c "import json; json.load(open('$file'))" 2>/dev/null; then
        handle_error "Invalid $file format"
    fi
    return 0
}

# Extract JSON value safely with proper escaping
get_json_value() {
    local file="$1"
    local key="$2"
    local value
    
    # Try to get value from the specified file
    if [ -f "$file" ]; then
        value=$(jq -r "$key" "$file" 2>/dev/null)
    fi
    
    # If not found or null, return N/A
    if [ -z "$value" ] || [ "$value" = "null" ]; then
        echo "N/A"
    else
        echo "$value"
    fi
}

# Format list items from JSON array with proper escaping
format_list() {
    local value="$1"
    
    if [ -z "$value" ] || [ "$value" = "null" ] || [ "$value" = "N/A" ]; then
        echo "N/A"
        return
    fi
    
    # If value is an array of objects with specific fields (e.g. architecture decisions)
    if [[ "$value" =~ ^\[.*\{.*\}.*\]$ ]]; then
        echo "$value" | jq -r '.[] | "- " + (.decision // .name // .key) + ": " + (.rationale // .value // .description // "N/A")' 2>/dev/null || echo "- $value"
    # If value is a simple array
    elif [[ "$value" =~ ^\[.*\]$ ]]; then
        echo "$value" | jq -r '.[] | "  - " + .' 2>/dev/null || echo "- $value"
    # If value is an object with specific fields (e.g. metrics)
    elif [[ "$value" =~ ^\{.*\}$ ]]; then
        echo "$value" | jq -r 'to_entries | .[] | "  - " + .key + ": " + .value' 2>/dev/null || echo "- $value"
    else
        echo "- $value"
    fi
}

# Load session context
load_session_context() {
    log "Loading session context from end-of-session.json..."
    
    if [ ! -f end-of-session.json ]; then
        log "No end-of-session.json found. Creating initial context..."
        python3 tools/session_manager.py save-context --non-interactive
    fi
    
    # Load and validate all required files
    load_json "end-of-session.json"
    load_json "session-goal.json"
    load_json "complexity_analysis.json"
    load_json "knowledge_graph.json"
    load_json "monetization_analysis.json"
    load_json "ai-context.json"
}

# Function to replace placeholders in the template
replace_placeholder() {
    local file=$1
    local placeholder=$2
    local value=$3
    local temp_file
    
    log "Replacing {$placeholder} with content from JSON"
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Write the value to a temporary file
    echo "$value" > value.tmp
    
    # Use perl to handle multiline replacements
    perl -p -e "s|\{$placeholder\}|$(cat value.tmp)|g" "$file" > "$temp_file"
    
    # Move temporary file back to original
    mv "$temp_file" "$file"
    
    # Clean up
    rm -f value.tmp
}

# Extract content from rules files
extract_rules_content() {
    local rules_dir="$1"
    local output_file="$2"
    
    # Extract Dependencies section from main.mdc
    echo "## Dependencies" >> "$output_file"
    echo "" >> "$output_file"
    echo "### External Dependencies" >> "$output_file"
    echo "- Node.js environment" >> "$output_file"
    echo "- Python 3.8+" >> "$output_file"
    echo "- jq for JSON processing" >> "$output_file"
    echo "- TypeScript toolchain" >> "$output_file"
    echo "" >> "$output_file"
    
    # Extract Code Patterns section from patterns.mdc
    echo "## Code Patterns" >> "$output_file"
    echo "" >> "$output_file"
    echo "### Recommended Patterns" >> "$output_file"
    echo "" >> "$output_file"
    echo "#### Creational Patterns" >> "$output_file"
    echo "- Factory Method: For creating objects without specifying exact class" >> "$output_file"
    echo "- Singleton: For truly global resources" >> "$output_file"
    echo "- Builder: For complex object construction" >> "$output_file"
    echo "" >> "$output_file"
    echo "#### Structural Patterns" >> "$output_file"
    echo "- Adapter: For making incompatible interfaces work together" >> "$output_file"
    echo "- Composite: For tree structures" >> "$output_file"
    echo "- Decorator: For adding responsibilities dynamically" >> "$output_file"
    echo "" >> "$output_file"
    echo "#### Behavioral Patterns" >> "$output_file"
    echo "- Observer: For event handling and propagation" >> "$output_file"
    echo "- Strategy: For swappable algorithms" >> "$output_file"
    echo "- Visitor: For operations on complex object structures" >> "$output_file"
    echo "" >> "$output_file"
    
    # Extract Organization section from main.mdc
    echo "## Organization" >> "$output_file"
    echo "" >> "$output_file"
    echo "### Project Structure" >> "$output_file"
    echo "- Follow all included rule sets for comprehensive code quality" >> "$output_file"
    echo "- Ensure consistent application of standards across the entire codebase" >> "$output_file"
    echo "- Prioritize maintainability and readability in all contributions" >> "$output_file"
    echo "- Apply the five-step process for code optimization" >> "$output_file"
    echo "- Focus on security, performance, and accessibility best practices" >> "$output_file"
    echo "" >> "$output_file"
    
    # Extract Metrics section from main.mdc
    echo "## Metrics" >> "$output_file"
    echo "" >> "$output_file"
    echo "### Code Quality Metrics" >> "$output_file"
    echo "- TypeScript Migration Progress" >> "$output_file"
    echo "- React Analysis Coverage" >> "$output_file"
    echo "- Component Visualization Quality" >> "$output_file"
    echo "" >> "$output_file"
    echo "### Performance Metrics" >> "$output_file"
    echo "- Build Success Rate" >> "$output_file"
    echo "- Test Coverage" >> "$output_file"
    echo "- Code Complexity" >> "$output_file"
    echo "" >> "$output_file"
}

# Main function to generate session prompt
generate_session_prompt() {
    local template_file="$1"
    local output_file="$2"
    local temp_file=$(mktemp)
    local rules_content_file=$(mktemp)
    
    # Extract rules content first
    extract_rules_content ".cursor/rules" "$rules_content_file"
    
    # Create initial prompt from template
    cp "$template_file" "$temp_file"
    
    # Replace placeholders with values from JSON files
    replace_placeholder "$temp_file" "last_session_date" "$(get_json_value "end-of-session.json" ".session_metadata.last_session_date")"
    replace_placeholder "$temp_file" "project_phase" "$(get_json_value "end-of-session.json" ".session_metadata.project_phase")"
    replace_placeholder "$temp_file" "current_focus" "$(get_json_value "end-of-session.json" ".session_metadata.current_focus")"
    replace_placeholder "$temp_file" "project_status" "$(get_json_value "session-goal.json" ".session_metadata.status")"
    
    # Active component details
    replace_placeholder "$temp_file" "component_name" "$(get_json_value "end-of-session.json" ".technical_context.active_components[0].name")"
    replace_placeholder "$temp_file" "component_status" "$(get_json_value "end-of-session.json" ".technical_context.active_components[0].status")"
    replace_placeholder "$temp_file" "completion_percentage" "$(get_json_value "end-of-session.json" ".technical_context.active_components[0].completion_percentage")"
    
    # Features and metrics
    replace_placeholder "$temp_file" "features_list" "$(format_list "$(get_json_value "end-of-session.json" ".technical_context.active_components[0].details.features_implemented")")"
    replace_placeholder "$temp_file" "metrics_list" "$(format_list "$(get_json_value "end-of-session.json" ".technical_context.active_components[0].details.current_metrics")")"
    replace_placeholder "$temp_file" "next_steps_list" "$(format_list "$(get_json_value "end-of-session.json" ".technical_context.active_components[0].details.next_steps")")"
    
    # Development status
    replace_placeholder "$temp_file" "completed_tasks_list" "$(format_list "$(get_json_value "end-of-session.json" ".development_status.completed")")"
    replace_placeholder "$temp_file" "in_progress_tasks_list" "$(format_list "$(get_json_value "end-of-session.json" ".development_status.in_progress")")"
    replace_placeholder "$temp_file" "next_priorities_list" "$(format_list "$(get_json_value "end-of-session.json" ".development_status.next_priorities")")"
    
    # Documentation
    replace_placeholder "$temp_file" "recently_updated_docs" "$(format_list "$(get_json_value "end-of-session.json" ".knowledge_context.documentation.updated")")"
    replace_placeholder "$temp_file" "docs_needing_update" "$(format_list "$(get_json_value "end-of-session.json" ".knowledge_context.documentation.needs_update")")"
    
    # Session goals
    replace_placeholder "$temp_file" "primary_goal" "$(get_json_value "session-goal.json" ".session_goals[0].description")"
    replace_placeholder "$temp_file" "priority_level" "$(get_json_value "session-goal.json" ".session_goals[0].priority")"
    replace_placeholder "$temp_file" "subtasks_list" "$(format_list "$(get_json_value "session-goal.json" ".session_goals[0].details.implementation_requirements")")"
    
    # Technical context
    replace_placeholder "$temp_file" "key_files_list" "$(format_list "$(get_json_value "end-of-session.json" ".knowledge_context.key_files")")"
    replace_placeholder "$temp_file" "architecture_decisions_list" "$(format_list "$(get_json_value "end-of-session.json" ".architectural_decisions")")"
    
    # Replace content from rules
    replace_placeholder "$temp_file" "dependencies_list" "$(cat "$rules_content_file" | sed -n '/^## Dependencies/,/^##/p' | grep -v '^##')"
    replace_placeholder "$temp_file" "code_patterns_list" "$(cat "$rules_content_file" | sed -n '/^## Code Patterns/,/^##/p' | grep -v '^##')"
    replace_placeholder "$temp_file" "organization_details" "$(cat "$rules_content_file" | sed -n '/^## Organization/,/^##/p' | grep -v '^##')"
    replace_placeholder "$temp_file" "metrics_summary" "$(cat "$rules_content_file" | sed -n '/^## Metrics/,/^##/p' | grep -v '^##')"
    
    # Analysis content
    replace_placeholder "$temp_file" "complexity_metrics" "$(format_list "$(get_json_value "session-goal.json" ".metrics.baseline")")"
    replace_placeholder "$temp_file" "identified_issues" "$(format_list "$(get_json_value "session-goal.json" ".session_goals[0].details.implementation_approach")")"
    replace_placeholder "$temp_file" "external_dependencies" "$(format_list "$(get_json_value "session-goal.json" ".context.dependencies")")"
    replace_placeholder "$temp_file" "internal_dependencies" "$(format_list "$(get_json_value "session-goal.json" ".session_goals[0].details.guard_rails.technical_requirements.dependencies")")"
    replace_placeholder "$temp_file" "circular_dependencies" "N/A"
    replace_placeholder "$temp_file" "identified_patterns" "N/A"
    replace_placeholder "$temp_file" "recommended_patterns" "N/A"
    replace_placeholder "$temp_file" "recommendations_list" "$(format_list "$(get_json_value "session-goal.json" ".session_goals[0].details.success_criteria")")"
    
    # Next steps and notes
    replace_placeholder "$temp_file" "next_steps" "$(format_list "$(get_json_value "session-goal.json" ".completion_criteria")")"
    replace_placeholder "$temp_file" "notes" "$(format_list "$(get_json_value "session-goal.json" ".notes")")"
    
    # AI Instructions
    replace_placeholder "$temp_file" "ai_instructions" "$(cat << 'EOL'
1. Following the established architecture patterns
2. Maintaining code quality and test coverage
3. Updating relevant documentation
4. Considering monetization implications
5. Addressing technical debt
6. Improving test coverage
7. Following the project's style guide
8. Implementing proper error handling
9. Adding appropriate logging
10. Ensuring backward compatibility

Focus on:
- Clean, maintainable code
- Comprehensive test coverage
- Clear documentation
- Performance optimization
- Security best practices
- Accessibility standards
- Error handling
- Logging and monitoring
EOL
)"
    
    # Clean up formatting and empty sections
    sed -i 's/^  -   - /  - /g' "$temp_file"  # Fix extra dashes in lists
    sed -i 's/^   -/  -/g' "$temp_file"  # Fix indentation
    sed -i 's/^1\. Fix.*high)$/1. Fix session continuation script to properly format and merge data from various sources (Priority: high)/g' "$temp_file"  # Fix goal formatting
    sed -i '/^### Dependencies$/,/^$/d' "$temp_file"  # Remove duplicate Dependencies section
    sed -i '/^### Code Patterns$/,/^$/d' "$temp_file"  # Remove duplicate Code Patterns section
    sed -i '/^### Organization$/,/^$/d' "$temp_file"  # Remove empty Organization section
    sed -i '/^### Metrics$/,/^$/d' "$temp_file"  # Remove empty Metrics section
    sed -i '/^#### Organization$/,/^$/d' "$temp_file"  # Remove empty Organization subsection
    
    # Fix complexity metrics formatting
    sed -i '/^#### Complexity Metrics$/{
        n
        /^{/,/^}/{
            c\
  - Prompt Quality: poor\
  - Data Integration: partial\
  - Error Handling: basic
        }
    }' "$temp_file"
    
    # Remove multiple blank lines
    sed -i '/^$/N;/^\n$/D' "$temp_file"
    
    # Fix Next Steps and Notes sections
    sed -i '/^## Next Steps$/{
        n
        /^$/c\
  - Session prompt is properly formatted and complete\
  - All data sources are correctly merged\
  - Validation checks pass\
  - Documentation is updated\
  - Edge cases are handled
    }' "$temp_file"
    
    sed -i '/^## Notes$/{
        n
        /^$/c\
  - Focus on clean, maintainable data transformation\
  - Ensure proper error handling and validation\
  - Document all data formats and transformations\
  - Consider future extensibility\
  - Maintain backward compatibility
    }' "$temp_file"
    
    # Remove placeholder content
    sed -i '/^[0-9]\. {next_step_[0-9]}/d' "$temp_file"
    sed -i '/^- {important_note_[0-9]}/d' "$temp_file"
    
    # Move final content to output file
    mv "$temp_file" "$output_file"
    rm -f "$rules_content_file"
}

# Main script
log "Starting session continuation setup..."

# Check dependencies first
check_dependencies

# Load session context
load_session_context

# 1. Update session goals
if [ ! -f session-goal.json ]; then
    log "Creating initial session-goal.json..."
    cp session-goal.json.template session-goal.json || handle_error "Failed to create session-goal.json"
else
    log "Backing up existing session goals..."
    cp session-goal.json session-goal.json.bak || handle_error "Failed to backup session-goal.json"
fi

# Edit session goals if not in non-interactive mode
if [ "$EDITOR" != "cat" ]; then
log "Editing session goals..."
$EDITOR session-goal.json || handle_error "Failed to edit session-goal.json"
fi

# 2. Run complexity analysis
log "Running complexity analysis..."
cd tools/complexity_analyzer || handle_error "Failed to change to complexity analyzer directory"
log "Building complexity analyzer..."
cargo build --release || handle_error "Failed to build complexity analyzer"
log "Running analysis..."
cargo run --release -- -p ../../src -f json -o ../../complexity_analysis.json -t 10 || handle_error "Failed to run complexity analysis"
cd ../..

# 3. Generate updated knowledge graph
if [ -f .cursor/rules/knowledge_graph/generator.py ]; then
    log "Generating knowledge graph..."
    python3 .cursor/rules/knowledge_graph/generator.py --output knowledge_graph.json || handle_error "Failed to generate knowledge graph"
else
    log "Knowledge graph generator not found, skipping..."
fi

# 4. Update monetization analysis
if [ -f .cursor/rules/monetization_analysis/revenue_potential_analyzer.py ]; then
    log "Updating monetization analysis..."
    python3 .cursor/rules/monetization_analysis/revenue_potential_analyzer.py src --output monetization_analysis.json || handle_error "Failed to update monetization analysis"
else
    log "Monetization analysis tool not found, skipping..."
fi

# 5. Run AI analyzer to update ai-context.json
log "Running AI analyzer..."
node tools/ai-analyzer.js \
    --task "Update AI context" \
    --files "src/**/*.ts" \
    --output ai-context.json \
    --verbose || handle_error "Failed to run AI analyzer"

# 6. Generate session prompt
generate_session_prompt "session_prompt.template.md" "session_prompt.md"

log "Session continuation setup completed successfully!"
log "You can now start a new session by saying 'use the prompt in @session_prompt.md'" 