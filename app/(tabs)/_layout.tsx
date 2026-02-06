import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { hideAsync, preventAutoHideAsync } from 'expo-splash-screen';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuthListener } from '@/features/auth/hooks/useAuthListener';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useColorScheme } from '@/hooks/use-color-scheme';

preventAutoHideAsync();

export default function TabLayout() {
  useAuthListener();
  const colorScheme = useColorScheme();

  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading) {
      hideAsync();
    }
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
