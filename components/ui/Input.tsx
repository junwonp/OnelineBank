import React, { Ref, useEffect, useState } from 'react';
import { StyleProp, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useUnstableNativeVariable } from 'nativewind';

import Text from '@/components/ui/text';
import { cn } from '@/utils/style';

interface InputProps extends TextInputProps {
  label?: string;
  isNecessary?: boolean;
  isPassword?: boolean;
  disabled?: boolean;
  limit?: number;
  containerStyle?: StyleProp<ViewStyle>;
  ref?: Ref<TextInput>;
}

const Input = ({
  label,
  isNecessary,
  onBlur,
  onFocus,
  placeholder,
  isPassword,
  disabled,
  limit,
  containerStyle,
  value,
  ref,
  ...rest
}: InputProps) => {
  const placeholderColor = useUnstableNativeVariable('--text-placeholder');
  const cursorColor = useUnstableNativeVariable('--foreground');
  const surfaceContainerColor = useUnstableNativeVariable('--background-surface-container');
  const primaryContainerColor = useUnstableNativeVariable('--primary-container');

  const [isFocused, setIsFocused] = useState(false);

  const animatedIsFocused = useSharedValue(0);

  useEffect(() => {
    animatedIsFocused.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [animatedIsFocused, isFocused]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedIsFocused.value,
      [0, 1],
      [surfaceContainerColor ?? 'transparent', primaryContainerColor ?? 'transparent'],
    ),
  }));

  const charCount = value?.length ?? 0;
  const isOverLimit = limit !== undefined && charCount > limit;

  return (
    <View className="w-full gap-1" style={containerStyle}>
      {label || limit !== undefined ? (
        <View className="w-full flex-row items-center justify-between">
          {label ? (
            <Text
              className={cn(
                'flex-1 text-sm font-semibold',
                isFocused ? 'text-foreground' : 'text-[--text-secondary]',
              )}
            >
              {label + (isNecessary ? ' *' : '')}
            </Text>
          ) : (
            <View className="flex-1" />
          )}
          {limit !== undefined && (
            <Text
              className={cn(
                'text-right text-sm',
                isOverLimit ? 'text-destructive' : 'text-[--text-secondary]',
              )}
            >
              {`${charCount} / ${limit}`}
            </Text>
          )}
        </View>
      ) : null}
      <Animated.View className="flex-row rounded-xl" style={animatedContainerStyle}>
        <TextInput
          ref={ref}
          className={cn(
            'font-regular text-foreground min-h-12 flex-1 rounded-xl px-4 py-3 text-base',
            disabled && 'opacity-50',
          )}
          cursorColor={cursorColor}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          secureTextEntry={isPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="none"
          underlineColorAndroid="transparent"
          editable={!disabled}
          value={value}
          {...rest}
        />
      </Animated.View>
    </View>
  );
};

export default Input;
