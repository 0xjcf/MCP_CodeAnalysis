/**
 * Validators for MCP Code Analysis system.
 * This file contains utility functions for validation of parameters, schemas, and other data.
 */

import { z } from 'zod';

/**
 * Validates parameters against a schema
 * @param parameters The parameters to validate
 * @param schema The schema to validate against (optional)
 * @returns Validated parameters or the original parameters if no schema
 * @throws {Error} If validation fails
 */
export function validateParameters(
  parameters: Record<string, unknown>,
  schema?: z.ZodObject<any>
): Record<string, unknown> {
  // If no schema, just return the parameters
  if (!schema) {
    return parameters;
  }

  try {
    // Parse and validate the parameters
    const validatedParams = schema.parse(parameters);
    return validatedParams;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format the validation error
      const formattedErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      
      throw new Error(`Parameter validation failed: ${formattedErrors}`);
    }
    
    // Re-throw other errors
    throw error;
  }
} 