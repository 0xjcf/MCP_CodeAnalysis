import fs from 'fs/promises';
import path from 'path';

interface FileMetrics {
  filePath: string;
  language: string;
  lineCount: number;
  emptyLines: number;
  commentLines: number;
  codeLines: number;
  cyclomaticComplexity: number;
  functions?: {
    name: string;
    lineCount: number;
    complexity: number;
    params: number;
  }[];
}

interface ProjectMetrics {
  totalFiles: number;
  totalLines: number;
  totalCodeLines: number;
  totalCommentLines: number;
  averageComplexity: number;
  filesByLanguage: Record<string, number>;
  files?: FileMetrics[];
}

/**
 * Analyze code metrics for a repository
 */
export async function analyzeCodeMetrics(repositoryPath: string): Promise<ProjectMetrics> {
  // Find all code files
  const files = await findCodeFiles(repositoryPath);
  
  // Analyze each file
  const fileMetrics: FileMetrics[] = [];
  let totalComplexity = 0;
  
  for (const file of files) {
    const filePath = path.join(repositoryPath, file);
    const language = detectLanguage(file);
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const metrics = analyzeFileMetrics(content, language);
      
      fileMetrics.push({
        filePath: file,
        language,
        ...metrics
      });
      
      totalComplexity += metrics.cyclomaticComplexity;
    } catch (error) {
      console.error(`Error analyzing file ${file}:`, error);
    }
  }
  
  // Compile project-level metrics
  const totalLines = fileMetrics.reduce((sum, file) => sum + file.lineCount, 0);
  const totalCodeLines = fileMetrics.reduce((sum, file) => sum + file.codeLines, 0);
  const totalCommentLines = fileMetrics.reduce((sum, file) => sum + file.commentLines, 0);
  
  // Count files by language
  const filesByLanguage: Record<string, number> = {};
  for (const file of fileMetrics) {
    filesByLanguage[file.language] = (filesByLanguage[file.language] || 0) + 1;
  }
  
  return {
    totalFiles: fileMetrics.length,
    totalLines,
    totalCodeLines,
    totalCommentLines,
    averageComplexity: fileMetrics.length > 0 ? totalComplexity / fileMetrics.length : 0,
    filesByLanguage,
    files: fileMetrics
  };
}

/**
 * Find all code files in a repository
 */
async function findCodeFiles(repositoryPath: string): Promise<string[]> {
  const patterns = [
    '**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx',
    '**/*.py', '**/*.java', '**/*.c', '**/*.cpp', '**/*.h',
    '**/*.cs', '**/*.go', '**/*.rb', '**/*.php'
  ];
  
  const files: string[] = [];
  
  async function scanDir(currentDir: string, relativePath: string = '') {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryRelativePath = path.join(relativePath, entry.name);
        const entryPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip node_modules and other common excluded directories
          if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
            await scanDir(entryPath, entryRelativePath);
          }
        } else {
          // Check if file matches any of our patterns
          const ext = path.extname(entry.name).toLowerCase();
          if (['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.h', '.cs', '.go', '.rb', '.php'].includes(ext)) {
            files.push(entryRelativePath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${currentDir}:`, error);
    }
  }
  
  await scanDir(repositoryPath);
  return files;
}

/**
 * Detect language based on file extension
 */
function detectLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  
  switch (ext) {
    case '.js':
      return 'JavaScript';
    case '.ts':
      return 'TypeScript';
    case '.jsx':
      return 'JavaScript (React)';
    case '.tsx':
      return 'TypeScript (React)';
    case '.py':
      return 'Python';
    case '.java':
      return 'Java';
    case '.c':
      return 'C';
    case '.cpp':
    case '.cc':
    case '.cxx':
      return 'C++';
    case '.cs':
      return 'C#';
    case '.go':
      return 'Go';
    case '.rb':
      return 'Ruby';
    case '.php':
      return 'PHP';
    default:
      return 'Unknown';
  }
}

/**
 * Analyze metrics for a single file
 */
function analyzeFileMetrics(content: string, language: string): {
  lineCount: number;
  emptyLines: number;
  commentLines: number;
  codeLines: number;
  cyclomaticComplexity: number;
  functions: {
    name: string;
    lineCount: number;
    complexity: number;
    params: number;
  }[];
} {
  const lines = content.split('\n');
  const lineCount = lines.length;
  
  // Count empty lines
  const emptyLines = lines.filter(line => line.trim() === '').length;
  
  // Count comment lines - simplified implementation
  let commentLines = 0;
  let inBlockComment = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (inBlockComment) {
      commentLines++;
      if (trimmed.includes('*/')) {
        inBlockComment = false;
      }
    } else if (trimmed.startsWith('/*')) {
      commentLines++;
      if (!trimmed.includes('*/')) {
        inBlockComment = true;
      }
    } else if (
      (language === 'JavaScript' || language === 'TypeScript' || language === 'Java' || language === 'C' || language === 'C++' || language === 'Go') && trimmed.startsWith('//')
    ) {
      commentLines++;
    } else if (language === 'Python' && (trimmed.startsWith('#') || trimmed.startsWith('"""') || trimmed.startsWith("'''"))) {
      commentLines++;
    }
  }
  
  const codeLines = lineCount - emptyLines - commentLines;
  
  // Calculate cyclomatic complexity (simplified)
  let cyclomaticComplexity = 1;
  
  // Count conditional statements and loops
  if (language === 'JavaScript' || language === 'TypeScript' || language === 'Java' || language === 'C' || language === 'C++') {
    for (const line of lines) {
      if (line.includes('if ') || line.includes('else if ') || line.includes('else ') || 
          line.includes('for ') || line.includes('while ') || line.includes('case ') || 
          line.includes('catch ') || line.includes('&&') || line.includes('||')) {
        cyclomaticComplexity++;
      }
    }
  } else if (language === 'Python') {
    for (const line of lines) {
      if (line.includes('if ') || line.includes('elif ') || line.includes('else:') || 
          line.includes('for ') || line.includes('while ') || line.includes('except:') || 
          line.includes(' and ') || line.includes(' or ')) {
        cyclomaticComplexity++;
      }
    }
  }
  
  // Extract functions (simplified)
  const functions: {
    name: string;
    lineCount: number;
    complexity: number;
    params: number;
  }[] = [];
  
  // This is a simplistic implementation; real parsing would use an AST
  // But for demonstrating the feature it gives reasonable approximation
  let currentFunction = null;
  let functionStartLine = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Function detection based on language
    if (language === 'JavaScript' || language === 'TypeScript') {
      // Match function declarations
      const funcDecl = line.match(/function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/);
      const arrowFunc = line.match(/^(const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(?:\([^)]*\)|[a-zA-Z0-9_$]+)\s*=>/);
      
      if (funcDecl || arrowFunc) {
        if (currentFunction) {
          // End previous function
          functions.push({
            name: currentFunction,
            lineCount: i - functionStartLine,
            complexity: 1, // Simplified
            params: 0 // Simplified
          });
        }
        
        currentFunction = funcDecl ? funcDecl[1] : (arrowFunc ? arrowFunc[2] : 'anonymous');
        functionStartLine = i;
      } else if (currentFunction && line === '}') {
        // Detect end of function
        functions.push({
          name: currentFunction,
          lineCount: i - functionStartLine,
          complexity: 1, // Simplified
          params: 0 // Simplified
        });
        currentFunction = null;
      }
    }
  }
  
  return {
    lineCount,
    emptyLines,
    commentLines,
    codeLines,
    cyclomaticComplexity,
    functions
  };
} 