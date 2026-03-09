/**
 * Navigation Type Definitions for Mobile App
 * Defines all navigation routes and their parameters
 */

import type { ContentItemType } from '@waqup/shared/types';

export type { ContentItemType };

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Showcase: undefined;
  Health: undefined;
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
  Speak: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  ContentDetail: { contentId: string; contentType: ContentItemType };
  CreateMode: { contentType: ContentItemType };
  ContentCreate: { contentType: ContentItemType; mode: 'form' | 'chat' | 'agent' };
  ContentEdit: { contentId: string; contentType: ContentItemType };
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
