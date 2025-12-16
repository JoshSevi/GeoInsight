const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface GeoResponse {
  success: boolean;
  data?: {
    ip: string;
    city?: string;
    region?: string;
    country?: string;
    loc?: string;
    postal?: string;
    timezone?: string;
  };
  message?: string;
}

/**
 * Login API call
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

/**
 * Get geolocation for current user or specified IP
 */
export async function getGeo(ip?: string): Promise<GeoResponse> {
  const url = ip
    ? `${API_URL}/api/geo?ip=${encodeURIComponent(ip)}`
    : `${API_URL}/api/geo`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch geolocation');
  }

  return data;
}

