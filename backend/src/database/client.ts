import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/errors.js";

/**
 * Singleton Supabase client instance
 */
class DatabaseClient {
  private client: SupabaseClient | null = null;

  /**
   * Get or create Supabase client instance
   */
  getClient(): SupabaseClient {
    if (!this.client) {
      try {
        this.client = createClient(
          config.supabase.url,
          config.supabase.serviceRoleKey,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          }
        );
        logger.info("Database client initialized");
      } catch (error) {
        logger.error("Failed to initialize database client", error);
        throw new AppError(
          500,
          "Database initialization failed. Please check your configuration."
        );
      }
    }

    return this.client;
  }

  /**
   * Health check for database connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      const client = this.getClient();
      // Simple query to check connection
      const { error } = await client.from("users").select("id").limit(1);
      return !error;
    } catch (error) {
      logger.error("Database health check failed", error);
      return false;
    }
  }
}

export const dbClient = new DatabaseClient();
export const getSupabaseClient = () => dbClient.getClient();
