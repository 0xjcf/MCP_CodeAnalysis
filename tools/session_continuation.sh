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
    
    # Check for required Python packages
    if ! python3 -c "import json" 2>/dev/null; then
        handle_error "Python json module is not available."
    fi
}

# Load end-of-session context
load_session_context() {
    log "Loading session context from end-of-session.json..."
    
    if [ ! -f end-of-session.json ]; then
        log "No end-of-session.json found. Creating initial context..."
        python3 tools/session_manager.py save-context --non-interactive
    fi
    
    # Validate end-of-session.json
    if ! python3 -c "import json; json.load(open('end-of-session.json'))" 2>/dev/null; then
        handle_error "Invalid end-of-session.json format"
    fi
    
    # Extract key information for logging
    LAST_SESSION=$(python3 -c "import json; print(json.load(open('end-of-session.json'))['session_metadata']['last_session_date'])")
    CURRENT_PHASE=$(python3 -c "import json; print(json.load(open('end-of-session.json'))['session_metadata']['project_phase'])")
    CURRENT_FOCUS=$(python3 -c "import json; print(json.load(open('end-of-session.json'))['session_metadata']['current_focus'])")
    
    log "Last session: $LAST_SESSION"
    log "Current phase: $CURRENT_PHASE"
    log "Current focus: $CURRENT_FOCUS"
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

# Edit session goals
log "Editing session goals..."
$EDITOR session-goal.json || handle_error "Failed to edit session-goal.json"

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

# 5. Merge contexts
if [ -f tools/context_merger.py ]; then
    log "Merging contexts..."
    python3 tools/context_merger.py \
        --session-context end-of-session.json \
        --knowledge-graph knowledge_graph.json \
        --monetization-status monetization_analysis.json \
        --output session_prompt.md || handle_error "Failed to merge contexts"
else
    log "Context merger not found, skipping..."
fi

log "Session continuation setup completed successfully!"
log "You can now start a new session by saying 'use the prompt in @SESSION_CONTINUATION_PROMPT.md'" 