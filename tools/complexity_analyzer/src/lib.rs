pub mod function_analysis;
pub mod metrics;
pub mod tokenizer;
pub mod utils;

// Re-export the function_analysis module's analyze_file function
pub use function_analysis::analyze_file;
pub use function_analysis::FileAnalysis;
use std::fs;
use std::path::Path;

pub fn analyze_directory<P: AsRef<Path>>(dir_path: P) -> Vec<FileAnalysis> {
    let mut results = Vec::new();

    let path = dir_path.as_ref();
    if !path.exists() || !path.is_dir() {
        return results;
    }

    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext == "rs" {
                        if let Ok(content) = fs::read_to_string(&path) {
                            let file_path = path.to_string_lossy().to_string();
                            let analysis = analyze_file(&file_path, &content);
                            results.push(analysis);
                        }
                    }
                }
            } else if path.is_dir() {
                // Recursively analyze subdirectories
                let sub_results = analyze_directory(&path);
                results.extend(sub_results);
            }
        }
    }

    results
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use std::io::Write;
    use tempfile::tempdir;

    #[test]
    fn test_analyze_file() {
        let content = r#"
            fn test_function(x: i32) -> i32 {
                if x > 0 {
                    return x;
                }
                return 0;
            }
        "#;

        let analysis = analyze_file("test.rs", content);
        assert_eq!(analysis.functions.len(), 1);
        assert_eq!(analysis.functions[0].name, "test_function");
    }

    #[test]
    fn test_analyze_directory() {
        let dir = tempdir().unwrap();
        let file_path = dir.path().join("test.rs");

        let content = r#"
            fn test_function() {
                println!("Hello, world!");
            }
        "#;

        let mut file = File::create(&file_path).unwrap();
        write!(file, "{}", content).unwrap();

        let results = analyze_directory(dir.path());
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].functions.len(), 1);
        assert_eq!(results[0].functions[0].name, "test_function");
    }
}
