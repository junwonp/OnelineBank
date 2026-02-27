import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'document',
});

export const cacheStorage = createMMKV({
  id: 'cache',
});

export const settingsStorage = createMMKV({
  id: 'settings',
});

export const clientStorage = {
  setItem: (key: string, value: string) => {
    cacheStorage.set(key, value);
  },
  getItem: (key: string) => {
    const value = cacheStorage.getString(key);
    return value ?? null;
  },
  removeItem: (key: string) => {
    cacheStorage.remove(key);
  },
};
