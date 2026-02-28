import { createContext, ReactNode, useContext, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import Snackbar from '@/components/ui/snackbar';
import Text from '@/components/ui/text';

const TOAST_COLORS = {
  light: {
    error: '#d32f2f',
    warning: '#f59e0b',
    success: '#22c55e',
  },
  dark: {
    error: '#f44336',
    warning: '#fbbf24',
    success: '#4ade80',
  },
} as const;

export type ToastMode = 'error' | 'warning' | 'success';

const SnackbarContext = createContext<{
  setSnackbarMessage: (
    message: string,
    options?: {
      mode?: ToastMode;
    },
  ) => void;
} | null>(null);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
}

const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
  const { bottom } = useSafeAreaInsets();
  const colors = TOAST_COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<ToastMode>('warning');
  const [open, setOpen] = useState(false);

  const handleDismiss = () => {
    setOpen(false);
    setMessage('');
  };

  const setSnackbarMessage = (
    newMessage: string,
    options?: {
      mode?: ToastMode;
    },
  ) => {
    setMessage(newMessage);
    setMode(options?.mode ?? 'warning');
    setOpen(true);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const keyboard = keyboardHeight.get();
    return {
      marginBottom: keyboard ? -(keyboard + bottom) + 8 : 8,
    };
  });

  const contextValue = { setSnackbarMessage };

  const iconName =
    mode === 'error' ? 'ban' : mode === 'warning' ? 'alert-circle' : 'checkmark-circle';

  const iconColor =
    mode === 'error' ? colors.error : mode === 'warning' ? colors.warning : colors.success;

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {open || message ? (
        <Animated.View
          className="absolute right-0 bottom-0 left-0"
          pointerEvents="box-none"
          style={animatedStyle}
        >
          <Snackbar
            duration={Snackbar.DURATION_SHORT}
            onDismiss={handleDismiss}
            visible={!!(open && message)}
          >
            <View className="flex-row items-center gap-4">
              <Ionicons name={iconName} size={24} color={iconColor} />
              <Text className="text- text-on-tooltip flex-1 self-center">{message}</Text>
            </View>
          </Snackbar>
        </Animated.View>
      ) : null}
    </SnackbarContext.Provider>
  );
};

export { SnackbarContext, SnackbarProvider };
