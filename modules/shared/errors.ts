import { Logger } from "@/libs/log";
import { z } from "zod";

const logger = new Logger("DomainError");

export abstract class DomainError extends Error {
  readonly code: string;

  protected constructor(message: string, code: string) {
    super(message);

    this.name = new.target.name;
    this.code = code;

    logger.error(`${this.name}: ${this.message}`);

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
  }
}

// ============================================================================
// Custom Error Classes
// ============================================================================

export class ApiInputError extends DomainError {
  readonly validationErrors: z.ZodError;

  constructor(zodError: z.ZodError) {
    const message = zodError.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    super(`Input validation failed: ${message}`, "API_INPUT_ERROR");
    this.validationErrors = zodError;
  }
}

export class ApiOutputError extends DomainError {
  readonly validationErrors: z.ZodError;

  constructor(zodError: z.ZodError) {
    const message = zodError.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    super(`Output validation failed: ${message}`, "API_OUTPUT_ERROR");
    this.validationErrors = zodError;
  }
}
