use complexity_analyzer::metrics::cyclomatic::calculate_cyclomatic_complexity;
use proptest::prelude::*;

proptest! {
    #[test]
    fn test_min_complexity(s in "[a-zA-Z0-9_ \t\n]*") {
        prop_assert!(calculate_cyclomatic_complexity(&s) >= 1);
    }

    #[test]
    fn test_empty_string(s in "[ \t\n]*") {
        // Normalize whitespace to standard spaces
        let normalized = s.replace(|c: char| c.is_whitespace(), " ");
        prop_assert_eq!(calculate_cyclomatic_complexity(&normalized), 1);
    }

    #[test]
    fn test_adding_if_increases_complexity(n in 1..10usize) {
        let mut code = String::from("fn test() {\n");
        for _ in 0..n {
            code.push_str("    if condition {\n    }\n");
        }
        code.push_str("}\n");

        let complexity = calculate_cyclomatic_complexity(&code);
        prop_assert!(complexity >= n as u32 + 1);
    }

    #[test]
    fn test_if_statement_complexity(n in 1..10usize) {
        let mut code = String::from("fn test() {\n");
        for i in 0..n {
            code.push_str(&format!("    if condition{} {{\n    }}\n", i));
        }
        code.push_str("}\n");

        let complexity = calculate_cyclomatic_complexity(&code);
        prop_assert!(complexity >= n as u32 + 1);
    }

    #[test]
    fn test_logical_operators_complexity(n in 1..10usize) {
        let mut code = String::from("fn test() {\n    if ");
        for i in 0..n {
            if i > 0 {
                code.push_str(" && ");
            }
            code.push_str("condition");
        }
        code.push_str(" {\n    }\n}\n");

        let complexity = calculate_cyclomatic_complexity(&code);
        prop_assert!(complexity >= n as u32 + 1);
    }
}
