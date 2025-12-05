import React from 'react';

import { TipoPrefa } from '../types/consulta-direccion';
import { Informe, Usuario } from '../types/enums';
import { Coordinates } from '../utils/map-utils';

import { useSingleAddressSearch } from './use-single-address-search';

interface DatosParcela {
  smp?: string;
  direccion?: string;
  [key: string]: unknown;
}

interface UseSingleAddressConsultationProps {
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
}

export const useSingleAddressConsultation = ({
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
}: UseSingleAddressConsultationProps) => {
  const isSearchingRef = React.useRef(false);
  const lastSearchedRef = React.useRef<string>('');

  const { performSearch } = useSingleAddressSearch({
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
  });

  const handleSearch = React.useCallback(async () => {
    await performSearch();
  }, [performSearch]);

  const clearLastSearched = React.useCallback(() => {
    lastSearchedRef.current = '';
    isSearchingRef.current = false;
  }, []);

  return { handleSearch, clearLastSearched };
};
