import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrencyDollarIcon, SparklesIcon } from '@heroicons/react/outline';

import { TutorialStep } from '../TutorialStep';

export const Step5Planes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <TutorialStep
      title="Planes y Precios"
      description="Explora nuestros planes disponibles y elige el que mejor se adapte a tus necesidades. Puedes actualizar tu plan en cualquier momento desde tu perfil."
    >
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <SparklesIcon className="h-8 w-8 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-gray-100">Planes flexibles</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Desde créditos básicos hasta planes ilimitados
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CurrencyDollarIcon className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-gray-100">Actualización fácil</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cambia de plan cuando lo necesites
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/suscripciones')}
          className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ver planes disponibles
        </button>
      </div>
    </TutorialStep>
  );
};
