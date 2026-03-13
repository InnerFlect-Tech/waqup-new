/**
 * Centralised error handling utilities - shared across platforms
 */

export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_EMAIL_NOT_CONFIRMED'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_EMAIL_ALREADY_EXISTS'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'INSUFFICIENT_CREDITS'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export interface AppError {
  code: AppErrorCode;
  message: string;
  details?: unknown;
}

/**
 * Map Supabase / HTTP errors to user-friendly AppError objects
 */
export function mapToAppError(error: unknown): AppError {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
      return { code: 'AUTH_INVALID_CREDENTIALS', message: 'Incorrect email or password. Please try again.' };
    }
    if (msg.includes('email not confirmed')) {
      return { code: 'AUTH_EMAIL_NOT_CONFIRMED', message: 'Please verify your email before signing in.' };
    }
    if (msg.includes('user already registered') || msg.includes('already been registered')) {
      return { code: 'AUTH_EMAIL_ALREADY_EXISTS', message: 'An account with this email already exists.' };
    }
    if (msg.includes('jwt expired') || msg.includes('session expired') || msg.includes('refresh token')) {
      return { code: 'AUTH_SESSION_EXPIRED', message: 'Your session has expired. Please sign in again.' };
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('connection')) {
      return { code: 'NETWORK_ERROR', message: 'Check your internet connection and try again.' };
    }
    if (msg.includes('timeout')) {
      return { code: 'TIMEOUT', message: 'Request timed out. Please try again.' };
    }
    if (msg.includes('permission') || msg.includes('unauthorized') || msg.includes('forbidden')) {
      return { code: 'PERMISSION_DENIED', message: 'You don\'t have permission to do that.' };
    }
    if (msg.includes('not found')) {
      return { code: 'NOT_FOUND', message: 'The requested resource was not found.' };
    }
    if (msg.includes('insufficient credits') || msg.includes('not enough credits')) {
      return { code: 'INSUFFICIENT_CREDITS', message: 'You don\'t have enough Qs for this action.' };
    }
    if (msg.includes('rate limit') || msg.includes('too many requests')) {
      return { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a moment and try again.' };
    }

    return { code: 'UNKNOWN', message: error.message || 'Something went wrong. Please try again.', details: error };
  }

  if (typeof error === 'string') {
    return mapToAppError(new Error(error));
  }

  return { code: 'UNKNOWN', message: 'Something went wrong. Please try again.', details: error };
}

/**
 * Returns true if the error should trigger an automatic retry
 */
export function isRetryableError(error: AppError): boolean {
  return ['NETWORK_ERROR', 'TIMEOUT', 'SERVER_ERROR', 'RATE_LIMITED'].includes(error.code);
}

/**
 * Returns true if the error means the user should be redirected to login
 */
export function isAuthError(error: AppError): boolean {
  return ['AUTH_SESSION_EXPIRED', 'PERMISSION_DENIED'].includes(error.code);
}

/**
 * Returns true if the error indicates an invalid or expired refresh token.
 * When true, the app should clear the session and show login (no user-facing error).
 */
export function isInvalidRefreshTokenError(error: unknown): boolean {
  const msg =
    error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  const lower = String(msg).toLowerCase();
  return (
    lower.includes('invalid refresh token') ||
    lower.includes('refresh token not found') ||
    lower.includes('refresh_token_not_found')
  );
}

/**
 * Safely logs an error (avoids logging sensitive data in production)
 */
export function logError(context: string, error: unknown): void {
  const appError = mapToAppError(error);
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${context}] ${appError.code}: ${appError.message}`, appError.details ?? '');
  }
}
