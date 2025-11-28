import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

const shouldIgnoreError = (errorMessage: string, errorSource: string): boolean => {
  return (
    errorMessage.includes('Timeout') ||
    errorMessage.includes('Cross-Origin-Opener-Policy') ||
    errorSource.includes('recaptcha') ||
    errorSource.includes('gsi') ||
    errorSource.includes('accounts.google.com')
  );
};

const shouldIgnoreRejection = (reason: unknown, errorName: string): boolean => {
  const reasonString = String(reason);
  return (
    reasonString.includes('Timeout') ||
    reasonString.includes('Cross-Origin-Opener-Policy') ||
    reasonString.includes('recaptcha') ||
    reasonString.includes('gsi') ||
    reasonString.includes('accounts.google.com') ||
    reasonString.includes('AbortError') ||
    reasonString.includes('signal is aborted') ||
    reasonString.includes('aborted without reason') ||
    errorName === 'AbortError' ||
    errorName === 'AbortController'
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
