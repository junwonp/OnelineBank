import { ColorValue, StyleProp, View, ViewStyle } from 'react-native';
import { Image, ImageProps } from 'expo-image';

import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import Text from '@/components/ui/text';
import useRetryImage from '@/hooks/use-retry-image';
import { cn } from '@/utils/style';

interface AvatarProps extends Pick<
  ImageProps,
  'onError' | 'onLayout' | 'onLoad' | 'onLoadEnd' | 'onLoadStart' | 'onProgress'
> {
  color?: ColorValue;
  icon?: IconSymbolName;
  label?: string;
  maxFontSizeMultiplier?: number;
  size?: number;
  src?: string | null;
  style?: StyleProp<ViewStyle>;
}

const defaultSize = 36;

const Avatar = ({
  color,
  icon,
  label,
  maxFontSizeMultiplier,
  onError,
  onLayout,
  onLoad,
  onLoadEnd,
  onLoadStart,
  onProgress,
  size = defaultSize,
  src,
  style,
  ...rest
}: AvatarProps) => {
  const image = useRetryImage(src, {
    maxHeight: 280,
    maxWidth: 280,
  });

  return (
    <View className={cn('flex-center rounded-full', style)} {...rest}>
      {src ? (
        <Image
          accessibilityLabel="Avatar"
          cachePolicy="disk"
          source={image}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          onError={onError}
          onLayout={onLayout}
          onLoad={onLoad}
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          onProgress={onProgress}
          accessibilityIgnoresInvertColors
        />
      ) : icon ? (
        <IconSymbol name={icon} size={size * 0.6} color={color ?? '#fff'} />
      ) : (
        <Text
          className="text-vertical-center text-center"
          numberOfLines={1}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

export default Avatar;
