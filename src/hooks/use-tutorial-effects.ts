import { useEffect } from 'react';

import { TERMS_STEP_INDEX } from '../constants/tutorial';

interface UseTutorialEffectsProps {
  currentStep: number;
  isVisible: boolean;
}

const CHATBOT_STEP_INDEX = 2;

export const useTutorialEffects = ({ currentStep, isVisible }: UseTutorialEffectsProps) => {
  useEffect(() => {
    if (currentStep === TERMS_STEP_INDEX && isVisible) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
        return '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
    return undefined;
  }, [currentStep, isVisible]);

  useEffect(() => {
    if (currentStep === CHATBOT_STEP_INDEX && isVisible) {
      window.dispatchEvent(new CustomEvent('close-chatbot'));
    }
  }, [currentStep, isVisible]);

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
};
