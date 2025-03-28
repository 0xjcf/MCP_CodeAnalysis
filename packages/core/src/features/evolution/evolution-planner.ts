import { getRepository, listFiles } from "../../utils/repository-analyzer.js";
import { analyzeCode } from "../basic-analysis/analyzer.js";
import {
  buildKnowledgeGraph,
  queryKnowledgeGraph,
} from "../knowledge-graph/graph-manager.js";
import { retrieveMemories } from "../memory/memory-manager.js";
import path from "path";
import fs from "fs";

/**
 * Generate an evolution plan for a codebase based on a specific goal and timeframe
 */
export async function generateEvolutionPlan(
  repositoryUrl: string,
  targetGoal:
    | "modernize-architecture"
    | "improve-performance"
    | "enhance-security"
    | "reduce-technical-debt",
  timeframe: "immediate" | "sprint" | "quarter" | "year",
  includeImplementationDetails: boolean = true
): Promise<any> {
  console.log(
    `Generating ${targetGoal} evolution plan for ${repositoryUrl} (${timeframe} timeframe)`
  );

  // Step 1: Clone/update the repository
  const repoPath = await getRepository(repositoryUrl);

  // Step 2: Analyze the codebase
  const files = listFiles(repoPath);
  const fileAnalyses: Record<string, any> = {};

  // Analyze a subset of files to avoid performance issues with large repositories
  const filesToAnalyze = selectRepresentativeFiles(files, 50);

  console.log(`Analyzing ${filesToAnalyze.length} representative files...`);
  for (const file of filesToAnalyze) {
    try {
      const fullPath = path.join(repoPath, file);
      const code = fs.readFileSync(fullPath, "utf8");
      const fileLanguage = path.extname(file).slice(1);
      const analysis = analyzeCode(code, fileLanguage);
      fileAnalyses[file] = analysis;
    } catch (error) {
      console.warn(`Error analyzing file ${file}: ${(error as Error).message}`);
    }
  }

  // Step 3: Build knowledge graph
  console.log(`Building knowledge graph...`);
  const { nodes, relationships } = await buildKnowledgeGraph(
    repositoryUrl,
    2,
    false
  );

  // Step 4: Retrieve insights from memory
  console.log(`Retrieving memories about this repository...`);
  const memories = await retrieveMemories({
    repositoryUrl,
    limit: 10,
  });

  // Step 5: Generate the evolution plan based on target goal and timeframe
  console.log(`Generating ${targetGoal} plan...`);

  // Analyze major frameworks and libraries used
  const frameworks = detectFrameworks(files, fileAnalyses);

  // Analyze project structure
  const projectStructure = analyzeProjectStructure(files);

  // Generate plan based on target goal
  let plan;
  switch (targetGoal) {
    case "modernize-architecture":
      plan = generateModernizeArchitecturePlan(
        repositoryUrl,
        frameworks,
        projectStructure,
        fileAnalyses,
        timeframe,
        includeImplementationDetails
      );
      break;
    case "improve-performance":
      plan = generatePerformancePlan(
        repositoryUrl,
        frameworks,
        fileAnalyses,
        timeframe,
        includeImplementationDetails
      );
      break;
    case "enhance-security":
      plan = generateSecurityPlan(
        repositoryUrl,
        frameworks,
        fileAnalyses,
        timeframe,
        includeImplementationDetails
      );
      break;
    case "reduce-technical-debt":
      plan = generateTechnicalDebtPlan(
        repositoryUrl,
        frameworks,
        projectStructure,
        fileAnalyses,
        timeframe,
        includeImplementationDetails
      );
      break;
    default:
      throw new Error(`Unknown target goal: ${targetGoal}`);
  }

  // Return the evolution plan
  return {
    repository: {
      url: repositoryUrl,
      summary: summarizeRepository(
        files,
        fileAnalyses,
        frameworks,
        projectStructure
      ),
    },
    targetGoal,
    timeframe,
    plan,
  };
}

/**
 * Select a representative subset of files to analyze
 */
function selectRepresentativeFiles(
  files: string[],
  maxFiles: number
): string[] {
  // If we have fewer files than the max, return all files
  if (files.length <= maxFiles) {
    return files;
  }

  // Group files by extension
  const filesByExt: Record<string, string[]> = {};
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!filesByExt[ext]) {
      filesByExt[ext] = [];
    }
    filesByExt[ext].push(file);
  }

  // Select representative files from each extension group
  const selectedFiles: string[] = [];
  const extensions = Object.keys(filesByExt);

  // Calculate how many files to select from each extension
  const filesPerExt = Math.max(1, Math.floor(maxFiles / extensions.length));

  for (const ext of extensions) {
    const extFiles = filesByExt[ext];

    // Prioritize files at different directory depths
    const byDepth: Record<number, string[]> = {};
    for (const file of extFiles) {
      const depth = file.split("/").length;
      if (!byDepth[depth]) {
        byDepth[depth] = [];
      }
      byDepth[depth].push(file);
    }

    const depths = Object.keys(byDepth).map(Number);
    const selectedForExt: string[] = [];

    // Select files from each depth level
    for (
      let i = 0;
      i < filesPerExt && selectedForExt.length < filesPerExt;
      i++
    ) {
      const depthIndex = i % depths.length;
      const depth = depths[depthIndex];

      if (byDepth[depth].length > 0) {
        // Take the first file from this depth level
        selectedForExt.push(byDepth[depth].shift()!);
      }
    }

    selectedFiles.push(...selectedForExt);

    // If we've selected enough files, stop
    if (selectedFiles.length >= maxFiles) {
      break;
    }
  }

  // Include key configuration files
  const importantFiles = files.filter(
    (file) =>
      file.includes("package.json") ||
      file.includes("tsconfig.json") ||
      file.includes("webpack.config") ||
      file.includes(".eslintrc") ||
      file.includes("vitest.config") ||
      file.includes("Dockerfile") ||
      file.includes("docker-compose.yml")
  );

  // Merge important files with selected files, ensuring we don't exceed maxFiles
  const remainingSlots = Math.max(0, maxFiles - selectedFiles.length);
  const additionalImportantFiles = importantFiles
    .filter((file) => !selectedFiles.includes(file))
    .slice(0, remainingSlots);

  return [...selectedFiles, ...additionalImportantFiles].slice(0, maxFiles);
}

/**
 * Detect frameworks and libraries used in the project
 */
function detectFrameworks(
  files: string[],
  fileAnalyses: Record<string, any>
): Record<string, any> {
  const frameworks: Record<string, any> = {};

  // Check for package.json to identify JS/TS frameworks
  const hasPackageJson = files.some((file) => file.endsWith("package.json"));

  if (hasPackageJson) {
    const packageJsonFile = files.find((file) => file.endsWith("package.json"));
    if (packageJsonFile) {
      try {
        const fullPath = path.join(
          process.cwd(),
          "data",
          "repositories",
          path.basename(packageJsonFile)
        );
        const packageData = JSON.parse(fs.readFileSync(fullPath, "utf8"));

        const dependencies = {
          ...(packageData.dependencies || {}),
          ...(packageData.devDependencies || {}),
        };

        // Check for common frameworks
        if (dependencies.react) {
          frameworks.react = { version: dependencies.react };
        }
        if (dependencies.vue) {
          frameworks.vue = { version: dependencies.vue };
        }
        if (dependencies.angular || dependencies["@angular/core"]) {
          frameworks.angular = {
            version: dependencies.angular || dependencies["@angular/core"],
          };
        }
        if (dependencies.express) {
          frameworks.express = { version: dependencies.express };
        }
        if (dependencies.next) {
          frameworks.next = { version: dependencies.next };
        }
        if (dependencies.typescript) {
          frameworks.typescript = { version: dependencies.typescript };
        }
        if (dependencies.jest || dependencies["@jest/core"]) {
          frameworks.jest = {
            version: dependencies.jest || dependencies["@jest/core"],
          };
        }
        if (dependencies.vitest) {
          frameworks.vitest = { version: dependencies.vitest };
        }

        // Store all dependencies for reference
        frameworks.allDependencies = dependencies;
      } catch (error) {
        console.warn(`Error parsing package.json: ${(error as Error).message}`);
      }
    }
  }

  // Check for Python frameworks
  const hasPythonFiles = files.some((file) => file.endsWith(".py"));
  if (hasPythonFiles) {
    const requirementsFile = files.find((file) =>
      file.endsWith("requirements.txt")
    );
    if (requirementsFile) {
      try {
        const fullPath = path.join(
          process.cwd(),
          "data",
          "repositories",
          path.basename(requirementsFile)
        );
        const requirements = fs.readFileSync(fullPath, "utf8").split("\n");

        if (requirements.some((r) => r.includes("django"))) {
          frameworks.django = { detected: true };
        }
        if (requirements.some((r) => r.includes("flask"))) {
          frameworks.flask = { detected: true };
        }
        if (requirements.some((r) => r.includes("fastapi"))) {
          frameworks.fastapi = { detected: true };
        }
      } catch (error) {
        console.warn(
          `Error parsing requirements.txt: ${(error as Error).message}`
        );
      }
    }
  }

  return frameworks;
}

/**
 * Analyze the project structure
 */
function analyzeProjectStructure(files: string[]): Record<string, any> {
  const directoryStructure: Record<string, number> = {};

  // Count files per directory
  for (const file of files) {
    const dir = path.dirname(file);
    directoryStructure[dir] = (directoryStructure[dir] || 0) + 1;
  }

  // Identify top-level directories
  const topLevelDirs = new Set<string>();
  for (const dir of Object.keys(directoryStructure)) {
    const topLevel = dir.split("/")[0] || ".";
    topLevelDirs.add(topLevel);
  }

  return {
    directoryStructure,
    topLevelDirectories: Array.from(topLevelDirs),
    fileCount: files.length,
  };
}

/**
 * Generate a plan for modernizing architecture
 */
function generateModernizeArchitecturePlan(
  repositoryUrl: string,
  frameworks: Record<string, any>,
  projectStructure: Record<string, any>,
  fileAnalyses: Record<string, any>,
  timeframe: "immediate" | "sprint" | "quarter" | "year",
  includeImplementationDetails: boolean
): any {
  const recommendations: any[] = [];

  // Check for outdated frameworks
  if (frameworks.react) {
    const version = frameworks.react.version;
    if ((version && version.startsWith("15.")) || version.startsWith("16.")) {
      recommendations.push({
        title: "Upgrade React to the latest version",
        description:
          "The project is using an older version of React. Upgrading will provide access to the latest features, performance improvements, and security patches.",
        priority: "high",
        effort: "medium",
        impact: "high",
      });
    }
  }

  // Check for component architecture
  const hasComponentDir = projectStructure.topLevelDirectories.some(
    (dir: string) => dir === "components" || dir === "Components"
  );

  if (
    !hasComponentDir &&
    (frameworks.react || frameworks.vue || frameworks.angular)
  ) {
    recommendations.push({
      title: "Implement a clear component architecture",
      description:
        "Organize components into a dedicated directory structure to improve code organization and reusability.",
      priority: "medium",
      effort: "medium",
      impact: "high",
    });
  }

  // Check for TypeScript usage
  if (
    !frameworks.typescript &&
    (frameworks.react || frameworks.vue || frameworks.angular)
  ) {
    recommendations.push({
      title: "Migrate to TypeScript",
      description:
        "Adding TypeScript will improve type safety, developer experience, and make the codebase more maintainable.",
      priority: "medium",
      effort: "high",
      impact: "high",
    });
  }

  // Generate timeframe-specific recommendations
  const timeframeRecommendations = filterRecommendationsByTimeframe(
    recommendations,
    timeframe
  );

  // Add implementation details if requested
  if (includeImplementationDetails) {
    for (const rec of timeframeRecommendations) {
      rec.implementationSteps = generateImplementationSteps(
        rec.title,
        frameworks
      );
    }
  }

  return {
    summary: `The architecture modernization plan focuses on ${timeframeRecommendations.length} key areas to improve over the ${timeframe} timeframe.`,
    recommendations: timeframeRecommendations,
    suggestedArchitecture: generateSuggestedArchitecture(
      frameworks,
      projectStructure
    ),
  };
}

/**
 * Generate a plan for improving performance
 */
function generatePerformancePlan(
  repositoryUrl: string,
  frameworks: Record<string, any>,
  fileAnalyses: Record<string, any>,
  timeframe: "immediate" | "sprint" | "quarter" | "year",
  includeImplementationDetails: boolean
): any {
  const recommendations: any[] = [];

  // Check for React performance opportunities
  if (frameworks.react) {
    recommendations.push({
      title: "Implement React.memo for functional components",
      description:
        "Prevent unnecessary re-renders by memoizing functional components.",
      priority: "medium",
      effort: "low",
      impact: "medium",
    });

    recommendations.push({
      title: "Implement code splitting with React.lazy",
      description:
        "Improve initial load time by splitting your code into smaller chunks.",
      priority: "high",
      effort: "medium",
      impact: "high",
    });
  }

  // General performance recommendations
  recommendations.push({
    title: "Optimize asset loading",
    description:
      "Implement lazy loading for images and other assets to improve page load times.",
    priority: "medium",
    effort: "medium",
    impact: "high",
  });

  recommendations.push({
    title: "Implement caching strategies",
    description: "Add appropriate caching for API responses and static assets.",
    priority: "high",
    effort: "medium",
    impact: "high",
  });

  // Database query optimization recommendations
  const hasDatabase = detectDatabaseUsage(fileAnalyses);
  if (hasDatabase) {
    recommendations.push({
      title: "Optimize database queries",
      description: "Review and optimize database queries for performance.",
      priority: "high",
      effort: "high",
      impact: "high",
    });
  }

  // Generate timeframe-specific recommendations
  const timeframeRecommendations = filterRecommendationsByTimeframe(
    recommendations,
    timeframe
  );

  // Add implementation details if requested
  if (includeImplementationDetails) {
    for (const rec of timeframeRecommendations) {
      rec.implementationSteps = generateImplementationSteps(
        rec.title,
        frameworks
      );
    }
  }

  return {
    summary: `The performance improvement plan focuses on ${timeframeRecommendations.length} key areas to optimize over the ${timeframe} timeframe.`,
    recommendations: timeframeRecommendations,
  };
}

/**
 * Generate a plan for enhancing security
 */
function generateSecurityPlan(
  repositoryUrl: string,
  frameworks: Record<string, any>,
  fileAnalyses: Record<string, any>,
  timeframe: "immediate" | "sprint" | "quarter" | "year",
  includeImplementationDetails: boolean
): any {
  const recommendations: any[] = [];

  // Check for dependency vulnerabilities (this would normally use a security scanner)
  recommendations.push({
    title: "Update dependencies to address security vulnerabilities",
    description:
      "Run security scanning tools and update dependencies with known vulnerabilities.",
    priority: "high",
    effort: "medium",
    impact: "high",
  });

  // Authentication and authorization recommendations
  recommendations.push({
    title: "Implement proper authentication and authorization",
    description:
      "Ensure all endpoints and resources are properly protected with authentication and authorization.",
    priority: "high",
    effort: "high",
    impact: "high",
  });

  // Input validation
  recommendations.push({
    title: "Implement comprehensive input validation",
    description:
      "Add proper validation for all user inputs to prevent injection attacks.",
    priority: "high",
    effort: "medium",
    impact: "high",
  });

  // Web vulnerabilities
  if (frameworks.react || frameworks.vue || frameworks.angular) {
    recommendations.push({
      title: "Add Content Security Policy (CSP)",
      description: "Implement CSP headers to prevent XSS attacks.",
      priority: "medium",
      effort: "medium",
      impact: "high",
    });
  }

  // API security
  if (frameworks.express || detectApiEndpoints(fileAnalyses)) {
    recommendations.push({
      title: "Implement API rate limiting",
      description: "Add rate limiting to API endpoints to prevent abuse.",
      priority: "medium",
      effort: "low",
      impact: "medium",
    });
  }

  // Generate timeframe-specific recommendations
  const timeframeRecommendations = filterRecommendationsByTimeframe(
    recommendations,
    timeframe
  );

  // Add implementation details if requested
  if (includeImplementationDetails) {
    for (const rec of timeframeRecommendations) {
      rec.implementationSteps = generateImplementationSteps(
        rec.title,
        frameworks
      );
    }
  }

  return {
    summary: `The security enhancement plan focuses on ${timeframeRecommendations.length} key areas to improve over the ${timeframe} timeframe.`,
    recommendations: timeframeRecommendations,
  };
}

/**
 * Generate a plan for reducing technical debt
 */
function generateTechnicalDebtPlan(
  repositoryUrl: string,
  frameworks: Record<string, any>,
  projectStructure: Record<string, any>,
  fileAnalyses: Record<string, any>,
  timeframe: "immediate" | "sprint" | "quarter" | "year",
  includeImplementationDetails: boolean
): any {
  const recommendations: any[] = [];

  // Code quality recommendations
  recommendations.push({
    title: "Implement consistent code formatting",
    description:
      "Add tooling for automatic code formatting (e.g., Prettier, ESLint) to ensure consistent code style.",
    priority: "medium",
    effort: "low",
    impact: "medium",
  });

  recommendations.push({
    title: "Increase test coverage",
    description:
      "Add unit and integration tests to improve code reliability and enable safer refactoring.",
    priority: "high",
    effort: "high",
    impact: "high",
  });

  // Code organization
  recommendations.push({
    title: "Refactor directory structure",
    description:
      "Organize code by feature or domain rather than by technical layer to improve maintainability.",
    priority: "medium",
    effort: "high",
    impact: "high",
  });

  // Documentation
  recommendations.push({
    title: "Improve documentation",
    description:
      "Add or update documentation for key components, APIs, and architecture decisions.",
    priority: "medium",
    effort: "medium",
    impact: "high",
  });

  // Deprecated APIs and patterns
  if (detectDeprecatedApiUsage(fileAnalyses, frameworks)) {
    recommendations.push({
      title: "Replace deprecated APIs and patterns",
      description:
        "Identify and replace usage of deprecated APIs and patterns.",
      priority: "high",
      effort: "high",
      impact: "medium",
    });
  }

  // Generate timeframe-specific recommendations
  const timeframeRecommendations = filterRecommendationsByTimeframe(
    recommendations,
    timeframe
  );

  // Add implementation details if requested
  if (includeImplementationDetails) {
    for (const rec of timeframeRecommendations) {
      rec.implementationSteps = generateImplementationSteps(
        rec.title,
        frameworks
      );
    }
  }

  return {
    summary: `The technical debt reduction plan focuses on ${timeframeRecommendations.length} key areas to improve over the ${timeframe} timeframe.`,
    recommendations: timeframeRecommendations,
  };
}

/**
 * Filter recommendations based on timeframe
 */
function filterRecommendationsByTimeframe(
  recommendations: any[],
  timeframe: "immediate" | "sprint" | "quarter" | "year"
): any[] {
  // Sort recommendations by priority and effort
  const sortedRecs = [...recommendations].sort((a, b) => {
    const priorityScore = (rec: any) =>
      rec.priority === "high" ? 3 : rec.priority === "medium" ? 2 : 1;
    const effortScore = (rec: any) =>
      rec.effort === "low" ? 3 : rec.effort === "medium" ? 2 : 1;

    const aScore = priorityScore(a) * effortScore(a);
    const bScore = priorityScore(b) * effortScore(b);

    return bScore - aScore; // Higher score first
  });

  // Select recommendations based on timeframe
  switch (timeframe) {
    case "immediate":
      // Only high priority, low effort items
      return sortedRecs
        .filter((rec) => rec.priority === "high" && rec.effort === "low")
        .slice(0, 3);

    case "sprint":
      // High and medium priority items with low to medium effort
      return sortedRecs
        .filter(
          (rec) =>
            (rec.priority === "high" || rec.priority === "medium") &&
            (rec.effort === "low" || rec.effort === "medium")
        )
        .slice(0, 5);

    case "quarter":
      // All high priority items plus medium priority with high impact
      return sortedRecs.filter(
        (rec) =>
          rec.priority === "high" ||
          (rec.priority === "medium" && rec.impact === "high")
      );

    case "year":
      // All recommendations
      return sortedRecs;

    default:
      return sortedRecs;
  }
}

/**
 * Generate implementation steps for a recommendation
 */
function generateImplementationSteps(
  title: string,
  frameworks: Record<string, any>
): string[] {
  // This would normally contain more detailed, recommendation-specific steps
  // For now, we'll provide some generic steps based on the recommendation title

  if (title.includes("React.memo")) {
    return [
      "Identify components that render frequently but rarely change",
      "Wrap these components with React.memo",
      "Add proper dependency arrays to useEffect and useCallback hooks",
      "Test performance before and after changes",
    ];
  }

  if (title.includes("code splitting")) {
    return [
      "Identify large components that aren't needed on initial load",
      "Use React.lazy and Suspense to split these components",
      "Add loading fallbacks for lazy-loaded components",
      "Test loading performance before and after changes",
    ];
  }

  if (title.includes("TypeScript")) {
    return [
      "Set up TypeScript configuration",
      "Gradually convert files from .js to .ts",
      "Add interfaces for component props",
      "Add type definitions for API responses",
      "Configure ESLint and other tools to work with TypeScript",
    ];
  }

  // Generic steps for other recommendations
  return [
    "Analyze current implementation",
    "Research best practices",
    "Create implementation plan",
    "Implement changes",
    "Test and validate",
    "Document changes",
  ];
}

/**
 * Generate a suggested architecture based on frameworks and project structure
 */
function generateSuggestedArchitecture(
  frameworks: Record<string, any>,
  projectStructure: Record<string, any>
): any {
  if (frameworks.react) {
    return {
      type: "Modern React Architecture",
      structure: [
        {
          directory: "src/components",
          description: "Reusable UI components organized by feature",
        },
        {
          directory: "src/hooks",
          description: "Custom React hooks for shared logic",
        },
        {
          directory: "src/contexts",
          description: "React context providers for state management",
        },
        {
          directory: "src/services",
          description: "API and external service integrations",
        },
        {
          directory: "src/utils",
          description: "Utility functions and helpers",
        },
        {
          directory: "src/types",
          description: "TypeScript type definitions",
        },
      ],
    };
  }

  if (frameworks.express) {
    return {
      type: "Modern Express Architecture",
      structure: [
        {
          directory: "src/controllers",
          description: "Route handlers and controller logic",
        },
        {
          directory: "src/services",
          description: "Business logic and external service integration",
        },
        {
          directory: "src/models",
          description: "Data models and database schema",
        },
        {
          directory: "src/middleware",
          description: "Express middleware functions",
        },
        {
          directory: "src/utils",
          description: "Utility functions and helpers",
        },
        {
          directory: "src/routes",
          description: "API route definitions",
        },
      ],
    };
  }

  // Default suggested architecture
  return {
    type: "Domain-Driven Architecture",
    structure: [
      {
        directory: "src/features",
        description:
          "Code organized by feature or domain, each with its own models, services, and utilities",
      },
      {
        directory: "src/shared",
        description:
          "Shared components, utilities, and types used across features",
      },
      {
        directory: "src/core",
        description: "Core business logic and application services",
      },
      {
        directory: "src/infrastructure",
        description: "Database, API clients, and other infrastructure concerns",
      },
    ],
  };
}

/**
 * Generate a summary of the repository
 */
function summarizeRepository(
  files: string[],
  fileAnalyses: Record<string, any>,
  frameworks: Record<string, any>,
  projectStructure: Record<string, any>
): any {
  // Count files by extension
  const fileExtensions: Record<string, number> = {};
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext) {
      fileExtensions[ext] = (fileExtensions[ext] || 0) + 1;
    }
  }

  // Extract primary language
  let primaryLanguage = "unknown";
  let maxCount = 0;

  for (const [ext, count] of Object.entries(fileExtensions)) {
    if (count > maxCount) {
      maxCount = count;
      switch (ext) {
        case ".js":
          primaryLanguage = "JavaScript";
          break;
        case ".ts":
        case ".tsx":
          primaryLanguage = "TypeScript";
          break;
        case ".py":
          primaryLanguage = "Python";
          break;
        case ".java":
          primaryLanguage = "Java";
          break;
        case ".go":
          primaryLanguage = "Go";
          break;
        case ".rb":
          primaryLanguage = "Ruby";
          break;
        default:
          primaryLanguage = ext.slice(1).toUpperCase();
      }
    }
  }

  // Determine project type based on frameworks and file structure
  let projectType = "unknown";

  if (frameworks.react || frameworks.vue || frameworks.angular) {
    projectType = "Frontend Application";
  } else if (frameworks.express || frameworks.django || frameworks.flask) {
    projectType = "Backend Application";
  } else if (frameworks.next) {
    projectType = "Full-Stack Application";
  } else if (
    files.some(
      (file) =>
        file.includes("Dockerfile") || file.includes("docker-compose.yml")
    )
  ) {
    projectType = "Containerized Application";
  }

  return {
    totalFiles: files.length,
    primaryLanguage,
    projectType,
    frameworks: Object.keys(frameworks).filter(
      (key) => key !== "allDependencies"
    ),
    topLevelDirectories: projectStructure.topLevelDirectories,
    fileExtensions,
  };
}

/**
 * Detect if the codebase uses a database
 */
function detectDatabaseUsage(fileAnalyses: Record<string, any>): boolean {
  // This is a simplistic implementation - in reality, we would do deeper analysis
  // Look for common database imports in the file analyses
  for (const analysis of Object.values(fileAnalyses)) {
    if (!analysis.imports) continue;

    for (const importItem of analysis.imports) {
      if (
        importItem.includes("mysql") ||
        importItem.includes("postgres") ||
        importItem.includes("sqlite") ||
        importItem.includes("mongodb") ||
        importItem.includes("mongoose") ||
        importItem.includes("sequelize") ||
        importItem.includes("typeorm") ||
        importItem.includes("prisma")
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Detect if the codebase contains API endpoints
 */
function detectApiEndpoints(fileAnalyses: Record<string, any>): boolean {
  // This is a simplistic implementation - in reality, we would do deeper analysis
  // Look for common API patterns in the file analyses
  for (const analysis of Object.values(fileAnalyses)) {
    if (!analysis.content) continue;

    const content = analysis.content.toLowerCase();
    if (
      content.includes("router.get") ||
      content.includes("router.post") ||
      content.includes("app.get") ||
      content.includes("app.post") ||
      content.includes("@get") ||
      content.includes("@post") ||
      content.includes("handlerequest")
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Detect if the codebase uses deprecated APIs
 */
function detectDeprecatedApiUsage(
  fileAnalyses: Record<string, any>,
  frameworks: Record<string, any>
): boolean {
  // This is a simplistic implementation - in reality, we would check specific APIs

  // Check for old React lifecycle methods if using React
  if (frameworks.react) {
    for (const analysis of Object.values(fileAnalyses)) {
      if (!analysis.content) continue;

      const content = analysis.content;
      if (
        content.includes("componentWillMount") ||
        content.includes("componentWillReceiveProps") ||
        content.includes("componentWillUpdate")
      ) {
        return true;
      }
    }
  }

  return false;
}
