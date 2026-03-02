import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  FirebaseFirestoreTypes,
  query,
  where,
  or,
} from '@react-native-firebase/firestore';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';

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
