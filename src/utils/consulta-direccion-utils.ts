import React from 'react';
import { toast } from 'react-toastify';

import { prefactibilidad } from '../services/api';
import { PROCESSING_CONFIG } from '../types/consulta-direccion';
import { CONSULTA_DIRECCION_CONFIG, DireccionSugerida } from '../types/enums';

import { Coordinates } from './map-utils';
import { sanitizePath } from './url-sanitizer';

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
  } catch (error: unknown) {
    if (error instanceof Error && error.name !== 'AbortError') {
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
  setCenter: (center: Coordinates) => void
): Promise<void> => {
  const sugerenciaObj = sugerencias.find((s) => s.direccion === direccionStr);
  const direccionFinal = sugerenciaObj ? sugerenciaObj.direccion : direccionStr;

  setDireccion(direccionFinal);

  // Para Buenos Aires, usar coordenadas por defecto del centro
  // En el futuro se puede integrar con la API de USIG para geocoding
  setCenter({ lat: -34.6037, lng: -58.3816 });

  // Ya no agregamos automáticamente; el usuario debe pulsar "Agregar dirección"
};

export const validarDireccionConNumero = (direccion: string | DireccionSugerida): boolean => {
  const direccionStr =
    typeof direccion === 'object' && direccion !== null
      ? (() => {
          const dirObj = direccion;
          if (dirObj.altura && dirObj.altura.trim() !== '') {
            return null; // Indica que tiene altura válida
          }
          return dirObj.direccion || null;
        })()
      : direccion;

  if (direccionStr === null) {
    return true; // Tiene altura válida
  }

  if (!direccionStr || direccionStr.trim().length === 0) {
    return false;
  }

  const numeroRegex = /\b\d+\s*[A-Za-z]?\b/;
  return numeroRegex.test(direccionStr);
};

export const validarConsulta = (
  usuario: unknown,
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

  if (!validarDireccionConNumero(direccion)) {
    setError(
      'La dirección debe incluir un número (altura). Por favor, ingrese una dirección completa con número.'
    );
    return false;
  }

  return true;
};

export const manejarErrorConsulta = (
  error: unknown,
  setError: (error: string | null) => void
): void => {
  console.error('Error en consulta:', error);
  const errorObj = error as {
    response?: { status?: number; data?: { error?: string; tienePlan?: boolean } };
    message?: string;
  };
  const status403 = errorObj?.response?.status === 403;
  const errorData = errorObj?.response?.data || {};
  const errorCode = errorData.error || '';
  const tienePlan = errorData.tienePlan === true;

  if (status403 && errorCode === 'sin_creditos_con_plan' && tienePlan) {
    toast.error(
      'No tienes créditos suficientes. Serás redirigido para comprar créditos adicionales.'
    );
    setTimeout(() => {
      const safePath = sanitizePath('/suscripciones#overages');
      window.location.href = safePath;
    }, 2000);
    return;
  }

  const msgRaw = typeof errorObj?.message === 'string' ? errorObj.message : '';
  const msgNormalized = msgRaw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const sinCreditosMsg = msgNormalized.includes('creditos') || msgNormalized.includes('consultas');
  const sinCreditos = status403 || sinCreditosMsg;
  if (sinCreditos) {
    toast.error(
      'No tienes créditos suficientes para realizar esta acción. Serás redirigido para mejorar tu plan.'
    );
    setTimeout(() => {
      const safePath = sanitizePath('/suscripciones');
      window.location.href = safePath;
    }, 3000);
    return;
  }
  setError(CONSULTA_DIRECCION_CONFIG.MESSAGES.ERROR_GENERAL);
};

export const manejarErrorPDF = (error: unknown, setError: (error: string | null) => void): void => {
  console.error('Error al generar PDF:', error);
  setError(CONSULTA_DIRECCION_CONFIG.MESSAGES.ERROR_PDF);
};

export const manejarErrorGuardado = (
  error: unknown,
  setError: (error: string | null) => void
): void => {
  console.error('Error al guardar informe:', error);
  setError(CONSULTA_DIRECCION_CONFIG.MESSAGES.ERROR_SAVE);
};

export const isValidProcessingResponse = (response: unknown): boolean => {
  if (!response || typeof response !== 'object') return false;
  const responseObj = response as Record<string, unknown>;
  const valores = PROCESSING_CONFIG.CRITICAL_FIELDS.map((key) => Reflect.get(responseObj, key));
  return !valores.every((v) => {
    if (v === undefined || v === null) return true;
    const s = String(v).trim();
    return s === '0' || s === '0.00' || s === '0.00 m2';
  });
};

export const confirmarToast = (mensaje: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const toastState = { id: null as React.ReactText | null };
    const handleClose = () => {
      if (toastState.id) toast.dismiss(toastState.id);
      resolve(false);
    };
    const handleConfirm = () => {
      if (toastState.id) toast.dismiss(toastState.id);
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
    toastState.id = toast.info(content, {
      closeButton: false,
      autoClose: false,
      position: 'top-center',
      style: {
        marginTop: '70px',
      },
    });
  });
};
