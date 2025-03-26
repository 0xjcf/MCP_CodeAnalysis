# Refactoring Guidelines for High-Complexity Functions

This document provides guidelines for refactoring functions with high complexity metrics, based on the analysis from our complexity analyzer tool.

## Complexity Thresholds

| Metric                | Low  | Medium   | High      | Very High |
| --------------------- | ---- | -------- | --------- | --------- |
| Cyclomatic Complexity | 1-5  | 6-10     | 11-15     | 16+       |
| Cognitive Complexity  | 1-5  | 6-15     | 16-30     | 31+       |
| Halstead Effort       | <250 | 250-1000 | 1001-3000 | 3001+     |

## Refactoring Strategies

### 1. Extract Method

When a function is too long or handles multiple responsibilities:

```rust
// Before
fn process_user_data(user: &User) -> Result<ProcessedData, Error> {
    // 50+ lines of complex logic
    // Mixing validation, transformation, and business logic
}

// After
fn process_user_data(user: &User) -> Result<ProcessedData, Error> {
    validate_user(user)?;
    let transformed_data = transform_user_data(user)?;
    apply_business_rules(transformed_data)
}

fn validate_user(user: &User) -> Result<(), Error> {
    // Validation logic
}

fn transform_user_data(user: &User) -> Result<TransformedData, Error> {
    // Data transformation logic
}

fn apply_business_rules(data: TransformedData) -> Result<ProcessedData, Error> {
    // Business logic
}
```

### 2. Simplify Conditionals

For complex nested conditions:

```rust
// Before
fn calculate_discount(order: &Order) -> f64 {
    if order.total > 1000.0 {
        if order.customer_type == CustomerType::Premium {
            if order.items.len() > 5 {
                return order.total * 0.2;
            }
        }
    }
    0.0
}

// After
fn calculate_discount(order: &Order) -> f64 {
    if !is_eligible_for_discount(order) {
        return 0.0;
    }

    if order.customer_type == CustomerType::Premium && order.items.len() > 5 {
        return order.total * 0.2;
    }

    if order.total > 1000.0 {
        return order.total * 0.1;
    }

    0.0
}

fn is_eligible_for_discount(order: &Order) -> bool {
    order.total > 1000.0 ||
    (order.customer_type == CustomerType::Premium && order.items.len() > 5)
}
```

### 3. Replace Nested Conditionals with Match

For complex branching logic:

```rust
// Before
fn handle_response(response: &Response) -> Result<(), Error> {
    if response.status == 200 {
        if let Some(data) = &response.data {
            if data.is_valid() {
                process_data(data)
            } else {
                Err(Error::InvalidData)
            }
        } else {
            Err(Error::MissingData)
        }
    } else {
        Err(Error::BadStatus(response.status))
    }
}

// After
fn handle_response(response: &Response) -> Result<(), Error> {
    match (response.status, &response.data) {
        (200, Some(data)) if data.is_valid() => process_data(data),
        (200, Some(_)) => Err(Error::InvalidData),
        (200, None) => Err(Error::MissingData),
        (status, _) => Err(Error::BadStatus(status))
    }
}
```

### 4. Reduce Cognitive Load

For complex calculations or transformations:

```rust
// Before
fn calculate_final_price(item: &Item, user: &User) -> f64 {
    let base_price = item.price;
    let tax_rate = if user.country == "US" { 0.08 } else { 0.0 };
    let discount = if user.is_premium() { 0.1 } else { 0.0 };
    let shipping = if item.weight > 10.0 { 5.0 } else { 0.0 };
    base_price * (1.0 + tax_rate) * (1.0 - discount) + shipping
}

// After
fn calculate_final_price(item: &Item, user: &User) -> f64 {
    let base_price = item.price;
    let tax = calculate_tax(base_price, user.country);
    let discount = calculate_discount(base_price, user);
    let shipping = calculate_shipping(item.weight);

    base_price + tax - discount + shipping
}

fn calculate_tax(price: f64, country: &str) -> f64 {
    let tax_rate = match country {
        "US" => 0.08,
        _ => 0.0
    };
    price * tax_rate
}

fn calculate_discount(price: f64, user: &User) -> f64 {
    if user.is_premium() {
        price * 0.1
    } else {
        0.0
    }
}

fn calculate_shipping(weight: f64) -> f64 {
    if weight > 10.0 {
        5.0
    } else {
        0.0
    }
}
```

### 5. Improve Naming

Use clear, descriptive names that explain purpose and intent:

```rust
// Before
fn p(d: &Data) -> bool {
    if d.v > 0 && d.t < 100 && d.s == "active" {
        true
    } else {
        false
    }
}

// After
fn is_valid_data(data: &Data) -> bool {
    data.value > 0 &&
    data.temperature < 100 &&
    data.status == "active"
}
```

## Best Practices

1. **Start Small**: Begin with the simplest refactoring that will improve the code
2. **Test First**: Write tests before refactoring to ensure behavior is preserved
3. **Measure Impact**: Use the complexity analyzer to verify improvements
4. **Document Changes**: Update documentation to reflect refactoring decisions
5. **Review with Team**: Get feedback on refactoring approaches

## Common Pitfalls

1. **Over-refactoring**: Breaking down functions too much can make the code harder to follow
2. **Premature Optimization**: Focus on readability first, then performance if needed
3. **Incomplete Testing**: Ensure all edge cases are covered after refactoring
4. **Inconsistent Style**: Maintain consistent naming and structure across refactored code

## Tools and Resources

- [Complexity Analyzer Documentation](tools/complexity_analyzer/README.md)
- [Rust Style Guide](https://rust-lang.github.io/api-guidelines/)
- [Refactoring Patterns](https://refactoring.guru/refactoring/patterns)

## High-Complexity Functions Refactoring Guide

### 1. analyze_directory (CC: 18)

**Current Issues:**

- High cyclomatic complexity (18) indicates too many decision points
- Likely handles multiple responsibilities (file traversal, analysis, reporting)
- Complex error handling paths

**Refactoring Approach:**

1. **Split into Smaller Functions:**

   ```rust
   // Before
   fn analyze_directory(path: &Path) -> Result<AnalysisResult, Error> {
       // Complex logic handling multiple responsibilities
   }

   // After
   fn analyze_directory(path: &Path) -> Result<AnalysisResult, Error> {
       let files = collect_files(path)?;
       let results = analyze_files(&files)?;
       generate_report(results)
   }

   fn collect_files(path: &Path) -> Result<Vec<PathBuf>, Error> {
       // File collection logic
   }

   fn analyze_files(files: &[PathBuf]) -> Result<Vec<FileAnalysis>, Error> {
       // File analysis logic
   }

   fn generate_report(results: Vec<FileAnalysis>) -> Result<AnalysisResult, Error> {
       // Report generation logic
   }
   ```

2. **Implement Error Type:**

   ```rust
   #[derive(Debug)]
   enum AnalysisError {
       FileError(io::Error),
       ParseError(String),
       InvalidPath(String),
       // Add specific error variants
   }
   ```

3. **Add Configuration Options:**
   ```rust
   struct AnalysisConfig {
       max_depth: usize,
       exclude_patterns: Vec<String>,
       include_hidden: bool,
   }
   ```

### 2. calculate_cyclomatic_complexity (CC: 15)

**Current Issues:**

- Complex control flow with multiple branches
- Nested conditionals for different code constructs
- Mixed concerns between parsing and complexity calculation

**Refactoring Approach:**

1. **Separate Parsing from Calculation:**

   ```rust
   // Before
   fn calculate_cyclomatic_complexity(code: &str) -> u32 {
       // Complex logic mixing parsing and calculation
   }

   // After
   fn calculate_cyclomatic_complexity(code: &str) -> u32 {
       let tokens = parse_code(code);
       count_decision_points(&tokens)
   }

   fn parse_code(code: &str) -> Vec<Token> {
       // Parsing logic
   }

   fn count_decision_points(tokens: &[Token]) -> u32 {
       // Complexity calculation logic
   }
   ```

2. **Use State Machine Pattern:**

   ```rust
   enum ParseState {
       Normal,
       InControlStructure,
       InFunction,
   }

   struct ComplexityCounter {
       state: ParseState,
       count: u32,
   }
   ```

### 3. calculate_cognitive_complexity (CC: 17)

**Current Issues:**

- Complex nested structures
- Multiple levels of abstraction
- Difficult to maintain scoring logic

**Refactoring Approach:**

1. **Implement Scoring Rules:**

   ```rust
   struct CognitiveComplexityRules {
       nesting_multiplier: u32,
       control_structure_weights: HashMap<ControlType, u32>,
       operator_weights: HashMap<OperatorType, u32>,
   }
   ```

2. **Separate Scoring Logic:**

   ```rust
   fn calculate_cognitive_complexity(code: &str) -> u32 {
       let ast = parse_ast(code);
       let rules = CognitiveComplexityRules::default();
       score_ast(&ast, &rules)
   }

   fn score_ast(ast: &Ast, rules: &CognitiveComplexityRules) -> u32 {
       // Scoring logic
   }
   ```

3. **Add Configuration:**
   ```rust
   struct CognitiveConfig {
       rules: CognitiveComplexityRules,
       max_depth: u32,
       ignore_patterns: Vec<String>,
   }
   ```

### 4. calculate_halstead_metrics (CC: 17)

**Current Issues:**

- Complex metric calculations
- Mixed concerns between token counting and metric computation
- Difficult to test individual components

**Refactoring Approach:**

1. **Implement Metric Types:**

   ```rust
   struct HalsteadMetrics {
       vocabulary: u32,
       volume: f64,
       difficulty: f64,
       effort: f64,
   }

   struct TokenCounts {
       operators: u32,
       operands: u32,
       unique_operators: u32,
       unique_operands: u32,
   }
   ```

2. **Separate Counting from Calculation:**

   ```rust
   fn calculate_halstead_metrics(code: &str) -> HalsteadMetrics {
       let counts = count_tokens(code);
       compute_metrics(counts)
   }

   fn count_tokens(code: &str) -> TokenCounts {
       // Token counting logic
   }

   fn compute_metrics(counts: TokenCounts) -> HalsteadMetrics {
       // Metric calculation logic
   }
   ```

3. **Add Validation:**
   ```rust
   impl HalsteadMetrics {
       fn validate(&self) -> Result<(), Error> {
           if self.vocabulary == 0 {
               return Err(Error::InvalidMetrics("Vocabulary cannot be zero"));
           }
           // Additional validation
           Ok(())
       }
   }
   ```

## Implementation Steps

1. **Preparation:**

   - Create test suite for each function
   - Document current behavior
   - Set up monitoring for complexity metrics

2. **Refactoring Process:**

   - Start with smallest function (calculate_cyclomatic_complexity)
   - Apply changes incrementally
   - Run tests after each change
   - Verify complexity reduction

3. **Validation:**

   - Run full test suite
   - Verify complexity metrics
   - Check performance impact
   - Update documentation

4. **Monitoring:**
   - Track complexity metrics over time
   - Monitor test coverage
   - Gather team feedback

## Success Criteria

1. **Complexity Reduction:**

   - Cyclomatic complexity < 10 for all functions
   - Cognitive complexity < 15 for all functions
   - Maintain or improve test coverage

2. **Code Quality:**

   - Clear separation of concerns
   - Improved error handling
   - Better testability
   - Comprehensive documentation

3. **Performance:**
   - No significant performance degradation
   - Maintained or improved memory usage
   - Efficient resource utilization

## Notes

- Keep refactoring changes small and focused
- Maintain backward compatibility
- Document all changes and decisions
- Consider team feedback and suggestions
- Monitor impact on other components
