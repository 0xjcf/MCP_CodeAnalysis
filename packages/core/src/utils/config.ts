import fs from "fs";
import path from "path";

/**
 * Default configuration for the MCP server
 */
const defaultConfig = {
  server: {
    name: "CodeAnalysisPro",
    version: "1.0.0",
    transport: "stdio" // stdio or http
  },
  features: {
    basicAnalysis: true,
    memory: true,
    visualization: true,
    knowledgeGraph: true,
    multiRepo: true,
    evolution: true,
    socioTechnical: true,
    compliance: true,
    coaching: true,
    simulation: true,
    domainSpecific: true
  },
  http: {
    port: 3000,
    host: "localhost"
  },
  storage: {
    path: "./data"
  }
};

/**
 * Load configuration from file or create default config file if none exists
 */
export function loadConfig(): typeof defaultConfig {
  const configPath = path.join(process.cwd(), "config", "config.json");
  
  try {
    if (fs.existsSync(configPath)) {
      const userConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
      return { ...defaultConfig, ...userConfig };
    }
  } catch (error) {
    console.warn(`Error loading config: ${(error as Error).message}`);
  }
  
  // Save default config if none exists
  try {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  } catch (error) {
    console.warn(`Error saving default config: ${(error as Error).message}`);
  }
  
  return defaultConfig;
}

/**
 * Get the active configuration
 */
export const config = loadConfig(); 