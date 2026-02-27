import { keepPreviousData, QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      placeholderData: keepPreviousData,
      retry: (failureCount) => failureCount < 2,
    },
  },
});

export default queryClient;
