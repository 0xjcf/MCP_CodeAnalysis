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
