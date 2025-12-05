import { useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

import { usePlanes } from './use-planes';

export const useParcelWatermark = () => {
  const { usuario } = useAuth();
  const { planes } = usePlanes();
  const { theme } = useTheme();

  useEffect(() => {
    if (!usuario || planes.length === 0) return;

    const plan = planes.find(
      (p) => p.id === usuario.suscripcion?.tipo || p.name === usuario.suscripcion?.nombrePlan
    );

    const usarOrg = plan?.watermarkOrg;

    const orgDataUri: string | null = usarOrg
      ? usuario.personalizacion?.logo ||
        (usuario.nombre
          ? (() => {
              const text = usuario.nombre.toUpperCase();
              const textColor = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
              const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="120" viewBox="0 0 1700 120"><text x="10" y="90" font-size="100" fill="${textColor}" font-family="Arial,Helvetica,sans-serif">${text}</text></svg>`;
              return `data:image/svg+xml;base64,${btoa(svg)}`;
            })()
          : null)
      : null;

    const prefaDataUri = `url(/logo.png)`;
    const bg = usarOrg && orgDataUri ? `url(${orgDataUri})` : prefaDataUri;
    // Aplicar filtro invert en modo oscuro solo para el logo de PREFA-IA
    const filter = theme === 'dark' && !usarOrg ? 'filter: invert(1);' : '';

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-watermark', 'parcel');
    styleEl.innerHTML = `#parcel-page-root::before { content:''; position:absolute; top:0; left:0; width:100vw; height:100%; pointer-events:none; opacity:0.1; transform:none; background-repeat:repeat; background-position:left top; background-size:500px 500px; background-image:${bg}; z-index:0; ${filter} }`;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, [usuario, planes, theme]);
};
