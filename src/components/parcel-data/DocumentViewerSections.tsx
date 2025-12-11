import React from 'react';

import useTablePersonalization from '../../hooks/use-table-personalization';
// Sección LFI Y LIB oculta temporalmente
// import { LbiLfiSectionProps } from '../../types/components';
import {
  DocumentosVisuales,
  Informe,
  InformeCompuesto,
  PARCEL_DATA_CONFIG,
} from '../../types/enums';
import { getPdfViewerUrl, isPDF } from '../../utils/parcel-calculations';

// Sección LFI Y LIB oculta temporalmente
// import LbiLfiViewerMapLibre from '../lbi-lfi-viewer/LbiLfiViewerMapLibre';
import DataTable from './DataTable';
import PageNumber from './PageNumber';

interface DocumentViewerSectionsProps {
  informeAMostrar: Informe;
  informeCompuesto: InformeCompuesto | undefined;
  esInformeCompuesto: boolean;
  documentosVisuales: DocumentosVisuales;
  pageCounter: number;
  tipoPrefa?: string;
  pageNumbers?: {
    croquis?: number;
    perimetro?: number;
    planoIndice?: number;
    lbiLfi?: number;
  };
}

const calculatePageNumbers = (
  pageCounter: number,
  pageNumbers:
    | { croquis?: number; perimetro?: number; lbiLfi?: number; planoIndice?: number }
    | undefined,
  hasCroquis: boolean,
  hasPerimetro: boolean,
  hasLbiLfi: boolean
) => {
  const getPage = (
    key: 'croquis' | 'perimetro' | 'lbiLfi' | 'planoIndice',
    current: number
  ): number => {
    return (pageNumbers && Reflect.get(pageNumbers, key)) ?? current;
  };

  const croquisPage = getPage('croquis', pageCounter);
  const perimetroPage = getPage(
    'perimetro',
    hasCroquis && !pageNumbers?.croquis ? croquisPage + 1 : croquisPage
  );
  const lbiLfiPage = getPage(
    'lbiLfi',
    hasPerimetro && !pageNumbers?.perimetro ? perimetroPage + 1 : perimetroPage
  );
  const planoIndicePage = getPage(
    'planoIndice',
    hasLbiLfi && !pageNumbers?.lbiLfi ? lbiLfiPage + 1 : lbiLfiPage
  );

  return { croquisPage, perimetroPage, lbiLfiPage, planoIndicePage };
};

const shouldShowSection = (hasData: boolean): boolean => {
  return hasData;
};

export const SingleInformeSections: React.FC<DocumentViewerSectionsProps> = ({
  informeAMostrar,
  pageNumbers,
  pageCounter,
  tipoPrefa: _tipoPrefa,
}) => {
  const linkImagen = informeAMostrar.edificabilidad?.link_imagen;
  const hasCroquis = !!linkImagen?.croquis_parcela;
  const hasPerimetro = !!linkImagen?.perimetro_manzana;
  // Sección LFI Y LIB oculta temporalmente
  // const hasLbiLfi = !!(informeAMostrar.googleMaps && informeAMostrar.datosCatastrales?.smp);
  const hasPlanoIndice = !!linkImagen?.plano_indice;

  const showCroquis = shouldShowSection(hasCroquis);
  const showPerimetro = shouldShowSection(hasPerimetro);
  // Sección LFI Y LIB oculta temporalmente
  const showLbiLfi = false;
  const showPlanoIndice = shouldShowSection(hasPlanoIndice);

  const {
    croquisPage,
    perimetroPage,
    lbiLfiPage: _lbiLfiPage,
    planoIndicePage,
  } = calculatePageNumbers(pageCounter, pageNumbers, showCroquis, showPerimetro, showLbiLfi);

  return (
    <>
      {showCroquis && (
        <CroquisSection
          {...(linkImagen?.croquis_parcela ? { croquis: linkImagen.croquis_parcela } : {})}
          pageCounter={croquisPage}
        />
      )}

      {showPerimetro && (
        <PerimetroSection
          {...(linkImagen?.perimetro_manzana ? { perimetro: linkImagen.perimetro_manzana } : {})}
          pageCounter={perimetroPage}
        />
      )}

      {/* Sección LFI Y LIB oculta temporalmente
      {showLbiLfi && (
        <LbiLfiSection informe={informeAMostrar} esCompuesto={false} pageCounter={lbiLfiPage} />
      )}
      */}

      {showPlanoIndice && (
        <PlanoIndiceSection
          {...(linkImagen?.plano_indice ? { planoIndice: linkImagen.plano_indice } : {})}
          pageCounter={planoIndicePage}
        />
      )}
    </>
  );
};

export const CompoundInformeSections: React.FC<DocumentViewerSectionsProps> = ({
  informeCompuesto: _informeCompuesto,
  esInformeCompuesto: _esInformeCompuesto,
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

      {/* Sección LFI Y LIB oculta temporalmente
      {informeCompuesto?.informeConsolidado?.googleMaps &&
        informeCompuesto?.informeConsolidado?.datosCatastrales?.smp && (
          <LbiLfiSection
            informe={informeCompuesto.informeConsolidado}
            informesIndividuales={informeCompuesto.informesIndividuales}
            esCompuesto={esInformeCompuesto}
            pageCounter={pageCounter + 3}
          />
        )}
      */}
    </>
  );
};

const CroquisSection: React.FC<{
  croquis?: string;
  pageCounter: number;
}> = ({ croquis, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();
  const [hasError, setHasError] = React.useState(false);

  if (!croquis || hasError) {
    return null;
  }

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        CROQUIS DE LA PARCELA
      </div>
      <DocumentItem
        url={croquis}
        title="Croquis de la parcela"
        defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.CROQUIS}
        onError={() => setHasError(true)}
      />
      <PageNumber pageNumber={pageCounter} />
    </div>
  );
};

const PerimetroSection: React.FC<{
  perimetro?: string;
  pageCounter: number;
}> = ({ perimetro, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();
  const [hasError, setHasError] = React.useState(false);

  if (!perimetro || hasError) {
    return null;
  }

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        PERÍMETRO DE LA MANZANA
      </div>
      <DocumentItem
        url={perimetro}
        title="Perímetro de la manzana"
        defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PERIMETRO}
        onError={() => setHasError(true)}
      />
      <PageNumber pageNumber={pageCounter} />
    </div>
  );
};

const PlanoIndiceSection: React.FC<{
  planoIndice?: string;
  pageCounter: number;
}> = ({ planoIndice, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();
  const [hasError, setHasError] = React.useState(false);

  if (!planoIndice || hasError) {
    return null;
  }

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        PLANO ÍNDICE
      </div>
      <DocumentItem
        url={planoIndice}
        title="Plano índice"
        defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PLANO_INDICE}
        onError={() => setHasError(true)}
      />
      <PageNumber pageNumber={pageCounter} />
    </div>
  );
};

const CompoundCroquisSection: React.FC<{ croquis: string[]; pageCounter: number }> = ({
  croquis,
  pageCounter,
}) => {
  const { parentTableStyle } = useTablePersonalization();
  const [errorUrls, setErrorUrls] = React.useState<Set<string>>(new Set());

  const validCroquis = croquis.filter((url) => !errorUrls.has(url));

  if (validCroquis.length === 0) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        CROQUIS DE LAS PARCELAS
      </div>

      {validCroquis.map((url, index) => (
        <DataTable key={index} title={`CROQUIS DE PARCELA ${index + 1}`} className="mb-6">
          <div className="p-4 text-center">
            <DocumentItem
              url={url}
              title={`Croquis de parcela ${index + 1}`}
              defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.CROQUIS}
              onError={() => setErrorUrls((prev) => new Set(prev).add(url))}
            />
          </div>
        </DataTable>
      ))}
      <PageNumber pageNumber={pageCounter} />
    </div>
  );
};

const CompoundPerimetrosSection: React.FC<{ perimetros: string[]; pageCounter: number }> = ({
  perimetros,
  pageCounter,
}) => {
  const { parentTableStyle } = useTablePersonalization();
  const [errorUrls, setErrorUrls] = React.useState<Set<string>>(new Set());

  const validPerimetros = perimetros.filter((url) => !errorUrls.has(url));

  if (validPerimetros.length === 0) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        PERÍMETROS DE LAS MANZANAS
      </div>

      {validPerimetros.map((url, index) => (
        <DataTable key={index} title={`PERÍMETRO DE MANZANA ${index + 1}`} className="mb-6">
          <div className="p-4 text-center">
            <DocumentItem
              url={url}
              title={`Perímetro de manzana ${index + 1}`}
              defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PERIMETRO}
              onError={() => setErrorUrls((prev) => new Set(prev).add(url))}
            />
          </div>
        </DataTable>
      ))}
      <PageNumber pageNumber={pageCounter} />
    </div>
  );
};

const CompoundPlanosIndiceSection: React.FC<{ planosIndice: string[]; pageCounter: number }> = ({
  planosIndice,
  pageCounter,
}) => {
  const { parentTableStyle } = useTablePersonalization();
  const [errorUrls, setErrorUrls] = React.useState<Set<string>>(new Set());

  const validPlanosIndice = planosIndice.filter((url) => !errorUrls.has(url));

  if (validPlanosIndice.length === 0) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`} style={parentTableStyle}>
        PLANOS ÍNDICE
      </div>

      {validPlanosIndice.map((url, index) => (
        <DataTable key={index} title={`PLANO ÍNDICE ${index + 1}`} className="mb-6">
          <div className="p-4 text-center">
            <DocumentItem
              url={url}
              title={`Plano índice ${index + 1}`}
              defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PLANO_INDICE}
              onError={() => setErrorUrls((prev) => new Set(prev).add(url))}
            />
          </div>
        </DataTable>
      ))}
      <PageNumber pageNumber={pageCounter} />
    </div>
  );
};

const DocumentItem: React.FC<{
  url: string;
  title: string;
  defaultImageUrl: string;
  onError?: (() => void) | undefined;
}> = ({ url, title, defaultImageUrl, onError }) => (
  <div className="border border-gray-300 dark:border-gray-700 p-4 text-center">
    {!isPDF(url) ? (
      <ImageViewer url={url} title={title} defaultImageUrl={defaultImageUrl} onError={onError} />
    ) : (
      <PdfViewer url={url} title={title} />
    )}
  </div>
);

const ImageViewer: React.FC<{
  url: string;
  title: string;
  defaultImageUrl: string;
  onError?: (() => void) | undefined;
}> = ({ url, title, defaultImageUrl, onError }) => {
  const [hasError, setHasError] = React.useState(false);
  const isUsingDefaultRef = React.useRef(false);
  const hasHandledErrorRef = React.useRef(false);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const originalUrlRef = React.useRef<string>(url);

  const handleError = React.useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = e.currentTarget;

      if (hasHandledErrorRef.current) {
        img.onerror = null;
        return;
      }

      const currentSrc = img.src;
      const isDefaultImage = currentSrc === defaultImageUrl || currentSrc.endsWith(defaultImageUrl);
      const isOriginalUrl = currentSrc === originalUrlRef.current || currentSrc === url;

      if (isUsingDefaultRef.current || isDefaultImage) {
        hasHandledErrorRef.current = true;
        setHasError(true);
        img.onerror = null;
        if (imgRef.current) {
          imgRef.current.onerror = null;
        }
        console.warn(
          `[ImageViewer] No se pudo cargar la imagen. URL original: ${originalUrlRef.current}, URL actual: ${currentSrc}`
        );
        return;
      }

      if (isOriginalUrl) {
        const isExternalUrl = url.startsWith('http://') || url.startsWith('https://');
        if (isExternalUrl && !url.startsWith(window.location.origin)) {
          console.warn(
            `[ImageViewer] Error al cargar imagen externa: ${url}. Puede ser un problema de CORS o la imagen no está disponible.`
          );
          hasHandledErrorRef.current = true;
          setHasError(true);
          img.onerror = null;
          if (imgRef.current) {
            imgRef.current.onerror = null;
          }
          return;
        }

        isUsingDefaultRef.current = true;
        hasHandledErrorRef.current = true;
        img.onerror = null;
        img.src = defaultImageUrl;
        return;
      }
    },
    [defaultImageUrl, url]
  );

  const onErrorRef = React.useRef(onError);
  React.useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  React.useEffect(() => {
    isUsingDefaultRef.current = false;
    hasHandledErrorRef.current = false;
    setHasError(false);
    originalUrlRef.current = url;
  }, [url]);

  React.useEffect(() => {
    if (hasError) {
      onErrorRef.current?.();
    }
  }, [hasError]);

  if (hasError) {
    return null;
  }

  return (
    <img
      ref={imgRef}
      src={url}
      alt={title}
      className="max-w-full object-contain mx-auto"
      onError={handleError}
    />
  );
};

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

// Sección LFI Y LIB oculta temporalmente
/*
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
*/

// Sección LFI Y LIB oculta temporalmente
/*
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
      {pageCounter && <PageNumber pageNumber={pageCounter} />}
    </div>
  );
};
*/
