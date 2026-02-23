import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Text from '@/components/ui/text';
import { signInWithEmail } from '@/features/auth/api/auth';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { removeWhitespace } from '@/utils/string';
import { isValidEmail } from '@/utils/validation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);
  const passwordRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setUser } = useAuthStore();

  const handleEmailChange = (email: string) => {
    const changedEmail = removeWhitespace(email);
    setEmail(changedEmail);
    setErrorMessage(!isValidEmail(changedEmail) ? '이메일 형식을 확인해주세요.' : '');
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
      setErrorMessage(result.error || '');
    }
  };

  return (
    <View className="bg-background flex-1 px-5">
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          alignItems: 'center',
        }}
        className="bg-background flex-1 items-center px-5"
      >
        {/* <Image source={images.logo} imageStyle={{ borderRadius: 30 }} /> */}
        <Input
          label="이메일"
          value={email}
          onChangeText={handleEmailChange}
          onSubmitEditing={handleLoginButtonPress}
          placeholder="이메일을 입력해주세요."
          keyType="email-address"
          returnKeyType="next"
        />
        <Input
          ref={passwordRef}
          label="비밀번호"
          value={password}
          onChangeText={handlePasswordChange}
          onSubmitEditing={() => {}}
          placeholder="비밀번호를 입력해주세요."
          returnKeyType="done"
          isPassword
        />
        <Text className="text-errorText mb-2.5 w-full text-left leading-5">{errorMessage}</Text>
        <View className="w-full flex-col justify-between gap-2.5">
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
    </View>
  );
};

export default Login;
