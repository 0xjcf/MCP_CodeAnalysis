mod function_analysis;
mod metrics;
mod tokenizer;

pub use function_analysis::FunctionAnalysis;
pub use metrics::{ComplexityMetrics, HalsteadMetrics};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalysisResult {
    pub functions: Vec<FunctionAnalysis>,
    pub total_metrics: ComplexityMetrics,
}

/// Helper struct to accumulate metrics during directory analysis
#[derive(Default)]
struct MetricsAccumulator {
    cyclomatic: u32,
    cognitive: u32,
    difficulty: f64,
    effort: f64,
    volume: f64,
    vocabulary: u32,
}

/// Helper function to process a single file
fn process_file(path: &Path, threshold: Option<u32>) -> Result<AnalysisResult, String> {
    analyze_file(path, threshold)
}

/// Helper function to accumulate metrics from a result
fn accumulate_metrics(acc: &mut MetricsAccumulator, result: &AnalysisResult) {
    acc.cyclomatic += result.total_metrics.cyclomatic;
    if let Some(cognitive) = result.total_metrics.cognitive {
        acc.cognitive += cognitive;
    }
    if let Some(halstead) = &result.total_metrics.halstead {
        acc.difficulty += halstead.difficulty;
        acc.effort += halstead.effort;
        acc.volume += halstead.volume;
        acc.vocabulary += halstead.vocabulary;
    }
}

/// Helper function to check if file is a Rust file
fn is_rust_file(path: &Path) -> bool {
    path.is_file() && path.extension().map_or(false, |ext| ext == "rs")
}

/// Analyzes a single Rust file
pub fn analyze_file(file_path: &Path, threshold: Option<u32>) -> Result<AnalysisResult, String> {
    let content =
        fs::read_to_string(file_path).map_err(|e| format!("Failed to read file: {}", e))?;
    let mut functions = tokenizer::extract_functions(&content);

    // Filter functions based on threshold if provided
    if let Some(threshold) = threshold {
        functions = functions
            .into_iter()
            .filter(|f| f.total_metrics.cyclomatic > threshold)
            .collect();
    }

    let total_metrics = FunctionAnalysis::analyze_content(&content);

    Ok(AnalysisResult {
        functions,
        total_metrics,
    })
}

/// Analyzes a directory containing Rust files
pub fn analyze_directory(
    dir_path: &Path,
    threshold: Option<u32>,
) -> Result<AnalysisResult, String> {
    let mut all_functions = Vec::new();
    let mut metrics = MetricsAccumulator::default();

    for entry in fs::read_dir(dir_path).map_err(|e| format!("Failed to read directory: {}", e))? {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let path = entry.path();

        if is_rust_file(&path) {
            let result = process_file(&path, threshold)?;
            all_functions.extend(result.functions.clone());
            accumulate_metrics(&mut metrics, &result);
        }
    }

    Ok(AnalysisResult {
        functions: all_functions,
        total_metrics: ComplexityMetrics {
            cyclomatic: metrics.cyclomatic,
            cognitive: Some(metrics.cognitive),
            halstead: Some(HalsteadMetrics {
                difficulty: metrics.difficulty,
                effort: metrics.effort,
                volume: metrics.volume,
                vocabulary: metrics.vocabulary,
            }),
        },
    })
}

/// Analyzes a path which can be either a file or directory
pub fn analyze_path(path: &Path, threshold: Option<u32>) -> Result<AnalysisResult, String> {
    if path.is_dir() {
        analyze_directory(path, threshold)
    } else {
        analyze_file(path, threshold)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use std::io::Write;
    use tempfile::tempdir;

    #[test]
    fn test_is_rust_file() {
        let dir = tempdir().unwrap();

        // Test Rust file
        let rust_path = dir.path().join("test.rs");
        File::create(&rust_path).unwrap();
        assert!(is_rust_file(&rust_path));

        // Test non-Rust file
        let other_path = dir.path().join("test.txt");
        File::create(&other_path).unwrap();
        assert!(!is_rust_file(&other_path));

        // Test directory
        assert!(!is_rust_file(dir.path()));
    }

    #[test]
    fn test_metrics_accumulator() {
        let mut acc = MetricsAccumulator::default();
        let result = AnalysisResult {
            functions: vec![],
            total_metrics: ComplexityMetrics {
                cyclomatic: 5,
                cognitive: Some(3),
                halstead: Some(HalsteadMetrics {
                    difficulty: 2.5,
                    effort: 100.0,
                    volume: 40.0,
                    vocabulary: 20,
                }),
            },
        };

        accumulate_metrics(&mut acc, &result);
        assert_eq!(acc.cyclomatic, 5);
        assert_eq!(acc.cognitive, 3);
        assert_eq!(acc.difficulty, 2.5);
        assert_eq!(acc.effort, 100.0);
        assert_eq!(acc.volume, 40.0);
        assert_eq!(acc.vocabulary, 20);

        // Test accumulation of multiple results
        accumulate_metrics(&mut acc, &result);
        assert_eq!(acc.cyclomatic, 10);
        assert_eq!(acc.cognitive, 6);
        assert_eq!(acc.difficulty, 5.0);
        assert_eq!(acc.effort, 200.0);
        assert_eq!(acc.volume, 80.0);
        assert_eq!(acc.vocabulary, 40);
    }

    #[test]
    fn test_process_file() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.rs");
        let mut file = File::create(&file_path).unwrap();

        let test_content = r#"
            fn simple_function() {
                println!("Hello");
            }
        "#;
        file.write_all(test_content.as_bytes()).unwrap();

        // Test without threshold
        let result = process_file(&file_path, None).unwrap();
        assert_eq!(result.functions.len(), 1);
        assert!(result.total_metrics.cyclomatic > 0);

        // Test with threshold (should filter out simple functions)
        let result = process_file(&file_path, Some(5)).unwrap();
        assert_eq!(result.functions.len(), 0);
    }

    #[test]
    fn test_analyze_file() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.rs");
        let mut file = File::create(&file_path).unwrap();

        let test_content = r#"
            fn test_function() {
                println!("Hello");
            }

            pub fn another_function() -> String {
                "World".to_string()
            }
        "#;

        file.write_all(test_content.as_bytes()).unwrap();

        let result = analyze_file(&file_path, None).unwrap();
        assert_eq!(result.functions.len(), 2);
        assert!(result.total_metrics.cyclomatic > 0);
    }

    #[test]
    fn test_analyze_directory() {
        let dir = tempdir().unwrap();

        // Create first test file
        let file1_path = dir.path().join("test1.rs");
        let mut file1 = File::create(&file1_path).unwrap();
        file1
            .write_all(b"fn test1() { println!(\"test1\"); }")
            .unwrap();

        // Create second test file
        let file2_path = dir.path().join("test2.rs");
        let mut file2 = File::create(&file2_path).unwrap();
        file2
            .write_all(b"fn test2() { if true { println!(\"test2\"); } }")
            .unwrap();

        let result = analyze_directory(dir.path(), None).unwrap();
        assert!(result.functions.len() >= 2);
        assert!(result.total_metrics.cyclomatic > 1);
    }
}
