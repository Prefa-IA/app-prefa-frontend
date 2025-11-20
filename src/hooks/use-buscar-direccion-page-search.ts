import { MutableRefObject, useCallback } from 'react';

import { BasicInformationProps } from '../types/enums';

interface UseBuscarDireccionPageSearchProps {
  direccion: string;
  fromHistory: boolean;
  skipCredits: boolean;
  handleSuccessfulSearch: (
    data: BasicInformationProps['informe'],
    skipCredits: boolean,
    direccion: string
  ) => Promise<BasicInformationProps['informe']>;
  manejarInProgress: (
    fromHistory: boolean,
    direccion: string,
    handleSuccessfulSearch: (
      data: BasicInformationProps['informe'],
      skipCredits: boolean,
      direccion: string
    ) => Promise<BasicInformationProps['informe']>
  ) => Promise<boolean>;
  manejarError409: (
    error: { code?: string; response?: { status?: number; data?: { status?: string } } },
    fromHistory: boolean,
    direccion: string,
    handleSuccessfulSearch: (
      data: BasicInformationProps['informe'],
      skipCredits: boolean,
      direccion: string
    ) => Promise<BasicInformationProps['informe']>
  ) => Promise<boolean>;
  setError: (error: string | null) => void;
  lastSearchedRef: MutableRefObject<string>;
  isSearchingRef: MutableRefObject<boolean>;
  setLoading: (loading: boolean) => void;
}

export const useBuscarDireccionPageSearch = ({
  direccion,
  fromHistory,
  skipCredits,
  handleSuccessfulSearch,
  manejarInProgress,
  manejarError409,
  setError,
  lastSearchedRef,
  isSearchingRef,
  setLoading,
}: UseBuscarDireccionPageSearchProps) => {
  const performSearch = useCallback(async () => {
    const { executeSearch } = await import('../utils/buscar-direccion-search-handler');
    try {
      await executeSearch({
        direccion,
        fromHistory,
        skipCredits,
        handleSuccessfulSearch,
        manejarInProgress,
        manejarError409,
        setError,
        lastSearchedRef,
      });
    } finally {
      if (isSearchingRef.current) {
        setLoading(false);
        isSearchingRef.current = false;
      }
    }
  }, [
    direccion,
    fromHistory,
    skipCredits,
    handleSuccessfulSearch,
    manejarInProgress,
    manejarError409,
    setError,
    lastSearchedRef,
    isSearchingRef,
    setLoading,
  ]);

  return { performSearch };
};
