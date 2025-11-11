import { prefactibilidad } from '../services/api';
import { DireccionSugerida, CONSULTA_DIRECCION_CONFIG } from '../types/enums';
import { Coordinates } from './mapUtils';
import React from 'react';
import { toast } from 'react-toastify';
import { PROCESSING_CONFIG } from '../types/consultaDireccion';
import { sanitizePath } from './urlSanitizer';

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
      const safePath = sanitizePath('/suscripciones');
      window.location.href = safePath;
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

export const isValidProcessingResponse = (response: any): boolean => {
  const valores = PROCESSING_CONFIG.CRITICAL_FIELDS.map((key) => response?.[key]);
  return !valores.every((v) => {
    if (v === undefined || v === null) return true;
    const s = String(v).trim();
    return s === '0' || s === '0.00' || s === '0.00 m2';
  });
};

export const confirmarToast = (mensaje: string): Promise<boolean> => {
  return new Promise((resolve) => {
    let toastId: React.ReactText;
    const handleClose = () => {
      toast.dismiss(toastId);
      resolve(false);
    };
    const handleConfirm = () => {
      toast.dismiss(toastId);
      resolve(true);
    };
    const content = React.createElement(
      'div',
      null,
      React.createElement('p', { className: 'mb-3' }, mensaje),
      React.createElement(
        'div',
        { className: 'flex justify-end space-x-2' },
        React.createElement(
          'button',
          {
            onClick: () => handleClose(),
            className: 'px-3 py-1 bg-gray-300 rounded hover:bg-gray-400',
          },
          'Cancelar'
        ),
        React.createElement(
          'button',
          {
            onClick: () => handleConfirm(),
            className: 'px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700',
          },
          'Sobrescribir'
        )
      )
    );
    toastId = toast.info(content, {
      closeButton: false,
      autoClose: false,
      position: 'top-center',
    });
  });
};