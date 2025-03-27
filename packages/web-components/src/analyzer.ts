import type {
  IWebComponentsAnalyzer,
  IWebComponentsAnalyzerOptions,
  IWebComponentAnalysisResult,
  IWebComponent,
  ILifecycleHook,
  IShadowDOMUsage,
  IProperty,
  IEvent,
  IPerformanceMetrics,
  AnalysisIssue,
  ComponentMetadata,
} from "./types";

export class WebComponentsAnalyzerImpl implements IWebComponentsAnalyzer {
  async analyze(
    source: string,
    options: IWebComponentsAnalyzerOptions = {}
  ): Promise<IWebComponentAnalysisResult> {
    // Parse the source code to find web components
    const components = this.findWebComponents(source);

    // Calculate totals
    const totalComponents = components.length;
    const totalCustomElements = components.filter((c) => !c.extends).length;
    const totalShadowRoots = components.filter((c) => c.shadowDOM).length;
    let totalSlots = 0;
    let totalEvents = 0;
    let totalProperties = 0;

    components.forEach((component) => {
      const slots = this.findSlots(source);
      const properties = this.findProperties(source);
      const events = this.findEvents(source);

      component.slots = slots;
      component.properties = properties;
      component.events = events;

      totalSlots += slots.length;
      totalEvents += events.length;
      totalProperties += properties.length;
    });

    // Calculate aggregate performance metrics
    const performanceMetrics = this.calculateAggregateMetrics(components);

    const analysisData = {
      components,
      totalComponents,
      totalCustomElements,
      totalShadowRoots,
      totalSlots,
      totalEvents,
      totalProperties,
      performanceMetrics,
    };

    const result: IWebComponentAnalysisResult = {
      success: true,
      data: analysisData,
      type: "web-component",
      name: components[0]?.className || "Unknown",
      complexity: this.calculateComplexity(components),
      dependencies: this.findDependencies(source),
      issues: this.generateIssues(components),
      recommendations: this.generateRecommendations(components),
      metadata: this.generateMetadata(components),
      ...analysisData,
    };

    return result;
  }

  private findWebComponents(source: string): IWebComponent[] {
    const components: IWebComponent[] = [];

    // Find class declarations that use @Shared decorator
    const classRegex =
      /@Shared\s*\(\s*['"]([^'"]+)['"]\s*\)\s*export\s+class\s+(\w+)\s*{([^}]*)}/gs;
    let match;

    console.log("Source code:", source);
    console.log("Regex pattern:", classRegex);

    while ((match = classRegex.exec(source)) !== null) {
      console.log("Found match:", match);
      const [_, tagName, className, classBody] = match;

      const component: IWebComponent = {
        tagName,
        className,
        lifecycleHooks: this.findLifecycleHooks(classBody),
        shadowDOM: this.findShadowDOMUsage(classBody),
        slots: this.findSlots(classBody),
        properties: this.findProperties(classBody),
        events: this.findEvents(classBody),
        metrics: this.calculateComponentMetrics(classBody),
      };

      console.log("Component:", component);
      components.push(component);
    }

    console.log("Found components:", components);
    return components;
  }

  private findLifecycleHooks(classBody: string): ILifecycleHook[] {
    const hooks: ILifecycleHook[] = [];
    const lifecycleMethods = [
      "connectedCallback",
      "disconnectedCallback",
      "adoptedCallback",
      "attributeChangedCallback",
    ];

    for (const method of lifecycleMethods) {
      const methodRegex = new RegExp(`${method}\\s*\\([^)]*\\)\\s*{([^}]*)}`);
      const match = classBody.match(methodRegex);

      if (match) {
        const methodBody = match[1];
        hooks.push({
          name: method,
          used: true,
          hasAsyncLogic:
            methodBody.includes("async") || methodBody.includes("await"),
          dependencies: this.findMethodDependencies(methodBody),
          callbackCount: this.countCallbacks(methodBody),
        });
      }
    }

    return hooks;
  }

  private findShadowDOMUsage(classBody: string): IShadowDOMUsage | undefined {
    // Ignite-element components use shadow DOM by default
    return {
      mode: "open",
      delegatesFocus: false,
      adoptedStyleSheets: classBody.includes("setGlobalStyles"),
    };
  }

  private findSlots(source: string): string[] {
    const slots = new Set<string>();

    // Find custom elements in template literals
    const templateRegex = /html`([^`]*)`/g;
    let match;
    while ((match = templateRegex.exec(source)) !== null) {
      const template = match[1];
      const elementRegex = /<([a-z]+-[a-z-]+)[^>]*>/g;
      let elementMatch;
      while ((elementMatch = elementRegex.exec(template)) !== null) {
        slots.add(elementMatch[1]);
      }
    }

    return Array.from(slots);
  }

  private findProperties(source: string): IProperty[] {
    const properties = new Set<string>();

    // Find state properties
    const stateRegex = /state(?:\.context)?\.(\w+)/g;
    let match;
    while ((match = stateRegex.exec(source)) !== null) {
      properties.add(match[1]);
    }

    // Find form input properties
    const formRegex = /name="(\w+)"/g;
    while ((match = formRegex.exec(source)) !== null) {
      properties.add(match[1]);
    }

    // Find lit-html property bindings
    const bindingRegex = /\.(\w+)=\$\{/g;
    while ((match = bindingRegex.exec(source)) !== null) {
      properties.add(match[1]);
    }

    return Array.from(properties).map((name) => ({
      name,
      type: "property",
      reflect: false,
      observed: false,
      hasGetter: source.includes(`get ${name}`),
      hasSetter: source.includes(`set ${name}`),
    }));
  }

  private findEvents(source: string): IEvent[] {
    const events = new Set<string>();

    // Find lit-html event bindings
    const eventRegex = /@(\w+)=\$\{/g;
    let match;
    while ((match = eventRegex.exec(source)) !== null) {
      events.add(match[1]);
    }

    // Find XState send events
    const sendRegex = /send\(\s*{\s*type:\s*["'](\w+)["']/g;
    while ((match = sendRegex.exec(source)) !== null) {
      events.add(match[1]);
    }

    return Array.from(events).map((name) => ({
      name,
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: undefined,
      listeners: this.countEventListeners(source, name),
    }));
  }

  private calculateComponentMetrics(classBody: string): IPerformanceMetrics {
    return {
      constructorTime: this.measureConstructorTime(classBody),
      renderTime: this.measureRenderTime(classBody),
      updateTime: this.measureUpdateTime(classBody),
      memoryUsage: this.estimateMemoryUsage(classBody),
    };
  }

  private calculateAggregateMetrics(
    components: IWebComponent[]
  ): IPerformanceMetrics {
    return {
      constructorTime: components.reduce(
        (sum, c) => sum + c.metrics.constructorTime,
        0
      ),
      renderTime: components.reduce((sum, c) => sum + c.metrics.renderTime, 0),
      updateTime: components.reduce((sum, c) => sum + c.metrics.updateTime, 0),
      memoryUsage: components.reduce(
        (sum, c) => sum + c.metrics.memoryUsage,
        0
      ),
    };
  }

  private calculateComplexity(
    components: IWebComponent[]
  ): "low" | "medium" | "high" {
    const totalMethods = components.reduce(
      (sum, c) => sum + c.lifecycleHooks.length,
      0
    );
    const totalProperties = components.reduce(
      (sum, c) => sum + c.properties.length,
      0
    );
    const totalEvents = components.reduce((sum, c) => sum + c.events.length, 0);

    if (totalMethods + totalProperties + totalEvents < 10) return "low";
    if (totalMethods + totalProperties + totalEvents < 30) return "medium";
    return "high";
  }

  private findDependencies(sourceCode: string): string[] {
    const dependencies: string[] = [];
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(sourceCode)) !== null) {
      dependencies.push(match[1]);
    }

    return [...new Set(dependencies)];
  }

  private generateIssues(components: IWebComponent[]): AnalysisIssue[] {
    const issues: AnalysisIssue[] = [];

    components.forEach((component) => {
      if (!component.shadowDOM) {
        issues.push({
          type: "warning",
          message: `Component ${component.className} does not use Shadow DOM`,
          severity: "medium",
        });
      }

      if (component.events.length === 0) {
        issues.push({
          type: "info",
          message: `Component ${component.className} has no event handlers`,
          severity: "low",
        });
      }
    });

    return issues;
  }

  private generateRecommendations(components: IWebComponent[]): string[] {
    const recommendations: string[] = [];

    components.forEach((component) => {
      if (!component.shadowDOM) {
        recommendations.push(
          `Consider using Shadow DOM in ${component.className} for better encapsulation`
        );
      }

      if (component.events.length === 0) {
        recommendations.push(
          `Add event handlers to ${component.className} for better interactivity`
        );
      }
    });

    return recommendations;
  }

  private generateMetadata(components: IWebComponent[]): ComponentMetadata {
    return {
      name: components[0]?.className || "Unknown",
      description: "Web Component Analysis Results",
      version: "1.0.0",
      properties: components.flatMap((c) => c.properties),
      events: components.flatMap((c) => c.events),
      methods: components.flatMap((c) => c.lifecycleHooks),
      styling: [],
      dependencies: this.findDependencies(
        components.map((c) => c.className).join("\n")
      ),
      tags: ["web-components", "lit-html"],
      performance: {
        renderTime: 0,
        memoryUsage: 0,
        eventHandling: 0,
      },
      accessibility: {
        keyboardSupport: false,
        screenReaderSupport: false,
        ariaAttributes: [],
      },
      security: {
        xssPrevention: false,
        eventHandlerSecurity: false,
        propertyValidation: false,
      },
    };
  }

  // Helper methods
  private convertToKebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }

  private findMethodDependencies(methodBody: string): string[] {
    const dependencies: string[] = [];
    const thisRegex = /this\.(\w+)/g;
    let match;

    while ((match = thisRegex.exec(methodBody)) !== null) {
      dependencies.push(match[1]);
    }

    return [...new Set(dependencies)];
  }

  private countCallbacks(methodBody: string): number {
    return (methodBody.match(/callback\s*\(/g) || []).length;
  }

  private extractPropertyType(config: string): string {
    const typeMatch = config.match(/type:\s*(\w+)/);
    return typeMatch ? typeMatch[1] : "unknown";
  }

  private extractDefaultValue(config: string): unknown {
    const valueMatch = config.match(/value:\s*([^,}]+)/);
    return valueMatch ? valueMatch[1] : undefined;
  }

  private extractAttribute(config: string): string | undefined {
    const attrMatch = config.match(/attribute:\s*['"]([^'"]+)['"]/);
    return attrMatch ? attrMatch[1] : undefined;
  }

  private countEventListeners(classBody: string, eventName: string): number {
    return (
      classBody.match(
        new RegExp(`addEventListener\\(['"]${eventName}['"]`, "g")
      ) || []
    ).length;
  }

  private measureConstructorTime(classBody: string): number {
    // Simple estimation based on complexity
    return classBody.split("\n").length * 0.1;
  }

  private measureRenderTime(classBody: string): number {
    // Look for lit-html template complexity
    const templateRegex = /html`([^`]+)`/g;
    let totalComplexity = 0;
    let match;

    while ((match = templateRegex.exec(classBody)) !== null) {
      const template = match[1];
      // Count expressions and elements
      const expressionCount = (template.match(/\${[^}]+}/g) || []).length;
      const elementCount = (template.match(/<[^>]+>/g) || []).length;
      totalComplexity += expressionCount * 0.1 + elementCount * 0.05;
    }

    return totalComplexity;
  }

  private measureUpdateTime(classBody: string): number {
    // Simple estimation based on update logic
    return (classBody.match(/update\s*\(/g) || []).length * 0.2;
  }

  private estimateMemoryUsage(classBody: string): number {
    // Simple estimation based on component complexity
    return classBody.split("\n").length * 0.5;
  }
}

export const createWebComponentsAnalyzer = (): IWebComponentsAnalyzer => {
  return new WebComponentsAnalyzerImpl();
};
