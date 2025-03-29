/**
 * Core analyzer types for the MCP platform
 */

import { ComponentMetadata } from '../../types/component.js';

export interface AnalysisResult {
  type: 'web-component';
  name: string;
  complexity: 'low' | 'medium' | 'high';
  dependencies: string[];
  issues: AnalysisIssue[];
  recommendations: string[];
  metadata: ComponentMetadata;
}

export interface AnalysisIssue {
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

export interface Analyzer {
  analyzeComponent(component: any): Promise<AnalysisResult>;
}
