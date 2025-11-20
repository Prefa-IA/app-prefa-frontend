import React from 'react';

export const createLogoUploadMessage = (restantes: number, previewUrl: string): React.ReactNode => {
  return React.createElement(
    'div',
    { className: 'space-y-4 text-center' },
    React.createElement(
      'p',
      null,
      `Subirás un nuevo logo. Cambios mensuales disponibles: ${restantes}.`
    ),
    React.createElement('img', {
      src: previewUrl,
      alt: 'Preview logo',
      className: 'mx-auto max-h-32',
    }),
    React.createElement(
      'p',
      null,
      'Este logo se usará como marca de agua en tus informes si tu plan incluye marca de agua organizacional.'
    )
  );
};
