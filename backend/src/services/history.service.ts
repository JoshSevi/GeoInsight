import { supabaseFetch } from "../database/client.js";
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
      const data = await supabaseFetch<SearchHistory[]>(
        `/search_history?user_id=eq.${encodeURIComponent(
          userId
        )}&select=id,user_id,ip_address,city,country,created_at&order=created_at.desc&limit=${limit}`,
        { method: "GET" }
      );

      return data || [];
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
      // Check if this IP already exists in user's recent history
      const existing = await supabaseFetch<{ id: string }[]>(
        `/search_history?user_id=eq.${encodeURIComponent(
          userId
        )}&ip_address=eq.${encodeURIComponent(
          ip
        )}&select=id&order=created_at.desc&limit=1`,
        { method: "GET" }
      );

      // If exists, delete the old entry (we'll add a new one to move it to top)
      if (existing.length > 0) {
        await supabaseFetch<void>(
          `/search_history?id=eq.${encodeURIComponent(existing[0].id)}`,
          { method: "DELETE" }
        );
      }

      // Insert new history entry
      await supabaseFetch<void>("/search_history", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          ip_address: ip,
          city: historyData.city || null,
          country: historyData.country || null,
        }),
      });

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
      // Build filter query
      let path = `/search_history?user_id=eq.${encodeURIComponent(userId)}`;

      if (
        deleteRequest.ids &&
        Array.isArray(deleteRequest.ids) &&
        deleteRequest.ids.length > 0
      ) {
        path += `&id=in.(${deleteRequest.ids
          .map((id) => encodeURIComponent(id))
          .join(",")})`;
      } else if (
        deleteRequest.ips &&
        Array.isArray(deleteRequest.ips) &&
        deleteRequest.ips.length > 0
      ) {
        path += `&ip_address=in.(${deleteRequest.ips
          .map((ip) => encodeURIComponent(ip))
          .join(",")})`;
      }

      await supabaseFetch<void>(path, { method: "DELETE" });

      logger.info("Search history deleted", {
        userId,
        ids: deleteRequest.ids || deleteRequest.ips || "all",
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
