/**
 * Voice library types — shared across web and mobile.
 * Represents cloned voices of people the user cares about.
 */

export type VoiceRelationship =
  | 'self'
  | 'family'
  | 'friend'
  | 'teacher'
  | 'mentor'
  | 'partner'
  | 'other';

export interface UserVoice {
  id: string;
  user_id: string;
  elevenlabs_voice_id: string;
  name: string;
  relationship: VoiceRelationship;
  description?: string;
  avatar_color?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateUserVoiceInput {
  name: string;
  relationship: VoiceRelationship;
  description?: string;
  avatar_color?: string;
}

/** Display metadata for each relationship type */
export const RELATIONSHIP_META: Record<
  VoiceRelationship,
  { label: string; color: string; emoji: string; subtitle: string }
> = {
  self:    { label: 'Myself',  color: '#7c3aed', emoji: '✦', subtitle: 'Your own voice' },
  family:  { label: 'Family',  color: '#f43f5e', emoji: '♥', subtitle: 'Those who shaped you' },
  friend:  { label: 'Friend',  color: '#f59e0b', emoji: '✦', subtitle: 'Those who walk with you' },
  teacher: { label: 'Teacher', color: '#06b6d4', emoji: '◈', subtitle: 'Those who guided your mind' },
  mentor:  { label: 'Mentor',  color: '#8b5cf6', emoji: '◈', subtitle: 'Those who shaped your path' },
  partner: { label: 'Partner', color: '#ec4899', emoji: '♥', subtitle: 'Those closest to your heart' },
  other:   { label: 'Other',   color: '#64748b', emoji: '◦', subtitle: 'A voice worth keeping' },
};
