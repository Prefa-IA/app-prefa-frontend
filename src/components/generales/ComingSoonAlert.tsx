import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

const getStorageKey = (userId: string | undefined) => {
  if (!userId) return null;
  return `prefa_coming_soon_alert_closed_${userId}`;
};

const ComingSoonAlert: React.FC = () => {
  const location = useLocation();
  const { usuario } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (location.pathname === '/consultar' && usuario?.id) {
      const storageKey = getStorageKey(usuario.id);
      if (storageKey) {
        const alertClosed = localStorage.getItem(storageKey);
        const wasClosed = alertClosed === 'true';
        setIsVisible(!wasClosed);
      } else {
        setIsVisible(false);
      }
    } else {
      setIsVisible(false);
    }
  }, [location.pathname, usuario?.id]);

  const handleClose = () => {
    if (!usuario?.id) return;
    
    setIsVisible(false);
    const storageKey = getStorageKey(usuario.id);
    if (storageKey) {
      localStorage.setItem(storageKey, 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full flex justify-center items-start mt-5 mb-4">
      <div className="w-full max-w-6xl">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg shadow-md p-4 md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🚀</span>
              <h3 className="text-base md:text-lg font-semibold text-blue-900 dark:text-blue-100">
                Estamos construyendo el futuro de la prefactibilidad
              </h3>
            </div>
            <p className="text-sm md:text-base text-blue-800 dark:text-blue-200 leading-relaxed">
              Nos encontramos en etapa de validación técnica. Aproveche hoy el uso gratuito de nuestra herramienta de búsqueda mientras finalizamos los detalles para el lanzamiento comercial. Manténgase atento a las próximas actualizaciones.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-blue-600 dark:text-blue-400"
            aria-label="Cerrar alerta"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonAlert;

