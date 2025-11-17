import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

window.addEventListener('error', (event) => {
  const errorMessage = event.message || '';
  const errorSource = event.filename || '';

  if (
    errorMessage.includes('Timeout') ||
    errorMessage.includes('Cross-Origin-Opener-Policy') ||
    errorSource.includes('recaptcha') ||
    errorSource.includes('gsi') ||
    errorSource.includes('accounts.google.com')
  ) {
    event.preventDefault();
    return false;
  }
  return undefined;
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.message || event.reason || '';
  const reasonString = String(reason);

  if (
    reasonString.includes('Timeout') ||
    reasonString.includes('Cross-Origin-Opener-Policy') ||
    reasonString.includes('recaptcha') ||
    reasonString.includes('gsi') ||
    reasonString.includes('accounts.google.com') ||
    reasonString.includes('AbortError')
  ) {
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
