import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import { sendError } from "../utils/response.js";
import { logger } from "../utils/logger.js";
import { config } from "../config/index.js";

/**
 * Centralized error handling middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  // If response already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Log error
  if (err instanceof AppError && err.isOperational) {
    logger.warn("Operational error occurred", {
      statusCode: err.statusCode,
      message: err.message,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.error("Unexpected error occurred", err, {
      path: req.path,
      method: req.method,
    });
  }

  // Handle known application errors
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  // Handle unknown errors
  logger.error("Unhandled error", err);
  return sendError(
    res,
    config.nodeEnv === "production"
      ? "Internal server error"
      : err.message || "Internal server error",
    500
  );
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  sendError(res, `Route ${req.method} ${req.path} not found`, 404);
}
