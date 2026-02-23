import React, { forwardRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import Text from '@/components/ui/text';

interface InputProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  isPassword?: boolean;
  returnKeyType?: 'done' | 'next';
  maxLength?: number;
  disabled?: boolean;
  keyType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      value,
      onChangeText,
      onSubmitEditing,
      onBlur = () => {},
      placeholder,
      isPassword,
      returnKeyType,
      maxLength,
      disabled,
      keyType,
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View className="my-2.5 w-full flex-col">
        <Text
          className={`mb-1.5 text-sm font-semibold ${isFocused ? 'text-neutral-900' : 'text-neutral-500'}`}
        >
          {label}
        </Text>
        <TextInput
          ref={ref}
          className={`font-regular rounded border px-2.5 py-5 text-base ${
            disabled
              ? 'border-neutral-200 bg-neutral-100 text-neutral-400'
              : isFocused
                ? 'border-neutral-900 bg-white text-neutral-900'
                : 'border-neutral-300 bg-white text-neutral-900'
          }`}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          placeholder={placeholder}
          placeholderTextColor="#a3a3a3"
          secureTextEntry={isPassword}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="none"
          underlineColorAndroid="transparent"
          editable={!disabled}
          keyboardType={keyType}
        />
      </View>
    );
  },
);

Input.displayName = 'Input';

export default Input;
