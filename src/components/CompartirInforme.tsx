import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { useTheme } from '../contexts/ThemeContext';
import { prefactibilidad } from '../services/api';
import { TIPO_PREFA } from '../types/consulta-direccion';
import { Informe, PrefaType } from '../types/enums';
import { isValidProcessingResponse } from '../utils/consulta-direccion-utils';

import ReportPreview from './reportes/ReportPreview';

const WATERMARK_STYLE_SELECTOR = 'style[data-watermark="shared"]';

const usePrefaWatermark = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const prefaUrl = `url(/logo.png)`;
    const filter = theme === 'dark' ? 'filter: invert(1);' : '';

    const existingStyleEl = document.querySelector(WATERMARK_STYLE_SELECTOR) as HTMLStyleElement;
    const styleEl =
      existingStyleEl ||
      (() => {
        const newStyleEl = document.createElement('style');
        newStyleEl.setAttribute('data-watermark', 'shared');
        document.head.appendChild(newStyleEl);
        return newStyleEl;
      })();

    styleEl.innerHTML = `
      [data-report-container] {
        position: relative;
      }
      [data-report-container]::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        min-height: 100vh;
        pointer-events: none;
        opacity: 0.1;
        transform: none;
        background-repeat: repeat;
        background-position: left top;
        background-size: 400px 144px;
        z-index: 9999;
        background-image: ${prefaUrl};
        ${filter}
      }
    `;

    return () => {
      const el = document.querySelector(WATERMARK_STYLE_SELECTOR);
      if (el) {
        document.head.removeChild(el);
      }
    };
  }, [theme]);
};

const necesitaRecalcular = (informe: Informe): boolean => {
  const calculo = informe.calculo as Record<string, unknown> | undefined;
  if (!calculo) return true;

  const m2Ret1 = calculo['m2Ret1'] as number | undefined;
  const m2Ret2 = calculo['m2Ret2'] as number | undefined;
  const areaPrimerRetiro = calculo['areaPrimerRetiro'] as number | undefined;
  const areaSegundoRetiro = calculo['areaSegundoRetiro'] as number | undefined;

  const tieneRetiros = calculo['tieneRetiros'] as boolean | undefined;
  if (
    tieneRetiros &&
    (m2Ret1 === undefined || m2Ret1 === null || m2Ret2 === undefined || m2Ret2 === null)
  ) {
    if (
      areaPrimerRetiro === undefined ||
      areaPrimerRetiro === null ||
      areaSegundoRetiro === undefined ||
      areaSegundoRetiro === null
    ) {
      return true;
    }
  }

  return false;
};

const SHARE_CACHE_TTL_MS = 2000;
const sharedInformeCache = new Map<string, { data: Informe; expiresAt: number }>();
const sharedInformeInFlight = new Map<string, Promise<Informe>>();

const getCachedSharedInforme = (token: string) => {
  const cached = sharedInformeCache.get(token);
  if (!cached) return null;
  if (cached.expiresAt < Date.now()) {
    sharedInformeCache.delete(token);
    return null;
  }
  return cached.data;
};

const loadSharedInforme = async (token: string) => {
  const cached = getCachedSharedInforme(token);
  if (cached) return cached;

  const existing = sharedInformeInFlight.get(token);
  if (existing) {
    return existing;
  }

  const inFlight = (async () => {
    const dataInicial = await prefactibilidad.obtenerInformeCompartido(token);

    const dataFinal = necesitaRecalcular(dataInicial)
      ? await (async () => {
          try {
            const parcelaParaCalcular = { ...dataInicial } as Record<string, unknown>;
            const respuestaCalculo = await prefactibilidad.calcular(parcelaParaCalcular);

            if (respuestaCalculo && isValidProcessingResponse(respuestaCalculo)) {
              const calculoFromResponse = respuestaCalculo['calculo'] as
                | Record<string, unknown>
                | undefined;
              return {
                ...dataInicial,
                ...respuestaCalculo,
                calculo: calculoFromResponse || dataInicial.calculo,
              } as Informe;
            }
            return dataInicial;
          } catch (calcError) {
            console.warn(
              '[CompartirInforme] Error al recalcular, usando datos guardados',
              calcError
            );
            return dataInicial;
          }
        })()
      : dataInicial;

    sharedInformeCache.set(token, {
      data: dataFinal,
      expiresAt: Date.now() + SHARE_CACHE_TTL_MS,
    });
    return dataFinal;
  })();

  sharedInformeInFlight.set(token, inFlight);
  try {
    return await inFlight;
  } finally {
    sharedInformeInFlight.delete(token);
  }
};

const useInformeCompartido = (token: string | undefined) => {
  const [informe, setInforme] = useState<Informe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInforme = async () => {
      if (!token) {
        setError('Token no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const dataFinal = await loadSharedInforme(token);
        setInforme(dataFinal);
      } catch (err: unknown) {
        console.error('[CompartirInforme] Error cargando informe', err);
        const errorMessage = (() => {
          const fallbackMessage =
            err instanceof Error
              ? err.message
              : 'Error al cargar el informe compartido. El enlace puede ser inválido o haber expirado.';
          if (axios.isAxiosError(err) && err.response?.status === 410) {
            return 'Este enlace ya fue utilizado. Genera un nuevo link para compartir.';
          }
          return fallbackMessage;
        })();
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    void fetchInforme();
  }, [token]);

  return { informe, loading, error };
};

const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Cargando informe...</p>
    </div>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        No se pudo cargar el informe
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        Por favor, verifica que el enlace sea correcto o contacta a quien te lo compartió.
      </p>
    </div>
  </div>
);

const NotFoundState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <p className="text-gray-600 dark:text-gray-400">Informe no encontrado</p>
    </div>
  </div>
);

const CompartirInforme: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { informe, loading, error } = useInformeCompartido(token);
  usePrefaWatermark();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!informe) return <NotFoundState />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informe Compartido
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {informe.direccion.direccion}
            </p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Compartido públicamente</div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ReportPreview
          informe={informe}
          isCompoundMode={false}
          addresses={[]}
          isLoading={false}
          center={{
            lat: Number(informe.googleMaps.lat),
            lng: Number(informe.googleMaps.lon),
          }}
          savedId={informe._id || null}
          tipoPrefa={(informe.tipoPrefa as PrefaType) || (TIPO_PREFA.COMPLETA as PrefaType)}
        />
      </div>
    </div>
  );
};

export default CompartirInforme;
