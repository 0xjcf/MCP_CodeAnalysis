/**
 * Core component types for the MCP platform
 */

export type ComplexityLevel = 'low' | 'medium' | 'high';

export interface IPropertyValidation {
  type: string;
  required: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  rules?: IValidationRule[];
}

export interface IValidationRule {
  type: string;
  message: string;
  value?: unknown;
  validate?: (value: unknown) => boolean;
}

export interface IComponentEvent {
  name: string;
  type: string;
  detail?: unknown;
  bubbles: boolean;
  composed: boolean;
  description?: string;
}

export interface IParameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: unknown;
}

export interface IComponentProperty {
  name: string;
  type: string;
  defaultValue?: unknown;
  description?: string;
  validation?: IPropertyValidation;
}

export interface IComponentMetadata {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  properties: IPropertyMetadata[];
  events: IEventMetadata[];
  methods: IMethodMetadata[];
  styling: IStyleMetadata[];
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

export interface IPropertyMetadata {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  default?: unknown;
  reflect?: boolean;
  attribute?: string;
  readonly?: boolean;
}

export interface IEventMetadata {
  name: string;
  description?: string;
  detail?: unknown;
  bubbles?: boolean;
  composed?: boolean;
}

export interface IMethodMetadata {
  name: string;
  description?: string;
  parameters: IParameterMetadata[];
  returnType?: string;
  async?: boolean;
}

export interface IParameterMetadata {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  default?: unknown;
}

export interface IStyleMetadata {
  name: string;
  description?: string;
  type: 'css' | 'scss' | 'less';
  content: string;
}

export interface IComponentAnalysis {
  metadata: IComponentMetadata;
  issues: IAnalysisIssue[];
  recommendations: string[];
  complexity: 'low' | 'medium' | 'high';
}

export interface IAnalysisResult {
  type: 'web-component';
  name: string;
  complexity: ComplexityLevel;
  dependencies: string[];
  issues: IAnalysisIssue[];
  recommendations: string[];
  metadata: IComponentMetadata;
}

export interface IAnalysisIssue {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  location?: {
    file: string;
    line: number;
    column: number;
  };
}

export interface IComponentNode {
  id: string;
  name: string;
  type: string;
  properties: IComponentProperty[];
  events: IComponentEvent[];
  methods: IMethodMetadata[];
  relationships: IComponentRelationship[];
  metadata: IComponentMetadata;
}

export interface IComponentRelationship {
  type: string;
  source: string;
  target: string;
  description: string;
}
