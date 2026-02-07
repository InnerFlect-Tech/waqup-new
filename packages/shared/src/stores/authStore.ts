import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { AuthStore, AuthActions, AuthState } from '../types/auth';
import { createAuthService, type AuthService } from '../services/auth/authService';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Auth Store Factory - Creates Zustand store for auth state management
 * Platform-specific: Each platform creates its own store instance with its Supabase client
 */

export interface CreateAuthStoreOptions {
  client: SupabaseClient;
  storage?: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
}

const AUTH_STORAGE_KEY = 'waqup_auth_state';

export function createAuthStore(options: CreateAuthStoreOptions) {
  const { client, storage } = options;
  const authService = createAuthService(client);

  // Initial state
  const initialState: AuthState = {
    user: null,
    session: null,
    isLoading: true,
    error: null,
    isInitialized: false,
  };

  // Create Zustand store
  const useAuthStore = create<AuthStore>((set, get) => ({
    ...initialState,

    // Actions
    setUser: (user: User | null) => {
      set({ user });
      if (storage && user) {
        storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: user.id }));
      } else if (storage && !user) {
        storage.removeItem(AUTH_STORAGE_KEY);
      }
    },

    setSession: (session: Session | null) => {
      set({ session, user: session?.user ?? null });
      if (storage && session) {
        storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: session.user.id }));
      } else if (storage && !session) {
        storage.removeItem(AUTH_STORAGE_KEY);
      }
    },

    clearAuth: () => {
      set({
        user: null,
        session: null,
        error: null,
      });
      if (storage) {
        storage.removeItem(AUTH_STORAGE_KEY);
      }
    },

    setLoading: (isLoading: boolean) => {
      set({ isLoading });
    },

    setError: (error: string | null) => {
      set({ error });
    },

    setInitialized: (isInitialized: boolean) => {
      set({ isInitialized });
    },

    // Auth operations
    login: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      const result = await authService.login({ email, password });
      
      if (result.success && result.data) {
        set({
          session: result.data,
          user: result.data.user,
          isLoading: false,
          error: null,
        });
        return { success: true, error: null };
      } else {
        set({
          isLoading: false,
          error: result.error || 'Login failed',
        });
        return { success: false, error: result.error };
      }
    },

    signup: async (email: string, password: string) => {
      set({ isLoading: true, error: null });
      const result = await authService.signup({
        email,
        password,
        confirmPassword: password,
        acceptTerms: true,
      });
      
      if (result.success && result.data) {
        set({
          user: result.data.user,
          isLoading: false,
          error: null,
        });
        return { success: true, error: null };
      } else {
        set({
          isLoading: false,
          error: result.error || 'Signup failed',
        });
        return { success: false, error: result.error };
      }
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      const result = await authService.logout();
      
      if (result.success) {
        get().clearAuth();
        set({ isLoading: false });
        return { success: true, error: null };
      } else {
        set({
          isLoading: false,
          error: result.error || 'Logout failed',
        });
        return { success: false, error: result.error };
      }
    },

    requestPasswordReset: async (email: string, redirectTo?: string) => {
      set({ isLoading: true, error: null });
      const result = await authService.requestPasswordReset({ email }, redirectTo);
      
      if (result.success) {
        set({ isLoading: false, error: null });
        return { success: true, error: null };
      } else {
        set({
          isLoading: false,
          error: result.error || 'Failed to send reset email',
        });
        return { success: false, error: result.error };
      }
    },

    resetPassword: async (password: string) => {
      set({ isLoading: true, error: null });
      // Note: Supabase handles the token from URL hash fragments automatically
      // The user must be authenticated via the reset link for this to work
      const result = await authService.resetPassword({
        password,
        confirmPassword: password,
        token: '', // Token is handled by Supabase from URL hash
      });
      
      if (result.success) {
        set({ isLoading: false, error: null });
        return { success: true, error: null };
      } else {
        set({
          isLoading: false,
          error: result.error || 'Failed to reset password',
        });
        return { success: false, error: result.error };
      }
    },

    resendVerificationEmail: async (email: string) => {
      set({ isLoading: true, error: null });
      const result = await authService.resendVerificationEmail(email);
      
      if (result.success) {
        set({ isLoading: false, error: null });
        return { success: true, error: null };
      } else {
        set({
          isLoading: false,
          error: result.error || 'Failed to resend verification email',
        });
        return { success: false, error: result.error };
      }
    },

    getCurrentSession: async () => {
      const result = await authService.getCurrentSession();
      return {
        success: result.success,
        error: result.error,
        data: result.data,
      };
    },

    // Initialize auth state
    initializeAuth: async () => {
      set({ isLoading: true, error: null });
      
      try {
        // Get current session
        const sessionResult = await authService.getCurrentSession();
        
        if (sessionResult.success && sessionResult.data) {
          set({
            session: sessionResult.data,
            user: sessionResult.data.user,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        } else {
          set({
            session: null,
            user: null,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        }

        // Set up auth state listener
        const unsubscribe = authService.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            get().setSession(session);
          } else if (event === 'SIGNED_OUT') {
            get().clearAuth();
          }
        });

        // Store unsubscribe function for cleanup
        return unsubscribe;
      } catch (error: any) {
        set({
          isLoading: false,
          isInitialized: true,
          error: error.message || 'Failed to initialize auth',
        });
        return () => {}; // Return no-op unsubscribe
      }
    },
  }));

  return useAuthStore;
}

// Export type for platforms to use
export type UseAuthStore = ReturnType<typeof createAuthStore>;
