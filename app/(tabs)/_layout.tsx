import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import AppTabs from '@/components/app-tabs';
import { prefetchProfile } from '@/features/profile/api';

export default function TabLayout() {
  const queryClient = useQueryClient();

  useEffect(() => {
    prefetchProfile(queryClient);
  }, []);

  return <AppTabs />;
}
