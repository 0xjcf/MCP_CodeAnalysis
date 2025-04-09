interface IComplexityResult {
  complexity: {
    cyclomatic: number;
    cognitive: number;
  };
  timestamp: number;
}

export class ComplexityAnalyzer {
  private calculateComplexity(code: string): { cyclomatic: number; cognitive: number } {
    let cyclomatic = 1; // Base complexity
    let cognitive = 0;
    const lines = code.split('\n');

    for (const line of lines) {
      // Skip empty lines and comments
      if (!line.trim() || line.trim().startsWith('//')) {
        continue;
      }

      // Count control structures for cyclomatic complexity
      if (line.match(/\b(if|else|for|while|switch|catch|finally)\b/)) {
        cyclomatic += 1;
      }

      // Count logical operators for cognitive complexity
      if (line.match(/\b(&&|\|\||!)\b/)) {
        cognitive += 1;
      }

      // Count nested blocks for cognitive complexity
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      cognitive += Math.abs(openBraces - closeBraces);

      // Count function declarations for cognitive complexity
      if (line.match(/\b(function|=>)\b/)) {
        cognitive += 1;
      }
    }

    return {
      cyclomatic: Math.min(cyclomatic, 11), // Cap at 11 for cyclomatic complexity
      cognitive: Math.min(cognitive, 50), // Cap at 50 for cognitive complexity
    };
  }

  public analyze(code: string): IComplexityResult {
    const complexity = this.calculateComplexity(code);
    return {
      complexity,
      timestamp: Date.now(),
    };
  }
}
