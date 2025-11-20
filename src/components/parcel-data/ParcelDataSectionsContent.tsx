import React from 'react';

import { DocumentosVisuales, Informe, InformeCompuesto } from '../../types/enums';
import { calculateAllValues } from '../../utils/parcel-calculations';

import ParcelDataSectionsRenderer from './ParcelDataSectionsRenderer';

interface ParcelDataSectionsContentProps {
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
}

const ParcelDataSectionsContent: React.FC<ParcelDataSectionsContentProps> = ({
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
}) => (
  <ParcelDataSectionsRenderer
    showFacadeImages={showFacadeImages}
    showDocumentViewer={showDocumentViewer}
    showPlusvalia={showPlusvalia}
    fachadaImages={fachadaImages}
    pageNumbers={pageNumbers}
    informe={informe}
    informeCompuesto={informeCompuesto}
    esInformeCompuesto={esInformeCompuesto}
    documentosVisuales={documentosVisuales}
    informeAMostrar={informeAMostrar}
    calculatedValues={calculatedValues}
    plusvaliaRef={plusvaliaRef}
    lastPageNumber={lastPageNumber}
  />
);

export default ParcelDataSectionsContent;
