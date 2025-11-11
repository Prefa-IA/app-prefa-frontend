import React from 'react';
import { TutorialStep } from '../TutorialStep';
import { CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/outline';

export const Step2BuscarDireccion: React.FC = () => {
  return (
    <TutorialStep
      title="Buscar Dirección"
      description="Utiliza esta herramienta para buscar direcciones y generar consultas de prefactibilidad. Cada consulta consume créditos según su tipo."
    >
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CurrencyDollarIcon className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              50 créditos de bienvenida
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Se renuevan automáticamente el día 1 de cada mes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="text-left">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              Renovación mensual
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Siempre recibirás 50 créditos el primer día de cada mes
            </p>
          </div>
        </div>
      </div>
    </TutorialStep>
  );
};

