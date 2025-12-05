import { useEffect, useRef } from 'react';

interface GoogleCredentialResponse {
  credential: string;
}

interface UseGoogleButtonInitializationProps {
  clientId: string | undefined;
  variant: string;
  handleCredentialResponse: (response: GoogleCredentialResponse) => Promise<void>;
  divRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const useGoogleButtonInitialization = ({
  clientId,
  variant,
  handleCredentialResponse,
  divRef,
  buttonRef,
}: UseGoogleButtonInitializationProps) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!clientId) {
      console.error('REACT_APP_GOOGLE_CLIENT_ID no está configurado');
      return;
    }

    if (!window.google?.accounts?.id) {
      console.error('Google Identity Services no está cargado');
      return;
    }

    if (initializedRef.current) return;
    initializedRef.current = true;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: GoogleCredentialResponse) => {
        void handleCredentialResponse(response);
      },
      ux_mode: 'popup',
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    if (variant === 'googleDefault' && divRef.current) {
      window.google.accounts.id.renderButton(divRef.current, {
        theme: 'outline',
        size: 'large',
        locale: 'es',
        text: 'continue_with',
      });
    }

    const hiddenDiv: HTMLDivElement | null =
      variant === 'customRed' && buttonRef.current
        ? (() => {
            const div = document.createElement('div');
            div.style.display = 'none';
            buttonRef.current?.parentElement?.appendChild(div);

            window.google.accounts.id.renderButton(div, {
              theme: 'outline',
              size: 'large',
            });
            return div;
          })()
        : null;

    const currentButton = buttonRef.current;
    if (currentButton && hiddenDiv) {
      (currentButton as HTMLElement & { __googleButton?: HTMLDivElement }).__googleButton =
        hiddenDiv;
    }

    return () => {
      if (variant === 'customRed' && hiddenDiv && hiddenDiv.parentElement) {
        hiddenDiv.parentElement.removeChild(hiddenDiv);
      }
    };
  }, [variant, handleCredentialResponse, clientId, divRef, buttonRef]);

  return { initializedRef };
};
