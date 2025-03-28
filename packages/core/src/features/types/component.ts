/**
 * Component-related type definitions for the MCP platform
 */

export interface ComponentNode {
  id: string;
  name: string;
  type: "web-component" | "custom-element" | "shadow-root";
  properties: ComponentProperty[];
  events: ComponentEvent[];
  methods: ComponentMethod[];
  relationships: ComponentRelationship[];
  metadata: ComponentMetadata;
}

export interface ComponentProperty {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
  validation?: PropertyValidation;
}

export interface ComponentEvent {
  name: string;
  type: string;
  bubbles: boolean;
  composed: boolean;
  description?: string;
}

export interface ComponentMethod {
  name: string;
  parameters: Parameter[];
  returnType: string;
  description?: string;
  isPrivate: boolean;
}

export interface ComponentRelationship {
  type: "parent-child" | "composition" | "dependency" | "event";
  source: string;
  target: string;
  description?: string;
}

export interface ComponentMetadata {
  version: string;
  author?: string;
  lastModified: Date;
  tags: string[];
  complexity: "low" | "medium" | "high";
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

export interface PropertyValidation {
  type: "string" | "number" | "boolean" | "array" | "object" | "custom";
  rules?: ValidationRule[];
  customValidator?: string;
}

export interface ValidationRule {
  type: string;
  value?: any;
  message?: string;
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
}
