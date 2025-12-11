import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useTheme } from '../contexts/ThemeContext';
import { prefactibilidad } from '../services/api';
import { TIPO_PREFA } from '../types/consulta-direccion';
import { Informe, PrefaType } from '../types/enums';

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
        const data = await prefactibilidad.obtenerInformeCompartido(token);
        setInforme(data);
      } catch (err: unknown) {
        console.error('[CompartirInforme] Error cargando informe', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Error al cargar el informe compartido. El enlace puede ser inválido o haber expirado.';
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
