import { getAuth } from '@react-native-firebase/auth';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  FirebaseFirestoreTypes,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

export const accountKeys = {
  all: ['account'] as const,
  detail: (userId: string) => [...accountKeys.all, userId] as const,
};

export interface Account {
  account: string;
  bank: string;
  id: string;
  name: string;
  uid: string;
}

const getAccounts = async () => {
  const db = getFirestore();
  const q = query(
    collection(db, 'accounts'),
    where('uid', '==', getAuth().currentUser?.uid),
    orderBy('name', 'asc'),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return snapshot.docs.map(
    (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
      ({ id: doc.id, ...doc.data() }) as Account,
  );
};

export const useAccounts = (): UseQueryResult<Account[], Error> =>
  useQuery({
    queryKey: accountKeys.all,
    queryFn: async () => getAccounts(),
  });

export const prefetchAccounts = async (queryClient: QueryClient) =>
  queryClient.prefetchQuery({
    queryKey: accountKeys.all,
    queryFn: getAccounts,
  });

const createAccount = async ({
  name,
  bank,
  account,
}: {
  name: string;
  bank: string;
  account: string;
}): Promise<Omit<Account, 'id'>> => {
  const db = getFirestore();
  const uid = getAuth().currentUser?.uid;

  if (!uid) throw new Error('User not authenticated');

  await addDoc(collection(db, 'accounts'), { name, bank, account, uid });

  return { name, bank, account, uid };
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: (data) => {
      queryClient.setQueryData(accountKeys.all, (oldData: Account[]) => {
        return [...oldData, data];
      });
    },
  });
};
