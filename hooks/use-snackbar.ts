import { use } from 'react';

import { SnackbarContext } from '@/components/providers/snackbar-provider';

const useSnackbar = () => {
  const context = use(SnackbarContext);

  if (!context) throw new Error('SnackbarContext must be placed within SnackbarProvider');

  return context;
};

export default useSnackbar;
