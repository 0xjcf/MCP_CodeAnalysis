import type { Analyzer, AnalysisResult, AnalysisOptions } from '@mcp/core';

// Base types for common structures
type BaseAnalysisResult = {
  success: boolean;
  error?: string;
};

type BaseComponentInfo = {
  name: string;
  tagName: string;
  attributes: string[];
  properties: string[];
  methods: string[];
  events: string[];
  slots: string[];
  shadowRoot: boolean;
  template: string | null;
  styles: string[];
};

export type BasePerformanceInfo = {
  hasPerformanceIssues: boolean;
  issues: PerformanceIssue[];
  hasLargeBundleSize: boolean;
  hasSlowRendering: boolean;
  hasMemoryLeaks: boolean;
  hasNetworkIssues: boolean;
  hasResourceLoadingIssues: boolean;
  hasAnimationPerformanceIssues: boolean;
  hasLayoutThrashing: boolean;
  hasEventHandlingIssues: boolean;
  hasDOMManipulationIssues: boolean;
  constructorTime: number;
  renderTime: number;
  updateTime: number;
  memoryUsage: number;
  reflowCount: number;
  repaintCount: number;
  optimizationSuggestions: string[];
};

type BaseAccessibilityInfo = {
  hasAccessibilityIssues: boolean;
  issues: AccessibilityIssue[];
  hasRoles: boolean;
  hasLabels: boolean;
  hasFocusableElements: boolean;
  hasAriaAttributes: boolean;
  hasKeyboardSupport: boolean;
  hasSemanticHTML: boolean;
  hasTextAlternatives: boolean;
  hasFocusManagement: boolean;
  hasColorContrast: boolean;
  hasDynamicContent: boolean;
  hasFormElements: boolean;
  hasInteractiveElements: boolean;
  hasHeadings: boolean;
  hasLists: boolean;
  hasTables: boolean;
  hasIframes: boolean;
  hasMedia: boolean;
};

type BaseComponentData = {
  components: WebComponent[];
  lifecycleHooks: string[];
  shadowDOMUsage: string[];
  properties: Property[];
  events: WebComponentEvent[];
  accessibility: AccessibilityInfo;
  performance: BasePerformanceInfo;
};

type BaseMetrics = {
  totalComponents: number;
  totalCustomElements: number;
  totalShadowRoots: number;
  totalSlots: number;
  totalEvents: number;
  totalProperties: number;
};

// Main interface using type composition
export interface WebComponentAnalysisResult
  extends BaseAnalysisResult,
    BaseComponentInfo,
    BaseMetrics {
  type: 'web-component';
  complexity: 'low' | 'medium' | 'high';
  dependencies: string[];
  issues: string[];
  recommendations: string[];
  metadata: {
    name: string;
    description: string;
    version: string;
    properties: string[];
    events: string[];
    methods: string[];
    styling: {
      hasCSS: boolean;
      hasScopedCSS: boolean;
      hasCSSVariables: boolean;
      hasMediaQueries: boolean;
      hasAnimations: boolean;
      hasTransitions: boolean;
      hasFlexbox: boolean;
      hasGrid: boolean;
      hasCustomProperties: boolean;
      hasShadowDOM: boolean;
    };
    accessibility: BaseAccessibilityInfo;
    performance: BasePerformanceInfo;
  };
  accessibility: BaseAccessibilityInfo;
  performance: BasePerformanceInfo;
  data: BaseComponentData;
  performanceMetrics: {
    constructorTime: number;
    renderTime: number;
    updateTime: number;
    memoryUsage: number;
  };
}

export interface WebComponentEvent {
  name: string;
  type: 'event-handler' | 'custom-event';
  component: string;
  hasListener?: boolean;
  isBubbling?: boolean;
  isComposed?: boolean;
}

export interface WebComponent {
  name?: string;
  tagName: string;
  extends: string;
  isCustomElement: boolean;
  usesShadowDOM: boolean;
  lifecycleHooks: string[];
  properties: Property[];
  events: WebComponentEvent[];
  accessibility: AccessibilityInfo;
  performance: BasePerformanceInfo;
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
  delegatesFocus?: boolean;
}

export interface Property {
  name: string;
  type: string;
  defaultValue?: string;
  isPublic: boolean;
  isReadonly: boolean;
}

export interface OptimizationSuggestion {
  type: string;
  message: string;
}

export interface PerformanceIssue {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  location?: string;
  suggestion?: string;
}

export interface AccessibilityIssue {
  type:
    | 'missing-role'
    | 'missing-label'
    | 'focus-management'
    | 'keyboard-navigation'
    | 'screen-reader'
    | 'color-contrast'
    | 'dynamic-content'
    | 'form-elements'
    | 'interactive-elements'
    | 'semantic-html';
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface AccessibilityInfo {
  hasAccessibilityIssues: boolean;
  issues: AccessibilityIssue[];
  hasRoles: boolean;
  hasLabels: boolean;
  hasFocusableElements: boolean;
  hasAriaAttributes: boolean;
  hasKeyboardSupport: boolean;
  hasSemanticHTML: boolean;
  hasTextAlternatives: boolean;
  hasFocusManagement: boolean;
  hasColorContrast: boolean;
  hasDynamicContent: boolean;
  hasFormElements: boolean;
  hasInteractiveElements: boolean;
  hasHeadings: boolean;
  hasLists: boolean;
  hasTables: boolean;
  hasIframes: boolean;
  hasMedia: boolean;
}

export interface PerformanceInfo {
  optimizationSuggestions: string[];
  metrics: Record<string, number>;
}

export interface AccessibilityMetrics {
  hasAriaAttributes: boolean;
  hasKeyboardSupport: boolean;
  hasSemanticHTML: boolean;
  hasTextAlternatives: boolean;
  hasFocusManagement: boolean;
  hasColorContrast: boolean;
  hasDynamicContent: boolean;
  hasFormElements: boolean;
  hasInteractiveElements: boolean;
  hasHeadings: boolean;
  hasLists: boolean;
  hasTables: boolean;
  hasIframes: boolean;
  hasMedia: boolean;
  issues: AccessibilityIssue[];
}

export interface WebComponentsAnalyzerOptions {
  includeAccessibility?: boolean;
  includePerformance?: boolean;
}

export interface WebComponentsAnalyzer extends Analyzer {
  analyze(sourceCode: string, options?: AnalysisOptions): Promise<WebComponentAnalysisResult>;
}

// Update the global declaration to use a more standard approach
declare global {
  interface Window {
    readonly customElements: CustomElementRegistry;
  }
}

// Export the global type
export type GlobalWindow = Window & typeof globalThis;
