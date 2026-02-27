import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from '@react-native-firebase/firestore';
import { QueryClient, useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/store/useAuthStore';

export const profileKeys = {
  all: ['profile'] as const,
  detail: (userId: string) => [...profileKeys.all, userId] as const,
};

export interface Profile {
  account: string;
  createdAt: number;
  email: string;
  id: string;
  name: string;
}

const getProfile = async (userId: string) => {
  const db = getFirestore();
  const q = query(collection(db, 'information'), where('id', '==', userId), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return snapshot.docs[0].data() as unknown as Profile;
};

export const useProfile = () => {
  const userId = useAuthStore((state) => state.user?.uid);

  return useQuery({
    queryKey: profileKeys.detail(userId ?? ''),
    queryFn: async () => {
      if (!userId) return null;

      return getProfile(userId);
    },
    enabled: !!userId,
  });
};

export const prefetchProfile = async (queryClient: QueryClient) => {
  const userId = useAuthStore.getState().user?.uid;

  if (!userId) return;

  return queryClient.prefetchQuery({
    queryKey: profileKeys.detail(userId ?? ''),
    queryFn: () => getProfile(userId),
  });
};
