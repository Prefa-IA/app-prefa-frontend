import { MutableRefObject } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { TIPO_PREFA, TipoPrefa } from '../types/consulta-direccion';
import { Informe } from '../types/enums';
import { manejarErrorConsulta } from '../utils/consulta-direccion-utils';
import { Coordinates, updateMapCenter } from '../utils/map-utils';
import {
  generarMensajeDatosFaltantes,
  obtenerDatosFaltantes,
  validarDatosCompletos,
} from '../utils/report-utils';

interface DatosParcela {
  smp?: string;
  direccion?: string;
  [key: string]: unknown;
}

interface UseSingleAddressSearchExecutionProps {
  direccion: string;
  tipoPrefa: TipoPrefa;
  setResultado: (resultado: Informe) => void;
  setCenter: (center: Coordinates) => void;
  setProcessing: (processing: boolean) => void;
  procesarCalculoPrefactibilidad: (datosParcela: DatosParcela) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshCredits: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  isSearchingRef: MutableRefObject<boolean>;
  lastSearchedRef: MutableRefObject<string>;
}

export const useSingleAddressSearchExecution = ({
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
}: UseSingleAddressSearchExecutionProps) => {
  const executeSearch = async () => {
    const searchStartTime = Date.now();
    setProcessing(true);

    const response = await prefactibilidad.consultarDireccion(direccion, {
      prefaCompleta: tipoPrefa === TIPO_PREFA.COMPLETA,
      compuesta: false,
      skipCredits: false,
    });

    if ('inProgress' in response && response.inProgress) {
      toast.info('Ya tienes una consulta en curso. Espera a que finalice.');
      isSearchingRef.current = false;
      setLoading(false);
      setProcessing(false);
      return;
    }

    setResultado(response);
    void refreshProfile();
    refreshCredits();
    updateMapCenter(response, setCenter);

    const datosCompletos = validarDatosCompletos(response);
    const datosIncompletos = Boolean(response.datosIncompletos) || !datosCompletos;

    if (datosIncompletos) {
      const datosFaltantes = obtenerDatosFaltantes(response);
      const mensaje = generarMensajeDatosFaltantes(datosFaltantes);
      toast.warning(mensaje, {
        autoClose: 5000,
      });
    }

    if (!('inProgress' in response && response.inProgress)) {
      await procesarCalculoPrefactibilidad(response as unknown as DatosParcela);
    }
    if (Date.now() - searchStartTime > 120000) {
      console.warn(
        `[SLOW] Frontend - executeSearch tardó más de 2 minutos: ${Date.now() - searchStartTime}ms`
      );
    }
  };

  const handleError = (err: unknown) => {
    manejarErrorConsulta(err, setError);
    setProcessing(false);
    lastSearchedRef.current = '';
  };

  return { executeSearch, handleError };
};
