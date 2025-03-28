import { promises as fs } from "fs";
import path from "path";
import { Tool, ToolResult } from "../interfaces";
import { ToolState } from "../../state/interfaces/toolExecutionService";

/**
 * Parameters for the file metrics analyzer tool
 */
interface FileMetricsParams {
  /**
   * File path to analyze
   */
  filePath: string;

  /**
   * Optional file content (if already loaded)
   */
  fileContent?: string;

  /**
   * Whether to include detailed line metrics
   */
  includeLineMetrics?: boolean;
}

/**
 * Result of file metrics analysis
 */
interface FileMetricsResult {
  /**
   * File path that was analyzed
   */
  filePath: string;

  /**
   * File size in bytes
   */
  sizeBytes: number;

  /**
   * Number of lines in the file
   */
  lineCount: number;

  /**
   * Number of code lines (non-empty, non-comment)
   */
  codeLineCount: number;

  /**
   * Number of comment lines
   */
  commentLineCount: number;

  /**
   * Number of blank lines
   */
  blankLineCount: number;

  /**
   * Line-by-line metrics (if requested)
   */
  lineMetrics?: {
    lineNumber: number;
    type: "code" | "comment" | "blank" | "mixed";
    content: string;
    indentation: number;
  }[];

  /**
   * File language/type based on extension
   */
  fileType: string;

  /**
   * Basic complexity metrics
   */
  complexity: {
    /**
     * Average line length
     */
    avgLineLength: number;

    /**
     * Number of functions/methods (estimated)
     */
    functionCount: number;

    /**
     * Maximum line length
     */
    maxLineLength: number;

    /**
     * Maximum nesting depth (estimated)
     */
    maxNestingDepth: number;
  };
}

/**
 * State for the file metrics analyzer tool
 */
interface FileMetricsState extends ToolState {
  /**
   * Cache of recently analyzed files
   */
  fileCache?: Map<
    string,
    {
      timestamp: number;
      metrics: FileMetricsResult;
    }
  >;
}

/**
 * Tool for analyzing source code file metrics
 *
 * Features:
 * - Line counting (total, code, comment, blank)
 * - Size analysis
 * - Basic complexity estimation
 * - Language detection
 * - Detailed line-by-line metrics
 */
export const fileMetricsAnalyzer: Tool<FileMetricsParams, FileMetricsResult> = {
  id: "analyze-file-metrics",
  name: "File Metrics Analyzer",
  description: "Analyzes source code files to calculate various metrics",
  version: "1.0.0",
  category: "code-analysis",
  cacheTtl: 3600, // Cache results for 1 hour
  supportsState: true,

  async execute(
    params: FileMetricsParams,
    state: FileMetricsState = {}
  ): Promise<ToolResult<FileMetricsResult>> {
    try {
      // Initialize state if not exists
      if (!state.fileCache) {
        state.fileCache = new Map();
      }

      const { filePath, fileContent, includeLineMetrics = false } = params;

      // Check if we have this file in state cache and it's not older than 5 minutes
      const cachedResult = state.fileCache.get(filePath);
      if (cachedResult && Date.now() - cachedResult.timestamp < 5 * 60 * 1000) {
        console.log(`Using cached metrics for ${filePath}`);
        return {
          result: cachedResult.metrics,
          state,
        };
      }

      // Load file content if not provided
      let content: string;
      if (fileContent) {
        content = fileContent;
      } else {
        try {
          content = await fs.readFile(filePath, "utf-8");
        } catch (error: any) {
          return {
            result: null as unknown as FileMetricsResult,
            error: `Failed to read file: ${error?.message || String(error)}`,
            state,
          };
        }
      }

      // Get file extension for language detection
      const extension = path.extname(filePath).toLowerCase().slice(1);
      const fileType = getFileType(extension);

      // Process the file content
      const lines = content.split(/\r?\n/);
      const sizeBytes = Buffer.from(content).length;

      // Count lines by type
      let codeLineCount = 0;
      let commentLineCount = 0;
      let blankLineCount = 0;
      let totalLength = 0;
      let maxLineLength = 0;
      let maxNestingDepth = 0;
      let currentNestingDepth = 0;
      let functionCount = 0;

      // Detailed metrics for each line
      const lineMetrics = includeLineMetrics
        ? ([] as Array<{
            lineNumber: number;
            type: "code" | "comment" | "blank" | "mixed";
            content: string;
            indentation: number;
          }>)
        : undefined;

      // Get comment patterns for this file type
      const { lineComment, blockCommentStart, blockCommentEnd } =
        getCommentPatterns(fileType);
      let inBlockComment = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        const lineLength = line.length;

        // Track max line length
        if (lineLength > maxLineLength) {
          maxLineLength = lineLength;
        }

        // Track total length for average calculation
        totalLength += lineLength;

        // Calculate indentation level
        const indentation = line.length - line.trimLeft().length;

        // Update nesting depth based on brackets/braces
        if (!inBlockComment && trimmedLine.includes("{")) {
          currentNestingDepth +=
            countOccurrences(trimmedLine, "{") -
            countOccurrences(trimmedLine, "}");
          // Check if this might be a function declaration
          if (isFunctionDeclaration(trimmedLine, fileType)) {
            functionCount++;
          }
        } else if (!inBlockComment && trimmedLine.includes("}")) {
          currentNestingDepth -=
            countOccurrences(trimmedLine, "}") -
            countOccurrences(trimmedLine, "{");
        }

        // Ensure nesting depth doesn't go negative
        currentNestingDepth = Math.max(0, currentNestingDepth);

        // Track maximum nesting depth
        if (currentNestingDepth > maxNestingDepth) {
          maxNestingDepth = currentNestingDepth;
        }

        // Determine line type
        let lineType: "code" | "comment" | "blank" | "mixed" = "code";

        // Check for blank lines
        if (trimmedLine === "") {
          blankLineCount++;
          lineType = "blank";
        }
        // Check for full-line comments
        else if (
          (lineComment && trimmedLine.startsWith(lineComment)) ||
          (inBlockComment &&
            blockCommentEnd &&
            !trimmedLine.includes(blockCommentEnd))
        ) {
          commentLineCount++;
          lineType = "comment";
        }
        // Check for block comment start
        else if (blockCommentStart && trimmedLine.includes(blockCommentStart)) {
          inBlockComment = true;

          // Check if the block comment ends on the same line
          if (blockCommentEnd && trimmedLine.includes(blockCommentEnd)) {
            inBlockComment = false;

            // If there's code after the comment ends, it's a mixed line
            const afterComment = blockCommentEnd
              ? trimmedLine
                  .slice(
                    trimmedLine.indexOf(blockCommentEnd) +
                      blockCommentEnd.length
                  )
                  .trim()
              : "";

            if (
              afterComment &&
              lineComment !== null &&
              !afterComment.startsWith(lineComment)
            ) {
              lineType = "mixed";
              codeLineCount++;
              commentLineCount++;
            } else {
              lineType = "comment";
              commentLineCount++;
            }
          } else {
            lineType = "comment";
            commentLineCount++;
          }
        }
        // Check for block comment end
        else if (
          inBlockComment &&
          blockCommentEnd &&
          trimmedLine.includes(blockCommentEnd)
        ) {
          inBlockComment = false;

          // If there's code after the comment ends, it's a mixed line
          const afterComment = blockCommentEnd
            ? trimmedLine
                .slice(
                  trimmedLine.indexOf(blockCommentEnd) + blockCommentEnd.length
                )
                .trim()
            : "";

          if (
            afterComment &&
            lineComment !== null &&
            !afterComment.startsWith(lineComment)
          ) {
            lineType = "mixed";
            codeLineCount++;
            commentLineCount++;
          } else {
            lineType = "comment";
            commentLineCount++;
          }
        }
        // Must be a code line
        else {
          codeLineCount++;
          lineType = "code";
        }

        // Add to detailed metrics if requested
        if (includeLineMetrics && lineMetrics) {
          lineMetrics.push({
            lineNumber: i + 1,
            type: lineType,
            content: line,
            indentation,
          });
        }
      }

      // Create the result object
      const result: FileMetricsResult = {
        filePath,
        sizeBytes,
        lineCount: lines.length,
        codeLineCount,
        commentLineCount,
        blankLineCount,
        lineMetrics,
        fileType,
        complexity: {
          avgLineLength: totalLength / lines.length,
          functionCount,
          maxLineLength,
          maxNestingDepth,
        },
      };

      // Update cache
      state.fileCache.set(filePath, {
        timestamp: Date.now(),
        metrics: result,
      });

      // Prune old entries if cache grows too large
      if (state.fileCache.size > 100) {
        const entries = Array.from(state.fileCache.entries());
        const oldestEntries = entries
          .sort((a, b) => a[1].timestamp - b[1].timestamp)
          .slice(0, 20);

        for (const [key] of oldestEntries) {
          state.fileCache.delete(key);
        }
      }

      return {
        result,
        state,
      };
    } catch (error: any) {
      console.error("Error analyzing file metrics:", error);
      return {
        result: null as unknown as FileMetricsResult,
        error: `Failed to analyze file metrics: ${
          error?.message || String(error)
        }`,
        state,
      };
    }
  },
};

/**
 * Helper function to determine file type from extension
 */
function getFileType(extension: string): string {
  const typeMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    go: "go",
    rb: "ruby",
    php: "php",
    rs: "rust",
    swift: "swift",
    kt: "kotlin",
    scala: "scala",
    html: "html",
    css: "css",
    scss: "scss",
    less: "less",
    json: "json",
    md: "markdown",
    sh: "shell",
    yml: "yaml",
    yaml: "yaml",
    xml: "xml",
    sql: "sql",
  };

  return typeMap[extension] || "text";
}

/**
 * Helper function to get comment patterns for a file type
 */
function getCommentPatterns(fileType: string): {
  lineComment: string | null;
  blockCommentStart: string | null;
  blockCommentEnd: string | null;
} {
  const patterns: Record<
    string,
    {
      lineComment: string | null;
      blockCommentStart: string | null;
      blockCommentEnd: string | null;
    }
  > = {
    javascript: {
      lineComment: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
    },
    typescript: {
      lineComment: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
    },
    python: {
      lineComment: "#",
      blockCommentStart: '"""',
      blockCommentEnd: '"""',
    },
    java: { lineComment: "//", blockCommentStart: "/*", blockCommentEnd: "*/" },
    c: { lineComment: "//", blockCommentStart: "/*", blockCommentEnd: "*/" },
    cpp: { lineComment: "//", blockCommentStart: "/*", blockCommentEnd: "*/" },
    csharp: {
      lineComment: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
    },
    go: { lineComment: "//", blockCommentStart: "/*", blockCommentEnd: "*/" },
    ruby: {
      lineComment: "#",
      blockCommentStart: "=begin",
      blockCommentEnd: "=end",
    },
    php: { lineComment: "//", blockCommentStart: "/*", blockCommentEnd: "*/" },
    rust: { lineComment: "//", blockCommentStart: "/*", blockCommentEnd: "*/" },
    swift: {
      lineComment: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
    },
    kotlin: {
      lineComment: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
    },
    scala: {
      lineComment: "//",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
    },
    html: {
      lineComment: null,
      blockCommentStart: "<!--",
      blockCommentEnd: "-->",
    },
    css: { lineComment: null, blockCommentStart: "/*", blockCommentEnd: "*/" },
    scss: { lineComment: "//", blockCommentStart: "/*", blockCommentEnd: "*/" },
    less: { lineComment: "//", blockCommentStart: "/*", blockCommentEnd: "*/" },
    json: { lineComment: null, blockCommentStart: null, blockCommentEnd: null },
    markdown: {
      lineComment: null,
      blockCommentStart: null,
      blockCommentEnd: null,
    },
    shell: { lineComment: "#", blockCommentStart: null, blockCommentEnd: null },
    yaml: { lineComment: "#", blockCommentStart: null, blockCommentEnd: null },
    xml: {
      lineComment: null,
      blockCommentStart: "<!--",
      blockCommentEnd: "-->",
    },
    sql: { lineComment: "--", blockCommentStart: "/*", blockCommentEnd: "*/" },
  };

  return (
    patterns[fileType] || {
      lineComment: null,
      blockCommentStart: null,
      blockCommentEnd: null,
    }
  );
}

/**
 * Helper function to count occurrences of a substring
 */
function countOccurrences(str: string, searchValue: string): number {
  let count = 0;
  let position = str.indexOf(searchValue);

  while (position !== -1) {
    count++;
    position = str.indexOf(searchValue, position + 1);
  }

  return count;
}

/**
 * Helper function to detect if a line might contain a function declaration
 */
function isFunctionDeclaration(line: string, fileType: string): boolean {
  const jsPattern =
    /function\s+\w+\s*\(|(\w+|\(.*\))\s*=>\s*{|\w+\s*\(.*\)\s*{/;
  const pyPattern = /def\s+\w+\s*\(/;
  const javaPattern = /(\w+\s+)*\w+\s*\(.*\)\s*{/;
  const rubyPattern = /def\s+\w+/;
  const goPattern = /func\s+\w+\s*\(/;

  switch (fileType) {
    case "javascript":
    case "typescript":
      return jsPattern.test(line);
    case "python":
      return pyPattern.test(line);
    case "java":
    case "c":
    case "cpp":
    case "csharp":
      return javaPattern.test(line);
    case "ruby":
      return rubyPattern.test(line);
    case "go":
      return goPattern.test(line);
    default:
      return false;
  }
}
