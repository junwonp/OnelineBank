import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { cn } from '@/utils/style';

interface TextProps extends RNTextProps {
  className?: string;
}

const Text = ({ className, style, ...props }: TextProps) => {
  return <RNText className={cn('text-foreground font-regular', className)} {...props} />;
};

Text.displayName = 'Text';

export default Text;
