import React from 'react';

import { TutorialStep } from '../TutorialStep';

export const Step0Welcome: React.FC = () => {
  return (
    <TutorialStep
      title="¡Bienvenido!"
      description="Te damos la bienvenida a nuestra plataforma. Este tutorial te ayudará a conocer las principales funcionalidades en solo unos minutos."
    />
  );
};
