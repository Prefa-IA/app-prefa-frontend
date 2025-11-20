import React from 'react';
import { DocumentTextIcon } from '@heroicons/react/outline';

import { LISTA_INFORMES_CONFIG } from '../../types/enums';

export const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="text-gray-600">Cargando informes...</div>
  </div>
);

export const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="rounded-md bg-red-50 p-4">
    <div className="text-sm text-red-700">{error}</div>
  </div>
);

export const EmptyState: React.FC = () => (
  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
      {LISTA_INFORMES_CONFIG.EMPTY_STATE.TITLE}
    </h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
      {LISTA_INFORMES_CONFIG.EMPTY_STATE.DESCRIPTION}
    </p>
  </div>
);
