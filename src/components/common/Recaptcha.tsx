import React, { useEffect, useRef, useState } from 'react';

import { RecaptchaProps } from '../../types/recaptcha';

const isDevelopment = process.env['NODE_ENV'] === 'development';

const checkRecaptchaLoaded = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    window.grecaptcha !== undefined &&
    typeof window.grecaptcha.render === 'function'
  );
};

const handleCleanupError = (error: unknown): void => {
  if (isDevelopment) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes('removeChild') && !errorMessage.includes('not a child')) {
      console.warn('Error reseteando reCAPTCHA durante cleanup:', error);
    }
  }
};

const cleanupRecaptcha = (
  widgetIdRef: React.MutableRefObject<number | null>,
  containerRef: React.RefObject<HTMLDivElement>
): void => {
  if (widgetIdRef.current !== null && typeof window !== 'undefined' && window.grecaptcha) {
    try {
      const widgetId = widgetIdRef.current;
      if (containerRef.current && typeof window.grecaptcha.reset === 'function') {
        window.grecaptcha.reset(widgetId);
      }
    } catch (error) {
      handleCleanupError(error);
    }
  }
  widgetIdRef.current = null;
};

export const Recaptcha: React.FC<RecaptchaProps> = ({
  onVerify,
  onError,
  siteKey,
  widgetIdRef: externalWidgetIdRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalWidgetIdRef = useRef<number | null>(null);
  const widgetIdRef = externalWidgetIdRef || internalWidgetIdRef;
  const [isLoaded, setIsLoaded] = useState(false);

  const verifyCallbackRef = useRef(onVerify);
  const errorCallbackRef = useRef(onError);

  useEffect(() => {
    verifyCallbackRef.current = onVerify;
    errorCallbackRef.current = onError;
  }, [onVerify, onError]);

  useEffect(() => {
    const checkAndSetLoaded = (): boolean => {
      if (checkRecaptchaLoaded()) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (checkAndSetLoaded()) {
      return;
    }

    const interval = setInterval(() => {
      if (checkAndSetLoaded()) {
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (!checkAndSetLoaded()) {
        console.warn('reCAPTCHA no se cargó en el tiempo esperado');
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || widgetIdRef.current !== null) {
      return;
    }

    try {
      const widgetId = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          verifyCallbackRef.current(token);
        },
        'error-callback': () => {
          errorCallbackRef.current?.();
        },
      });
      widgetIdRef.current = widgetId;
    } catch (error) {
      console.error('Error renderizando reCAPTCHA:', error);
      errorCallbackRef.current?.();
    }

    return () => {
      cleanupRecaptcha(widgetIdRef, containerRef);
    };
  }, [isLoaded, siteKey, widgetIdRef]);

  return <div ref={containerRef} />;
};
