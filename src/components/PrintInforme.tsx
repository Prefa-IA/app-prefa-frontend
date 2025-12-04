import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePlanes } from '../hooks/use-planes';
import { prefactibilidad } from '../services/api';
import { TIPO_PREFA } from '../types/consulta-direccion';
import { Informe, PrefaType } from '../types/enums';

import ReportPreview from './reportes/ReportPreview';

const WATERMARK_STYLE_SELECTOR = 'style[data-watermark="true"]';
const MEDIA_SCREEN_PRINT = '@media screen,print {';
const WATERMARK_CLASSES = 'wm-present wm-vertical';

const getOrgDataUri = (
  usuario: { personalizacion?: { logo?: string }; nombre?: string },
  theme: string
): string | null => {
  if (usuario.personalizacion?.logo) {
    return usuario.personalizacion.logo;
  }
  if (usuario.nombre) {
    const text = usuario.nombre.toUpperCase();
    const textColor = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="120" viewBox="0 0 500 120"><text x="10" y="90" font-size="90" fill="${textColor}" font-family="Arial,Helvetica,sans-serif">${text}</text></svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }
  return null;
};

const ensureWatermarkStyle = (
  usarOrg: boolean,
  usarPrefa: boolean,
  orgUrl: string | null,
  theme: string
): void => {
  const prefaUrl = `url(/logo.png)`;
  const styleElState = {
    current: document.querySelector(WATERMARK_STYLE_SELECTOR),
  };
  if (!styleElState.current) {
    const newStyleEl = document.createElement('style');
    newStyleEl.setAttribute('data-watermark', 'true');
    document.head.appendChild(newStyleEl);
    styleElState.current = newStyleEl;
  }
  const styleEl = styleElState.current;
  // Aplicar filtro invert en modo oscuro solo para el logo de PREFA-IA
  const filter = theme === 'dark' && !usarOrg && usarPrefa ? 'filter: invert(1);' : '';
  if (usarOrg && orgUrl) {
    styleEl.innerHTML = `${MEDIA_SCREEN_PRINT}
      body::before {
        content:''; position:fixed; top:0; left:0; width:100%; height:500vh; min-height:500vh; pointer-events:none; opacity:0.1; transform:none; background-repeat:repeat; background-position:left top; background-size:400px 144px; z-index:0; background-image:${orgUrl};
      }
    }`;
    document.body.classList.add(...WATERMARK_CLASSES.split(' '));
  } else if (usarPrefa) {
    styleEl.innerHTML = `${MEDIA_SCREEN_PRINT}
      body::before {
        content:''; position:fixed; top:0; left:0; width:100%; height:500vh; min-height:500vh; pointer-events:none; opacity:0.1; transform:none; background-repeat:repeat; background-position:left top; background-size:400px 144px; z-index:0; background-image:${prefaUrl}; ${filter}
      }
    }`;
    document.body.classList.add(...WATERMARK_CLASSES.split(' '));
  }
};

const applyDiagonalWatermark = (): void => {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('wm') === 'diagonal') {
      document.body.classList.remove('wm-vertical');
      const styleEl = document.querySelector(WATERMARK_STYLE_SELECTOR);
      if (styleEl) {
        const currentStyle = styleEl.innerHTML;
        styleEl.innerHTML = currentStyle
          .replace(/transform:none;/g, 'transform:rotate(-30deg);')
          .replace(/background-repeat:repeat-y;/g, 'background-repeat:repeat;')
          .replace(/background-size:300px auto;/g, 'background-size:400px 500px;');
      }
    }
  } catch {
    // Ignorar errores al aplicar watermark diagonal
  }
};

const PrintInforme: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [informe, setInforme] = useState<Informe | null>(null);

  const { usuario } = useAuth();
  const { planes } = usePlanes();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await prefactibilidad.obtenerInforme(id);
        setInforme(data);
      } catch (err) {
        console.error('Error cargando informe', err);
      }
    };
    void fetchData();
  }, [id]);

  useEffect(() => {
    if (!usuario || planes.length === 0) return;

    const plan = planes.find(
      (p) => p.id === usuario.suscripcion?.tipo || p.name === usuario.suscripcion?.nombrePlan
    );
    const usarOrg = plan?.watermarkOrg || false;
    const usarPrefa = plan?.watermarkPrefas || false;

    const orgDataUri = usarOrg ? getOrgDataUri(usuario, theme) : null;
    const orgUrl = orgDataUri ? `url(${orgDataUri})` : null;

    ensureWatermarkStyle(usarOrg, usarPrefa, orgUrl, theme);
    applyDiagonalWatermark();

    const obs = new MutationObserver(() => {
      const exists = document.querySelector(WATERMARK_STYLE_SELECTOR);
      if (!exists) ensureWatermarkStyle(usarOrg, usarPrefa, orgUrl, theme);
    });
    obs.observe(document.head, { childList: true });

    return () => {
      obs.disconnect();
    };
  }, [usuario, planes, theme]);

  if (!informe) return null;

  return (
    <div className="print-page">
      <ReportPreview
        informe={informe}
        isCompoundMode={false}
        addresses={[]}
        isLoading={false}
        center={{ lat: Number(informe.googleMaps.lat), lng: Number(informe.googleMaps.lon) }}
        onGenerateReport={() => {}}
        savedId={informe._id || null}
        tipoPrefa={TIPO_PREFA.COMPLETA as PrefaType}
      />
    </div>
  );
};

export default PrintInforme;
