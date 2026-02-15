/**
 * Map Supabase/auth errors to user-friendly messages (production-level).
 */
export function normalizeAuthError(err: unknown): string {
  if (err == null) return 'Something went wrong. Please try again.'
  const message = err instanceof Error ? err.message : String(err)
  const lower = message.toLowerCase()

  if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
    return 'Invalid email or password. Please try again.'
  }
  if (lower.includes('email not confirmed') || lower.includes('email_not_confirmed')) {
    return 'Please confirm your email address. Check your inbox for the verification link.'
  }
  if (lower.includes('user already registered') || lower.includes('already registered')) {
    return 'An account with this email already exists. Sign in instead.'
  }
  if (lower.includes('password') && lower.includes('weak')) {
    return 'Password does not meet requirements. Use at least 8 characters with uppercase, lowercase, and a number.'
  }
  if (lower.includes('oauth') || lower.includes('google') || lower.includes('provider')) {
    return 'Sign in with Google failed. Please try again or use email and password.'
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Network error. Please check your connection and try again.'
  }
  if (message) return message
  return 'Something went wrong. Please try again.'
}
