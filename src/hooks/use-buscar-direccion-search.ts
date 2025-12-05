import { MutableRefObject, useCallback } from 'react';

import { BasicInformationProps } from '../types/enums';
import { executeSearch } from '../utils/buscar-direccion-search-handler';

interface UseBuscarDireccionSearchProps {
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

export const useBuscarDireccionSearch = ({
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
}: UseBuscarDireccionSearchProps) => {
  const performSearch = useCallback(async () => {
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

    if (isSearchingRef.current) {
      setLoading(false);
      isSearchingRef.current = false;
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
