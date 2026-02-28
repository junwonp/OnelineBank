import { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';

import { useSnackbar } from '@/components/providers/snackbar-provider';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { signInWithEmail } from '@/features/auth/api/auth';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { removeWhitespace } from '@/utils/string';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .check(z.email({ error: '이메일 형식을 확인해주세요.' })),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

const Login = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();
  const { setSnackbarMessage } = useSnackbar();

  const passwordRef = useRef<TextInput>(null);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const result = loginSchema.safeParse(value);
      if (!result.success) {
        setSnackbarMessage(result.error.issues[0].message);
        return;
      }

      const authResult = await signInWithEmail(result.data.email, result.data.password);
      if (authResult.success) {
        setUser(authResult.user || null);
        router.push('/');
      } else {
        setSnackbarMessage(authResult.error || '');
      }
    },
  });

  return (
    <View className="bg-background py-safe flex-1 px-5">
      <View className="w-full flex-1 items-center justify-center gap-5">
        <Image
          source={
            'https://firebasestorage.googleapis.com/v0/b/react-native-chat-d43a3.appspot.com/o/logo.png?alt=media'
          }
          style={{ width: 100, height: 100, borderRadius: 20 }}
        />
        <View className="gap-5">
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
                onSubmitEditing={() => form.handleSubmit()}
                placeholder="비밀번호를 입력해주세요."
                returnKeyType="done"
                isPassword
              />
            )}
          </form.Field>
        </View>
      </View>
      <View className="flex-1" />
      <View className="w-full gap-2.5">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button
              label={isSubmitting ? '로그인 중...' : '로그인'}
              onPress={() => form.handleSubmit()}
              disabled={isSubmitting}
              variant="default"
              size="default"
            />
          )}
        </form.Subscribe>
        <Button
          label="회원가입"
          onPress={() => router.push('/sign-up')}
          variant="outline"
          size="default"
        />
      </View>
    </View>
  );
};

export default Login;
