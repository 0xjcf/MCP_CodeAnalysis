/**
 * Basic tests for the Web Components Analyzer
 * Tests core functionality and basic component analysis
 */

import { WebComponentsAnalyzer } from "./analyzer";
import { LitElement } from "lit";
import { html } from "lit-html";
import { expect, describe, it, beforeEach } from "@jest/globals";

// MEMORY_ANCHOR: {test} test_component_definition
/**
 * Test component for analyzer testing
 */
class TestComponent extends LitElement {
  static properties = {
    name: { type: String },
    count: { type: Number },
  };

  private _name: string = "";
  private _count: number = 0;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div>
        <h1>${this.name}</h1>
        <p>Count: ${this.count}</p>
        <button @click=${this.increment}>Increment</button>
      </div>
    `;
  }

  private increment() {
    this.count++;
  }
}

// MEMORY_ANCHOR: {test} analyzer_initialization_test
describe("WebComponentsAnalyzer", () => {
  let analyzer: WebComponentsAnalyzer;

  beforeEach(() => {
    analyzer = new WebComponentsAnalyzer();
  });

  // MEMORY_ANCHOR: {test} component_analysis_test
  it("should analyze a basic component", async () => {
    const component = new TestComponent();
    const result = await analyzer.analyzeComponent(component);

    expect(result.type).toBe("web-component");
    expect(result.complexity).toBe("medium");
    expect(Array.isArray(result.dependencies)).toBe(true);
    expect(Array.isArray(result.issues)).toBe(true);
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  // MEMORY_ANCHOR: {test} shadow_dom_analysis_test
  test("should analyze shadow DOM usage", async () => {
    const component = new TestComponent();
    const result = await analyzer.analyzeComponent(component);

    // Shadow DOM analysis should be included in the result
    expect(
      result.issues.some(
        (issue) => issue.type === "info" && issue.message.includes("shadow DOM")
      )
    ).toBe(true);
  });

  // MEMORY_ANCHOR: {test} property_analysis_test
  test("should analyze component properties", async () => {
    const component = new TestComponent();
    const result = await analyzer.analyzeComponent(component);

    // Property analysis should be included in the result
    expect(
      result.issues.some(
        (issue) => issue.type === "info" && issue.message.includes("property")
      )
    ).toBe(true);
  });

  // MEMORY_ANCHOR: {test} event_analysis_test
  test("should analyze event handlers", async () => {
    const component = new TestComponent();
    const result = await analyzer.analyzeComponent(component);

    // Event analysis should be included in the result
    expect(
      result.issues.some(
        (issue) => issue.type === "info" && issue.message.includes("event")
      )
    ).toBe(true);
  });

  // MEMORY_ANCHOR: {test} performance_analysis_test
  test("should analyze performance characteristics", async () => {
    const component = new TestComponent();
    const result = await analyzer.analyzeComponent(component);

    // Performance analysis should be included in the result
    expect(
      result.issues.some(
        (issue) =>
          issue.type === "info" && issue.message.includes("performance")
      )
    ).toBe(true);
  });

  // MEMORY_ANCHOR: {test} accessibility_analysis_test
  test("should analyze accessibility features", async () => {
    const component = new TestComponent();
    const result = await analyzer.analyzeComponent(component);

    // Accessibility analysis should be included in the result
    expect(
      result.issues.some(
        (issue) =>
          issue.type === "info" && issue.message.includes("accessibility")
      )
    ).toBe(true);
  });
});
