import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export function useAuthListener() {
  const { setUser, setLoading, user, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, setLoading, setUser]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, router]);
}
