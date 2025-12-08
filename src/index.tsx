import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

const isNetworkError = (message: string): boolean => {
  return (
    message.includes('Timeout') ||
    message.includes('timeout') ||
    message.includes('Cross-Origin-Opener-Policy') ||
    message.includes('ERR_BAD_REQUEST') ||
    message.includes('403')
  );
};

const isGoogleServiceError = (source: string): boolean => {
  return (
    source.includes('recaptcha') ||
    source.includes('gsi') ||
    source.includes('accounts.google.com') ||
    source.includes('google.com') ||
    source.includes('bframe')
  );
};

const isWebpackOverlayError = (message: string, source: string): boolean => {
  return (
    source.includes('overlay.js') ||
    source.includes('webpack') ||
    message.includes('removeChild') ||
    message.includes('not a child of this node')
  );
};

const shouldIgnoreError = (errorMessage: string, errorSource: string): boolean => {
  return (
    isNetworkError(errorMessage) ||
    isGoogleServiceError(errorSource) ||
    isWebpackOverlayError(errorMessage, errorSource)
  );
};

const isAbortError = (reasonString: string, errorName: string): boolean => {
  return (
    reasonString.includes('AbortError') ||
    reasonString.includes('signal is aborted') ||
    reasonString.includes('aborted without reason') ||
    errorName === 'AbortError' ||
    errorName === 'AbortController'
  );
};

const isWebpackOverlayRejection = (reasonString: string, errorName: string): boolean => {
  return (
    reasonString.includes('removeChild') ||
    reasonString.includes('not a child of this node') ||
    reasonString.includes('overlay.js') ||
    reasonString.includes('fsm.js') ||
    errorName === 'NotFoundError'
  );
};

const shouldIgnoreRejection = (reason: unknown, errorName: string): boolean => {
  const reasonString = String(reason);
  return (
    isNetworkError(reasonString) ||
    isGoogleServiceError(reasonString) ||
    isAbortError(reasonString, errorName) ||
    isWebpackOverlayRejection(reasonString, errorName)
  );
};

window.addEventListener('error', (event) => {
  const errorMessage = event.message || '';
  const errorSource = event.filename || '';

  if (shouldIgnoreError(errorMessage, errorSource)) {
    event.preventDefault();
    return false;
  }
  return undefined;
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.message || event.reason || '';
  const errorName = event.reason?.name || '';

  if (shouldIgnoreRejection(reason, errorName)) {
    event.preventDefault();
    return false;
  }
  return undefined;
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
