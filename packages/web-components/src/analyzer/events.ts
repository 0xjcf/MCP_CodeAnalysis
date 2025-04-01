import * as ts from 'typescript';
import { Event } from '../types';

export class EventsAnalyzer {
  private sourceFile: ts.SourceFile;

  constructor(sourceFile: ts.SourceFile) {
    this.sourceFile = sourceFile;
  }

  analyze(node: ts.ClassDeclaration): Event[] {
    const events: Event[] = [];
    this.visitNode(node, events);
    return events;
  }

  private visitNode(node: ts.Node, events: Event[]): void {
    if (ts.isMethodDeclaration(node)) {
      const event = this.analyzeMethod(node);
      if (event) {
        events.push(event);
      }
    } else if (ts.isCallExpression(node)) {
      const event = this.analyzeEventDispatch(node);
      if (event) {
        events.push(event);
      }
    }

    ts.forEachChild(node, child => this.visitNode(child, events));
  }

  private analyzeMethod(node: ts.MethodDeclaration): Event | null {
    const name = node.name.getText();
    // Fix event handler detection
    if (name.toLowerCase().includes('handle') || name.toLowerCase().includes('on')) {
      const eventName = name.replace(/^handle|^on/, '').toLowerCase();
      const location = this.getLocation(node);
      const component = this.getComponentName(node);

      return {
        name: eventName,
        type: 'standard',
        isBubbling: true,
        isComposed: true,
        hasListener: true,
        component,
        location,
      };
    }
    return null;
  }

  private analyzeEventDispatch(node: ts.CallExpression): Event | null {
    // Fix custom event name detection
    const eventName = node.arguments[0]?.getText().replace(/['"]/g, '');
    if (!eventName) return null;

    const location = this.getLocation(node);
    const component = this.getComponentName(node);

    return {
      name: eventName,
      type: 'custom',
      isBubbling: true,
      isComposed: true,
      hasListener: true,
      component,
      location,
    };
  }

  private getComponentName(node: ts.Node): string {
    let parent: ts.Node | undefined = node.parent;
    while (parent) {
      if (ts.isClassDeclaration(parent)) {
        return parent.name?.getText() || '';
      }
      parent = parent.parent;
    }
    return '';
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
