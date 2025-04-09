import type { AnyStateMachine } from 'xstate';

export interface IXStateAnalysisResult {
  stateCount: number;
  transitionCount: number;
  guardCount: number;
  actionCount: number;
  serviceCount: number;
  hasParallelStates: boolean;
  hasHistoryStates: boolean;
  hasFinalStates: boolean;
  complexity: number;
  performanceSuggestions: IPerformanceSuggestion[];
  states?: string[];
  events?: string[];
  transitions?: Array<{
    source: string;
    target: string;
    event: string;
  }>;
  machineDefinition?: AnyStateMachine;
}

export interface IStateAnalysis {
  id: string;
  type: string;
  transitions: Array<{
    source: string;
    target: string;
    event: string;
  }>;
  actions: string[];
  services: Array<{
    name: string;
    type: string;
  }>;
  guards: Array<{ type: string; params?: unknown }>;
}

export interface IPerformanceSuggestion {
  type: 'guard' | 'transition' | 'state' | 'action' | 'complexity';
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface IComplexityMetrics {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  stateComplexity: number;
  transitionComplexity: number;
}

export interface IAnalysisOptions {
  includePerformanceSuggestions?: boolean;
  includeComplexityMetrics?: boolean;
  maxComplexityThreshold?: number;
}

export interface IAnalyzerOptions {
  sourceCode: string;
  strict?: boolean | undefined;
  verbose?: boolean | undefined;
  timeout?: number | undefined;
}

export interface IAnalyzerResult {
  success: boolean;
  data?: IXStateAnalysisData;
  error?: string;
}

export interface IXStateAnalysisData {
  states: string[];
  events: string[];
  transitions: Array<{
    source: string;
    target: string;
    event: string;
  }>;
  services: Array<{
    name: string;
    type: string;
    implementation?: string;
  }>;
  guards: Array<{
    name: string;
    implementation?: string;
  }>;
  actions: Array<{
    name: string;
    implementation?: string;
  }>;
  metrics: {
    stateCount: number;
    transitionCount: number;
    serviceCount: number;
    guardCount: number;
    actionCount: number;
    complexityScore: number;
    complexityLevel: 'low' | 'medium' | 'high';
  };
}
