import { prefactibilidad } from '../services/api';
import { DireccionSugerida, CONSULTA_DIRECCION_CONFIG } from '../types/enums';
import { getCoordinatesFromAddress, Coordinates } from './mapUtils';
import { toast } from 'react-toastify';

export const obtenerSugerenciasDireccion = async (
  valor: string,
  setSugerencias: (sugerencias: DireccionSugerida[]) => void,
  setError: (error: string | null) => void
): Promise<void> => {
  if (valor.length <= 3) {
    setSugerencias([]);
    setError(null);
    return;
  }

  try {
    const sugerenciasData = await prefactibilidad.obtenerSugerenciasDirecciones(valor);
    setSugerencias(sugerenciasData);
    
    if (sugerenciasData.length === 0) {
      setError(CONSULTA_DIRECCION_CONFIG.MESSAGES.NO_ADDRESSES_FOUND);
    } else {
      setError(null);
    }
  } catch (error: any) {
    // No mostrar error si fue cancelado intencionalmente
    if (error.name !== 'AbortError') {
      console.error('Error al obtener sugerencias:', error);
      setSugerencias([]);
      setError(CONSULTA_DIRECCION_CONFIG.MESSAGES.ERROR_SUGGESTIONS);
    }
  }
};

export const manejarSeleccionSugerencia = async (
  direccionStr: string,
  sugerencias: DireccionSugerida[],
  setDireccion: (direccion: string) => void,
  setCenter: (center: Coordinates) => void,
  modoCompuesto: boolean,
  agregarDireccion: (direccion: string) => void
): Promise<void> => {
  const sugerenciaObj = sugerencias.find(s => s.direccion === direccionStr);
  const direccionFinal = sugerenciaObj ? sugerenciaObj.direccion : direccionStr;
  
  setDireccion(direccionFinal);
  
  // Para Buenos Aires, usar coordenadas por defecto del centro
  // En el futuro se puede integrar con la API de USIG para geocoding
  setCenter({ lat: -34.6037, lng: -58.3816 });
  
  // Ya no agregamos automáticamente; el usuario debe pulsar "Agregar dirección"
};

export const validarConsulta = (
  usuario: any,
  direccion: string,
  setError: (error: string | null) => void
): boolean => {
  if (!usuario) {
    setError(CONSULTA_DIRECCION_CONFIG.MESSAGES.LOGIN_REQUIRED);
    return false;
  }

  if (!direccion) {
    setError(CONSULTA_DIRECCION_CONFIG.MESSAGES.ADDRESS_REQUIRED);
    return false;
  }

  return true;
};

export const manejarErrorConsulta = (
  error: any,
  setError: (error: string | null) => void
): void => {
  console.error('Error en consulta:', error);
  const status403 = error?.response?.status === 403;
  const msgRaw = typeof error?.message === 'string' ? error.message : '';
  const msgNormalized = msgRaw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const sinCreditosMsg = msgNormalized.includes('creditos') || msgNormalized.includes('consultas');
  const sinCreditos = status403 || sinCreditosMsg;
  if (sinCreditos) {
    toast.error('No tienes créditos suficientes para realizar esta acción. Serás redirigido para mejorar tu plan.');
    setTimeout(() => {
      window.location.href = '/suscripciones';
    }, 3000);
    return;
  }
  setError(CONSULTA_DIRECCION_CONFIG.MESSAGES.ERROR_GENERAL);
};

export const manejarErrorPDF = (
  error: any,
  setError: (error: string | null) => void
): void => {
  console.error('Error al generar PDF:', error);
  setError(CONSULTA_DIRECCION_CONFIG.MESSAGES.ERROR_PDF);
};

export const manejarErrorGuardado = (
  error: any,
  setError: (error: string | null) => void
): void => {
  console.error('Error al guardar informe:', error);
  setError(CONSULTA_DIRECCION_CONFIG.MESSAGES.ERROR_SAVE);
}; 