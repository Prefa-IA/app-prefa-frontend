import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/api';
import { TOTAL_TUTORIAL_STEPS } from '../constants/tutorial';
import { UseTutorialReturn } from '../types/tutorial';

export const useTutorial = (): UseTutorialReturn => {
  const { usuario, loading, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsVisible(false);
      return;
    }

    if (usuario?.id) {
      const hasSeenTutorial = usuario.tutorialStatus === 'finish' || usuario.tutorialStatus === 'omit';
      setIsCompleted(hasSeenTutorial);
      
      if (!hasSeenTutorial) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      } else {
        setIsVisible(false);
      }
    } else {
      setIsVisible(false);
    }
  }, [usuario?.id, usuario?.tutorialStatus, loading]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < TOTAL_TUTORIAL_STEPS - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const skipTutorial = useCallback(async () => {
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
  }, [usuario?.id, refreshProfile]);

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
    totalSteps: TOTAL_TUTORIAL_STEPS,
    isVisible,
    isCompleted,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    startTutorial,
  };
};

