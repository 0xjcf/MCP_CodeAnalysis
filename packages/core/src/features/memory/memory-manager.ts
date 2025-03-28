import { createDatabase } from "../../utils/database.js";
import { Insight, MemoryQuery, InsightCategory, InsightType } from "../../types/memory.js";
import { Database } from "sqlite";

// Initialize database connection
let db: Database | undefined; // Will be initialized on first use

/**
 * Store a new memory/insight about a codebase
 */
export async function storeMemory(insight: Insight): Promise<number> {
  // Initialize the database if it hasn't been initialized
  if (!db) {
    db = await createDatabase("memory");
  }

  const { repositoryUrl, insightType, category, insightContent, relatedFiles, tags, timestamp } = insight;
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  // Start transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Insert the insight
    const insightResult = await db.run(
      `INSERT INTO insights (repositoryUrl, insightType, category, insightContent, timestamp)
       VALUES (?, ?, ?, ?, ?)`,
      [repositoryUrl, insightType, category, insightContent, timestamp]
    );
    
    const insightId = insightResult.lastID ?? 0; // Use default value if undefined
    
    if (insightId === 0) {
      throw new Error("Failed to insert insight - no ID returned");
    }
    
    // Insert related files
    if (relatedFiles && relatedFiles.length > 0) {
      for (const filePath of relatedFiles) {
        await db.run(
          `INSERT INTO relatedFiles (insightId, filePath) VALUES (?, ?)`,
          [insightId, filePath]
        );
      }
    }
    
    // Insert tags
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await db.run(
          `INSERT INTO tags (insightId, tag) VALUES (?, ?)`,
          [insightId, tag]
        );
      }
    }
    
    // Commit transaction
    await db.exec('COMMIT');
    
    return insightId;
  } catch (error) {
    // Rollback transaction on error
    await db.exec('ROLLBACK');
    throw error;
  }
}

/**
 * Retrieve memories/insights based on query parameters
 */
export async function retrieveMemories(query: MemoryQuery): Promise<Insight[]> {
  if (!db) {
    db = await createDatabase("memory");
  }

  if (!db) {
    throw new Error("Database not initialized");
  }

  const { repositoryUrl, insightTypes, tags, relatedFile, limit } = query;
  
  // Base query
  let sql = `
    SELECT 
      i.id, 
      i.repositoryUrl, 
      i.insightType, 
      i.category, 
      i.insightContent, 
      i.timestamp
    FROM insights i
  `;
  
  const params: any[] = [repositoryUrl];
  
  // Add conditions for related files
  if (relatedFile) {
    sql += `
      JOIN relatedFiles rf ON i.id = rf.insightId
      WHERE i.repositoryUrl = ? AND rf.filePath = ?
    `;
    params.push(relatedFile);
  } else {
    sql += ` WHERE i.repositoryUrl = ?`;
  }
  
  // Add conditions for insight types
  if (insightTypes && insightTypes.length > 0) {
    sql += ` AND i.insightType IN (${insightTypes.map(() => '?').join(',')})`;
    params.push(...insightTypes);
  }
  
  // Add conditions for tags
  if (tags && tags.length > 0) {
    sql += `
      AND i.id IN (
        SELECT insightId FROM tags
        WHERE tag IN (${tags.map(() => '?').join(',')})
        GROUP BY insightId
        HAVING COUNT(DISTINCT tag) = ?
      )
    `;
    params.push(...tags, tags.length); // Ensure all tags match
  }
  
  // Add order and limit
  sql += ` ORDER BY i.timestamp DESC`;
  
  if (limit) {
    sql += ` LIMIT ?`;
    params.push(limit);
  }
  
  // Execute query
  const insights = await db.all(sql, params);
  
  // For each insight, fetch related files and tags
  for (const insight of insights) {
    // Get related files
    insight.relatedFiles = await db.all(
      `SELECT filePath FROM relatedFiles WHERE insightId = ?`,
      [insight.id]
    ).then(rows => rows.map((row: any) => row.filePath));
    
    // Get tags
    insight.tags = await db.all(
      `SELECT tag FROM tags WHERE insightId = ?`,
      [insight.id]
    ).then(rows => rows.map((row: any) => row.tag));
  }
  
  return insights;
}

/**
 * Update an existing insight
 */
export async function updateMemory(updates: {
  id: number;
  insightContent?: string;
  insightType?: string;
  relatedFiles?: string[];
  tags?: string[];
}): Promise<void> {
  if (!db) {
    db = await createDatabase("memory");
  }
  
  if (!db) {
    throw new Error("Database not initialized");
  }
  
  const { id, insightContent, insightType, relatedFiles, tags } = updates;
  
  // Begin transaction
  await db.exec('BEGIN TRANSACTION');
  
  try {
    // Update basic insight data if provided
    if (insightContent || insightType) {
      let sql = `UPDATE insights SET`;
      const params: any[] = [];
      
      if (insightContent) {
        sql += ` insightContent = ?,`;
        params.push(insightContent);
      }
      
      if (insightType) {
        sql += ` insightType = ?,`;
        params.push(insightType);
      }
      
      // Remove trailing comma
      sql = sql.slice(0, -1);
      
      sql += ` WHERE id = ?`;
      params.push(id);
      
      // Execute update
      await db.run(sql, params);
    }
    
    // Update related files if provided
    if (relatedFiles) {
      // Delete existing relationships
      await db.run(`DELETE FROM relatedFiles WHERE insightId = ?`, [id]);
      
      // Insert new relationships
      for (const filePath of relatedFiles) {
        await db.run(
          `INSERT INTO relatedFiles (insightId, filePath) VALUES (?, ?)`,
          [id, filePath]
        );
      }
    }
    
    // Update tags if provided
    if (tags) {
      // Delete existing tags
      await db.run(`DELETE FROM tags WHERE insightId = ?`, [id]);
      
      // Insert new tags
      for (const tag of tags) {
        await db.run(
          `INSERT INTO tags (insightId, tag) VALUES (?, ?)`,
          [id, tag]
        );
      }
    }
    
    await db.exec('COMMIT');
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
}

/**
 * Categorize an insight based on its content and type
 * This would ideally use NLP or other heuristics to determine priority
 */
export async function categorizeInsight(
  insightContent: string, 
  insightType: InsightType
): Promise<InsightCategory> {
  // Simple heuristic for categorization - would be replaced with actual ML/NLP
  
  // Security concerns are usually high priority
  if (insightType === "security-concern") {
    return "high-priority";
  }
  
  // Check for urgent keywords
  const urgentKeywords = ["critical", "urgent", "immediate", "severe", "vulnerability"];
  if (urgentKeywords.some(keyword => insightContent.toLowerCase().includes(keyword))) {
    return "high-priority";
  }
  
  // Performance bottlenecks might be medium priority
  if (insightType === "performance-bottleneck") {
    return "medium-priority";
  }
  
  // Check for medium-priority keywords
  const mediumKeywords = ["important", "should", "improve", "refactor"];
  if (mediumKeywords.some(keyword => insightContent.toLowerCase().includes(keyword))) {
    return "medium-priority";
  }
  
  // Refactoring opportunities might be low priority
  if (insightType === "refactoring-opportunity" || insightType === "code-pattern") {
    return "low-priority";
  }
  
  // Default to information if no specific category is determined
  return "information";
} 