import React, { useCallback } from 'react';

import { Informe } from '../../types/enums';

interface IAResumen {
  debug?: {
    prompt?: string;
    raw?: string;
  };
  data?: unknown;
  [key: string]: unknown;
}

interface InformeWithIAResumen extends Informe {
  iaResumen?: IAResumen;
}

interface ReportIAResumenProps {
  informe: Informe | undefined;
}

const ReportIAResumen: React.FC<ReportIAResumenProps> = ({ informe }) => {
  const renderIAResumen = useCallback(() => {
    if (!informe || !(informe as InformeWithIAResumen).iaResumen) {
      return null;
    }

    const informeConIA = informe as InformeWithIAResumen;
    const iaResumen = informeConIA.iaResumen;

    if (!iaResumen) {
      return null;
    }

    if (iaResumen.debug) {
      return (
        <div className="border border-gray-300 dark:border-gray-700 rounded p-4 mb-6 bg-white dark:bg-gray-800 shadow space-y-4">
          <h2 className="text-lg font-semibold text-[#0369A1] dark:text-blue-400">
            Resumen IA (Capacidad Constructiva)
          </h2>
          <details open className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <summary className="cursor-pointer font-medium mb-2 dark:text-gray-200">
              Prompt enviado a Gemini
            </summary>
            <pre className="whitespace-pre-wrap text-xs overflow-x-auto max-h-64 dark:text-gray-300">
              {iaResumen.debug.prompt}
            </pre>
          </details>
          <details open className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <summary className="cursor-pointer font-medium mb-2 dark:text-gray-200">
              Respuesta cruda de Gemini
            </summary>
            <pre className="whitespace-pre-wrap text-xs overflow-x-auto max-h-64 dark:text-gray-300">
              {iaResumen.debug.raw}
            </pre>
          </details>
          <div>
            <h3 className="font-semibold mb-1 dark:text-gray-200">JSON procesado</h3>
            <pre className="whitespace-pre-wrap text-sm overflow-x-auto max-h-96 dark:text-gray-300">
              {JSON.stringify(iaResumen.data, null, 2)}
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded p-4 mb-6 bg-white dark:bg-gray-800 shadow space-y-4">
        <h2 className="text-lg font-semibold text-[#0369A1] dark:text-blue-400">
          Resumen IA (Capacidad Constructiva)
        </h2>
        <pre className="whitespace-pre-wrap text-sm overflow-x-auto max-h-96 dark:text-gray-300">
          {JSON.stringify(iaResumen, null, 2)}
        </pre>
      </div>
    );
  }, [informe]);

  return <>{renderIAResumen()}</>;
};

export default ReportIAResumen;
