/**
 * Services - API services for Supabase, OpenAI, Stripe, etc.
 * 
 * All API calls MUST be in this directory.
 * Platforms import from here: import { getContent } from '@waqup/shared/services'
 */

// Supabase services
export * from './supabase';

// Auth services
export * from './auth/authService';

// AI services will be added here
// export * from './ai';

// Payment services will be added here
// export * from './payments';
