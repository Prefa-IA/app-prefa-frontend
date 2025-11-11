import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTutorial } from '../../hooks/useTutorial';
import { TutorialButtons } from './TutorialButtons';
import { TutorialProgress } from './TutorialProgress';
import { TutorialOverlay } from './TutorialOverlay';
import { Step0Welcome } from './steps/Step0Welcome';
import { Step1AnalisisPrefactibilidad } from './steps/Step1AnalisisPrefactibilidad';
import { Step2BuscarDireccion } from './steps/Step2BuscarDireccion';
import { Step3Registros } from './steps/Step3Registros';
import { Step4MiPerfil } from './steps/Step4MiPerfil';
import { Step5Planes } from './steps/Step5Planes';
import { TUTORIAL_STEPS, STEP_ROUTES, STEP_SELECTORS } from '../../constants/tutorial';

const STEP_COMPONENTS = [
  Step0Welcome,
  Step1AnalisisPrefactibilidad,
  Step2BuscarDireccion,
  Step3Registros,
  Step4MiPerfil,
  Step5Planes,
];

export const TutorialOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentStep,
    totalSteps,
    isVisible,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
  } = useTutorial();

  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setHasNavigated(false);
      return;
    }

    const targetRoute = STEP_ROUTES[currentStep];
    if (targetRoute && location.pathname !== targetRoute && !hasNavigated) {
      setHasNavigated(true);
      navigate(targetRoute);
      setTimeout(() => setHasNavigated(false), 500);
    }
  }, [currentStep, isVisible, navigate, location.pathname, hasNavigated]);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  const CurrentStepComponent = STEP_COMPONENTS[currentStep];
  const currentStepConfig = TUTORIAL_STEPS[currentStep];
  const highlightSelector = STEP_SELECTORS[currentStep] || currentStepConfig?.highlightElement;

  return (
    <>
      {highlightSelector && (
        <TutorialOverlay
          targetSelector={highlightSelector}
          isVisible={true}
        />
      )}

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto pointer-events-auto">
          <button
            onClick={skipTutorial}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Cerrar tutorial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <TutorialProgress currentStep={currentStep} totalSteps={totalSteps} />

          <div className="min-h-[300px] flex items-center justify-center">
            <CurrentStepComponent />
          </div>

          <TutorialButtons
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={previousStep}
            onNext={nextStep}
            onSkip={skipTutorial}
            onComplete={completeTutorial}
          />
        </div>
      </div>
    </>
  );
};

