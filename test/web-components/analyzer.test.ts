import { WebComponentsAnalyzer } from "../../src/features/web-components/analyzer";
import {
  TaskList,
  ProgressBar,
  TaskForm,
  ConfettiEffect,
  TaskManager,
} from "../fixtures/web-components/task-manager/xstateTaskManager";
import { taskManagerMachine } from "../fixtures/web-components/task-manager/taskManagerMachine";
import { AnalysisResult } from "../../src/types/component";
import { LitElement } from "lit";
import { html } from "lit-html";
import { expect, describe, it, beforeEach } from "@jest/globals";

describe("Web Components Analyzer", () => {
  let analyzer: WebComponentsAnalyzer;

  beforeEach(() => {
    analyzer = new WebComponentsAnalyzer();
  });

  describe("Component Analysis", () => {
    test("analyzes TaskList component structure", async () => {
      const analysis = await analyzer.analyzeComponent(TaskList);

      expect(analysis).toMatchObject({
        type: "web-component",
        name: "TaskList",
        complexity: expect.any(Number),
        dependencies: expect.arrayContaining(["lit-html", "xstate"]),
        issues: expect.any(Array),
        recommendations: expect.any(Array),
        metadata: {
          properties: expect.any(Array),
          events: expect.any(Array),
          methods: expect.any(Array),
          accessibility: {
            keyboardSupport: true,
            screenReaderSupport: true,
            ariaAttributes: expect.any(Array),
            semanticHTML: expect.any(Array),
          },
          styling: {
            usesGlobalStyles: true,
            globalStylesSource: "./dist/styles.css",
            framework: "tailwind",
            componentStyles: expect.any(Array),
            classNames: expect.any(Array),
            encapsulatedStyles: expect.any(Array),
          },
        },
      });
    });

    test("analyzes ProgressBar component structure", async () => {
      const analysis = await analyzer.analyzeComponent(ProgressBar);

      expect(analysis).toMatchObject({
        type: "web-component",
        name: "ProgressBar",
        complexity: expect.any(Number),
        dependencies: expect.arrayContaining(["lit-html", "xstate"]),
        issues: expect.any(Array),
        recommendations: expect.any(Array),
        metadata: {
          properties: expect.any(Array),
          events: expect.any(Array),
          methods: expect.any(Array),
          accessibility: {
            keyboardSupport: true,
            screenReaderSupport: true,
            ariaAttributes: expect.any(Array),
            semanticHTML: expect.any(Array),
          },
          styling: {
            usesGlobalStyles: true,
            globalStylesSource: "./dist/styles.css",
            framework: "tailwind",
            componentStyles: expect.any(Array),
            classNames: expect.any(Array),
            encapsulatedStyles: expect.any(Array),
          },
        },
      });
    });
  });

  describe("Styling Analysis", () => {
    test("detects global styles usage in TaskManager", async () => {
      const analysis = await analyzer.analyzeComponent(TaskManager);

      expect(analysis.metadata.styling).toMatchObject({
        usesGlobalStyles: true,
        globalStylesSource: "./dist/styles.css",
        framework: "tailwind",
        encapsulatedStyles: expect.any(Array),
      });
    });

    test("analyzes component-specific styles", async () => {
      const analysis = await analyzer.analyzeComponent(TaskList);

      expect(analysis.metadata.styling).toMatchObject({
        usesGlobalStyles: true,
        componentStyles: expect.any(Array),
        classNames: expect.any(Array),
      });
    });
  });

  describe("Component Relationships", () => {
    test("analyzes parent-child relationships in TaskManager", async () => {
      const relationships = await analyzer.analyzeRelationships(TaskManager);

      expect(relationships).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "parent-child",
            source: "TaskManager",
            target: "TaskList",
          }),
          expect.objectContaining({
            type: "parent-child",
            source: "TaskManager",
            target: "ProgressBar",
          }),
          expect.objectContaining({
            type: "parent-child",
            source: "TaskManager",
            target: "TaskForm",
          }),
        ])
      );
    });

    test("analyzes component dependencies", async () => {
      const dependencies = await analyzer.analyzeDependencies(TaskManager);

      expect(dependencies).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "component",
            name: "TaskList",
          }),
          expect.objectContaining({
            type: "component",
            name: "ProgressBar",
          }),
          expect.objectContaining({
            type: "component",
            name: "TaskForm",
          }),
        ])
      );
    });
  });

  describe("State Management Analysis", () => {
    test("analyzes XState machine integration", async () => {
      const analysis = await analyzer.analyzeStateManagement(TaskManager);

      expect(analysis).toMatchObject({
        type: "xstate",
        machine: taskManagerMachine,
        states: expect.any(Array),
        events: expect.any(Array),
        context: expect.any(Object),
      });
    });

    test("validates state transitions", async () => {
      const analysis = await analyzer.analyzeStateTransitions(TaskManager);

      expect(analysis).toMatchObject({
        transitions: expect.any(Array),
        guards: expect.any(Array),
        actions: expect.any(Array),
      });
    });
  });

  describe("Accessibility Analysis", () => {
    test("validates TaskList accessibility features", async () => {
      const analysis = await analyzer.analyzeComponent(TaskList);

      expect(analysis.metadata.accessibility).toMatchObject({
        keyboardSupport: true,
        screenReaderSupport: true,
        ariaAttributes: expect.any(Array),
        semanticHTML: expect.any(Array),
      });
    });

    test("validates form accessibility in TaskForm", async () => {
      const analysis = await analyzer.analyzeComponent(TaskForm);

      expect(analysis.metadata.accessibility).toMatchObject({
        keyboardSupport: true,
        screenReaderSupport: true,
        formValidation: expect.any(Object),
        ariaAttributes: expect.any(Array),
        semanticHTML: expect.any(Array),
      });
    });
  });
});
