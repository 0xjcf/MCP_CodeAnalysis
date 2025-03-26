#!/usr/bin/env python3

"""Context Merger

This script merges multiple context sources (session context, knowledge graph,
monetization analysis) into a comprehensive session continuation prompt.

Usage:
    python context_merger.py \
        --session-context end-of-session.json \
        --knowledge-graph knowledge_graph.json \
        --monetization-status monetization_analysis.json \
        --output session_prompt.md
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from collections import defaultdict

class ContextMerger:
    """Merges different context sources into a session continuation prompt."""
    
    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.template_path = Path(__file__).parent / "templates" / "session_prompt_template.md"
    
    def load_json_file(self, file_path: str) -> Dict[str, Any]:
        """Load and parse a JSON file."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading {file_path}: {e}", file=sys.stderr)
            return {}
    
    def extract_knowledge_graph_context(self, graph_data: Dict[str, Any], active_component: str) -> Dict[str, Any]:
        """Extract relevant context from knowledge graph."""
        context = {
            'components': [],
            'relationships': [],
            'decisions': []
        }
        
        if not graph_data:
            return context
        
        # Extract components related to active component
        for comp in graph_data.get('components', []):
            if comp.get('name') == active_component or any(rel.get('target') == active_component for rel in graph_data.get('relationships', [])):
                context['components'].append(comp)
        
        # Extract relationships involving active component
        for rel in graph_data.get('relationships', []):
            if rel.get('source') == active_component or rel.get('target') == active_component:
                context['relationships'].append(rel)
        
        # Extract relevant technical decisions
        for dec in graph_data.get('decisions', []):
            if any(comp.get('name') == active_component for comp in dec.get('components', [])):
                context['decisions'].append(dec)
        
        return context
    
    def extract_monetization_features(self, monetization_data: Dict[str, Any]) -> Dict[str, Dict[str, List[Dict[str, Any]]]]:
        """Extract monetization features from analysis data."""
        features = defaultdict(lambda: defaultdict(list))
        
        if not monetization_data or not isinstance(monetization_data, dict):
            return features
        
        for tier, tier_data in monetization_data.items():
            if not tier_data or not isinstance(tier_data, (dict, list)):
                continue
                
            # Handle both dictionary and list formats
            if isinstance(tier_data, dict):
                for feature_name, feature_data in tier_data.items():
                    if isinstance(feature_data, (list, dict)):
                        features[tier][feature_name].extend(feature_data if isinstance(feature_data, list) else [feature_data])
            elif isinstance(tier_data, list):
                for feature in tier_data:
                    if isinstance(feature, dict):
                        feature_name = feature.get('name', 'unnamed_feature')
                        features[tier][feature_name].append(feature)
        
        return features
    
    def format_development_status(self, session_data: Dict[str, Any]) -> str:
        """Format development status section."""
        status = session_data.get('development_status', {})
        
        sections = []
        
        if status.get('completed'):
            sections.append("Completed:")
            sections.extend(f"- {item}" for item in status['completed'])
        
        if status.get('in_progress'):
            sections.append("\nIn Progress:")
            sections.extend(f"- {item}" for item in status['in_progress'])
        
        if status.get('next_priorities'):
            sections.append("\nNext Priorities:")
            sections.extend(f"- {item}" for item in status['next_priorities'])
        
        return '\n'.join(sections)
    
    def format_documentation_status(self, session_data: Dict[str, Any]) -> str:
        """Format documentation status section."""
        docs = session_data.get('knowledge_context', {}).get('documentation', {})
        
        sections = []
        
        if docs.get('updated'):
            sections.append("Recently Updated:")
            sections.extend(f"- {item}" for item in docs['updated'])
        
        if docs.get('needs_update'):
            sections.append("\nNeeds Attention:")
            sections.extend(f"- {item}" for item in docs['needs_update'])
        
        return '\n'.join(sections)
    
    def generate_prompt(self, 
                       session_context: Dict[str, Any],
                       knowledge_context: Dict[str, Any],
                       monetization_features: Dict[str, Dict[str, List[Dict[str, Any]]]]) -> str:
        """Generate the session continuation prompt."""
        try:
            with open(self.template_path, 'r', encoding='utf-8') as f:
                template = f.read()
        except FileNotFoundError:
            template = self.get_default_template()
        
        # Format the knowledge graph section
        knowledge_section = []
        if knowledge_context['components']:
            knowledge_section.append("### Components")
            for comp in knowledge_context['components']:
                knowledge_section.append(f"- {comp['name']}: {comp.get('description', 'No description available')}")
        if knowledge_context['relationships']:
            knowledge_section.append("\n### Relationships")
            for rel in knowledge_context['relationships']:
                knowledge_section.append(f"- {rel['source']} {rel['type']} {rel['target']}")
        if knowledge_context['decisions']:
            knowledge_section.append("\n### Technical Decisions")
            for dec in knowledge_context['decisions']:
                knowledge_section.append(f"- {dec.get('description', 'No description available')}")
        
        # Format the monetization section
        monetization_section = []
        for tier, features in monetization_features.items():
            if features:
                monetization_section.append(f"\n### {tier.title()} Tier Features")
                for feature_name, implementations in features.items():
                    monetization_section.append(f"\n#### {feature_name.replace('_', ' ').title()}")
                    for impl in implementations:
                        desc = impl.get('description', 'No description available')
                        context = impl.get('context', '')
                        type_info = impl.get('type', '')
                        monetization_section.append(f"- {desc}")
                        if context and context != desc:
                            monetization_section.append(f"  - Context: {context}")
                        if type_info:
                            monetization_section.append(f"  - Type: {type_info}")
        
        # Format development and documentation status
        development_status = self.format_development_status(session_context)
        documentation_status = self.format_documentation_status(session_context)
        
        # Get active component info, handling both singular and plural formats
        technical_context = session_context.get('technical_context', {})
        active_component = None
        
        # Try plural format first
        if 'active_components' in technical_context and technical_context['active_components']:
            active_component = technical_context['active_components'][0]
        # Fall back to singular format
        elif 'active_component' in technical_context:
            active_component = technical_context['active_component']
        
        if not active_component:
            print("Warning: No active component found in technical context", file=sys.stderr)
            active_component = {
                'name': 'Unknown',
                'status': 'Unknown',
                'completion_percentage': 0
            }
        
        # Replace placeholders in template
        prompt = template.format(
            last_session_date=session_context['session_metadata']['last_session_date'],
            project_phase=session_context['session_metadata']['project_phase'],
            current_focus=session_context['session_metadata']['current_focus'],
            active_component=active_component['name'],
            component_status=active_component['status'],
            completion_percentage=active_component['completion_percentage'],
            knowledge_graph_context='\n'.join(knowledge_section),
            monetization_status='\n'.join(monetization_section),
            development_status=development_status,
            documentation_status=documentation_status
        )
        
        return prompt

    def get_default_template(self) -> str:
        """Return the default prompt template if template file is not found."""
        return '''# Session Continuation Prompt

I'm continuing work on the MCP Code Analysis project. Here's the context from my previous session:

## Project Context
- Last Session: {last_session_date}
- Current Phase: {project_phase}
- Focus Area: {current_focus}

## Active Development
Currently working on:
- Component: {active_component}
- Status: {component_status}
- Progress: {completion_percentage}%

## Technical Context
{knowledge_graph_context}

## Development Status
{development_status}

## Documentation Status
{documentation_status}

## Monetization Strategy
{monetization_status}

Please help me continue development, taking into account the previous session's context and maintaining consistency with the established architecture and monetization strategy.
'''

    def merge_and_generate(self,
                          session_context_path: str,
                          knowledge_graph_path: str,
                          monetization_status_path: str,
                          output_path: str) -> bool:
        """Merge contexts and generate the prompt file."""
        # Load data
        session_data = self.load_json_file(session_context_path)
        graph_data = self.load_json_file(knowledge_graph_path)
        monetization_data = self.load_json_file(monetization_status_path)
        
        if not session_data:
            print("Error: Session context is required", file=sys.stderr)
            return False
        
        # Get active component info, handling both singular and plural formats
        technical_context = session_data.get('technical_context', {})
        active_component = None
        
        # Try plural format first
        if 'active_components' in technical_context and technical_context['active_components']:
            active_component = technical_context['active_components'][0]
        # Fall back to singular format
        elif 'active_component' in technical_context:
            active_component = technical_context['active_component']
        
        if not active_component:
            print("Warning: No active component found in technical context", file=sys.stderr)
            active_component = {
                'name': 'Unknown',
                'status': 'Unknown',
                'completion_percentage': 0
            }
        
        # Extract relevant context
        knowledge_context = self.extract_knowledge_graph_context(graph_data, active_component['name'])
        monetization_features = self.extract_monetization_features(monetization_data)
        
        # Generate prompt
        prompt = self.generate_prompt(
            session_data,
            knowledge_context,
            monetization_features
        )
        
        # Save prompt
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(prompt)
            if self.verbose:
                print(f"Prompt saved to {output_path}")
            return True
        except Exception as e:
            print(f"Error saving prompt to {output_path}: {e}", file=sys.stderr)
            return False

def main():
    parser = argparse.ArgumentParser(description="Merge context sources into a session continuation prompt")
    parser.add_argument('--session-context', required=True, help="Path to end-of-session.json")
    parser.add_argument('--knowledge-graph', required=True, help="Path to knowledge_graph.json")
    parser.add_argument('--monetization-status', required=True, help="Path to monetization_analysis.json")
    parser.add_argument('--output', required=True, help="Output path for session prompt")
    parser.add_argument('--verbose', action='store_true', help="Enable verbose output")
    
    args = parser.parse_args()
    
    merger = ContextMerger(verbose=args.verbose)
    success = merger.merge_and_generate(
        args.session_context,
        args.knowledge_graph,
        args.monetization_status,
        args.output
    )
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 