use complexity_analyzer::metrics::halstead::calculate_halstead_metrics;
use proptest::prelude::*;

proptest! {
    // Property: Vocabulary size should be the sum of unique operators and operands
    #[test]
    fn test_vocabulary_is_sum_of_uniques(s in "\\w+") {
        let metrics = calculate_halstead_metrics(&s);
        prop_assert_eq!(metrics.vocabulary, metrics.n1 + metrics.n2);
    }

    // Property: Program length should be the sum of total operators and operands
    #[test]
    fn test_length_is_sum_of_totals(s in "\\w+") {
        let metrics = calculate_halstead_metrics(&s);
        prop_assert_eq!(metrics.length, metrics.N1 + metrics.N2);
    }

    // Property: Adding repeated operands should increase N2 but not n2
    #[test]
    fn test_repeated_operands(base_operand in "[a-zA-Z]\\w*", n in 2..5usize) {
        // Create a function with repeated operands
        let mut code = format!("fn test() {{ let result = {}", base_operand);
        for _ in 0..n {
            code.push_str(&format!(" + {}", base_operand));
        }
        code.push_str("; }");

        let metrics = calculate_halstead_metrics(&code);

        // Should have at least n+1 total operands (base_operand repeated)
        prop_assert!(metrics.N2 >= (n + 1) as u32,
                   "Expected N2 >= {} but got {}", n + 1, metrics.N2);

        // Should have a single unique operand for the repeated variable
        // (plus potentially others for keywords, etc)
        prop_assert!(metrics.n2 >= 1);

        // Total operands should be greater than unique operands
        prop_assert!(metrics.N2 > metrics.n2);
    }

    // Property: Volume should scale with program length
    #[test]
    fn test_volume_scales_with_length(code1 in r"[a-zA-Z0-9\s]{10,50}",
                                     code2 in r"[a-zA-Z0-9\s]{60,100}") {
        let metrics1 = calculate_halstead_metrics(&code1);
        let metrics2 = calculate_halstead_metrics(&code2);

        if metrics2.length > metrics1.length && metrics2.vocabulary >= metrics1.vocabulary {
            // If program is longer and has same/more vocabulary, volume should be higher
            prop_assert!(metrics2.volume >= metrics1.volume,
                       "Expected volume to scale with length");
        }
    }

    // Property: Difficulty should be proportional to distinct operators and operand usage
    #[test]
    fn test_difficulty_formula(s in r"[a-zA-Z0-9\s\{\}\(\)\+\-\*\/\=]{10,100}") {
        let metrics = calculate_halstead_metrics(&s);

        // Calculate difficulty manually based on the formula
        let expected_difficulty = if metrics.n2 == 0 {
            0.0
        } else {
            (metrics.n1 as f64 / 2.0) * (metrics.N2 as f64 / metrics.n2 as f64)
        };

        // Allow for small floating-point differences
        prop_assert!((metrics.difficulty - expected_difficulty).abs() < 0.0001,
                   "Expected difficulty {} but got {}", expected_difficulty, metrics.difficulty);
    }

    // Property: Effort should be difficulty * volume
    #[test]
    fn test_effort_formula(s in r"[a-zA-Z0-9\s\{\}\(\)\+\-\*\/\=]{10,100}") {
        let metrics = calculate_halstead_metrics(&s);
        let expected_effort = metrics.difficulty * metrics.volume;

        // Allow for small floating-point differences
        prop_assert!((metrics.effort - expected_effort).abs() < 0.0001,
                   "Expected effort {} but got {}", expected_effort, metrics.effort);
    }
}
