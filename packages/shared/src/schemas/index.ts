/**
 * Schemas - Zod validation schemas shared across platforms
 * 
 * All validation schemas MUST be in this directory.
 * Platforms import from here: import { loginSchema, signupSchema } from '@waqup/shared/schemas'
 */

export * from './auth.schemas';

// Content schemas will be added here
// export const contentSchema = z.object({ ... });
