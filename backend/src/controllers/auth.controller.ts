import { Response, NextFunction } from "express";
import { AuthRequest, LoginRequest } from "../types/index.js";
import { authService } from "../services/auth.service.js";
import { sendSuccess } from "../utils/response.js";

/**
 * Authentication controller
 */
export class AuthController {
  /**
   * Handle user login
   */
  async login(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const credentials = req.body as LoginRequest;
      const result = await authService.login(credentials);

      sendSuccess(
        res,
        {
          token: result.token,
          user: result.user,
        },
        "Login successful"
      );
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
