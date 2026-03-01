import {
  collection,
  getDocs,
  getFirestore,
  FirebaseFirestoreTypes,
  limit,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import { QueryClient, useQuery, UseQueryResult } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/store/useAuthStore';

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
  const q = query(collection(db, 'accounts'), orderBy('name', 'asc'));
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
