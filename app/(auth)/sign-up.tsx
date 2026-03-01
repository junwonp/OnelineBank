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
// const Signup = () => {
//   const [photoUrl, setPhotoUrl] = useState(images.photo);
//   const [name, setName] = useState('');
//   const [account, setAccount] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [passwordConfirm, setPasswordConfirm] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [disabled, setDisabled] = useState(true);
//   const { spinner } = useContext(ProgressContext);
//   const { dispatch } = useContext(UserContext);

//   const accountRef = useRef();
//   const emailRef = useRef();
//   const passwordRef = useRef();
//   const passwordConfirmRef = useRef();
//   const didMountRef = useRef();

//   useEffect(() => {
//     if (didMountRef.current) {
//       let _errorMessage = '';
//       if (!name) {
//         _errorMessage = '이름을 입력해주세요.';
//       } else if (!validateAccount(account)) {
//         _errorMessage = '올바른 계좌번호 형식이 아닙니다.';
//       } else if (!validateEmail(email)) {
//         _errorMessage = '올바른 이메일 형식이 아닙니다.';
//       } else if (password.length < 6) {
//         _errorMessage = '비밀번호는 6자 이상이어야합니다.';
//       } else if (password !== passwordConfirm) {
//         _errorMessage = '비밀번호가 일치하지 않습니다.';
//       } else {
//         _errorMessage = '';
//       }
//       setErrorMessage(_errorMessage);
//     } else {
//       didMountRef.current = true;
//     }
//   }, [name, email, account, password, passwordConfirm]);

//   useEffect(() => {
//     setDisabled(
//       !(
//         name &&
//         email &&
//         account &&
//         password &&
//         passwordConfirm &&
//         !errorMessage
//       )
//     );
//   }, [name, email, account, password, passwordConfirm, errorMessage]);

//   const _handleSignupButtonPress = async () => {
//     try {
//       spinner.start();
//       const user = await signup({ email, password, name, photoUrl });
//       dispatch(user);
//       if (user) {
//         await createUsers({ email, account, name, id: user.uid });
//         await createBots({ uid: user.uid });
//       } else {
//         console.log('build failed!');
//       }
//     } catch (e) {
//       Alert.alert('회원가입 실패', e.message);
//     } finally {
//       spinner.stop();
//     }
//   };

//   return (
//     <KeyboardAwareScrollView extraScrollHeight={20}>
//       <Container>
//         <Image
//           rounded
//           url={photoUrl}
//           showButton
//           onChangeImage={url => setPhotoUrl(url)}
//         />
//         <Input
//           label="이름"
//           value={name}
//           onChangeText={text => setName(text)}
//           onSubmitEditing={() => {
//             setName(name.trim());
//             accountRef.current.focus();
//           }}
//           onBlur={() => setName(name.trim())}
//           placeholder="이름을 입력해주세요."
//           returnKeyType="next"
//         />
//         <Input
//           ref={accountRef}
//           label="계좌번호"
//           value={account}
//           onChangeText={text => setAccount(removeWhitespace(text))}
//           onSubmitEditing={() => emailRef.current.focus()}
//           placeholder="계좌번호를 입력해주세요."
//           keyType="numeric"
//           returnKeyType="next"
//         />
//         <Input
//           ref={emailRef}
//           label="이메일"
//           value={email}
//           onChangeText={text => setEmail(removeWhitespace(text))}
//           onSubmitEditing={() => passwordRef.current.focus()}
//           placeholder="이메일을 입력해주세요"
//           keyType="email-address"
//           returnKeyType="next"
//         />
//         <Input
//           ref={passwordRef}
//           label="비밀번호"
//           입
//           value={password}
//           onChangeText={text => setPassword(removeWhitespace(text))}
//           onSubmitEditing={() => passwordConfirmRef.current.focus()}
//           placeholder="비밀번호를 입력해주세요."
//           returnKeyType="done"
//           isPassword
//         />
//         <Input
//           ref={passwordConfirmRef}
//           label="비밀번호 확인"
//           value={passwordConfirm}
//           onChangeText={text => setPasswordConfirm(removeWhitespace(text))}
//           onSubmitEditing={_handleSignupButtonPress}
//           placeholder="다시 한번 입력해주세요."
//           returnKeyType="done"
//           isPassword
//         />
//         <ErrorText>{errorMessage}</ErrorText>
//         <Button
//           title="회원가입"
//           onPress={_handleSignupButtonPress}
//           disabled={disabled}
//         />
//       </Container>
//     </KeyboardAwareScrollView>
//   );
// };

export default SignUp;
