/**
 * Core component types for the MCP platform
 */

export type ComplexityLevel = "low" | "medium" | "high";

export interface PropertyValidation {
  type: string;
  required: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  rules?: ValidationRule[];
}

export interface ValidationRule {
  type: string;
  message: string;
  value?: any;
  validate?: (value: any) => boolean;
}

export interface ComponentEvent {
  name: string;
  type: string;
  detail?: any;
  bubbles: boolean;
  composed: boolean;
  description?: string;
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
}

export interface ComponentProperty {
  name: string;
  type: string;
  defaultValue?: any;
  description?: string;
  validation?: PropertyValidation;
}

export interface ComponentMetadata {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  properties: PropertyMetadata[];
  events: EventMetadata[];
  methods: MethodMetadata[];
  styling: StyleMetadata[];
  dependencies: string[];
  tags: string[];
  performance?: {
    renderTime?: number;
    memoryUsage?: number;
    eventHandling?: number;
  };
  accessibility?: {
    keyboardSupport: boolean;
    screenReaderSupport: boolean;
    ariaAttributes: string[];
  };
  security?: {
    xssPrevention: boolean;
    eventHandlerSecurity: boolean;
    propertyValidation: boolean;
  };
}

export interface PropertyMetadata {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  default?: any;
  reflect?: boolean;
  attribute?: string;
  readonly?: boolean;
}

export interface EventMetadata {
  name: string;
  description?: string;
  detail?: any;
  bubbles?: boolean;
  composed?: boolean;
}

export interface MethodMetadata {
  name: string;
  description?: string;
  parameters: ParameterMetadata[];
  returnType?: string;
  async?: boolean;
}

export interface ParameterMetadata {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  default?: any;
}

export interface StyleMetadata {
  name: string;
  description?: string;
  type: "css" | "scss" | "less";
  content: string;
}

export interface ComponentAnalysis {
  metadata: ComponentMetadata;
  issues: AnalysisIssue[];
  recommendations: string[];
  complexity: "low" | "medium" | "high";
}

export interface AnalysisResult {
  type: "web-component";
  name: string;
  complexity: ComplexityLevel;
  dependencies: string[];
  issues: AnalysisIssue[];
  recommendations: string[];
  metadata: ComponentMetadata;
}

export interface AnalysisIssue {
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
  location?: {
    file: string;
    line: number;
    column: number;
  };
}

export interface ComponentNode {
  id: string;
  name: string;
  type: string;
  properties: ComponentProperty[];
  events: ComponentEvent[];
  methods: any[];
  relationships: ComponentRelationship[];
  metadata: ComponentMetadata;
}

export interface ComponentRelationship {
  type: string;
  source: string;
  target: string;
  description: string;
}
