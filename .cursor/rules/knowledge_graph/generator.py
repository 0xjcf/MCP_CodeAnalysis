#!/usr/bin/env python3
# MEMORY_ANCHOR: knowledge_graph_generator

"""Knowledge Graph Generator

This script generates a centralized knowledge graph by integrating data from
the project source code and documentation.

Maturity: beta

Why:
A centralized knowledge graph provides a unified view of the codebase,
making it easier to understand relationships between components, errors,
and solutions. This approach was chosen over separate data stores to
enable more powerful queries and visualizations.
"""

import os
import json
import glob
import yaml
import datetime
import argparse
from pathlib import Path
from typing import Dict, List, Any, Tuple

def setup_paths(output_path=None):
    """Setup paths for the knowledge graph generator."""
    if output_path:
        output_file = Path(output_path)
        base_dir = output_file.parent if str(output_path).startswith('/') else Path.cwd()
    else:
        base_dir = Path.cwd()
        output_file = base_dir / "knowledge_graph.json"
    
    src_dir = base_dir / "src"
    docs_dir = base_dir / "docs"
    tools_dir = base_dir / "tools"
    
    return base_dir, src_dir, docs_dir, tools_dir, output_file

def load_json_file(file_path: Path) -> Dict:
    """Load a JSON file."""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {file_path}: {e}")
        return {}

def scan_source_files(src_dir: Path) -> Tuple[List[Dict], List[Dict]]:
    """Scan source files to build component and dependency information."""
    nodes = []
    edges = []
    
    if not src_dir.exists():
        return nodes, edges
    
    # Scan for TypeScript/JavaScript files
    for file_path in src_dir.rglob('*.[tj]s'):
        relative_path = file_path.relative_to(src_dir)
        component_name = relative_path.parent.name
        
        # Add file node
        file_id = f"file:{relative_path}"
        nodes.append({
            "id": file_id,
            "type": "file",
            "name": file_path.name,
            "path": str(relative_path),
            "component": component_name
        })
        
        # If this is an index file, create component node
        if file_path.stem == 'index':
            component_id = f"component:{component_name}"
            nodes.append({
                "id": component_id,
                "type": "component",
                "name": component_name,
                "path": str(relative_path.parent)
            })
            edges.append({
                "source": component_id,
                "target": file_id,
                "type": "contains"
            })
        
        # Add basic import relationships
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                for line in content.split('\n'):
                    if line.strip().startswith('import '):
                        # Very basic import detection - could be improved
                        import_path = line.split('from')[1].strip().strip('\'"')
                        edges.append({
                            "source": file_id,
                            "target": f"file:{import_path}",
                            "type": "imports"
                        })
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    return nodes, edges

def scan_documentation(docs_dir: Path) -> Tuple[List[Dict], List[Dict]]:
    """Scan documentation files to build concept nodes and relationships."""
    nodes = []
    edges = []
    
    if not docs_dir.exists():
        return nodes, edges
    
    # Scan for markdown files
    for file_path in docs_dir.rglob('*.md'):
        relative_path = file_path.relative_to(docs_dir)
        doc_id = f"doc:{relative_path}"
        
        nodes.append({
            "id": doc_id,
            "type": "documentation",
            "name": file_path.stem,
            "path": str(relative_path)
        })
        
        # Try to extract relationships from markdown links
        try:
            with open(file_path, 'r') as f:
                content = f.read()
                for line in content.split('\n'):
                    if '[' in line and '](' in line:
                        # Basic markdown link detection
                        target = line[line.find('](') + 2:line.find(')')]
                        if target.endswith('.md'):
                            edges.append({
                                "source": doc_id,
                                "target": f"doc:{target}",
                                "type": "references"
                            })
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
    
    return nodes, edges

def generate_knowledge_graph(output_path: str = None) -> Dict:
    """Generate the knowledge graph from project structure."""
    base_dir, src_dir, docs_dir, tools_dir, output_file = setup_paths(output_path)
    
    # Initialize empty graph
    graph = {
        "nodes": [],
        "edges": [],
        "metadata": {
            "version": "1.0",
            "generated_at": datetime.datetime.now().isoformat(),
            "base_directory": str(base_dir)
        }
    }
    
    # Scan source files
    src_nodes, src_edges = scan_source_files(src_dir)
    graph["nodes"].extend(src_nodes)
    graph["edges"].extend(src_edges)
    
    # Scan documentation
    doc_nodes, doc_edges = scan_documentation(docs_dir)
    graph["nodes"].extend(doc_nodes)
    graph["edges"].extend(doc_edges)
    
    # Save the graph
    try:
        output_file.parent.mkdir(parents=True, exist_ok=True)
        with open(output_file, 'w') as f:
            json.dump(graph, f, indent=2)
        print(f"Knowledge graph saved to {output_file}")
    except Exception as e:
        print(f"Error saving knowledge graph: {e}")
        return graph
    
    return graph

def main():
    parser = argparse.ArgumentParser(description="Generate knowledge graph from project structure")
    parser.add_argument("--output", help="Output file path", default="knowledge_graph.json")
    args = parser.parse_args()
    
    generate_knowledge_graph(args.output)

if __name__ == "__main__":
    main() 