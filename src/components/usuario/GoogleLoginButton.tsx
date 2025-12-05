import React, { useRef } from 'react';

import { useGoogleButtonInitialization } from '../../hooks/use-google-button-initialization';
import { useGoogleLoginHandler } from '../../hooks/use-google-login-handler';
import { GoogleLoginButtonProps } from '../../types/components';

import GoogleLoginCustomButton from './GoogleLoginCustomButton';

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  className = '',
  onSuccessNavigate = '/consultar',
  variant = 'customRed',
  onBeforeClick,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const clientId = process.env['REACT_APP_GOOGLE_CLIENT_ID'];

  const { handleCredentialResponse } = useGoogleLoginHandler({ onSuccessNavigate });
  const { initializedRef } = useGoogleButtonInitialization({
    clientId,
    variant,
    handleCredentialResponse,
    divRef,
    buttonRef,
  });

  if (variant === 'googleDefault') {
    return <div className={className} ref={divRef} />;
  }

  const customButtonProps: React.ComponentProps<typeof GoogleLoginCustomButton> = {
    className,
    buttonRef,
    clientId,
    initializedRef,
    onButtonClick: () => {},
  };

  if (onBeforeClick) {
    customButtonProps.onBeforeClick = onBeforeClick;
  }

  return <GoogleLoginCustomButton {...customButtonProps} />;
};

export default GoogleLoginButton;
