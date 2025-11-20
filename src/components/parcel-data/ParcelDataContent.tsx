import React from 'react';

import { DocumentosVisuales, Informe, InformeCompuesto } from '../../types/enums';
import { calculateAllValues } from '../../utils/parcel-calculations';

import BasicInformation from './BasicInformation';
import GeneralConsiderations from './GeneralConsiderations';
import ParcelDataSections from './ParcelDataSections';
import ParcelDataTables from './ParcelDataTables';

interface ParcelDataContentProps {
  informe: Informe;
  informeCompuesto: InformeCompuesto | undefined;
  esInformeCompuesto: boolean;
  tipoPrefa: string;
  plusvaliaRef: React.RefObject<HTMLDivElement> | undefined;
  calculatedValues: ReturnType<typeof calculateAllValues>;
  fachadaImages: string[];
  documentosVisuales: DocumentosVisuales;
  pageNumbers: { [key: string]: number };
  context: ReturnType<typeof import('../../utils/index-utils').generateIndexContext>;
}

const ParcelDataContent: React.FC<ParcelDataContentProps> = ({
  informe,
  informeCompuesto,
  esInformeCompuesto,
  tipoPrefa,
  plusvaliaRef,
  calculatedValues,
  fachadaImages,
  documentosVisuales,
  pageNumbers,
  context,
}) => {
  const informeAMostrar =
    esInformeCompuesto && informeCompuesto ? informeCompuesto.informeConsolidado : informe;

  const lastPageNumber = Math.max(...Object.values(pageNumbers), 2);

  return (
    <>
      <GeneralConsiderations pageCounter={pageNumbers['consideraciones_generales'] || 2} />
      <BasicInformation
        informe={informe}
        {...(informeCompuesto !== undefined && { informeCompuesto })}
        esInformeCompuesto={esInformeCompuesto}
        calculatedValues={{
          totalCapConstructiva: calculatedValues.totalCapConstructiva,
          plusvaliaFinal: calculatedValues.plusvaliaFinal,
        }}
        pageCounter={0}
      />
      <ParcelDataTables
        informe={informeAMostrar}
        calculatedValues={calculatedValues}
        pageCounter={pageNumbers['datos_parcela'] || 3}
      />
      <ParcelDataSections
        tipoPrefa={tipoPrefa}
        context={context}
        fachadaImages={fachadaImages}
        informe={informe}
        informeCompuesto={informeCompuesto}
        esInformeCompuesto={esInformeCompuesto}
        documentosVisuales={documentosVisuales}
        pageNumbers={pageNumbers}
        informeAMostrar={informeAMostrar}
        calculatedValues={calculatedValues}
        plusvaliaRef={plusvaliaRef}
        lastPageNumber={lastPageNumber}
      />
    </>
  );
};

export default ParcelDataContent;
