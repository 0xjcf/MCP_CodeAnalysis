import {
  AnyStateMachine,
  StateNode,
  TransitionDefinition,
  EventObject,
  UnknownAction,
  InvokeDefinition,
} from 'xstate';

export interface XStateAnalysisResult {
  stateCount: number;
  transitionCount: number;
  guardCount: number;
  actionCount: number;
  serviceCount: number;
  hasParallelStates: boolean;
  hasHistoryStates: boolean;
  hasFinalStates: boolean;
  complexity: number;
  performanceSuggestions: PerformanceSuggestion[];
}

export interface StateAnalysis {
  id: string;
  type: string;
  transitions: TransitionDefinition<any, EventObject>[];
  actions: UnknownAction[];
  services: InvokeDefinition<any, any, any, any, any, any, any, any>[];
  guards: Array<{ type: string; params?: any }>;
}

export interface PerformanceSuggestion {
  type: 'guard' | 'transition' | 'state' | 'action' | 'complexity';
  message: string;
  severity: 'info' | 'warning' | 'error';
}

export interface ComplexityMetrics {
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  stateComplexity: number;
  transitionComplexity: number;
}

export interface AnalysisOptions {
  includePerformanceSuggestions?: boolean;
  includeComplexityMetrics?: boolean;
  maxComplexityThreshold?: number;
}
