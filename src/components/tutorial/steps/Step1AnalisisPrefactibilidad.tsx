import React from 'react';
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';

import { TutorialStep } from '../TutorialStep';

export const Step1AnalisisPrefactibilidad: React.FC = () => {
  return (
    <TutorialStep
      title="Análisis de Prefactibilidad"
      description="En esta sección puedes generar reportes completos de prefactibilidad. Busca una dirección, completa los datos necesarios y descarga tu informe personalizado en formato PDF."
    >
      <div className="mt-6 flex items-center justify-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <DocumentTextIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Genera informes completos
        </span>
        <DownloadIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
    </TutorialStep>
  );
};
