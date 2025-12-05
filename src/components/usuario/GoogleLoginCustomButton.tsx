import React from 'react';

interface GoogleLoginCustomButtonProps {
  className: string;
  buttonRef: React.RefObject<HTMLButtonElement>;
  clientId: string | undefined;
  initializedRef: React.RefObject<boolean>;
  onButtonClick: () => void;
  onBeforeClick?: () => void;
}

const GoogleLoginCustomButton: React.FC<GoogleLoginCustomButtonProps> = ({
  className,
  buttonRef,
  clientId,
  initializedRef,
  onButtonClick,
  onBeforeClick,
}) => {
  const handleButtonClick = () => {
    if (onBeforeClick) {
      onBeforeClick();
    }

    if (!clientId) {
      console.error('REACT_APP_GOOGLE_CLIENT_ID no está configurado');
      return;
    }

    if (!window.google?.accounts?.id || !initializedRef.current) {
      console.error('Google Identity Services no está cargado o inicializado');
      return;
    }

    const hiddenDiv = (buttonRef.current as HTMLElement & { __googleButton?: HTMLDivElement })
      ?.__googleButton;
    if (hiddenDiv) {
      const googleButton = hiddenDiv.querySelector('div[role="button"]');
      if (googleButton) {
        (googleButton as HTMLElement).click();
      }
    } else {
      console.error('No se encontró el botón de Google renderizado');
    }
    onButtonClick();
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleButtonClick}
      className={`inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ${className}`}
      style={{ backgroundColor: '#EA4335', color: '#FFFFFF' }}
      aria-label="Continuar con Google"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width="18"
        height="18"
        className="mr-2"
      >
        <path
          fill="#FFFFFF"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.9-6.9C36.89 2.3 30.92 0 24 0 14.62 0 6.51 5.38 2.56 13.19l8.02 6.22C12.56 13.25 17.83 9.5 24 9.5z"
        />
        <path
          fill="#FFFFFF"
          d="M46.5 24c0-1.63-.16-3.19-.46-4.69H24v9.06h12.7c-.55 2.96-2.24 5.47-4.77 7.16l7.31 5.68C43.77 37.18 46.5 31.08 46.5 24z"
        />
        <path
          fill="#FFFFFF"
          d="M10.58 29.41A14.49 14.49 0 019.5 24c0-1.89.34-3.7.96-5.37l-8.02-6.22C.88 15.49 0 19.64 0 24c0 4.36.88 8.51 2.44 12.59l8.14-7.18z"
        />
        <path
          fill="#FFFFFF"
          d="M24 48c6.48 0 11.93-2.13 15.91-5.82l-7.31-5.68c-2.04 1.37-4.66 2.18-8.6 2.18-6.17 0-11.44-3.75-13.42-9.02l-8.14 7.18C6.51 42.62 14.62 48 24 48z"
        />
      </svg>
      Continuar con Google
    </button>
  );
};

export default GoogleLoginCustomButton;
