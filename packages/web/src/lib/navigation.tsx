/**
 * Shared navigation config - menu items, quick actions
 */

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Sparkles, Bell, GraduationCap, TrendingUp, CreditCard, Settings, Plus, BookOpen, Shield, Mic } from 'lucide-react';
import { QCoin } from '@/components';

export interface MenuItem {
  name: string;
  description: string;
  icon: LucideIcon;
  /** Optional custom icon (e.g. QCoin for Qs) - used instead of icon when present */
  iconNode?: React.ReactNode;
  href: string;
  count?: number;
}

export interface QuickAction {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const SANCTUARY_MENU_ITEMS: MenuItem[] = [
  { name: 'My Voice', description: 'Set up your cloned voice for TTS', icon: Mic, href: '/sanctuary/voice' },
  { name: 'Progress', description: 'Track your transformation journey', icon: TrendingUp, href: '/sanctuary/progress' },
  { name: 'Qs', description: 'Manage your Qs', icon: CreditCard, iconNode: <QCoin size="sm" />, href: '/sanctuary/credits', count: 50 },
  { name: 'Settings', description: 'Customize your experience', icon: Settings, href: '/sanctuary/settings' },
];

/** Home page uses Sparkles/GraduationCap; Sanctuary uses Plus/BookOpen */
export const HOME_QUICK_ACTIONS: QuickAction[] = [
  { name: 'Create New', description: 'Start a new ritual or affirmation', icon: Sparkles, href: '/create' },
  { name: 'Set Reminder', description: 'Schedule your practice', icon: Bell, href: '/sanctuary/reminders' },
  { name: 'Learn & Transform', description: 'Understand the science of transformation', icon: GraduationCap, href: '/sanctuary/learn' },
];

export const PROFILE_MENU_ITEMS: MenuItem[] = [
  { name: 'Preferences', description: 'Customize your experience', icon: Settings, href: '/sanctuary/settings' },
  { name: 'Notifications', description: 'Manage your notification settings', icon: Bell, href: '/sanctuary/reminders' },
  { name: 'Qs', description: 'View and manage your Qs', icon: CreditCard, iconNode: <QCoin size="sm" />, href: '/sanctuary/credits' },
  { name: 'Privacy & Security', description: 'Manage your privacy settings', icon: Shield, href: '/sanctuary/settings' },
];

export const SANCTUARY_QUICK_ACTIONS: QuickAction[] = [
  { name: 'Create New', description: 'Start a new ritual or affirmation', icon: Plus, href: '/create' },
  { name: 'Set Reminder', description: 'Schedule your practice', icon: Bell, href: '/sanctuary/reminders' },
  { name: 'Learn & Transform', description: 'Understand the science of transformation', icon: BookOpen, href: '/sanctuary/learn' },
];
