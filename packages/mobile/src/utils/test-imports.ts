/**
 * Test file to verify all dependencies are installed correctly
 * This file can be imported in App.tsx temporarily to verify imports work
 */

// Navigation imports
import type { NavigationContainerRef } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// State management from shared
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';

// Forms
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Utilities
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Storage (for Supabase)
import AsyncStorage from '@react-native-async-storage/async-storage';

// Audio (will be used later)
// import { Audio } from 'expo-av';

// UI Animations (will be used later)
// import Animated from 'react-native-reanimated';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Shared package imports (will be available once shared types are created)
// import type { User } from '@waqup/shared/types';

// Test that all imports work
export const testImports = {
  navigation: true,
  state: true,
  forms: true,
  utils: true,
  storage: true,
  // shared: true, // Will test once shared types are created
};
