use crate::tokenizer::{Token, Tokenizer};

pub fn count_lines(content: &str) -> u32 {
    content.lines().count() as u32
}

pub fn extract_function_text(content: &str, function_name: &str) -> Option<String> {
    let mut tokenizer = Tokenizer::new(content);
    let mut current_function = String::new();
    let mut in_target_function = false;
    let mut brace_count = 0;
    let mut found_function = false;

    while let Some(token) = tokenizer.next_token() {
        match token {
            Token::Keyword(keyword) if keyword == "fn" => {
                current_function.clear();
                current_function.push_str("fn ");
                found_function = true;
            }
            Token::Identifier(name) if found_function && !in_target_function => {
                current_function.push_str(&name);
                if name == function_name {
                    in_target_function = true;
                } else {
                    found_function = false;
                    current_function.clear();
                }
            }
            Token::Brace('{') => {
                if in_target_function {
                    current_function.push('{');
                    brace_count += 1;
                }
            }
            Token::Brace('}') => {
                if in_target_function {
                    current_function.push('}');
                    brace_count -= 1;
                    if brace_count == 0 {
                        return Some(current_function);
                    }
                }
            }
            _ => {
                if in_target_function {
                    // Add the token representation to the function text
                    match token {
                        Token::Operator(op) => {
                            current_function.push(' ');
                            current_function.push_str(&op);
                            current_function.push(' ');
                        }
                        Token::Identifier(id) => current_function.push_str(&id),
                        Token::Comment(comment) => current_function.push_str(&comment),
                        Token::Other(other) => current_function.push_str(&other),
                        Token::Whitespace => current_function.push(' '),
                        _ => current_function.push_str(&format!("{:?}", token)),
                    }
                } else if found_function {
                    // Still collecting the function signature
                    match token {
                        Token::Operator(op) => current_function.push_str(&op),
                        Token::Brace('(') => current_function.push('('),
                        Token::Brace(')') => current_function.push(')'),
                        Token::Identifier(id) => current_function.push_str(&id),
                        Token::Other(other) => current_function.push_str(&other),
                        Token::Whitespace => current_function.push(' '),
                        _ => current_function.push_str(&format!("{:?}", token)),
                    }
                }
            }
        }
    }

    None
}

pub fn is_halstead_operator(token: &Token) -> bool {
    match token {
        Token::Operator(_) => true,
        Token::Keyword(kw) => matches!(
            kw.as_str(),
            "if" | "else" | "while" | "for" | "loop" | "match" | "break" | "continue" | "return"
        ),
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_count_lines() {
        let content = "line1\nline2\nline3";
        assert_eq!(count_lines(content), 3);
    }

    #[test]
    fn test_extract_function_text() {
        let content = r#"
            fn add(x: i32, y: i32) -> i32 {
                x + y
            }

            fn other() {
                // This should be ignored
            }
        "#;

        let function_text = extract_function_text(content, "add");
        assert!(function_text.is_some());
        let function_text = function_text.unwrap();
        assert!(function_text.contains("fn add"));
        assert!(function_text.contains("x + y"));
    }

    #[test]
    fn test_is_halstead_operator() {
        assert!(is_halstead_operator(&Token::Operator("+".to_string())));
        assert!(is_halstead_operator(&Token::Keyword("if".to_string())));
        assert!(!is_halstead_operator(&Token::Identifier("x".to_string())));
    }
}
