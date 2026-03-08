import { z } from 'zod';

export const contentTypeSchema = z.enum(['affirmation', 'meditation', 'ritual']);

export const intentSchema = z
  .string()
  .min(10, 'Please describe your intent in at least 10 characters')
  .max(300, 'Keep your intent under 300 characters');

export const contextSchema = z
  .string()
  .max(250, 'Context must be under 250 characters')
  .optional();

export const personalizationSchema = z.object({
  coreValues: z.array(z.string()).min(1, 'Choose at least one core value').max(3).optional(),
  name: z.string().max(40).optional(),
  whyThisMatters: z.string().max(300).optional(),
});

export const affirmationCreationSchema = z.object({
  type: z.literal('affirmation'),
  intent: intentSchema,
  context: contextSchema,
});

export const meditationCreationSchema = z.object({
  type: z.literal('meditation'),
  intent: intentSchema,
  context: contextSchema,
});

export const ritualCreationSchema = z.object({
  type: z.literal('ritual'),
  intent: intentSchema,
  context: contextSchema,
  personalization: personalizationSchema.optional(),
});

export const scriptGenerationSchema = z.object({
  type: contentTypeSchema,
  intent: intentSchema,
  context: contextSchema,
  personalization: personalizationSchema.optional(),
});

export const createContentSchema = z.object({
  type: contentTypeSchema,
  title: z.string().min(1, 'Title is required').max(120),
  description: z.string().max(500).optional(),
  script: z.string().min(1, 'Script is required'),
  duration: z.string().default('5 min'),
  voiceType: z.enum(['elevenlabs', 'tts', 'recorded', 'ai']).default('ai'),
  audioUrl: z.string().url().optional(),
});

export type AffirmationCreationInput = z.infer<typeof affirmationCreationSchema>;
export type MeditationCreationInput = z.infer<typeof meditationCreationSchema>;
export type RitualCreationInput = z.infer<typeof ritualCreationSchema>;
export type ScriptGenerationSchemaInput = z.infer<typeof scriptGenerationSchema>;
export type CreateContentSchemaInput = z.infer<typeof createContentSchema>;
