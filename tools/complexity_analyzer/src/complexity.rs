use crate::tokenizer::{Token, Tokenizer};
use std::collections::HashMap;

/// Calculates the cyclomatic complexity of a piece of code.
///
/// Cyclomatic complexity measures the number of linearly independent paths through a program.
/// It is calculated by counting control flow structures and logical operators.
///
/// Example:
/// ```
/// use mcp_complexity_analyzer::complexity::calculate_cyclomatic_complexity;
///
/// let code = r#"
///     fn main() {
///         if x > 0 {
///             return true;
///         }
///         return false;
///     }
/// "#;
///
/// let complexity = calculate_cyclomatic_complexity(code);
/// assert_eq!(complexity, 2); // 1 base + 1 if
/// ```
pub fn calculate_cyclomatic_complexity(content: &str) -> u32 {
    let mut complexity = 1; // Base complexity
    let mut tokenizer = Tokenizer::new(content);
    let control_keywords = ["if", "while", "for", "match"];
    let control_operators = ["&&", "||"];

    while let Some(token) = tokenizer.next_token() {
        match token {
            Token::Keyword(kw) if control_keywords.contains(&kw.as_str()) => {
                complexity += 1;
            }
            Token::Operator(op) if control_operators.contains(&op.as_str()) => {
                complexity += 1;
            }
            _ => {}
        }
    }

    complexity
}

/// Calculates the cognitive complexity of a piece of code.
///
/// Cognitive complexity measures how difficult code is to understand.
/// It considers nesting levels and control flow structures.
///
/// Example:
/// ```
/// use mcp_complexity_analyzer::complexity::calculate_cognitive_complexity;
///
/// let code = r#"
///     fn main() {
///         if x > 0 {
///             while y < 10 {
///                 if z == 5 {
///                     return true;
///                 }
///             }
///         }
///         return false;
///     }
/// "#;
///
/// let complexity = calculate_cognitive_complexity(code);
/// assert_eq!(complexity, 6); // 1 + 2 + 3 (nesting levels)
/// ```
pub fn calculate_cognitive_complexity(content: &str) -> u32 {
    let mut complexity = 0;
    let mut nesting_level = 0;
    let mut tokenizer = Tokenizer::new(content);
    let control_keywords = ["if", "for", "while", "match"];

    while let Some(token) = tokenizer.next_token() {
        match token {
            Token::Keyword(kw) if control_keywords.contains(&kw.as_str()) => {
                complexity += 1 + nesting_level;
                nesting_level += 1;
            }
            Token::Brace('}') => {
                if nesting_level > 0 {
                    nesting_level -= 1;
                }
            }
            _ => {}
        }
    }

    complexity
}

/// Calculates Halstead metrics for a piece of code.
///
/// Halstead metrics measure program complexity based on the number of operators
/// and operands in the code. They include:
/// - Difficulty: How hard the code is to understand
/// - Effort: How much effort is required to understand the code
/// - Volume: The size of the program
/// - Vocabulary: The number of unique operators and operands
///
/// Example:
/// ```
/// use mcp_complexity_analyzer::complexity::calculate_halstead_metrics;
///
/// let code = r#"
///     fn add(a: i32, b: i32) -> i32 {
///         let result = a + b;
///         return result;
///     }
/// "#;
///
/// let metrics = calculate_halstead_metrics(code);
/// assert!(metrics.difficulty > 0.0);
/// assert!(metrics.effort > 0.0);
/// assert!(metrics.volume > 0.0);
/// assert!(metrics.vocabulary > 0);
/// ```
pub fn calculate_halstead_metrics(content: &str) -> crate::HalsteadMetrics {
    let mut tokenizer = Tokenizer::new(content);
    let mut operators = HashMap::new();
    let mut operands = HashMap::new();
    let operator_set = [
        "+", "-", "*", "/", "=", "==", "!=", "<", ">", "<=", ">=", "&&", "||", "?", "??",
    ];

    while let Some(token) = tokenizer.next_token() {
        match token {
            Token::Operator(op) if operator_set.contains(&op.as_str()) => {
                *operators.entry(op).or_insert(0) += 1;
            }
            Token::Identifier(id) => {
                *operands.entry(id).or_insert(0) += 1;
            }
            _ => {}
        }
    }

    let n1 = operators.len() as f64; // Unique operators
    let n2 = operands.len() as f64; // Unique operands
    let total_ops: f64 = operators.values().sum::<i32>() as f64;
    let total_operands: f64 = operands.values().sum::<i32>() as f64;

    let n = n1 + n2;
    let total = total_ops + total_operands;
    let volume = total * n.log2();
    let difficulty = (n1 / 2.0) * (total_operands / n2);
    let effort = difficulty * volume;

    crate::HalsteadMetrics {
        difficulty,
        effort,
        volume,
        vocabulary: n as u32,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cyclomatic_complexity() {
        let content = r#"
            fn main() {
                if x > 0 {
                    while y < 10 {
                        if z == 5 {
                            return true;
                        }
                    }
                }
                return false;
            }
        "#;

        let complexity = calculate_cyclomatic_complexity(content);
        assert_eq!(complexity, 4); // 1 base + 2 if + 1 while
    }

    #[test]
    fn test_cognitive_complexity() {
        let content = r#"
            fn main() {
                if x > 0 {
                    while y < 10 {
                        if z == 5 {
                            return true;
                        }
                    }
                }
                return false;
            }
        "#;

        let complexity = calculate_cognitive_complexity(content);
        assert_eq!(complexity, 6); // 1 + 2 + 3 (nesting levels)
    }

    #[test]
    fn test_halstead_metrics() {
        let content = r#"
            fn add(a: i32, b: i32) -> i32 {
                let result = a + b;
                return result;
            }
        "#;

        let metrics = calculate_halstead_metrics(content);
        assert!(metrics.difficulty > 0.0);
        assert!(metrics.effort > 0.0);
        assert!(metrics.volume > 0.0);
        assert!(metrics.vocabulary > 0);
    }
}
