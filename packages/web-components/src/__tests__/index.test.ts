import { describe, it, expect } from "vitest";
import { createWebComponentsAnalyzer } from "../analyzer";

describe("@mcp/web-components", () => {
  it("should create a WebComponentsAnalyzer instance", () => {
    const analyzer = createWebComponentsAnalyzer();
    expect(analyzer).toBeDefined();
    expect(typeof analyzer.analyze).toBe("function");
  });

  it("should return a valid analysis result", async () => {
    const analyzer = createWebComponentsAnalyzer();
    const result = await analyzer.analyze("// Test code");

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(Array.isArray(result.components)).toBe(true);
    expect(typeof result.totalComponents).toBe("number");
    expect(typeof result.totalCustomElements).toBe("number");
    expect(typeof result.totalShadowRoots).toBe("number");
    expect(typeof result.totalSlots).toBe("number");
    expect(typeof result.totalEvents).toBe("number");
    expect(typeof result.totalProperties).toBe("number");
    expect(result.performanceMetrics).toBeDefined();
    expect(typeof result.performanceMetrics.constructorTime).toBe("number");
    expect(typeof result.performanceMetrics.renderTime).toBe("number");
    expect(typeof result.performanceMetrics.updateTime).toBe("number");
    expect(typeof result.performanceMetrics.memoryUsage).toBe("number");
  });
});
