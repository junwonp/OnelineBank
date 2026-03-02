import { getAuth } from '@react-native-firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  FirebaseFirestoreTypes,
  query,
  where,
  or,
} from '@react-native-firebase/firestore';
import { randomUUID } from 'expo-crypto';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

export const messagesKeys = {
  all: ['messages'] as const,
};

export interface Message {
  _id: string;
  text: string;
  createdAt: number;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}

const getMessages = async () => {
  const auth = getAuth();

  const currentUserId = auth.currentUser?.uid;
  const botId = `bots${currentUserId}`;

  const db = getFirestore();

  const q = query(
    collection(db, 'messages'),
    or(where('user._id', '==', currentUserId), where('user._id', '==', botId)),
  );
  const snapshot = await getDocs(q);
  console.log(snapshot);
  if (snapshot.empty) return null;
  console.log(snapshot.docs);
  return snapshot.docs
    .map(
      (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        ({ _id: doc.id, ...doc.data() }) as Message,
    )
    .sort((a: Message, b: Message) => b.createdAt - a.createdAt);
};

export const useMessages = (): UseQueryResult<Message[], Error> =>
  useQuery({
    queryKey: messagesKeys.all,
    staleTime: 1,
    queryFn: async () => getMessages(),
  });

export const prefetchMessages = async (queryClient: QueryClient) =>
  queryClient.prefetchQuery({
    queryKey: messagesKeys.all,
    queryFn: getMessages,
  });

export const addMessage = async (text: string, isBot: boolean): Promise<Message> => {
  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;
  const userName = auth.currentUser?.displayName ?? '';

  if (!currentUserId) throw new Error('User not authenticated');

  const db = getFirestore();

  const message = {
    _id: randomUUID(),
    text,
    createdAt: Date.now(),
    user: {
      _id: isBot ? `bots${currentUserId}` : currentUserId,
      name: isBot ? 'Bot' : userName,
      avatar:
        'https://firebasestorage.googleapis.com/v0/b/react-native-chat-d43a3.appspot.com/o/profile%2FeKaVi4APosTLlKN7EDXdvXUIYAD2%2Fphoto.png?alt=media&token=4925aa6b-6085-4404-9f67-30f564adff03',
    },
  };
  await addDoc(collection(db, 'messages'), message);

  return message;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      text,
      isBot,
    }: {
      text: string;
      isBot: boolean;
    }): Promise<{
      message: Message;
    }> => {
      const message = await addMessage(text, isBot);
      return { message };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(messagesKeys.all, (oldData: Message[]) => {
        return [...oldData, data.message];
      });
    },
  });
};
