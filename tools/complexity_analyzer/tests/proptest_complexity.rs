use complexity_analyzer::metrics::{
    calculate_cognitive_complexity, calculate_cyclomatic_complexity,
};
use proptest::prelude::*;

proptest! {
    #[test]
    fn test_recursive_function_complexity(n in 1..10usize) {
        let mut code = String::from("fn recursive(n: u32) -> u32 {\n");
        for i in 0..n {
            code.push_str(&format!("    if n == {} {{\n        return {};\n    }}\n", i, i));
        }
        code.push_str("    recursive(n - 1)\n}\n");

        let cognitive = calculate_cognitive_complexity(&code);
        let cyclomatic = calculate_cyclomatic_complexity(&code);

        // Each if statement adds to both complexities
        prop_assert!(cognitive >= n as u32);
        prop_assert!(cyclomatic >= n as u32 + 1); // Base + n conditions
    }

    #[test]
    fn test_nested_async_patterns(n in 1..5usize) {
        let mut code = String::from("async fn process() -> Result<(), Error> {\n");
        for i in 0..n {
            code.push_str(&format!(
                "    if let Ok(data{}) = fetch_data{}().await {{\n",
                i, i
            ));
        }
        for _ in 0..n {
            code.push_str("    }\n");
        }
        code.push_str("    Err(Error::Failed)\n}\n");

        let cognitive = calculate_cognitive_complexity(&code);
        let cyclomatic = calculate_cyclomatic_complexity(&code);

        // Each if let adds to both complexities
        prop_assert!(cognitive >= n as u32);
        prop_assert!(cyclomatic >= n as u32 + 1);
    }

    #[test]
    fn test_complex_pattern_matching(n in 1..5usize) {
        let mut code = String::from("fn process(value: Value) -> Result<(), Error> {\n    match value {\n");
        for i in 0..n {
            code.push_str(&format!(
                "        Value::Variant{} if condition{} => {{\n            if nested{} {{\n                return Ok(());\n            }}\n            Err(Error::Failed)\n        }}\n",
                i, i, i
            ));
        }
        code.push_str("        _ => Err(Error::Invalid)\n    }\n}\n");

        let cognitive = calculate_cognitive_complexity(&code);
        let cyclomatic = calculate_cyclomatic_complexity(&code);

        // Each match arm with guard and nested if adds to complexity
        prop_assert!(cognitive >= (n * 2) as u32); // 1 for match + 1 for each guard + 1 for each nested if
        prop_assert!(cyclomatic >= (n * 2 + 1) as u32); // Base + n guards + n nested ifs
    }

    #[test]
    fn test_complex_generic_constraints(n in 1..5usize) {
        let mut code = String::from("fn process<T: Display + Debug>(value: T) -> Result<(), Error>\nwhere T: Clone {\n");
        for i in 0..n {
            code.push_str(&format!(
                "    if value.to_string().len() > {} {{\n        return Err(Error::TooLong);\n    }}\n",
                i
            ));
        }
        code.push_str("    Ok(())\n}\n");

        let cognitive = calculate_cognitive_complexity(&code);
        let cyclomatic = calculate_cyclomatic_complexity(&code);

        // Each condition adds to both complexities
        prop_assert!(cognitive >= n as u32);
        prop_assert!(cyclomatic >= n as u32 + 1);
    }

    #[test]
    fn test_complex_closure_patterns(n in 1..5usize) {
        let mut code = String::from("fn create_processor() -> impl Fn(&str) -> Result<(), Error> {\n    |input: &str| {\n");
        for i in 0..n {
            code.push_str(&format!(
                "        if input.len() > {} {{\n            return Err(Error::TooLong);\n        }}\n",
                i
            ));
        }
        code.push_str("        Ok(())\n    }\n}\n");

        let cognitive = calculate_cognitive_complexity(&code);
        let cyclomatic = calculate_cyclomatic_complexity(&code);

        // Each condition in closure adds to both complexities
        prop_assert!(cognitive >= n as u32);
        prop_assert!(cyclomatic >= n as u32 + 1);
    }

    #[test]
    fn test_complex_macro_variants(n in 1..5usize) {
        let mut code = String::from("macro_rules! process {\n");
        for i in 0..n {
            code.push_str(&format!(
                "    (${}:expr) => {{\n        if ${}.is_empty() {{\n            return Err(Error::Empty);\n        }}\n        Ok(())\n    }};\n",
                i, i
            ));
        }
        code.push_str("}\n");

        let cognitive = calculate_cognitive_complexity(&code);
        let cyclomatic = calculate_cyclomatic_complexity(&code);

        // Each macro variant adds to complexity
        prop_assert!(cognitive >= n as u32);
        prop_assert!(cyclomatic >= n as u32 + 1);
    }

    #[test]
    fn test_complex_trait_methods(n in 1..5usize) {
        let mut code = String::from("trait ComplexTrait {\n    fn process(&self) -> Result<(), Error> {\n");
        for i in 0..n {
            code.push_str(&format!(
                "        if self.check_condition{}() {{\n            if self.validate{}() {{\n                return Ok(());\n            }}\n        }}\n",
                i, i
            ));
        }
        code.push_str("        Err(Error::Failed)\n    }\n}\n");

        let cognitive = calculate_cognitive_complexity(&code);
        let cyclomatic = calculate_cyclomatic_complexity(&code);

        // Each nested if pair adds to complexity
        prop_assert!(cognitive >= (n * 2) as u32);
        prop_assert!(cyclomatic >= (n * 2 + 1) as u32);
    }
}
