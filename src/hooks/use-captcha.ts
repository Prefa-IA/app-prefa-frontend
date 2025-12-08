import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export const useCaptcha = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaValidated, setCaptchaValidated] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const recaptchaWidgetIdRef = useRef<number | null>(null);

  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
    setCaptchaValidated(true);
  }, []);

  const handleCaptchaError = useCallback(() => {
    toast.error('Error al verificar el captcha. Por favor intenta nuevamente.');
    setCaptchaToken(null);
    setCaptchaValidated(false);
  }, []);

  const resetCaptcha = useCallback(() => {
    setCaptchaToken(null);
    setCaptchaValidated(false);
    setResetKey((prev) => prev + 1);
    if (
      recaptchaWidgetIdRef.current !== null &&
      typeof window !== 'undefined' &&
      window.grecaptcha
    ) {
      try {
        window.grecaptcha.reset(recaptchaWidgetIdRef.current);
        // Limpiar cualquier token almacenado en localStorage relacionado con reCAPTCHA
        // Esto previene llamadas recursivas o problemas de estado
        if (typeof localStorage !== 'undefined') {
          // Limpiar cualquier clave relacionada con reCAPTCHA que pueda estar causando problemas
          const keysToRemove: string[] = [];
          // Usar Array.from para evitar el uso de let en el loop
          Array.from({ length: localStorage.length }, (_, i) => {
            const key = localStorage.key(i);
            if (key && (key.includes('recaptcha') || key.includes('grecaptcha'))) {
              keysToRemove.push(key);
            }
          });
          keysToRemove.forEach((key) => localStorage.removeItem(key));
        }
      } catch (err) {
        console.error('Error reseteando reCAPTCHA:', err);
      }
    }
    recaptchaWidgetIdRef.current = null;
  }, []);

  return {
    captchaToken,
    captchaValidated,
    recaptchaWidgetIdRef,
    resetKey,
    handleCaptchaVerify,
    handleCaptchaError,
    resetCaptcha,
    setCaptchaToken,
    setCaptchaValidated,
  };
};
