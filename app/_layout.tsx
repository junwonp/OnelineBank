import { useEffect } from 'react';
import { AppStateStatus, Platform } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Stack } from 'expo-router';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { focusManager } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import 'react-native-reanimated';
import '../global.css';

import { useAuthListener } from '@/features/auth/hooks/useAuthListener';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import useAppState from '@/hooks/use-app-state';
import { useColorScheme } from '@/hooks/use-color-scheme';
import useOnlineManager from '@/hooks/use-online-manager';
import queryClient from '@/lib/query-client';
import { clientPersister } from '@/lib/storage';

preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useAuthListener();

  const isLoading = useAuthStore((state) => state.isLoading);
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const colorScheme = useColorScheme();

  useAppState((status: AppStateStatus) => {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  });
  useOnlineManager();

  useEffect(() => {
    if (!isLoading) {
      hideAsync();
    }
  }, [isLoading]);

  return (
    <KeyboardProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: clientPersister,
          }}
        >
          <Stack>
            <Stack.Protected guard={isLoggedIn}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack.Protected>
            <Stack.Protected guard={!isLoggedIn}>
              <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
            </Stack.Protected>
          </Stack>
          <StatusBar style="auto" />
        </PersistQueryClientProvider>
      </ThemeProvider>
    </KeyboardProvider>
  );
}
