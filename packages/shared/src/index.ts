/**
 * @waqup/shared
 * 
 * Shared code for waQup multi-platform application
 * 
 * This package contains:
 * - Services: API services (Supabase, OpenAI, Stripe)
 * - Stores: Zustand stores (auth, UI, preferences)
 * - Types: TypeScript types (shared across platforms)
 * - Utils: Utility functions
 * - Schemas: Zod validation schemas
 * 
 * IMPORTANT: This is the SINGLE SOURCE OF TRUTH for business logic.
 * NEVER duplicate code from this package in platform-specific code.
 */

// Export services
export * from './services/index';

// Export stores
export * from './stores/index';

// Export types
export * from './types/index';

// Export utils
export * from './utils/index';

// Export schemas
export * from './schemas/index';
