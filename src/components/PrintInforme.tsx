import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { prefactibilidad } from '../services/api';
import ReportPreview from './reportes/ReportPreview';
import { Informe } from '../types/enums';
import { useAuth } from '../contexts/AuthContext';
import { usePlanes } from '../hooks/usePlanes';

const PREFAC_LOGO = '/prefac_logo.png';

const PrintInforme: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [informe, setInforme] = useState<Informe | null>(null);

  const { usuario } = useAuth();
  const { planes } = usePlanes();

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
    fetchData();
  }, [id]);

  // Inyectar watermark cuando tengamos usuario y planes (con self-healing)
  useEffect(() => {
    if (!usuario || planes.length === 0) return;

    const plan = planes.find(p => p.id === usuario.suscripcion?.tipo || (p as any)._id === usuario.suscripcion?.plan || p.name === usuario.suscripcion?.nombrePlan);
    const usarOrg = plan?.watermarkOrg;
    const usarPrefa = plan?.watermarkPrefas;

    let orgDataUri: string | null = null;
    if (usarOrg) {
      if (usuario.personalizacion?.logo) {
        orgDataUri = usuario.personalizacion.logo;
      } else if (usuario.nombre) {
        const text = usuario.nombre.toUpperCase();
        const svg = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"120\" viewBox=\"0 0 400 120\"><text x=\"0\" y=\"90\" font-size=\"90\" fill=\"rgba(0,0,0,0.15)\" font-family=\"Arial,Helvetica,sans-serif\">${text}</text></svg>`;
        orgDataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
      }
    }

    const prefaUrl = `url(/logo.png)`; // usa logo.png actual
    const orgUrl = orgDataUri ? `url(${orgDataUri})` : null;

    const ensureWatermark = () => {
      let styleEl = document.querySelector('style[data-watermark="true"]') as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.setAttribute('data-watermark','true');
        document.head.appendChild(styleEl);
      }
      // No cambiar estilos ni apariencia; solo aseguramos que exista
      if (usarOrg && usarPrefa && orgUrl) {
        styleEl.innerHTML = `@media screen,print {
          body::before {
            content:''; position:fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; opacity:0.05; transform:rotate(-30deg); background-size:500px 400px; background-repeat:repeat; z-index:0; background-image:${prefaUrl};
          }
          body.alt-org::before { background-image:${orgUrl}; }
          /* Orientación alternativa vertical opcional */
          body.wm-vertical::before {
            transform:none; background-repeat:repeat-y; background-position:center top; background-size:300px auto;
          }
        }`;
        document.body.classList.add('wm-present');
      }
    };

    // Orientación vertical opcional via query (?wm=vertical)
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('wm') === 'vertical') document.body.classList.add('wm-vertical');
      else document.body.classList.remove('wm-vertical');
    } catch {}

    ensureWatermark();

    // Observer para reinyectar si lo remueven o alteran
    const obs = new MutationObserver(() => {
      const exists = document.querySelector('style[data-watermark="true"]');
      if (!exists) ensureWatermark();
    });
    obs.observe(document.head, { childList: true });

    return () => {
      obs.disconnect();
    };
  }, [usuario, planes]);

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
        onAcceptReport={async () => false}
        tipoPrefa={'prefa2'}
      />
    </div>
  );
};

export default PrintInforme; 