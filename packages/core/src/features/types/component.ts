/**
 * Component-related type definitions for the MCP platform
 */

export interface IComponentNode {
  id: string;
  name: string;
  type: 'web-component' | 'custom-element' | 'shadow-root';
  properties: IComponentProperty[];
  events: IComponentEvent[];
  methods: IComponentMethod[];
  relationships: IComponentRelationship[];
  metadata: IComponentMetadata;
}

export interface IComponentProperty {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
  validation?: IPropertyValidation;
}

export interface IComponentEvent {
  name: string;
  type: string;
  bubbles: boolean;
  composed: boolean;
  description?: string;
}

export interface IComponentMethod {
  name: string;
  parameters: IParameter[];
  returnType: string;
  description?: string;
  isPrivate: boolean;
}

export interface IComponentRelationship {
  type: 'parent-child' | 'composition' | 'dependency' | 'event';
  source: string;
  target: string;
  description?: string;
}

export interface IComponentMetadata {
  version: string;
  author?: string;
  lastModified: Date;
  tags: string[];
  complexity: 'low' | 'medium' | 'high';
  performance: {
    renderTime?: number;
    memoryUsage?: number;
    eventHandling?: number;
  };
  accessibility: {
    ariaAttributes: string[];
    keyboardSupport: boolean;
    screenReaderSupport: boolean;
  };
  security: {
    xssPrevention: boolean;
    eventHandlerSecurity: boolean;
    propertyValidation: boolean;
  };
}

export interface IPropertyValidation {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'custom';
  rules?: IValidationRule[];
  customValidator?: string;
}

export interface IValidationRule {
  type: string;
  value?: any;
  message?: string;
}

export interface IParameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
}
