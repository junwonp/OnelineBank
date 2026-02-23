import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

interface SignUpResult {
  success: boolean;
  user?: FirebaseAuthTypes.User;
  error?: string;
}

interface SignInResult {
  success: boolean;
  user?: FirebaseAuthTypes.User;
  error?: string;
}

export const signUpWithEmail = async (email: string, password: string): Promise<SignUpResult> => {
  const auth = getAuth();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    return { success: true, user: userCredential.user };
  } catch (err) {
    const error = err as FirebaseAuthTypes.NativeFirebaseAuthError;
    let errorMessage = '회원가입에 실패했습니다.';

    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = '이미 사용 중인 이메일입니다.';
        break;
      case 'auth/invalid-email':
        errorMessage = '유효하지 않은 이메일 주소입니다.';
        break;
      case 'auth/weak-password':
        errorMessage = '비밀번호가 너무 약합니다. (6자리 이상 권장)';
        break;
      default:
        console.error('SignUp Error:', error);
    }

    return { success: false, error: errorMessage };
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<SignInResult> => {
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    return { success: true, user: userCredential.user };
  } catch (err) {
    const error = err as FirebaseAuthTypes.NativeFirebaseAuthError;
    let errorMessage = '로그인에 실패했습니다.';

    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = '유효하지 않은 이메일 주소입니다.';
        break;
      case 'auth/wrong-password':
        errorMessage = '비밀번호가 일치하지 않습니다.';
        break;
      default:
        console.error('SignIn Error:', error);
    }

    return { success: false, error: errorMessage };
  }
};
