import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface DependencyNode {
  name: string;
  version?: string;
  type: 'direct' | 'dev' | 'peer' | 'internal' | 'external';
  path?: string;
}

interface DependencyEdge {
  source: string;
  target: string;
  type: 'imports' | 'requires' | 'uses';
}

interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

/**
 * Analyze dependencies in a repository
 */
export async function analyzeDependencies(repositoryPath: string): Promise<{
  graph: DependencyGraph;
  summary: {
    totalDependencies: number;
    directDependencies: number;
    devDependencies: number;
    internalDependencies: number;
  };
}> {
  if (!repositoryPath) {
    throw new Error("Repository path is required");
  }
  
  // Detect project type
  const projectType = await detectProjectType(repositoryPath);
  
  let dependencyGraph: DependencyGraph;
  
  // Analyze based on project type
  switch (projectType) {
    case 'node':
      dependencyGraph = await analyzeNodeDependencies(repositoryPath);
      break;
    case 'python':
      dependencyGraph = await analyzePythonDependencies(repositoryPath);
      break;
    case 'java':
      dependencyGraph = await analyzeJavaDependencies(repositoryPath);
      break;
    default:
      dependencyGraph = await analyzeGenericDependencies(repositoryPath);
  }
  
  // Generate summary
  const summary = {
    totalDependencies: dependencyGraph.nodes.length,
    directDependencies: dependencyGraph.nodes.filter(n => n.type === 'direct').length,
    devDependencies: dependencyGraph.nodes.filter(n => n.type === 'dev').length,
    internalDependencies: dependencyGraph.nodes.filter(n => n.type === 'internal').length
  };
  
  return {
    graph: dependencyGraph,
    summary
  };
}

/**
 * Detect the type of project in the repository
 */
async function detectProjectType(repositoryPath: string): Promise<string> {
  try {
    // Check for package.json (Node.js)
    if (await fileExists(path.join(repositoryPath, 'package.json'))) {
      return 'node';
    }
    
    // Check for requirements.txt or setup.py (Python)
    if (
      await fileExists(path.join(repositoryPath, 'requirements.txt')) ||
      await fileExists(path.join(repositoryPath, 'setup.py'))
    ) {
      return 'python';
    }
    
    // Check for pom.xml or build.gradle (Java)
    if (
      await fileExists(path.join(repositoryPath, 'pom.xml')) ||
      await fileExists(path.join(repositoryPath, 'build.gradle'))
    ) {
      return 'java';
    }
    
    // Default to generic
    return 'generic';
  } catch (error) {
    console.error('Error detecting project type:', error);
    return 'generic';
  }
}

/**
 * Analyze Node.js dependencies
 */
async function analyzeNodeDependencies(repositoryPath: string): Promise<DependencyGraph> {
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];
  
  try {
    // Read package.json to extract dependencies
    const packageJsonPath = path.join(repositoryPath, 'package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    // Add direct dependencies
    if (packageJson.dependencies) {
      for (const [name, version] of Object.entries(packageJson.dependencies)) {
        nodes.push({
          name,
          version: version as string,
          type: 'direct'
        });
      }
    }
    
    // Add dev dependencies
    if (packageJson.devDependencies) {
      for (const [name, version] of Object.entries(packageJson.devDependencies)) {
        nodes.push({
          name,
          version: version as string,
          type: 'dev'
        });
      }
    }
    
    // Find all JS/TS files
    const files = await findFiles(repositoryPath, ['.js', '.ts', '.jsx', '.tsx']);
    
    // Analyze imports in each file
    for (const file of files) {
      const fullPath = path.join(repositoryPath, file);
      const content = await fs.readFile(fullPath, 'utf8');
      
      // Extract imports
      const imports = extractImports(content);
      
      for (const importPath of imports) {
        if (importPath.startsWith('.')) {
          // Internal file import
          const targetPath = path.resolve(path.dirname(fullPath), importPath);
          const relativePath = path.relative(repositoryPath, targetPath);
          
          // Add node if it doesn't exist
          if (!nodes.some(n => n.path === relativePath)) {
            nodes.push({
              name: relativePath,
              type: 'internal',
              path: relativePath
            });
          }
          
          // Add edge
          edges.push({
            source: file,
            target: relativePath,
            type: 'imports'
          });
        } else {
          // External package import
          const packageName = importPath.split('/')[0];
          
          // Add edge to the dependency
          edges.push({
            source: file,
            target: packageName,
            type: 'imports'
          });
        }
      }
    }
    
    return { nodes, edges };
  } catch (error) {
    console.error('Error analyzing Node.js dependencies:', error);
    return { nodes: [], edges: [] };
  }
}

/**
 * Analyze Python dependencies
 */
async function analyzePythonDependencies(repositoryPath: string): Promise<DependencyGraph> {
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];
  
  try {
    // Read requirements.txt if it exists
    const requirementsPath = path.join(repositoryPath, 'requirements.txt');
    if (await fileExists(requirementsPath)) {
      const content = await fs.readFile(requirementsPath, 'utf8');
      const lines = content.split('\n');
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          // Extract package name and version
          const parts = trimmed.split('==');
          const name = parts[0].trim();
          const version = parts.length > 1 ? parts[1].trim() : undefined;
          
          nodes.push({
            name,
            version,
            type: 'direct'
          });
        }
      }
    }
    
    // Find all Python files
    const files = await findFiles(repositoryPath, ['.py']);
    
    // Analyze imports in each file
    for (const file of files) {
      const fullPath = path.join(repositoryPath, file);
      const content = await fs.readFile(fullPath, 'utf8');
      
      // Extract Python imports
      const lines = content.split('\n');
      for (const line of lines) {
        const importMatch = line.match(/^\s*import\s+([a-zA-Z0-9_,.]+)/) || 
                            line.match(/^\s*from\s+([a-zA-Z0-9_.]+)\s+import/);
        
        if (importMatch) {
          const moduleName = importMatch[1].split('.')[0];
          
          // Add edge
          edges.push({
            source: file,
            target: moduleName,
            type: 'imports'
          });
        }
      }
    }
    
    return { nodes, edges };
  } catch (error) {
    console.error('Error analyzing Python dependencies:', error);
    return { nodes: [], edges: [] };
  }
}

/**
 * Analyze Java dependencies
 */
async function analyzeJavaDependencies(repositoryPath: string): Promise<DependencyGraph> {
  // Simplified implementation for Java
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];
  
  // In a real implementation, you would parse pom.xml or build.gradle
  // and analyze import statements in Java files
  
  return { nodes, edges };
}

/**
 * Generic dependency analysis for any codebase
 */
async function analyzeGenericDependencies(repositoryPath: string): Promise<DependencyGraph> {
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];
  
  try {
    // Find all code files
    const fileExtensions = ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.go', '.rb', '.php'];
    const files = await findFiles(repositoryPath, fileExtensions);
    
    // Add each file as a node
    for (const file of files) {
      nodes.push({
        name: file,
        type: 'internal',
        path: file
      });
    }
    
    // Simple content-based analysis to detect potential dependencies
    for (const file of files) {
      const fullPath = path.join(repositoryPath, file);
      const content = await fs.readFile(fullPath, 'utf8');
      
      // Check for references to other files
      for (const otherFile of files) {
        if (file !== otherFile) {
          const otherFileName = path.basename(otherFile);
          if (content.includes(otherFileName)) {
            edges.push({
              source: file,
              target: otherFile,
              type: 'uses'
            });
          }
        }
      }
    }
    
    return { nodes, edges };
  } catch (error) {
    console.error('Error analyzing generic dependencies:', error);
    return { nodes: [], edges: [] };
  }
}

/**
 * Extract imports from JavaScript/TypeScript code
 */
function extractImports(content: string): string[] {
  const imports: string[] = [];
  
  // Match ES6 imports
  const es6Regex = /import\s+(?:.+\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  while ((match = es6Regex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // Match CommonJS requires
  const cjsRegex = /require\(['"]([^'"]+)['"]\)/g;
  while ((match = cjsRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

/**
 * Find files with specific extensions in a directory
 */
async function findFiles(dir: string, extensions: string[]): Promise<string[]> {
  const files: string[] = [];
  
  async function scanDir(currentDir: string, relativePath: string = '') {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryRelativePath = path.join(relativePath, entry.name);
      const entryPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and other common excluded directories
        if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
          await scanDir(entryPath, entryRelativePath);
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(entryRelativePath);
      }
    }
  }
  
  await scanDir(dir);
  return files;
}

/**
 * Check if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
} 