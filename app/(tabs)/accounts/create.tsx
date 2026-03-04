import { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useUnstableNativeVariable } from 'nativewind';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';

import { useSnackbar } from '@/components/providers/snackbar-provider';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useCreateAccount } from '@/features/accounts/api';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { removeWhitespace } from '@/utils/string';
import { validateAccount, validateBankCode } from '@/utils/validation';

const createAccountSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  bank: z
    .string()
    .min(1, '은행을 입력해주세요.')
    .refine(validateBankCode, '올바른 은행을 입력해주세요.'),
  account: z
    .string()
    .min(1, '계좌번호를 입력해주세요.')
    .refine(validateAccount, '올바른 계좌 형식이 아닙니다.'),
});

const CreateAccount = () => {
  const router = useRouter();
  const { setSnackbarMessage } = useSnackbar();

  const { user } = useAuthStore();
  const { mutateAsync: createAccount, isPending } = useCreateAccount();

  const backgroundColor = useUnstableNativeVariable('--background');

  const bankRef = useRef<TextInput>(null);
  const accountRef = useRef<TextInput>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      bank: '',
      account: '',
    },
    onSubmit: async ({ value }) => {
      const result = createAccountSchema.safeParse(value);
      if (!result.success) {
        setSnackbarMessage(result.error.issues[0].message);
        return;
      }

      if (!user) return;

      try {
        await createAccount(result.data);
        router.back();
      } catch (e) {
        setSnackbarMessage((e as Error).message, { mode: 'error' });
      }
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor,
          },
          headerTitle: '',
        }}
      />
      <View className="bg-background pb-safe flex-1 px-5">
        <View className="w-full gap-5">
          <form.Field name="name">
            {(field) => (
              <Input
                label="이름"
                value={field.state.value}
                onChangeText={(text) => field.handleChange(text)}
                onSubmitEditing={() => {
                  field.handleChange(field.state.value.trim());
                  bankRef.current?.focus();
                }}
                onBlur={() => field.handleChange(field.state.value.trim())}
                placeholder="이름을 입력해주세요."
                returnKeyType="next"
                maxLength={10}
              />
            )}
          </form.Field>

          <form.Field name="bank">
            {(field) => (
              <Input
                ref={bankRef}
                label="은행"
                value={field.state.value}
                onChangeText={(text) => field.handleChange(removeWhitespace(text))}
                onSubmitEditing={() => {
                  field.handleChange(field.state.value.trim());
                  accountRef.current?.focus();
                }}
                onBlur={() => field.handleChange(field.state.value.trim())}
                placeholder="은행을 입력해주세요."
                returnKeyType="next"
                maxLength={10}
              />
            )}
          </form.Field>

          <form.Field name="account">
            {(field) => (
              <Input
                ref={accountRef}
                label="계좌번호"
                value={field.state.value}
                onChangeText={(text) => field.handleChange(text)}
                onSubmitEditing={() => {
                  field.handleChange(field.state.value.trim());
                  form.handleSubmit();
                }}
                onBlur={() => field.handleChange(field.state.value.trim())}
                placeholder="계좌번호를 입력해주세요."
                keyboardType="numeric"
                returnKeyType="done"
                maxLength={20}
              />
            )}
          </form.Field>
        </View>
        <View className="flex-1" />
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              label="계좌추가"
              onPress={form.handleSubmit}
              isLoading={isPending || isSubmitting}
              className="w-full"
            />
          )}
        </form.Subscribe>
      </View>
    </>
  );
};

export default CreateAccount;
