use crate::metrics::{
    calculate_cognitive_complexity, calculate_cyclomatic_complexity, calculate_halstead_metrics,
    ComplexityMetrics, HalsteadMetrics,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FunctionAnalysis {
    pub name: String,
    pub start_line: usize,
    pub end_line: usize,
    pub return_type: String,
    pub cyclomatic: u32,
    pub cognitive: Option<u32>,
    pub halstead: Option<HalsteadMetrics>,
    pub exceeds_threshold: bool,
    pub total_metrics: ComplexityMetrics,
}

impl FunctionAnalysis {
    pub fn new(
        name: String,
        start_line: usize,
        end_line: usize,
        return_type: String,
        content: &str,
    ) -> Self {
        let cyclomatic = calculate_cyclomatic_complexity(content);
        let cognitive = Some(calculate_cognitive_complexity(content));
        let halstead = Some(calculate_halstead_metrics(content));

        Self {
            name,
            start_line,
            end_line,
            return_type,
            cyclomatic,
            cognitive: cognitive.clone(),
            halstead: halstead.clone(),
            exceeds_threshold: cyclomatic > 10,
            total_metrics: ComplexityMetrics {
                cyclomatic,
                cognitive,
                halstead,
            },
        }
    }

    pub fn analyze_content(content: &str) -> ComplexityMetrics {
        let cyclomatic = calculate_cyclomatic_complexity(content);
        let cognitive = Some(calculate_cognitive_complexity(content));
        let halstead = Some(calculate_halstead_metrics(content));

        ComplexityMetrics {
            cyclomatic,
            cognitive,
            halstead,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_function_analysis() {
        let test_func = r#"
            fn test_function() {
                if true {
                    println!("Hello");
                } else {
                    println!("World");
                }
            }
        "#;

        let analysis = FunctionAnalysis::new(
            "test_function".to_string(),
            1,
            8,
            "()".to_string(),
            test_func,
        );

        assert!(analysis.cyclomatic > 1);
        assert!(analysis.cognitive.unwrap() > 0);
        assert!(analysis.halstead.is_some());
    }
}
