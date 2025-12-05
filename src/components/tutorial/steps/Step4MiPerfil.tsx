import React from 'react';
import { ColorSwatchIcon, CreditCardIcon, UserIcon } from '@heroicons/react/outline';

import { TutorialStep } from '../TutorialStep';

export const Step4MiPerfil: React.FC = () => {
  return (
    <TutorialStep
      title="Mi Perfil"
      description="Personaliza tu experiencia: ajusta colores, tipografías, carga tu logo y gestiona toda tu información personal y de facturación."
    >
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <ColorSwatchIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
            Personalización
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            Colores, tipografías y logo
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <UserIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
            Información Personal
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Datos de tu cuenta</p>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CreditCardIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
            Facturación
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">Datos fiscales</p>
        </div>
      </div>
    </TutorialStep>
  );
};
