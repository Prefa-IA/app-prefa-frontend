import { useRef } from 'react';
import { UseRecaptchaReturn } from '../types/recaptcha';

export const useRecaptcha = (): UseRecaptchaReturn => {
  const widgetIdRef = useRef<number | null>(null);
  
  const reset = () => {
    if (widgetIdRef.current !== null && typeof window !== 'undefined' && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
      } catch (error) {
        console.error('Error reseteando reCAPTCHA:', error);
      }
    }
  };
  
  return { reset, widgetIdRef };
};

