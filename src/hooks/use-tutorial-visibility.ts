import { useEffect, useState } from 'react';

import { TERMS_STEP_INDEX } from '../constants/tutorial';

interface UseTutorialVisibilityProps {
  usuario: {
    id?: string;
    tutorialStatus?: string | null;
    googleId?: string | null;
    acceptedTerms?: boolean;
  } | null;
  loading: boolean;
}

export const useTutorialVisibility = ({
  usuario,
  loading,
}: UseTutorialVisibilityProps): {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
  isCompleted: boolean;
  setIsCompleted: (completed: boolean) => void;
  needsTermsAcceptance: boolean;
  setNeedsTermsAcceptance: (needs: boolean) => void;
} => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [needsTermsAcceptance, setNeedsTermsAcceptance] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsVisible(false);
      return undefined;
    }

    if (usuario?.id) {
      const hasSeenTutorial =
        usuario.tutorialStatus === 'finish' || usuario.tutorialStatus === 'omit';
      const needsTerms = Boolean(usuario.googleId && !usuario.acceptedTerms);

      setNeedsTermsAcceptance(needsTerms);
      setIsCompleted(hasSeenTutorial && !needsTerms);

      if (!hasSeenTutorial || needsTerms) {
        const timer = setTimeout(() => {
          setIsVisible(true);
          if (needsTerms) {
            setCurrentStep(TERMS_STEP_INDEX);
          } else {
            setCurrentStep(0);
          }
        }, 1000);

        return () => clearTimeout(timer);
      } else {
        setIsVisible(false);
        return undefined;
      }
    } else {
      setIsVisible(false);
      return undefined;
    }
  }, [usuario?.id, usuario?.tutorialStatus, usuario?.googleId, usuario?.acceptedTerms, loading]);

  return {
    isVisible,
    setIsVisible,
    currentStep,
    setCurrentStep,
    isCompleted,
    setIsCompleted,
    needsTermsAcceptance,
    setNeedsTermsAcceptance,
  };
};
