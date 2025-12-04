import React from 'react';
import { ChatAlt2Icon } from '@heroicons/react/outline';

import { TutorialStep } from '../TutorialStep';

export const Step6Chatbot: React.FC = () => {
  return (
    <TutorialStep
      title="Chatbot de Ayuda"
      description="¿Tienes alguna pregunta? Nuestro chatbot Prefa está disponible 24/7 para ayudarte. Haz clic en el botón flotante en la esquina inferior derecha para iniciar una conversación."
    >
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <ChatAlt2Icon className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-gray-100">Asistente virtual</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Responde preguntas frecuentes y te guía en el uso de la plataforma
            </p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            El botón del chatbot aparece en la esquina inferior derecha de la pantalla
          </p>
        </div>
      </div>
    </TutorialStep>
  );
};
