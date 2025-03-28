use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct HalsteadMetrics {
    pub difficulty: f64,
    pub effort: f64,
    pub volume: f64,
    pub vocabulary: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ComplexityMetrics {
    pub cyclomatic: u32,
    pub cognitive: Option<u32>,
    pub halstead: Option<HalsteadMetrics>,
}

/// Counts occurrences of a pattern in the content
fn count_pattern_matches(content: &str, pattern: &str) -> u32 {
    Regex::new(pattern).unwrap().find_iter(content).count() as u32
}

/// Counts control structures in the content
fn count_control_structures(content: &str) -> u32 {
    let patterns = [
        r"if\s*[^;{]*[;{]",
        r"else\s*[^;{]*[;{]",
        r"for\s*[^;{]*[;{]",
        r"while\s*[^;{]*[;{]",
        r"loop\s*[^;{]*[;{]",
        r"match\s*[^;{]*[;{]",
    ];

    patterns
        .iter()
        .map(|&pattern| count_pattern_matches(content, pattern))
        .sum()
}

/// Counts logical operators in the content
fn count_logical_operators(content: &str) -> u32 {
    let patterns = [r"&&", r"\|\|"];
    patterns
        .iter()
        .map(|&pattern| count_pattern_matches(content, pattern))
        .sum()
}

/// Counts catch blocks in the content
fn count_catch_blocks(content: &str) -> u32 {
    count_pattern_matches(content, r"catch\s*[^;{]*[;{]")
}

/// Counts question operators in the content
fn count_question_operators(content: &str) -> u32 {
    count_pattern_matches(content, r"\?")
}

/// Calculates cyclomatic complexity of the code
pub fn calculate_cyclomatic_complexity(content: &str) -> u32 {
    let mut complexity = 1; // Base complexity

    complexity += count_control_structures(content);
    complexity += count_logical_operators(content);
    complexity += count_catch_blocks(content);
    complexity += count_question_operators(content);

    complexity
}

/// Struct to manage cognitive complexity calculation state
struct CognitiveComplexityCalculator {
    complexity: u32,
    nesting_level: u32,
}

impl CognitiveComplexityCalculator {
    fn new() -> Self {
        Self {
            complexity: 0,
            nesting_level: 0,
        }
    }

    fn process_line(&mut self, line: &str) {
        let line = line.trim();

        // Handle control structures before updating nesting level
        if self.is_control_structure(line) {
            self.handle_control_structure(line);
        }

        // Update nesting level
        self.update_nesting_level(line);
    }

    fn is_control_structure(&self, line: &str) -> bool {
        line.starts_with("if")
            || line.starts_with("else")
            || line.starts_with("for")
            || line.starts_with("while")
            || line.starts_with("match")
            || line.starts_with("loop")
    }

    fn handle_control_structure(&mut self, line: &str) {
        // Base complexity for control structure
        self.complexity += 1;

        // Additional complexity for nesting
        if !line.starts_with("else") {
            self.complexity += self.nesting_level;
        }

        // Extra complexity for else branches
        if line.starts_with("else") {
            self.complexity += 1;
        }
    }

    fn update_nesting_level(&mut self, line: &str) {
        if line.contains('{') {
            self.nesting_level += 1;
        }
        if line.contains('}') {
            self.nesting_level = self.nesting_level.saturating_sub(1);
        }
    }
}

pub fn calculate_cognitive_complexity(content: &str) -> u32 {
    let mut calculator = CognitiveComplexityCalculator::new();

    for line in content.lines() {
        calculator.process_line(line);
    }

    calculator.complexity
}

/// Struct to manage Halstead metrics calculation
struct HalsteadCalculator {
    operators: std::collections::HashSet<String>,
    operands: std::collections::HashSet<String>,
    total_operators: u32,
    total_operands: u32,
}

impl HalsteadCalculator {
    fn new() -> Self {
        Self {
            operators: std::collections::HashSet::new(),
            operands: std::collections::HashSet::new(),
            total_operators: 0,
            total_operands: 0,
        }
    }

    fn process_token(&mut self, token: &str) {
        if self.is_operator(token) {
            self.operators.insert(token.to_string());
            self.total_operators += 1;
        } else if self.is_operand(token) {
            self.operands.insert(token.to_string());
            self.total_operands += 1;
        }
    }

    fn is_operator(&self, token: &str) -> bool {
        matches!(
            token,
            "+" | "-"
                | "*"
                | "/"
                | "="
                | "=="
                | "!="
                | "<"
                | ">"
                | "<="
                | ">="
                | "&&"
                | "||"
                | "!"
                | "&"
                | "|"
                | "^"
                | "~"
                | "<<"
                | ">>"
                | "+="
                | "-="
                | "*="
                | "/="
                | "%="
                | "&="
                | "|="
                | "^="
                | "<<="
                | ">>="
        )
    }

    fn is_operand(&self, token: &str) -> bool {
        token.chars().all(|c| c.is_alphanumeric() || c == '_')
    }

    fn calculate_metrics(&self) -> HalsteadMetrics {
        let n1 = self.operators.len() as f64;
        let n2 = self.operands.len() as f64;
        let n1_total = self.total_operators as f64;
        let n2_total = self.total_operands as f64;

        let n = n1 + n2;
        let total = n1_total + n2_total;
        let volume = if n > 0.0 { total * n.log2() } else { 0.0 };
        let difficulty = if n2 > 0.0 {
            (n1 / 2.0) * (n2_total / n2)
        } else {
            0.0
        };
        let effort = difficulty * volume;

        HalsteadMetrics {
            difficulty,
            effort,
            volume,
            vocabulary: n as u32,
        }
    }
}

pub fn calculate_halstead_metrics(content: &str) -> HalsteadMetrics {
    let mut calculator = HalsteadCalculator::new();

    // Simple tokenization
    for token in content.split_whitespace() {
        calculator.process_token(token);
    }

    calculator.calculate_metrics()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pattern_matching() {
        let content = "if true { while false { } }";
        assert_eq!(count_pattern_matches(content, r"if\s*[^;{]*[;{]"), 1);
        assert_eq!(count_pattern_matches(content, r"while\s*[^;{]*[;{]"), 1);
    }

    #[test]
    fn test_control_structures() {
        let content = r#"
            if condition {
                while true {
                    for item in items {
                        loop {
                            match value {
                                _ => {}
                            }
                        }
                    }
                }
            } else {
                println!("else branch");
            }
        "#;

        let count = count_control_structures(content);
        assert_eq!(count, 7); // if, else, while, for, loop, match, else
    }

    #[test]
    fn test_logical_operators() {
        let content = "if a && b || c && d { }";
        let count = count_logical_operators(content);
        assert_eq!(count, 3); // &&, ||, &&
    }

    #[test]
    fn test_cognitive_complexity_calculator() {
        let mut calc = CognitiveComplexityCalculator::new();

        // Test simple control structure
        calc.process_line("if condition {");
        assert_eq!(calc.complexity, 1); // +1 for if
        assert_eq!(calc.nesting_level, 1);

        // Test nested control structure (nesting_level is now 1)
        calc.process_line("    while true {");
        assert_eq!(calc.complexity, 3); // +1 for while, +1 for nesting
        assert_eq!(calc.nesting_level, 2);

        // Test else branch (after closing previous blocks)
        calc.process_line("    }"); // nesting level -> 1
        calc.process_line("} else {"); // nesting level stays 1
        assert_eq!(calc.complexity, 3); // no change for else at same level
        assert_eq!(calc.nesting_level, 1);

        // Test nesting level tracking
        calc.process_line("}");
        assert_eq!(calc.nesting_level, 0);
    }

    #[test]
    fn test_halstead_calculator() {
        let mut calc = HalsteadCalculator::new();

        // Test operator detection
        assert!(calc.is_operator("+"));
        assert!(calc.is_operator("=="));
        assert!(calc.is_operator("&&"));
        assert!(!calc.is_operator("abc"));

        // Test operand detection
        assert!(calc.is_operand("variable_name"));
        assert!(calc.is_operand("x123"));
        assert!(!calc.is_operand("+"));

        // Test token processing
        calc.process_token("+");
        calc.process_token("variable1");
        calc.process_token("=");
        calc.process_token("variable2");

        assert_eq!(calc.operators.len(), 2); // +, =
        assert_eq!(calc.operands.len(), 2); // variable1, variable2
        assert_eq!(calc.total_operators, 2);
        assert_eq!(calc.total_operands, 2);

        // Test metrics calculation
        let metrics = calc.calculate_metrics();
        assert!(metrics.difficulty > 0.0);
        assert!(metrics.effort > 0.0);
        assert!(metrics.volume > 0.0);
        assert_eq!(metrics.vocabulary, 4); // 2 operators + 2 operands
    }

    #[test]
    fn test_cyclomatic_complexity() {
        let simple_code = "fn simple() { println!(\"Hello\"); }";
        assert_eq!(calculate_cyclomatic_complexity(simple_code), 1);

        let complex_code = r#"
            fn complex() {
                if a && b {
                    while true {
                        if x || y {
                            println!("nested");
                        }
                    }
                }
            }
        "#;
        assert_eq!(calculate_cyclomatic_complexity(complex_code), 6); // 1 (base) + 1(if) + 1(&&) + 1(while) + 1(if) + 1(||)
    }

    #[test]
    fn test_cognitive_complexity() {
        let simple_code = "fn simple() { println!(\"Hello\"); }";
        assert_eq!(calculate_cognitive_complexity(simple_code), 0);

        let complex_code = r#"
            fn complex() {
                if condition1 {          // +1
                    if condition2 {      // +2 (nested)
                        println!("nested");
                    } else {            // +1
                        while true {    // +3 (nested at level 2)
                            println!("loop");
                        }
                    }
                }
            }
        "#;
        assert_eq!(calculate_cognitive_complexity(complex_code), 9); // 1 + 2 + 1 + 3 = 9
    }

    #[test]
    fn test_halstead_metrics() {
        let simple_code = "x = a + b";
        let metrics = calculate_halstead_metrics(simple_code);
        assert!(metrics.difficulty > 0.0);
        assert!(metrics.effort > 0.0);
        assert!(metrics.volume > 0.0);
        assert!(metrics.vocabulary > 0);

        let complex_code = r#"
            result = (a + b) * (c - d);
            if result > threshold {
                output = result * multiplier;
            }
        "#;
        let metrics = calculate_halstead_metrics(complex_code);
        assert!(metrics.difficulty > 0.0);
        assert!(metrics.effort > 0.0);
        assert!(metrics.volume > 0.0);
        assert!(metrics.vocabulary > 0);
    }
}
