import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { initDatabase } from '@/lib/db';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize database
        await initDatabase();
      } catch (e) {
        console.error('Failed to initialize:', e);
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Slopify' }} />
          <Stack.Screen name="lab" options={{ title: 'The Lab', headerShown: false }} />
          <Stack.Screen name="refinery" options={{ title: 'Refinery' }} />
          <Stack.Screen name="process" options={{ title: 'The Void', headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="result" options={{ title: 'Reveal' }} />
          <Stack.Screen name="help" options={{ title: 'Bad Advice' }} />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
