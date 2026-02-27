import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { removeOldestQuery } from '@tanstack/react-query-persist-client';

import { clientStorage } from './mmkv';

export const clientPersister = createAsyncStoragePersister({
  storage: clientStorage,
  retry: removeOldestQuery,
});
