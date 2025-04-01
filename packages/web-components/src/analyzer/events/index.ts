import * as ts from 'typescript';
import type { Event } from '../../types';

export class EventsAnalyzer {
  analyze(node: ts.ClassDeclaration, componentName: string): Event[] {
    const events: Event[] = [];

    // Analyze class members for events
    node.members.forEach(member => {
      if (ts.isMethodDeclaration(member)) {
        const event = this.analyzeEventHandler(member, componentName);
        if (event) {
          events.push(event);
        }
      } else if (ts.isPropertyDeclaration(member)) {
        const event = this.analyzeEventProperty(member, componentName);
        if (event) {
          events.push(event);
        }
      }
    });

    // Analyze custom events
    const customEvents = this.analyzeCustomEvents(node, componentName);
    events.push(...customEvents);

    // Analyze template events
    const templateEvents = this.analyzeTemplateEvents(node, componentName);
    events.push(...templateEvents);

    return events;
  }

  private analyzeEventHandler(node: ts.MethodDeclaration, componentName: string): Event | null {
    const name = node.name.getText();
    if (!name.startsWith('on') && !name.startsWith('handle')) {
      return null;
    }

    const eventName = name.startsWith('on')
      ? name.slice(2).toLowerCase()
      : name.slice(6).toLowerCase();

    return {
      name: eventName,
      component: componentName,
      type: 'standard',
      isBubbling: true,
      isComposed: true,
      hasListener: true,
      location: this.getLocation(node),
    };
  }

  private analyzeEventProperty(node: ts.PropertyDeclaration, componentName: string): Event | null {
    const name = node.name.getText();
    if (!name.startsWith('on') || !node.type || !node.type.getText().includes('EventListener')) {
      return null;
    }

    const eventName = name.slice(2).toLowerCase();

    return {
      name: eventName,
      component: componentName,
      type: 'standard',
      isBubbling: true,
      isComposed: true,
      hasListener: true,
      location: this.getLocation(node),
    };
  }

  private analyzeCustomEvents(node: ts.ClassDeclaration, componentName: string): Event[] {
    const events: Event[] = [];

    const visit = (node: ts.Node) => {
      // Look for CustomEvent constructor calls
      if (ts.isNewExpression(node) && node.expression.getText() === 'CustomEvent') {
        const args = node.arguments;
        if (!args || args.length === 0) {
          return;
        }

        const firstArg = args[0];
        if (!ts.isStringLiteral(firstArg)) {
          return;
        }

        const eventName = firstArg.text;
        let bubbles = false;
        let composed = false;

        if (args.length > 1) {
          const options = args[1];
          if (ts.isObjectLiteralExpression(options)) {
            options.properties.forEach(prop => {
              if (ts.isPropertyAssignment(prop)) {
                if (prop.name.getText() === 'bubbles') {
                  bubbles = prop.initializer.getText() === 'true';
                } else if (prop.name.getText() === 'composed') {
                  composed = prop.initializer.getText() === 'true';
                }
              }
            });
          }
        }

        events.push({
          name: eventName,
          component: componentName,
          type: 'custom',
          isBubbling: bubbles,
          isComposed: composed,
          hasListener: true,
          location: this.getLocation(node),
        });
      }

      // Look for dispatchEvent calls with CustomEvent
      if (ts.isCallExpression(node) && node.expression.getText() === 'dispatchEvent') {
        const args = node.arguments;
        if (!args || args.length === 0) {
          return;
        }

        const firstArg = args[0];
        if (ts.isNewExpression(firstArg) && firstArg.expression.getText() === 'CustomEvent') {
          const eventArgs = firstArg.arguments;
          if (!eventArgs || eventArgs.length === 0) {
            return;
          }

          const eventNameArg = eventArgs[0];
          if (!ts.isStringLiteral(eventNameArg)) {
            return;
          }

          const eventName = eventNameArg.text;
          let bubbles = false;
          let composed = false;

          if (eventArgs.length > 1) {
            const options = eventArgs[1];
            if (ts.isObjectLiteralExpression(options)) {
              options.properties.forEach(prop => {
                if (ts.isPropertyAssignment(prop)) {
                  if (prop.name.getText() === 'bubbles') {
                    bubbles = prop.initializer.getText() === 'true';
                  } else if (prop.name.getText() === 'composed') {
                    composed = prop.initializer.getText() === 'true';
                  }
                }
              });
            }
          }

          events.push({
            name: eventName,
            component: componentName,
            type: 'custom',
            isBubbling: bubbles,
            isComposed: composed,
            hasListener: true,
            location: this.getLocation(node),
          });
        }
      }

      node.forEachChild(visit);
    };

    visit(node);
    return events;
  }

  private analyzeTemplateEvents(node: ts.ClassDeclaration, componentName: string): Event[] {
    const events: Event[] = [];

    const visit = (node: ts.Node) => {
      // Look for template event bindings
      if (ts.isTemplateExpression(node) || ts.isStringLiteral(node)) {
        const text = node.getText();
        const eventMatches = text.match(/@(\w+)=/g) || text.match(/on(\w+)=/g);
        if (eventMatches) {
          eventMatches.forEach(match => {
            const eventName = match.slice(1, -1).toLowerCase();
            events.push({
              name: eventName,
              component: componentName,
              type: 'standard',
              isBubbling: true,
              isComposed: true,
              hasListener: true,
              location: this.getLocation(node),
            });
          });
        }
      }

      node.forEachChild(visit);
    };

    visit(node);
    return events;
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
