import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/errors.js";

const SUPABASE_REST_URL = `${config.supabase.url}/rest/v1`;
const SERVICE_ROLE_KEY = config.supabase.serviceRoleKey;

interface SupabaseRequestInit extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Low-level helper to call Supabase PostgREST over HTTP.
 * This replaces the @supabase/supabase-js client so we can run on Vercel Node functions.
 */
export async function supabaseFetch<T>(
  path: string,
  init: SupabaseRequestInit = {}
): Promise<T> {
  const url = `${SUPABASE_REST_URL}${path}`;

  const headers: Record<string, string> = {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    ...init.headers,
  };

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error("Supabase REST error", {
      url,
      status: response.status,
      statusText: response.statusText,
      body: text,
    });
    throw new AppError(500, "Database request failed. Please try again later.");
  }

  // Some operations (DELETE, some INSERT/UPDATE without return=representation)
  // may return no content, which would cause response.json() to throw.
  if (response.status === 204) {
    return undefined as T;
  }

  const rawText = await response.text();
  if (!rawText) {
    // No body to parse
    return undefined as T;
  }

  try {
    return JSON.parse(rawText) as T;
  } catch (error) {
    logger.error("Failed to parse Supabase REST JSON response", {
      url,
      rawText,
      error,
    });
    throw new AppError(
      500,
      "Invalid response from database. Please try again later."
    );
  }
}

/**
 * Simple health check using a lightweight REST query.
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await supabaseFetch<unknown>("/users?select=id&limit=1", {
      method: "GET",
    });
    return true;
  } catch (error) {
    logger.error("Database health check failed", error);
    return false;
  }
}
