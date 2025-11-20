import React, { useEffect, useState } from 'react';

import { useParcelPageNumbers } from '../hooks/use-parcel-page-numbers';
import { useParcelWatermark } from '../hooks/use-parcel-watermark';
import { obtenerDocumentosVisuales } from '../services/consolidacion-informes';
import { DocumentosVisuales, ParcelDataPageProps } from '../types/enums';
import { calculateAllValues } from '../utils/parcel-calculations';

import ParcelDataContent from './parcel-data/ParcelDataContent';

const ParcelDataPage: React.FC<ParcelDataPageProps> = ({
  informe,
  informeCompuesto,
  esInformeCompuesto = false,
  tipoPrefa,
  onChangeLogUpdate: _onChangeLogUpdate,
  plusvaliaRef,
}) => {
  useParcelWatermark();

  const informeAMostrar =
    esInformeCompuesto && informeCompuesto ? informeCompuesto.informeConsolidado : informe;

  const calculatedValues = calculateAllValues(informeAMostrar, {});

  const [documentosVisuales, setDocumentosVisuales] = useState<DocumentosVisuales>({
    croquis: [],
    perimetros: [],
    planosIndice: [],
  });

  const smp = informeAMostrar.datosCatastrales?.smp || '';

  useEffect(() => {
    if (esInformeCompuesto && informeCompuesto) {
      const documentos = obtenerDocumentosVisuales(informeCompuesto.informesIndividuales);
      setDocumentosVisuales(documentos);
    }
  }, [esInformeCompuesto, informeCompuesto]);

  const { pageNumbers, fachadaImages, context } = useParcelPageNumbers(
    informe,
    informeCompuesto,
    esInformeCompuesto,
    smp,
    documentosVisuales
  );

  return (
    <div
      id="parcel-page-root"
      className="relative bg-white dark:bg-gray-900 p-4 md:p-10 border-t border-gray-200 dark:border-gray-700"
    >
      <ParcelDataContent
        informe={informe}
        informeCompuesto={informeCompuesto}
        esInformeCompuesto={esInformeCompuesto}
        tipoPrefa={tipoPrefa}
        plusvaliaRef={plusvaliaRef}
        calculatedValues={calculatedValues}
        fachadaImages={fachadaImages}
        documentosVisuales={documentosVisuales}
        pageNumbers={pageNumbers}
        context={context}
      />
    </div>
  );
};

export default ParcelDataPage;
