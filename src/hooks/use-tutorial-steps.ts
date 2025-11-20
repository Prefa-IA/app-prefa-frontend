import { useCallback } from 'react';

import { TERMS_STEP_INDEX, TOTAL_TUTORIAL_STEPS } from '../constants/tutorial';

interface UseTutorialStepsProps {
  currentStep: number;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
  termsAccepted: boolean;
}

export const useTutorialSteps = ({
  currentStep: _currentStep,
  setCurrentStep,
  termsAccepted,
}: UseTutorialStepsProps) => {
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev === TERMS_STEP_INDEX) {
        if (termsAccepted) {
          return 0;
        }
        return prev;
      }
      if (prev < TOTAL_TUTORIAL_STEPS - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, [termsAccepted, setCurrentStep]);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > TERMS_STEP_INDEX && prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, [setCurrentStep]);

  return { nextStep, previousStep };
};
