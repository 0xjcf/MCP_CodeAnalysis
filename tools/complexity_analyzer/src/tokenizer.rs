use crate::function_analysis::FunctionAnalysis;
use regex::Regex;

pub fn extract_functions(content: &str) -> Vec<FunctionAnalysis> {
    let mut functions = Vec::new();
    let func_regex = Regex::new(
        r"(?m)^\s*(?:pub\s+)?fn\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*(?:->\s*([^{]+))?\s*\{",
    )
    .unwrap();

    let mut current_pos = 0;
    while let Some(cap) = func_regex.captures_at(content, current_pos) {
        let func_name = cap[1].to_string();
        let return_type = cap
            .get(2)
            .map_or("()".to_string(), |m| m.as_str().trim().to_string());

        let start = content[..cap.get(0).unwrap().start()].lines().count();
        let func_str = extract_function_body(&content[cap.get(0).unwrap().start()..]);
        let end = start + func_str.lines().count();

        let function = FunctionAnalysis::new(func_name, start, end, return_type, &func_str);
        functions.push(function);

        // Move to the end of the current function
        current_pos = cap.get(0).unwrap().start() + func_str.len();
    }

    functions
}

fn extract_function_body(content: &str) -> String {
    let mut depth = 0;
    let mut body = String::new();
    let mut in_string = false;
    let mut escape_next = false;

    for c in content.chars() {
        body.push(c);

        if escape_next {
            escape_next = false;
            continue;
        }

        match c {
            '\\' if in_string => escape_next = true,
            '"' => in_string = !in_string,
            '{' if !in_string => depth += 1,
            '}' if !in_string => {
                depth -= 1;
                if depth == 0 {
                    break;
                }
            }
            _ => {}
        }
    }

    body
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_functions() {
        let content = r#"
            fn test_function() {
                println!("Hello");
            }

            pub fn another_function() -> String {
                "World".to_string()
            }
        "#;

        let functions = extract_functions(content);
        assert_eq!(functions.len(), 2);
        assert_eq!(functions[0].name, "test_function");
        assert_eq!(functions[1].name, "another_function");
    }
}
