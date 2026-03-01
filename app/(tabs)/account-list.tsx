import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import Text from '@/components/ui/text';
import { useAccounts } from '@/features/accounts/api';

interface Account {
  id: string;
  name: string;
  bank: string;
  account: string;
  uid: string;
}

const Item = React.memo(({ item: { name, bank, account } }: { item: Account }) => {
  return (
    <TouchableOpacity className="border-divider flex-row items-center border-b px-5 py-[15px]">
      <View className="flex-1 flex-col">
        <Text className="text-xl font-semibold">{name}</Text>
        <Text className="mt-[5px] text-base text-[--text-secondary]">{`${bank} ${account}`}</Text>
      </View>
    </TouchableOpacity>
  );
});

const AccountList = () => {
  const { data: accounts } = useAccounts();

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      data={accounts}
      renderItem={({ item }) => <Item item={item} />}
      windowSize={3}
      contentContainerClassName="border-divider py-safe"
      className="bg-background flex-1"
    />
  );
};

export default AccountList;
