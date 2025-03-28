import { getRepository, listFiles } from "../../utils/repository-analyzer.js";
import { analyzeCode } from "../../features/basic-analysis/analyzer.js";
import { buildKnowledgeGraph, queryKnowledgeGraph } from "../knowledge-graph/graph-manager.js";
import { GraphNode, GraphRelationship } from "../../types/knowledge-graph.js";
import path from "path";
import fs from "fs";

/**
 * Analyze relationships between multiple repositories
 */
export async function analyzeMultipleRepositories(
  primaryRepoUrl: string,
  relatedRepoUrls: string[],
  analysisType: "dependencies" | "api-usage" | "architectural-patterns",
  contextDepth: number = 2
): Promise<any> {
  // Step 1: Clone/update all repositories
  const primaryRepoPath = await getRepository(primaryRepoUrl);
  const relatedRepoPaths = await Promise.all(
    relatedRepoUrls.map(url => getRepository(url))
  );
  
  // Step 2: Build knowledge graphs for each repository
  console.log(`Building knowledge graph for primary repository: ${primaryRepoUrl}`);
  const primaryGraph = await buildKnowledgeGraph(primaryRepoUrl, contextDepth, false);
  
  console.log(`Building knowledge graphs for ${relatedRepoUrls.length} related repositories`);
  const relatedGraphsPromises = relatedRepoUrls.map(async (url, index) => {
    console.log(`Building graph for related repository ${index + 1}: ${url}`);
    return {
      url,
      graph: await buildKnowledgeGraph(url, contextDepth, false)
    };
  });
  
  const relatedGraphs = await Promise.all(relatedGraphsPromises);
  
  // Step 3: Analyze cross-repository relationships based on analysis type
  let crossRepoRelationships;
  
  switch (analysisType) {
    case "dependencies":
      crossRepoRelationships = await analyzeCrossDependencies(
        primaryRepoUrl,
        relatedRepoUrls
      );
      break;
    case "api-usage":
      crossRepoRelationships = await analyzeApiUsage(
        primaryRepoUrl,
        relatedRepoUrls
      );
      break;
    case "architectural-patterns":
      crossRepoRelationships = await analyzeArchitecturalPatterns(
        primaryRepoUrl,
        relatedRepoUrls
      );
      break;
    default:
      throw new Error(`Unknown analysis type: ${analysisType}`);
  }
  
  // Step 4: Prepare the result
  return {
    primaryRepository: {
      url: primaryRepoUrl,
      summary: await summarizeRepository(primaryRepoUrl)
    },
    relatedRepositories: await Promise.all(relatedRepoUrls.map(async (url) => ({
      url,
      summary: await summarizeRepository(url)
    }))),
    relationships: crossRepoRelationships,
    analysisType
  };
}

/**
 * Analyze dependencies between repositories
 */
async function analyzeCrossDependencies(
  primaryRepoUrl: string,
  relatedRepoUrls: string[]
): Promise<any> {
  const results: any[] = [];
  
  // Step 1: Get dependency nodes from primary repo
  const primaryResult = await queryKnowledgeGraph({
    query: "dependencies",
    repositoryUrl: primaryRepoUrl,
    contextDepth: 2
  });
  
  const primaryDependencies = primaryResult.nodes.filter(
    node => node.type === "dependency"
  );
  
  // Step 2: For each related repo, find matching dependencies
  for (const relatedUrl of relatedRepoUrls) {
    const relatedResult = await queryKnowledgeGraph({
      query: "dependencies", 
      repositoryUrl: relatedUrl,
      contextDepth: 2
    });
    
    const relatedDependencies = relatedResult.nodes.filter(
      node => node.type === "dependency"
    );
    
    // Find shared dependencies
    const sharedDependencies = primaryDependencies.filter(primaryDep => 
      relatedDependencies.some(relatedDep => 
        primaryDep.name === relatedDep.name
      )
    );
    
    if (sharedDependencies.length > 0) {
      results.push({
        primaryRepository: primaryRepoUrl,
        relatedRepository: relatedUrl,
        type: "shared-dependencies",
        items: sharedDependencies.map(dep => ({
          name: dep.name,
          details: dep.attributes
        }))
      });
    }
  }
  
  return results;
}

/**
 * Analyze API usage between repositories
 */
async function analyzeApiUsage(
  primaryRepoUrl: string,
  relatedRepoUrls: string[]
): Promise<any> {
  // This is a more complex analysis that would identify:
  // 1. Exported functions/classes from the primary repo
  // 2. Usage of those exports in related repos
  
  // For now, return a placeholder implementation
  return {
    message: "API usage analysis not fully implemented yet",
    primaryRepository: primaryRepoUrl,
    relatedRepositories: relatedRepoUrls
  };
}

/**
 * Analyze architectural patterns across repositories
 */
async function analyzeArchitecturalPatterns(
  primaryRepoUrl: string,
  relatedRepoUrls: string[]
): Promise<any> {
  // This would identify common architectural patterns like:
  // - Similar module structures
  // - Similar design patterns
  // - Similar file organization
  
  // For now, return a placeholder implementation
  return {
    message: "Architectural pattern analysis not fully implemented yet",
    primaryRepository: primaryRepoUrl,
    relatedRepositories: relatedRepoUrls
  };
}

/**
 * Generate a summary of a repository
 */
async function summarizeRepository(repositoryUrl: string): Promise<any> {
  try {
    const repoPath = await getRepository(repositoryUrl);
    const files = listFiles(repoPath);
    
    // Count files by type
    const fileTypes: {[key: string]: number} = {};
    files.forEach(file => {
      const ext = path.extname(file).slice(1);
      if (ext) {
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      }
    });
    
    // Analyze repository structure
    const rootDirs = new Set(
      files.map(file => {
        const parts = file.split('/');
        return parts.length > 1 ? parts[0] : '__root__';
      })
    );
    
    // Try to detect package.json or other project files
    const hasPackageJson = files.some(file => file.endsWith('package.json'));
    let packageInfo = null;
    
    if (hasPackageJson) {
      try {
        const packageJsonPath = path.join(repoPath, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
        const packageData = JSON.parse(packageJsonContent);
        packageInfo = {
          name: packageData.name,
          version: packageData.version,
          dependencies: Object.keys(packageData.dependencies || {}).length,
          devDependencies: Object.keys(packageData.devDependencies || {}).length
        };
      } catch (error) {
        console.warn(`Error parsing package.json: ${(error as Error).message}`);
      }
    }
    
    return {
      fileCount: files.length,
      fileTypes,
      topLevelDirectories: Array.from(rootDirs),
      packageInfo,
      isJavaScriptProject: hasPackageJson,
      isPythonProject: files.some(file => file.endsWith('requirements.txt') || file.endsWith('setup.py')),
      isJavaProject: files.some(file => file.endsWith('pom.xml') || file.endsWith('build.gradle'))
    };
  } catch (error) {
    console.error(`Error summarizing repository: ${(error as Error).message}`);
    return {
      error: (error as Error).message
    };
  }
} 