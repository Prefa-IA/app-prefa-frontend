import { useState } from 'react';

import { TOTAL_TUTORIAL_STEPS } from '../constants/tutorial';
import { useAuth } from '../contexts/AuthContext';
import { UseTutorialReturn } from '../types/tutorial';

import { useTutorialActions } from './use-tutorial-actions';
import { useTutorialSteps } from './use-tutorial-steps';
import { useTutorialVisibility } from './use-tutorial-visibility';

export const useTutorial = (): UseTutorialReturn => {
  const { usuario, loading, refreshProfile, updateProfile } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    isVisible,
    setIsVisible,
    currentStep,
    setCurrentStep,
    isCompleted,
    setIsCompleted,
    needsTermsAcceptance,
    setNeedsTermsAcceptance,
  } = useTutorialVisibility({ usuario, loading });

  const { nextStep, previousStep } = useTutorialSteps({
    currentStep,
    setCurrentStep,
    termsAccepted,
  });

  const { acceptTerms, skipTutorial, completeTutorial, startTutorial } = useTutorialActions({
    usuario,
    refreshProfile,
    updateProfile,
    currentStep,
    setIsCompleted,
    setIsVisible,
    setTermsAccepted,
    setNeedsTermsAcceptance,
    setCurrentStep,
  });

  return {
    currentStep,
    totalSteps: needsTermsAcceptance ? TOTAL_TUTORIAL_STEPS + 1 : TOTAL_TUTORIAL_STEPS,
    isVisible,
    isCompleted,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    startTutorial,
    needsTermsAcceptance,
    termsAccepted,
    acceptTerms,
  };
};
