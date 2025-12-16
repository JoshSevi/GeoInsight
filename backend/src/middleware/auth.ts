import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { AuthenticationError } from "../utils/errors.js";
import { AuthRequest } from "../types/index.js";
import { BEARER_TOKEN_PREFIX } from "../constants/index.js";
import { logger } from "../utils/logger.js";

/**
 * JWT Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */
export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers["authorization"];
    const token =
      authHeader && authHeader.startsWith(BEARER_TOKEN_PREFIX)
        ? authHeader.substring(BEARER_TOKEN_PREFIX.length)
        : null;

    if (!token) {
      throw new AuthenticationError("Authentication token required");
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: string;
      email: string;
    };

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }
    logger.warn("Token verification failed", error);
    next(new AuthenticationError("Invalid or expired token"));
  }
}

