#!/usr/bin/env python3

"""Context Merger

This script merges multiple context sources (session context, knowledge graph,
monetization analysis, AI context) into a comprehensive session continuation prompt.

Usage:
    python context_merger.py \
        --session-context end-of-session.json \
        --knowledge-graph knowledge_graph.json \
        --monetization-status monetization_analysis.json \
        --ai-context ai-context.json \
        --output session_prompt.md
"""

import argparse
import json
import sys
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from collections import defaultdict

class ContextMerger:
    """Merges different context sources into a session continuation prompt."""
    
    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.template_path = Path(__file__).parent.parent / "templates" / "session-prompt.template.md"
        self.context = {}
    
    def load_json_file(self, file_path: str) -> Optional[Dict]:
        """Load and parse a JSON file."""
        try:
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                return json.load(f)
            return None
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON in {file_path}")
            return None
        except Exception as e:
            print(f"Error loading {file_path}: {str(e)}")
            return None
    
    def extract_knowledge_graph_context(self, knowledge_graph: Dict) -> Dict:
        """Extract relevant context from the knowledge graph."""
        context = {
            'components': [],
            'relationships': [],
            'decisions': [],
            'active_component': None
        }
        
        if not knowledge_graph or 'nodes' not in knowledge_graph:
            return context
        
        # Extract components and their relationships
        for node in knowledge_graph.get('nodes', []):
            if node.get('type') == 'component':
                component = {
                    'name': node.get('name', ''),
                    'path': node.get('path', ''),
                    'files': []
                }
                context['components'].append(component)

        # Extract relationships
        for edge in knowledge_graph.get('edges', []):
            if edge.get('type') == 'depends_on':
                relationship = {
                    'source': edge.get('source', ''),
                    'target': edge.get('target', ''),
                    'type': edge.get('type', ''),
                    'description': edge.get('description', '')
                }
                context['relationships'].append(relationship)

        # Extract technical decisions
        for node in knowledge_graph.get('nodes', []):
            if node.get('type') == 'decision':
                decision = {
                    'id': node.get('id', ''),
                    'description': node.get('description', ''),
                    'rationale': node.get('rationale', ''),
                    'impact': node.get('impact', ''),
                    'related_components': node.get('related_components', [])
                }
                context['decisions'].append(decision)
        
        return context
    
    def extract_monetization_features(self, monetization_data: Dict) -> Dict:
        """Extract monetization features from the analysis."""
        features = {
            'tiers': {},
            'opportunities': []
        }

        if not monetization_data:
            return features
        
        # Handle new monetization data structure with explicit tiers
        if 'tiers' in monetization_data:
            for tier_name, tier_data in monetization_data['tiers'].items():
                features['tiers'][tier_name] = {
                    'features': {},
                    'implementations': []
                }
                
            if isinstance(tier_data, dict):
                    if 'features' in tier_data:
                        features['tiers'][tier_name]['features'] = tier_data['features']
                    if 'implementations' in tier_data:
                        features['tiers'][tier_name]['implementations'] = tier_data['implementations']
            elif isinstance(tier_data, list):
                    features['tiers'][tier_name]['implementations'] = tier_data

        # Handle legacy format
        elif isinstance(monetization_data, dict):
            for key, value in monetization_data.items():
                if key.startswith('tier_'):
                    tier_name = key.replace('tier_', '')
                    features['tiers'][tier_name] = {
                        'features': {},
                        'implementations': []
                    }
                    if isinstance(value, dict):
                        features['tiers'][tier_name]['features'] = value
                    elif isinstance(value, list):
                        features['tiers'][tier_name]['implementations'] = value

        # Extract opportunities
        if 'opportunities' in monetization_data:
            features['opportunities'] = monetization_data['opportunities']
        
        return features

    def extract_ai_context(self, ai_context: Dict) -> Dict:
        """Extract relevant context from the AI analysis."""
        context = {
            'codebase_analysis': {
                'structure': {},
                'dependencies': {},
                'patterns': {},
                'metrics': {},
                'recommendations': []
            },
            'project_context': {
                'architecture': {},
                'patterns': {},
                'metrics': {},
                'recommendations': []
            }
        }

        if not ai_context:
            return context
            
        # Extract codebase analysis
        if 'codebase_analysis' in ai_context:
            analysis = ai_context['codebase_analysis']
            
            # Structure analysis
            if 'structure' in analysis:
                context['codebase_analysis']['structure'] = {
                    'complexity': analysis['structure'].get('complexity', []),
                    'organization': analysis['structure'].get('organization', {}),
                    'patterns': analysis['structure'].get('patterns', [])
                }

            # Dependencies
            if 'dependencies' in analysis:
                context['codebase_analysis']['dependencies'] = {
                    'external': analysis['dependencies'].get('external', []),
                    'internal': analysis['dependencies'].get('internal', []),
                    'circular': analysis['dependencies'].get('circular', [])
                }

            # Patterns
            if 'patterns' in analysis:
                context['codebase_analysis']['patterns'] = {
                    'identified': analysis['patterns'].get('identified', []),
                    'recommended': analysis['patterns'].get('recommended', [])
                }

            # Metrics
            if 'metrics' in analysis:
                context['codebase_analysis']['metrics'] = {
                    'complexity': analysis['metrics'].get('complexity', {}),
                    'coverage': analysis['metrics'].get('coverage', {}),
                    'maintainability': analysis['metrics'].get('maintainability', {})
                }

            # Recommendations
            if 'recommendations' in analysis:
                context['codebase_analysis']['recommendations'] = analysis['recommendations']
            
        # Extract project context
        if 'project_context' in ai_context:
            project = ai_context['project_context']
            
            # Architecture
            if 'architecture' in project:
                context['project_context']['architecture'] = {
                    'components': project['architecture'].get('components', []),
                    'relationships': project['architecture'].get('relationships', []),
                    'decisions': project['architecture'].get('decisions', [])
                }

            # Patterns
            if 'patterns' in project:
                context['project_context']['patterns'] = {
                    'identified': project['patterns'].get('identified', []),
                    'recommended': project['patterns'].get('recommended', [])
                }

            # Metrics
            if 'metrics' in project:
                context['project_context']['metrics'] = {
                    'complexity': project['metrics'].get('complexity', {}),
                    'coverage': project['metrics'].get('coverage', {}),
                    'maintainability': project['metrics'].get('maintainability', {})
                }

            # Recommendations
            if 'recommendations' in project:
                context['project_context']['recommendations'] = project['recommendations']
            
        return context
    
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
    
    def format_codebase_analysis(self, analysis: Dict) -> str:
        """Format the codebase analysis section."""
        if not analysis:
            return ""

        sections = []
        
        # Structure Analysis
        if 'structure' in analysis:
            structure = analysis['structure']
            sections.append("## Structure Analysis")
            
            if 'complexity' in structure:
                sections.append("### Complexity Metrics")
                for metric in structure['complexity']:
                    if isinstance(metric, dict):
                        sections.append(f"- File: {metric.get('path', 'Unknown')}")
                        if 'total_metrics' in metric:
                            metrics = metric['total_metrics']
                            sections.append(f"  - Cognitive Complexity: {metrics.get('cognitive', 0)}")
                            sections.append(f"  - Cyclomatic Complexity: {metrics.get('cyclomatic', 0)}")
                            sections.append(f"  - Lines of Code: {metrics.get('loc', 0)}")

            if 'organization' in structure:
                sections.append("### Organization")
                org = structure['organization']
                if isinstance(org, dict):
                    for key, value in org.items():
                        sections.append(f"- {key}: {value}")

            if 'patterns' in structure:
                sections.append("### Identified Issues")
                for pattern in structure['patterns']:
                    if isinstance(pattern, dict):
                        sections.append(f"- {pattern.get('description', 'Unknown issue')}")

        # Dependencies
        if 'dependencies' in analysis:
            deps = analysis['dependencies']
            sections.append("## Dependencies")
            
            if isinstance(deps, dict):
                for dep_type, items in deps.items():
                    if isinstance(items, list):
                        sections.append(f"### {dep_type.title()}")
                        for item in items:
                            if isinstance(item, dict):
                                sections.append(f"- {item.get('name', 'Unknown')}: {item.get('description', '')}")

        # Patterns
        if 'patterns' in analysis:
            patterns = analysis['patterns']
            sections.append("## Code Patterns")
            
            if isinstance(patterns, dict):
                for pattern_type, items in patterns.items():
                    if isinstance(items, list):
                        sections.append(f"### {pattern_type.title()}")
                        for item in items:
                            if isinstance(item, dict):
                                sections.append(f"- {item.get('name', 'Unknown')}: {item.get('description', '')}")

        # Metrics
        if 'metrics' in analysis:
            metrics = analysis['metrics']
            sections.append("## Metrics")
            
            if isinstance(metrics, dict):
                for metric_type, data in metrics.items():
                    if isinstance(data, dict):
                        sections.append(f"### {metric_type.title()}")
                        for key, value in data.items():
                        sections.append(f"- {key}: {value}")
        
        # Recommendations
        if 'recommendations' in analysis:
            sections.append("## Recommendations")
            for rec in analysis['recommendations']:
                if isinstance(rec, dict):
                    sections.append(f"- {rec.get('description', 'Unknown recommendation')}")

        return "\n".join(sections)
    
    def generate_prompt(self, session_context: Dict, knowledge_graph: Dict, 
                       monetization_data: Dict, ai_context: Dict) -> str:
        """Generate the session continuation prompt."""
        # Extract contexts
        kg_context = self.extract_knowledge_graph_context(knowledge_graph)
        monetization_context = self.extract_monetization_features(monetization_data)
        ai_context_data = self.extract_ai_context(ai_context)

        # Format the prompt
        prompt = [
            "# Session Continuation Prompt",
            "",
            "## Project Context",
            f"Last Session Date: {session_context.get('last_session_date', 'Unknown')}",
            f"Current Phase: {session_context.get('project_phase', 'Unknown')}",
            f"Focus Area: {session_context.get('current_focus', 'Unknown')}",
            "",
            "## Development Status",
            "### Active Components",
        ]

        # Add active components
        for component in kg_context['components']:
            if component['name']:
                prompt.append(f"- {component['name']}")

        # Add relationships
        if kg_context['relationships']:
            prompt.extend([
                "",
                "### Component Relationships",
            ])
            for rel in kg_context['relationships']:
                if rel['source'] and rel['target']:
                    prompt.append(f"- {rel['source']} → {rel['target']}: {rel['description']}")

        # Add technical decisions
        if kg_context['decisions']:
            prompt.extend([
                "",
                "### Technical Decisions",
            ])
            for decision in kg_context['decisions']:
                if decision['description']:
                    prompt.extend([
                        f"- {decision['description']}",
                        f"  Rationale: {decision['rationale']}",
                        f"  Impact: {decision['impact']}",
                        f"  Related Components: {', '.join(decision['related_components'])}"
                    ])

        # Add monetization features
        if monetization_context['tiers']:
            prompt.extend([
                "",
                "## Monetization Features",
            ])
            for tier_name, tier_data in sorted(monetization_context['tiers'].items()):
                prompt.append(f"### {tier_name.title()} Tier")
                if isinstance(tier_data, dict):
                    if 'features' in tier_data:
                        prompt.append("#### Features")
                        for feature_name, feature_desc in sorted(tier_data['features'].items()):
                            prompt.append(f"- {feature_name}: {feature_desc}")
                    
                    if 'implementations' in tier_data:
                        prompt.append("#### Implementations")
                        for impl in tier_data['implementations']:
                            if isinstance(impl, dict):
                                prompt.append(f"- {impl.get('type', 'Unknown')}: {impl.get('description', '')}")

        # Add codebase analysis
        if ai_context_data['codebase_analysis']:
            prompt.extend([
                "",
                "## Codebase Analysis",
            ])
            prompt.append(self.format_codebase_analysis(ai_context_data['codebase_analysis']))

        # Add project recommendations
        if ai_context_data['project_context']['recommendations']:
            prompt.extend([
                "",
                "## Project Recommendations",
            ])
            for rec in ai_context_data['project_context']['recommendations']:
                if isinstance(rec, dict):
                    prompt.append(f"- {rec.get('description', 'Unknown recommendation')}")

        return "\n".join(prompt)

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

## Codebase Analysis
{codebase_analysis}

## Development Status
{development_status}

## Documentation Status
{documentation_status}

## Monetization Strategy
{monetization_status}

Please help me continue development, taking into account the previous session's context and maintaining consistency with the established architecture and monetization strategy.
'''

    def merge_and_generate(self, session_context_path: str, knowledge_graph_path: str,
                          monetization_path: str, ai_context_path: str, output_path: str) -> bool:
        """Merge contexts and generate the session prompt."""
        try:
            # Load all context files
            session_context = self.load_json_file(session_context_path)
            knowledge_graph = self.load_json_file(knowledge_graph_path)
            monetization_data = self.load_json_file(monetization_path)
            ai_context = self.load_json_file(ai_context_path)

            # Validate session context
            if not session_context:
                print("Error: Invalid or empty session context", file=sys.stderr)
                return False

            # Generate the prompt
        prompt = self.generate_prompt(
                session_context,
                knowledge_graph or {},
                monetization_data or {},
                ai_context or {}
            )

            # Write the prompt to the output file
            try:
                with open(output_path, 'w') as f:
                f.write(prompt)
            return True
            except Exception as e:
                print(f"Error writing prompt to {output_path}: {str(e)}", file=sys.stderr)
                return False

        except Exception as e:
            print(f"Error generating prompt: {str(e)}", file=sys.stderr)
            return False

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Merge multiple context sources into a session continuation prompt.')
    parser.add_argument('--session-context', required=True, help='Path to session context JSON file')
    parser.add_argument('--knowledge-graph', required=True, help='Path to knowledge graph JSON file')
    parser.add_argument('--monetization-status', required=True, help='Path to monetization status JSON file')
    parser.add_argument('--ai-context', required=True, help='Path to AI context JSON file')
    parser.add_argument('--output', required=True, help='Path to output prompt file')
    parser.add_argument('--verbose', action='store_true', help='Enable verbose output')
    
    args = parser.parse_args()
    
    merger = ContextMerger(verbose=args.verbose)
    success = merger.merge_and_generate(
        args.session_context,
        args.knowledge_graph,
        args.monetization_status,
        args.ai_context,
        args.output
    )
    
    if success:
        print(f"Successfully generated prompt at {args.output}")
    else:
        print("Failed to generate prompt", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main() 