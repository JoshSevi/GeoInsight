import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { login: loginAPI } = await import('../lib/api');
    const response = await loginAPI(email, password);

    // Handle new standardized response format (data.token, data.user)
    // or legacy format (token, user) for backward compatibility
    const token = response.data?.token || response.token;
    const user = response.data?.user || response.user;

    if (response.success && token && user) {
      setToken(token);
      setUser(user);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const signup = async (email: string, password: string) => {
    const { signup: signupAPI } = await import('../lib/api');
    const response = await signupAPI(email, password);

    // Handle new standardized response format (data.token, data.user)
    // or legacy format (token, user) for backward compatibility
    const token = response.data?.token || response.token;
    const user = response.data?.user || response.user;

    if (response.success && token && user) {
      setToken(token);
      setUser(user);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      throw new Error(response.message || 'Signup failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

