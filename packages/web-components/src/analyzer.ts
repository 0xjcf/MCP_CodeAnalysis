import * as ts from 'typescript';
import type {
  WebComponentEvent,
  Property,
  AccessibilityInfo,
  AccessibilityIssue,
  WebComponentAnalysisResult,
  PerformanceIssue,
  BasePerformanceInfo,
} from './types';
import { PerformanceAnalyzer } from './analyzer/performance';

export class WebComponentsAnalyzerImpl {
  private sourceFile!: ts.SourceFile;
  private performanceAnalyzer: PerformanceAnalyzer | null = null;

  constructor() {
    // PerformanceAnalyzer will be initialized when sourceFile is set
  }

  private readonly defaultPerformanceInfo: BasePerformanceInfo = {
    hasPerformanceIssues: false,
    issues: [],
    hasLargeBundleSize: false,
    hasSlowRendering: false,
    hasMemoryLeaks: false,
    hasNetworkIssues: false,
    hasResourceLoadingIssues: false,
    hasAnimationPerformanceIssues: false,
    hasLayoutThrashing: false,
    hasEventHandlingIssues: false,
    hasDOMManipulationIssues: false,
    constructorTime: 0,
    renderTime: 0,
    updateTime: 0,
    memoryUsage: 0,
    reflowCount: 0,
    repaintCount: 0,
    optimizationSuggestions: [],
  };

  private readonly defaultAccessibilityInfo: AccessibilityInfo = {
    hasAccessibilityIssues: false,
    issues: [],
    hasRoles: false,
    hasLabels: false,
    hasFocusableElements: false,
    hasAriaAttributes: false,
    hasKeyboardSupport: false,
    hasSemanticHTML: false,
    hasTextAlternatives: false,
    hasFocusManagement: false,
    hasColorContrast: false,
    hasDynamicContent: false,
    hasFormElements: false,
    hasInteractiveElements: false,
    hasHeadings: false,
    hasLists: false,
    hasTables: false,
    hasIframes: false,
    hasMedia: false,
  };

  async analyze(sourceCode: string): Promise<WebComponentAnalysisResult> {
    const emptyResult: WebComponentAnalysisResult = {
      type: 'web-component' as const,
      name: 'AnonymousComponent',
      complexity: 'medium',
      dependencies: [],
      issues: [],
      recommendations: [],
      metadata: {
        name: 'AnonymousComponent',
        description: '',
        version: '1.0.0',
        properties: [],
        events: [],
        methods: [],
        styling: {
          hasCSS: false,
          hasScopedCSS: false,
          hasCSSVariables: false,
          hasMediaQueries: false,
          hasAnimations: false,
          hasTransitions: false,
          hasFlexbox: false,
          hasGrid: false,
          hasCustomProperties: false,
          hasShadowDOM: false,
        },
        accessibility: this.defaultAccessibilityInfo,
        performance: this.defaultPerformanceInfo,
      },
      tagName: '',
      attributes: [],
      properties: [],
      methods: [],
      events: [],
      slots: [],
      shadowRoot: false,
      template: null,
      styles: [],
      accessibility: this.defaultAccessibilityInfo,
      performance: this.defaultPerformanceInfo,
      success: true,
      data: {
        components: [],
        lifecycleHooks: [],
        shadowDOMUsage: [],
        properties: [],
        events: [],
        accessibility: this.defaultAccessibilityInfo,
        performance: this.defaultPerformanceInfo,
      },
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
    };

    if (!sourceCode.trim()) {
      return emptyResult;
    }

    try {
      const sourceFileName = 'temp.ts';
      this.sourceFile = ts.createSourceFile(
        sourceFileName,
        sourceCode,
        ts.ScriptTarget.Latest,
        true,
      );

      // MEMORY_ANCHOR: create_program_and_check_diagnostics
      // Create a simple program to check for diagnostics
      const compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.Latest,
        module: ts.ModuleKind.ESNext,
        // allowJs: true, // Removed for now, as input is TS
        noEmit: true, // Don't actually emit JS files
        skipLibCheck: true, // Might help ignore issues in lib files if program pulls them in
        jsx: ts.JsxEmit.React, // Add basic JSX support in case test snippets use it implicitly
      };

      const compilerHost = ts.createCompilerHost(compilerOptions);
      const originalGetSourceFile = compilerHost.getSourceFile;
      compilerHost.getSourceFile = (
        fileName,
        languageVersion,
        onError,
        shouldCreateNewSourceFile,
      ) => {
        if (fileName === sourceFileName) {
          return this.sourceFile;
        }
        // Delegate to the original host for other files (like lib.d.ts)
        return originalGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
      };

      const program = ts.createProgram([sourceFileName], compilerOptions, compilerHost);
      // Get *syntactic* diagnostics first - these are true parsing errors
      const syntacticDiagnostics = program.getSyntacticDiagnostics(this.sourceFile);
      // Then get semantic diagnostics - these relate to type checking, etc.
      const semanticDiagnostics = program.getSemanticDiagnostics(this.sourceFile);
      // Combine them
      const allDiagnostics = [...syntacticDiagnostics, ...semanticDiagnostics];

      const errorDiagnostics = allDiagnostics.filter(
        diag => diag.category === ts.DiagnosticCategory.Error,
      );

      if (errorDiagnostics.length > 0) {
        const errorMessages = errorDiagnostics
          .map(diag => {
            const message = ts.flattenDiagnosticMessageText(diag.messageText, '\\n');
            if (diag.file && diag.start !== undefined) {
              const { line, character } = ts.getLineAndCharacterOfPosition(diag.file, diag.start);
              // Use sourceFileName instead of diag.file.fileName for consistent error reporting
              return `Error at ${sourceFileName} (${line + 1},${character + 1}): ${message}`;
            } else {
              return `Error: ${message}`;
            }
          })
          .join('\\n');

        return {
          ...emptyResult,
          success: false,
          error: `TypeScript parsing errors:\\n${errorMessages}`,
          // Keep performanceMetrics at default 0 for errors
          performanceMetrics: {
            constructorTime: 0,
            renderTime: 0,
            updateTime: 0,
            memoryUsage: 0,
          },
        };
      }

      // Initialize performance analyzer only if parsing succeeds
      this.performanceAnalyzer = new PerformanceAnalyzer(this.sourceFile);

      const classDeclarations = this.findClassDeclarations(this.sourceFile);

      if (classDeclarations.length === 0) {
        return emptyResult;
      }

      const components = classDeclarations.map(node => {
        const name =
          ts.isClassDeclaration(node) && node.name ? node.name.text : 'AnonymousComponent';
        return {
          name,
          tagName: this.extractTagName(node),
          extends: this.findExtends(node),
          isCustomElement: this.isCustomElement(node),
          usesShadowDOM: this.usesShadowDOM(node),
          lifecycleHooks: this.findLifecycleHooks(node),
          properties: this.findProperties(node),
          events: this.findEvents(node),
          accessibility: this.analyzeAccessibility([node]),
          performance: this.findPerformanceMetrics(node),
        };
      });

      const lifecycleHooks = classDeclarations.flatMap(node => this.findLifecycleHooks(node));
      const shadowDOMUsage = classDeclarations.flatMap(node => this.findShadowDOMUsage(node));
      const properties = classDeclarations.flatMap(node => this.findProperties(node));
      const events = classDeclarations.flatMap(node => this.findEvents(node));
      const accessibility = this.analyzeAccessibility(classDeclarations);
      const performance = this.findPerformanceMetrics(this.sourceFile);

      return {
        ...emptyResult,
        name: components[0]?.name || 'AnonymousComponent',
        tagName: components[0]?.tagName || '',
        attributes: components[0]?.properties.map(p => p.name) || [],
        properties: components[0]?.properties.map(p => p.name) || [],
        methods: components[0]?.properties.filter(p => p.type === 'method').map(p => p.name) || [],
        events: components[0]?.events.map(e => e.name) || [],
        slots: components[0]?.properties.filter(p => p.type === 'slot').map(p => p.name) || [],
        shadowRoot: components[0]?.usesShadowDOM || false,
        template: null,
        styles: [],
        accessibility,
        performance,
        data: {
          components,
          lifecycleHooks,
          shadowDOMUsage,
          properties,
          events,
          accessibility,
          performance,
        },
        totalComponents: components.length,
        totalCustomElements: components.filter(c => c.isCustomElement).length,
        totalShadowRoots: shadowDOMUsage.length,
        totalSlots: classDeclarations.reduce((sum, node) => sum + this.findSlots(node).length, 0),
        totalEvents: events.length,
        totalProperties: properties.length,
        performanceMetrics: {
          constructorTime: performance.constructorTime,
          renderTime: performance.renderTime,
          updateTime: performance.updateTime,
          memoryUsage: performance.memoryUsage,
        },
      };
    } catch (error) {
      // Catch any unexpected runtime errors during analysis
      return {
        ...emptyResult,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during analysis',
        performanceMetrics: {
          // Ensure performanceMetrics is reset on general errors too
          constructorTime: 0,
          renderTime: 0,
          updateTime: 0,
          memoryUsage: 0,
        },
      };
    }
  }

  private findClassDeclarations(sourceFile: ts.SourceFile): ts.ClassDeclaration[] {
    const declarations: ts.ClassDeclaration[] = [];

    function visit(node: ts.Node) {
      if (ts.isClassDeclaration(node) && node.name) {
        declarations.push(node);
      }
      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return declarations;
  }

  private extractTagName(node: ts.ClassDeclaration & { name?: ts.Identifier }): string {
    // First check for customElements.define in the source code
    const sourceText = this.sourceFile.getText();
    const className = node.name?.text || '';
    const defineMatch = sourceText.match(
      new RegExp(`customElements\\.define\\(['"]([^'"]+)['"],\\s*${className}\\)`),
    );

    if (defineMatch) {
      return defineMatch[1];
    }

    // Fallback to checking decorators
    const customElementDecorator = (
      node as ts.ClassDeclaration & { decorators?: ts.Decorator[] }
    ).decorators?.find(decorator => {
      const decoratorName = (decorator.expression as ts.CallExpression).getText();
      return decoratorName.includes('customElement');
    });

    if (customElementDecorator) {
      const decoratorText = (customElementDecorator.expression as ts.CallExpression).getText();
      const match = decoratorText.match(/'([^']+)'/);
      return match ? match[1] : 'unknown-element';
    }

    return 'unknown-element';
  }

  private findExtends(node: ts.ClassDeclaration): string {
    if (node.heritageClauses) {
      for (const clause of node.heritageClauses) {
        if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
          return clause.types[0].expression.getText();
        }
      }
    }
    return 'HTMLElement';
  }

  private isCustomElement(node: ts.ClassDeclaration | ts.Node): boolean {
    if (!ts.isClassDeclaration(node)) {
      return false;
    }

    // Get the class name
    const className = node.name?.text;
    if (!className) return false;

    // Check the entire source code for customElements.define with this class name
    const sourceText = this.sourceFile.getText();
    return (
      sourceText.includes(`customElements.define('${className.toLowerCase()}', ${className})`) ||
      sourceText.includes(`customElements.define("${className.toLowerCase()}", ${className})`)
    );
  }

  private usesShadowDOM(node: ts.ClassDeclaration): boolean {
    const text = node.getText();
    return text.includes('attachShadow') || text.includes('shadowRoot');
  }

  private findLifecycleHooks(node: ts.Node): string[] {
    const hooks: string[] = [];

    if (ts.isClassDeclaration(node)) {
      node.members.forEach(member => {
        if (ts.isMethodDeclaration(member)) {
          const methodName = member.name.getText();
          if (this.isLifecycleHook(methodName)) {
            hooks.push(methodName);
          }
        }
      });
    }

    return hooks;
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

  private findShadowDOMUsage(node: ts.ClassDeclaration): string[] {
    const text = node.getText();
    const shadowDOMUsage: string[] = [];

    if (text.includes('attachShadow')) {
      shadowDOMUsage.push('attachShadow');
    }
    if (text.includes('shadowRoot')) {
      shadowDOMUsage.push('shadowRoot');
    }
    if (text.includes('slot')) {
      shadowDOMUsage.push('slot');
    }

    return shadowDOMUsage;
  }

  private findSlots(node: ts.ClassDeclaration): string[] {
    const slots: string[] = [];
    const nodeText = node.getText();
    const slotMatches = nodeText.match(/<slot[^>]*name="([^"]*)"[^>]*>/g);

    if (slotMatches) {
      slotMatches.forEach(slot => {
        const nameMatch = slot.match(/name="([^"]*)"/);
        if (nameMatch) {
          slots.push(nameMatch[1]);
        }
      });
    }

    return slots;
  }

  private findEvents(node: ts.ClassDeclaration): WebComponentEvent[] {
    const events: WebComponentEvent[] = [];
    const text = node.getText();
    const componentName = node.name?.text || 'AnonymousComponent';

    // Find event handlers
    const eventHandlerMatches = text.match(/on\w+\s*=/g) || [];
    eventHandlerMatches.forEach(match => {
      const eventName = match.replace(/on|=|\s/g, '').toLowerCase();
      if (eventName) {
        events.push({
          name: eventName,
          type: 'event-handler',
          component: componentName,
          hasListener: true,
        });
      }
    });

    // Find custom events
    const customEventMatches = text.match(/dispatchEvent|CustomEvent/g) || [];
    customEventMatches.forEach(() => {
      events.push({
        name: 'custom-event',
        type: 'custom-event',
        component: componentName,
        isBubbling: true,
        isComposed: true,
      });
    });

    return events;
  }

  private findProperties(node: ts.ClassDeclaration): Property[] {
    const properties: Property[] = [];
    const text = node.getText();

    // Find property declarations
    const propertyMatches =
      text.match(/(?:@property|@state|@prop)\s*\(\s*{[^}]*}\s*\)\s*(\w+)/g) || [];
    propertyMatches.forEach(match => {
      const name = match.match(/\w+$/)?.[0] || '';
      const type = text.includes(`${name}: string`)
        ? 'string'
        : text.includes(`${name}: number`)
        ? 'number'
        : text.includes(`${name}: boolean`)
        ? 'boolean'
        : 'any';

      properties.push({
        name,
        type,
        isPublic: !text.includes(`private ${name}`),
        isReadonly: text.includes(`readonly ${name}`),
      });
    });

    return properties;
  }

  private hasSemanticHTMLTags(text: string): boolean {
    const semanticTags = [
      'header',
      'nav',
      'main',
      'article',
      'section',
      'aside',
      'footer',
      'figure',
      'figcaption',
    ];
    return semanticTags.some(tag => text.includes(`<${tag}`));
  }

  private findPerformanceMetrics(node: ts.Node): BasePerformanceInfo {
    const text = node.getText();
    const issues: PerformanceIssue[] = [];
    let hasPerformanceIssues = false;
    let hasLargeBundleSize = false;
    let hasSlowRendering = false;
    let hasMemoryLeaks = false;
    let hasNetworkIssues = false;
    let hasResourceLoadingIssues = false;
    let hasAnimationPerformanceIssues = false;
    let hasLayoutThrashing = false;
    let hasEventHandlingIssues = false;
    let hasDOMManipulationIssues = false;

    // Check for constructor performance
    if (text.includes('constructor')) {
      if (text.includes('super(')) {
        issues.push({
          type: 'constructor',
          description: 'Constructor includes super() call which may impact performance',
          severity: 'low',
        });
      }
      if (text.includes('this.attachShadow')) {
        issues.push({
          type: 'shadow-dom',
          description: 'Shadow DOM initialization in constructor may impact performance',
          severity: 'medium',
        });
      }
      if (text.includes('addEventListener')) {
        issues.push({
          type: 'event-binding',
          description: 'Event listener binding in constructor may cause memory leaks',
          severity: 'high',
        });
        hasEventHandlingIssues = true;
      }
    }

    // Check for render performance
    if (text.includes('render')) {
      if (text.includes('innerHTML')) {
        issues.push({
          type: 'rendering',
          description: 'Using innerHTML may cause XSS vulnerabilities and performance issues',
          severity: 'high',
        });
        hasSlowRendering = true;
        hasDOMManipulationIssues = true;
      }
      if (text.includes('createElement') && text.includes('appendChild')) {
        issues.push({
          type: 'rendering',
          description: 'Multiple DOM operations in render method may cause layout thrashing',
          severity: 'medium',
        });
        hasLayoutThrashing = true;
      }
    }

    // Check for memory leaks
    if (text.includes('addEventListener') && !text.includes('removeEventListener')) {
      issues.push({
        type: 'memory',
        description: 'Event listeners added without cleanup may cause memory leaks',
        severity: 'high',
      });
      hasMemoryLeaks = true;
    }

    // Check for network issues
    if (text.includes('fetch') || text.includes('XMLHttpRequest')) {
      issues.push({
        type: 'network',
        description: 'Network requests without error handling may impact performance',
        severity: 'medium',
      });
      hasNetworkIssues = true;
    }

    // Check for resource loading
    if (text.includes('import') || text.includes('require')) {
      issues.push({
        type: 'resources',
        description: 'Large imports may impact bundle size and loading performance',
        severity: 'medium',
      });
      hasResourceLoadingIssues = true;
    }

    // Check for animation performance
    if (text.includes('animation') || text.includes('transition')) {
      issues.push({
        type: 'animation',
        description: 'CSS animations or transitions may cause performance issues',
        severity: 'low',
      });
      hasAnimationPerformanceIssues = true;
    }

    // Set hasPerformanceIssues based on any issues found
    hasPerformanceIssues = issues.length > 0;

    // Get performance metrics from analyzer if available
    let metrics = {
      constructorTime: 0,
      renderTime: 0,
      updateTime: 0,
      memoryUsage: 0,
      reflowCount: 0,
      repaintCount: 0,
      optimizationSuggestions: [] as string[],
    };

    if (this.performanceAnalyzer && ts.isClassDeclaration(node)) {
      const performanceMetrics = this.performanceAnalyzer.analyze(node);
      metrics = {
        constructorTime: performanceMetrics.constructorTime || 0,
        renderTime: performanceMetrics.renderTime || 0,
        updateTime: performanceMetrics.updateTime || 0,
        memoryUsage: performanceMetrics.memoryUsage || 0,
        reflowCount: performanceMetrics.reflowCount || 0,
        repaintCount: performanceMetrics.repaintCount || 0,
        optimizationSuggestions: performanceMetrics.optimizationSuggestions || [],
      };
    }

    return {
      hasPerformanceIssues,
      issues,
      hasLargeBundleSize,
      hasSlowRendering,
      hasMemoryLeaks,
      hasNetworkIssues,
      hasResourceLoadingIssues,
      hasAnimationPerformanceIssues,
      hasLayoutThrashing,
      hasEventHandlingIssues,
      hasDOMManipulationIssues,
      ...metrics,
    };
  }

  private analyzeAccessibility(nodes: ts.Node[]): AccessibilityInfo {
    const issues: AccessibilityIssue[] = [];
    const text = nodes.map(node => node.getText()).join('\n');

    // Check for missing ARIA attributes
    if (!text.includes('aria-')) {
      issues.push({
        type: 'missing-role',
        message: 'Component is missing ARIA attributes',
        severity: 'warning',
      });
    }

    // Check for keyboard support
    if (!text.includes('keydown') && !text.includes('keyup')) {
      issues.push({
        type: 'keyboard-navigation',
        message: 'Component lacks keyboard navigation support',
        severity: 'warning',
      });
    }

    // Check for semantic HTML
    if (!this.hasSemanticHTMLTags(text)) {
      issues.push({
        type: 'semantic-html',
        message: 'Component uses non-semantic HTML elements',
        severity: 'info',
      });
    }

    const accessibilityInfo = {
      ...this.defaultAccessibilityInfo,
      hasRoles: text.includes('role='),
      hasLabels: text.includes('label') || text.includes('aria-label'),
      hasFocusableElements: text.includes('tabindex'),
      hasAriaAttributes: text.includes('aria-'),
      hasKeyboardSupport: text.includes('keydown') || text.includes('keyup'),
      hasSemanticHTML: this.hasSemanticHTMLTags(text),
      hasTextAlternatives: text.includes('alt=') || text.includes('aria-label'),
      hasFocusManagement: text.includes('focus()'),
      hasColorContrast: true, // This would need a more sophisticated check
      hasDynamicContent: text.includes('innerHTML') || text.includes('textContent'),
      hasFormElements: text.includes('<input') || text.includes('<form'),
      hasInteractiveElements: text.includes('button') || text.includes('input'),
      hasHeadings: text.includes('<h1') || text.includes('<h2'),
      hasLists: text.includes('<ul') || text.includes('<ol'),
      hasTables: text.includes('<table'),
      hasIframes: text.includes('<iframe'),
      hasMedia: text.includes('<video') || text.includes('<audio'),
      issues,
    };

    // Set hasAccessibilityIssues based on any issues found
    accessibilityInfo.hasAccessibilityIssues = issues.length > 0;

    return accessibilityInfo;
  }
}
