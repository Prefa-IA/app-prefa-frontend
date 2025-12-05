import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { BasicInformationProps } from '../types/enums';
import { isValidProcessingResponse } from '../utils/consulta-direccion-utils';
import { Coordinates, getDefaultMapCenter } from '../utils/map-utils';

import { useBuscarDireccion } from './use-buscar-direccion';
import { useBuscarDireccionPageCalculations } from './use-buscar-direccion-page-calculations';
import { useBuscarDireccionPageInitialization } from './use-buscar-direccion-page-initialization';
import { useBuscarDireccionPageSearchLogic } from './use-buscar-direccion-page-search-logic';

type InformeStateSetter = Dispatch<SetStateAction<BasicInformationProps['informe'] | null>>;

const mergeInformeWithCalculo = (
  informeBase: BasicInformationProps['informe'],
  calculoResponse: Record<string, unknown>
): BasicInformationProps['informe'] => {
  const calculoFromResponse = calculoResponse['calculo'] as Record<string, unknown> | undefined;
  const mergedCalculo = calculoFromResponse || informeBase.calculo;

  return {
    ...informeBase,
    ...(calculoResponse as unknown as BasicInformationProps['informe']),
    ...(mergedCalculo ? { calculo: mergedCalculo } : {}),
  };
};

const requestCalculoAndMerge = async (
  informe: BasicInformationProps['informe'],
  setResultado: InformeStateSetter
) => {
  try {
    const calculoResponse = await prefactibilidad.calcular(informe);
    if (calculoResponse && isValidProcessingResponse(calculoResponse)) {
      setResultado((prev) => {
        const base = prev ?? informe;
        return mergeInformeWithCalculo(base, calculoResponse as Record<string, unknown>);
      });
    }
  } catch (error) {
    console.error('Error al obtener cálculo para la búsqueda de dirección:', error);
  }
};

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

      if (result && !result.calculo) {
        void requestCalculoAndMerge(result, setResultado);
      }

      return result;
    },
    [handleSuccessfulSearchBase, setResultado]
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
