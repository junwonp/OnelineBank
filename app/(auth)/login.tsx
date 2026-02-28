import { useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import { useSnackbar } from '@/components/providers/snackbar-provider';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { signInWithEmail } from '@/features/auth/api/auth';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { removeWhitespace } from '@/utils/string';
import { isValidEmail } from '@/utils/validation';

const Login = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();
  const { setSnackbarMessage } = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);

  const handleEmailChange = (email: string) => {
    const changedEmail = removeWhitespace(email);
    setEmail(changedEmail);
    setSnackbarMessage(!isValidEmail(changedEmail) ? '이메일 형식을 확인해주세요.' : '');
  };

  const handlePasswordChange = (password: string) => {
    setPassword(removeWhitespace(password));
  };

  const handleLoginButtonPress = async () => {
    const result = await signInWithEmail(email, password);
    if (result.success) {
      setUser(result.user || null);
      router.push('/');
    } else {
      setSnackbarMessage(result.error || '');
    }
  };

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
          <Input
            label="이메일"
            value={email}
            onChangeText={handleEmailChange}
            onSubmitEditing={handleLoginButtonPress}
            placeholder="이메일을 입력해주세요."
            keyboardType="email-address"
            returnKeyType="next"
          />
          <Input
            label="비밀번호"
            value={password}
            onChangeText={handlePasswordChange}
            onSubmitEditing={() => {}}
            placeholder="비밀번호를 입력해주세요."
            returnKeyType="done"
            isPassword
          />
        </View>
      </View>
      <View className="flex-1" />
      <View className="w-full gap-2.5">
        <Button
          label="로그인"
          onPress={handleLoginButtonPress}
          disabled={!disabled}
          variant="default"
          size="default"
        />
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
