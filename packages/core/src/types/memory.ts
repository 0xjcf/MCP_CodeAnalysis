/**
 * Types of insights that can be stored in the memory system
 */
export type InsightType = 
  | "architectural-decision" 
  | "performance-bottleneck"
  | "security-concern"
  | "code-pattern"
  | "refactoring-opportunity"
  | "other";

/**
 * Categories for prioritizing insights
 */
export type InsightCategory =
  | "high-priority"
  | "medium-priority"
  | "low-priority"
  | "information";

/**
 * Structure of an insight stored in the memory system
 */
export interface Insight {
  id?: number;
  repositoryUrl: string;
  insightType: InsightType;
  category: InsightCategory;
  insightContent: string;
  relatedFiles?: string[];
  tags?: string[];
  timestamp: string;
}

/**
 * Query parameters for retrieving insights from memory
 */
export interface MemoryQuery {
  repositoryUrl: string;
  insightTypes?: string[];
  tags?: string[];
  relatedFile?: string;
  limit?: number;
} 