use clap::Parser;
use complexity_analyzer::{
    analyze_directory,
    function_analysis::{analyze_file, FileAnalysis, FunctionAnalysis},
    metrics::HalsteadMetrics,
};
use serde_json::json;
use std::fs::File;
use std::io::{self, Write};
use std::path::PathBuf;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Args {
    /// Path to the file or directory to analyze
    #[arg(short, long)]
    pub path: PathBuf,

    /// Output format (text or json)
    #[arg(short, long, default_value = "text")]
    pub format: String,

    /// Complexity threshold for highlighting functions
    #[arg(short, long, default_value_t = 10)]
    pub threshold: u32,

    /// Output file path (writes to stdout if not specified)
    #[arg(short = 'o', long)]
    pub output_file: Option<PathBuf>,
}

struct TextFormatter {
    output: String,
}

impl TextFormatter {
    fn new() -> Self {
        Self {
            output: String::new(),
        }
    }

    fn append_halstead_metrics(&mut self, metrics: &HalsteadMetrics) {
        self.output.push_str(&format!(
            "  Halstead Metrics:\n    Difficulty: {:.2}\n    Effort: {:.2}\n    Volume: {:.2}\n    Vocabulary: {}\n",
            metrics.difficulty, metrics.effort, metrics.volume, metrics.vocabulary
        ));
    }

    fn append_function_metrics(&mut self, metrics: &FunctionAnalysis) {
        self.output.push_str(&format!(
            "Function: {}\n  Line: {}\n  LOC: {}\n  Cyclomatic Complexity: {}\n  Cognitive Complexity: {}\n",
            metrics.name,
            metrics.line,
            metrics.loc,
            metrics.complexity.cyclomatic,
            metrics.complexity.cognitive
        ));
        self.append_halstead_metrics(&metrics.complexity.halstead);
        if metrics.complexity.exceeds_threshold {
            self.output.push_str("  WARNING: High complexity!\n");
        }
        self.output.push('\n');
    }

    fn append_file_metrics(&mut self, analysis: &FileAnalysis) {
        self.output
            .push_str(&format!("File: {}\n", analysis.file_path));
        self.output.push_str("Functions:\n");
        for func in &analysis.functions {
            self.append_function_metrics(func);
        }
        self.output.push_str("Total Metrics:\n");
        self.output.push_str(&format!(
            "  Total LOC: {}\n  Total Cyclomatic Complexity: {}\n  Total Cognitive Complexity: {}\n",
            analysis.total_metrics.loc,
            analysis.total_metrics.cyclomatic,
            analysis.total_metrics.cognitive
        ));
        self.append_halstead_metrics(&analysis.total_metrics.halstead);
        self.output.push('\n');
    }

    fn append_directory_summary(&mut self, metrics: &[FileAnalysis]) {
        let total_loc: u32 = metrics.iter().map(|f| f.total_metrics.loc).sum();
        let total_cyclomatic: u32 = metrics.iter().map(|f| f.total_metrics.cyclomatic).sum();
        let total_cognitive: u32 = metrics.iter().map(|f| f.total_metrics.cognitive).sum();
        let total_functions: usize = metrics.iter().map(|f| f.functions.len()).sum();

        self.output.push_str("\nDirectory Summary:\n");
        self.output.push_str(&format!(
            "  Total Files: {}\n  Total Functions: {}\n  Total LOC: {}\n  Total Cyclomatic Complexity: {}\n  Total Cognitive Complexity: {}\n",
            metrics.len(),
            total_functions,
            total_loc,
            total_cyclomatic,
            total_cognitive
        ));
    }

    fn get_output(self) -> String {
        self.output
    }
}

fn format_file_output(
    analysis: &FileAnalysis,
    format: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    match format {
        "json" => Ok(serde_json::to_string_pretty(&json!({
            "path": analysis.file_path,
            "functions": analysis.functions,
            "total_metrics": analysis.total_metrics,
        }))?),
        "text" => {
            let mut formatter = TextFormatter::new();
            formatter.append_file_metrics(analysis);
            Ok(formatter.get_output())
        }
        _ => Err("Unsupported output format".into()),
    }
}

fn format_directory_output(
    metrics: &[FileAnalysis],
    format: &str,
) -> Result<String, Box<dyn std::error::Error>> {
    match format {
        "json" => {
            let results: Vec<_> = metrics
                .iter()
                .map(|analysis| {
                    json!({
                        "path": analysis.file_path,
                        "functions": analysis.functions,
                        "total_metrics": analysis.total_metrics,
                    })
                })
                .collect();
            Ok(serde_json::to_string_pretty(&results)?)
        }
        "text" => {
            let mut formatter = TextFormatter::new();
            for analysis in metrics {
                formatter.append_file_metrics(analysis);
            }
            formatter.append_directory_summary(metrics);
            Ok(formatter.get_output())
        }
        _ => Err("Unsupported output format".into()),
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    let output = if args.path.is_file() {
        let content = std::fs::read_to_string(&args.path)?;
        let analysis = analyze_file(&args.path.to_string_lossy(), &content);
        format_file_output(&analysis, &args.format)?
    } else if args.path.is_dir() {
        let metrics = analyze_directory(&args.path);
        format_directory_output(&metrics, &args.format)?
    } else {
        return Err("Path must be a file or directory".into());
    };

    // Write output to file or stdout based on the output_file option
    match &args.output_file {
        Some(output_path) => {
            let mut file = File::create(output_path)?;
            file.write_all(output.as_bytes())?;
            println!("Analysis results saved to {}", output_path.display());
        }
        None => {
            io::stdout().write_all(output.as_bytes())?;
        }
    }

    Ok(())
}
