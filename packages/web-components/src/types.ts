import type { Analyzer, AnalysisResult, AnalysisOptions } from '@mcp/core';

export interface WebComponentAnalysisResult extends AnalysisResult {
  data: {
    components: WebComponent[];
    lifecycleHooks: LifecycleHook[];
    shadowDOMUsage: ShadowDOMUsage[];
    properties: Property[];
    events: Event[];
    performance: PerformanceMetrics;
  };
}

export interface WebComponent {
  name: string;
  extends?: string;
  lifecycleHooks: string[];
  properties: Property[];
  events: Event[];
  shadowDOM: boolean;
  location: {
    file: string;
    line: number;
    column: number;
  };
}

export interface LifecycleHook {
  name: string;
  component: string;
  location: {
    file: string;
    line: number;
    column: number;
  };
}

export interface ShadowDOMUsage {
  component: string;
  mode: 'open' | 'closed';
  location: {
    file: string;
    line: number;
    column: number;
  };
}

export interface Property {
  name: string;
  type: string;
  required: boolean;
  component: string;
  location: {
    file: string;
    line: number;
    column: number;
  };
}

export interface Event {
  name: string;
  component: string;
  location: {
    file: string;
    line: number;
    column: number;
  };
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  reflowCount: number;
  repaintCount: number;
}

export interface WebComponentsAnalyzerOptions extends AnalysisOptions {
  analyzePerformance?: boolean;
  analyzeShadowDOM?: boolean;
  analyzeLifecycle?: boolean;
}

export interface WebComponentsAnalyzer extends Analyzer {
  analyze(
    sourceCode: string,
    options?: WebComponentsAnalyzerOptions,
  ): Promise<WebComponentAnalysisResult>;
}
