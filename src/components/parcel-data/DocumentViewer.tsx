import React from 'react';

import { DocumentViewerProps } from '../../types/enums';

import { CompoundInformeSections, SingleInformeSections } from './DocumentViewerSections';

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  informe,
  informeCompuesto,
  esInformeCompuesto,
  documentosVisuales,
  pageCounter,
  pageNumbers,
  tipoPrefa,
}) => {
  const informeAMostrar =
    esInformeCompuesto && informeCompuesto ? informeCompuesto.informeConsolidado : informe;

  return (
    <>
      {!esInformeCompuesto && (
        <SingleInformeSections
          informeAMostrar={informeAMostrar}
          informeCompuesto={informeCompuesto}
          esInformeCompuesto={esInformeCompuesto}
          documentosVisuales={documentosVisuales}
          pageCounter={pageCounter}
          {...(tipoPrefa !== undefined ? { tipoPrefa } : {})}
          {...(pageNumbers ? { pageNumbers } : {})}
        />
      )}

      {esInformeCompuesto && (
        <CompoundInformeSections
          informeAMostrar={informeAMostrar}
          informeCompuesto={informeCompuesto}
          esInformeCompuesto={esInformeCompuesto}
          documentosVisuales={documentosVisuales}
          pageCounter={pageCounter}
          {...(tipoPrefa !== undefined ? { tipoPrefa } : {})}
          {...(pageNumbers ? { pageNumbers } : {})}
        />
      )}
    </>
  );
};

export default DocumentViewer;
