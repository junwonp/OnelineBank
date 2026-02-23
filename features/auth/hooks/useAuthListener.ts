import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';

import { useAuthStore } from '@/features/auth/store/useAuthStore';

export function useAuthListener() {
  const { setUser, setLoading } = useAuthStore();

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, setLoading, setUser]);
}
