use complexity_analyzer::metrics::cognitive::calculate_cognitive_complexity;
use proptest::prelude::*;

proptest! {
    // Property: Empty content should have zero cognitive complexity
    #[test]
    fn test_empty_string() {
        let complexity = calculate_cognitive_complexity("");
        prop_assert_eq!(complexity, 0);
    }

    // Property: Adding nested if statements should increase complexity exponentially
    #[test]
    fn test_nested_if_statements(depth in 1..4usize) {
        let mut code = String::new();
        let mut closing_braces = String::new();

        // Create nested if statements to specified depth
        for i in 0..depth {
            code.push_str(&format!("if x{} > 0 {{ ", i));
            closing_braces.push('}');
        }

        // Close all braces
        code.push_str(&closing_braces);

        let full_code = format!("fn test() {{ {} }}", code);
        let complexity = calculate_cognitive_complexity(&full_code);

        // Calculate expected complexity based on nesting formula
        // Sum of arithmetic series: n(n+1)/2
        let expected_min = (depth * (depth + 1)) / 2;

        prop_assert!(complexity >= expected_min as u32);
    }

    // Property: Logical operators should always increase complexity
    #[test]
    fn test_logical_operator_complexity(n in 1..5usize) {
        let base = "if x > 0";
        let mut condition = String::from(base);
        for i in 0..n {
            // Alternate between && and ||
            if i % 2 == 0 {
                condition.push_str(&format!(" && y{} < 10", i));
            } else {
                condition.push_str(&format!(" || z{} == 0", i));
            }
        }
        condition.push_str(" { return; }");

        let code = format!("fn test() {{ {} }}", condition);
        let complexity = calculate_cognitive_complexity(&code);

        // Base 1 (if) + n (operators)
        prop_assert!(complexity >= 1 + n as u32);
    }

    // Property: Match statements with n arms should have complexity of at least n+1
    #[test]
    fn test_match_statement_complexity(n in 1..5usize) {
        let mut code = String::from("match x { ");
        for i in 0..n {
            code.push_str(&format!("{} => println!(\"{}\"), ", i, i));
        }
        code.push_str("_ => {} }");

        let full_code = format!("fn test() {{ {} }}", code);
        let complexity = calculate_cognitive_complexity(&full_code);

        // At least the match (1) + n arms
        prop_assert!(complexity >= n as u32 + 1);
    }
}
