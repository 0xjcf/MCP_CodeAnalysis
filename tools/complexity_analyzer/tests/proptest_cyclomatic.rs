use complexity_analyzer::metrics::cyclomatic::calculate_cyclomatic_complexity;
use proptest::prelude::*;

proptest! {
    // Property: Cyclomatic complexity should always be at least 1 (base complexity)
    #[test]
    fn test_min_complexity(s in any::<String>()) {
        let complexity = calculate_cyclomatic_complexity(&s);
        prop_assert!(complexity >= 1);
    }

    // Property: Empty string should have complexity of 1
    #[test]
    fn test_empty_string() {
        let complexity = calculate_cyclomatic_complexity("");
        prop_assert_eq!(complexity, 1);
    }

    // Property: Adding if statements should increase complexity
    #[test]
    fn test_adding_if_increases_complexity(
        base in r"[a-zA-Z0-9\s]*",
        n in 1..10usize
    ) {
        let base_code = format!("fn test() {{ {} }}", base);
        let base_complexity = calculate_cyclomatic_complexity(&base_code);

        // Add n if statements
        let mut complex_code = format!("fn test() {{ {} ", base);
        for i in 0..n {
            complex_code.push_str(&format!("if x{} > 0 {{ }} ", i));
        }
        complex_code.push_str("}");

        let complex_complexity = calculate_cyclomatic_complexity(&complex_code);

        // The complexity should increase by at least n (the number of if statements)
        prop_assert!(complex_complexity >= base_complexity + n as u32);
    }

    // Property: A valid Rust function with n if statements should have complexity of at least n+1
    #[test]
    fn test_if_statement_complexity(n in 1..5usize) {
        let mut code = String::from("fn test() { ");
        for i in 0..n {
            code.push_str(&format!("if x{} > 0 {{ return; }} ", i));
        }
        code.push_str("}");

        let complexity = calculate_cyclomatic_complexity(&code);
        prop_assert!(complexity >= n as u32 + 1); // Base 1 + n ifs
    }

    // Property: Logical operators should increase complexity
    #[test]
    fn test_logical_operators_complexity(n in 1..5usize) {
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
        let complexity = calculate_cyclomatic_complexity(&code);

        // Base 1 + 1 (if) + n (operators)
        prop_assert!(complexity >= 1 + 1 + n as u32);
    }
}
