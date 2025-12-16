import { LoginResponse, GeoResponse, HistoryItem } from "../types";
import { API_ENDPOINTS } from "../constants";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Re-export types for backward compatibility
export type { LoginResponse, GeoResponse, HistoryItem };

/**
 * Login API call
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.LOGIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

/**
 * Get geolocation for current user or specified IP
 */
export async function getGeo(
  ip?: string,
  token?: string
): Promise<GeoResponse> {
  const url = ip
    ? `${API_URL}${API_ENDPOINTS.GEO}?ip=${encodeURIComponent(ip)}`
    : `${API_URL}${API_ENDPOINTS.GEO}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  // Check if response is ok before parsing JSON
  if (!response.ok) {
    let errorMessage = "Failed to fetch geolocation";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || `HTTP ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
}

/**
 * Get user's search history
 */
export async function getHistory(
  token: string
): Promise<{ success: boolean; data: HistoryItem[] }> {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.HISTORY}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch search history");
  }

  return data;
}

/**
 * Save IP to search history
 */
export async function saveHistory(
  ip: string,
  token: string,
  city?: string,
  country?: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}${API_ENDPOINTS.HISTORY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ip, city, country }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to save search history");
  }

  return data;
}

/**
 * Delete search history items
 */
export async function deleteHistory(
  ips: string[],
  token: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}/api/history`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ips }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete search history");
  }

  return data;
}
