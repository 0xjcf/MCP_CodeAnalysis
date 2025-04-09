import { describe, it, expect, beforeEach } from 'vitest';
import { WebComponentsAnalyzerImpl } from '../analyzer';
import { WebComponentAnalysisResult } from '../types';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('WebComponentsAnalyzerImpl', () => {
  let analyzer: WebComponentsAnalyzerImpl;

  beforeEach(() => {
    analyzer = new WebComponentsAnalyzerImpl();
  });

  describe('Component Analysis', () => {
    it('should identify custom elements', async () => {
      const sourceCode = `
        class MyElement extends HTMLElement {
          constructor() {
            super();
          }
        }
        customElements.define('my-element', MyElement);
      `;
      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data.components).toHaveLength(1);
      const component = result.data.components[0];
      expect(component.name).toBe('MyElement');
      expect(component.tagName).toBe('my-element');
      expect(component.extends).toBe('HTMLElement');
    });

    it('should identify shadow roots', async () => {
      const sourceCode = `
        class MyElement extends HTMLElement {
          constructor() {
            super();
            this.attachShadow({ mode: 'open' });
          }
        }
      `;
      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data.components[0].usesShadowDOM).toBe(true);
      expect(result.data.shadowDOMUsage).toContain('attachShadow');
    });
  });

  describe('Accessibility Analysis', () => {
    it('should identify ARIA attributes', async () => {
      const sourceCode = `
        class MyElement extends HTMLElement {
          constructor() {
            super();
            this.setAttribute('role', 'button');
            this.setAttribute('aria-label', 'Click me');
          }
        }
      `;
      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data.components[0].accessibility.hasAriaAttributes).toBe(true);
    });
  });

  describe('Event Analysis', () => {
    it('should identify event listeners', async () => {
      const sourceCode = `
        class MyElement extends HTMLElement {
          constructor() {
            super();
            this.onclick = () => {};
          }
        }
      `;
      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data.events).toHaveLength(1);
      expect(result.data.events[0].name).toBe('click');
      expect(result.data.events[0].type).toBe('event-handler');
      expect(result.data.events[0].hasListener).toBe(true);
    });
  });

  describe('Performance Analysis', () => {
    it('should measure performance metrics', async () => {
      const sourceCode = `
        class MyElement extends HTMLElement {
          constructor() {
            super();
          }
        }
      `;
      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.performance).toBeDefined();
      expect(typeof result.performance.constructorTime).toBe('number');
      expect(typeof result.performance.renderTime).toBe('number');
      expect(typeof result.performance.updateTime).toBe('number');
      expect(typeof result.performance.memoryUsage).toBe('number');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid source code', async () => {
      const result = await analyzer.analyze('invalid code');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.performanceMetrics).toEqual({
        constructorTime: 0,
        renderTime: 0,
        updateTime: 0,
        memoryUsage: 0,
      });
    });

    it('should handle empty source code', async () => {
      const result = await analyzer.analyze('');
      expect(result.success).toBe(true);
      expect(result.data.components).toHaveLength(0);
    });
  });
});
