import * as ts from 'typescript';
import type { LifecycleHook } from '../../types';

export class LifecycleAnalyzer {
  private static readonly LIFECYCLE_HOOKS = [
    'constructor',
    'connectedCallback',
    'disconnectedCallback',
    'adoptedCallback',
    'attributeChangedCallback',
  ];

  analyze(node: ts.ClassDeclaration, componentName: string): LifecycleHook[] {
    const lifecycleHooks: LifecycleHook[] = [];

    // Analyze class members for lifecycle hooks
    node.members.forEach(member => {
      if (ts.isMethodDeclaration(member) && member.name) {
        const methodName = member.name.getText();
        if (this.isLifecycleHook(methodName)) {
          lifecycleHooks.push({
            name: methodName,
            component: componentName,
            location: this.getLocation(member),
          });
        }
      }
    });

    return lifecycleHooks;
  }

  private isLifecycleHook(methodName: string): boolean {
    return LifecycleAnalyzer.LIFECYCLE_HOOKS.includes(methodName);
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
