pub mod cognitive;
pub mod cyclomatic;
pub mod halstead;

// Re-export the main types and functions for convenience
pub use cognitive::calculate_cognitive_complexity;
pub use cyclomatic::calculate_cyclomatic_complexity;
pub use halstead::calculate_halstead_metrics;

use serde::{Deserialize, Serialize};

/// Represents Halstead complexity metrics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HalsteadMetrics {
    pub n1: u32,         // Unique operators
    pub n2: u32,         // Unique operands
    pub N1: u32,         // Total number of operators
    pub N2: u32,         // Total number of operands
    pub vocabulary: u32, // n1 + n2
    pub length: u32,     // N1 + N2
    pub volume: f64,     // Length * log2(vocabulary)
    pub difficulty: f64, // (n1/2) * (N2/n2)
    pub effort: f64,     // Difficulty * Volume
}

impl Default for HalsteadMetrics {
    fn default() -> Self {
        Self {
            n1: 0,
            n2: 0,
            N1: 0,
            N2: 0,
            vocabulary: 0,
            length: 0,
            volume: 0.0,
            difficulty: 0.0,
            effort: 0.0,
        }
    }
}

/// Represents the combined complexity metrics for a function
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComplexityMetrics {
    pub cyclomatic: u32,
    pub cognitive: u32,
    pub halstead: HalsteadMetrics,
    pub loc: u32,
    pub exceeds_threshold: bool,
}

impl Default for ComplexityMetrics {
    fn default() -> Self {
        Self {
            cyclomatic: 0,
            cognitive: 0,
            halstead: HalsteadMetrics::default(),
            loc: 0,
            exceeds_threshold: false,
        }
    }
}
