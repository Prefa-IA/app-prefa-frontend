declare global {
  interface Window {
    grecaptcha: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback': () => void;
        }
      ) => number;
      reset: (widgetId: number) => void;
      getResponse: (widgetId: number) => string;
    };
  }
}

export interface RecaptchaProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  siteKey: string;
  widgetIdRef?: React.MutableRefObject<number | null>;
}

export interface UseRecaptchaReturn {
  reset: () => void;
  widgetIdRef: React.MutableRefObject<number | null>;
}
