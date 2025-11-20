import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseBuscarDireccionPageInitializationProps {
  onSearch: () => Promise<void>;
  setDireccion: (direccion: string) => void;
  isSearchingRef: React.RefObject<boolean>;
  lastSearchedRef: React.RefObject<string>;
}

export const useBuscarDireccionPageInitialization = ({
  onSearch,
  setDireccion,
  isSearchingRef,
  lastSearchedRef,
}: UseBuscarDireccionPageInitializationProps) => {
  const [params] = useSearchParams();
  const isInitializingRef = useRef(false);

  useEffect(() => {
    const direccionParam = params.get('direccion');
    const fromHistory = params.get('fromHistory') === 'true';
    if (direccionParam) {
      const searchKey = `${direccionParam}-${fromHistory}`;
      if (
        searchKey !== lastSearchedRef.current &&
        !isSearchingRef.current &&
        !isInitializingRef.current
      ) {
        isInitializingRef.current = true;
        setDireccion(direccionParam);
        const timeoutId = setTimeout(() => {
          isInitializingRef.current = false;
          void onSearch();
        }, 0);
        return () => {
          clearTimeout(timeoutId);
          isInitializingRef.current = false;
        };
      }
    }
    return undefined;
  }, [params, onSearch, isSearchingRef, lastSearchedRef, setDireccion]);
};
