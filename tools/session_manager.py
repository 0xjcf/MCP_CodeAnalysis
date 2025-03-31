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
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any
import subprocess

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
            
            # Save to both file and session store
            with open(self.context_file, 'w', encoding='utf-8') as f:
                json.dump(existing_context, f, indent=2)
            
            # Save to session store
            self._save_to_session_store(existing_context)
            
            print(f"Session context saved to {self.context_file}")
            return True
            
        except Exception as e:
            print(f"Error saving session context: {e}", file=sys.stderr)
            return False
    
    def _save_to_session_store(self, context: Dict[str, Any]) -> None:
        """Save context to the session store."""
        try:
            # Get current session metrics
            metrics = self._get_session_metrics()
            
            # Convert context to EndOfSessionData format
            end_of_session_data = {
                "session_id": context.get("session_id", f"session-{datetime.now().strftime('%Y%m%d-%H%M%S')}"),
                "timestamp": datetime.now().isoformat(),
                "status": "completed",
                "next_session": {
                    "date": context.get("next_session_date", (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")),
                    "focus": context.get("focus", ""),
                    "goals": context.get("goals", []),
                    "priority": context.get("priority", "medium"),
                    "context": {
                        "current_phase": context.get("current_phase", ""),
                        "focus_area": context.get("focus_area", ""),
                        "project_status": context.get("project_status", ""),
                        "active_development": {
                            "component": context.get("active_component", ""),
                            "status": context.get("development_status", ""),
                            "progress": context.get("progress", 0),
                            "features_to_implement": context.get("features", []),
                            "current_metrics": {
                                "implementation_status": context.get("implementation_status", ""),
                                "test_coverage": context.get("test_coverage", ""),
                                "documentation": context.get("documentation_status", "")
                            }
                        }
                    }
                },
                "completed_tasks": context.get("completed_tasks", []),
                "next_steps": context.get("next_steps", []),
                "notes": context.get("notes", []),
                "session_summary": {
                    "date": datetime.now().strftime("%Y-%m-%d"),
                    "duration": context.get("duration", "0 minutes"),
                    "main_activities": context.get("main_activities", []),
                    "key_decisions": context.get("key_decisions", []),
                    "next_steps": context.get("next_steps", [])
                },
                "technical_notes": {
                    "dependencies": {
                        "added": context.get("dependencies_added", []),
                        "removed": context.get("dependencies_removed", []),
                        "updated": context.get("dependencies_updated", [])
                    },
                    "file_changes": {
                        "modified": context.get("files_modified", []),
                        "created": context.get("files_created", []),
                        "deleted": context.get("files_deleted", [])
                    }
                },
                "session_metrics": metrics
            }
            
            # Save to session store using the MCP server
            self._save_to_mcp_session_store(end_of_session_data)
            
        except Exception as e:
            print(f"Error saving to session store: {e}", file=sys.stderr)
            raise

    def _get_session_metrics(self) -> Dict[str, int]:
        """Get current session metrics."""
        try:
            # Initialize metrics
            metrics = {
                "files_modified": 0,
                "lines_added": 0,
                "lines_removed": 0,
                "new_files": 0,
                "deleted_files": 0,
                "renamed_files": 0
            }
            
            # Get git stats if available
            if self._is_git_repo():
                stats = self._get_git_stats()
                metrics.update(stats)
            
            return metrics
            
        except Exception as e:
            print(f"Error getting session metrics: {e}", file=sys.stderr)
            return metrics

    def _is_git_repo(self) -> bool:
        """Check if current directory is a git repository."""
        try:
            subprocess.run(["git", "rev-parse", "--is-inside-work-tree"], 
                         capture_output=True, check=True)
            return True
        except subprocess.CalledProcessError:
            return False

    def _get_git_stats(self) -> Dict[str, int]:
        """Get git statistics for the current session."""
        try:
            # Get stats since last commit
            result = subprocess.run(
                ["git", "diff", "--stat"],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Parse git diff output
            stats = {
                "files_modified": 0,
                "lines_added": 0,
                "lines_removed": 0,
                "new_files": 0,
                "deleted_files": 0,
                "renamed_files": 0
            }
            
            # Parse the diff output to extract metrics
            for line in result.stdout.split("\n"):
                if "files changed" in line:
                    parts = line.split(",")
                    for part in parts:
                        if "files changed" in part:
                            stats["files_modified"] = int(part.split()[0])
                        elif "insertions" in part:
                            stats["lines_added"] = int(part.split()[0])
                        elif "deletions" in part:
                            stats["lines_removed"] = int(part.split()[0])
            
            return stats
            
        except Exception as e:
            print(f"Error getting git stats: {e}", file=sys.stderr)
            return {}

    def _save_to_mcp_session_store(self, data: Dict[str, Any]) -> None:
        """Save data to MCP session store using the server."""
        try:
            # Get the MCP server instance
            server = self._get_mcp_server()
            if not server:
                raise RuntimeError("MCP server not available")
            
            # Save using the save-end-of-session tool
            response = server.tools["save-end-of-session"](sessionData=data)
            
            if response.get("isError"):
                raise RuntimeError(f"Failed to save session data: {response.get('content', [{}])[0].get('text', 'Unknown error')}")
                
        except Exception as e:
            print(f"Error saving to MCP session store: {e}", file=sys.stderr)
            raise

    def _get_mcp_server(self) -> Any:
        """Get the MCP server instance."""
        # This should be implemented based on how the MCP server is accessed
        # in your application
        return None
    
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
    
    def _get_input(self, prompt: str, default: str = "") -> str:
        """Get user input with a default value."""
        if default:
            user_input = input(f"{prompt} [{default}]: ").strip()
            return user_input if user_input else default
        return input(f"{prompt}: ").strip()

def main():
    parser = argparse.ArgumentParser(description="Session Manager for MCP Code Analysis")
    parser.add_argument("command", choices=["save-context", "generate-prompt", "status"])
    parser.add_argument("--non-interactive", action="store_true", help="Run in non-interactive mode")
    parser.add_argument("--workspace", help="Path to workspace root")
    
    args = parser.parse_args()
    
    manager = SessionManager(args.workspace)
    
    if args.command == "save-context":
        success = manager.save_context(not args.non_interactive)
    elif args.command == "generate-prompt":
        success = manager.generate_prompt()
    elif args.command == "status":
        success = manager.show_status()
    else:
        print(f"Unknown command: {args.command}", file=sys.stderr)
        success = False
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 