use std::collections::HashMap;
use std::error::Error;
use syn::{parse_str, File};

#[derive(Debug)]
pub enum Token {
    Keyword(String),
    Identifier(String),
    Operator(String),
    Brace(char),
    Whitespace,
    Comment(String),
    Other(String),
}

/// A tokenizer for analyzing Rust code complexity.
///
/// This tokenizer provides a simple way to break down Rust code into tokens
/// for complexity analysis. It handles basic Rust syntax including:
/// - Keywords
/// - Operators
/// - Identifiers
/// - Braces and parentheses
///
/// Example:
/// ```
/// use complexity_analyzer::tokenizer::Tokenizer;
///
/// let content = "fn main() { if x > 0 { return true; } }";
/// let mut tokenizer = Tokenizer::new(content);
///
/// while let Some(token) = tokenizer.next_token() {
///     println!("{:?}", token);
/// }
/// ```
pub struct Tokenizer {
    content: String,
    pos: usize,
    pub current_line: usize,
    keywords: HashMap<String, ()>,
    operators: HashMap<String, ()>,
}

impl Tokenizer {
    pub fn new(content: &str) -> Self {
        let mut keywords = HashMap::new();
        for kw in &[
            "fn", "let", "const", "mut", "pub", "async", "unsafe", "if", "else", "while", "for",
            "in", "match", "return", "struct", "enum", "impl", "trait", "type", "mod", "use",
            "where", "as", "break", "continue", "loop",
        ] {
            keywords.insert(kw.to_string(), ());
        }

        let mut operators = HashMap::new();
        for op in &[
            "+", "-", "*", "/", "%", "=", "==", "!=", "<", ">", "<=", ">=", "&&", "||", "!", "&",
            "|", "^", "<<", ">>", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>=",
            "=>", "->", "::", ":",
        ] {
            operators.insert(op.to_string(), ());
        }

        Self {
            content: content.to_string(),
            pos: 0,
            current_line: 1,
            keywords,
            operators,
        }
    }

    pub fn next_token(&mut self) -> Option<Token> {
        self.skip_whitespace();

        if self.pos >= self.content.len() {
            return None;
        }

        let c = self.current_char()?;

        // Handle comments
        if c == '/' {
            if let Some('/') = self.peek_char() {
                return Some(self.read_line_comment());
            }
        }

        // Handle braces
        if ['{', '}', '(', ')', '[', ']'].contains(&c) {
            self.pos += 1;
            return Some(Token::Brace(c));
        }

        // Handle operators
        if "=!<>+-*/&|".contains(c) {
            return Some(self.read_operator());
        }

        // Handle identifiers and keywords
        if c.is_alphabetic() || c == '_' {
            return Some(self.read_identifier());
        }

        // Handle numbers
        if c.is_numeric() {
            return Some(self.read_number());
        }

        // Skip any other character
        self.pos += 1;
        Some(Token::Other(c.to_string()))
    }

    // Get the current character safely
    fn current_char(&self) -> Option<char> {
        if self.pos >= self.content.len() {
            None
        } else {
            // Use chars() to properly handle Unicode
            self.content[self.pos..].chars().next()
        }
    }

    // Peek at the next character without advancing position
    fn peek_char(&self) -> Option<char> {
        let mut chars = self.content[..].chars();

        // Skip to current position
        let mut i = 0;
        while i < self.pos && chars.next().is_some() {
            i += 1;
        }

        // Skip current character
        if chars.next().is_some() {
            // Get next character
            chars.next()
        } else {
            None
        }
    }

    fn skip_whitespace(&mut self) {
        while let Some(c) = self.current_char() {
            if !c.is_whitespace() {
                break;
            }
            self.pos += 1;
        }
    }

    fn read_line_comment(&mut self) -> Token {
        let start = self.pos;
        while let Some(c) = self.current_char() {
            if c == '\n' {
                break;
            }
            self.pos += 1;
        }
        Token::Comment(self.content[start..self.pos].to_string())
    }

    fn read_operator(&mut self) -> Token {
        let start = self.pos;
        let mut len = 1;

        // Check for two-character operators like ->
        if let Some(next) = self.peek_char() {
            let first_char = self.current_char().unwrap();
            let two_char = format!("{}{}", first_char, next);
            if self.operators.contains_key(&two_char) || two_char == "->" {
                len = 2;
            }
        }

        self.pos += len;
        Token::Operator(self.content[start..start + len].to_string())
    }

    fn read_identifier(&mut self) -> Token {
        let start = self.pos;
        while let Some(c) = self.current_char() {
            if !c.is_alphanumeric() && c != '_' {
                break;
            }
            self.pos += 1;
        }

        let word = self.content[start..self.pos].to_string();
        if self.keywords.contains_key(&word) {
            Token::Keyword(word)
        } else {
            Token::Identifier(word)
        }
    }

    fn read_number(&mut self) -> Token {
        let start = self.pos;
        while let Some(c) = self.current_char() {
            if !c.is_numeric() && c != '.' {
                break;
            }
            self.pos += 1;
        }
        Token::Other(self.content[start..self.pos].to_string())
    }

    pub fn parse_ast(&self) -> Result<File, Box<dyn Error>> {
        let ast: File = parse_str(&self.content)?;
        Ok(ast)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tokenizer() {
        let input = r#"
            pub async unsafe fn complex(x: i32, y: i32) -> i32 {
                if x > 0 {
                    if y > 0 {
                        while x > 0 {
                            println!("x: {}", x);
                        }
                    }
                } else {
                    println!("x <= 0");
                }
                42
            }
        "#;

        let mut tokenizer = Tokenizer::new(input);
        let mut tokens = Vec::new();
        while let Some(token) = tokenizer.next_token() {
            tokens.push(token);
        }

        assert!(!tokens.is_empty());

        let mut keyword_count = 0;
        let mut operator_count = 0;
        let mut identifier_count = 0;
        let mut punctuation_count = 0;
        let mut literal_count = 0;

        for token in tokens {
            match token {
                Token::Keyword(_) => keyword_count += 1,
                Token::Operator(_) => operator_count += 1,
                Token::Identifier(_) => identifier_count += 1,
                Token::Brace(_) => punctuation_count += 1,
                Token::Other(_) => literal_count += 1,
                _ => {}
            }
        }

        assert!(keyword_count > 0);
        assert!(operator_count > 0);
        assert!(identifier_count > 0);
        assert!(punctuation_count > 0);
        assert!(literal_count > 0);
    }

    #[test]
    fn test_extract_functions() {
        let content = r#"
            fn test1(x: i32) -> i32 {
                x + 1
            }

            fn test2(y: i32) -> i32 {
                y * 2
            }
        "#;
        let mut tokenizer = Tokenizer::new(content);
        let mut tokens = Vec::new();
        while let Some(token) = tokenizer.next_token() {
            tokens.push(token);
        }

        // Count the number of 'fn' keywords
        let fn_count = tokens
            .iter()
            .filter(|t| matches!(t, Token::Keyword(k) if k == "fn"))
            .count();

        assert_eq!(fn_count, 2);
    }
}
