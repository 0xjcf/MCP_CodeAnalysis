import * as ts from 'typescript';
import { PerformanceMetrics, OptimizationSuggestion } from '../../types';

export class PerformanceAnalyzer {
  private sourceFile: ts.SourceFile;

  constructor(sourceFile: ts.SourceFile) {
    this.sourceFile = sourceFile;
  }

  analyze(node: ts.ClassDeclaration): PerformanceMetrics {
    const metrics: PerformanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      reflowCount: 0,
      repaintCount: 0,
      optimizationSuggestions: [],
    };

    this.visitNode(node, metrics);
    return metrics;
  }

  private visitNode(node: ts.Node, metrics: PerformanceMetrics): void {
    if (ts.isMethodDeclaration(node)) {
      this.analyzeMethod(node, metrics);
    } else if (ts.isCallExpression(node)) {
      this.analyzeCallExpression(node, metrics);
    } else if (ts.isPropertyAccessExpression(node)) {
      this.analyzePropertyAccess(node, metrics);
    }

    ts.forEachChild(node, child => this.visitNode(child, metrics));
  }

  private analyzeMethod(node: ts.MethodDeclaration, metrics: PerformanceMetrics): void {
    const methodText = node.getText();
    const methodName = node.name.getText();

    // Check for large render methods
    if (methodName === 'render' && methodText.length > 500) {
      metrics.optimizationSuggestions.push({
        type: 'render',
        description: 'Large render method detected',
        impact: 'medium',
        location: this.getLocation(node),
        code: methodText,
        suggestion: 'Consider breaking down the render method into smaller components',
      });
    }

    // Check for expensive operations in render
    if (
      methodName === 'render' &&
      (methodText.includes('querySelector') ||
        methodText.includes('getElementsBy') ||
        methodText.includes('createElement'))
    ) {
      metrics.optimizationSuggestions.push({
        type: 'render',
        description: 'Expensive DOM operations in render method',
        impact: 'high',
        location: this.getLocation(node),
        code: methodText,
        suggestion: 'Move DOM operations outside render method or use document fragments',
      });
    }

    // Check for large list rendering
    if (
      methodText.includes('map(') &&
      methodText.includes('=>') &&
      methodText.includes('createElement')
    ) {
      metrics.optimizationSuggestions.push({
        type: 'render',
        description: 'Large list rendering detected',
        impact: 'high',
        location: this.getLocation(node),
        code: methodText,
        suggestion: 'Consider using virtual scrolling or pagination for large lists',
      });
    }
  }

  private analyzeCallExpression(node: ts.CallExpression, metrics: PerformanceMetrics): void {
    const callText = node.getText();

    // Check for layout thrashing
    if (
      callText.includes('offsetHeight') ||
      callText.includes('offsetWidth') ||
      callText.includes('getBoundingClientRect') ||
      callText.includes('getWidth()') ||
      callText.includes('getHeight()')
    ) {
      metrics.reflowCount++;
      metrics.optimizationSuggestions.push({
        type: 'reflow',
        description: 'Forced reflow detected',
        impact: 'high',
        location: this.getLocation(node),
        code: callText,
        suggestion: 'Batch DOM reads and writes to avoid layout thrashing',
      });
    }

    // Check for expensive DOM operations
    if (
      callText.includes('querySelector') ||
      callText.includes('getElementsBy') ||
      callText.includes('createElement')
    ) {
      metrics.optimizationSuggestions.push({
        type: 'render',
        description: 'Expensive DOM operation detected',
        impact: 'medium',
        location: this.getLocation(node),
        code: callText,
        suggestion: 'Cache DOM queries and reuse elements when possible',
      });
    }
  }

  private analyzePropertyAccess(
    node: ts.PropertyAccessExpression,
    metrics: PerformanceMetrics,
  ): void {
    const accessText = node.getText();

    // Check for repaints
    if (
      accessText.includes('style.') ||
      accessText.includes('className') ||
      accessText.includes('classList')
    ) {
      metrics.repaintCount++;
      metrics.optimizationSuggestions.push({
        type: 'repaint',
        description: 'Forced repaint detected',
        impact: 'medium',
        location: this.getLocation(node),
        code: accessText,
        suggestion: 'Use CSS classes instead of inline styles when possible',
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
