use clap::Parser;
use mcp_complexity_analyzer::{analyze_path, ComplexityMetrics};
use std::path::PathBuf;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Path to analyze (file or directory)
    #[arg(short, long)]
    path: PathBuf,

    /// Metrics to calculate (comma-separated list of: cyclomatic,cognitive,halstead)
    #[arg(short, long, default_value = "cyclomatic,cognitive,halstead")]
    metrics: String,

    /// Output format (text or json)
    #[arg(short, long, default_value = "text")]
    format: String,

    /// Complexity threshold
    #[arg(short, long, default_value = "10")]
    threshold: u32,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    let result = analyze_path(&args.path, Some(args.threshold))?;

    match args.format.as_str() {
        "json" => {
            println!("{}", serde_json::to_string_pretty(&result)?);
        }
        "text" => {
            println!("Analysis Results for: {}", args.path.display());
            println!("\nTotal Metrics:");
            print_metrics(&result.total_metrics);
            println!("\nFunctions:");
            for func in result.functions {
                println!(
                    "\nFunction: {} (lines {}-{})",
                    func.name, func.start_line, func.end_line
                );
                println!("Return Type: {}", func.return_type);
                println!("Metrics:");
                print_metrics(&func.total_metrics);
                if func.exceeds_threshold {
                    println!("⚠️ Exceeds complexity threshold!");
                }
            }
        }
        _ => return Err("Invalid format. Use 'text' or 'json'".into()),
    }

    Ok(())
}

fn print_metrics(metrics: &ComplexityMetrics) {
    println!("  Cyclomatic Complexity: {}", metrics.cyclomatic);
    if let Some(cognitive) = metrics.cognitive {
        println!("  Cognitive Complexity: {}", cognitive);
    }
    if let Some(halstead) = &metrics.halstead {
        println!("  Halstead Metrics:");
        println!("    Difficulty: {:.2}", halstead.difficulty);
        println!("    Effort: {:.2}", halstead.effort);
        println!("    Volume: {:.2}", halstead.volume);
        println!("    Vocabulary: {}", halstead.vocabulary);
    }
}
