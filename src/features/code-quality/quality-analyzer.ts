export interface IQualityIssue {
  message: string;
  severity: 'error' | 'warning' | 'info';
  line?: number;
  column?: number;
  filePath: string;
}

export interface IQualityRule {
  name: string;
  description: string;
  analyze: (content: string, filePath: string, lineIndex?: number) => IQualityIssue[];
}

export interface IQualityAnalysisResult {
  issues: IQualityIssue[];
  summary: {
    totalIssues: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };
}

// Type aliases for non-interface types
export type QualityIssue = IQualityIssue;
export type QualityRule = IQualityRule;
export type QualityAnalysisResult = IQualityAnalysisResult;
