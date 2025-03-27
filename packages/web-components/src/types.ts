import type { AnalysisResult, AnalysisOptions } from "@mcp/core";

// Analysis result specific to web components
export interface IWebComponentAnalysisResult extends AnalysisResult {
  components: IWebComponent[];
  totalComponents: number;
  totalCustomElements: number;
  totalShadowRoots: number;
  totalSlots: number;
  totalEvents: number;
  totalProperties: number;
  performanceMetrics: IPerformanceMetrics;
  type: "web-component";
  name: string;
  complexity: "low" | "medium" | "high";
  dependencies: string[];
  issues: AnalysisIssue[];
  recommendations: string[];
  metadata: ComponentMetadata;
}

// Represents a single web component
export interface IWebComponent {
  tagName: string;
  className: string;
  extends?: string;
  lifecycleHooks: ILifecycleHook[];
  shadowDOM?: IShadowDOMUsage;
  slots: string[];
  properties: IProperty[];
  events: IEvent[];
  metrics: IPerformanceMetrics;
}

// Lifecycle hooks used in the component
export interface ILifecycleHook {
  name: string;
  used: boolean;
  hasAsyncLogic: boolean;
  dependencies: string[];
  callbackCount: number;
}

// Shadow DOM configuration
export interface IShadowDOMUsage {
  mode: "open" | "closed";
  delegatesFocus: boolean;
  adoptedStyleSheets: boolean;
}

// Component property definition
export interface IProperty {
  name: string;
  type: string;
  defaultValue?: unknown;
  attribute?: string;
  reflect: boolean;
  observed: boolean;
  hasGetter: boolean;
  hasSetter: boolean;
}

// Component event definition
export interface IEvent {
  name: string;
  bubbles: boolean;
  composed: boolean;
  cancelable: boolean;
  detail?: unknown;
  listeners: number;
}

// Performance metrics for the component
export interface IPerformanceMetrics {
  constructorTime: number;
  renderTime: number;
  updateTime: number;
  memoryUsage: number;
}

// Options for the analyzer
export interface IWebComponentsAnalyzerOptions extends AnalysisOptions {
  includeMetrics?: boolean;
  deepAnalysis?: boolean;
}

// Main analyzer interface
export interface IWebComponentsAnalyzer {
  analyze(
    source: string,
    options?: IWebComponentsAnalyzerOptions
  ): Promise<IWebComponentAnalysisResult>;
}

export interface AnalysisIssue {
  type: "info" | "warning" | "error";
  message: string;
  severity: "low" | "medium" | "high";
}

export interface ComponentMetadata {
  name: string;
  description: string;
  version: string;
  properties: IProperty[];
  events: IEvent[];
  methods: ILifecycleHook[];
  styling: string[];
  dependencies: string[];
  tags: string[];
  performance: {
    renderTime: number;
    memoryUsage: number;
    eventHandling: number;
  };
  accessibility: {
    keyboardSupport: boolean;
    screenReaderSupport: boolean;
    ariaAttributes: string[];
  };
  security: {
    xssPrevention: boolean;
    eventHandlerSecurity: boolean;
    propertyValidation: boolean;
  };
}
