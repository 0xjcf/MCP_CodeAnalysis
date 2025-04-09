/**
 * Core analyzer types for the MCP platform
 */

import type { ComponentMetadata } from '../../types/component.js';

interface IAnalysisResult {
  type: 'web-component';
  name: string;
  complexity: 'low' | 'medium' | 'high';
  dependencies: string[];
  issues: IAnalysisIssue[];
  recommendations: string[];
  metadata: ComponentMetadata;
}

interface IAnalysisIssue {
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

interface IAnalyzer {
  analyzeComponent(component: any): Promise<IAnalysisResult>;
}
