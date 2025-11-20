import React from 'react';

import { DocumentosVisuales, Informe, InformeCompuesto } from '../../types/enums';
import { calculateAllValues } from '../../utils/parcel-calculations';

import ParcelDataSectionsContent from './ParcelDataSectionsContent';
import {
  shouldShowDocumentViewer,
  shouldShowFacadeImages,
  shouldShowPlusvalia,
} from './ParcelDataSectionsHelpers';

interface ParcelDataSectionsProps {
  tipoPrefa: string;
  context: ReturnType<typeof import('../../utils/index-utils').generateIndexContext>;
  fachadaImages: string[];
  informe: Informe;
  informeCompuesto: InformeCompuesto | undefined;
  esInformeCompuesto: boolean;
  documentosVisuales: DocumentosVisuales;
  pageNumbers: { [key: string]: number };
  informeAMostrar: Informe;
  calculatedValues: ReturnType<typeof calculateAllValues>;
  plusvaliaRef: React.RefObject<HTMLDivElement> | undefined;
  lastPageNumber: number;
}

const ParcelDataSections: React.FC<ParcelDataSectionsProps> = ({
  tipoPrefa,
  context,
  fachadaImages,
  informe,
  informeCompuesto,
  esInformeCompuesto,
  documentosVisuales,
  pageNumbers,
  informeAMostrar,
  calculatedValues,
  plusvaliaRef,
  lastPageNumber,
}) => {
  const showFacadeImages = shouldShowFacadeImages({
    tipoPrefa,
    context,
    fachadaImages,
    informeAMostrar,
  });
  const showDocumentViewer = shouldShowDocumentViewer({
    tipoPrefa,
    context,
    fachadaImages,
    informeAMostrar,
  });
  const showPlusvalia = shouldShowPlusvalia({ tipoPrefa, context, fachadaImages, informeAMostrar });

  return (
    <ParcelDataSectionsContent
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
};

export default ParcelDataSections;
