/**
 * Developer Tools Feature
 *
 * This feature provides specialized tools for developers working with the MCP codebase.
 * These tools are designed to enhance developer productivity by providing quick access
 * to common tasks, code insights, and documentation.
 *
 * Features include:
 * - Searching for code in the repository
 * - Quickly accessing documentation
 * - Analyzing dependencies
 * - Understanding the current state of the project
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";
import { execSync } from "child_process";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../utils/responses.js";

/**
 * Register developer tools with the MCP server
 *
 * @param server MCP server instance to register tools with
 */
export function registerDevTools(server: McpServer): void {
  // Tool to search code
  server.tool(
    "search-code",
    {
      query: z.string().describe("Search query to find code in the repository"),
      filePattern: z
        .string()
        .optional()
        .describe("Optional file pattern to limit search (e.g., '*.ts')"),
      maxResults: z
        .number()
        .default(10)
        .describe("Maximum number of results to return"),
    },
    async ({ query, filePattern, maxResults }) => {
      try {
        const searchPattern = filePattern ? `--include="${filePattern}"` : "";
        const command = `grep -n ${searchPattern} -r "${query}" src --color=never | head -n ${maxResults}`;

        let results;
        try {
          results = execSync(command, { encoding: "utf-8" });
        } catch (error) {
          // grep returns non-zero exit code when no results found
          results = "";
        }

        const matches = results
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .map((line) => {
            const [file, lineNum, ...contentParts] = line.split(":");
            const content = contentParts.join(":").trim();
            return { file, lineNum: parseInt(lineNum, 10), content };
          });

        const result = createSuccessResponse(
          {
            query,
            filePattern: filePattern || "all files",
            resultsCount: matches.length,
            matches,
          },
          "search-code"
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                createErrorResponse(
                  error instanceof Error ? error.message : String(error),
                  "search-code"
                ),
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool to show project info
  server.tool("project-info", {}, async () => {
    try {
      const packageJsonPath = join(process.cwd(), "package.json");
      let packageInfo = {};

      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
        packageInfo = {
          name: packageJson.name,
          version: packageJson.version,
          description: packageJson.description,
          dependencies: Object.keys(packageJson.dependencies || {}),
          devDependencies: Object.keys(packageJson.devDependencies || {}),
        };
      }

      // Get git info
      let gitInfo = {};
      try {
        const branch = execSync("git branch --show-current", {
          encoding: "utf-8",
        }).trim();
        const lastCommit = execSync(
          'git log -1 --pretty=format:"%h - %s (%cr)"',
          { encoding: "utf-8" }
        ).trim();
        gitInfo = { branch, lastCommit };
      } catch (e) {
        gitInfo = { error: "Git information not available" };
      }

      // Count files by type
      let fileStats = {};
      try {
        const tsFiles = execSync('find src -name "*.ts" | wc -l', {
          encoding: "utf-8",
        }).trim();
        const jsFiles = execSync('find src -name "*.js" | wc -l', {
          encoding: "utf-8",
        }).trim();
        const testFiles = execSync('find src -name "*.test.ts" | wc -l', {
          encoding: "utf-8",
        }).trim();
        fileStats = {
          tsFiles: parseInt(tsFiles, 10),
          jsFiles: parseInt(jsFiles, 10),
          testFiles: parseInt(testFiles, 10),
        };
      } catch (e) {
        fileStats = { error: "File statistics not available" };
      }

      const result = createSuccessResponse(
        {
          packageInfo,
          gitInfo,
          fileStats,
          timestamp: new Date().toISOString(),
        },
        "project-info"
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              createErrorResponse(
                error instanceof Error ? error.message : String(error),
                "project-info"
              ),
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }
  });

  // Tool to get file content
  server.tool(
    "get-file",
    {
      path: z.string().describe("Relative path to the file"),
      startLine: z
        .number()
        .optional()
        .describe("Starting line number (1-based)"),
      endLine: z.number().optional().describe("Ending line number (1-based)"),
    },
    async ({ path, startLine, endLine }) => {
      try {
        const filePath = resolve(process.cwd(), path);

        if (!existsSync(filePath)) {
          throw new Error(`File not found: ${path}`);
        }

        const content = readFileSync(filePath, "utf8");
        const lines = content.split("\n");

        let fileContent;
        if (startLine && endLine) {
          // Adjust for 0-based indexing
          const start = Math.max(0, startLine - 1);
          const end = Math.min(lines.length, endLine);
          fileContent = lines.slice(start, end).join("\n");
        } else {
          fileContent = content;
        }

        const result = createSuccessResponse(
          {
            path,
            totalLines: lines.length,
            selectedLines:
              startLine && endLine ? { start: startLine, end: endLine } : null,
            content: fileContent,
          },
          "get-file"
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                createErrorResponse(
                  error instanceof Error ? error.message : String(error),
                  "get-file"
                ),
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool to check folder structure
  server.tool(
    "folder-structure",
    {
      path: z.string().default(".").describe("Relative path to the directory"),
      depth: z.number().default(2).describe("Depth of folders to show"),
    },
    async ({ path, depth }) => {
      try {
        const dirPath = resolve(process.cwd(), path);

        if (!existsSync(dirPath)) {
          throw new Error(`Directory not found: ${path}`);
        }

        const command = `find ${dirPath} -type d | sort | head -n 100 | awk 'BEGIN {FS="/"}{for(i=1;i<=NF;i++){if(i==NF){printf("%s\\n", $i)}else{printf("%s/", $i)}}}'`;
        let dirs = execSync(command, { encoding: "utf-8" })
          .split("\n")
          .filter(Boolean);

        // Filter by depth
        dirs = dirs.filter((dir) => {
          const segments = dir.split("/");
          return segments.length <= depth;
        });

        const result = createSuccessResponse(
          {
            path,
            depth,
            count: dirs.length,
            directories: dirs,
          },
          "folder-structure"
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                createErrorResponse(
                  error instanceof Error ? error.message : String(error),
                  "folder-structure"
                ),
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );
}
