#!/usr/bin/env python3

"""Revenue Potential Analyzer

This script analyzes the codebase to identify potential monetization opportunities,
focusing on freemium features, subscription models, and marketplace integration.

Maturity: beta

Why:
- Identifying monetization opportunities early helps guide development
- This script helps identify features that could be monetized
- Promotes a focus on revenue-generating features
- Helps maintain a sustainable business model
"""

import argparse
import json
import os
import re
from pathlib import Path
import yaml
from collections import defaultdict
from typing import Dict, List, Set, Any
import hashlib

class RevenuePotentialAnalyzer:
    """Analyzes the codebase for monetization opportunities."""
    
    def __init__(self, verbose=False):
        self.verbose = verbose
        self.results = {
            'opportunities': [],
            'summary': {
                'total_opportunities': 0,
                'by_type': {},
                'by_priority': {},
                'by_feature': {}
            }
        }
        self.seen_opportunities = set()  # Track unique opportunities
        
        # Patterns to identify potential monetization opportunities
        self.monetization_patterns = {
            'freemium': [
                r'(free|premium|upgrade|subscribe|subscription|plan|tier|limit)',
                r'(trial|demo|basic|pro|enterprise|business)',
                r'(feature\s+flag|feature\s+toggle|paywall)'
            ],
            'subscription': [
                r'(subscribe|subscription|recurring|monthly|yearly|annual)',
                r'(payment|billing|invoice|charge|credit\s+card)',
                r'(cancel|renew|auto\s*renew|expire|extend)'
            ],
            'marketplace': [
                r'(marketplace|store|shop|vendor|seller|buyer|purchase)',
                r'(listing|product|item|inventory|catalog)',
                r'(commission|fee|transaction|payment\s+processing)'
            ],
            'api': [
                r'(api\s+key|api\s+token|api\s+limit|rate\s+limit)',
                r'(api\s+usage|api\s+call|api\s+request|api\s+response)',
                r'(api\s+version|api\s+endpoint|api\s+service)'
            ],
            'ads': [
                r'(ad|ads|advert|advertisement|banner|display\s+ad)',
                r'(impression|click|ctr|cpm|cpc|ad\s+network)',
                r'(ad\s+block|ad\s+blocker|ad\s+free)'
            ],
            'data': [
                r'(data\s+export|data\s+import|data\s+access)',
                r'(analytics|insights|reports|dashboard)',
                r'(data\s+processing|data\s+storage|data\s+retention)'
            ]
        }
        
        # Feature patterns with descriptions
        self.feature_patterns = {
            'authentication': {
                'pattern': r'(auth|login|signup|register|user)',
                'description': 'User authentication and account management'
            },
            'dashboard': {
                'pattern': r'(dashboard|overview|summary|stats|analytics)',
                'description': 'Data visualization and reporting interface'
            },
            'profile': {
                'pattern': r'(profile|account|settings|preferences)',
                'description': 'User profile and account settings'
            },
            'notification': {
                'pattern': r'(notification|alert|message|email)',
                'description': 'User notifications and alerts'
            },
            'search': {
                'pattern': r'(search|filter|sort|query|find)',
                'description': 'Search and filtering capabilities'
            },
            'upload': {
                'pattern': r'(upload|file|image|video|document)',
                'description': 'File upload and management'
            },
            'social': {
                'pattern': r'(share|follow|like|comment|friend)',
                'description': 'Social interaction features'
            },
            'payment': {
                'pattern': r'(payment|checkout|cart|order|purchase)',
                'description': 'Payment processing and transactions'
            },
            'integration': {
                'pattern': r'(integration|connect|sync|import|export)',
                'description': 'Third-party service integration'
            },
            'analysis': {
                'pattern': r'(analyze|analysis|report|metric|insight)',
                'description': 'Data analysis and reporting'
            },
            'automation': {
                'pattern': r'(automate|automation|workflow|schedule|trigger)',
                'description': 'Process automation and workflows'
            },
            'collaboration': {
                'pattern': r'(collaborate|share|team|group|organization)',
                'description': 'Team collaboration features'
            }
        }
    
    def _generate_opportunity_hash(self, opportunity: Dict[str, Any]) -> str:
        """Generate a unique hash for a monetization opportunity."""
        # Create a string that captures the essential aspects of the opportunity
        key_parts = [
            opportunity['type'],
            next(iter(opportunity['features'].keys()), 'unknown'),  # Get first feature or 'unknown'
            opportunity.get('description', ''),
            # Exclude line numbers and exact matches to group similar opportunities
        ]
        key = '|'.join(key_parts)
        return hashlib.md5(key.encode()).hexdigest()
    
    def _is_duplicate_opportunity(self, opportunity: Dict[str, Any]) -> bool:
        """Check if an opportunity is a duplicate."""
        opportunity_hash = self._generate_opportunity_hash(opportunity)
        if opportunity_hash in self.seen_opportunities:
            return True
        self.seen_opportunities.add(opportunity_hash)
        return False
    
    def _identify_feature(self, context: str) -> Dict[str, str]:
        """Identify features associated with a monetization opportunity."""
        features = {}
        for feature, data in self.feature_patterns.items():
            if re.search(data['pattern'], context, re.IGNORECASE):
                features[feature] = data['description']
        
        if not features:
            return {'unknown': 'Feature could not be automatically identified'}
        
        return features
    
    def _extract_description(self, context: str, match_text: str) -> str:
        """Extract a meaningful description from the context."""
        # Look for nearby comments
        comment_patterns = [
            r'/\*\*(.*?)\*/',  # JSDoc comments
            r'"""\s*(.*?)\s*"""',  # Python docstrings
            r'//\s*(.+)',  # Single line comments
            r'#\s*(.+)'  # Python/Shell comments
        ]
        
        for pattern in comment_patterns:
            matches = re.finditer(pattern, context, re.DOTALL)
            for match in matches:
                comment = match.group(1).strip()
                if len(comment) > 10:  # Ignore very short comments
                    return comment
        
        # If no good comment is found, generate a description based on context
        words = context.split()
        match_index = words.index(match_text) if match_text in words else len(words) // 2
        start = max(0, match_index - 5)
        end = min(len(words), match_index + 5)
        relevant_words = words[start:end]
        
        return ' '.join(relevant_words)
    
    def _determine_priority(self, context: str, monetization_type: str) -> str:
        """Determine the priority of a monetization opportunity based on context and type."""
        # High priority indicators
        high_priority_indicators = [
            r'(critical|essential|core|primary|main)',
            r'(revenue|profit|income|earnings)',
            r'(subscription|recurring|monthly|annual)',
            r'(premium|enterprise|business)',
            r'(payment|billing|checkout)',
            r'(marketplace|store|shop)',
            r'(api\s+key|api\s+token|api\s+limit)'
        ]
        
        # Medium priority indicators
        medium_priority_indicators = [
            r'(feature|functionality|capability)',
            r'(upgrade|enhancement|improvement)',
            r'(integration|connection|sync)',
            r'(data|analytics|reporting)',
            r'(notification|alert|message)',
            r'(search|filter|sort)',
            r'(upload|file|document)'
        ]
        
        # Low priority indicators
        low_priority_indicators = [
            r'(nice\s+to\s+have|optional|additional)',
            r'(cosmetic|visual|appearance)',
            r'(experimental|beta|alpha)',
            r'(deprecated|legacy|old)',
            r'(debug|test|development)'
        ]
        
        # Check for high priority indicators
        for pattern in high_priority_indicators:
            if re.search(pattern, context, re.IGNORECASE):
                return 'high'
        
        # Check for medium priority indicators
        for pattern in medium_priority_indicators:
            if re.search(pattern, context, re.IGNORECASE):
                return 'medium'
        
        # Check for low priority indicators
        for pattern in low_priority_indicators:
            if re.search(pattern, context, re.IGNORECASE):
                return 'low'
        
        # Default priority based on monetization type
        type_priorities = {
            'subscription': 'high',
            'marketplace': 'high',
            'api': 'high',
            'freemium': 'medium',
            'ads': 'medium',
            'data': 'medium'
        }
        
        return type_priorities.get(monetization_type, 'low')
    
    def _analyze_file(self, file_path: Path) -> None:
        """Analyze a file for monetization opportunities."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for monetization patterns
            for monetization_type, patterns in self.monetization_patterns.items():
                for pattern in patterns:
                    for match in re.finditer(pattern, content, re.IGNORECASE):
                        context_start = max(0, match.start() - 100)
                        context_end = min(len(content), match.end() + 100)
                        context = content[context_start:context_end]
                        
                        # Find the line number
                        line_number = content[:match.start()].count('\n') + 1
                        
                        # Determine priority based on context
                        priority = self._determine_priority(context, monetization_type)
                        
                        # Identify associated features
                        features = self._identify_feature(context)
                        
                        # Extract a description from the context
                        description = self._extract_description(context, match.group(0))
                        
                        opportunity = {
                            'type': monetization_type,
                            'file': str(file_path),
                            'line': line_number,
                            'match': match.group(0),
                            'context': context,
                            'priority': priority,
                            'features': features,
                            'description': description
                        }
                        
                        # Only add if not a duplicate
                        if not self._is_duplicate_opportunity(opportunity):
                            self.results['opportunities'].append(opportunity)
            
            if self.verbose:
                print(f"Analyzed {file_path}")
        
        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")
    
    def _calculate_summary(self) -> None:
        """Calculate summary statistics for the analysis."""
        summary = self.results['summary']
        opportunities = self.results['opportunities']
        
        summary['total_opportunities'] = len(opportunities)
        summary['by_type'] = defaultdict(int)
        summary['by_priority'] = defaultdict(int)
        summary['by_feature'] = defaultdict(int)
        
        for opp in opportunities:
            summary['by_type'][opp['type']] += 1
            summary['by_priority'][opp['priority']] += 1
            for feature in opp['features'].keys():
                summary['by_feature'][feature] += 1
        
        # Convert defaultdict to regular dict for JSON serialization
        summary['by_type'] = dict(summary['by_type'])
        summary['by_priority'] = dict(summary['by_priority'])
        summary['by_feature'] = dict(summary['by_feature'])
    
    def analyze_directory(self, directory_path: str, exclude_patterns: List[str] = None) -> None:
        """Analyze files in a directory for monetization opportunities."""
        if exclude_patterns is None:
            exclude_patterns = ['node_modules', 'dist', 'build', '.git']
        
        directory_path = Path(directory_path)
        
        if not directory_path.is_dir():
            print(f"Error: {directory_path} is not a directory")
            return
        
        # Walk through the directory
        for root, dirs, files in os.walk(directory_path):
            # Skip excluded directories
            dirs[:] = [d for d in dirs if not any(pattern in str(Path(root) / d) for pattern in exclude_patterns)]
            
            for file in files:
                file_path = Path(root) / file
                
                # Only process relevant file types
                if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.py', '.md')):
                    self._analyze_file(file_path)
        
        # Calculate summary
        self._calculate_summary()
    
    def save_results(self, output_file: str) -> None:
        """Save analysis results to a file."""
        try:
            with open(output_file, 'w') as f:
                json.dump(self.results, f, indent=2)
            if self.verbose:
                print(f"Results saved to {output_file}")
        except Exception as e:
            print(f"Error saving results: {e}")

def main():
    parser = argparse.ArgumentParser(description="Analyze codebase for monetization opportunities")
    parser.add_argument("directory", help="Directory to analyze")
    parser.add_argument("--output", "-o", help="Output file", default="monetization_analysis.json")
    parser.add_argument("--verbose", "-v", action="store_true", help="Enable verbose output")
    args = parser.parse_args()
    
    analyzer = RevenuePotentialAnalyzer(verbose=args.verbose)
    analyzer.analyze_directory(args.directory)
    analyzer.save_results(args.output)

if __name__ == "__main__":
    main() 