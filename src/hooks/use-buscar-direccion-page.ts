import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { BasicInformationProps } from '../types/enums';
import { Coordinates, getDefaultMapCenter } from '../utils/map-utils';

import { useBuscarDireccion } from './use-buscar-direccion';
import { useBuscarDireccionPageCalculations } from './use-buscar-direccion-page-calculations';
import { useBuscarDireccionPageInitialization } from './use-buscar-direccion-page-initialization';
import { useBuscarDireccionPageSearchLogic } from './use-buscar-direccion-page-search-logic';

export const useBuscarDireccionPage = () => {
  const [params] = useSearchParams();
  const [direccion, setDireccion] = useState<string>(params.get('direccion') || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [resultado, setResultado] = useState<BasicInformationProps['informe'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [center, setCenter] = useState<Coordinates>(getDefaultMapCenter());

  const {
    isSearchingRef,
    lastSearchedRef,
    shouldSkipCredits,
    handleSuccessfulSearch: handleSuccessfulSearchBase,
    validarDireccionInput,
    manejarInProgress,
    manejarError409,
  } = useBuscarDireccion({ setCenter, setLoading, setError });

  const handleSuccessfulSearch = useCallback(
    async (data: BasicInformationProps['informe'], skipCredits: boolean, direccion: string) => {
      const result = await handleSuccessfulSearchBase(data, skipCredits, direccion);
      setResultado(result);
      return result;
    },
    [handleSuccessfulSearchBase]
  );

  const { onSearch } = useBuscarDireccionPageSearchLogic({
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
  });

  useBuscarDireccionPageInitialization({
    onSearch,
    setDireccion,
    isSearchingRef,
    lastSearchedRef,
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  const calculatedValues = useBuscarDireccionPageCalculations(resultado);

  return {
    direccion,
    setDireccion,
    loading,
    resultado,
    setResultado,
    error,
    center,
    calculatedValues,
    onSearch,
    lastSearchedRef,
  };
};
