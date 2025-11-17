import React from 'react';

import { TutorialStep } from '../TutorialStep';

export const Step3Registros: React.FC = () => {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <TutorialStep
      title="Registros"
      description="Accede a tus registros y direcciones guardadas. Puedes activar o desactivar el modo compuesto con el toggle para realizar consultas más complejas que combinan múltiples direcciones."
    >
      <div className="mt-6 flex flex-col items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-300 font-medium">Modo compuesto</span>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`${
              enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Activa el modo compuesto para consultas que incluyen múltiples direcciones en un solo
          informe
        </p>
      </div>
    </TutorialStep>
  );
};
