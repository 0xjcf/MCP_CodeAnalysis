import * as ts from 'typescript';
import type { Property } from '../../types';

export class PropertiesAnalyzer {
  analyze(node: ts.ClassDeclaration, componentName: string): Property[] {
    const properties: Property[] = [];

    // Analyze class members for properties
    node.members.forEach(member => {
      if (ts.isPropertyDeclaration(member)) {
        const property = this.analyzeProperty(member, componentName);
        if (property) {
          properties.push(property);
        }
      } else if (ts.isGetAccessorDeclaration(member)) {
        const property = this.analyzeGetter(member, componentName);
        if (property) {
          properties.push(property);
        }
      }
    });

    return properties;
  }

  private analyzeProperty(node: ts.PropertyDeclaration, componentName: string): Property | null {
    const name = node.name.getText();
    let type = node.type ? node.type.getText() : 'any';
    let required = false;

    // Check for @property decorator
    const decorators = ts.getDecorators(node);
    const propertyDecorator = decorators?.find((decorator: ts.Decorator) => {
      const decoratorName = decorator.expression.getText();
      return decoratorName === '@property' || decoratorName.startsWith('@property(');
    });

    if (!propertyDecorator) {
      return null;
    }

    // Parse decorator arguments
    if (ts.isCallExpression(propertyDecorator.expression)) {
      const args = propertyDecorator.expression.arguments;
      if (args.length > 0 && ts.isObjectLiteralExpression(args[0])) {
        const options = args[0];
        options.properties.forEach(prop => {
          if (ts.isPropertyAssignment(prop)) {
            if (prop.name.getText() === 'type') {
              type = prop.initializer.getText();
            } else if (prop.name.getText() === 'required') {
              required = prop.initializer.getText() === 'true';
            }
          }
        });
      }
    }

    return {
      name,
      type,
      required,
      component: componentName,
      location: this.getLocation(node),
    };
  }

  private analyzeGetter(node: ts.GetAccessorDeclaration, componentName: string): Property | null {
    const name = node.name.getText();
    let type = node.type ? node.type.getText() : 'any';
    let required = false;

    // Look for corresponding setter
    const parent = node.parent as ts.ClassDeclaration;
    const setter = parent.members.find(
      (member: ts.ClassElement) =>
        ts.isSetAccessorDeclaration(member) && member.name.getText() === name,
    ) as ts.SetAccessorDeclaration;

    if (!setter) {
      return null;
    }

    // Check for @property decorator on the getter
    const decorators = ts.getDecorators(node);
    const propertyDecorator = decorators?.find((decorator: ts.Decorator) => {
      const decoratorName = decorator.expression.getText();
      return decoratorName === '@property' || decoratorName.startsWith('@property(');
    });

    // If there's a @property decorator, parse its arguments
    if (propertyDecorator && ts.isCallExpression(propertyDecorator.expression)) {
      const args = propertyDecorator.expression.arguments;
      if (args.length > 0 && ts.isObjectLiteralExpression(args[0])) {
        const options = args[0];
        options.properties.forEach(prop => {
          if (ts.isPropertyAssignment(prop)) {
            if (prop.name.getText() === 'type') {
              type = prop.initializer.getText();
            } else if (prop.name.getText() === 'required') {
              required = prop.initializer.getText() === 'true';
            }
          }
        });
      }
    }

    // Normalize type names to match expected format
    type = this.normalizeType(type);

    return {
      name,
      type,
      required,
      component: componentName,
      location: this.getLocation(node),
    };
  }

  private normalizeType(type: string): string {
    // Map TypeScript types to expected format
    const typeMap: Record<string, string> = {
      string: 'String',
      number: 'Number',
      boolean: 'Boolean',
      'any[]': 'Array',
      Array: 'Array',
      object: 'Object',
      Date: 'Date',
      RegExp: 'RegExp',
      Error: 'Error',
      Function: 'Function',
      Promise: 'Promise',
      Map: 'Map',
      Set: 'Set',
      WeakMap: 'WeakMap',
      WeakSet: 'WeakSet',
      Symbol: 'Symbol',
      BigInt: 'BigInt',
      Int8Array: 'Int8Array',
      Uint8Array: 'Uint8Array',
      Uint8ClampedArray: 'Uint8ClampedArray',
      Int16Array: 'Int16Array',
      Uint16Array: 'Uint16Array',
      Int32Array: 'Int32Array',
      Uint32Array: 'Uint32Array',
      Float32Array: 'Float32Array',
      Float64Array: 'Float64Array',
      BigInt64Array: 'BigInt64Array',
      BigUint64Array: 'BigUint64Array',
    };

    return typeMap[type] || type;
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
