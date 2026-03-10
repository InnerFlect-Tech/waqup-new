/**
 * Navigation Type Definitions for Mobile App
 * Defines all navigation routes and their parameters
 */

import type { ContentItemType } from '@waqup/shared/types';

export type { ContentItemType };

export type RootStackParamList = {
  Setup: undefined;
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
  Showcase: undefined;
  Health: undefined;
};

export type OnboardingStackParamList = {
  OnboardingIntention: undefined;
  OnboardingProfile: { intention?: string };
  OnboardingPreferences: undefined;
  OnboardingGuide: undefined;
};

export type AuthStackParamList = {
  Login: { message?: string } | undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string } | undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Marketplace: undefined;
  Speak: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  ContentDetail: { contentId: string; contentType: ContentItemType };
  ContentEdit: { contentId: string; contentType: ContentItemType };
  CreateMode: { contentType: ContentItemType };
  ContentCreate: { contentType: ContentItemType; mode: 'form' | 'chat' | 'agent' };
  Credits: undefined;
  Progress: undefined;
  Settings: undefined;
  Reminders: undefined;
};

// Helper type for navigation props
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: {
    navigate: (screen: T, params?: RootStackParamList[T]) => void;
    goBack: () => void;
  };
  route: {
    params: RootStackParamList[T];
  };
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = {
  navigation: {
    navigate: (screen: T, params?: AuthStackParamList[T]) => void;
    goBack: () => void;
  };
  route: {
    params: AuthStackParamList[T];
  };
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: {
    navigate: (screen: T, params?: MainTabParamList[T]) => void;
    jumpTo: (screen: T) => void;
  };
  route: {
    params: MainTabParamList[T];
  };
};
