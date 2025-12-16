import { getSupabaseClient } from "../database/client.js";
import { HISTORY_LIMIT } from "../constants/index.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import {
  SearchHistory,
  HistoryCreateRequest,
  HistoryDeleteRequest,
} from "../types/index.js";
import { isValidIP } from "../utils/ipValidator.js";

/**
 * Search history service
 */
export class HistoryService {
  /**
   * Get user's search history
   */
  async getUserHistory(
    userId: string,
    limit: number = HISTORY_LIMIT
  ): Promise<SearchHistory[]> {
    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    try {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from("search_history")
        .select("id, user_id, ip_address, city, country, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        logger.error("Error fetching search history", error, { userId });
        throw new Error("Failed to fetch search history");
      }

      return (data as SearchHistory[]) || [];
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error("History service error - getUserHistory", error);
      throw new Error("Failed to fetch search history");
    }
  }

  /**
   * Add entry to search history
   */
  async addHistory(
    userId: string,
    historyData: HistoryCreateRequest
  ): Promise<void> {
    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    if (!historyData.ip || typeof historyData.ip !== "string") {
      throw new ValidationError("IP address is required");
    }

    const ip = historyData.ip.trim();
    if (!isValidIP(ip)) {
      throw new ValidationError("Invalid IP address format");
    }

    try {
      const supabase = getSupabaseClient();

      // Check if this IP already exists in user's recent history
      const { data: existing } = await supabase
        .from("search_history")
        .select("id")
        .eq("user_id", userId)
        .eq("ip_address", ip)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      // If exists, delete the old entry (we'll add a new one to move it to top)
      if (existing) {
        await supabase.from("search_history").delete().eq("id", existing.id);
      }

      // Insert new history entry
      const { error } = await supabase.from("search_history").insert([
        {
          user_id: userId,
          ip_address: ip,
          city: historyData.city || null,
          country: historyData.country || null,
        },
      ]);

      if (error) {
        logger.error("Error saving search history", error, { userId, ip });
        throw new Error("Failed to save search history");
      }

      logger.info("Search history added", { userId, ip });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error("History service error - addHistory", error);
      throw new Error("Failed to save search history");
    }
  }

  /**
   * Delete search history entries
   */
  async deleteHistory(
    userId: string,
    deleteRequest: HistoryDeleteRequest
  ): Promise<void> {
    if (!userId) {
      throw new ValidationError("User ID is required");
    }

    try {
      const supabase = getSupabaseClient();

      let query = supabase
        .from("search_history")
        .delete()
        .eq("user_id", userId);

      // If specific IPs provided, delete only those
      if (
        deleteRequest.ips &&
        Array.isArray(deleteRequest.ips) &&
        deleteRequest.ips.length > 0
      ) {
        query = query.in("ip_address", deleteRequest.ips);
      }

      const { error } = await query;

      if (error) {
        logger.error("Error deleting search history", error, { userId });
        throw new Error("Failed to delete search history");
      }

      logger.info("Search history deleted", {
        userId,
        ips: deleteRequest.ips || "all",
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error("History service error - deleteHistory", error);
      throw new Error("Failed to delete search history");
    }
  }
}

export const historyService = new HistoryService();
