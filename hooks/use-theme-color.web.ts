import { useSyncExternalStore } from 'react';

function readThemeColor(name: string): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || undefined;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const observer = new MutationObserver(onStoreChange);

  media.addEventListener('change', onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style'],
  });

  return () => {
    media.removeEventListener('change', onStoreChange);
    observer.disconnect();
  };
}

export default function useThemeColor(name: string): string | undefined {
  return useSyncExternalStore(
    subscribe,
    () => readThemeColor(name),
    () => undefined,
  );
}
