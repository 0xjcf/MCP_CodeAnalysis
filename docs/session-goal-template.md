# Session Goal Template Guide

This guide explains how to use the session goal template for planning and tracking development sessions.

## Template Structure

### Session Goals

Each goal should include:

1. **Basic Information**

   - `id`: Unique identifier for the goal
   - `description`: Clear, concise description
   - `priority`: high/medium/low
   - `priority_level`: Numerical priority (1 being highest)
   - `estimated_time`: Expected duration
   - `status`: Current status (pending/in_progress/completed/blocked)

2. **Implementation Details**
   - `implementation_requirements`: List of specific requirements
   - `implementation_approach`: Step-by-step implementation plan
   - `guard_rails`: Rules and constraints to follow
   - `verification_steps`: Checklist for validation
   - `success_criteria`: Measurable outcomes

### Guard Rails

Guard rails define the boundaries and rules for implementation:

1. **Naming Conventions**

   - Scope of the naming convention
   - Pattern to follow
   - Examples for clarity

2. **Code Standards**

   - Style guide references
   - Best practices to follow
   - Technical constraints

3. **Technical Requirements**
   - Dependencies
   - Version requirements
   - Compatibility requirements

### Verification Steps

Each verification step should include:

1. **Step Name**: Clear identification of the verification phase
2. **Checks**: Specific items to verify
3. **Validation Criteria**: How to determine success

## Usage Guidelines

1. **Creating New Session Goals**

   ```bash
   # Copy the template
   cp session-goal.template.json session-goal.json

   # Edit with your specific goals
   $EDITOR session-goal.json
   ```

2. **Updating During Session**

   - Update status as goals progress
   - Add notes about challenges or discoveries
   - Track metrics against baseline

3. **Review and Validation**
   - Review against template structure
   - Ensure all required sections are filled
   - Validate against project standards

## Best Practices

1. **Goal Definition**

   - Keep goals focused and achievable
   - Include both technical and non-technical requirements
   - Consider dependencies between goals

2. **Guard Rails**

   - Define clear boundaries
   - Include examples where helpful
   - Consider project-wide standards

3. **Verification**

   - Make checks specific and measurable
   - Include both automated and manual checks
   - Consider edge cases

4. **Documentation**
   - Keep notes up to date
   - Document decisions and rationale
   - Include relevant context

## Example Usage

```json
{
  "session_goals": [
    {
      "id": "goal-1",
      "description": "Implement feature X",
      "priority": "high",
      "priority_level": 1,
      "estimated_time": "60 minutes",
      "status": "pending",
      "details": {
        "implementation_requirements": [
          "Create new component",
          "Add unit tests",
          "Update documentation"
        ],
        "implementation_approach": [
          "Set up component structure",
          "Implement core functionality",
          "Add tests and documentation"
        ],
        "guard_rails": {
          "naming_conventions": {
            "scope": "@mcp",
            "naming_pattern": "kebab-case",
            "examples": ["@mcp/feature-x"]
          }
        },
        "verification_steps": [
          {
            "step": "Component Implementation",
            "checks": [
              "Component builds successfully",
              "Tests pass",
              "Documentation is complete"
            ]
          }
        ],
        "success_criteria": [
          "Feature works as expected",
          "All tests pass",
          "Documentation is updated"
        ]
      }
    }
  ]
}
```

## Maintenance

1. **Regular Updates**

   - Review and update template as needed
   - Add new sections based on project needs
   - Remove obsolete sections

2. **Version Control**

   - Keep template in version control
   - Document template changes
   - Consider template versioning

3. **Project-Specific Customization**
   - Adapt template to project needs
   - Add project-specific sections
   - Include relevant examples
