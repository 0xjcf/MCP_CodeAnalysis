import type { Analyzer, AnalysisResult, AnalysisOptions } from '@mcp/core';

export interface WebComponentAnalysisResult extends AnalysisResult {
  components: WebComponent[];
  totalComponents: number;
  totalCustomElements: number;
  totalShadowRoots: number;
  totalSlots: number;
  totalEvents: number;
  totalProperties: number;
  performanceMetrics: {
    constructorTime: number;
    renderTime: number;
    updateTime: number;
    memoryUsage: number;
  };
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
  tagName: string;
  extends?: string;
  lifecycleHooks: string[];
  properties: Property[];
  events: Event[];
  shadowDOM: boolean;
  slots?: string[];
  isCustomElement: boolean;
  usesShadowDOM: boolean;
  location: {
    file: string;
    line: number;
    column: number;
  };
  accessibility: AccessibilityMetrics;
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
  type: 'custom' | 'standard' | 'lifecycle';
  isBubbling: boolean;
  isComposed: boolean;
  hasListener: boolean;
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
  optimizationSuggestions: OptimizationSuggestion[];
}

export interface OptimizationSuggestion {
  type: 'render' | 'memory' | 'reflow' | 'repaint' | 'event' | 'shadow-dom';
  description: string;
  impact: 'high' | 'medium' | 'low';
  location: {
    file: string;
    line: number;
    column: number;
  };
  code: string;
  suggestion: string;
}

export interface AccessibilityMetrics {
  hasAriaAttributes: boolean;
  hasKeyboardSupport: boolean;
  hasSemanticHTML: boolean;
  hasTextAlternatives: boolean;
  issues: AccessibilityIssue[];
}

export interface AccessibilityIssue {
  type: 'aria' | 'keyboard' | 'semantic' | 'contrast' | 'text';
  severity: 'error' | 'warning' | 'info';
  description: string;
  location: Location;
  suggestion: string;
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
