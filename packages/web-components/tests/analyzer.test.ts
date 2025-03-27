import { describe, it, expect } from "vitest";
import { createWebComponentsAnalyzer } from "../src/analyzer";
import { readFileSync } from "fs";
import { join } from "path";

describe("WebComponentsAnalyzer", () => {
  it("should analyze ignite-element components", async () => {
    const analyzer = createWebComponentsAnalyzer();
    const filePath = join(
      __dirname,
      "../../../test/fixtures/web-components/task-manager/xstateTaskManager.ts"
    );
    const sourceCode = readFileSync(filePath, "utf-8");
    const result = await analyzer.analyze(sourceCode);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.components).toBeDefined();
    expect(result.totalComponents).toBeGreaterThan(0);
    expect(result.totalCustomElements).toBeGreaterThan(0);
    expect(result.totalShadowRoots).toBeGreaterThan(0);
    expect(result.totalSlots).toBeGreaterThan(0);
    expect(result.totalEvents).toBeGreaterThan(0);
    expect(result.totalProperties).toBeGreaterThan(0);
    expect(result.performanceMetrics).toBeDefined();
  });
});
