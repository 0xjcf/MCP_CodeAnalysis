import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Detect the root directory of the current project
 */
export async function detectCurrentProject(startDir = process.cwd()): Promise<string> {
  let currentDir = startDir;
  
  // Define project markers in order of preference
  const projectMarkers = [
    '.git',            // Git repository
    'package.json',    // Node.js project
    'cargo.toml',      // Rust project
    'pom.xml',         // Maven (Java) project
    'build.gradle',    // Gradle (Java) project
  ];
  
  // Walk up the directory tree until we find a project marker or hit the filesystem root
  while (currentDir !== path.parse(currentDir).root) {
    // Check for project markers
    for (const marker of projectMarkers) {
      const markerPath = path.join(currentDir, marker);
      if (fs.existsSync(markerPath)) {
        return currentDir;
      }
    }
    
    // Move up to parent directory
    currentDir = path.dirname(currentDir);
  }
  
  // If no project marker found, return the starting directory
  return startDir;
}

/**
 * Get information about the detected project
 */
export function getProjectInfo(projectRoot: string): {
  type: string;
  name: string;
  isGitRepo: boolean;
} {
  const info = {
    type: 'unknown',
    name: path.basename(projectRoot),
    isGitRepo: fs.existsSync(path.join(projectRoot, '.git'))
  };
  
  // Detect project type
  if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
    info.type = 'node';
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
      if (packageJson.name) {
        info.name = packageJson.name;
      }
    } catch (e) {
      // Ignore JSON parsing errors
    }
  } else if (fs.existsSync(path.join(projectRoot, 'cargo.toml'))) {
    info.type = 'rust';
  } else if (fs.existsSync(path.join(projectRoot, 'pom.xml'))) {
    info.type = 'java-maven';
  } else if (fs.existsSync(path.join(projectRoot, 'build.gradle'))) {
    info.type = 'java-gradle';
  }
  
  return info;
}

/**
 * Get a list of changed files in the repository
 */
export function getChangedFiles(repoPath: string): string[] {
  try {
    const output = execSync('git diff --name-only', { cwd: repoPath }).toString();
    const stagedOutput = execSync('git diff --staged --name-only', { cwd: repoPath }).toString();
    
    const files = [...output.split('\n'), ...stagedOutput.split('\n')]
      .filter(file => file.trim() !== '')
      .map(file => path.resolve(repoPath, file));
    
    return [...new Set(files)]; // Remove duplicates
  } catch (error) {
    return [];
  }
} 