import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useMapData } from '../hooks/use-map-data';
import { useParcelPageNumbers } from '../hooks/use-parcel-page-numbers';
import { useParcelWatermark } from '../hooks/use-parcel-watermark';
import { obtenerDocumentosVisuales } from '../services/consolidacion-informes';
import { MapData } from '../types/components';
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

  const smp = informeAMostrar.datosCatastrales?.smp || '';
  const geometriaParcela = informeAMostrar.geometria?.features?.[0]?.geometry
    ? (informeAMostrar.geometria.features[0].geometry as GeoJSON.Geometry)
    : null;
  const mapDataRef = useRef<MapData | null>(null);

  const handleDataLoaded = () => {
    // No necesitamos hacer nada aquí, solo necesitamos las estadísticas
  };

  const { estadisticas } = useMapData({
    smp,
    geometriaParcela,
    mapDataRef,
    onDataLoaded: handleDataLoaded,
  });

  const calculatedValues = useMemo(
    () => calculateAllValues(informeAMostrar, {}, estadisticas || undefined),
    [informeAMostrar, estadisticas]
  );

  const [documentosVisuales, setDocumentosVisuales] = useState<DocumentosVisuales>({
    croquis: [],
    perimetros: [],
    planosIndice: [],
  });

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
