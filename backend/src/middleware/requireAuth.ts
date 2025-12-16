import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/index.js";
import { AuthenticationError } from "../utils/errors.js";

/**
 * Middleware to ensure user is authenticated
 * Should be used after authenticateToken middleware
 * Throws error if userId is not present in request
 */
export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.userId) {
    throw new AuthenticationError("User not authenticated");
  }
  next();
}

