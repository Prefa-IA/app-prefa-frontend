import React from 'react';

import { DocumentosVisuales, Informe, InformeCompuesto } from '../../types/enums';
import { calculateAllValues } from '../../utils/parcel-calculations';

import DocumentViewer from './DocumentViewer';
import FacadeImages from './FacadeImages';
import PlusvaliaCalculation from './PlusvaliaCalculation';

interface ParcelDataSectionsRendererProps {
  showFacadeImages: boolean;
  showDocumentViewer: boolean;
  showPlusvalia: boolean;
  fachadaImages: string[];
  pageNumbers: { [key: string]: number };
  informe: Informe;
  informeCompuesto: InformeCompuesto | undefined;
  esInformeCompuesto: boolean;
  documentosVisuales: DocumentosVisuales;
  informeAMostrar: Informe;
  calculatedValues: ReturnType<typeof calculateAllValues>;
  plusvaliaRef: React.RefObject<HTMLDivElement> | undefined;
  lastPageNumber: number;
  tipoPrefa?: string;
}

const renderFacadeImages = (
  showFacadeImages: boolean,
  fachadaImages: string[],
  pageNumbers: { [key: string]: number }
) => {
  if (!showFacadeImages) return null;
  return (
    <FacadeImages fachadaImages={fachadaImages} pageCounter={pageNumbers['entorno_fachada'] || 4} />
  );
};

const renderDocumentViewer = (
  showDocumentViewer: boolean,
  informe: Informe,
  informeCompuesto: InformeCompuesto | undefined,
  esInformeCompuesto: boolean,
  documentosVisuales: DocumentosVisuales,
  pageNumbers: { [key: string]: number },
  tipoPrefa?: string
) => {
  if (!showDocumentViewer) return null;
  return (
    <DocumentViewer
      informe={informe}
      {...(informeCompuesto !== undefined && { informeCompuesto })}
      esInformeCompuesto={esInformeCompuesto}
      documentosVisuales={documentosVisuales}
      pageCounter={pageNumbers['croquis_parcela'] || 5}
      {...(tipoPrefa !== undefined ? { tipoPrefa } : {})}
      pageNumbers={{
        croquis: pageNumbers['croquis_parcela'] || 5,
        perimetro: pageNumbers['perimetro_manzana'] || 6,
        planoIndice: pageNumbers['plano_indice'] || 7,
        lbiLfi: pageNumbers['lbi_lfi'] || 8,
      }}
    />
  );
};

const renderPlusvalia = (
  showPlusvalia: boolean,
  informeAMostrar: Informe,
  informeCompuesto: InformeCompuesto | undefined,
  esInformeCompuesto: boolean,
  calculatedValues: ReturnType<typeof calculateAllValues>,
  pageNumbers: { [key: string]: number },
  plusvaliaRef: React.RefObject<HTMLDivElement> | undefined,
  lastPageNumber: number
) => {
  if (!showPlusvalia) return null;
  return (
    <PlusvaliaCalculation
      informe={informeAMostrar}
      {...(informeCompuesto !== undefined && { informeCompuesto })}
      esInformeCompuesto={esInformeCompuesto}
      calculatedValues={calculatedValues}
      pageCounter={pageNumbers['calculo_plusvalia'] || lastPageNumber}
      {...(plusvaliaRef !== undefined && { plusvaliaRef })}
    />
  );
};

const ParcelDataSectionsRenderer: React.FC<ParcelDataSectionsRendererProps> = ({
  showFacadeImages,
  showDocumentViewer,
  showPlusvalia,
  fachadaImages,
  pageNumbers,
  informe,
  informeCompuesto,
  esInformeCompuesto,
  documentosVisuales,
  informeAMostrar,
  calculatedValues,
  plusvaliaRef,
  lastPageNumber,
  tipoPrefa,
}) => (
  <>
    {renderFacadeImages(showFacadeImages, fachadaImages, pageNumbers)}
    {renderDocumentViewer(
      showDocumentViewer,
      informe,
      informeCompuesto,
      esInformeCompuesto,
      documentosVisuales,
      pageNumbers,
      tipoPrefa
    )}
    {renderPlusvalia(
      showPlusvalia,
      informeAMostrar,
      informeCompuesto,
      esInformeCompuesto,
      calculatedValues,
      pageNumbers,
      plusvaliaRef,
      lastPageNumber
    )}
  </>
);

export default ParcelDataSectionsRenderer;
