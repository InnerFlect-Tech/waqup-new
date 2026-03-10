import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/theme';
import {
  OnboardingIntentionScreen,
  OnboardingProfileScreen,
  OnboardingPreferencesScreen,
  OnboardingGuideScreen,
} from '@/screens/onboarding';
import type { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
      }}
      initialRouteName="OnboardingIntention"
    >
      <Stack.Screen name="OnboardingIntention" component={OnboardingIntentionScreen} />
      <Stack.Screen name="OnboardingProfile" component={OnboardingProfileScreen} />
      <Stack.Screen name="OnboardingPreferences" component={OnboardingPreferencesScreen} />
      <Stack.Screen name="OnboardingGuide" component={OnboardingGuideScreen} />
    </Stack.Navigator>
  );
}
