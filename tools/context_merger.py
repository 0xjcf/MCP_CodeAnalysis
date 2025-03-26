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

    def extract_knowledge_graph_context(self, graph_data: Dict[str, Any], 
                                      active_component: str) -> Dict[str, Any]:
        """Extract relevant context from knowledge graph based on active component."""
        context = {
            'components': [],
            'relationships': [],
            'decisions': []
        }
        
        if not graph_data:
            return context
            
        # Find the active component node
        active_node = None
        for node in graph_data.get('nodes', []):
            if node.get('name') == active_component:
                active_node = node
                break
        
        if active_node:
            # Get directly related components
            context['components'].append(active_node)
            for edge in graph_data.get('edges', []):
                if edge['source'] == active_node['id'] or edge['target'] == active_node['id']:
                    # Find the related component
                    related_id = edge['target'] if edge['source'] == active_node['id'] else edge['source']
                    for node in graph_data.get('nodes', []):
                        if node['id'] == related_id:
                            context['components'].append(node)
                            context['relationships'].append(edge)
                            
            # Get technical decisions
            for node in graph_data.get('nodes', []):
                if node.get('type') == 'decision' and any(
                    edge['source'] == active_node['id'] and edge['target'] == node['id']
                    for edge in graph_data.get('edges', [])
                ):
                    context['decisions'].append(node)
        
        return context

    def extract_monetization_features(self, monetization_data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Extract feature lists by tier from monetization analysis."""
        features = {
            'free': [],
            'pro': [],
            'enterprise': []
        }
        
        if not monetization_data:
            return features
            
        # Extract features from opportunities
        for opportunity in monetization_data.get('opportunities', []):
            feature = opportunity.get('feature')
            if not feature:
                continue
                
            # Determine tier based on priority and type
            if opportunity.get('priority') == 'low':
                features['free'].append(feature)
            elif opportunity.get('priority') == 'medium':
                features['pro'].append(feature)
            else:
                features['enterprise'].append(feature)
        
        return features

    def generate_prompt(self, 
                       session_context: Dict[str, Any],
                       knowledge_context: Dict[str, Any],
                       monetization_features: Dict[str, List[str]]) -> str:
        """Generate the session continuation prompt."""
        try:
            with open(self.template_path, 'r', encoding='utf-8') as f:
                template = f.read()
        except FileNotFoundError:
            template = self.get_default_template()
        
        # Format the knowledge graph section
        knowledge_section = []
        for comp in knowledge_context['components']:
            knowledge_section.append(f"- {comp['name']}: {comp['description']}")
        for rel in knowledge_context['relationships']:
            knowledge_section.append(f"- {rel['source']} {rel['type']} {rel['target']}")
        for dec in knowledge_context['decisions']:
            knowledge_section.append(f"- Decision: {dec.get('description', 'No description')}")
        
        # Format the monetization section
        monetization_section = []
        for tier, features in monetization_features.items():
            if features:
                monetization_section.append(f"### {tier.title()} Tier Features:")
                for feature in features:
                    monetization_section.append(f"- {feature}")
        
        # Replace placeholders in template
        prompt = template.format(
            last_session_date=session_context['session_metadata']['last_session_date'],
            project_phase=session_context['session_metadata']['project_phase'],
            current_focus=session_context['session_metadata']['current_focus'],
            active_component=session_context['technical_context']['active_components'][0]['name'],
            component_status=session_context['technical_context']['active_components'][0]['status'],
            completion_percentage=session_context['technical_context']['active_components'][0]['completion_percentage'],
            knowledge_graph_context='\n'.join(knowledge_section),
            monetization_status='\n'.join(monetization_section)
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

## Knowledge Graph Context
{knowledge_graph_context}

## Monetization Status
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
        
        # Extract relevant context
        active_component = session_data['technical_context']['active_components'][0]['name']
        knowledge_context = self.extract_knowledge_graph_context(graph_data, active_component)
        monetization_features = self.extract_monetization_features(monetization_data)
        
        # Generate prompt
        prompt = self.generate_prompt(session_data, knowledge_context, monetization_features)
        
        # Save prompt
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(prompt)
            if self.verbose:
                print(f"Successfully generated prompt at {output_path}")
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

if __name__ == '__main__':
    main() 