import { MutableRefObject, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { BasicInformationProps } from '../types/enums';
import { executeSearch } from '../utils/buscar-direccion-search-handler';

interface UseBuscarDireccionPageSearchLogicProps {
  direccion: string;
  validarDireccionInput: (direccion: string) => boolean;
  shouldSkipCredits: (fromHistory: boolean, direccion: string) => Promise<boolean>;
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
  setLoading: (loading: boolean) => void;
  isSearchingRef: MutableRefObject<boolean>;
  lastSearchedRef: MutableRefObject<string>;
}

export const useBuscarDireccionPageSearchLogic = ({
  direccion,
  validarDireccionInput,
  shouldSkipCredits,
  handleSuccessfulSearch,
  manejarInProgress,
  manejarError409,
  setError,
  setLoading,
  isSearchingRef,
  lastSearchedRef,
}: UseBuscarDireccionPageSearchLogicProps) => {
  const [params] = useSearchParams();

  const onSearch = useCallback(async () => {
    if (!validarDireccionInput(direccion)) {
      return;
    }

    const searchKey = `${direccion}-${params.get('fromHistory')}`;
    if (isSearchingRef.current || lastSearchedRef.current === searchKey) {
      return;
    }

    const fromHistory = params.get('fromHistory') === 'true';
    const skipCredits = await shouldSkipCredits(fromHistory, direccion);

    isSearchingRef.current = true;
    lastSearchedRef.current = searchKey;
    setError(null);
    setLoading(true);

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
    params,
    validarDireccionInput,
    shouldSkipCredits,
    handleSuccessfulSearch,
    manejarInProgress,
    manejarError409,
    setError,
    setLoading,
    isSearchingRef,
    lastSearchedRef,
  ]);

  return { onSearch };
};
