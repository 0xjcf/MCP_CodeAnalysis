use complexity_analyzer::metrics::halstead::calculate_halstead_metrics;
use proptest::prelude::*;

proptest! {
    #[test]
    fn prop_vocabulary_size(n in 1..10usize) {
        let mut code = String::from("fn test() {\n");
        for i in 0..n {
            code.push_str(&format!("    let x{} = 1;\n", i));
        }
        code.push_str("}\n");

        let metrics = calculate_halstead_metrics(&code);
        prop_assert!(metrics.n1 + metrics.n2 >= n as u32 * 2);
    }

    #[test]
    fn prop_program_length(n in 1..10usize) {
        let mut code = String::from("fn test() {\n");
        for i in 0..n {
            code.push_str(&format!("    let x{} = 1;\n", i));
        }
        code.push_str("}\n");

        let metrics = calculate_halstead_metrics(&code);
        prop_assert!(metrics.length >= n as u32 * 2);
    }

    #[test]
    fn prop_repeated_operands(n in 1..10usize) {
        let mut code = String::from("fn test() {\n");
        for i in 0..n {
            code.push_str(&format!("    let x{} = 1;\n", i));
        }
        code.push_str("}\n");

        let metrics = calculate_halstead_metrics(&code);
        prop_assert!(metrics.n2_count >= n as u32);
    }

    #[test]
    fn prop_volume_scaling(n in 1..10usize) {
        let mut code = String::from("fn test() {\n");
        for i in 0..n {
            code.push_str(&format!("    let x{} = 1;\n", i));
        }
        code.push_str("}\n");

        let metrics = calculate_halstead_metrics(&code);
        prop_assert!(metrics.volume >= n as f64 * 2.0);
    }

    #[test]
    fn prop_difficulty_formula(n in 1..10usize) {
        let mut code = String::from("fn test() {\n");
        for i in 0..n {
            code.push_str(&format!("    let x{} = 1;\n", i));
        }
        code.push_str("}\n");

        let metrics = calculate_halstead_metrics(&code);
        prop_assert!(metrics.difficulty >= 1.0);
    }

    #[test]
    fn prop_effort_formula(n in 1..10usize) {
        let mut code = String::from("fn test() {\n");
        for i in 0..n {
            code.push_str(&format!("    let x{} = 1;\n", i));
        }
        code.push_str("}\n");

        let metrics = calculate_halstead_metrics(&code);
        prop_assert!(metrics.effort >= n as f64 * 2.0);
    }
}
