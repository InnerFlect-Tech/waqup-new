/**
 * Content types - shared across web, iOS, Android
 */

export type ContentItemType = 'affirmation' | 'ritual' | 'meditation';

export type ContentStatus = 'draft' | 'processing' | 'ready' | 'failed';

export type VoiceType = 'elevenlabs' | 'tts' | 'recorded' | 'ai';

export interface AudioSettings {
  volumeVoice?: number;
  volumeAmbient?: number;
  volumeMaster?: number;
}

export interface ContentItem {
  id: string;
  type: ContentItemType;
  title: string;
  description: string;
  duration: string;
  frequency?: string;
  lastPlayed?: string;
  script?: string;
  status?: ContentStatus;
  audioUrl?: string;
  voiceType?: VoiceType;
  audioSettings?: AudioSettings;
  createdAt?: string;
  updatedAt?: string;
}
