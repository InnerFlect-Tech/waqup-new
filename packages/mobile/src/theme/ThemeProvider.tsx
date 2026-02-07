import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, themes, defaultTheme } from './themes';

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  setTheme: (themeName: string) => void;
  availableThemes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeName?: string;
}

const THEME_STORAGE_KEY = 'waqup-theme';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultThemeName = 'mystical-purple',
}) => {
  const [themeName, setThemeName] = useState<string>(defaultThemeName);
  const [mounted, setMounted] = useState(false);

  // Load saved theme from AsyncStorage after component mounts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved && themes[saved]) {
          setThemeName(saved);
        }
      } catch (error) {
        console.error('Error loading theme from storage:', error);
      } finally {
        setMounted(true);
      }
    };
    loadTheme();
  }, []);

  const theme = themes[themeName] || defaultTheme;

  // Save theme to AsyncStorage when it changes
  useEffect(() => {
    if (mounted) {
      const saveTheme = async () => {
        try {
          await AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
        } catch (error) {
          console.error('Error saving theme to storage:', error);
        }
      };
      saveTheme();
    }
  }, [themeName, mounted]);

  const setTheme = (name: string) => {
    if (themes[name]) {
      setThemeName(name);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeName,
        setTheme,
        availableThemes: Object.keys(themes),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
