import React, { useEffect, useState } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePlanes } from '../hooks/use-planes';
import { obtenerDocumentosVisuales } from '../services/consolidacion-informes';
import { TIPO_PREFA } from '../types/consulta-direccion';
import { DocumentosVisuales, DYNAMIC_INDEX_CONFIG, ParcelDataPageProps } from '../types/enums';
import { generateIndexContext } from '../utils/index-utils';
import {
  calculateAllValues,
  checkImageExists,
  generateFachadaUrl,
} from '../utils/parcel-calculations';

import BasicInformation from './parcel-data/BasicInformation';
import DocumentViewer from './parcel-data/DocumentViewer';
import FacadeImages from './parcel-data/FacadeImages';
import GeneralConsiderations from './parcel-data/GeneralConsiderations';
import ParcelDataTables from './parcel-data/ParcelDataTables';
import PlusvaliaCalculation from './parcel-data/PlusvaliaCalculation';

const ParcelDataPage: React.FC<ParcelDataPageProps> = ({
  informe,
  informeCompuesto,
  esInformeCompuesto = false,
  tipoPrefa,
  onChangeLogUpdate: _onChangeLogUpdate,
  plusvaliaRef,
}) => {
  const { usuario } = useAuth();
  const { planes } = usePlanes();
  const { theme } = useTheme();
  const informeAMostrar =
    esInformeCompuesto && informeCompuesto ? informeCompuesto.informeConsolidado : informe;

  const calculatedValues = calculateAllValues(informeAMostrar, {});

  const [documentosVisuales, setDocumentosVisuales] = useState<DocumentosVisuales>({
    croquis: [],
    perimetros: [],
    planosIndice: [],
  });

  const smp = informeAMostrar.datosCatastrales?.smp || '';
  const [fachadaImages, setFachadaImages] = useState<string[]>([]);
  useEffect(() => {
    if (!usuario || planes.length === 0) return;

    const plan = planes.find(
      (p) => p.id === usuario.suscripcion?.tipo || p.name === usuario.suscripcion?.nombrePlan
    );

    const usarOrg = plan?.watermarkOrg;

    let orgDataUri: string | null = null;
    if (usarOrg) {
      if (usuario.personalizacion?.logo) {
        orgDataUri = usuario.personalizacion.logo;
      } else if (usuario.nombre) {
        const text = usuario.nombre.toUpperCase();
        const textColor = theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="120" viewBox="0 0 1700 120"><text x="10" y="90" font-size="100" fill="${textColor}" font-family="Arial,Helvetica,sans-serif">${text}</text></svg>`;
        orgDataUri = `data:image/svg+xml;base64,${btoa(svg)}`;
      }
    }

    const prefaDataUri = `url(/logo.png)`;
    const bg = usarOrg && orgDataUri ? `url(${orgDataUri})` : prefaDataUri;

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-watermark', 'parcel');
    styleEl.innerHTML = `#parcel-page-root::before { content:''; position:absolute; top:0; left:0; width:100vw; height:100%; pointer-events:none; opacity:0.1; transform:none; background-repeat:repeat; background-position:left top; background-size:500px 500px; background-image:${bg}; z-index:0; }`;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, [usuario, planes, theme]);

  useEffect(() => {
    if (esInformeCompuesto && informeCompuesto) {
      const documentos = obtenerDocumentosVisuales(informeCompuesto.informesIndividuales);
      setDocumentosVisuales(documentos);
    }
  }, [esInformeCompuesto, informeCompuesto]);

  useEffect(() => {
    const loadImages = async () => {
      if (!smp) return;

      const potentialUrls = Array.from({ length: 5 }, (_, i) => generateFachadaUrl(smp, i));

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

    void loadImages();
  }, [smp]);

  // Generar numeración dinámica de páginas
  const context = generateIndexContext(
    informe,
    informeCompuesto,
    esInformeCompuesto,
    fachadaImages,
    documentosVisuales
  );

  let currentPage = 2;
  const pageNumbers: { [key: string]: number } = {};

  DYNAMIC_INDEX_CONFIG.BASE_SECTIONS.forEach((section) => {
    const shouldInclude = section.shouldInclude
      ? section.shouldInclude(informeAMostrar, context)
      : true;
    if (shouldInclude) {
      pageNumbers[section.id] = currentPage;
      currentPage++;
    }
  });

  return (
    <div
      id="parcel-page-root"
      className="relative bg-white dark:bg-gray-900 p-4 md:p-10 border-t border-gray-200 dark:border-gray-700"
    >
      <GeneralConsiderations pageCounter={pageNumbers['consideraciones_generales'] || 2} />

      <BasicInformation
        informe={informe}
        {...(informeCompuesto !== undefined && { informeCompuesto })}
        esInformeCompuesto={esInformeCompuesto}
        calculatedValues={{
          totalCapConstructiva: calculatedValues.totalCapConstructiva,
          plusvaliaFinal: calculatedValues.plusvaliaFinal,
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
          alicuota: calculatedValues.alicuota,
        }}
        pageCounter={pageNumbers['datos_parcela'] || 3}
      />

      {tipoPrefa === TIPO_PREFA.COMPLETA && (context.hasEntorno || fachadaImages.length > 0) && (
        <FacadeImages
          fachadaImages={fachadaImages}
          pageCounter={pageNumbers['entorno_fachada'] || 4}
        />
      )}

      {tipoPrefa === TIPO_PREFA.COMPLETA && (
        <DocumentViewer
          informe={informe}
          {...(informeCompuesto !== undefined && { informeCompuesto })}
          esInformeCompuesto={esInformeCompuesto}
          documentosVisuales={documentosVisuales}
          pageCounter={pageNumbers['croquis_parcela'] || 5}
          pageNumbers={{
            croquis: pageNumbers['croquis_parcela'] || 5,
            perimetro: pageNumbers['perimetro_manzana'] || 6,
            planoIndice: pageNumbers['plano_indice'] || 7,
            lbiLfi: pageNumbers['lbi_lfi'] || 8,
          }}
        />
      )}

      {informeAMostrar.edificabilidad?.plusvalia && (
        <PlusvaliaCalculation
          informe={informeAMostrar}
          {...(informeCompuesto !== undefined && { informeCompuesto })}
          esInformeCompuesto={esInformeCompuesto}
          calculatedValues={calculatedValues}
          pageCounter={pageNumbers['calculo_plusvalia'] || currentPage - 1}
          {...(plusvaliaRef !== undefined && { plusvaliaRef })}
        />
      )}
    </div>
  );
};

export default ParcelDataPage;
