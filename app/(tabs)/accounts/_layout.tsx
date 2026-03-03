import { Stack } from 'expo-router';

const AccountListLayout = () => (
  <Stack>
    <Stack.Screen name="index" />
    <Stack.Screen name="create" />
  </Stack>
);

export default AccountListLayout;
