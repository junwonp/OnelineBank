import * as React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  type TouchableOpacityProps,
  View,
} from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import Text from '@/components/ui/text';
import { cn } from '@/utils/style';

const buttonVariants = cva('flex-row items-center justify-center rounded-md', {
  variants: {
    variant: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      outline: 'border border-input bg-background',
      secondary: 'bg-secondary',
      ghost: 'bg-transparent',
      link: 'text-primary underline-offset-4',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const buttonTextVariants = cva('text-sm font-medium text-white', {
  variants: {
    variant: {
      default: 'text-primary-foreground text-white',
      destructive: 'text-destructive-foreground text-white',
      outline: 'text-foreground',
      secondary: 'text-secondary-foreground text-white',
      ghost: 'text-foreground text-white',
      link: 'text-primary underline text-white',
    },
    size: {
      default: '',
      sm: '',
      lg: 'text-base',
      icon: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps extends TouchableOpacityProps, VariantProps<typeof buttonVariants> {
  label?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  ref?: React.Ref<View>;
}

const Button = ({
  className,
  variant,
  size,
  label,
  children,
  isLoading,
  icon,
  disabled,
  ref,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  const getIndicatorColor = () => {
    if (variant === 'outline' || variant === 'ghost' || variant === 'secondary') {
      return '#0f172a';
    }
    return '#ffffff';
  };

  return (
    <TouchableOpacity
      ref={ref}
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size, className }), isDisabled && 'opacity-50')}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={getIndicatorColor()} />
      ) : (
        <>
          {icon ? <View className="mr-2">{icon}</View> : null}

          <Text className={cn(buttonTextVariants({ variant, size }))}>{label || children}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

Button.displayName = 'Button';

export default Button;
