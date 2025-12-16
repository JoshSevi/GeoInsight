import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "./asyncHandler.js";

/**
 * Type for controller methods
 */
export type ControllerMethod = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Wrapper to create route handlers from controller methods
 * Automatically handles async errors and type casting
 */
export function routeHandler(controllerMethod: ControllerMethod) {
  return asyncHandler(controllerMethod);
}

