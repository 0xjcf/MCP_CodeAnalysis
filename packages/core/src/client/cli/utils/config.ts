import fs from 'fs';
import path from 'path';
import os from 'os';

// Configuration constants
const CONFIG_DIR = path.join(os.homedir(), '.codeanalysis');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// Default configuration
const DEFAULT_CONFIG = {
  serverPath: './dist/server.js',
  output: 'text',
  debug: false,
  analysis: {
    depth: 2,
    dependencies: true,
    complexity: true
  },
  visualization: {
    format: 'mermaid'
  }
};

/**
 * Load configuration from file
 */
export function loadConfig(): typeof DEFAULT_CONFIG {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return DEFAULT_CONFIG;
    }
    
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    console.error(`Error loading config: ${error}`);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save configuration to file
 */
export function saveConfig(config: Partial<typeof DEFAULT_CONFIG>): void {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    
    const existingConfig = loadConfig();
    const newConfig = { ...existingConfig, ...config };
    
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
  } catch (error) {
    console.error(`Error saving config: ${error}`);
  }
}

/**
 * Get a specific configuration value
 */
export function getConfigValue<T>(key: string, defaultValue?: T): T {
  const config = loadConfig();
  
  // Handle nested keys (e.g., 'analysis.depth')
  const parts = key.split('.');
  let current: any = config;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return defaultValue as T;
    }
  }
  
  return current as T;
}

/**
 * Set a specific configuration value
 */
export function setConfigValue(key: string, value: any): void {
  const config = loadConfig();
  
  // Handle nested keys (e.g., 'analysis.depth')
  const parts = key.split('.');
  let current: any = config;
  
  // Navigate to the proper nesting level
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  
  // Set the value
  current[parts[parts.length - 1]] = value;
  
  // Save the updated config
  saveConfig(config);
} 