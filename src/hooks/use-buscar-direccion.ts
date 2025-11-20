import { useCallback, useRef } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { Informe } from '../types/enums';
import {
  buscarInformeExistente,
  normalizarDireccion,
  verificarEnHistorial,
} from '../utils/buscar-direccion-helpers';
import { validarDireccionConNumero } from '../utils/consulta-direccion-utils';
import { Coordinates, updateMapCenter } from '../utils/map-utils';

import { useBuscarDireccionErrorHandlers } from './use-buscar-direccion-error-handlers';

interface UseBuscarDireccionProps {
  setCenter: React.Dispatch<React.SetStateAction<Coordinates>>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useBuscarDireccion = ({
  setCenter,
  setLoading,
  setError,
}: UseBuscarDireccionProps) => {
  const { refreshProfile } = useAuth();
  const isSearchingRef = useRef(false);
  const lastSearchedRef = useRef<string>('');

  const buscarInformeExistenteMemo = useCallback(
    async (direccion: string): Promise<Informe | null> => {
      return buscarInformeExistente(direccion, normalizarDireccion);
    },
    []
  );

  const shouldSkipCredits = useCallback(
    async (fromHistory: boolean, direccion: string): Promise<boolean> => {
      if (fromHistory) return true;
      const enHistorial = await verificarEnHistorial(direccion);
      if (enHistorial) return true;

      try {
        const informeExistente = await buscarInformeExistenteMemo(direccion);
        return !!informeExistente;
      } catch {
        return false;
      }
    },
    [buscarInformeExistenteMemo]
  );

  const handleSuccessfulSearch = useCallback(
    async (data: Informe, skipCredits: boolean, direccion: string) => {
      updateMapCenter(data, setCenter);
      if (!skipCredits) {
        try {
          const { addAddressToHistory } = await import('../services/address-history');
          await addAddressToHistory(direccion);
        } catch {
          // Ignorar errores al agregar al historial
        }
      }
      await refreshProfile();
      return data;
    },
    [setCenter, refreshProfile]
  );

  const validarDireccionInput = useCallback(
    (direccion: string): boolean => {
      if (!direccion || direccion.trim().length < 3) {
        setError('Ingrese una dirección válida.');
        return false;
      }

      if (!validarDireccionConNumero(direccion)) {
        setError(
          'La dirección debe incluir un número (altura). Por favor, ingrese una dirección completa con número.'
        );
        return false;
      }

      return true;
    },
    [setError]
  );

  const { manejarInProgress, manejarError409 } = useBuscarDireccionErrorHandlers({
    setLoading,
    isSearchingRef,
  });

  return {
    isSearchingRef,
    lastSearchedRef,
    shouldSkipCredits,
    handleSuccessfulSearch,
    validarDireccionInput,
    manejarInProgress,
    manejarError409,
  };
};
