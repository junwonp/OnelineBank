import { ReactNode, Ref, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ColorValue, Pressable, StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import Animated, {
  type AnimatedStyle,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import useLatestCallback from 'use-latest-callback';
import Ionicons from '@expo/vector-icons/Ionicons';

import Text from '@/components/ui/text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SnackbarProps extends Omit<ViewProps, 'style'> {
  action?: { label: string; onPress?: () => void } & Record<string, unknown>;
  children: ReactNode;
  duration?: number;
  icon?: keyof typeof Ionicons.glyphMap;
  iconAccessibilityLabel?: string;
  maxFontSizeMultiplier?: number;
  onDismiss: () => void;
  onIconPress?: () => void;
  ref?: Ref<View>;
  rippleColor?: ColorValue;
  visible: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}

const DURATION_SHORT = 4000;
const DURATION_MEDIUM = 7000;
const DURATION_LONG = 10000;

const Snackbar = ({
  visible,
  action,
  icon,
  onIconPress,
  iconAccessibilityLabel = '닫기',
  duration = DURATION_MEDIUM,
  onDismiss,
  children,
  wrapperStyle,
  style,
  maxFontSizeMultiplier,
  ...rest
}: SnackbarProps) => {
  const insets = useSafeAreaInsets();
  const [hidden, setHidden] = useState(!visible);

  const opacity = useSharedValue(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleVisibleFinished = (finished?: boolean) => {
    if (finished) {
      const isInfinity =
        duration === Number.POSITIVE_INFINITY || duration === Number.NEGATIVE_INFINITY;

      if (!isInfinity) {
        hideTimeout.current = setTimeout(onDismiss, duration);
      }
    }
  };

  const handleOnVisible = useLatestCallback(() => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setHidden(false);

    opacity.set(
      withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }, (finished) => {
        scheduleOnRN(handleVisibleFinished, finished);
      }),
    );
  });

  const handleOnHidden = useLatestCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    opacity.set(
      withTiming(0, { duration: 100 }, (finished) => {
        if (finished) {
          scheduleOnRN(setHidden, true);
        }
      }),
    );
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: visible ? interpolate(opacity.get(), [0, 1], [0.9, 1]) : 1 }],
    opacity: opacity.get(),
  }));

  const { label: actionLabel, onPress: onPressAction, ...actionProps } = action ?? {};
  const marginLeft = action ? -12 : -16;

  const renderChildrenWithWrapper = () => {
    if (typeof children === 'string') {
      return (
        <Text className="text-on-tooltip flex-1" maxFontSizeMultiplier={maxFontSizeMultiplier}>
          {children}
        </Text>
      );
    }

    return (
      <View className="mx-4 my-3.5 flex-1">
        <View>{children}</View>
      </View>
    );
  };

  useEffect(
    () => () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    },
    [],
  );

  useLayoutEffect(() => {
    if (visible) {
      handleOnVisible();
    } else {
      handleOnHidden();
    }
  }, [visible, handleOnVisible, handleOnHidden]);

  if (hidden) {
    return null;
  }

  return (
    <View
      accessibilityLabel="Snackbar"
      accessibilityRole="alert"
      className="absolute bottom-0 w-full px-4"
      pointerEvents="box-none"
      style={[{ paddingBottom: insets.bottom }, wrapperStyle]}
    >
      <AnimatedPressable
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        className="bg-tooltip m-2 min-h-12 flex-row items-center justify-between rounded-2xl"
        onPress={onDismiss}
        pointerEvents={action ? 'box-none' : 'auto'}
        style={[animatedStyle, style]}
        {...rest}
      >
        {renderChildrenWithWrapper()}
        {action ? (
          <View className="min-h-12 flex-row items-center justify-end" style={{ marginLeft }}>
            <Pressable
              onPress={() => {
                onPressAction?.();
                onDismiss();
              }}
              className="mr-2 ml-1 py-2"
              {...actionProps}
            >
              <Text className="text-on-tooltip text-md font-medium">{actionLabel}</Text>
            </Pressable>
            {onIconPress ? (
              <Pressable
                onPress={onIconPress}
                className="h-10 w-10 items-center justify-center"
                accessibilityLabel={iconAccessibilityLabel}
              >
                <Ionicons name={icon ?? 'close'} size={24} color="#f1f1f1" />
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </AnimatedPressable>
    </View>
  );
};

Snackbar.DURATION_SHORT = DURATION_SHORT;
Snackbar.DURATION_MEDIUM = DURATION_MEDIUM;
Snackbar.DURATION_LONG = DURATION_LONG;

export default Snackbar;
