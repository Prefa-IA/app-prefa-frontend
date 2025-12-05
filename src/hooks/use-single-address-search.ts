import { MutableRefObject, useCallback } from 'react';

import { TipoPrefa } from '../types/consulta-direccion';
import { Informe, Usuario } from '../types/enums';
import { Coordinates } from '../utils/map-utils';

import { useSingleAddressSearchExecution } from './use-single-address-search-execution';
import { useSingleAddressSearchValidation } from './use-single-address-search-validation';

interface DatosParcela {
  smp?: string;
  direccion?: string;
  [key: string]: unknown;
}

interface UseSingleAddressSearchProps {
  usuario: Usuario | null;
  direccion: string;
  tipoPrefa: TipoPrefa;
  modoCompuesto: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResultado: (resultado: Informe) => void;
  setCenter: (center: Coordinates) => void;
  setProcessing: (processing: boolean) => void;
  setIsValidating: (isValidating: boolean) => void;
  agregarDireccion: (direccion: string) => void;
  procesarCalculoPrefactibilidad: (datosParcela: DatosParcela) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshCredits: () => void;
  isSearchingRef: MutableRefObject<boolean>;
  lastSearchedRef: MutableRefObject<string>;
}

export const useSingleAddressSearch = ({
  usuario,
  direccion,
  tipoPrefa,
  modoCompuesto,
  setLoading,
  setError,
  setResultado,
  setCenter,
  setProcessing,
  setIsValidating,
  agregarDireccion,
  procesarCalculoPrefactibilidad,
  refreshProfile,
  refreshCredits,
  isSearchingRef,
  lastSearchedRef,
}: UseSingleAddressSearchProps) => {
  const { validateAndCheckExisting } = useSingleAddressSearchValidation({
    usuario,
    direccion,
    tipoPrefa,
    modoCompuesto,
    agregarDireccion,
    setLoading,
    setIsValidating,
    isSearchingRef,
    lastSearchedRef,
  });

  const { executeSearch, handleError } = useSingleAddressSearchExecution({
    direccion,
    tipoPrefa,
    setResultado,
    setCenter,
    setProcessing,
    procesarCalculoPrefactibilidad,
    refreshProfile,
    refreshCredits,
    setError,
    setLoading,
    isSearchingRef,
    lastSearchedRef,
  });

  const performSearch = useCallback(async () => {
    const isValid = await validateAndCheckExisting(setError);
    if (!isValid) return;

    const searchKey = `${direccion}-${tipoPrefa}`;
    isSearchingRef.current = true;
    lastSearchedRef.current = searchKey;
    setError(null);
    setLoading(true);

    try {
      await executeSearch();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
      isSearchingRef.current = false;
    }
  }, [
    validateAndCheckExisting,
    direccion,
    tipoPrefa,
    setError,
    setLoading,
    executeSearch,
    handleError,
    isSearchingRef,
    lastSearchedRef,
  ]);

  return { performSearch };
};
