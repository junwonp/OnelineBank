import { View } from 'react-native';
import { Image } from 'expo-image';

import Text from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Message } from '@/features/messages/api';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const currentUserId = useAuthStore((state) => state.user?.uid);
  const isMe = message.user._id === currentUserId;

  return (
    <View
      className={`mx-4 mb-3 flex-row items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      {!isMe ? (
        <View className="h-full">
          <Image
            source={{
              uri: message.user.avatar ?? 'https://via.placeholder.com/32',
            }}
            style={{ width: 32, height: 32, borderRadius: 8 }}
          />
        </View>
      ) : null}
      <View
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isMe ? 'bg-primary rounded-br-sm' : 'bg-background-surface-container rounded-tl-sm'
        }`}
      >
        <Text
          className={`text-md leading-relaxed ${
            isMe ? 'text-primary-foreground' : 'text-foreground'
          }`}
        >
          {message.text}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;
