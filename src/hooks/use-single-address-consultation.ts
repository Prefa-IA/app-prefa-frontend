import React, { useCallback } from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { TIPO_PREFA, TipoPrefa } from '../types/consulta-direccion';
import { Informe, Usuario } from '../types/enums';
import {
  confirmarToast,
  manejarErrorConsulta,
  validarConsulta,
} from '../utils/consulta-direccion-utils';
import { Coordinates, updateMapCenter } from '../utils/map-utils';

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
  agregarDireccion,
  procesarCalculoPrefactibilidad,
  refreshProfile,
  refreshCredits,
}: UseSingleAddressConsultationProps) => {
  const isSearchingRef = React.useRef(false);
  const lastSearchedRef = React.useRef<string>('');

  const handleSearch = useCallback(async () => {
    if (!validarConsulta(usuario, direccion, setError)) return;

    if (modoCompuesto) {
      agregarDireccion(direccion);
      return;
    }

    const searchKey = `${direccion}-${tipoPrefa}`;
    if (isSearchingRef.current || lastSearchedRef.current === searchKey) {
      return;
    }

    isSearchingRef.current = true;
    lastSearchedRef.current = searchKey;
    setError(null);
    setLoading(true);

    try {
      const direccionBusqueda = direccion.trim();
      const { informes } = await prefactibilidad.obtenerInformes(1, direccionBusqueda);

      const normalizarDireccion = (dir: string): string => {
        if (!dir) return '';
        return dir
          .trim()
          .toUpperCase()
          .replace(/\s+/g, ' ')
          .replace(/,\s*/g, ',')
          .replace(/\s*,\s*/g, ',');
      };

      const direccionNormalizada = normalizarDireccion(direccionBusqueda);

      const informeExistente = informes.find((inf) => {
        if (inf.tipoPrefa !== tipoPrefa) return false;

        const direccionInforme =
          inf.direccionesNormalizadas?.[0]?.direccion ||
          `${inf.direccion?.direccion || ''} ${inf.direccion?.altura || ''}`.trim();

        if (!direccionInforme) return false;

        const informeNormalizado = normalizarDireccion(direccionInforme);

        return (
          informeNormalizado === direccionNormalizada ||
          informeNormalizado.includes(direccionNormalizada) ||
          direccionNormalizada.includes(informeNormalizado)
        );
      });

      if (informeExistente) {
        setLoading(false);
        const confirmar = await confirmarToast(
          'Ya existe un informe para esta dirección. Si continúas, se sobrescribirá el anterior y se consumirán créditos nuevamente.'
        );
        if (!confirmar) {
          isSearchingRef.current = false;
          lastSearchedRef.current = '';
          return;
        }
        setLoading(true);
      }

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

      if (!('inProgress' in response && response.inProgress)) {
        await procesarCalculoPrefactibilidad(response as unknown as DatosParcela);
      }
    } catch (err) {
      manejarErrorConsulta(err, setError);
      setProcessing(false);
      lastSearchedRef.current = '';
    } finally {
      setLoading(false);
      isSearchingRef.current = false;
    }
  }, [
    usuario,
    direccion,
    modoCompuesto,
    tipoPrefa,
    refreshProfile,
    procesarCalculoPrefactibilidad,
    agregarDireccion,
    refreshCredits,
    setLoading,
    setError,
    setResultado,
    setCenter,
    setProcessing,
  ]);

  return { handleSearch };
};
