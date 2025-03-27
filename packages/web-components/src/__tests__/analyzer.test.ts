import { describe, it, expect } from "vitest";
import { createWebComponentsAnalyzer } from "../analyzer";
import { readFileSync } from "fs";
import { join } from "path";

describe("WebComponentsAnalyzer", () => {
  const analyzer = createWebComponentsAnalyzer();

  it("should analyze ignite-element components", async () => {
    const sourceCode = readFileSync(
      join(
        __dirname,
        "../../../test/fixtures/web-components/task-manager/xstateTaskManager.ts"
      ),
      "utf-8"
    );

    const result = await analyzer.analyze(sourceCode);

    expect(result.success).toBe(true);
    expect(result.components.length).toBe(5); // TaskList, ProgressBar, TaskForm, ConfettiEffect, TaskManager
    expect(result.totalComponents).toBe(5);
    expect(result.totalCustomElements).toBe(5);
    expect(result.totalEvents).toBeGreaterThan(0);
    expect(result.totalProperties).toBeGreaterThan(0);

    // Check TaskList component
    const taskList = result.components.find((c) => c.tagName === "task-list");
    expect(taskList).toBeDefined();
    expect(taskList?.events.length).toBeGreaterThan(0);
    expect(taskList?.properties.length).toBeGreaterThan(0);

    // Check ProgressBar component
    const progressBar = result.components.find(
      (c) => c.tagName === "progress-bar"
    );
    expect(progressBar).toBeDefined();
    expect(progressBar?.events.length).toBe(0);
    expect(progressBar?.properties.length).toBeGreaterThan(0);

    // Check TaskForm component
    const taskForm = result.components.find((c) => c.tagName === "task-form");
    expect(taskForm).toBeDefined();
    expect(taskForm?.events.length).toBeGreaterThan(0);
    expect(taskForm?.properties.length).toBeGreaterThan(0);
  });
});
