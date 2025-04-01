import * as ts from 'typescript';
import { Property } from '../types';

export class PropertiesAnalyzer {
  private sourceFile: ts.SourceFile;

  constructor(sourceFile: ts.SourceFile) {
    this.sourceFile = sourceFile;
  }

  analyze(node: ts.ClassDeclaration): Property[] {
    const properties: Property[] = [];
    this.visitNode(node, properties);
    return properties;
  }

  private visitNode(node: ts.Node, properties: Property[]): void {
    if (ts.isPropertyDeclaration(node)) {
      const property = this.analyzeProperty(node);
      if (property) {
        properties.push(property);
      }
    }

    ts.forEachChild(node, child => this.visitNode(child, properties));
  }

  private analyzeProperty(node: ts.PropertyDeclaration): Property | null {
    // Only include properties that are explicitly declared as component properties
    const decorators = ts.canHaveDecorators(node) ? ts.getDecorators(node) : undefined;
    if (!decorators?.some(d => d.getText().includes('@property'))) {
      return null;
    }

    const name = node.name.getText();
    const type = this.getPropertyType(node);
    const required = this.isPropertyRequired(node);
    const location = this.getLocation(node);
    const component = this.getComponentName(node);

    return {
      name,
      type,
      required,
      component,
      location,
    };
  }

  private getComponentName(node: ts.PropertyDeclaration): string {
    let parent: ts.Node | undefined = node.parent;
    while (parent) {
      if (ts.isClassDeclaration(parent)) {
        return parent.name?.getText() || '';
      }
      parent = parent.parent;
    }
    return '';
  }

  private getPropertyType(node: ts.PropertyDeclaration): string {
    if (node.type) {
      return node.type.getText();
    }
    return 'any';
  }

  private isPropertyRequired(node: ts.PropertyDeclaration): boolean {
    return node.questionToken === undefined;
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
