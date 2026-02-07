import type { SupabaseClient, User, Session } from '@supabase/supabase-js';
import type {
  LoginCredentials,
  SignupData,
  ForgotPasswordData,
  ResetPasswordData,
  AuthServiceResult,
} from '../../types/auth';

/**
 * Authentication Service - Shared across platforms
 * Provides auth operations using Supabase Auth
 */

export interface AuthService {
  login: (credentials: LoginCredentials) => Promise<AuthServiceResult<Session>>;
  signup: (data: SignupData) => Promise<AuthServiceResult<{ user: User }>>;
  logout: () => Promise<AuthServiceResult<void>>;
  getCurrentSession: () => Promise<AuthServiceResult<Session>>;
  getCurrentUser: () => Promise<AuthServiceResult<User>>;
  requestPasswordReset: (data: ForgotPasswordData) => Promise<AuthServiceResult<void>>;
  resetPassword: (data: ResetPasswordData) => Promise<AuthServiceResult<void>>;
  resendVerificationEmail: (email: string) => Promise<AuthServiceResult<void>>;
  onAuthStateChange: (
    callback: (event: string, session: Session | null) => void
  ) => () => void;
}

/**
 * Create auth service instance
 */
export function createAuthService(client: SupabaseClient): AuthService {
  return {
    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<AuthServiceResult<Session>> {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          return {
            success: false,
            error: error.message || 'Login failed. Please check your credentials.',
            data: null,
          };
        }

        return {
          success: true,
          error: null,
          data: data.session,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred during login.',
          data: null,
        };
      }
    },

    /**
     * Sign up with email and password
     */
    async signup(data: SignupData): Promise<AuthServiceResult<{ user: User }>> {
      try {
        const { data: authData, error } = await client.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: undefined, // Will handle email verification separately
          },
        });

        if (error) {
          return {
            success: false,
            error: error.message || 'Signup failed. Please try again.',
            data: null,
          };
        }

        if (!authData.user) {
          return {
            success: false,
            error: 'Failed to create user account.',
            data: null,
          };
        }

        return {
          success: true,
          error: null,
          data: { user: authData.user },
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred during signup.',
          data: null,
        };
      }
    },

    /**
     * Logout current user
     */
    async logout(): Promise<AuthServiceResult<void>> {
      try {
        const { error } = await client.auth.signOut();

        if (error) {
          return {
            success: false,
            error: error.message || 'Logout failed. Please try again.',
            data: null,
          };
        }

        return {
          success: true,
          error: null,
          data: undefined,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred during logout.',
          data: null,
        };
      }
    },

    /**
     * Get current session
     */
    async getCurrentSession(): Promise<AuthServiceResult<Session>> {
      try {
        const { data, error } = await client.auth.getSession();

        if (error) {
          return {
            success: false,
            error: error.message || 'Failed to get session.',
            data: null,
          };
        }

        return {
          success: true,
          error: null,
          data: data.session,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred.',
          data: null,
        };
      }
    },

    /**
     * Get current user
     */
    async getCurrentUser(): Promise<AuthServiceResult<User>> {
      try {
        const { data, error } = await client.auth.getUser();

        if (error) {
          return {
            success: false,
            error: error.message || 'Failed to get user.',
            data: null,
          };
        }

        if (!data.user) {
          return {
            success: false,
            error: 'No user found.',
            data: null,
          };
        }

        return {
          success: true,
          error: null,
          data: data.user,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred.',
          data: null,
        };
      }
    },

    /**
     * Request password reset email
     */
    async requestPasswordReset(
      data: ForgotPasswordData,
      redirectTo?: string
    ): Promise<AuthServiceResult<void>> {
      try {
        const { error } = await client.auth.resetPasswordForEmail(data.email, {
          redirectTo: redirectTo,
        });

        if (error) {
          return {
            success: false,
            error: error.message || 'Failed to send password reset email.',
            data: null,
          };
        }

        return {
          success: true,
          error: null,
          data: undefined,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred.',
          data: null,
        };
      }
    },

    /**
     * Reset password
     * Note: Supabase handles the token from URL hash fragments automatically.
     * The user must access this after clicking the reset link in their email.
     */
    async resetPassword(data: ResetPasswordData): Promise<AuthServiceResult<void>> {
      try {
        // Check if we have a session (user clicked reset link)
        const { data: sessionData } = await client.auth.getSession();
        
        if (!sessionData.session) {
          return {
            success: false,
            error: 'Invalid or expired reset link. Please request a new password reset.',
            data: null,
          };
        }

        const { error } = await client.auth.updateUser({
          password: data.password,
        });

        if (error) {
          return {
            success: false,
            error: error.message || 'Failed to reset password.',
            data: null,
          };
        }

        return {
          success: true,
          error: null,
          data: undefined,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred.',
          data: null,
        };
      }
    },

    /**
     * Resend verification email
     */
    async resendVerificationEmail(email: string): Promise<AuthServiceResult<void>> {
      try {
        const { error } = await client.auth.resend({
          type: 'signup',
          email: email,
        });

        if (error) {
          return {
            success: false,
            error: error.message || 'Failed to resend verification email.',
            data: null,
          };
        }

        return {
          success: true,
          error: null,
          data: undefined,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'An unexpected error occurred.',
          data: null,
        };
      }
    },

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(
      callback: (event: string, session: Session | null) => void
    ): () => void {
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((event, session) => {
        callback(event, session);
      });

      return () => {
        subscription.unsubscribe();
      };
    },
  };
}
