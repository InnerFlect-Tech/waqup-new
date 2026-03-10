import { z } from 'zod';

/**
 * Authentication Validation Schemas - Shared across platforms
 * Using Zod for consistent validation
 */

/**
 * Validation error messages use translation keys from auth.validation.*
 * Forms should call t(error.message) to render the translated string.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'validation.emailRequired')
    .email('validation.emailInvalid'),
  password: z
    .string()
    .min(1, 'validation.passwordRequired')
    .min(6, 'validation.passwordMinLength'),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, 'validation.emailRequired')
      .email('validation.emailInvalid'),
    password: z
      .string()
      .min(1, 'validation.passwordRequired')
      .min(6, 'validation.passwordMinLength')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'validation.passwordComplexity'
      ),
    confirmPassword: z.string().min(1, 'validation.confirmPasswordRequired'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'validation.acceptTermsRequired',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordsMustMatch',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'validation.emailRequired')
    .email('validation.emailInvalid'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'validation.passwordRequired')
      .min(6, 'validation.passwordMinLength')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'validation.passwordComplexity'
      ),
    confirmPassword: z.string().min(1, 'validation.confirmPasswordRequired'),
    token: z.string().min(1, 'validation.resetTokenRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordsMustMatch',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
