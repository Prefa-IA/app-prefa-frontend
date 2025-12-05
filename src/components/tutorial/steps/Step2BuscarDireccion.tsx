import React from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/outline';

import { useAuth } from '../../../contexts/AuthContext';
import { useCreditStatus } from '../../../hooks/use-credit-status';
import { TutorialStep } from '../TutorialStep';

export const Step2BuscarDireccion: React.FC = () => {
  const { usuario } = useAuth();
  const { status } = useCreditStatus();
  const creditBalance = (status?.balance ?? usuario?.creditBalance) || 0;

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
              {creditBalance} créditos disponibles
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cada consulta consume créditos según su tipo y complejidad
            </p>
          </div>
        </div>
      </div>
    </TutorialStep>
  );
};
