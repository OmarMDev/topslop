import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useCallback, useState } from 'react';
import { Appearance } from 'react-native';

const THEME_STORAGE_KEY = 'slopify_theme_preference';

type ThemePreference = 'light' | 'dark' | 'system';

export function useAppColorScheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved preference on mount
  useEffect(() => {
    async function loadPreference() {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
          setPreference(saved);
          if (saved !== 'system') {
            setColorScheme(saved);
          } else {
            // Apply system preference
            const systemScheme = Appearance.getColorScheme() || 'dark';
            setColorScheme(systemScheme);
          }
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPreference();
  }, [setColorScheme]);

  const updatePreference = useCallback(async (newPreference: ThemePreference) => {
    try {
      setPreference(newPreference);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newPreference);
      
      if (newPreference === 'system') {
        const systemScheme = Appearance.getColorScheme() || 'dark';
        setColorScheme(systemScheme);
      } else {
        setColorScheme(newPreference);
      }
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, [setColorScheme]);

  const toggleTheme = useCallback(() => {
    const nextTheme = colorScheme === 'dark' ? 'light' : 'dark';
    updatePreference(nextTheme);
  }, [colorScheme, updatePreference]);

  return {
    colorScheme,
    preference,
    isLoading,
    setPreference: updatePreference,
    toggleTheme,
    isDark: colorScheme === 'dark',
  };
}
