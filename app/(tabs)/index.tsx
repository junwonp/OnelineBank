import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChatInput from '@/components/chat-input';
import MessageBubble from '@/components/message-bubble';
import { useAccounts } from '@/features/accounts/api';
import { useMessages } from '@/features/messages/api';
import { useProfile } from '@/features/profile/api';

const Chat = () => {
  const insets = useSafeAreaInsets();

  const { data: accounts } = useAccounts();
  const { data: messages } = useMessages();
  const { data: profile } = useProfile();

  const [inputText, setInputText] = useState('');

  const handleSend = async () => {};

  return (
    <KeyboardAvoidingView
      className="bg-background flex-1"
      behavior="translate-with-padding"
      keyboardVerticalOffset={-insets.bottom}
    >
      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-safe"
        ListEmptyComponent={
          <View className="items-center px-8 py-20">
            <View className="bg-background-surface-container mb-4 h-16 w-16 items-center justify-center rounded-full">
              <Text className="text-3xl">💬</Text>
            </View>
            <Text className="text-foreground mb-2 text-base font-semibold">안녕하세요!</Text>
            <Text className="text-center text-sm text-[--text-secondary]">
              {"'도움말'이라고 입력해보세요."}
            </Text>
          </View>
        }
      />
      <ChatInput value={inputText} onChangeText={setInputText} onSend={handleSend} />
    </KeyboardAvoidingView>
  );
};

export default Chat;
