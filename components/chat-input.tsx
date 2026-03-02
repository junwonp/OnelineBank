import { TextInput, TouchableOpacity, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';

interface ChatInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

const ChatInput = ({ value, onChangeText, onSend }: ChatInputBarProps) => (
  <View className="border-border bg-background-surface pb-safe-offset-3 flex-row items-end border-t px-4 py-3">
    <TextInput
      className="font-regular bg-background-surface-container text-foreground text-md mr-3 max-h-24 min-h-10 flex-1 rounded-2xl px-4 py-2.5"
      placeholder="메시지를 입력하세요..."
      placeholderTextColor="#999"
      value={value}
      onChangeText={onChangeText}
      multiline
      onSubmitEditing={onSend}
    />
    <TouchableOpacity
      onPress={onSend}
      disabled={!value.trim()}
      activeOpacity={0.75}
      className={`h-10 w-10 items-center justify-center rounded-full ${
        value.trim() ? 'bg-primary' : 'bg-secondary'
      }`}
    >
      <IconSymbol name="arrow.up" size={22} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default ChatInput;
