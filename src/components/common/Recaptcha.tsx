import React, { useEffect, useRef, useState } from 'react';

import { RecaptchaProps } from '../../types/recaptcha';

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

  useEffect(() => {
    const checkRecaptchaLoaded = () => {
      if (
        typeof window !== 'undefined' &&
        window.grecaptcha &&
        typeof window.grecaptcha.render === 'function'
      ) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    if (checkRecaptchaLoaded()) {
      return;
    }

    let interval: NodeJS.Timeout | null = null;
    let timeout: NodeJS.Timeout | null = null;

    interval = setInterval(() => {
      if (checkRecaptchaLoaded()) {
        if (interval) clearInterval(interval);
        if (timeout) clearTimeout(timeout);
      }
    }, 100);

    timeout = setTimeout(() => {
      if (interval) clearInterval(interval);
      if (!checkRecaptchaLoaded()) {
        console.warn('reCAPTCHA no se cargó en el tiempo esperado');
      }
    }, 10000);

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
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
          onVerify(token);
        },
        'error-callback': () => {
          onError?.();
        },
      });
      widgetIdRef.current = widgetId;
    } catch (error) {
      console.error('Error renderizando reCAPTCHA:', error);
      onError?.();
    }

    return () => {
      if (widgetIdRef.current !== null && typeof window !== 'undefined' && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (error) {
          console.error('Error reseteando reCAPTCHA:', error);
        }
      }
    };
  }, [isLoaded, siteKey, onVerify, onError, widgetIdRef]);

  return <div ref={containerRef} />;
};
