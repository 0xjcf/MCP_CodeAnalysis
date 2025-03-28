import type {
  WebComponentsAnalyzer,
  WebComponentsAnalyzerOptions,
  WebComponentAnalysisResult,
  WebComponent,
  LifecycleHook,
  ShadowDOMUsage,
  Property,
  Event,
  PerformanceMetrics,
  AccessibilityMetrics,
} from './types';
import * as ts from 'typescript';

export class WebComponentsAnalyzerImpl implements WebComponentsAnalyzer {
  private sourceFile: ts.SourceFile | null = null;

  async analyze(sourceCode: string): Promise<WebComponentAnalysisResult> {
    try {
      // Parse the source code
      this.sourceFile = ts.createSourceFile('temp.ts', sourceCode, ts.ScriptTarget.Latest, true);

      const components: WebComponent[] = [];
      const lifecycleHooks: LifecycleHook[] = [];
      const shadowDOMUsage: ShadowDOMUsage[] = [];
      const properties: Property[] = [];
      const events: Event[] = [];
      const performance: PerformanceMetrics = {
        renderTime: 0,
        memoryUsage: 0,
        reflowCount: 0,
        repaintCount: 0,
        optimizationSuggestions: [],
      };

      // Analyze the AST
      this.analyzeAST(this.sourceFile, {
        components,
        lifecycleHooks,
        shadowDOMUsage,
        properties,
        events,
        performance,
      });

      return {
        success: true,
        components,
        totalComponents: components.length,
        totalCustomElements: components.filter(c => c.isCustomElement).length,
        totalShadowRoots: components.filter(c => c.usesShadowDOM).length,
        totalSlots: components.reduce((acc, c) => acc + (c.slots?.length || 0), 0),
        totalEvents: events.length,
        totalProperties: properties.length,
        performanceMetrics: {
          constructorTime: performance.renderTime,
          renderTime: performance.renderTime,
          updateTime: performance.renderTime,
          memoryUsage: performance.memoryUsage,
        },
        data: {
          components,
          lifecycleHooks,
          shadowDOMUsage,
          properties,
          events,
          performance,
        },
        errors: [],
        warnings: [],
      };
    } catch (error) {
      return {
        success: false,
        components: [],
        totalComponents: 0,
        totalCustomElements: 0,
        totalShadowRoots: 0,
        totalSlots: 0,
        totalEvents: 0,
        totalProperties: 0,
        performanceMetrics: {
          constructorTime: 0,
          renderTime: 0,
          updateTime: 0,
          memoryUsage: 0,
        },
        data: {
          components: [],
          lifecycleHooks: [],
          shadowDOMUsage: [],
          properties: [],
          events: [],
          performance: {
            renderTime: 0,
            memoryUsage: 0,
            reflowCount: 0,
            repaintCount: 0,
            optimizationSuggestions: [],
          },
        },
        errors: [error instanceof Error ? error : new Error(String(error))],
        warnings: [],
      };
    }
  }

  private analyzeAST(
    node: ts.Node,
    result: {
      components: WebComponent[];
      lifecycleHooks: LifecycleHook[];
      shadowDOMUsage: ShadowDOMUsage[];
      properties: Property[];
      events: Event[];
      performance: PerformanceMetrics;
    },
  ) {
    // Analyze class declarations
    if (ts.isClassDeclaration(node)) {
      this.analyzeClass(node, result);
    }

    // Analyze performance patterns
    this.analyzePerformancePatterns(node, result);

    // Recursively analyze child nodes
    node.forEachChild(child => this.analyzeAST(child, result));
  }

  private analyzePerformancePatterns(
    node: ts.Node,
    result: {
      components: WebComponent[];
      lifecycleHooks: LifecycleHook[];
      shadowDOMUsage: ShadowDOMUsage[];
      properties: Property[];
      events: Event[];
      performance: PerformanceMetrics;
    },
  ) {
    const sourceText = node.getText();

    // Check for expensive DOM operations
    if (sourceText.includes('querySelector') || sourceText.includes('getElementsBy')) {
      result.performance.optimizationSuggestions.push({
        type: 'render',
        description: 'Using expensive DOM query operations',
        impact: 'high',
        location: this.getLocation(node),
        code: sourceText,
        suggestion: 'Consider using more efficient selectors or caching DOM queries',
      });
    }

    // Check for forced reflows
    if (
      sourceText.includes('offsetHeight') ||
      sourceText.includes('offsetWidth') ||
      sourceText.includes('getBoundingClientRect')
    ) {
      result.performance.reflowCount++;
      result.performance.optimizationSuggestions.push({
        type: 'reflow',
        description: 'Forcing layout recalculation',
        impact: 'high',
        location: this.getLocation(node),
        code: sourceText,
        suggestion: 'Batch DOM reads and writes to minimize reflows',
      });
    }

    // Check for memory leaks
    if (sourceText.includes('addEventListener') && !sourceText.includes('removeEventListener')) {
      result.performance.optimizationSuggestions.push({
        type: 'memory',
        description: 'Potential memory leak from unremoved event listeners',
        impact: 'high',
        location: this.getLocation(node),
        code: sourceText,
        suggestion: 'Ensure event listeners are removed in disconnectedCallback',
      });
    }

    // Check for expensive render operations
    if (sourceText.includes('innerHTML') || sourceText.includes('outerHTML')) {
      result.performance.optimizationSuggestions.push({
        type: 'render',
        description: 'Using innerHTML/outerHTML which can be unsafe and expensive',
        impact: 'medium',
        location: this.getLocation(node),
        code: sourceText,
        suggestion: 'Use textContent or DOM manipulation methods instead',
      });
    }

    // Check for Shadow DOM performance
    if (sourceText.includes('attachShadow')) {
      result.performance.optimizationSuggestions.push({
        type: 'shadow-dom',
        description: 'Using Shadow DOM which can impact performance',
        impact: 'medium',
        location: this.getLocation(node),
        code: sourceText,
        suggestion: 'Consider using light DOM for simple components',
      });
    }

    // Check for event delegation opportunities
    if (sourceText.includes('addEventListener') && sourceText.includes('target')) {
      result.performance.optimizationSuggestions.push({
        type: 'event',
        description: 'Potential event delegation opportunity',
        impact: 'low',
        location: this.getLocation(node),
        code: sourceText,
        suggestion: 'Consider using event delegation for better performance',
      });
    }
  }

  private analyzeClass(
    node: ts.ClassDeclaration,
    result: {
      components: WebComponent[];
      lifecycleHooks: LifecycleHook[];
      shadowDOMUsage: ShadowDOMUsage[];
      properties: Property[];
      events: Event[];
      performance: PerformanceMetrics;
    },
  ) {
    // Check if this is a Web Component
    const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) : undefined;
    if (!decorators) return;

    const sharedDecorator = decorators.find(decorator => {
      const decoratorName = (decorator.expression as ts.CallExpression).expression as ts.Identifier;
      return decoratorName.text === 'Shared';
    });

    if (!sharedDecorator) return;

    // Extract component name and tag name
    const componentName = node.name?.text || 'Anonymous';
    const tagName = (sharedDecorator.expression as ts.CallExpression).arguments[0]
      .getText()
      .replace(/['"]/g, '');

    // Analyze class members
    const lifecycleHooks: string[] = [];
    const componentProperties: Property[] = [];
    const componentEvents: Event[] = [];
    let usesShadowDOM = false;
    let slots: string[] = [];

    node.members.forEach(member => {
      if (ts.isMethodDeclaration(member)) {
        // Check for lifecycle hooks
        if (this.isLifecycleHook(member.name.getText())) {
          lifecycleHooks.push(member.name.getText());
          result.lifecycleHooks.push({
            name: member.name.getText(),
            component: componentName,
            location: this.getLocation(member),
          });
        }

        // Check for render method and Shadow DOM usage
        if (member.name.getText() === 'render') {
          const renderMethod = member as ts.MethodDeclaration;
          const shadowDOMUsage = this.analyzeShadowDOMUsage(renderMethod);
          if (shadowDOMUsage) {
            usesShadowDOM = true;
            slots = shadowDOMUsage.slots || [];
          }
        }

        // Analyze event handlers
        const eventHandler = this.analyzeEventHandler(member, componentName);
        if (eventHandler) {
          componentEvents.push(eventHandler);
          result.events.push(eventHandler);
        }
      } else if (ts.isPropertyDeclaration(member)) {
        // Analyze properties
        const property = this.analyzeProperty(member, componentName);
        if (property) {
          componentProperties.push(property);
          result.properties.push(property);
        }

        // Check for event property
        const eventProperty = this.analyzeEventProperty(member, componentName);
        if (eventProperty) {
          componentEvents.push(eventProperty);
          result.events.push(eventProperty);
        }
      }
    });

    // Analyze custom event declarations
    const customEvents = this.analyzeCustomEvents(node, componentName);
    componentEvents.push(...customEvents);
    result.events.push(...customEvents);

    // Create the component object
    const component: WebComponent = {
      name: componentName,
      tagName,
      lifecycleHooks,
      properties: componentProperties,
      events: componentEvents,
      shadowDOM: usesShadowDOM,
      slots,
      isCustomElement: true,
      usesShadowDOM,
      location: this.getLocation(node),
      accessibility: {
        hasAriaAttributes: false,
        hasKeyboardSupport: false,
        hasSemanticHTML: false,
        hasTextAlternatives: false,
        issues: [],
      },
    };

    result.components.push(component);

    // Analyze class for performance patterns
    const classText = node.getText();

    // Check for large render methods
    const renderMethod = node.members.find(
      member => ts.isMethodDeclaration(member) && member.name.getText() === 'render',
    );
    if (renderMethod) {
      const methodText = renderMethod.getText();
      if (methodText.length > 500) {
        result.performance.optimizationSuggestions.push({
          type: 'render',
          description: 'Large render method detected',
          impact: 'medium',
          location: this.getLocation(renderMethod),
          code: methodText,
          suggestion: 'Consider breaking down the render method into smaller components',
        });
      }
    }

    // Check for expensive property observers
    const observedAttributes = node.members.find(
      member => ts.isPropertyDeclaration(member) && member.name.getText() === 'observedAttributes',
    );
    if (observedAttributes) {
      result.performance.optimizationSuggestions.push({
        type: 'render',
        description: 'Using attribute observers which can impact performance',
        impact: 'medium',
        location: this.getLocation(observedAttributes),
        code: observedAttributes.getText(),
        suggestion: 'Consider using property setters instead of attribute observers',
      });
    }
  }

  private isLifecycleHook(methodName: string): boolean {
    const lifecycleHooks = [
      'connectedCallback',
      'disconnectedCallback',
      'adoptedCallback',
      'attributeChangedCallback',
    ];
    return lifecycleHooks.includes(methodName);
  }

  private analyzeShadowDOMUsage(node: ts.Node): { slots: string[] } | null {
    const slots: string[] = [];
    let hasShadowDOM = false;

    // Visit each node to find shadow DOM usage
    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const callText = node.expression.getText();
        if (callText === 'attachShadow') {
          hasShadowDOM = true;
        }
      }

      // Check for slot elements in template literals
      if (ts.isTemplateExpression(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const text = node.getText();
        const slotMatches = text.match(/<slot.*?>/g);
        if (slotMatches) {
          slotMatches.forEach(match => {
            const nameMatch = match.match(/name=["'](.*?)["']/);
            slots.push(nameMatch ? nameMatch[1] : 'default');
          });
        }
      }

      node.forEachChild(visit);
    };

    visit(node);

    return hasShadowDOM ? { slots } : null;
  }

  private analyzeProperty(node: ts.PropertyDeclaration, componentName: string): Property | null {
    if (!node.name || !ts.isIdentifier(node.name)) return null;

    return {
      name: node.name.text,
      type: node.type ? node.type.getText() : 'any',
      required: !node.questionToken,
      component: componentName,
      location: this.getLocation(node),
    };
  }

  private analyzeEventHandler(node: ts.MethodDeclaration, componentName: string): Event | null {
    const methodName = node.name.getText();
    if (!methodName.startsWith('handle') && !methodName.startsWith('on')) {
      return null;
    }

    const eventName = methodName
      .replace(/^handle/, '')
      .replace(/^on/, '')
      .toLowerCase();

    return {
      name: eventName,
      component: componentName,
      type: 'standard',
      isBubbling: true,
      isComposed: true,
      hasListener: true,
      location: this.getLocation(node),
    };
  }

  private analyzeEventProperty(node: ts.PropertyDeclaration, componentName: string): Event | null {
    if (!node.name || !ts.isIdentifier(node.name)) return null;

    const propertyName = node.name.text;
    if (!propertyName.startsWith('on')) return null;

    const eventName = propertyName.replace(/^on/, '').toLowerCase();

    return {
      name: eventName,
      component: componentName,
      type: 'standard',
      isBubbling: true,
      isComposed: true,
      hasListener: true,
      location: this.getLocation(node),
    };
  }

  private analyzeCustomEvents(node: ts.ClassDeclaration, componentName: string): Event[] {
    const events: Event[] = [];
    const sourceText = node.getText();

    // Look for CustomEvent declarations
    const customEventRegex = /new\s+CustomEvent\(['"]([^'"]+)['"]/g;
    let match;
    while ((match = customEventRegex.exec(sourceText)) !== null) {
      const eventName = match[1];
      const eventLocation = this.getLocation(node);
      eventLocation.column =
        (match.index % sourceText.split('\n')[eventLocation.line - 1].length) + 1;

      events.push({
        name: eventName,
        component: componentName,
        type: 'custom',
        isBubbling: sourceText.includes('bubbles: true'),
        isComposed: sourceText.includes('composed: true'),
        hasListener: sourceText.includes(`addEventListener('${eventName}'`),
        location: eventLocation,
      });
    }

    return events;
  }

  private getLocation(node: ts.Node) {
    const sourceFile = node.getSourceFile();
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
    return {
      file: sourceFile.fileName,
      line: line + 1,
      column: character + 1,
    };
  }
}

export const createWebComponentsAnalyzer = (): WebComponentsAnalyzer => {
  return new WebComponentsAnalyzerImpl();
};
