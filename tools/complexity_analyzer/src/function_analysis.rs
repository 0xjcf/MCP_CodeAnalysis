use crate::metrics::{
    calculate_cognitive_complexity, calculate_cyclomatic_complexity, calculate_halstead_metrics,
    ComplexityMetrics, HalsteadMetrics,
};
use crate::tokenizer::{Token, Tokenizer};
use crate::utils::count_lines;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileAnalysis {
    pub file_path: String,
    pub functions: Vec<FunctionAnalysis>,
    pub total_metrics: ComplexityMetrics,
}

impl FileAnalysis {
    pub fn new(file_path: &str) -> Self {
        Self {
            file_path: file_path.to_string(),
            functions: Vec::new(),
            total_metrics: ComplexityMetrics::default(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FunctionAnalysis {
    pub name: String,
    pub line: u32,
    pub loc: u32,
    pub is_public: bool,
    pub is_async: bool,
    pub is_unsafe: bool,
    pub return_type: Option<String>,
    pub complexity: ComplexityMetrics,
}

impl FunctionAnalysis {
    pub fn new(name: &str, line: u32, loc: u32) -> Self {
        Self {
            name: name.to_string(),
            line,
            loc,
            is_public: false,
            is_async: false,
            is_unsafe: false,
            return_type: None,
            complexity: ComplexityMetrics::default(),
        }
    }
}

/// Analyzes a file's content to extract function definitions and calculate their complexity
pub fn analyze_file(file_path: &str, content: &str) -> FileAnalysis {
    let mut file_analysis = FileAnalysis::new(file_path);
    let mut functions = Vec::new();

    // Extract function definitions
    let mut tokenizer = Tokenizer::new(content);
    let mut current_line: u32 = 1;
    let mut is_public = false;
    let mut is_async = false;
    let mut is_unsafe = false;

    while let Some(token) = tokenizer.next_token() {
        match token {
            Token::Keyword(ref k) if k == "pub" => {
                is_public = true;
            }
            Token::Keyword(ref k) if k == "async" => {
                is_async = true;
            }
            Token::Keyword(ref k) if k == "unsafe" => {
                is_unsafe = true;
            }
            Token::Keyword(ref k) if k == "fn" => {
                // Extract function name
                if let Some(Token::Identifier(name)) = tokenizer.next_token() {
                    current_line = tokenizer.current_line as u32;

                    // Extract parameters and return type
                    let mut return_type = None;
                    let mut function_text = String::new();
                    let mut brace_count = 0;
                    let mut found_opening_brace = false;

                    // Capture function signature
                    function_text.push_str("fn ");
                    function_text.push_str(&name);

                    // Capture everything from function name to opening brace
                    while let Some(token) = tokenizer.next_token() {
                        match token {
                            Token::Brace('{') => {
                                brace_count += 1;
                                found_opening_brace = true;
                                function_text.push('{');
                                break;
                            }
                            Token::Operator(ref op) if op == "->" => {
                                // Next token should be the return type
                                function_text.push_str(" -> ");

                                // Look ahead for the return type
                                if let Some(Token::Identifier(rt)) = tokenizer.next_token() {
                                    return_type = Some(rt.clone());
                                    function_text.push_str(&rt);
                                }
                            }
                            _ => {
                                // Add to function text
                                function_text.push_str(&format!("{:?}", token));
                            }
                        }
                    }

                    // Capture function body if opening brace was found
                    if found_opening_brace {
                        while let Some(token) = tokenizer.next_token() {
                            function_text.push_str(&format!("{:?}", token));
                            match token {
                                Token::Brace('{') => {
                                    brace_count += 1;
                                }
                                Token::Brace('}') => {
                                    brace_count -= 1;
                                    if brace_count == 0 {
                                        break;
                                    }
                                }
                                _ => {}
                            }
                        }

                        // Calculate function metrics
                        let loc = count_lines(&function_text);
                        let cyclomatic = calculate_cyclomatic_complexity(&function_text);
                        let cognitive = calculate_cognitive_complexity(&function_text);
                        let halstead = calculate_halstead_metrics(&function_text);

                        let mut fn_analysis = FunctionAnalysis::new(&name, current_line, loc);
                        fn_analysis.is_public = is_public;
                        fn_analysis.is_async = is_async;
                        fn_analysis.is_unsafe = is_unsafe;
                        fn_analysis.return_type = return_type;

                        fn_analysis.complexity = ComplexityMetrics {
                            cyclomatic,
                            cognitive,
                            halstead,
                            loc,
                            exceeds_threshold: cyclomatic > 10 || cognitive > 15,
                        };

                        functions.push(fn_analysis);
                    }

                    // Reset flags
                    is_public = false;
                    is_async = false;
                    is_unsafe = false;
                }
            }
            _ => {}
        }
    }

    file_analysis.functions = functions;

    // Calculate total metrics
    if !file_analysis.functions.is_empty() {
        let mut total_cyclomatic = 0;
        let mut total_cognitive = 0;
        let mut total_loc = 0;
        let mut total_n1 = 0;
        let mut total_n2 = 0;
        let mut total_N1 = 0;
        let mut total_N2 = 0;
        let mut exceeds_threshold = false;

        for function in &file_analysis.functions {
            total_cyclomatic += function.complexity.cyclomatic;
            total_cognitive += function.complexity.cognitive;
            total_loc += function.complexity.loc;
            total_n1 += function.complexity.halstead.n1;
            total_n2 += function.complexity.halstead.n2;
            total_N1 += function.complexity.halstead.N1;
            total_N2 += function.complexity.halstead.N2;

            if function.complexity.exceeds_threshold {
                exceeds_threshold = true;
            }
        }

        let total_vocabulary = total_n1 + total_n2;
        let total_length = total_N1 + total_N2;
        let total_volume = (total_length as f64) * f64::log2(total_vocabulary as f64);
        let total_difficulty = if total_n2 > 0 {
            (total_n1 as f64 / 2.0) * (total_N2 as f64 / total_n2 as f64)
        } else {
            0.0
        };
        let total_effort = total_difficulty * total_volume;

        file_analysis.total_metrics = ComplexityMetrics {
            cyclomatic: total_cyclomatic,
            cognitive: total_cognitive,
            halstead: HalsteadMetrics {
                n1: total_n1,
                n2: total_n2,
                N1: total_N1,
                N2: total_N2,
                vocabulary: total_vocabulary,
                length: total_length,
                volume: total_volume,
                difficulty: total_difficulty,
                effort: total_effort,
            },
            loc: total_loc,
            exceeds_threshold,
        };
    }

    file_analysis
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_analyze_file() {
        let content = r#"
            pub fn test_function(x: i32) -> i32 {
                if x > 0 {
                    return x;
                }
                return 0;
            }
        "#;

        let file_analysis = analyze_file("test.rs", content);

        assert_eq!(file_analysis.functions.len(), 1);
        assert_eq!(file_analysis.functions[0].name, "test_function");
        assert!(file_analysis.functions[0].is_public);
        assert!(file_analysis.functions[0].complexity.cyclomatic > 1);
        assert!(file_analysis.functions[0].complexity.cognitive > 0);
        assert!(file_analysis.functions[0].complexity.halstead.volume > 0.0);

        // Create a new test with only the minimum required code
        let simple_content = "fn simple_fn() -> i32 { 0 }";
        let simple_analysis = analyze_file("simple.rs", simple_content);

        assert_eq!(simple_analysis.functions.len(), 1);
        assert_eq!(
            simple_analysis.functions[0].return_type,
            Some("i32".to_string())
        );
    }
}
