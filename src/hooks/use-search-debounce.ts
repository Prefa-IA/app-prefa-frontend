import { useCallback, useEffect, useRef } from 'react';

interface UseSearchDebounceOptions {
  delay?: number;
  minLength?: number;
}

export const useSearchDebounce = <T extends unknown[]>(
  searchFn: (...args: T) => Promise<void>,
  options: UseSearchDebounceOptions = {}
) => {
  const { delay = 300, minLength = 3 } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchIdRef = useRef<number>(0);

  const debouncedSearch = useCallback(
    (...args: T) => {
      // Incrementar el ID de búsqueda para rastrear la más reciente
      const currentSearchId = ++searchIdRef.current;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      // Verificar longitud mínima si aplica
      const searchValue = args[0] as string;
      if (typeof searchValue === 'string' && searchValue.length < minLength) {
        return;
      }

      timeoutRef.current = setTimeout(() => {
        if (currentSearchId !== searchIdRef.current) {
          return;
        }

        void (async () => {
          try {
            abortControllerRef.current = new AbortController();
            await searchFn(...args);
          } catch (error: unknown) {
            if (error instanceof Error && error.name !== 'AbortError') {
              console.error('Search error:', error);
            }
          } finally {
            if (currentSearchId === searchIdRef.current) {
              if (abortControllerRef.current) {
                abortControllerRef.current = null;
              }
              if (timeoutRef.current) {
                timeoutRef.current = null;
              }
            }
          }
        })();
      }, delay);
    },
    [searchFn, delay, minLength]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  return { debouncedSearch, cancel };
};
