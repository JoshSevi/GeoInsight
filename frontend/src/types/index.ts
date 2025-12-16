/**
 * Shared TypeScript types and interfaces
 */

export interface User {
  id: string;
  email: string;
}

export interface GeoLocationData {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
}

export interface HistoryItem {
  id: string;
  ip_address: string;
  city?: string | null;
  country?: string | null;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginResponse extends ApiResponse {
  token?: string;
  user?: User;
  data?: {
    token: string;
    user: User;
  };
}

export interface GeoResponse extends ApiResponse {
  data?: GeoLocationData;
}

export interface HistoryResponse extends ApiResponse {
  data?: HistoryItem[];
}

