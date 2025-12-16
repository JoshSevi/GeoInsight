import { Request } from "express";

/**
 * Extended Request interface with authentication data
 */
export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

/**
 * User data structure
 */
export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

/**
 * Search history entry
 */
export interface SearchHistory {
  id: string;
  user_id: string;
  ip_address: string;
  city: string | null;
  country: string | null;
  created_at: string;
}

/**
 * IP Geolocation data from IPInfo
 */
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

/**
 * Login request body
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Signup request body
 */
export interface SignupRequest {
  email: string;
  password: string;
}

/**
 * History create request body
 */
export interface HistoryCreateRequest {
  ip: string;
  city?: string;
  country?: string;
}

/**
 * History delete request body
 */
export interface HistoryDeleteRequest {
  ips?: string[];
  ids?: string[]; // Support deletion by unique IDs for precision
}
