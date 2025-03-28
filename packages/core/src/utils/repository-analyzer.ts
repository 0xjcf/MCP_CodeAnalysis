import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import os from "os";
import { createDatabase } from "./database.js";
import { Database } from "sqlite";

let repoCacheDb: Database | undefined; // Will be initialized in getRepository

/**
 * Get a local copy of a repository, either by cloning or updating an existing clone
 */
export async function getRepository(pathOrUrl: string): Promise<string> {
  // If it's a local directory that exists, just return it
  if (fs.existsSync(pathOrUrl) && fs.statSync(pathOrUrl).isDirectory()) {
    return path.resolve(pathOrUrl);
  }
  
  // Initialize the database if it hasn't been initialized
  if (!repoCacheDb) {
    repoCacheDb = await createDatabase("repository_cache");
  }
  
  if (!repoCacheDb) {
    throw new Error("Failed to initialize repository cache database");
  }

  // Check if repository is already cached
  const existingRepo = await repoCacheDb.get(
    "SELECT localPath, lastUpdated FROM repositories WHERE url = ?",
    [pathOrUrl]
  );
  
  // Generate a consistent path for the repo
  const repoHash = createHash(pathOrUrl);
  const repoPath = path.join(os.tmpdir(), "codeanalysis-repos", repoHash);
  
  // If repo exists locally and is recent enough, use it
  if (existingRepo && fs.existsSync(existingRepo.localPath)) {
    try {
      // Update existing repo
      console.log(`Updating existing repository at ${existingRepo.localPath}`);
      execSync("git fetch --all", { cwd: existingRepo.localPath });
      execSync("git reset --hard origin/main", { cwd: existingRepo.localPath });
      
      // Update last updated timestamp
      await repoCacheDb.run(
        "UPDATE repositories SET lastUpdated = ? WHERE url = ?",
        [new Date().toISOString(), pathOrUrl]
      );
      
      return existingRepo.localPath;
    } catch (error) {
      console.warn(`Error updating repository: ${(error as Error).message}`);
      // Fall through to clone the repository
    }
  }
  
  // Create directory if it doesn't exist
  fs.mkdirSync(path.dirname(repoPath), { recursive: true });
  
  try {
    // Clone the repository
    console.log(`Cloning repository from ${pathOrUrl} to ${repoPath}`);
    execSync(`git clone ${pathOrUrl} ${repoPath}`);
    
    // Store in cache
    await repoCacheDb.run(
      "INSERT OR REPLACE INTO repositories (url, localPath, lastUpdated) VALUES (?, ?, ?)",
      [pathOrUrl, repoPath, new Date().toISOString()]
    );
    
    return repoPath;
  } catch (error) {
    throw new Error(`Failed to clone repository: ${(error as Error).message}`);
  }
}

/**
 * Create a hash from a string for consistent path generation
 */
function createHash(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex').slice(0, 16);
}

/**
 * Check if a path is a valid local directory or repository URL
 */
export function isValidRepositoryPath(pathOrUrl: string): boolean {
  // Check if it's a local directory that exists
  if (fs.existsSync(pathOrUrl) && fs.statSync(pathOrUrl).isDirectory()) {
    return true;
  }
  
  // Check if it looks like a valid git URL
  const gitUrlPattern = /^(https?:\/\/|git@).*\.git$/;
  return gitUrlPattern.test(pathOrUrl);
}

/**
 * Enhance listFiles to handle both absolute and relative paths
 */
export function listFiles(repoPath: string, extensions?: string[]): string[] {
  // Ensure we have an absolute path
  const absolutePath = path.isAbsolute(repoPath) ? repoPath : path.resolve(repoPath);
  
  // Rest of the function remains the same
  const results: string[] = [];
  
  function traverseDir(currentPath: string) {
    if (!fs.existsSync(currentPath)) {
      console.warn(`Path doesn't exist: ${currentPath}`);
      return;
    }
    
    const files = fs.readdirSync(currentPath);
    
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      
      // Skip node_modules and other common ignore directories
      if (stat.isDirectory()) {
        if (!['.git', 'node_modules', 'dist', 'build', 'coverage'].includes(file)) {
          traverseDir(fullPath);
        }
      } else if (!extensions || extensions.some(ext => file.endsWith(ext))) {
        // Add file if it matches the extension filter or no filter is provided
        results.push(path.relative(absolutePath, fullPath));
      }
    }
  }
  
  traverseDir(absolutePath);
  return results;
} 