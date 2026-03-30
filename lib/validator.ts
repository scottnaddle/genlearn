/**
 * GenLearn Schema Validator
 * 
 * Validates content generation outputs against their Zod schemas.
 * This is a critical component for ensuring output quality and consistency.
 * 
 * Features:
 * - Zod-based validation
 * - Detailed error reporting
 * - Support for all registered content types
 * 
 * To add validation for a new content type:
 * 1. Add the schema import in this file
 * 2. Add the schema to SCHEMA_MAP
 */

import { ZodSchema, ZodError } from "zod";
import {
  ML01ShortsScriptSchema,
  ML05GlossarySnippetSchema,
} from "./schemas";

// ============================================
// Schema Registry
// ============================================

const SCHEMA_MAP: Record<string, ZodSchema> = {
  "ML-01": ML01ShortsScriptSchema,
  "ML-05": ML05GlossarySnippetSchema,
};

// ============================================
// Type Definitions
// ============================================

export interface ValidationResult {
  valid: boolean;
  data?: unknown;
  errors?: string[];
  contentTypeId: string;
  validatedAt: string;
}

export interface ValidationOptions {
  stripUnknown?: boolean;
  strict?: boolean;
}

// ============================================
// Validator Functions
// ============================================

/**
 * Validate raw output against a content type schema
 * 
 * @param contentTypeId - The content type identifier
 * @param rawOutput - The raw output to validate (object or JSON string)
 * @param options - Validation options
 * @returns ValidationResult with detailed error information
 */
export function validate(
  contentTypeId: string,
  rawOutput: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  const schema = SCHEMA_MAP[contentTypeId];

  if (!schema) {
    return {
      valid: false,
      contentTypeId,
      errors: [
        `Unknown content type: ${contentTypeId}. Available types: ${Object.keys(SCHEMA_MAP).join(", ")}`,
      ],
      validatedAt: new Date().toISOString(),
    };
  }

  // Parse input if it's a string (JSON)
  let data = rawOutput;
  if (typeof rawOutput === "string") {
    try {
      data = JSON.parse(rawOutput);
    } catch {
      return {
        valid: false,
        contentTypeId,
        errors: ["Invalid JSON format: unable to parse input string"],
        validatedAt: new Date().toISOString(),
      };
    }
  }

  // Validate against schema
  try {
    const validatedData = schema.parse(data);
    return {
      valid: true,
      data: validatedData,
      contentTypeId,
      validatedAt: new Date().toISOString(),
    };
  } catch (error) {
    const errors: string[] = [];

    if (error instanceof ZodError) {
      error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors.push(`${path ? `${path}: ` : ""}${issue.message}`);
      });
    } else if (error instanceof Error) {
      errors.push(error.message);
    } else {
      errors.push("Unknown validation error");
    }

    return {
      valid: false,
      contentTypeId,
      errors,
      validatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Safe validation that never throws - returns result with errors instead
 */
export function safeValidate(
  contentTypeId: string,
  rawOutput: unknown,
  options: ValidationOptions = {}
): ValidationResult {
  try {
    return validate(contentTypeId, rawOutput, options);
  } catch (error) {
    return {
      valid: false,
      contentTypeId,
      errors: [`Unexpected error during validation: ${error instanceof Error ? error.message : String(error)}`],
      validatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Check if a content type has a registered schema
 */
export function hasSchema(contentTypeId: string): boolean {
  return contentTypeId in SCHEMA_MAP;
}

/**
 * Get list of all supported content type IDs
 */
export function getSupportedTypes(): string[] {
  return Object.keys(SCHEMA_MAP);
}
