import { describe, it, expect } from 'vitest';
import { createWebComponentsAnalyzer } from '../analyzer';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('WebComponentsAnalyzer', () => {
  const analyzer = createWebComponentsAnalyzer();

  describe('Example Analysis', () => {
    it('should analyze task manager example', async () => {
      const sourceCode = readFileSync(
        join(__dirname, '../../../../packages/examples/task-manager/xstateTaskManager.ts'),
        'utf-8',
      );

      const result = await analyzer.analyze(sourceCode);

      expect(result.success).toBe(true);
      expect(result.data.components.length).toBe(5); // TaskList, ProgressBar, TaskForm, ConfettiEffect, TaskManager
      expect(result.data.events.length).toBeGreaterThan(0);
      expect(result.data.properties.length).toBeGreaterThan(0);

      // Check TaskList component
      const taskList = result.data.components.find(c => c.name === 'TaskList');
      expect(taskList).toBeDefined();
      expect(taskList?.events.length).toBeGreaterThan(0);
      expect(taskList?.properties.length).toBeGreaterThan(0);

      // Check ProgressBar component
      const progressBar = result.data.components.find(c => c.name === 'ProgressBar');
      expect(progressBar).toBeDefined();
      expect(progressBar?.events.length).toBe(0);
      expect(progressBar?.properties.length).toBeGreaterThan(0);

      // Check TaskForm component
      const taskForm = result.data.components.find(c => c.name === 'TaskForm');
      expect(taskForm).toBeDefined();
      expect(taskForm?.events.length).toBeGreaterThan(0);
      expect(taskForm?.properties.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility Analysis', () => {
    it('should detect accessibility issues in bad example', async () => {
      const sourceCode = readFileSync(
        join(__dirname, '../__tests__/fixtures/accessibility/accessibility-bad.ts'),
        'utf-8',
      );

      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data.components.length).toBe(1);

      const component = result.data.components[0];
      expect(component.accessibility?.issues.length).toBeGreaterThan(0);
    });

    it('should validate good accessibility practices', async () => {
      const sourceCode = readFileSync(
        join(__dirname, '../__tests__/fixtures/accessibility/accessibility-good.ts'),
        'utf-8',
      );

      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data.components.length).toBe(1);

      const component = result.data.components[0];
      expect(component.accessibility?.issues.length).toBe(0);
    });
  });

  describe('Event Analysis', () => {
    it('should detect event handlers', async () => {
      const sourceCode = readFileSync(
        join(__dirname, '../__tests__/fixtures/events/event-handlers.ts'),
        'utf-8',
      );

      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data.events.length).toBe(2);

      const clickEvent = result.data.events.find(e => e.name === 'click');
      expect(clickEvent).toBeDefined();
      expect(clickEvent?.type).toBe('standard');
      expect(clickEvent?.isBubbling).toBe(true);
      expect(clickEvent?.isComposed).toBe(true);
      expect(clickEvent?.hasListener).toBe(true);
    });

    it('should analyze custom events', async () => {
      const sourceCode = readFileSync(
        join(__dirname, '../__tests__/fixtures/events/custom-events.ts'),
        'utf-8',
      );

      const result = await analyzer.analyze(sourceCode);
      expect(result.success).toBe(true);
      expect(result.data.events.length).toBe(1);

      const customEvent = result.data.events[0];
      expect(customEvent.name).toBe('custom-event');
      expect(customEvent.type).toBe('custom');
      expect(customEvent.isBubbling).toBe(true);
      expect(customEvent.isComposed).toBe(true);
      expect(customEvent.hasListener).toBe(true);
    });
  });

  describe('Performance Analysis', () => {
    it('should detect performance issues', async () => {
      const sourceCode = readFileSync(
        join(__dirname, '../__tests__/fixtures/performance/performance-issues.ts'),
        'utf-8',
      );

      const result = await analyzer.analyze(sourceCode);
      const performance = result.data.performance;

      expect(performance.optimizationSuggestions).toHaveLength(4);
      expect(performance.optimizationSuggestions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'render',
            impact: 'high',
            description: expect.stringContaining('Large render method'),
          }),
          expect.objectContaining({
            type: 'reflow',
            impact: 'medium',
            description: expect.stringContaining('Forced reflow'),
          }),
          expect.objectContaining({
            type: 'memory',
            impact: 'medium',
            description: expect.stringContaining('Expensive property observer'),
          }),
          expect.objectContaining({
            type: 'memory',
            impact: 'low',
            description: expect.stringContaining('Expensive operation'),
          }),
        ]),
      );
    });
  });
});
