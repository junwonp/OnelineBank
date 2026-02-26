import { useEffect, useRef } from 'react';
import { ImageLoadOptions, ImageSource, useImage } from 'expo-image';

const useRetryImage = (
  source: ImageSource | string | number | null | undefined,
  options?: ImageLoadOptions,
  dependencies?: React.DependencyList,
) => {
  const retryCount = useRef(0);
  const MAX_RETRY_COUNT = 3;

  const image = useImage(
    source ?? '',
    {
      ...options,
      onError: (_, retry) => {
        if (source) {
          if (retryCount.current < MAX_RETRY_COUNT) {
            retry();
            retryCount.current++;
          }
        }
      },
    },
    dependencies,
  );

  useEffect(() => {
    retryCount.current = 0;
  }, [source]);

  return image;
};

export default useRetryImage;
