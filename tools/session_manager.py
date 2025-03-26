#!/usr/bin/env python3

"""Session Manager

A utility script for managing development session context and generating prompts.

Usage:
    # Save session context at the end of a session
    python session_manager.py save-context

    # Generate prompt at the start of a session
    python session_manager.py generate-prompt

    # View current session status
    python session_manager.py status
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

class SessionManager:
    """Manages development session context and prompts."""
    
    def __init__(self, workspace_root: str = None):
        self.workspace_root = workspace_root or os.getcwd()
        self.tools_dir = Path(self.workspace_root) / "tools"
        self.context_file = Path(self.workspace_root) / "end-of-session.json"
        self.knowledge_graph_file = Path(self.workspace_root) / "knowledge_graph.json"
        self.monetization_file = Path(self.workspace_root) / "monetization_analysis.json"
        self.prompt_file = Path(self.workspace_root) / "session_prompt.md"
    
    def save_context(self, interactive: bool = True) -> bool:
        """Save the current session context."""
        try:
            # Load existing context if available
            existing_context = {}
            if self.context_file.exists():
                with open(self.context_file, 'r', encoding='utf-8') as f:
                    existing_context = json.load(f)
            
            # Get active component info, handling both formats
            technical_context = existing_context.get('technical_context', {})
            active_component = None
            
            # Try plural format first
            if 'active_components' in technical_context and technical_context['active_components']:
                active_component = technical_context['active_components'][0]
            # Fall back to singular format
            elif 'active_component' in technical_context:
                active_component = technical_context['active_component']
            
            # Create new context with plural format
            context = {
                "session_metadata": {
                    "last_session_date": datetime.now().strftime("%Y-%m-%d"),
                    "project_phase": self._get_input("Project phase",
                                                   existing_context.get("session_metadata", {}).get("project_phase")) if interactive else existing_context.get("session_metadata", {}).get("project_phase", "Unknown"),
                    "current_focus": self._get_input("Current focus",
                                                   existing_context.get("session_metadata", {}).get("current_focus")) if interactive else existing_context.get("session_metadata", {}).get("current_focus", "Unknown")
                },
                "technical_context": {
                    "active_components": [
                        {
                            "name": self._get_input("Active component name",
                                                  active_component.get("name")) if interactive else active_component.get("name", "Unknown"),
                            "status": self._get_input("Component status",
                                                    active_component.get("status")) if interactive else active_component.get("status", "Unknown"),
                            "completion_percentage": int(self._get_input("Completion percentage",
                                                                      active_component.get("completion_percentage", 0))) if interactive else active_component.get("completion_percentage", 0),
                            "details": active_component.get("details", {})
                        }
                    ]
                }
            }
            
            # Merge with existing context
            existing_context.update(context)
            
            # Save updated context
            with open(self.context_file, 'w', encoding='utf-8') as f:
                json.dump(existing_context, f, indent=2)
            
            print(f"Session context saved to {self.context_file}")
            return True
            
        except Exception as e:
            print(f"Error saving session context: {e}", file=sys.stderr)
            return False
    
    def generate_prompt(self) -> bool:
        """Generate a session continuation prompt."""
        try:
            # Ensure context merger script exists
            merger_script = self.tools_dir / "context_merger.py"
            if not merger_script.exists():
                print("Error: context_merger.py not found", file=sys.stderr)
                return False
            
            # Run the context merger
            cmd = f"python {merger_script} " \
                  f"--session-context {self.context_file} " \
                  f"--knowledge-graph {self.knowledge_graph_file} " \
                  f"--monetization-status {self.monetization_file} " \
                  f"--output {self.prompt_file} " \
                  f"--verbose"
            
            result = os.system(cmd)
            if result != 0:
                print("Error: Failed to generate prompt", file=sys.stderr)
                return False
            
            print(f"Session prompt generated at {self.prompt_file}")
            return True
            
        except Exception as e:
            print(f"Error generating prompt: {e}", file=sys.stderr)
            return False
    
    def show_status(self) -> bool:
        """Show current session status."""
        try:
            if not self.context_file.exists():
                print("No active session context found.")
                return True
            
            with open(self.context_file, 'r', encoding='utf-8') as f:
                context = json.load(f)
            
            print("\nCurrent Session Status:")
            print("----------------------")
            print(f"Last Session: {context['session_metadata']['last_session_date']}")
            print(f"Project Phase: {context['session_metadata']['project_phase']}")
            print(f"Current Focus: {context['session_metadata']['current_focus']}")
            print("\nActive Component:")
            component = context['technical_context']['active_components'][0]
            print(f"- Name: {component['name']}")
            print(f"- Status: {component['status']}")
            print(f"- Progress: {component['completion_percentage']}%")
            
            return True
            
        except Exception as e:
            print(f"Error showing status: {e}", file=sys.stderr)
            return False
    
    def _get_input(self, prompt: str, default: Any = None) -> str:
        """Get user input with optional default value."""
        if default:
            user_input = input(f"{prompt} [{default}]: ").strip()
            return user_input if user_input else default
        return input(f"{prompt}: ").strip()

def main():
    parser = argparse.ArgumentParser(description="Manage development session context and prompts")
    parser.add_argument('command', choices=['save-context', 'generate-prompt', 'status'],
                       help="Command to execute")
    parser.add_argument('--non-interactive', action='store_true',
                       help="Run in non-interactive mode (use existing values)")
    parser.add_argument('--workspace', help="Path to workspace root")
    
    args = parser.parse_args()
    
    manager = SessionManager(args.workspace)
    
    if args.command == 'save-context':
        success = manager.save_context(not args.non_interactive)
    elif args.command == 'generate-prompt':
        success = manager.generate_prompt()
    elif args.command == 'status':
        success = manager.show_status()
    else:
        print(f"Unknown command: {args.command}", file=sys.stderr)
        success = False
    
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main() 