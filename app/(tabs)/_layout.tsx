import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { prefetchProfile } from '@/features/profile/api';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();

  useEffect(() => {
    prefetchProfile(queryClient);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '채팅',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bubble.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account-list"
        options={{
          title: '주소록',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '내 정보',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
