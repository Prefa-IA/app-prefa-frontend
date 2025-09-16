import React, { useState, useEffect } from 'react';
import { ParcelDataPageProps, ChangeLogEntry } from '../types/enums';
import { obtenerDocumentosVisuales } from '../services/consolidacionInformes';
import { calculateAllValues, generateFachadaUrl, checkImageExists } from '../utils/parcelCalculations';
import { generateIndexContext } from '../utils/indexUtils';
import { DYNAMIC_INDEX_CONFIG } from '../types/enums';
import GeneralConsiderations from './parcel-data/GeneralConsiderations';
import BasicInformation from './parcel-data/BasicInformation';
import ParcelDataTables from './parcel-data/ParcelDataTables';
import FacadeImages from './parcel-data/FacadeImages';
import DocumentViewer from './parcel-data/DocumentViewer';
import PlusvaliaCalculation from './parcel-data/PlusvaliaCalculation';
import { useAuth } from '../contexts/AuthContext';
import { usePlanes } from '../hooks/usePlanes';

const ParcelDataPage: React.FC<ParcelDataPageProps> = ({ 
  informe, 
  informeCompuesto, 
  esInformeCompuesto = false,
  tipoPrefa,
  onChangeLogUpdate
}) => {
  const { usuario } = useAuth();
  const { planes } = usePlanes();
  const informeAMostrar = esInformeCompuesto && informeCompuesto 
    ? informeCompuesto.informeConsolidado
    : informe;
  
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  
  const calculatedValues = calculateAllValues(informeAMostrar, {});
  
  const [documentosVisuales, setDocumentosVisuales] = useState<{
    croquis: string[];
    perimetros: string[];
    planosIndice: string[];
  }>({
    croquis: [],
    perimetros: [],
    planosIndice: []
  });
  
  const smp = informeAMostrar.datosCatastrales?.smp || '';
  const [fachadaImages, setFachadaImages] = useState<string[]>([]);
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
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120"><text x="0" y="90" font-size="90" fill="rgba(0,0,0,0.15)" font-family="Arial,Helvetica,sans-serif">${text}</text></svg>`;
        orgDataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
      }
    }

    const prefaDataUri = `url(/logo.png)`;
    const bg = usarOrg && !usarPrefa && orgDataUri ? `url(${orgDataUri})` : prefaDataUri;

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-watermark','parcel');
    styleEl.innerHTML = `#parcel-page-root::before { content:''; position:absolute; top:0; left:0; width:100vw; height:100%; pointer-events:none; opacity:0.05; transform:rotate(-30deg); background-size:500px 400px; background-repeat:repeat; background-image:${bg}; z-index:0; }`;
    document.head.appendChild(styleEl);

    return () => { document.head.removeChild(styleEl); };
  }, [usuario, planes]);
  
  useEffect(() => {
    if (esInformeCompuesto && informeCompuesto) {
      const documentos = obtenerDocumentosVisuales(informeCompuesto.informesIndividuales);
      setDocumentosVisuales(documentos);
    }
  }, [esInformeCompuesto, informeCompuesto]);
  
  useEffect(() => {
    const loadImages = async () => {
      if (!smp) return;
      
      const potentialUrls = Array.from({ length: 5 }, (_, i) => 
        generateFachadaUrl(smp, i)
      );
      
      const validImages: string[] = [];
      
      for (const url of potentialUrls) {
        const exists = await checkImageExists(url);
        if (exists) {
          if (!validImages.includes(url)) {
            validImages.push(url);
          }
        }
      }
      
      setFachadaImages(validImages);
    };
    
    loadImages();
  }, [smp]);

  // Generar numeración dinámica de páginas
  const context = generateIndexContext(
    informe,
    informeCompuesto,
    esInformeCompuesto,
    fachadaImages,
    documentosVisuales
  );

  // Calcular páginas dinámicamente basándose en las secciones incluidas
  let currentPage = 2; // Página 2 después del índice (página 1)
  const pageNumbers: { [key: string]: number } = {};

  DYNAMIC_INDEX_CONFIG.BASE_SECTIONS.forEach(section => {
    const shouldInclude = section.shouldInclude ? section.shouldInclude(informeAMostrar, context) : true;
    if (shouldInclude) {
      pageNumbers[section.id] = currentPage;
      currentPage++;
    }
  });

  return (
    <div id="parcel-page-root" className="relative bg-white p-10 border-t border-gray-200">
      <GeneralConsiderations pageCounter={pageNumbers['consideraciones_generales'] || 2} />

      <BasicInformation 
        informe={informe}
        informeCompuesto={informeCompuesto}
        esInformeCompuesto={esInformeCompuesto}
        calculatedValues={{
          totalCapConstructiva: calculatedValues.totalCapConstructiva,
          plusvaliaFinal: calculatedValues.plusvaliaFinal
        }}
        pageCounter={0} // Sin mostrar número de página aquí
      />

      <ParcelDataTables 
        informe={informeAMostrar}
        calculatedValues={{
          superficieParcela: calculatedValues.superficieParcela,
          frenteValor: calculatedValues.frenteValor,
          fotMedanera: calculatedValues.fotMedanera,
          alturaMax: calculatedValues.alturaMax,
          tipoEdificacion: calculatedValues.tipoEdificacion,
          alicuota: calculatedValues.alicuota
        }}
        pageCounter={pageNumbers['datos_parcela'] || 3}
      />

      {/* Para Prefa1 ocultamos entorno/fachada */}
      {tipoPrefa === 'prefa2' && (context.hasEntorno || fachadaImages.length > 0) && (
        <FacadeImages 
          fachadaImages={fachadaImages}
          pageCounter={pageNumbers['entorno_fachada'] || 4}
        />
      )}

      {/* Volumetría eliminada */}

      {tipoPrefa === 'prefa2' && (
        <DocumentViewer 
          informe={informe}
          informeCompuesto={informeCompuesto}
          esInformeCompuesto={esInformeCompuesto}
          documentosVisuales={documentosVisuales}
          pageCounter={pageNumbers['croquis_parcela'] || 5}
          pageNumbers={{
            croquis: pageNumbers['croquis_parcela'] || 5,
            perimetro: pageNumbers['perimetro_manzana'] || 6,
            planoIndice: pageNumbers['plano_indice'] || 7,
            lbiLfi: pageNumbers['lbi_lfi'] || 8
          }}
        />
      )}

      {/* Mostrar cálculo de plusvalía siempre que existan datos de plusvalía */}
      {informeAMostrar.edificabilidad?.plusvalia && (
        <PlusvaliaCalculation 
          informe={informeAMostrar}
          informeCompuesto={informeCompuesto}
          esInformeCompuesto={esInformeCompuesto}
          calculatedValues={calculatedValues}
          pageCounter={pageNumbers['calculo_plusvalia'] || currentPage - 1}
        />
      )}
    </div>
  );
};

export default ParcelDataPage;