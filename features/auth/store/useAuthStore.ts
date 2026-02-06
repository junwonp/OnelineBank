import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { create } from 'zustand';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    set({ user: null });
  },
}));
