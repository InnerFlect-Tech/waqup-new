import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

/**
 * Authentication Types - Shared across platforms
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface AuthState {
  user: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface AuthActions {
  setUser: (user: SupabaseUser | null) => void;
  setSession: (session: Session | null) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (isInitialized: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<{ success: boolean; error: string | null }>;
  requestPasswordReset: (email: string, redirectTo?: string) => Promise<{ success: boolean; error: string | null }>;
  resetPassword: (password: string) => Promise<{ success: boolean; error: string | null }>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; error: string | null }>;
  getCurrentSession: () => Promise<{ success: boolean; error: string | null; data: Session | null }>;
  initializeAuth: () => Promise<() => void>;
}

export interface AuthStore extends AuthState, AuthActions {}

export interface AuthServiceResult<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
