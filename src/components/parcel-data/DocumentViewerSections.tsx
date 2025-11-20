import React from 'react';

import useTablePersonalization from '../../hooks/use-table-personalization';
import { LbiLfiSectionProps } from '../../types/components';
import {
  DocumentosVisuales,
  Informe,
  InformeCompuesto,
  PARCEL_DATA_CONFIG,
} from '../../types/enums';
import { getPdfViewerUrl, isPDF } from '../../utils/parcel-calculations';
import LbiLfiViewerMapLibre from '../lbi-lfi-viewer/LbiLfiViewerMapLibre';

import DataTable from './DataTable';

interface DocumentViewerSectionsProps {
  informeAMostrar: Informe;
  informeCompuesto: InformeCompuesto | undefined;
  esInformeCompuesto: boolean;
  documentosVisuales: DocumentosVisuales;
  pageCounter: number;
  pageNumbers?: {
    croquis?: number;
    perimetro?: number;
    planoIndice?: number;
    lbiLfi?: number;
  };
}

export const SingleInformeSections: React.FC<DocumentViewerSectionsProps> = ({
  informeAMostrar,
  pageNumbers,
  pageCounter,
}) => {
  return (
    <>
      {informeAMostrar.edificabilidad?.link_imagen?.croquis_parcela && (
        <CroquisSection
          croquis={informeAMostrar.edificabilidad.link_imagen.croquis_parcela}
          pageCounter={pageNumbers?.croquis || pageCounter}
        />
      )}

      {informeAMostrar.edificabilidad?.link_imagen?.perimetro_manzana && (
        <PerimetroSection
          perimetro={informeAMostrar.edificabilidad.link_imagen.perimetro_manzana}
          informe={informeAMostrar}
          pageCounter={pageNumbers?.perimetro || pageCounter + 1}
          lbiLfiPageCounter={pageNumbers?.lbiLfi || pageCounter + 2}
        />
      )}

      {informeAMostrar.edificabilidad?.link_imagen?.plano_indice && (
        <PlanoIndiceSection
          planoIndice={informeAMostrar.edificabilidad.link_imagen.plano_indice}
          pageCounter={pageNumbers?.planoIndice || pageCounter + 2}
        />
      )}
    </>
  );
};

export const CompoundInformeSections: React.FC<DocumentViewerSectionsProps> = ({
  informeCompuesto,
  esInformeCompuesto,
  documentosVisuales,
  pageCounter,
}) => {
  return (
    <>
      <CompoundCroquisSection croquis={documentosVisuales.croquis} pageCounter={pageCounter} />

      <CompoundPerimetrosSection
        perimetros={documentosVisuales.perimetros}
        pageCounter={pageCounter + 1}
      />

      <CompoundPlanosIndiceSection
        planosIndice={documentosVisuales.planosIndice}
        pageCounter={pageCounter + 2}
      />

      {informeCompuesto?.informeConsolidado?.googleMaps &&
        informeCompuesto?.informeConsolidado?.datosCatastrales?.smp && (
          <LbiLfiSection
            informe={informeCompuesto.informeConsolidado}
            informesIndividuales={informeCompuesto.informesIndividuales}
            esCompuesto={esInformeCompuesto}
            pageCounter={pageCounter + 3}
          />
        )}
    </>
  );
};

const CroquisSection: React.FC<{ croquis: string; pageCounter: number }> = ({
  croquis,
  pageCounter,
}) => {
  const { parentTableStyle } = useTablePersonalization();

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        CROQUIS DE LA PARCELA
      </div>
      <DocumentItem
        url={croquis}
        title="Croquis de la parcela"
        defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.CROQUIS}
      />
      <div className="mt-4 border rounded w-fit px-3 py-1 text-dark dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 ml-auto">
        {pageCounter}
      </div>
    </div>
  );
};

const PerimetroSection: React.FC<{
  perimetro: string;
  informe: Informe;
  pageCounter: number;
  lbiLfiPageCounter: number;
}> = ({ perimetro, informe, pageCounter, lbiLfiPageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();

  return (
    <>
      <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
        <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
          PERÍMETRO DE LA MANZANA
        </div>
        <DocumentItem
          url={perimetro}
          title="Perímetro de la manzana"
          defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PERIMETRO}
        />
        <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">
          {pageCounter}
        </div>
      </div>

      {informe.googleMaps && informe.datosCatastrales?.smp && (
        <LbiLfiSection informe={informe} esCompuesto={false} pageCounter={lbiLfiPageCounter ?? 0} />
      )}
    </>
  );
};

const PlanoIndiceSection: React.FC<{ planoIndice: string; pageCounter: number }> = ({
  planoIndice,
  pageCounter,
}) => {
  const { parentTableStyle } = useTablePersonalization();

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        PLANO ÍNDICE
      </div>
      <DocumentItem
        url={planoIndice}
        title="Plano índice"
        defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PLANO_INDICE}
      />
      <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">
        {pageCounter}
      </div>
    </div>
  );
};

const CompoundCroquisSection: React.FC<{ croquis: string[]; pageCounter: number }> = ({
  croquis,
  pageCounter,
}) => {
  const { parentTableStyle } = useTablePersonalization();

  if (croquis.length === 0) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        CROQUIS DE LAS PARCELAS
      </div>

      {croquis.map((url, index) => (
        <DataTable key={index} title={`CROQUIS DE PARCELA ${index + 1}`} className="mb-6">
          <div className="p-4 text-center">
            <DocumentItem
              url={url}
              title={`Croquis de parcela ${index + 1}`}
              defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.CROQUIS}
            />
          </div>
        </DataTable>
      ))}
      <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">
        {pageCounter}
      </div>
    </div>
  );
};

const CompoundPerimetrosSection: React.FC<{ perimetros: string[]; pageCounter: number }> = ({
  perimetros,
  pageCounter,
}) => {
  const { parentTableStyle } = useTablePersonalization();

  if (perimetros.length === 0) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        PERÍMETROS DE LAS MANZANAS
      </div>

      {perimetros.map((url, index) => (
        <DataTable key={index} title={`PERÍMETRO DE MANZANA ${index + 1}`} className="mb-6">
          <div className="p-4 text-center">
            <DocumentItem
              url={url}
              title={`Perímetro de manzana ${index + 1}`}
              defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PERIMETRO}
            />
          </div>
        </DataTable>
      ))}
      <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">
        {pageCounter}
      </div>
    </div>
  );
};

const CompoundPlanosIndiceSection: React.FC<{ planosIndice: string[]; pageCounter: number }> = ({
  planosIndice,
  pageCounter,
}) => {
  const { parentTableStyle } = useTablePersonalization();

  if (planosIndice.length === 0) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        PLANOS ÍNDICE
      </div>

      {planosIndice.map((url, index) => (
        <DataTable key={index} title={`PLANO ÍNDICE ${index + 1}`} className="mb-6">
          <div className="p-4 text-center">
            <DocumentItem
              url={url}
              title={`Plano índice ${index + 1}`}
              defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PLANO_INDICE}
            />
          </div>
        </DataTable>
      ))}
      <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">
        {pageCounter}
      </div>
    </div>
  );
};

const DocumentItem: React.FC<{
  url: string;
  title: string;
  defaultImageUrl: string;
}> = ({ url, title, defaultImageUrl }) => (
  <div className="border border-gray-300 dark:border-gray-700 p-4 text-center">
    {!isPDF(url) ? (
      <ImageViewer url={url} title={title} defaultImageUrl={defaultImageUrl} />
    ) : (
      <PdfViewer url={url} title={title} />
    )}
  </div>
);

const ImageViewer: React.FC<{ url: string; title: string; defaultImageUrl: string }> = ({
  url,
  title,
  defaultImageUrl,
}) => (
  <img
    src={url}
    alt={title}
    className="max-w-full object-contain mx-auto"
    onError={(e) => {
      e.currentTarget.onerror = null;
      e.currentTarget.src = defaultImageUrl;
    }}
  />
);

const PdfViewer: React.FC<{ url: string; title: string; className?: string }> = ({
  url,
  title,
  className = 'min-h-[80vh] w-full',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const objectEl = container.querySelector('object');
    if (!objectEl) return;

    const handleError = () => {
      const iframe = document.createElement('iframe');
      iframe.src = getPdfViewerUrl(url);
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.className = `${className} border-0`;
      container.innerHTML = '';
      container.appendChild(iframe);
    };

    objectEl.addEventListener('error', handleError);
    return () => {
      objectEl.removeEventListener('error', handleError);
    };
  }, [url, className]);

  return (
    <div className="w-full" ref={containerRef}>
      <object
        data={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        type="application/pdf"
        width="100%"
        className={className}
      >
        <iframe
          src={getPdfViewerUrl(url)}
          width="100%"
          className={`${className} border-0`}
          allowFullScreen
          title={`${title} (PDF)`}
        >
          <p>Tu navegador no soporta la visualización de PDFs.</p>
        </iframe>
      </object>
    </div>
  );
};

interface EstadisticaItem {
  smp: string;
  estadisticas?: {
    esquinas_con_troneras?: number;
    total_esquinas?: number;
    porcentaje_afectacion_lfi?: number;
    porcentaje_afectacion_lib?: number;
  };
}

const fetchStatsForInformes = async (
  informesIndividuales: Array<{ datosCatastrales: { smp: string } }>
): Promise<EstadisticaItem[]> => {
  const base = (process.env['REACT_APP_API_URL'] || 'http://localhost:4000').replace(/\/$/, '');
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const promises = informesIndividuales.map(async (inf) => {
    const resp = await fetch(
      `${base}/mapdata/smp/${encodeURIComponent(inf.datosCatastrales.smp)}`,
      {
        ...(headers && { headers }),
      }
    );
    if (!resp.ok) throw new Error('fetch error');
    const data = await resp.json();
    return {
      smp: inf.datosCatastrales.smp,
      estadisticas: data.estadisticas,
    };
  });

  return Promise.all(promises);
};

const StatsOverlay: React.FC<{ statsList: EstadisticaItem[] }> = ({ statsList }) => {
  if (statsList.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded shadow-lg p-3 text-sm z-10 max-w-xs border border-gray-300 dark:border-gray-700">
      <h4 className="font-semibold mb-2 dark:text-gray-200">Análisis de Afectación</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto dark:text-gray-300">
        {statsList.map((item, idx) => (
          <div
            key={idx}
            className="border-b border-gray-300 dark:border-gray-700 pb-2 last:border-b-0"
          >
            <div className="font-medium mb-1 dark:text-gray-200">SMP {item.smp}</div>
            <div>
              Esquinas con troneras: {item.estadisticas?.esquinas_con_troneras ?? 0} /{' '}
              {item.estadisticas?.total_esquinas ?? 0}
            </div>
            <div>Afectación LFI: {item.estadisticas?.porcentaje_afectacion_lfi ?? 0}%</div>
            <div>Afectación LIB: {item.estadisticas?.porcentaje_afectacion_lib ?? 0}%</div>
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
};

const LbiLfiSection: React.FC<LbiLfiSectionProps> = ({
  informe,
  informesIndividuales = [],
  esCompuesto = false,
  pageCounter,
}) => {
  const { parentTableStyle } = useTablePersonalization();

  const lbiLfiData = {
    smp: informe.datosCatastrales.smp,
    coordenadas: {
      lat: parseFloat(informe.googleMaps.lat),
      lon: parseFloat(informe.googleMaps.lon),
    },
    geometria: informe.geometria,
  };

  const [statsList, setStatsList] = React.useState<EstadisticaItem[]>([]);

  React.useEffect(() => {
    if (!esCompuesto || informesIndividuales.length === 0) return;
    void fetchStatsForInformes(informesIndividuales)
      .then(setStatsList)
      .catch((e) => {
        console.error('Error obteniendo estadísticas:', e);
      });
  }, [esCompuesto, informesIndividuales]);

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        VISUALIZACIÓN DE LFI Y LIB
      </div>
      <div className="relative">
        <LbiLfiViewerMapLibre
          smp={lbiLfiData.smp}
          centro={lbiLfiData.coordenadas}
          geometriaParcela={lbiLfiData.geometria}
          showStatsOverlay={!esCompuesto}
        />
        {esCompuesto && <StatsOverlay statsList={statsList} />}
      </div>
      {pageCounter && (
        <div className="mt-4 border rounded w-fit px-3 py-1 text-dark dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 ml-auto">
          {pageCounter}
        </div>
      )}
    </div>
  );
};
