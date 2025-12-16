import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors.js";

/**
 * Request validation middleware factory
 * Creates middleware to validate request body against a schema
 */
export function validateRequest<T>(
  validator: (body: unknown) => body is T
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!validator(req.body)) {
      throw new ValidationError("Invalid request body");
    }
    next();
  };
}

/**
 * Validate required fields in request body
 */
export function validateRequired(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing = fields.filter((field) => !req.body[field]);
    if (missing.length > 0) {
      throw new ValidationError(
        `Missing required fields: ${missing.join(", ")}`
      );
    }
    next();
  };
}

