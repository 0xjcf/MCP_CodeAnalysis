import * as ts from 'typescript';
import { AccessibilityMetrics, AccessibilityIssue } from '../../types';

export class AccessibilityAnalyzer {
  private sourceFile: ts.SourceFile;

  constructor(sourceFile: ts.SourceFile) {
    this.sourceFile = sourceFile;
  }

  analyze(node: ts.ClassDeclaration): AccessibilityMetrics {
    const metrics: AccessibilityMetrics = {
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
      issues: [],
    };

    this.visitNode(node, metrics);
    this.generateIssues(metrics);
    return metrics;
  }

  private visitNode(node: ts.Node, metrics: AccessibilityMetrics): void {
    if (ts.isTemplateLiteral(node)) {
      this.analyzeTemplate(node, metrics);
    } else if (ts.isMethodDeclaration(node)) {
      this.analyzeMethod(node, metrics);
    }

    ts.forEachChild(node, child => this.visitNode(child, metrics));
  }

  private analyzeTemplate(node: ts.TemplateLiteral, metrics: AccessibilityMetrics): void {
    const templateText = node.getText();

    // Check for ARIA attributes
    if (templateText.includes('aria-') || templateText.includes('role=')) {
      metrics.hasAriaAttributes = true;
    }

    // Check for semantic HTML
    if (
      templateText.includes('<header') ||
      templateText.includes('<nav') ||
      templateText.includes('<main') ||
      templateText.includes('<article') ||
      templateText.includes('<section') ||
      templateText.includes('<aside') ||
      templateText.includes('<footer')
    ) {
      metrics.hasSemanticHTML = true;
    }

    // Check for text alternatives
    if (templateText.includes('alt=') || templateText.includes('aria-label=')) {
      metrics.hasTextAlternatives = true;
    }

    // Check for focus management
    if (templateText.includes('tabindex=') || templateText.includes('focus()')) {
      metrics.hasFocusManagement = true;
    }

    // Check for interactive elements
    if (templateText.includes('<button') || templateText.includes('<a href=')) {
      metrics.hasInteractiveElements = true;
    }

    // Check for headings
    if (
      templateText.includes('<h1') ||
      templateText.includes('<h2') ||
      templateText.includes('<h3')
    ) {
      metrics.hasHeadings = true;
    }

    // Check for lists
    if (templateText.includes('<ul') || templateText.includes('<ol')) {
      metrics.hasLists = true;
    }

    // Check for tables
    if (templateText.includes('<table')) {
      metrics.hasTables = true;
    }

    // Check for iframes
    if (templateText.includes('<iframe')) {
      metrics.hasIframes = true;
    }

    // Check for media
    if (
      templateText.includes('<img') ||
      templateText.includes('<video') ||
      templateText.includes('<audio')
    ) {
      metrics.hasMedia = true;
    }
  }

  private analyzeMethod(node: ts.MethodDeclaration, metrics: AccessibilityMetrics): void {
    const methodText = node.getText();

    // Check for keyboard support
    if (
      methodText.includes('keydown') ||
      methodText.includes('keyup') ||
      methodText.includes('keypress')
    ) {
      metrics.hasKeyboardSupport = true;
    }

    // Check for dynamic content
    if (methodText.includes('innerHTML') || methodText.includes('textContent')) {
      metrics.hasDynamicContent = true;
    }

    // Check for form elements
    if (
      methodText.includes('form') ||
      methodText.includes('input') ||
      methodText.includes('select')
    ) {
      metrics.hasFormElements = true;
    }
  }

  private generateIssues(metrics: AccessibilityMetrics): void {
    // Only add issues for missing features
    if (!metrics.hasAriaAttributes) {
      metrics.issues.push({
        type: 'missing-role',
        message: 'Component lacks ARIA attributes',
        severity: 'warning',
      });
    }

    if (!metrics.hasKeyboardSupport) {
      metrics.issues.push({
        type: 'keyboard-navigation',
        message: 'Component lacks keyboard support',
        severity: 'warning',
      });
    }

    if (!metrics.hasSemanticHTML) {
      metrics.issues.push({
        type: 'semantic-html',
        message: 'Component lacks semantic HTML structure',
        severity: 'warning',
      });
    }

    if (!metrics.hasTextAlternatives) {
      metrics.issues.push({
        type: 'missing-label',
        message: 'Component lacks text alternatives for non-text content',
        severity: 'warning',
      });
    }

    if (!metrics.hasFocusManagement) {
      metrics.issues.push({
        type: 'focus-management',
        message: 'Component lacks proper focus management',
        severity: 'warning',
      });
    }

    if (!metrics.hasColorContrast) {
      metrics.issues.push({
        type: 'color-contrast',
        message: 'Component may have insufficient color contrast',
        severity: 'warning',
      });
    }

    if (!metrics.hasDynamicContent) {
      metrics.issues.push({
        type: 'dynamic-content',
        message: 'Component lacks dynamic content announcements',
        severity: 'warning',
      });
    }
  }

  private getLocation(node: ts.Node): { file: string; line: number; column: number } {
    if (!node.getSourceFile()) {
      return { file: '', line: 0, column: 0 };
    }

    const { line, character } = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart());
    return {
      file: node.getSourceFile().fileName,
      line: line + 1,
      column: character + 1,
    };
  }
}
