import React from 'react';
import { DocumentViewerProps, DocumentItemProps, PdfViewerProps, PARCEL_DATA_CONFIG } from '../../types/enums';
import {
  CroquisSectionProps,
  PerimetroSectionProps,
  PlanoIndiceSectionProps,
  CompoundCroquisSectionProps,
  CompoundPerimetrosSectionProps,
  CompoundPlanosIndiceSectionProps,
  ImageViewerProps,
  LbiLfiSectionProps
} from '../../types/components';
import { isPDF, getPdfViewerUrl } from '../../utils/parcelCalculations';
import LbiLfiViewerMapLibre from '../lbi-lfi-viewer/LbiLfiViewerMapLibre';
import useTablePersonalization from '../../hooks/useTablePersonalization';
import DataTable from './DataTable';

const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  informe, 
  informeCompuesto, 
  esInformeCompuesto, 
  documentosVisuales, 
  pageCounter,
  pageNumbers 
}) => {
  const informeAMostrar = esInformeCompuesto && informeCompuesto 
    ? informeCompuesto.informeConsolidado
    : informe;

  return (
    <>
      {!esInformeCompuesto && (
        <>
          <CroquisSection 
            croquis={informeAMostrar.edificabilidad?.link_imagen?.croquis_parcela}
            pageCounter={pageNumbers?.croquis || pageCounter}
          />
          
          <PerimetroSection 
            perimetro={informeAMostrar.edificabilidad?.link_imagen?.perimetro_manzana}
            informe={informeAMostrar}
            pageCounter={pageNumbers?.perimetro || (pageCounter + 1)}
            lbiLfiPageCounter={pageNumbers?.lbiLfi || (pageCounter + 2)}
          />
          
          <PlanoIndiceSection 
            planoIndice={informeAMostrar.edificabilidad?.link_imagen?.plano_indice}
            pageCounter={pageNumbers?.planoIndice || (pageCounter + 2)}
          />
        </>
      )}

      {esInformeCompuesto && (
        <>
          <CompoundCroquisSection 
            croquis={documentosVisuales.croquis}
            pageCounter={pageCounter}
          />
          
          <CompoundPerimetrosSection 
            perimetros={documentosVisuales.perimetros}
            pageCounter={pageCounter + 1}
          />
          
          <CompoundPlanosIndiceSection 
            planosIndice={documentosVisuales.planosIndice}
            pageCounter={pageCounter + 2}
          />

          {/* Sección LBI/LFI para informe compuesto */}
          {informeCompuesto?.informeConsolidado?.googleMaps && informeCompuesto?.informeConsolidado?.datosCatastrales?.smp && (
            <LbiLfiSection 
              informe={informeCompuesto.informeConsolidado}
              informesIndividuales={informeCompuesto.informesIndividuales}
              esCompuesto={esInformeCompuesto}
              pageCounter={pageCounter + 3}
            />
          )}
        </>
      )}
    </>
  );
};

const CroquisSection: React.FC<CroquisSectionProps> = ({ croquis, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();
  
  if (!croquis) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div 
        className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`}
        style={parentTableStyle}
      >
        CROQUIS DE LA PARCELA
      </div>
      <DocumentItem 
        url={croquis}
        title="Croquis de la parcela"
        defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.CROQUIS}
      />
              <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">{pageCounter}</div>
    </div>
  );
};

const PerimetroSection: React.FC<PerimetroSectionProps> = ({ perimetro, informe, pageCounter, lbiLfiPageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();
  
  if (!perimetro) return null;

  return (
    <>
      <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
        <div 
          className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`}
          style={parentTableStyle}
        >
          PERÍMETRO DE LA MANZANA
        </div>
        <DocumentItem 
          url={perimetro}
          title="Perímetro de la manzana"
          defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PERIMETRO}
        />
        <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">{pageCounter}</div>
      </div>

      {informe.googleMaps && informe.datosCatastrales?.smp && (
        <LbiLfiSection 
          informe={informe}
          esCompuesto={false}
          pageCounter={lbiLfiPageCounter}
        />
      )}
    </>
  );
};

const PlanoIndiceSection: React.FC<PlanoIndiceSectionProps> = ({ planoIndice, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();
  
  if (!planoIndice) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div 
        className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`}
        style={parentTableStyle}
      >
        PLANO ÍNDICE
      </div>
      <DocumentItem 
        url={planoIndice}
        title="Plano índice"
        defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PLANO_INDICE}
      />
      <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">{pageCounter}</div>
    </div>
  );
};

const CompoundCroquisSection: React.FC<CompoundCroquisSectionProps> = ({ croquis, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();
  
  if (croquis.length === 0) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div 
        className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`}
        style={parentTableStyle}
      >
        CROQUIS DE LAS PARCELAS
      </div>
      
      {croquis.map((url, index) => (
        <DataTable
          key={index}
          title={`CROQUIS DE PARCELA ${index + 1}`}
          className="mb-6"
        >
          <div className="p-4 text-center">
            <DocumentItem 
              url={url}
              title={`Croquis de parcela ${index + 1}`}
              defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.CROQUIS}
            />
          </div>
        </DataTable>
      ))}
      <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">{pageCounter}</div>
    </div>
  );
};

const CompoundPerimetrosSection: React.FC<CompoundPerimetrosSectionProps> = ({ perimetros, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();
  
  if (perimetros.length === 0) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div 
        className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`}
        style={parentTableStyle}
      >
        PERÍMETROS DE LAS MANZANAS
      </div>
      
      {perimetros.map((url, index) => (
        <DataTable
          key={index}
          title={`PERÍMETRO DE MANZANA ${index + 1}`}
          className="mb-6"
        >
          <div className="p-4 text-center">
            <DocumentItem 
              url={url}
              title={`Perímetro de manzana ${index + 1}`}
              defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PERIMETRO}
            />
          </div>
        </DataTable>
      ))}
      <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">{pageCounter}</div>
    </div>
  );
};

const CompoundPlanosIndiceSection: React.FC<CompoundPlanosIndiceSectionProps> = ({ planosIndice, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();
  
  if (planosIndice.length === 0) return null;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div 
        className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`}
        style={parentTableStyle}
      >
        PLANOS ÍNDICE
      </div>
      
      {planosIndice.map((url, index) => (
        <DataTable
          key={index}
          title={`PLANO ÍNDICE ${index + 1}`}
          className="mb-6"
        >
          <div className="p-4 text-center">
            <DocumentItem 
              url={url}
              title={`Plano índice ${index + 1}`}
              defaultImageUrl={PARCEL_DATA_CONFIG.DEFAULT_IMAGES.PLANO_INDICE}
            />
          </div>
        </DataTable>
      ))}
      <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">{pageCounter}</div>
    </div>
  );
};

const DocumentItem: React.FC<DocumentItemProps> = ({ url, title, defaultImageUrl }) => (
  <div className="border p-4 text-center">
    {!isPDF(url) ? (
      <ImageViewer url={url} title={title} defaultImageUrl={defaultImageUrl} />
    ) : (
      <PdfViewer url={url} title={title} />
    )}
  </div>
);

const ImageViewer: React.FC<ImageViewerProps> = ({ url, title, defaultImageUrl }) => (
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

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title, className = "min-h-[80vh] w-full" }) => (
  <div className="w-full">
    <object
      data={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
      type="application/pdf"
      width="100%"
      className={className}
      onError={(e) => {
        const target = e.currentTarget;
        const container = target.parentElement;
        if (container) {
          const iframe = document.createElement('iframe');
          iframe.src = getPdfViewerUrl(url);
          iframe.width = "100%";
          iframe.height = "100%";
          iframe.className = `${className} border-0`;
          container.innerHTML = '';
          container.appendChild(iframe);
        }
      }}
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

const LbiLfiSection: React.FC<LbiLfiSectionProps> = ({ informe, informesIndividuales = [], esCompuesto = false, pageCounter }) => {
  const { parentTableStyle } = useTablePersonalization();
  
  const lbiLfiData = {
    smp: informe.datosCatastrales.smp,
    coordenadas: {
      lat: parseFloat(informe.googleMaps.lat),
      lon: parseFloat(informe.googleMaps.lon)
    },
    geometria: informe.geometria
  };
  
  const [statsList, setStatsList] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchStats = async () => {
      if (!esCompuesto || informesIndividuales.length === 0) return;
      try {
        const promises = informesIndividuales.map(async (inf) => {
          const base = (process.env.REACT_APP_API_URL || 'http://localhost:4000').replace(/\/$/, '');
          const token = localStorage.getItem('token');
          const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
          const resp = await fetch(`${base}/mapdata/smp/${encodeURIComponent(inf.datosCatastrales.smp)}`, { headers });
          if (!resp.ok) throw new Error('fetch error');
          const data = await resp.json();
          return {
            smp: inf.datosCatastrales.smp,
            estadisticas: data.estadisticas
          };
        });
        const results = await Promise.all(promises);
        setStatsList(results);
      } catch (e) {
        console.error('Error obteniendo estadísticas:', e);
      }
    };
    fetchStats();
  }, [esCompuesto, informesIndividuales]);

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div 
        className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-2`}
        style={parentTableStyle}
      >
        VISUALIZACIÓN DE LFI Y LIB
      </div>
      <div className="relative">
        <LbiLfiViewerMapLibre 
          smp={lbiLfiData.smp}
          centro={lbiLfiData.coordenadas}
          geometriaParcela={lbiLfiData.geometria}
          showStatsOverlay={!esCompuesto}
        />

        {/* Overlay de estadísticas por parcela cuando es compuesto */}
        {esCompuesto && statsList.length > 0 && (
          <div className="absolute top-4 right-4 bg-white rounded shadow-lg p-3 text-sm z-10 max-w-xs">
            <h4 className="font-semibold mb-2">Análisis de Afectación</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {statsList.map((item, idx) => (
                <div key={idx} className="border-b pb-2 last:border-b-0">
                  <div className="font-medium mb-1">SMP {item.smp}</div>
                  <div>Esquinas con troneras: {item.estadisticas?.esquinas_con_troneras ?? 0} / {item.estadisticas?.total_esquinas ?? 0}</div>
                  <div>Afectación LFI: {item.estadisticas?.porcentaje_afectacion_lfi ?? 0}%</div>
                  <div>Afectación LIB: {item.estadisticas?.porcentaje_afectacion_lib ?? 0}%</div>
                  <hr className="my-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
   
      {pageCounter && (
        <div className="mt-4 border rounded w-fit px-3 py-1 text-dark bg-gray-100 ml-auto">{pageCounter}</div>
      )}
    </div>
  );
};

export default DocumentViewer;