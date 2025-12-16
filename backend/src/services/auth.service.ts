import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getSupabaseClient } from "../database/client.js";
import { config } from "../config/index.js";
import { BCRYPT_SALT_ROUNDS } from "../constants/index.js";
import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
} from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { User, LoginRequest } from "../types/index.js";
import { isValidEmail, sanitizeEmail, isValidPassword } from "../utils/validation.js";

/**
 * Authentication service
 */
export class AuthService {
  /**
   * Authenticate user and generate JWT token
   */
  async login(credentials: LoginRequest): Promise<{
    token: string;
    user: { id: string; email: string };
  }> {
    // Validate input
    if (!credentials.email || !credentials.password) {
      throw new ValidationError("Email and password are required");
    }

    if (!isValidEmail(credentials.email)) {
      throw new ValidationError("Invalid email format");
    }

    if (!isValidPassword(credentials.password)) {
      throw new ValidationError("Password must be at least 6 characters");
    }

    const sanitizedEmail = sanitizeEmail(credentials.email);

    try {
      // Find user by email
      const supabase = getSupabaseClient();
      const { data: user, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("email", sanitizedEmail)
        .single();

      if (fetchError || !user) {
        logger.warn("Login attempt with invalid email", { email: sanitizedEmail });
        throw new AuthenticationError("Invalid email or password");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        credentials.password,
        (user as User).password_hash
      );

      if (!isPasswordValid) {
        logger.warn("Login attempt with invalid password", {
          userId: (user as User).id,
        });
        throw new AuthenticationError("Invalid email or password");
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: (user as User).id,
          email: (user as User).email,
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      logger.info("User logged in successfully", { userId: (user as User).id });

      return {
        token,
        user: {
          id: (user as User).id,
          email: (user as User).email,
        },
      };
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof ValidationError) {
        throw error;
      }
      logger.error("Login error", error);
      throw new AuthenticationError("Authentication failed");
    }
  }
}

export const authService = new AuthService();
