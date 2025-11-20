import { MutableRefObject, useCallback } from 'react';

import { Informe } from '../types/enums';

interface UseBuscarDireccionErrorHandlersProps {
  setLoading: (loading: boolean) => void;
  isSearchingRef: MutableRefObject<boolean>;
}

export const useBuscarDireccionErrorHandlers = ({
  setLoading,
  isSearchingRef,
}: UseBuscarDireccionErrorHandlersProps) => {
  const manejarInProgress = useCallback(
    async (
      fromHistory: boolean,
      direccion: string,
      handleSuccessfulSearch: (
        data: Informe,
        skipCredits: boolean,
        direccion: string
      ) => Promise<Informe>
    ): Promise<boolean> => {
      const { manejarInProgressHelper } = await import('../utils/buscar-direccion-error-handlers');
      return manejarInProgressHelper({
        fromHistory,
        direccion,
        handleSuccessfulSearch,
        setLoading,
        isSearchingRef,
      });
    },
    [setLoading, isSearchingRef]
  );

  const manejarError409 = useCallback(
    async (
      error: { code?: string; response?: { status?: number; data?: { status?: string } } },
      fromHistory: boolean,
      direccion: string,
      handleSuccessfulSearch: (
        data: Informe,
        skipCredits: boolean,
        direccion: string
      ) => Promise<Informe>
    ): Promise<boolean> => {
      const { manejarError409Helper } = await import('../utils/buscar-direccion-error-handlers');
      return manejarError409Helper({
        error,
        fromHistory,
        direccion,
        handleSuccessfulSearch,
        setLoading,
        isSearchingRef,
      });
    },
    [setLoading, isSearchingRef]
  );

  return { manejarInProgress, manejarError409 };
};
