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
    pub n1: u32,         // Number of distinct operators
    pub n2: u32,         // Number of distinct operands
    pub n1_count: u32,   // Total number of operators
    pub n2_count: u32,   // Total number of operands
    pub vocabulary: u32, // Program vocabulary (n1 + n2)
    pub length: u32,     // Program length (N1 + N2)
    pub volume: f64,     // Program volume
    pub difficulty: f64, // Program difficulty
    pub effort: f64,     // Programming effort
}

impl Default for HalsteadMetrics {
    fn default() -> Self {
        Self {
            n1: 0,
            n2: 0,
            n1_count: 0,
            n2_count: 0,
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
