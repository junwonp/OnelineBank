import { useEffect } from 'react';
import { Platform } from 'react-native';
import { addEventListener } from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

const useOnlineManager = () => {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return addEventListener((state) => {
        onlineManager.setOnline(
          state.isConnected != null && state.isConnected && Boolean(state.isInternetReachable),
        );
      });
    }

    return undefined;
  }, []);
};

export default useOnlineManager;
