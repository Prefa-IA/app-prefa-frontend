import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

export const useCaptcha = () => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaValidated, setCaptchaValidated] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const recaptchaWidgetIdRef = useRef<number | null>(null);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setCaptchaValidated(true);
  };

  const handleCaptchaError = () => {
    toast.error('Error al verificar el captcha. Por favor intenta nuevamente.');
    setCaptchaToken(null);
    setCaptchaValidated(false);
  };

  const resetCaptcha = () => {
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
      } catch (err) {
        console.error('Error reseteando reCAPTCHA:', err);
      }
    }
    recaptchaWidgetIdRef.current = null;
  };

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
