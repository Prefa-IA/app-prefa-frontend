import { MutableRefObject } from 'react';

import { prefactibilidad } from '../services/api';
import { TIPO_PREFA, TipoPrefa } from '../types/consulta-direccion';
import { Usuario } from '../types/enums';
import { buscarInformeExistente } from '../utils/consulta-direccion-normalization';
import { confirmarToast, validarConsulta } from '../utils/consulta-direccion-utils';

interface UseSingleAddressSearchValidationProps {
  usuario: Usuario | null;
  direccion: string;
  tipoPrefa: TipoPrefa;
  modoCompuesto: boolean;
  agregarDireccion: (direccion: string) => void;
  setLoading: (loading: boolean) => void;
  setIsValidating: (isValidating: boolean) => void;
  isSearchingRef: MutableRefObject<boolean>;
  lastSearchedRef: MutableRefObject<string>;
}

const obtenerCoordenadas = async (direccion: string): Promise<{ lat: number; lon: number }> => {
  const response = await fetch(
    `https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=${encodeURIComponent(direccion)}&geocodificar=true`
  );
  const data = await response.json();
  if (!data.direccionesNormalizadas || data.direccionesNormalizadas.length === 0) {
    throw new Error('No se encontró la dirección');
  }
  const dir = data.direccionesNormalizadas[0];
  return {
    lat: parseFloat(dir.coordenadas.y),
    lon: parseFloat(dir.coordenadas.x),
  };
};

const verificarAPHEnrase = async (
  direccion: string
): Promise<{
  tieneAPH: boolean;
  tieneEnrase: boolean;
}> => {
  try {
    const coordenadas = await obtenerCoordenadas(direccion);
    const resultado = await prefactibilidad.validar(direccion, coordenadas);
    return { tieneAPH: resultado.tieneAPH, tieneEnrase: resultado.tieneEnrase };
  } catch {
    return { tieneAPH: false, tieneEnrase: false };
  }
};

const construirMensajeAPH = (tieneAPH: boolean, tieneEnrase: boolean): string => {
  const mensajes: string[] = [];
  if (tieneAPH) {
    mensajes.push('está protegida por Área de Protección Histórica (APH)');
  }
  if (tieneEnrase) {
    mensajes.push('tiene enrase');
  }
  return `Esta dirección ${mensajes.join(' y ')}. ¿Deseas continuar con la consulta?`;
};

const manejarConfirmacionAPH = async (
  tieneAPH: boolean,
  tieneEnrase: boolean,
  isSearchingRef: MutableRefObject<boolean>,
  lastSearchedRef: MutableRefObject<string>,
  setIsValidating: (isValidating: boolean) => void
): Promise<boolean> => {
  if (!tieneAPH && !tieneEnrase) return true;

  const mensaje = construirMensajeAPH(tieneAPH, tieneEnrase);
  const confirmar = await confirmarToast(mensaje, 'Continuar');
  if (!confirmar) {
    isSearchingRef.current = false;
    lastSearchedRef.current = '';
    setIsValidating(false);
    return false;
  }
  return true;
};

const manejarInformeExistente = async (
  informeExistente:
    | {
        tipoPrefa?: string;
        direccionesNormalizadas?: Array<{ direccion?: string }>;
        direccion?: { direccion?: string; altura?: string };
      }
    | undefined,
  isSearchingRef: MutableRefObject<boolean>,
  lastSearchedRef: MutableRefObject<string>,
  setLoading: (loading: boolean) => void
): Promise<boolean> => {
  if (!informeExistente) return true;

  setLoading(false);
  const confirmar = await confirmarToast(
    'Ya existe un informe para esta dirección. Si continúas, se creará un nuevo informe y se consumirán créditos nuevamente. Ambos informes permanecerán disponibles en tu listado.',
    'Continuar'
  );
  if (!confirmar) {
    isSearchingRef.current = false;
    lastSearchedRef.current = '';
    return false;
  }
  setLoading(true);
  return true;
};

const validarAPHEnrase = async (
  direccion: string,
  tipoPrefa: TipoPrefa,
  setIsValidating: (isValidating: boolean) => void,
  setLoading: (loading: boolean) => void,
  isSearchingRef: MutableRefObject<boolean>,
  lastSearchedRef: MutableRefObject<string>
): Promise<boolean> => {
  if (tipoPrefa !== TIPO_PREFA.SIMPLE && tipoPrefa !== TIPO_PREFA.COMPLETA) {
    return true;
  }

  setIsValidating(true);
  try {
    const { tieneAPH, tieneEnrase } = await verificarAPHEnrase(direccion);
    setIsValidating(false);

    const continuarAPH = await manejarConfirmacionAPH(
      tieneAPH,
      tieneEnrase,
      isSearchingRef,
      lastSearchedRef,
      setIsValidating
    );
    if (!continuarAPH) return false;
    setLoading(true);
    return true;
  } catch (error) {
    setIsValidating(false);
    throw error;
  }
};

export const useSingleAddressSearchValidation = ({
  usuario,
  direccion,
  tipoPrefa,
  modoCompuesto,
  agregarDireccion,
  setLoading,
  setIsValidating,
  isSearchingRef,
  lastSearchedRef,
}: UseSingleAddressSearchValidationProps) => {
  const validateAndCheckExisting = async (setError: (error: string | null) => void) => {
    if (!validarConsulta(usuario, direccion, setError)) return false;

    if (!tipoPrefa || (tipoPrefa !== TIPO_PREFA.SIMPLE && tipoPrefa !== TIPO_PREFA.COMPLETA)) {
      setError('Debes seleccionar un tipo de informe');
      return false;
    }

    if (modoCompuesto) {
      agregarDireccion(direccion);
      return false;
    }

    const searchKey = `${direccion}-${tipoPrefa}`;
    if (isSearchingRef.current || lastSearchedRef.current === searchKey) {
      return false;
    }

    const validacionAPH = await validarAPHEnrase(
      direccion,
      tipoPrefa,
      setIsValidating,
      setLoading,
      isSearchingRef,
      lastSearchedRef
    );
    if (!validacionAPH) return false;

    const direccionBusqueda = direccion.trim();
    const { informes } = await prefactibilidad.obtenerInformes(1, direccionBusqueda);
    const informeExistente = buscarInformeExistente(informes, direccionBusqueda, tipoPrefa);

    const continuarInforme = await manejarInformeExistente(
      informeExistente,
      isSearchingRef,
      lastSearchedRef,
      setLoading
    );
    if (!continuarInforme) return false;

    return true;
  };

  return { validateAndCheckExisting };
};
