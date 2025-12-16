import express from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase credentials are not configured. Please check your .env file."
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET /api/history - Get user's search history
router.get("/history", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const supabase = getSupabaseClient();

    // Get user's search history, ordered by most recent first
    const { data, error } = await supabase
      .from("search_history")
      .select("ip_address, city, country, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10); // Limit to 10 most recent

    if (error) {
      console.error("Error fetching search history:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch search history",
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("History API error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/history - Add IP to search history
router.post("/history", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { ip, city, country } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!ip || typeof ip !== "string") {
      return res.status(400).json({
        success: false,
        message: "IP address is required",
      });
    }

    const supabase = getSupabaseClient();

    // Check if this IP already exists in user's recent history
    const { data: existing } = await supabase
      .from("search_history")
      .select("id")
      .eq("user_id", userId)
      .eq("ip_address", ip.trim())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // If exists, delete the old entry (we'll add a new one to move it to top)
    if (existing) {
      await supabase
        .from("search_history")
        .delete()
        .eq("id", existing.id);
    }

    // Insert new history entry with city and country
    const { error } = await supabase.from("search_history").insert([
      {
        user_id: userId,
        ip_address: ip.trim(),
        city: city || null,
        country: country || null,
      },
    ]);

    if (error) {
      console.error("Error saving search history:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to save search history",
      });
    }

    res.json({
      success: true,
      message: "Search history saved",
    });
  } catch (error) {
    console.error("History API error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// DELETE /api/history - Delete search history items
router.delete("/history", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId;
    const { ips } = req.body; // Array of IPs to delete, or delete all if empty

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const supabase = getSupabaseClient();

    let query = supabase.from("search_history").delete().eq("user_id", userId);

    // If specific IPs provided, delete only those
    if (ips && Array.isArray(ips) && ips.length > 0) {
      query = query.in("ip_address", ips);
    }

    const { error } = await query;

    if (error) {
      console.error("Error deleting search history:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete search history",
      });
    }

    res.json({
      success: true,
      message: "Search history deleted",
    });
  } catch (error) {
    console.error("History API error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;

