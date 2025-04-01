import * as ts from 'typescript';
import type { WebComponent } from '../../types';

export class CustomElementsAnalyzer {
  analyze(
    node: ts.ClassDeclaration,
  ): Pick<WebComponent, 'tagName' | 'extends' | 'isCustomElement'> {
    return {
      tagName: this.getTagName(node),
      extends: this.getExtends(node),
      isCustomElement: this.isCustomElement(node),
    };
  }

  private getTagName(node: ts.ClassDeclaration): string {
    let tagName = '';
    const className = node.name?.getText() || '';

    // Look for customElements.define() calls
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isPropertyAccessExpression(node.expression.expression) &&
        node.expression.expression.expression.getText() === 'customElements' &&
        node.expression.expression.name.getText() === 'define' &&
        node.arguments.length > 0
      ) {
        const firstArg = node.arguments[0];
        if (ts.isStringLiteral(firstArg)) {
          tagName = firstArg.text;
        }
      }

      node.forEachChild(visit);
    };

    const sourceFile = node.getSourceFile();
    if (sourceFile) {
      visit(sourceFile);
    }

    return tagName || className.toLowerCase();
  }

  private getExtends(node: ts.ClassDeclaration): string {
    let extendsClass = 'HTMLElement';

    // Check for extends clause
    if (node.heritageClauses) {
      const extendsClause = node.heritageClauses.find(
        clause => clause.token === ts.SyntaxKind.ExtendsKeyword,
      );
      if (extendsClause && extendsClause.types.length > 0) {
        extendsClass = extendsClause.types[0].expression.getText();
      }
    }

    return extendsClass;
  }

  private isCustomElement(node: ts.ClassDeclaration): boolean {
    let isCustomElement = false;
    const className = node.name?.getText() || '';

    // Check for customElements.define() calls
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isPropertyAccessExpression(node.expression.expression) &&
        node.expression.expression.expression.getText() === 'customElements' &&
        node.expression.expression.name.getText() === 'define' &&
        node.arguments.length > 1
      ) {
        const secondArg = node.arguments[1];
        if (ts.isIdentifier(secondArg) && secondArg.getText() === className) {
          isCustomElement = true;
        }
      }

      node.forEachChild(visit);
    };

    const sourceFile = node.getSourceFile();
    if (sourceFile) {
      visit(sourceFile);
    }

    return isCustomElement;
  }
}
