use complexity_analyzer::metrics::cognitive::calculate_cognitive_complexity;
use proptest::prelude::*;

proptest! {
    #[test]
    fn test_empty_string(s in "\\s*") {
        // Normalize whitespace to standard spaces
        let normalized = s.replace(|c: char| c.is_whitespace(), " ");
        prop_assert_eq!(calculate_cognitive_complexity(&normalized), 0);
    }

    #[test]
    fn test_nested_if_statements(n in 1..5usize) {
        let mut code = String::from("fn test() {\n");
        for i in 0..n {
            code.push_str(&"    ".repeat(i + 1));
            code.push_str("if condition {\n");
        }
        for i in (0..n).rev() {
            code.push_str(&"    ".repeat(i + 1));
            code.push_str("}\n");
        }
        code.push_str("}\n");

        let complexity = calculate_cognitive_complexity(&code);
        // For n nested ifs, complexity should be at least n + (n-1) + ... + 1 = n(n+1)/2
        let expected_min = (n * (n + 1)) / 2;
        prop_assert!(complexity >= expected_min as u32);
    }

    #[test]
    fn test_logical_operator_complexity(n in 1..10usize) {
        let mut code = String::from("fn test() {\n    if ");
        for i in 0..n {
            if i > 0 {
                code.push_str(" && ");
            }
            code.push_str("condition");
        }
        code.push_str(" {\n    }\n}\n");

        let complexity = calculate_cognitive_complexity(&code);
        // Each logical operator adds at least 1 to complexity
        prop_assert!(complexity >= n as u32);
    }

    #[test]
    fn test_match_statement_complexity(n in 1..10usize) {
        let mut code = String::from("fn test() {\n    match value {\n");
        for i in 0..n {
            code.push_str(&format!("        {} => {{}}\n", i));
        }
        code.push_str("    }\n}\n");

        let complexity = calculate_cognitive_complexity(&code);
        prop_assert!(complexity >= n as u32 + 1);
    }
}
