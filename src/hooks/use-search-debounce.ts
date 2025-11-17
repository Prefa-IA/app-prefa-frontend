import { useCallback, useRef } from 'react';

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

  const debouncedSearch = useCallback(
    (...args: T) => {
      // Cancelar búsqueda anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Cancelar request anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Verificar longitud mínima si aplica
      const searchValue = args[0] as string;
      if (typeof searchValue === 'string' && searchValue.length < minLength) {
        return;
      }

      // Configurar nuevo timeout
      timeoutRef.current = setTimeout(() => {
        void (async () => {
          try {
            abortControllerRef.current = new AbortController();
            await searchFn(...args);
          } catch (error: unknown) {
            if (error instanceof Error && error.name !== 'AbortError') {
              console.error('Search error:', error);
            }
          } finally {
            if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
              abortControllerRef.current = null;
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

  return { debouncedSearch, cancel };
};
