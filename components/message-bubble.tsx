import { View } from 'react-native';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import ParseTextWithPatterns from '@/components/parse-text';
import Text from '@/components/ui/text';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Message } from '@/features/messages/api';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const currentUserId = useAuthStore((state) => state.user?.uid);
  const isMe = message.user._id === currentUserId;

  dayjs.extend(localizedFormat);

  return (
    <View
      className={`mx-4 mb-3 flex-row items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <View
        className={`max-w-[75%] gap-1 rounded-2xl px-4 py-3 ${
          isMe ? 'bg-primary rounded-br-sm' : 'bg-background-surface-container rounded-tl-sm'
        }`}
      >
        <Text>
          <ParseTextWithPatterns
            className={`text-md leading-relaxed ${isMe ? 'text-primary-foreground' : 'text-foreground'}`}
          >
            {message.text}
          </ParseTextWithPatterns>
        </Text>
        <Text
          className={`${isMe ? 'text-primary-foreground text-right' : 'text-foreground text-left'} text-xs`}
        >
          {dayjs(message.createdAt).format('LT')}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;
