/**
 * Core analyzer types for the MCP platform
 */

import type { IComponentMetadata } from './component.js';

export interface IAnalysisResult {
  type: 'web-component';
  name: string;
  complexity: 'low' | 'medium' | 'high';
  dependencies: string[];
  issues: IAnalysisIssue[];
  recommendations: string[];
  metadata: IComponentMetadata;
}

export interface IAnalysisIssue {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  location?: {
    file: string;
    line: number;
    column: number;
  };
  code?: string;
}

export interface IAnalyzer {
  analyzeComponent(component: IComponentMetadata): Promise<IAnalysisResult>;
}
