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

const getGatewayUrl = (): string => {
  const envApiUrl = process.env['REACT_APP_API_URL'];
  if (envApiUrl) {
    return envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl}/api`;
  }

  const currentHost = window.location.hostname;
  const isPrintMode = window.location.pathname.startsWith('/print/');
  if (isPrintMode) {
    if (currentHost === 'host.docker.internal' || currentHost.includes('docker.internal')) {
      return 'http://prefa-gateway:4000/api';
    }
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://localhost:4000/api';
    }
  }

  if (currentHost === 'host.docker.internal') {
    return 'http://prefa-gateway:4000/api';
  }
  if (currentHost.includes('docker.internal')) {
    return `http://${currentHost}:4000/api`;
  }
  return 'http://localhost:4000/api';
};

const normalizeSsplanUrl = (url: string): string => {
  if (url.includes('ssplan.buenosaires.gov.ar')) {
    return url.replace(
      /^https:\/\/(www\.)?ssplan\.buenosaires\.gov\.ar/,
      'http://www.ssplan.buenosaires.gov.ar'
    );
  }
  return url;
};

const normalizeLinkImagenUrls = (informe: Informe): void => {
  if (informe.edificabilidad?.link_imagen) {
    const linkImagen = informe.edificabilidad.link_imagen;
    if (linkImagen.croquis_parcela) {
      linkImagen.croquis_parcela = normalizeSsplanUrl(linkImagen.croquis_parcela);
    }
    if (linkImagen.plano_indice) {
      linkImagen.plano_indice = normalizeSsplanUrl(linkImagen.plano_indice);
    }
  }
};

const loadInformeInPrintMode = async (id: string, token: string): Promise<Informe> => {
  const gatewayUrl = getGatewayUrl();
  console.log(`[PrintInforme] Modo print - cargando desde ${gatewayUrl}`);

  const response = await fetch(`${gatewayUrl}/prefactibilidad/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Informe no encontrado (ID: ${id})`);
    }
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const informe = await response.json();
  normalizeLinkImagenUrls(informe);
  return informe;
};

const formatErrorMessage = (err: unknown, id: string): string => {
  if (!(err instanceof Error)) {
    return 'Error al cargar el informe';
  }

  const errorMessage = err.message;
  if (errorMessage.includes('404') || errorMessage.includes('not found')) {
    return `Informe no encontrado (ID: ${id}). Verifica que el informe exista y pertenezca a tu cuenta.`;
  }
  if (errorMessage.includes('Network Error') || errorMessage.includes('Failed to fetch')) {
    return 'Error de conexión. No se pudo conectar con el servidor. Verifica que la API esté disponible.';
  }
  if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
    return 'No autorizado. El token de autenticación puede haber expirado.';
  }
  return errorMessage;
};

const useInformeData = (id: string | undefined) => {
  const [informe, setInforme] = useState<Informe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('ID de informe no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticación no disponible');
        }

        const isPrintMode = window.location.pathname.startsWith('/print/');
        const data = isPrintMode
          ? await loadInformeInPrintMode(id, token)
          : await prefactibilidad.obtenerInforme(id);

        setInforme(data);
      } catch (err: unknown) {
        console.error('[PrintInforme] Error cargando informe', err);
        setError(formatErrorMessage(err, id));
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [id]);

  return { informe, loading, error };
};

const useWatermarkSetup = () => {
  const { usuario } = useAuth();
  const { planes } = usePlanes();
  const { theme } = useTheme();

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
};

const LoadingState: React.FC = () => (
  <div className="print-page" data-pdf-loading="true">
    <div style={{ padding: '20px', textAlign: 'center' }}>Cargando informe...</div>
  </div>
);

const ErrorState: React.FC<{ error: string | null }> = ({ error }) => (
  <div className="print-page" data-pdf-error="true">
    <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
      Error: {error || 'No se pudo cargar el informe'}
    </div>
  </div>
);

const PrintInforme: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { informe, loading, error } = useInformeData(id);
  useWatermarkSetup();

  if (loading) {
    return <LoadingState />;
  }

  if (error || !informe) {
    return <ErrorState error={error} />;
  }

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
