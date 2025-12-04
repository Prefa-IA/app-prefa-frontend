import { useEffect } from 'react';

import { TERMS_STEP_INDEX } from '../constants/tutorial';

interface UseTutorialEffectsProps {
  currentStep: number;
  isVisible: boolean;
}

const CHATBOT_STEP_INDEX = 2;
const MI_PERFIL_STEP_INDEX = 5;

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
    if (currentStep === MI_PERFIL_STEP_INDEX && isVisible) {
      const openUserMenu = () => {
        const menuButton = document.querySelector(
          '[data-tutorial="user-menu-button"]'
        ) as HTMLElement;
        if (menuButton) {
          const menuItems = document.querySelector('[data-tutorial="mi-perfil"]');
          if (!menuItems || !menuItems.closest('[role="menu"]')) {
            menuButton.click();
          }
        }
      };
      const timeouts = [100, 300, 500, 800, 1200];
      timeouts.forEach((delay) => {
        setTimeout(openUserMenu, delay);
      });
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
