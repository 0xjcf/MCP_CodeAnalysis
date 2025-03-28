import { getRepository, listFiles } from "../../utils/repository-analyzer.js";
import fs from "fs";
import path from "path";
import { analyzeCode } from "../basic-analysis/analyzer.js";
import { GraphNode } from "../../types/knowledge-graph.js";

/**
 * Sanitize an ID for use in diagrams
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9]/g, '_');
}

/**
 * Generate a dependency graph visualization from a repository or code snippet
 */
export async function generateDependencyGraph(options: {
  repositoryUrl?: string;
  filePath?: string;
  fileContent?: string;
  format: string;
}): Promise<string> {
  const { repositoryUrl, filePath, fileContent, format } = options;
  
  // Gather the dependency data
  let dependencies: Record<string, string[]> = {};
  
  if (repositoryUrl) {
    const repoPath = await getRepository(repositoryUrl);
    
    if (filePath) {
      // Analyze specific file
      const fullPath = path.join(repoPath, filePath);
      const code = fs.readFileSync(fullPath, 'utf8');
      const fileLanguage = path.extname(filePath).slice(1);
      const analysis = analyzeCode(code, fileLanguage);
      dependencies[filePath] = analysis.imports;
    } else {
      // Analyze all files in repository
      const files = listFiles(repoPath);
      dependencies = gatherDependencies(repoPath, files);
    }
  } else if (fileContent) {
    // Analyze provided code snippet
    const analysis = analyzeCode(fileContent);
    dependencies['snippet'] = analysis.imports;
  } else {
    throw new Error("Either repositoryUrl, filePath, or fileContent must be provided");
  }
  
  // Generate the visualization in the requested format
  switch (format) {
    case "mermaid":
      return generateMermaidDependencyGraph(dependencies);
    case "dot":
      return generateDotDependencyGraph(dependencies);
    case "ascii":
      return generateAsciiDependencyGraph(dependencies);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Generate a code structure visualization for classes, functions, etc.
 */
export async function generateCodeStructureVisualization(options: {
  repositoryUrl?: string;
  filePath?: string;
  fileContent?: string;
  showMethods: boolean;
  showAttributes: boolean;
  format: string;
}): Promise<string> {
  const { repositoryUrl, filePath, fileContent, showMethods, showAttributes, format } = options;
  
  // Get the code to analyze
  let code: string;
  let language: string = "";
  
  if (repositoryUrl) {
    const repoPath = await getRepository(repositoryUrl);
    
    if (!filePath) {
      throw new Error("filePath must be provided when repositoryUrl is specified");
    }
    
    const fullPath = path.join(repoPath, filePath);
    code = fs.readFileSync(fullPath, 'utf8');
    language = path.extname(filePath).slice(1);
  } else if (fileContent) {
    code = fileContent;
  } else {
    throw new Error("Either repositoryUrl with filePath, or fileContent must be provided");
  }
  
  // Analyze the code structure
  const analysis = analyzeCode(code, language);
  
  // Generate the visualization in the requested format
  switch (format) {
    case "mermaid":
      return generateMermaidClassDiagram(analysis, { showMethods, showAttributes });
    case "dot":
      return generateDotClassDiagram(analysis, { showMethods, showAttributes });
    case "ascii":
      return generateAsciiClassDiagram(analysis, { showMethods, showAttributes });
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Gather dependencies from all files in a repository
 */
function gatherDependencies(repoPath: string, files: string[]): Record<string, string[]> {
  const dependencies: Record<string, string[]> = {};
  
  for (const file of files) {
    try {
      const fullPath = path.join(repoPath, file);
      const code = fs.readFileSync(fullPath, 'utf8');
      const fileLanguage = path.extname(file).slice(1);
      const analysis = analyzeCode(code, fileLanguage);
      dependencies[file] = analysis.imports;
    } catch (error) {
      console.warn(`Error analyzing ${file}: ${(error as Error).message}`);
    }
  }
  
  return dependencies;
}

/**
 * Generate a Mermaid dependency graph
 */
function generateMermaidDependencyGraph(dependencies: Record<string, string[]>): string {
  let mermaid = "graph TD;\n";
  
  for (const [file, imports] of Object.entries(dependencies)) {
    const safeFile = sanitizeId(file);
    
    // Add the file node
    mermaid += `  ${safeFile}["${file}"];\n`;
    
    // Add dependencies
    for (const importItem of imports) {
      const safeImport = sanitizeId(importItem);
      mermaid += `  ${safeFile} --> ${safeImport}["${importItem}"];\n`;
    }
  }
  
  return mermaid;
}

/**
 * Generate a DOT dependency graph
 */
function generateDotDependencyGraph(dependencies: Record<string, string[]>): string {
  let dot = "digraph DependencyGraph {\n";
  dot += "  node [shape=box];\n";
  
  for (const [file, imports] of Object.entries(dependencies)) {
    const safeFile = sanitizeId(file);
    
    // Add the file node
    dot += `  "${safeFile}" [label="${file}"];\n`;
    
    // Add dependencies
    for (const importItem of imports as string[]) {
      const safeImport = sanitizeId(importItem);
      dot += `  "${safeFile}" -> "${safeImport}";\n`;
    }
  }
  
  dot += "}";
  return dot;
}

/**
 * Generate a simple ASCII dependency graph
 */
function generateAsciiDependencyGraph(dependencies: Record<string, string[]>): string {
  let ascii = "Dependency Graph:\n\n";
  
  for (const [file, imports] of Object.entries(dependencies)) {
    ascii += `${file}\n`;
    
    for (const importItem of imports) {
      ascii += `  └─> ${importItem}\n`;
    }
    
    ascii += "\n";
  }
  
  return ascii;
}

/**
 * Generate a Mermaid class diagram
 */
function generateMermaidClassDiagram(analysis: any, options: { showMethods: boolean, showAttributes: boolean }): string {
  const { classes, functions } = analysis;
  const { showMethods, showAttributes } = options;
  
  let mermaid = "classDiagram\n";
  
  // Add classes
  for (const className of classes) {
    mermaid += `  class ${className} {\n`;
    
    // Add attributes and methods if available and requested
    if (showAttributes) {
      mermaid += `    +attribute: type\n`;  // Placeholder - would need actual analysis
    }
    
    if (showMethods) {
      mermaid += `    +method()\n`;  // Placeholder - would need actual analysis
    }
    
    mermaid += "  }\n";
  }
  
  // Add standalone functions if no classes
  if (classes.length === 0 && functions.length > 0) {
    mermaid += `  class Functions {\n`;
    
    for (const func of functions) {
      mermaid += `    +${func}()\n`;
    }
    
    mermaid += "  }\n";
  }
  
  return mermaid;
}

/**
 * Generate a DOT class diagram
 */
function generateDotClassDiagram(analysis: any, options: { showMethods: boolean, showAttributes: boolean }): string {
  const { classes, functions } = analysis;
  const { showMethods, showAttributes } = options;
  
  let dot = "digraph ClassDiagram {\n";
  dot += "  node [shape=record];\n";
  
  // Add classes
  for (const className of classes) {
    dot += `  ${className} [label="{${className}`;
    
    if (showAttributes) {
      dot += "|+ attribute : type";  // Placeholder - would need actual analysis
    }
    
    if (showMethods) {
      dot += "|+ method()";  // Placeholder - would need actual analysis
    }
    
    dot += "}\";\n";
  }
  
  // Add standalone functions if no classes
  if (classes.length === 0 && functions.length > 0) {
    dot += `  Functions [label="{Functions`;
    
    if (functions.length > 0) {
      dot += "|";
      dot += functions.map((f: string) => `+ ${f}()`).join("\\l");
      dot += "\\l";
    }
    
    dot += "}\";\n";
  }
  
  dot += "}";
  return dot;
}

/**
 * Generate a simple ASCII class diagram
 */
function generateAsciiClassDiagram(analysis: any, options: { showMethods: boolean, showAttributes: boolean }): string {
  const { classes, functions } = analysis;
  const { showMethods, showAttributes } = options;
  
  let ascii = "Class Diagram:\n\n";
  
  // Add classes
  for (const className of classes) {
    ascii += `+----------------------+\n`;
    ascii += `|       ${className}       |\n`;
    ascii += `+----------------------+\n`;
    
    if (showAttributes) {
      ascii += `| + attribute: type    |\n`;  // Placeholder - would need actual analysis
    }
    
    if (showMethods) {
      ascii += `| + method()           |\n`;  // Placeholder - would need actual analysis
    }
    
    ascii += `+----------------------+\n\n`;
  }
  
  // Add standalone functions if no classes
  if (classes.length === 0 && functions.length > 0) {
    ascii += `+----------------------+\n`;
    ascii += `|      Functions       |\n`;
    ascii += `+----------------------+\n`;
    
    for (const func of functions) {
      ascii += `| + ${func}()${' '.repeat(Math.max(0, 16 - func.length))}|\n`;
    }
    
    ascii += `+----------------------+\n`;
  }
  
  return ascii;
}

function generateNodeVisualization(node: GraphNode): string {
  // Check for valid node types
  if (!["function", "file", "class", "variable", "dependency", "concept", "repository"].includes(node.type)) {
    throw new Error(`Invalid node type: ${node.type}`);
  }
  
  // Format the node in a meaningful way based on type
  switch(node.type) {
    case "file":
      return `File: ${node.name}`;
    case "function":
      return `Function: ${node.name}()`;
    case "class":
      return `Class: ${node.name}`;
    case "variable":
      return `Variable: ${node.name}`;
    case "dependency":
      return `Dependency: ${node.name}`;
    case "concept":
      return `Concept: ${node.name}`;
    case "repository":
      return `Repository: ${node.name}`;
    default:
      return `${node.type}: ${node.name}`;
  }
} 