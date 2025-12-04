import { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

import { useAuth } from '../contexts/AuthContext';
import { Informe } from '../types/enums';
import { verificarEnHistorial } from '../utils/buscar-direccion-helpers';
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

  const shouldSkipCredits = useCallback(
    async (fromHistory: boolean, direccion: string): Promise<boolean> => {
      if (fromHistory) return true;
      const enHistorial = await verificarEnHistorial(direccion);
      return enHistorial;
    },
    []
  );

  const handleSuccessfulSearch = useCallback(
    async (data: Informe, skipCredits: boolean, direccion: string) => {
      updateMapCenter(data, setCenter);
      const enHistorial = await verificarEnHistorial(direccion);
      if (!enHistorial) {
        try {
          const { addAddressToHistory } = await import('../services/address-history');
          await addAddressToHistory(direccion);
        } catch {
          // Ignorar errores al agregar al historial
        }
      }
      await refreshProfile();
      if (skipCredits) {
        toast.info('Dirección encontrada. No se consumieron créditos.');
      } else {
        toast.success('Búsqueda completada exitosamente.');
      }
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
