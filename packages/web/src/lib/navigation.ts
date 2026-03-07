/**
 * Shared navigation config - menu items, quick actions
 */

import type { LucideIcon } from 'lucide-react';
import { Sparkles, Bell, GraduationCap, Library, TrendingUp, CreditCard, Settings, Plus, BookOpen, Shield } from 'lucide-react';

export interface MenuItem {
  name: string;
  description: string;
  icon: LucideIcon;
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
  { name: 'Library', description: 'Your rituals and affirmations', icon: Library, href: '/library', count: 0 },
  { name: 'Progress', description: 'Track your transformation journey', icon: TrendingUp, href: '/sanctuary/progress' },
  { name: 'Credits', description: 'Manage your credits', icon: CreditCard, href: '/sanctuary/credits', count: 50 },
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
  { name: 'Credits', description: 'View and manage your credits', icon: CreditCard, href: '/sanctuary/credits' },
  { name: 'Privacy & Security', description: 'Manage your privacy settings', icon: Shield, href: '/sanctuary/settings' },
];

export const SANCTUARY_QUICK_ACTIONS: QuickAction[] = [
  { name: 'Create New', description: 'Start a new ritual or affirmation', icon: Plus, href: '/create' },
  { name: 'Set Reminder', description: 'Schedule your practice', icon: Bell, href: '/sanctuary/reminders' },
  { name: 'Learn & Transform', description: 'Understand the science of transformation', icon: BookOpen, href: '/sanctuary/learn' },
];
