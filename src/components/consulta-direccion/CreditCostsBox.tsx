import React, { useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { ChevronDownIcon, ChevronUpIcon, LightningBoltIcon } from '@heroicons/react/solid';

import { useCreditCosts } from '../../hooks/use-credit-costs';

interface CostItemProps {
  label: string;
  value: number;
}

const CostItem: React.FC<CostItemProps> = ({ label, value }) => (
  <div className="flex flex-col items-center py-3 px-4 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
      {label}
    </span>
    <div className="flex items-center gap-1.5">
      <LightningBoltIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{value}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">créditos</span>
    </div>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center gap-2 mb-4">
      <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Costo de Prefactibilidades
      </h3>
    </div>
    <div className="text-gray-500 dark:text-gray-400 animate-pulse">Cargando...</div>
  </div>
);

const CreditCostsBox: React.FC = () => {
  const { costs, loading } = useCreditCosts();
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return <LoadingState />;
  }

  const costItems = [
    { label: 'Prefactibilidad Simple', value: costs.simple },
    { label: 'Prefactibilidad Completa', value: costs.completa },
    { label: 'Prefactibilidad Compuesta', value: costs.compuesta },
    { label: 'Búsqueda Básica', value: costs.basicSearch },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center gap-2">
          <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Costo de Prefactibilidades
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {costItems.map((item) => (
              <CostItem key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Los créditos se consumen al generar el informe
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CreditCostsBox;
