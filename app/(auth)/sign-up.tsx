import { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';

import { useSnackbar } from '@/components/providers/snackbar-provider';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { signUpWithEmail } from '@/features/auth/api/auth';
import { removeWhitespace } from '@/utils/string';

const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .check(z.email({ error: '이메일 형식을 확인해주세요.' })),
    password: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.'),
    passwordConfirm: z.string().min(8, '비밀번호는 8자 이상 입력해주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

const SignUp = () => {
  const router = useRouter();
  const { setSnackbarMessage } = useSnackbar();

  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmRef = useRef<TextInput>(null);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    onSubmit: async ({ value }) => {
      const result = signUpSchema.safeParse(value);
      if (!result.success) {
        setSnackbarMessage(result.error.issues[0].message);
        return;
      }

      const authResult = await signUpWithEmail(result.data.email, result.data.password);
      if (authResult.success) {
        router.push('/');
      } else {
        setSnackbarMessage(authResult.error || '');
      }
    },
  });

  return (
    <>
      <Stack.Screen options={{ headerTitle: '회원가입' }} />
      <View className="bg-background pb-safe flex-1 px-5">
        <View className="flex-1 items-center justify-center gap-5">
          <form.Field name="email">
            {(field) => (
              <Input
                label="이메일"
                value={field.state.value}
                onChangeText={(text) => field.handleChange(removeWhitespace(text))}
                onBlur={field.handleBlur}
                onSubmitEditing={() => passwordRef.current?.focus()}
                placeholder="이메일을 입력해주세요."
                keyboardType="email-address"
                returnKeyType="next"
              />
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <Input
                ref={passwordRef}
                label="비밀번호"
                value={field.state.value}
                onChangeText={(text) => field.handleChange(removeWhitespace(text))}
                onBlur={field.handleBlur}
                onSubmitEditing={() => passwordConfirmRef.current?.focus()}
                placeholder="비밀번호를 입력해주세요."
                returnKeyType="next"
                isPassword
              />
            )}
          </form.Field>
          <form.Field name="passwordConfirm">
            {(field) => (
              <Input
                ref={passwordConfirmRef}
                label="비밀번호 확인"
                value={field.state.value}
                onChangeText={(text) => field.handleChange(removeWhitespace(text))}
                onBlur={field.handleBlur}
                onSubmitEditing={() => form.handleSubmit()}
                placeholder="다시 한번 입력해주세요."
                returnKeyType="done"
                isPassword
              />
            )}
          </form.Field>
        </View>
        <View className="flex-1" />
        <View className="w-full">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                label="회원가입"
                onPress={() => form.handleSubmit()}
                disabled={isSubmitting}
              />
            )}
          </form.Subscribe>
        </View>
      </View>
    </>
  );
};

export default SignUp;
