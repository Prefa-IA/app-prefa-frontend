import React from 'react';

import { TERMS_STEP_INDEX } from '../../constants/tutorial';

import { Step0Welcome } from './steps/Step0Welcome';
import { Step1AnalisisPrefactibilidad } from './steps/Step1AnalisisPrefactibilidad';
import { Step2BuscarDireccion } from './steps/Step2BuscarDireccion';
import { Step3Registros } from './steps/Step3Registros';
import { Step4MiPerfil } from './steps/Step4MiPerfil';
import { Step5Planes } from './steps/Step5Planes';
import { StepTermsConditions } from './steps/StepTermsConditions';

const STEP_COMPONENTS = [
  Step0Welcome,
  Step1AnalisisPrefactibilidad,
  Step2BuscarDireccion,
  Step3Registros,
  Step4MiPerfil,
  Step5Planes,
];

interface TutorialContentProps {
  currentStep: number;
  termsCheckboxAccepted: boolean;
  onTermsAcceptChange: (accepted: boolean) => void;
}

const TutorialContent: React.FC<TutorialContentProps> = ({
  currentStep,
  termsCheckboxAccepted: _termsCheckboxAccepted,
  onTermsAcceptChange,
}) => {
  const isTermsStep = currentStep === TERMS_STEP_INDEX;
  const CurrentStepComponent = isTermsStep ? null : Reflect.get(STEP_COMPONENTS, currentStep);

  return (
    <div className="min-h-[300px] flex items-center justify-center">
      {isTermsStep ? (
        <StepTermsConditions onAcceptChange={onTermsAcceptChange} />
      ) : (
        CurrentStepComponent && <CurrentStepComponent />
      )}
    </div>
  );
};

export default TutorialContent;
