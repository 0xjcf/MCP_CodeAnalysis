import * as ts from 'typescript';
import type { ShadowDOMUsage } from '../../types';

export class ShadowDOMAnalyzer {
  analyze(node: ts.ClassDeclaration, componentName: string): ShadowDOMUsage[] {
    const shadowDOMUsages: ShadowDOMUsage[] = [];
    const slots = new Set<string>();

    // Visit all nodes in the class
    const visit = (node: ts.Node) => {
      // Check for attachShadow calls
      if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
        const propertyAccess = node.expression;
        if (propertyAccess.name.getText() === 'attachShadow') {
          const mode = this.getShadowRootMode(node);
          if (mode) {
            shadowDOMUsages.push({
              component: componentName,
              mode,
              slots: Array.from(slots),
              location: this.getLocation(node),
            });
          }
        }
      }

      // Check for slot elements
      if (ts.isTemplateExpression(node) || ts.isStringLiteral(node)) {
        const text = node.getText();
        const slotMatches = text.match(/<slot[^>]*name=["']([^"']+)["'][^>]*>/g);
        if (slotMatches) {
          slotMatches.forEach(match => {
            const nameMatch = match.match(/name=["']([^"']+)["']/);
            if (nameMatch && nameMatch[1]) {
              slots.add(nameMatch[1]);
            }
          });
        }
      }

      node.forEachChild(visit);
    };

    visit(node);
    return shadowDOMUsages;
  }

  private getShadowRootMode(node: ts.CallExpression): 'open' | 'closed' | undefined {
    if (node.arguments.length > 0) {
      const arg = node.arguments[0];
      if (ts.isObjectLiteralExpression(arg)) {
        const modeProperty = arg.properties.find(
          prop =>
            ts.isPropertyAssignment(prop) &&
            prop.name.getText() === 'mode' &&
            ts.isStringLiteral(prop.initializer),
        );
        if (modeProperty && ts.isPropertyAssignment(modeProperty)) {
          const mode = (modeProperty.initializer as ts.StringLiteral).text;
          if (mode === 'open' || mode === 'closed') {
            return mode;
          }
        }
      }
    }
    return undefined;
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
