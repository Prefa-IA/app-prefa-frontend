import React from 'react';

import { DocumentosVisuales, Informe, InformeCompuesto } from '../../types/enums';
import { getInformeConCalculo } from '../../utils/informe-calculado-helper';
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
  const informeConCalculo = getInformeConCalculo(informe);

  const informeConsolidadoConCalculo = informeCompuesto
    ? {
        ...informeCompuesto,
        informeConsolidado: getInformeConCalculo(informeCompuesto.informeConsolidado),
        informesIndividuales: informeCompuesto.informesIndividuales.map((inf) =>
          getInformeConCalculo(inf)
        ),
      }
    : undefined;

  const informeAMostrar =
    esInformeCompuesto && informeConsolidadoConCalculo
      ? informeConsolidadoConCalculo.informeConsolidado
      : informeConCalculo;

  const lastPageNumber = Math.max(...Object.values(pageNumbers), 2);

  return (
    <>
      <GeneralConsiderations pageCounter={pageNumbers['consideraciones_generales'] || 2} />
      <BasicInformation
        informe={informeConCalculo}
        {...(informeConsolidadoConCalculo !== undefined && {
          informeCompuesto: informeConsolidadoConCalculo,
        })}
        esInformeCompuesto={esInformeCompuesto}
        calculatedValues={{
          totalCapConstructiva: calculatedValues.totalCapConstructiva,
          plusvaliaFinal: calculatedValues.plusvaliaFinal ?? 0,
        }}
        pageCounter={0}
      />
      <ParcelDataTables
        informe={informeAMostrar}
        {...(informeConsolidadoConCalculo !== undefined && {
          informeCompuesto: informeConsolidadoConCalculo,
        })}
        esInformeCompuesto={esInformeCompuesto}
        calculatedValues={calculatedValues}
        pageCounter={pageNumbers['datos_parcela'] || 3}
      />
      <ParcelDataSections
        tipoPrefa={tipoPrefa}
        context={context}
        fachadaImages={fachadaImages}
        informe={informeConCalculo}
        informeCompuesto={informeConsolidadoConCalculo}
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
