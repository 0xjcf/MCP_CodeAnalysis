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
        echo "$value" | jq -r 'to_entries | .[] | "  - " + .key + ": " + (.value | tostring)' 2>/dev/null || echo "- $value"
    else
        echo "- $value"
    fi
}

# Format metrics section
format_metrics() {
    local value="$1"
    
    if [ -z "$value" ] || [ "$value" = "null" ] || [ "$value" = "N/A" ]; then
        echo "N/A"
        return
    fi
    
    if [[ "$value" =~ ^\{.*\}$ ]]; then
        echo "$value" | jq -r 'to_entries | .[] | "- " + .key + ": " + (.value | tostring)' 2>/dev/null || echo "- $value"
    else
        echo "- $value"
    fi
}

# Load session context
load_session_context() {
    log "Loading session context from templates/end-of-session.json..."
    
    if [ ! -f templates/end-of-session.json ]; then
        log "No end-of-session.json found. Creating initial context..."
        python3 tools/session_manager.py save-context --non-interactive
    fi
    
    # Load and validate all required files
    load_json "templates/end-of-session.json"
    load_json "templates/session-goal.json"
    load_json "complexity_analysis.json"
    load_json "knowledge_graph.json"
    load_json "monetization_analysis.json"
    load_json "ai-context.json"
    
    # Load template files
    if [ ! -f templates/session-prompt.template.md ]; then
        handle_error "Session prompt template not found at templates/session-prompt.template.md"
    fi
    
    if [ ! -f templates/session-continuation-prompt.md ]; then
        handle_error "Session continuation prompt not found at templates/session-continuation-prompt.md"
    fi
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
    local rules_dir=".cursor/rules"
    local output_file="$1"
    
    # Create output directory if it doesn't exist
    mkdir -p "$(dirname "$output_file")"
    
    # Extract Dependencies section from main.mdc
    echo "## Dependencies" > "$output_file"
    echo "" >> "$output_file"
    echo "### External Dependencies" >> "$output_file"
    echo "- Node.js environment" >> "$output_file"
    echo "- Python 3.8+" >> "$output_file"
    echo "- jq for JSON processing" >> "$output_file"
    echo "- TypeScript toolchain" >> "$output_file"
    echo "" >> "$output_file"
    
    # Extract Code Patterns section from patterns.mdc
    if [ -f "$rules_dir/patterns/patterns.mdc" ]; then
        echo "## Code Patterns" >> "$output_file"
        echo "" >> "$output_file"
        echo "### Recommended Patterns" >> "$output_file"
        echo "" >> "$output_file"
        grep -A 20 "### Creational Patterns" "$rules_dir/patterns/patterns.mdc" | grep -v "###" >> "$output_file"
        echo "" >> "$output_file"
        grep -A 20 "### Structural Patterns" "$rules_dir/patterns/patterns.mdc" | grep -v "###" >> "$output_file"
        echo "" >> "$output_file"
        grep -A 20 "### Behavioral Patterns" "$rules_dir/patterns/patterns.mdc" | grep -v "###" >> "$output_file"
    fi
    
    # Extract Organization section from main.mdc
    if [ -f "$rules_dir/main.mdc" ]; then
        echo "## Organization" >> "$output_file"
        echo "" >> "$output_file"
        echo "### Project Structure" >> "$output_file"
        grep -A 5 "## Global Rules" "$rules_dir/main.mdc" | grep -v "##" >> "$output_file"
    fi
    
    # Extract Metrics section from code_health.mdc
    if [ -f "$rules_dir/code_health/code_health.mdc" ]; then
        echo "## Metrics" >> "$output_file"
        echo "" >> "$output_file"
        echo "### Code Quality Metrics" >> "$output_file"
        grep -A 10 "## Code Health Guidelines" "$rules_dir/code_health/code_health.mdc" | grep -v "##" >> "$output_file"
    fi
}

# Main function to generate session prompt
generate_session_prompt() {
    local template_file="templates/session-prompt.template.md"
    local output_file="templates/session-prompt.md"
    local rules_content_file="templates/rules-content.md"
    
    log "Backing up existing session goals..."
    cp "$template_file" "$output_file"
    
    # Extract rules content first
    extract_rules_content "$rules_content_file"
    
    # Replace placeholders with content from JSON files
    replace_placeholder "$output_file" "last_session_date" "$(get_json_value "templates/end-of-session.json" ".session_summary.date")"
    replace_placeholder "$output_file" "project_phase" "$(get_json_value "templates/end-of-session.json" ".next_session.context.current_phase")"
    replace_placeholder "$output_file" "current_focus" "$(get_json_value "templates/end-of-session.json" ".next_session.context.focus_area")"
    replace_placeholder "$output_file" "project_status" "$(get_json_value "templates/end-of-session.json" ".next_session.context.project_status")"
    
    # Active component details
    replace_placeholder "$output_file" "component_name" "$(get_json_value "templates/end-of-session.json" ".next_session.context.active_development.component")"
    replace_placeholder "$output_file" "component_status" "$(get_json_value "templates/end-of-session.json" ".next_session.context.active_development.status")"
    replace_placeholder "$output_file" "completion_percentage" "$(get_json_value "templates/end-of-session.json" ".next_session.context.active_development.progress")"
    
    # Features and metrics
    replace_placeholder "$output_file" "features_list" "$(format_list "$(get_json_value "templates/end-of-session.json" ".next_session.context.active_development.features_to_implement")")"
    replace_placeholder "$output_file" "metrics_list" "$(format_list "$(get_json_value "templates/end-of-session.json" ".next_session.context.active_development.current_metrics")")"
    replace_placeholder "$output_file" "next_steps_list" "$(format_list "$(get_json_value "templates/end-of-session.json" ".next_session.context.active_development.next_steps")")"
    
    # Development status
    replace_placeholder "$output_file" "completed_tasks_list" "$(format_list "$(get_json_value "templates/end-of-session.json" ".completed_tasks")")"
    replace_placeholder "$output_file" "in_progress_tasks_list" "$(format_list "$(get_json_value "templates/end-of-session.json" ".next_session.context.active_development.features_to_implement")")"
    replace_placeholder "$output_file" "next_priorities_list" "$(format_list "$(get_json_value "templates/end-of-session.json" ".next_session.goals")")"
    
    # Documentation
    replace_placeholder "$output_file" "recently_updated_docs" "$(format_list "$(get_json_value "templates/end-of-session.json" ".technical_notes.file_changes.created")")"
    replace_placeholder "$output_file" "docs_needing_update" "$(format_list "$(get_json_value "templates/end-of-session.json" ".next_session.context.active_development.current_metrics.documentation")")"
    
    # Session goals
    replace_placeholder "$output_file" "primary_goal" "$(get_json_value "templates/end-of-session.json" ".next_session.focus")"
    replace_placeholder "$output_file" "priority_level" "$(get_json_value "templates/end-of-session.json" ".next_session.priority")"
    replace_placeholder "$output_file" "subtasks_list" "$(format_list "$(get_json_value "templates/end-of-session.json" ".next_session.goals")")"
    
    # Technical context
    replace_placeholder "$output_file" "key_files_list" "$(format_list "$(get_json_value "templates/end-of-session.json" ".technical_notes.file_changes.moved")")"
    replace_placeholder "$output_file" "architecture_decisions_list" "$(format_list "$(get_json_value "templates/end-of-session.json" ".session_summary.key_decisions")")"
    
    # Replace content from rules
    if [ -f "$rules_content_file" ]; then
        replace_placeholder "$output_file" "dependencies_list" "$(sed -n '/^## Dependencies/,/^##/p' "$rules_content_file" | grep -v '^##')"
        replace_placeholder "$output_file" "code_patterns_list" "$(sed -n '/^## Code Patterns/,/^##/p' "$rules_content_file" | grep -v '^##')"
        replace_placeholder "$output_file" "organization_details" "$(sed -n '/^## Organization/,/^##/p' "$rules_content_file" | grep -v '^##')"
        replace_placeholder "$output_file" "metrics_summary" "$(sed -n '/^## Metrics/,/^##/p' "$rules_content_file" | grep -v '^##')"
    fi
    
    # Analysis content
    replace_placeholder "$output_file" "complexity_metrics" "$(format_metrics "$(get_json_value "templates/end-of-session.json" ".session_metrics")")"
    replace_placeholder "$output_file" "identified_issues" "$(format_list "$(get_json_value "templates/end-of-session.json" ".next_session.context.active_development.features_to_implement")")"
    replace_placeholder "$output_file" "external_dependencies" "$(format_list "$(get_json_value "templates/end-of-session.json" ".technical_notes.dependencies.external")")"
    replace_placeholder "$output_file" "internal_dependencies" "$(format_list "$(get_json_value "templates/end-of-session.json" ".technical_notes.dependencies.internal")")"
    replace_placeholder "$output_file" "circular_dependencies" "None identified"
    replace_placeholder "$output_file" "identified_patterns" "$(format_list "$(get_json_value "templates/end-of-session.json" ".session_summary.key_decisions")")"
    replace_placeholder "$output_file" "recommended_patterns" "$(format_list "$(get_json_value "templates/end-of-session.json" ".next_session.goals")")"
    replace_placeholder "$output_file" "recommendations_list" "$(format_list "$(get_json_value "templates/end-of-session.json" ".next_session.goals")")"
    
    # Replace next steps with properly formatted list
    next_steps=$(get_json_value "templates/end-of-session.json" ".next_steps")
    formatted_next_steps=$(format_next_steps "$next_steps")
    if [[ -n "$formatted_next_steps" ]]; then
        formatted_next_steps_escaped=$(echo "$formatted_next_steps" | sed ':a;N;$!ba;s/\n/\\n/g')
        sed -i "s/^## Next Steps$/## Next Steps\\n\\n${formatted_next_steps_escaped}/" "$output_file"
    fi

    # Replace notes with properly formatted list
    notes=$(get_json_value "templates/end-of-session.json" ".notes")
    formatted_notes=$(format_notes "$notes")
    if [[ -n "$formatted_notes" ]]; then
        formatted_notes_escaped=$(echo "$formatted_notes" | sed ':a;N;$!ba;s/\n/\\n/g')
        sed -i "s/^## Notes$/## Notes\\n\\n${formatted_notes_escaped}/" "$output_file"
    fi
    
    # Clean up formatting and empty sections
    sed -i 's/^  -   - /  - /g' "$output_file"  # Fix extra dashes in lists
    sed -i 's/^   -/  -/g' "$output_file"  # Fix indentation
    sed -i 's/^N\/A$//g' "$output_file"  # Remove standalone N/A lines
    
    # Remove empty sections
    sed -i '/^### Dependencies$/,/^$/d' "$output_file"  # Remove duplicate Dependencies section
    sed -i '/^### Code Patterns$/,/^$/d' "$output_file"  # Remove duplicate Code Patterns section
    sed -i '/^### Organization$/,/^$/d' "$output_file"  # Remove empty Organization section
    sed -i '/^### Metrics$/,/^$/d' "$output_file"  # Remove empty Metrics section
    sed -i '/^#### Organization$/,/^$/d' "$output_file"  # Remove empty Organization subsection
    sed -i '/^#### External$/,/^$/d' "$output_file"  # Remove empty External section
    sed -i '/^#### Internal$/,/^$/d' "$output_file"  # Remove empty Internal section
    
    # Only remove Next Steps and Notes sections if they are truly empty
    sed -i '/^## Next Steps$/{N;/^## Next Steps\n\n[^1]/!b;d}' "$output_file"
    sed -i '/^## Notes$/{N;/^## Notes\n\n[^-]/!b;d}' "$output_file"
    
    # Fix Goals section indentation
    sed -i '/^1\. .* (Priority: .*)$/{n;s/^  -   -/  -/g}' "$output_file"
    
    # Remove multiple blank lines
    sed -i '/^$/N;/^\n$/D' "$output_file"
    
    # Remove placeholder content
    sed -i '/^[0-9]\. {next_step_[0-9]}/d' "$output_file"
    sed -i '/^- {important_note_[0-9]}/d' "$output_file"
    
    # Clean up temporary rules content file
    rm -f "$rules_content_file"
}

format_next_steps() {
    local input="$1"
    if [[ -z "$input" || "$input" == "null" || "$input" == "N/A" ]]; then
        return
    fi
    local counter=1
    echo "$input" | jq -r '.[]' | while read -r line; do
        echo "  $counter. $line"
        ((counter++))
    done
}

format_notes() {
    local input="$1"
    if [[ -z "$input" || "$input" == "null" || "$input" == "N/A" ]]; then
        return
    fi
    echo "$input" | jq -r '.[]' | while read -r line; do
        echo "  - $line"
    done
}

# Main script
log "Starting session continuation setup..."

# Check dependencies first
check_dependencies

# Load session context
load_session_context

# 1. Update session goals
if [ ! -f templates/session-goal.json ]; then
    log "Creating initial session-goal.json..."
    cp templates/session-goal.template.json templates/session-goal.json || handle_error "Failed to create session-goal.json"
else
    log "Backing up existing session goals..."
    cp templates/session-goal.json templates/session-goal.json.bak || handle_error "Failed to backup session-goal.json"
fi

# Edit session goals if not in non-interactive mode
if [ "$EDITOR" != "cat" ]; then
log "Editing session goals..."
    $EDITOR templates/session-goal.json || handle_error "Failed to edit session-goal.json"
fi

# Skip analysis steps if in non-interactive mode
if [ "$EDITOR" != "cat" ]; then
# 2. Run complexity analysis
log "Running complexity analysis..."
cd tools/complexity_analyzer || handle_error "Failed to change to complexity analyzer directory"
log "Building complexity analyzer..."
cargo build --release || handle_error "Failed to build complexity analyzer"
log "Running analysis..."
    cargo run --release -- -p ../../packages/core/src -f json -o ../../analysis/complexity_analysis.json -t 10 || handle_error "Failed to run complexity analysis"
cd ../..

# 3. Generate updated knowledge graph
if [ -f .cursor/rules/knowledge_graph/generator.py ]; then
    log "Generating knowledge graph..."
        python3 .cursor/rules/knowledge_graph/generator.py --output analysis/knowledge_graph.json || handle_error "Failed to generate knowledge graph"
else
    log "Knowledge graph generator not found, skipping..."
fi

# 4. Update monetization analysis
if [ -f .cursor/rules/monetization_analysis/revenue_potential_analyzer.py ]; then
    log "Updating monetization analysis..."
        python3 .cursor/rules/monetization_analysis/revenue_potential_analyzer.py packages/core/src --output analysis/monetization_analysis.json || handle_error "Failed to update monetization analysis"
else
    log "Monetization analysis tool not found, skipping..."
fi

# 5. Run AI analyzer to update ai-context.json
log "Running AI analyzer..."
node tools/ai-analyzer.js \
    --task "Update AI context" \
        --files "packages/**/*.ts" \
        --output analysis/ai-context.json \
    --verbose || handle_error "Failed to run AI analyzer"
fi

# 6. Generate session prompt
generate_session_prompt

log "Session continuation setup completed successfully!"
log "You can now start a new session by saying 'use the prompt in @templates/session-prompt.md'" 