import * as ts from 'typescript';
import type { WebComponent } from '../../types';

export class CustomElementsAnalyzer {
  analyze(node: ts.ClassDeclaration): WebComponent | null {
    if (!this.isCustomElement(node)) {
      return null;
    }

    const tagName = this.getTagName(node);
    const extendsElement = this.getExtendsElement(node);

    return {
      name: node.name?.text || 'AnonymousComponent',
      tagName: tagName || '',
      extends: extendsElement || 'HTMLElement',
      isCustomElement: true,
      usesShadowDOM: this.hasShadowDOM(node),
      lifecycleHooks: this.getLifecycleHooks(node),
      properties: [],
      events: [],
      accessibility: {
        hasAriaAttributes: false,
        hasRoles: false,
        hasLabels: false,
      },
      performance: {
        optimizationSuggestions: [],
        metrics: {},
      },
    };
  }

  private isCustomElement(node: ts.ClassDeclaration): boolean {
    return Boolean(
      node.heritageClauses?.some(clause =>
        clause.types.some(type => type.expression.getText().includes('HTMLElement')),
      ),
    );
  }

  private getTagName(node: ts.ClassDeclaration): string {
    // Look for customElements.define call using regex to avoid execution
    const sourceFile = node.getSourceFile();
    const sourceText = sourceFile.getText();
    const defineCallMatch = sourceText.match(/customElements\.define\(['"]([^'"]+)['"]/);

    if (defineCallMatch) {
      return defineCallMatch[1];
    }

    // If no define call found, try to infer from class name
    const className = node.name?.text || '';
    return className
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  }

  private getExtendsElement(node: ts.ClassDeclaration): string {
    return node.heritageClauses?.[0]?.types[0]?.expression.getText() || 'HTMLElement';
  }

  private hasShadowDOM(node: ts.ClassDeclaration): boolean {
    const constructor = node.members.find(
      member => member.kind === ts.SyntaxKind.Constructor,
    ) as ts.ConstructorDeclaration;

    if (!constructor?.body) return false;

    return constructor.body.statements.some(statement =>
      statement.getText().includes('attachShadow'),
    );
  }

  private getLifecycleHooks(node: ts.ClassDeclaration): string[] {
    const hooks = [
      'connectedCallback',
      'disconnectedCallback',
      'adoptedCallback',
      'attributeChangedCallback',
    ];
    return hooks.filter(hook =>
      node.members.some(
        member =>
          member.kind === ts.SyntaxKind.MethodDeclaration && member.name?.getText() === hook,
      ),
    );
  }
}
