import { getRepository, listFiles } from "../../utils/repository-analyzer.js";
import { execSync } from "child_process";
import { buildKnowledgeGraph, queryKnowledgeGraph } from "../knowledge-graph/graph-manager.js";
import path from "path";
import fs from "fs";

/**
 * Analyze socio-technical patterns in a repository
 */
export async function analyzeSocioTechnicalPatterns(
  repositoryUrl: string,
  includeContributorPatterns: boolean = true,
  includeTeamDynamics: boolean = true,
  timeRange?: { start?: string, end?: string },
  visualizationFormat: "json" | "mermaid" | "dot" = "json"
): Promise<any> {
  console.log(`Analyzing socio-technical patterns for ${repositoryUrl}`);
  
  // Step 1: Clone/update the repository
  const repoPath = await getRepository(repositoryUrl);
  
  // Step 2: Analyze git history and contributors
  const contributorData = await analyzeContributors(repoPath, timeRange);
  
  // Step 3: Analyze code ownership and ownership patterns
  const ownershipData = includeContributorPatterns 
    ? await analyzeCodeOwnership(repoPath, contributorData)
    : null;
  
  // Step 4: Analyze team dynamics and collaboration patterns
  const teamDynamicsData = includeTeamDynamics 
    ? await analyzeTeamDynamics(repoPath, contributorData)
    : null;
  
  // Step 5: Build knowledge graph for technical dependencies
  console.log(`Building knowledge graph for technical dependencies...`);
  await buildKnowledgeGraph(repositoryUrl, 2, false);
  
  // Step 5b: Query knowledge graph to get actual nodes and relationships
  const graphData = await queryKnowledgeGraph({
    query: "",
    repositoryUrl,
    contextDepth: 2
  });
  
  // Step 6: Create socio-technical graph
  const socioTechnicalGraph = combineDataIntoGraph(
    contributorData, 
    ownershipData, 
    teamDynamicsData,
    graphData.nodes,
    graphData.relationships
  );
  
  // Step 7: Generate visualization
  let visualization = "";
  if (visualizationFormat === "mermaid") {
    visualization = generateMermaidDiagram(socioTechnicalGraph);
  } else if (visualizationFormat === "dot") {
    visualization = generateDotGraph(socioTechnicalGraph);
  }
  
  // Step 8: Generate insights
  const insights = generateInsights(
    contributorData, 
    ownershipData, 
    teamDynamicsData, 
    graphData.nodes, 
    graphData.relationships
  );
  
  // Return the analysis results
  return {
    repository: {
      url: repositoryUrl,
      path: repoPath
    },
    analysis: {
      contributors: summarizeContributors(contributorData),
      codeOwnership: ownershipData ? summarizeOwnership(ownershipData) : null,
      teamDynamics: teamDynamicsData ? summarizeTeamDynamics(teamDynamicsData) : null,
      insights
    },
    visualization,
    visualizationFormat
  };
}

/**
 * Analyze git history and contributors
 */
async function analyzeContributors(
  repoPath: string, 
  timeRange?: { start?: string, end?: string }
): Promise<any> {
  console.log(`Analyzing contributors in ${repoPath}`);
  
  try {
    // Build the git log command with appropriate filters
    let gitLogCommand = 'git log --pretty=format:"%an|%ae|%ad|%H" --date=iso';
    
    if (timeRange?.start) {
      gitLogCommand += ` --since="${timeRange.start}"`;
    }
    
    if (timeRange?.end) {
      gitLogCommand += ` --until="${timeRange.end}"`;
    }
    
    // Execute the git log command
    const gitLogOutput = execSync(gitLogCommand, { cwd: repoPath }).toString();
    const commits = gitLogOutput.split('\n').filter(line => line.trim() !== '');
    
    // Process the commits to get contributor information
    const contributorMap: Record<string, any> = {};
    
    for (const commit of commits) {
      const [name, email, dateStr, hash] = commit.split('|');
      
      if (!contributorMap[email]) {
        contributorMap[email] = {
          name,
          email,
          firstCommit: dateStr,
          lastCommit: dateStr,
          commitCount: 0,
          commits: []
        };
      }
      
      const contributor = contributorMap[email];
      contributor.commitCount++;
      contributor.lastCommit = dateStr;
      contributor.commits.push({
        hash,
        date: dateStr
      });
    }
    
    // Get file changes per contributor
    for (const email of Object.keys(contributorMap)) {
      const contributor = contributorMap[email];
      contributor.fileChangeCount = 0;
      contributor.fileChanges = {};
      
      // Get last 100 commits for this contributor to analyze file changes
      // This is a simplification to avoid performance issues
      const sampleCommits = contributor.commits.slice(0, 100);
      
      for (const commit of sampleCommits) {
        try {
          // Get files changed in this commit
          const diffCommand = `git show --name-only --pretty="" ${commit.hash}`;
          const changedFiles = execSync(diffCommand, { cwd: repoPath }).toString().split('\n').filter(Boolean);
          
          for (const file of changedFiles) {
            if (!contributor.fileChanges[file]) {
              contributor.fileChanges[file] = 0;
            }
            contributor.fileChanges[file]++;
            contributor.fileChangeCount++;
          }
        } catch (error) {
          console.warn(`Error analyzing commit ${commit.hash}: ${(error as Error).message}`);
        }
      }
    }
    
    // Convert to array and sort by commit count
    const contributors = Object.values(contributorMap).sort((a: any, b: any) => b.commitCount - a.commitCount);
    
    return {
      totalContributors: contributors.length,
      totalCommits: commits.length,
      contributors
    };
  } catch (error) {
    console.error(`Error analyzing contributors: ${(error as Error).message}`);
    return {
      totalContributors: 0,
      totalCommits: 0,
      contributors: [],
      error: (error as Error).message
    };
  }
}

/**
 * Analyze code ownership patterns
 */
async function analyzeCodeOwnership(repoPath: string, contributorData: any): Promise<any> {
  console.log(`Analyzing code ownership in ${repoPath}`);
  
  try {
    const files = listFiles(repoPath);
    const ownershipMap: Record<string, any> = {};
    
    // Analyze ownership by directory
    const directoryContributions: Record<string, Record<string, number>> = {};
    
    // Process file changes for each contributor
    for (const contributor of contributorData.contributors) {
      for (const [file, changeCount] of Object.entries(contributor.fileChanges)) {
        // Get the directory for this file
        const directory = path.dirname(file);
        
        if (!directoryContributions[directory]) {
          directoryContributions[directory] = {};
        }
        
        if (!directoryContributions[directory][contributor.email]) {
          directoryContributions[directory][contributor.email] = 0;
        }
        
        directoryContributions[directory][contributor.email] += changeCount as number;
      }
    }
    
    // Determine primary and secondary owners for each directory
    const directoryOwnership: Record<string, any> = {};
    
    for (const [directory, contributions] of Object.entries(directoryContributions)) {
      // Skip directories with very few files
      const filesInDir = files.filter(f => path.dirname(f) === directory);
      if (filesInDir.length < 3) continue;
      
      // Calculate total contributions to this directory
      const totalContributions = Object.values(contributions).reduce((sum: number, count: number) => sum + count, 0);
      
      // Sort contributors by contribution count
      const sortedContributors = Object.entries(contributions)
        .map(([email, count]) => {
          const contributor = contributorData.contributors.find((c: any) => c.email === email);
          return {
            email,
            name: contributor ? contributor.name : email,
            count,
            percentage: (count as number / totalContributions) * 100
          };
        })
        .sort((a, b) => b.count - a.count);
      
      // Determine ownership concentration (higher = more concentrated in fewer people)
      const contributorCount = sortedContributors.length;
      const primaryPercentage = sortedContributors.length > 0 ? sortedContributors[0].percentage : 0;
      const concentration = calculateOwnershipConcentration(sortedContributors.map(c => c.percentage));
      
      directoryOwnership[directory] = {
        totalContributions,
        contributorCount,
        primaryOwner: sortedContributors.length > 0 ? sortedContributors[0] : null,
        secondaryOwners: sortedContributors.slice(1, 3),
        concentration,
        riskLevel: concentration > 0.7 ? "high" : concentration > 0.4 ? "medium" : "low"
      };
    }
    
    // Identify knowledge distribution patterns
    const highConcentrationAreas = Object.entries(directoryOwnership)
      .filter(([_, data]) => (data as any).concentration > 0.7)
      .map(([dir, data]) => ({
        directory: dir,
        primaryOwner: (data as any).primaryOwner,
        concentration: (data as any).concentration
      }));
    
    const lowConcentrationAreas = Object.entries(directoryOwnership)
      .filter(([_, data]) => (data as any).concentration < 0.4)
      .map(([dir, data]) => ({
        directory: dir,
        contributorCount: (data as any).contributorCount,
        concentration: (data as any).concentration
      }));
    
    return {
      directoryOwnership,
      knowledgeDistribution: {
        highConcentrationAreas,
        lowConcentrationAreas
      }
    };
  } catch (error) {
    console.error(`Error analyzing code ownership: ${(error as Error).message}`);
    return {
      error: (error as Error).message
    };
  }
}

/**
 * Calculate ownership concentration using Gini coefficient
 * Higher values indicate more concentrated ownership
 */
function calculateOwnershipConcentration(percentages: number[]): number {
  if (percentages.length <= 1) return 1;
  
  // Calculate Gini coefficient
  let sumOfDifferences = 0;
  const n = percentages.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sumOfDifferences += Math.abs(percentages[i] - percentages[j]);
    }
  }
  
  // Normalize and return
  return sumOfDifferences / (2 * n * n * (percentages.reduce((a, b) => a + b, 0) / n));
}

/**
 * Analyze team dynamics and collaboration patterns
 */
async function analyzeTeamDynamics(repoPath: string, contributorData: any): Promise<any> {
  console.log(`Analyzing team dynamics in ${repoPath}`);
  
  try {
    // Step 1: Detect teams based on collaboration patterns
    const teams = detectTeams(contributorData);
    
    // Step 2: Analyze collaboration between contributors
    const collaborationGraph = analyzeCollaboration(repoPath, contributorData);
    
    // Step 3: Analyze work patterns
    const workPatterns = analyzeWorkPatterns(contributorData);
    
    return {
      teams,
      collaborationGraph,
      workPatterns
    };
  } catch (error) {
    console.error(`Error analyzing team dynamics: ${(error as Error).message}`);
    return {
      error: (error as Error).message
    };
  }
}

/**
 * Detect teams based on collaboration patterns
 */
function detectTeams(contributorData: any): any[] {
  // Use a simple clustering algorithm to detect teams based on collaboration patterns
  const teams: any[] = [];
  const processedContributors = new Set<string>();
  
  // Sort contributors by commit count (most active first)
  const sortedContributors = [...contributorData.contributors].sort((a, b) => b.commitCount - a.commitCount);
  
  // Try to identify teams
  for (const contributor of sortedContributors) {
    // Skip if already assigned to a team
    if (processedContributors.has(contributor.email)) continue;
    
    // Identify files this contributor works on most
    const topFiles = Object.entries(contributor.fileChanges)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 20) // Top 20 files
      .map((entry: any) => entry[0]);
    
    // Find other contributors who work on these files
    const relatedContributors = new Set<any>();
    relatedContributors.add(contributor);
    
    for (const file of topFiles) {
      for (const otherContributor of contributorData.contributors) {
        if (
          otherContributor.email !== contributor.email && 
          !processedContributors.has(otherContributor.email) &&
          otherContributor.fileChanges[file]
        ) {
          relatedContributors.add(otherContributor);
        }
      }
    }
    
    // If we found related contributors, form a team
    if (relatedContributors.size >= 2) {
      const teamMembers = Array.from(relatedContributors);
      
      // Find common directory patterns to name the team
      const commonDirectories = findCommonDirectories(teamMembers);
      const teamName = deriveTeamName(commonDirectories, teamMembers);
      
      teams.push({
        id: `team-${teams.length + 1}`,
        name: teamName,
        members: teamMembers.map(m => ({
          name: m.name,
          email: m.email,
          commitCount: m.commitCount
        })),
        primaryDirectories: commonDirectories
      });
      
      // Mark all team members as processed
      for (const member of teamMembers) {
        processedContributors.add(member.email);
      }
    }
  }
  
  // Add remaining contributors as individuals or to an "Other" team
  const remainingContributors = sortedContributors.filter(c => !processedContributors.has(c.email));
  
  if (remainingContributors.length > 0) {
    teams.push({
      id: `team-${teams.length + 1}`,
      name: "Other Contributors",
      members: remainingContributors.map(m => ({
        name: m.name,
        email: m.email,
        commitCount: m.commitCount
      })),
      primaryDirectories: []
    });
    
    for (const member of remainingContributors) {
      processedContributors.add(member.email);
    }
  }
  
  return teams;
}

/**
 * Find common directories among team members
 */
function findCommonDirectories(contributors: any[]): string[] {
  // Get all directories modified by each contributor
  const contributorDirectories: Set<string>[] = contributors.map(contributor => {
    const dirs = new Set<string>();
    for (const file of Object.keys(contributor.fileChanges)) {
      dirs.add(path.dirname(file));
    }
    return dirs;
  });
  
  // Find directories that most team members contribute to
  const directoryCounts: Record<string, number> = {};
  
  for (const dirSet of contributorDirectories) {
    for (const dir of dirSet) {
      directoryCounts[dir] = (directoryCounts[dir] || 0) + 1;
    }
  }
  
  // Sort by count (most common first) and take top directories
  return Object.entries(directoryCounts)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count >= Math.ceil(contributors.length * 0.5)) // At least 50% of team members
    .map(([dir]) => dir);
}

/**
 * Derive a team name based on common directories and members
 */
function deriveTeamName(directories: string[], members: any[]): string {
  if (directories.length === 0) {
    // No common directories, use most active member's name
    const lead = members.sort((a, b) => b.commitCount - a.commitCount)[0];
    return `${lead.name}'s Team`;
  }
  
  // Try to derive from top directories
  const topDirectory = directories[0];
  
  // Skip empty or root directory
  if (!topDirectory || topDirectory === '.') {
    return `Team ${Math.floor(Math.random() * 1000)}`;
  }
  
  // Convert path format to title case name
  const parts = topDirectory.split('/').filter(Boolean);
  if (parts.length > 0) {
    // Use last part of path, converted to title case
    const lastPart = parts[parts.length - 1];
    return lastPart
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') + ' Team';
  }
  
  return `Team ${Math.floor(Math.random() * 1000)}`;
}

/**
 * Analyze collaboration between contributors
 */
function analyzeCollaboration(repoPath: string, contributorData: any): any {
  // Create a map of files to contributors
  const fileContributors: Record<string, string[]> = {};
  
  // Populate file contributors
  for (const contributor of contributorData.contributors) {
    for (const file of Object.keys(contributor.fileChanges)) {
      if (!fileContributors[file]) {
        fileContributors[file] = [];
      }
      
      fileContributors[file].push(contributor.email);
    }
  }
  
  // Build collaboration graph
  const collaborationMap: Record<string, Record<string, number>> = {};
  
  // Initialize collaboration map for all contributors
  for (const contributor of contributorData.contributors) {
    collaborationMap[contributor.email] = {};
  }
  
  // Count collaborations (contributors who edited the same files)
  for (const contributors of Object.values(fileContributors)) {
    // Skip files with only one contributor
    if (contributors.length <= 1) continue;
    
    // For each pair of contributors, increment their collaboration count
    for (let i = 0; i < contributors.length; i++) {
      for (let j = i + 1; j < contributors.length; j++) {
        const a = contributors[i];
        const b = contributors[j];
        
        if (!collaborationMap[a][b]) collaborationMap[a][b] = 0;
        if (!collaborationMap[b][a]) collaborationMap[b][a] = 0;
        
        collaborationMap[a][b]++;
        collaborationMap[b][a]++;
      }
    }
  }
  
  // Convert to array format
  const nodes = contributorData.contributors.map((c: any) => ({
    id: c.email,
    label: c.name,
    value: c.commitCount
  }));
  
  const edges: any[] = [];
  
  for (const [source, targets] of Object.entries(collaborationMap)) {
    for (const [target, weight] of Object.entries(targets)) {
      // Only add if there's a significant collaboration
      if (weight >= 3) {
        edges.push({
          source,
          target,
          weight
        });
      }
    }
  }
  
  return {
    nodes,
    edges
  };
}

/**
 * Analyze work patterns for contributors
 */
function analyzeWorkPatterns(contributorData: any): any {
  const workPatterns: Record<string, any> = {};
  
  for (const contributor of contributorData.contributors) {
    // Skip contributors with too few commits
    if (contributor.commits.length < 5) continue;
    
    // Analyze commit timestamps to determine work patterns
    const commitHours = contributor.commits
      .map((commit: any) => new Date(commit.date).getHours());
    
    // Count commits by hour
    const hourCounts: Record<number, number> = {};
    for (const hour of commitHours) {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    }
    
    // Define standard business hours (9 AM to 5 PM)
    const standardHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    
    // Calculate percentage of commits during standard hours vs. outside
    const standardHourCommits = standardHours.reduce((sum, hour) => sum + (hourCounts[hour] || 0), 0);
    const totalCommits = commitHours.length;
    const standardHoursPercentage = (standardHourCommits / totalCommits) * 100;
    
    // Determine if they work outside standard hours
    const worksOutsideStandardHours = standardHoursPercentage < 70; // More than 30% outside standard hours
    
    // Find peak hours
    const peakHour = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    workPatterns[contributor.email] = {
      standardHoursPercentage,
      worksOutsideStandardHours,
      peakHour: parseInt(peakHour),
      hourDistribution: hourCounts
    };
  }
  
  return workPatterns;
}

/**
 * Combine all data into a socio-technical graph
 */
function combineDataIntoGraph(
  contributorData: any, 
  ownershipData: any | null, 
  teamDynamicsData: any | null,
  nodes: any[],
  relationships: any[]
): any {
  // Create graph nodes and edges
  const graphNodes: any[] = [];
  const graphEdges: any[] = [];
  
  // Add team nodes
  if (teamDynamicsData?.teams) {
    for (const team of teamDynamicsData.teams) {
      graphNodes.push({
        id: team.id,
        name: team.name,
        type: 'team'
      });
      
      // Add edges between teams and their members
      for (const member of team.members) {
        graphEdges.push({
          source: member.email,
          target: team.id,
          type: 'member-of'
        });
      }
    }
  }
  
  // Add contributor nodes
  for (const contributor of contributorData.contributors) {
    graphNodes.push({
      id: contributor.email,
      name: contributor.name,
      type: 'contributor',
      commitCount: contributor.commitCount
    });
  }
  
  // Add collaboration edges
  if (teamDynamicsData?.collaborationGraph?.edges) {
    for (const edge of teamDynamicsData.collaborationGraph.edges) {
      graphEdges.push({
        source: edge.source,
        target: edge.target,
        type: 'collaborates-with',
        weight: edge.weight
      });
    }
  }
  
  // Add selected technical nodes and edges
  // Limit to important ones to avoid cluttering the graph
  const technicalNodes = nodes
    .filter(node => node.type === 'file' || node.type === 'directory')
    .slice(0, 50); // Limit to 50 technical nodes
  
  for (const node of technicalNodes) {
    graphNodes.push({
      id: node.id,
      name: node.name || node.id,
      type: node.type
    });
  }
  
  // Add ownership edges
  if (ownershipData?.directoryOwnership) {
    for (const [directory, data] of Object.entries(ownershipData.directoryOwnership)) {
      if ((data as any).primaryOwner) {
        const owner = (data as any).primaryOwner;
        
        // Find if this directory exists in the graph
        const dirNode = graphNodes.find(node => node.id === directory || node.name === directory);
        
        if (dirNode) {
          graphEdges.push({
            source: owner.email,
            target: dirNode.id,
            type: 'owns',
            weight: owner.percentage
          });
        }
      }
    }
  }
  
  // Add technical dependency edges
  const technicalEdges = relationships
    .filter(rel => ['depends-on', 'imports', 'calls'].includes(rel.type))
    .filter(rel => {
      // Only include edges where both nodes are in the graph
      return graphNodes.some(n => n.id === rel.sourceId) && 
             graphNodes.some(n => n.id === rel.targetId);
    })
    .slice(0, 100); // Limit to 100 technical edges
  
  for (const rel of technicalEdges) {
    graphEdges.push({
      source: rel.sourceId,
      target: rel.targetId,
      type: rel.type
    });
  }
  
  return {
    nodes: graphNodes,
    edges: graphEdges
  };
}

/**
 * Summarize contributor information
 */
function summarizeContributors(contributorData: any): any {
  // Calculate active period
  let earliestCommit = new Date().toISOString();
  let latestCommit = new Date(0).toISOString();
  
  for (const contributor of contributorData.contributors) {
    if (contributor.firstCommit < earliestCommit) {
      earliestCommit = contributor.firstCommit;
    }
    
    if (contributor.lastCommit > latestCommit) {
      latestCommit = contributor.lastCommit;
    }
  }
  
  // Calculate core team size (contributors with 80% of commits)
  const sortedContributors = [...contributorData.contributors].sort((a, b) => b.commitCount - a.commitCount);
  const totalCommits = contributorData.totalCommits;
  let cumulativeCommits = 0;
  let coreTeamSize = 0;
  
  for (const contributor of sortedContributors) {
    cumulativeCommits += contributor.commitCount;
    coreTeamSize++;
    
    if (cumulativeCommits >= totalCommits * 0.8) {
      break;
    }
  }
  
  return {
    totalContributors: contributorData.totalContributors,
    totalCommits: contributorData.totalCommits,
    activePeriod: {
      start: earliestCommit,
      end: latestCommit
    },
    coreTeamSize,
    topContributors: sortedContributors.slice(0, 5).map((c: any) => ({
      name: c.name,
      email: c.email,
      commitCount: c.commitCount,
      percentage: (c.commitCount / totalCommits) * 100
    }))
  };
}

/**
 * Summarize code ownership information
 */
function summarizeOwnership(ownershipData: any): any {
  // Calculate average concentration
  const directories = Object.keys(ownershipData.directoryOwnership);
  
  if (directories.length === 0) {
    return {
      averageConcentration: 0,
      highConcentrationCount: 0,
      lowConcentrationCount: 0
    };
  }
  
  const concentrations = directories.map(dir => ownershipData.directoryOwnership[dir].concentration);
  const averageConcentration = concentrations.reduce((sum, val) => sum + val, 0) / concentrations.length;
  
  return {
    averageConcentration,
    highConcentrationCount: ownershipData.knowledgeDistribution.highConcentrationAreas.length,
    lowConcentrationCount: ownershipData.knowledgeDistribution.lowConcentrationAreas.length,
    riskAssessment: averageConcentration > 0.7 ? "high" : averageConcentration > 0.4 ? "medium" : "low"
  };
}

/**
 * Summarize team dynamics information
 */
function summarizeTeamDynamics(teamDynamicsData: any): any {
  // Calculate team statistics
  const teams = teamDynamicsData.teams || [];
  
  // Calculate cross-team vs in-team collaboration ratio
  let crossTeamCollaboration = 0;
  
  if (teams.length > 1) {
    crossTeamCollaboration = calculateCrossTeamCollaboration(teams, teamDynamicsData).score;
  }
  
  // Calculate work pattern diversity
  const workPatterns = teamDynamicsData.workPatterns || {};
  const outsideHoursPercentage = Object.values(workPatterns).filter(
    (p: any) => p.worksOutsideStandardHours
  ).length / Object.values(workPatterns).length * 100;
  
  return {
    teamCount: teams.length,
    averageTeamSize: teams.length > 0 
      ? teams.reduce((sum: number, t: any) => sum + t.members.length, 0) / teams.length
      : 0,
    crossTeamCollaboration,
    collaborationDensity: teams.length > 0
      ? teamDynamicsData.collaborationGraph?.edges.length / (contributorsCount(teams) * (contributorsCount(teams) - 1) / 2)
      : 0,
    workPatternDiversity: {
      outsideHoursPercentage
    }
  };
}

/**
 * Helper function to count total contributors across teams
 */
function contributorsCount(teams: any[]): number {
  // Get unique contributor count (a contributor might be in multiple teams)
  const uniqueContributors = new Set<string>();
  
  for (const team of teams) {
    for (const member of team.members) {
      uniqueContributors.add(member.email);
    }
  }
  
  return uniqueContributors.size;
}

/**
 * Generate a Mermaid diagram for visualization
 */
function generateMermaidDiagram(graph: any): string {
  let mermaid = "graph TD;\n";
  
  // Add nodes
  for (const node of graph.nodes) {
    let style = "";
    
    switch (node.type) {
      case "contributor":
        style = `style ${sanitizeId(node.id)} fill:#faa,stroke:#333,stroke-width:2px`;
        mermaid += `  ${sanitizeId(node.id)}["👤 ${node.name}"];\n`;
        mermaid += `  ${style};\n`;
        break;
      case "team":
        style = `style ${sanitizeId(node.id)} fill:#adf,stroke:#333,stroke-width:2px`;
        mermaid += `  ${sanitizeId(node.id)}["👥 ${node.name}"];\n`;
        mermaid += `  ${style};\n`;
        break;
      case "file":
        style = `style ${sanitizeId(node.id)} fill:#dfd,stroke:#333,stroke-width:1px`;
        mermaid += `  ${sanitizeId(node.id)}["📄 ${node.name || node.id}"];\n`;
        mermaid += `  ${style};\n`;
        break;
      default:
        mermaid += `  ${sanitizeId(node.id)}["${node.name || node.id}"];\n`;
    }
  }
  
  // Add edges (limit to 100 most important to avoid cluttering)
  const prioritizedEdges = [...graph.edges]
    .sort((a, b) => (b.weight || 1) - (a.weight || 1))
    .slice(0, 100);
  
  for (const edge of prioritizedEdges) {
    let label = "";
    
    switch (edge.type) {
      case "member-of":
        label = "member of";
        break;
      case "owns":
        label = "owns";
        break;
      case "collaborates-with":
        label = "collaborates with";
        break;
      default:
        label = edge.type;
    }
    
    mermaid += `  ${sanitizeId(edge.source)} -- "${label}" --> ${sanitizeId(edge.target)};\n`;
  }
  
  return mermaid;
}

/**
 * Generate a DOT graph for visualization
 */
function generateDotGraph(graph: any): string {
  let dot = "digraph SocioTechnical {\n";
  dot += "  node [shape=box, style=filled];\n";
  
  // Add nodes
  for (const node of graph.nodes) {
    let color = "";
    let shape = "box";
    
    switch (node.type) {
      case "contributor":
        color = "fillcolor=\"#ffaaaa\"";
        shape = "ellipse";
        dot += `  "${node.id}" [label="👤 ${node.name}", ${color}, shape=${shape}];\n`;
        break;
      case "team":
        color = "fillcolor=\"#aaddff\"";
        shape = "hexagon";
        dot += `  "${node.id}" [label="👥 ${node.name}", ${color}, shape=${shape}];\n`;
        break;
      case "file":
        color = "fillcolor=\"#ddffdd\"";
        dot += `  "${node.id}" [label="📄 ${node.name || node.id}", ${color}];\n`;
        break;
      default:
        dot += `  "${node.id}" [label="${node.name || node.id}"];\n`;
    }
  }
  
  // Add edges (limit to 100 most important to avoid cluttering)
  const prioritizedEdges = [...graph.edges]
    .sort((a, b) => (b.weight || 1) - (a.weight || 1))
    .slice(0, 100);
  
  for (const edge of prioritizedEdges) {
    let label = "";
    let style = "";
    
    switch (edge.type) {
      case "member-of":
        label = "member of";
        style = "style=dashed";
        break;
      case "owns":
        label = "owns";
        style = "style=bold, color=\"#ff6666\"";
        break;
      case "collaborates-with":
        label = "collaborates with";
        style = "style=bold, color=\"#6666ff\"";
        break;
      default:
        label = edge.type;
    }
    
    dot += `  "${edge.source}" -> "${edge.target}" [label="${label}", ${style}];\n`;
  }
  
  dot += "}";
  return dot;
}

/**
 * Generate insights from the socio-technical analysis
 */
function generateInsights(
  contributorData: any,
  ownershipData: any,
  teamDynamicsData: any,
  nodes: any[],
  relationships: any[]
): any[] {
  const insights: any[] = [];
  
  // Insight 1: Highly concentrated knowledge
  if (ownershipData?.knowledgeDistribution?.highConcentrationAreas) {
    const highConcentrationAreas = ownershipData.knowledgeDistribution.highConcentrationAreas;
    
    if (highConcentrationAreas.length > 0) {
      insights.push({
        type: "risk",
        title: "Concentrated Knowledge Risk",
        description: `Knowledge is highly concentrated in ${highConcentrationAreas.length} directories, creating potential bottlenecks and bus factor risks.`,
        areas: highConcentrationAreas,
        recommendation: "Consider knowledge sharing sessions or pair programming to distribute expertise."
      });
    }
  }
  
  // Insight 2: Well-distributed knowledge
  if (ownershipData?.knowledgeDistribution?.lowConcentrationAreas) {
    const lowConcentrationAreas = ownershipData.knowledgeDistribution.lowConcentrationAreas;
    
    if (lowConcentrationAreas.length > 0) {
      insights.push({
        type: "strength",
        title: "Well-Distributed Knowledge",
        description: `Knowledge is well-distributed in ${lowConcentrationAreas.length} directories, reducing bus factor risk.`,
        areas: lowConcentrationAreas
      });
    }
  }
  
  // Insight 3: Team isolation
  if (teamDynamicsData?.teams) {
    const teams = teamDynamicsData.teams;
    
    if (teams.length > 1) {
      // Check for isolated teams (teams with few collaborations across team boundaries)
      const crossTeamCollaboration = calculateCrossTeamCollaboration(teams, teamDynamicsData);
      
      if (crossTeamCollaboration.score < 0.3) { // Threshold for low cross-team collaboration
        insights.push({
          type: "risk",
          title: "Team Isolation",
          description: "Teams appear to be working in isolation with limited cross-team collaboration.",
          details: crossTeamCollaboration,
          recommendation: "Consider cross-team initiatives, shared code ownership, or rotation programs."
        });
      }
    }
  }
  
  // Insight 4: Non-standard work hours
  if (teamDynamicsData?.workPatterns) {
    const workPatterns = teamDynamicsData.workPatterns;
    const outsideHoursContributors = Object.entries(workPatterns)
      .filter(([_, pattern]) => (pattern as any).worksOutsideStandardHours)
      .map(([email]) => email);
    
    if (outsideHoursContributors.length > 0) {
      insights.push({
        type: "observation",
        title: "Non-Standard Work Hours",
        description: `${outsideHoursContributors.length} contributors frequently work outside standard business hours.`,
        details: {
          contributors: outsideHoursContributors
        },
        recommendation: "Consider work-life balance and potential timezone distribution in the team."
      });
    }
  }
  
  // Insight 5: Architectural-team misalignment
  if (ownershipData?.directoryOwnership && teamDynamicsData?.teams) {
    const misalignments = detectArchitectureTeamMisalignments(
      ownershipData.directoryOwnership,
      teamDynamicsData.teams,
      relationships
    );
    
    if (misalignments.length > 0) {
      insights.push({
        type: "risk",
        title: "Architecture-Team Misalignment",
        description: "Technical dependencies don't align well with team structures, creating communication overhead.",
        details: {
          misalignments
        },
        recommendation: "Consider reorganizing teams to better match the technical architecture, or refactoring the architecture to better match team boundaries."
      });
    }
  }
  
  return insights;
}

/**
 * Calculate cross-team collaboration score
 */
function calculateCrossTeamCollaboration(teams: any[], teamDynamicsData: any): any {
  // Get all collaboration edges
  const edges = teamDynamicsData.collaborationGraph?.edges || [];
  
  // Create team membership lookup
  const memberTeamMap: Record<string, string> = {};
  
  for (const team of teams) {
    for (const member of team.members) {
      memberTeamMap[member.email] = team.id;
    }
  }
  
  // Count cross-team vs. same-team collaborations
  let crossTeamCount = 0;
  let sameTeamCount = 0;
  
  for (const edge of edges) {
    const sourceTeam = memberTeamMap[edge.source];
    const targetTeam = memberTeamMap[edge.target];
    
    if (sourceTeam && targetTeam) {
      if (sourceTeam === targetTeam) {
        sameTeamCount++;
      } else {
        crossTeamCount++;
      }
    }
  }
  
  // Calculate score (ratio of cross-team collaborations to total collaborations)
  const totalCollaborations = crossTeamCount + sameTeamCount;
  const score = totalCollaborations > 0 ? crossTeamCount / totalCollaborations : 0;
  
  return {
    score,
    crossTeamCollaborations: crossTeamCount,
    sameTeamCollaborations: sameTeamCount,
    totalCollaborations
  };
}

/**
 * Detect misalignments between technical architecture and team structure
 */
function detectArchitectureTeamMisalignments(
  directoryOwnership: Record<string, any>,
  teams: any[],
  relationships: any[]
): any[] {
  const misalignments: any[] = [];
  
  // Create a map of directory to team
  const directoryToTeam: Record<string, string> = {};
  
  // Assign directories to teams based on who contributes most
  for (const [directory, data] of Object.entries(directoryOwnership)) {
    if ((data as any).primaryOwner) {
      const ownerEmail = (data as any).primaryOwner.email;
      
      // Find which team this contributor belongs to
      for (const team of teams) {
        if (team.members.some((m: any) => m.email === ownerEmail)) {
          directoryToTeam[directory] = team.id;
          break;
        }
      }
    }
  }
  
  // Analyze technical dependencies between directories
  // and check if they cross team boundaries
  for (const rel of relationships) {
    // Skip relationships that don't represent dependencies
    if (!['depends-on', 'imports', 'calls', 'references'].includes(rel.type)) {
      continue;
    }
    
    // Try to extract directories from the relationship
    let sourceDir = '';
    let targetDir = '';
    
    try {
      sourceDir = rel.sourceId.includes('/') ? path.dirname(rel.sourceId) : '';
      targetDir = rel.targetId.includes('/') ? path.dirname(rel.targetId) : '';
    } catch (error) {
      continue; // Skip if we can't parse directories
    }
    
    // If the directories are assigned to different teams, this is a potential misalignment
    if (
      sourceDir && 
      targetDir && 
      directoryToTeam[sourceDir] && 
      directoryToTeam[targetDir] &&
      directoryToTeam[sourceDir] !== directoryToTeam[targetDir]
    ) {
      misalignments.push({
        sourceDirectory: sourceDir,
        targetDirectory: targetDir,
        sourceTeam: directoryToTeam[sourceDir],
        targetTeam: directoryToTeam[targetDir],
        relationship: rel.type
      });
    }
  }
  
  return misalignments;
}

/**
 * Helper function to sanitize IDs for Mermaid diagrams
 */
function sanitizeId(id: string): string {
  return id
    .replace(/[^\w-]/g, '_') // Replace non-word chars with underscore
    .replace(/^[^a-zA-Z]/, 'n$&'); // Ensure IDs start with a letter
} 