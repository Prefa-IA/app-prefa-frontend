import { useCallback } from 'react';

import { TERMS_STEP_INDEX } from '../constants/tutorial';
import { auth } from '../services/api';

interface UseTutorialActionsProps {
  usuario: { id?: string } | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: { acceptedTerms: boolean }) => Promise<void>;
  currentStep: number;
  setIsCompleted: (completed: boolean) => void;
  setIsVisible: (visible: boolean) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setNeedsTermsAcceptance: (needs: boolean) => void;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
}

export const useTutorialActions = ({
  usuario,
  refreshProfile,
  updateProfile,
  currentStep,
  setIsCompleted,
  setIsVisible,
  setTermsAccepted,
  setNeedsTermsAcceptance,
  setCurrentStep,
}: UseTutorialActionsProps) => {
  const acceptTerms = useCallback(async () => {
    if (usuario?.id) {
      try {
        await updateProfile({ acceptedTerms: true });
        await refreshProfile();
        setTermsAccepted(true);
        setNeedsTermsAcceptance(false);
        setCurrentStep(0);
      } catch (error) {
        console.error('Error aceptando términos:', error);
        throw error;
      }
    }
  }, [
    usuario?.id,
    updateProfile,
    refreshProfile,
    setTermsAccepted,
    setNeedsTermsAcceptance,
    setCurrentStep,
  ]);

  const skipTutorial = useCallback(async () => {
    if (currentStep === TERMS_STEP_INDEX) {
      return;
    }
    if (usuario?.id) {
      try {
        await auth.updateTutorialStatus('omit');
        await refreshProfile();
        setIsCompleted(true);
        setIsVisible(false);
      } catch (error) {
        console.error('Error actualizando estado del tutorial:', error);
      }
    }
  }, [usuario?.id, refreshProfile, currentStep, setIsCompleted, setIsVisible]);

  const completeTutorial = useCallback(async () => {
    if (usuario?.id) {
      try {
        await auth.updateTutorialStatus('finish');
        await refreshProfile();
        setIsCompleted(true);
        setIsVisible(false);
      } catch (error) {
        console.error('Error actualizando estado del tutorial:', error);
      }
    }
  }, [usuario?.id, refreshProfile, setIsCompleted, setIsVisible]);

  const startTutorial = useCallback(() => {
    setCurrentStep(0);
    setIsVisible(true);
  }, [setCurrentStep, setIsVisible]);

  return { acceptTerms, skipTutorial, completeTutorial, startTutorial };
};
