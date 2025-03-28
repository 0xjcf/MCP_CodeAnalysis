import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from "fs";
import path from "path";
import { config } from "./config.js";

// Database connection cache
const dbConnections: Record<string, any> = {};

/**
 * Create and initialize a database connection
 */
export async function createDatabase(dbName: string) {
  // Return cached connection if exists
  if (dbConnections[dbName]) {
    return dbConnections[dbName];
  }

  const dataDir = path.resolve(process.cwd(), config.storage.path);
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const dbPath = path.join(dataDir, `${dbName}.db`);
  
  // Open database with promises interface
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  // Cache the connection
  dbConnections[dbName] = db;
  
  return db;
}

/**
 * Initialize all databases required by the application
 */
export async function initializeDatabases(): Promise<void> {
  // Memory database
  const memoryDb = await createDatabase("memory");
  await memoryDb.exec(`
    CREATE TABLE IF NOT EXISTS insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repositoryUrl TEXT NOT NULL,
      insightType TEXT NOT NULL,
      category TEXT NOT NULL,
      insightContent TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS relatedFiles (
      insightId INTEGER,
      filePath TEXT NOT NULL,
      FOREIGN KEY (insightId) REFERENCES insights(id) ON DELETE CASCADE,
      PRIMARY KEY (insightId, filePath)
    );
    
    CREATE TABLE IF NOT EXISTS tags (
      insightId INTEGER,
      tag TEXT NOT NULL,
      FOREIGN KEY (insightId) REFERENCES insights(id) ON DELETE CASCADE,
      PRIMARY KEY (insightId, tag)
    );
  `);
  
  // Knowledge graph database
  const knowledgeDb = await createDatabase("knowledge");
  await knowledgeDb.exec(`
    CREATE TABLE IF NOT EXISTS nodes (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      attributes TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS relationships (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      sourceId TEXT NOT NULL,
      targetId TEXT NOT NULL,
      attributes TEXT NOT NULL,
      FOREIGN KEY (sourceId) REFERENCES nodes(id) ON DELETE CASCADE,
      FOREIGN KEY (targetId) REFERENCES nodes(id) ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(sourceId);
    CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(targetId);
  `);
  
  // Repository cache database
  const repoDb = await createDatabase("repository_cache");
  await repoDb.exec(`
    CREATE TABLE IF NOT EXISTS repositories (
      url TEXT PRIMARY KEY,
      localPath TEXT NOT NULL,
      lastUpdated TEXT NOT NULL
    );
  `);
} 