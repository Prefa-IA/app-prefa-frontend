import { useCallback, useEffect, useState } from 'react';

import { TERMS_STEP_INDEX, TOTAL_TUTORIAL_STEPS } from '../constants/tutorial';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/api';
import { UseTutorialReturn } from '../types/tutorial';

export const useTutorial = (): UseTutorialReturn => {
  const { usuario, loading, refreshProfile, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [needsTermsAcceptance, setNeedsTermsAcceptance] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
  }, [usuario?.id, updateProfile, refreshProfile]);

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
  }, [termsAccepted]);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > TERMS_STEP_INDEX && prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

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
  }, [usuario?.id, refreshProfile, currentStep]);

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
  }, [usuario?.id, refreshProfile]);

  const startTutorial = useCallback(() => {
    setCurrentStep(0);
    setIsVisible(true);
  }, []);

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
