import { useEffect, useState, useMemo, useRef } from 'react';

/**
 * Hook to run an async effect on mount and another on unmount.
 */
function useAsyncEffect<TResult>(
  mountCallback: () => Promise<TResult>,
  unmountCallback: () => Promise<unknown>,
  deps: unknown[] = []
) {
  const isMounted = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);
  const [result, setResult] = useState<TResult>();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    let mountSucceeded = false;

    (async () => {
      await Promise.resolve(); // wait for the initial cleanup in Strict mode - avoids double mutation
      if (!isMounted.current || ignore) {
        return;
      }
      setIsLoading(true);
      try {
        const result = await mountCallback();
        mountSucceeded = true;
        if (isMounted.current && !ignore) {
          setError(void 0);
          setResult(result);
          setIsLoading(false);
        } else {
          // Component was unmounted before the mount callback returned, cancel it
          unmountCallback();
        }
      } catch (error: unknown) {
        if (!isMounted.current) return;
        setError(error);
        setIsLoading(false);
      }
    })();

    return () => {
      ignore = true;
      if (mountSucceeded) {
        unmountCallback()
          .then(() => {
            if (!isMounted.current) return;
            setResult(void 0);
          })
          .catch((error: unknown) => {
            if (!isMounted.current) return;
            setError(error);
          });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return useMemo(
    () => ({ result, error, isLoading }),
    [result, error, isLoading]
  );
}

export type UseAsyncEffectResult = ReturnType<typeof useAsyncEffect>;

export { useAsyncEffect };
