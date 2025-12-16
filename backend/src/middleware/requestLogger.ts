import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

/**
 * Request logging middleware
 * Logs incoming requests with method, path, and response time
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  // Log request start
  logger.debug(`${req.method} ${req.path}`, {
    query: req.query,
    ip: req.ip,
  });

  // Override res.end to log response time
  const originalEnd = res.end;
  res.end = function (
    chunk?: any,
    encoding?: BufferEncoding | (() => void),
    cb?: () => void
  ) {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? "warn" : "info";

    logger[logLevel](`${req.method} ${req.path} ${res.statusCode}`, {
      duration: `${duration}ms`,
      statusCode: res.statusCode,
    });

    return originalEnd.call(this as any, chunk, encoding as any, cb);
  };

  next();
}
