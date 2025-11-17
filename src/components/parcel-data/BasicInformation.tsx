import React from 'react';

import useTablePersonalization from '../../hooks/use-table-personalization';
import { DirectionsSectionProps } from '../../types/components';
import { BasicInformationProps, Informe, PARCEL_DATA_CONFIG } from '../../types/enums';
import { calculateAllValues } from '../../utils/parcel-calculations';

import DataTable, { GridTableHeader, GridTableRow, TableRow } from './DataTable';

const determineIsBasicSearch = (
  isBasicSearchProp: boolean | undefined,
  informeAMostrar: Informe
): boolean => {
  if (isBasicSearchProp !== undefined) return isBasicSearchProp;
  const shpAssets = (informeAMostrar as unknown as Record<string, unknown>)['shp_assets_info'] as
    | Record<string, unknown>
    | undefined;
  const troneras = shpAssets?.['troneras'] as { calculadas?: number } | undefined;
  const capas = shpAssets?.['capas'] as { lfi?: { datos?: unknown[] } } | undefined;
  return (
    !informeAMostrar.geometria?.features ||
    !troneras?.calculadas ||
    (troneras?.calculadas === 0 && !capas?.lfi?.datos?.length)
  );
};

const formatMedida = (medida: string | number | undefined): string => {
  if (!medida) return 'N/A';
  const numValue = typeof medida === 'string' ? parseFloat(medida) : parseFloat(String(medida));
  return `${numValue.toFixed(2)} m`;
};

const calculateBreakdowns = (
  esInformeCompuesto: boolean,
  informeCompuesto: BasicInformationProps['informeCompuesto']
): { capacityBreakdown: string; plusvaliaBreakdown: string } => {
  if (!esInformeCompuesto || !informeCompuesto) {
    return { capacityBreakdown: '', plusvaliaBreakdown: '' };
  }

  const individuales = informeCompuesto.informesIndividuales;
  const caps: string[] = [];
  const plusVals: string[] = [];

  individuales.forEach((inf) => {
    const vals = calculateAllValues(inf, {});
    caps.push(vals.totalCapConstructiva.toFixed(2));
    plusVals.push(vals.plusvaliaFinal.toLocaleString('es-AR'));
  });

  return {
    capacityBreakdown: caps.length > 0 ? ` (${caps.join(' + ')})` : '',
    plusvaliaBreakdown: plusVals.length > 0 ? ` ($${plusVals.join(' + $')})` : '',
  };
};

const getDireccion = (
  esInformeCompuesto: boolean,
  informeCompuesto: BasicInformationProps['informeCompuesto'],
  informeAMostrar: Informe
): string => {
  if (esInformeCompuesto && informeCompuesto) {
    return informeCompuesto.direcciones.join(', ');
  }
  return informeAMostrar.direccionesNormalizadas?.[0]?.direccion || 'N/A';
};

const getNomenclador = (
  esInformeCompuesto: boolean,
  informeCompuesto: BasicInformationProps['informeCompuesto'],
  informeAMostrar: Informe
): string => {
  if (esInformeCompuesto && informeCompuesto) {
    return informeCompuesto.informesIndividuales
      .map((i) => i.datosCatastrales?.smp || '')
      .join(', ');
  }
  return informeAMostrar.datosCatastrales?.smp || 'N/A';
};

const getBasicInfoValues = (
  isBasicSearch: boolean,
  esInformeCompuesto: boolean,
  informeCompuesto: BasicInformationProps['informeCompuesto'],
  informeAMostrar: Informe,
  frente: string,
  fondo: string,
  calculatedValues: BasicInformationProps['calculatedValues'],
  capacityBreakdown: string,
  plusvaliaBreakdown: string
): React.ReactNode[] => {
  const direccion = getDireccion(esInformeCompuesto, informeCompuesto, informeAMostrar);
  const barrio = informeAMostrar.datosUtiles?.barrio || 'N/A';
  const nomenclador = getNomenclador(esInformeCompuesto, informeCompuesto, informeAMostrar);
  const edificabilidad = informeAMostrar?.edificabilidad as unknown as
    | Record<string, unknown>
    | undefined;
  const metrics = (edificabilidad?.['metrics'] as Record<string, unknown>) || {};

  if (isBasicSearch) {
    return [
      direccion,
      barrio,
      nomenclador,
      <div key="frente" className="text-center">
        {frente}
      </div>,
      <div key="fondo" className="text-center">
        {fondo}
      </div>,
    ];
  }

  const capacidad = calculatedValues?.totalCapConstructiva
    ? `${calculatedValues.totalCapConstructiva.toFixed(2)} m²${capacityBreakdown}`
    : metrics['superficie_edificable_maxima_m2']
      ? `${((metrics['superficie_edificable_maxima_m2'] as number) || 0).toFixed(2)} m²${capacityBreakdown}`
      : 'N/A';

  const plusvaliaNum = calculatedValues?.plusvaliaFinal
    ? calculatedValues.plusvaliaFinal
    : metrics['plusvalia_total_estimada']
      ? (metrics['plusvalia_total_estimada'] as number) || 0
      : null;
  const plusvalia =
    plusvaliaNum !== null
      ? `$${Number(plusvaliaNum).toLocaleString('es-AR')}${plusvaliaBreakdown}`
      : 'N/A';

  return [
    direccion,
    barrio,
    nomenclador,
    <div key="capacidad" className="text-center">
      {capacidad}
    </div>,
    <div key="plusvalia" className="text-center">
      {plusvalia}
    </div>,
  ];
};

const getEsAPHFinal = (informeAMostrar: Informe): boolean => {
  const shpAssets = (informeAMostrar as unknown as Record<string, unknown>)['shp_assets_info'] as
    | Record<string, unknown>
    | undefined;
  const aph = shpAssets?.['aph'] as { contexto?: { protegido?: boolean } } | undefined;
  const esAPH =
    aph?.contexto?.protegido || !!informeAMostrar.edificabilidad?.catalogacion?.proteccion;
  const aphExtra = informeAMostrar.edificabilidad?.aph_extra;
  return esAPH || !!aphExtra;
};

const formatManzanaTipica = (tipicaValue: boolean | string | null | undefined): string => {
  if (tipicaValue === null || tipicaValue === undefined) return 'N/A';
  if (typeof tipicaValue === 'boolean') return tipicaValue ? 'Sí' : 'No';
  return String(tipicaValue);
};

const getZonaEspecial = (distritoEspecial: unknown): string | null => {
  if (!distritoEspecial) return null;
  if (Array.isArray(distritoEspecial)) {
    return distritoEspecial.find((d) => d?.distrito_especifico)?.distrito_especifico || null;
  }
  return (distritoEspecial as { distrito_especifico?: string })?.distrito_especifico || null;
};

const formatMixturaUso = (mixturaUso: unknown): string => {
  if (mixturaUso === null || mixturaUso === undefined) return 'N/A';
  return String(mixturaUso);
};

const formatLfiAfeccionPercent = (lfiAfeccionPercent: number | null | undefined): string => {
  if (lfiAfeccionPercent === null || lfiAfeccionPercent === undefined) return 'N/A';
  return `${lfiAfeccionPercent}%`;
};

const getParametrosNormativos = (informeAMostrar: Informe) => {
  const esAPHFinal = getEsAPHFinal(informeAMostrar);
  const manzanaTipica = formatManzanaTipica(informeAMostrar.edificabilidad?.tipica);
  const zonaEspecial = getZonaEspecial(informeAMostrar.edificabilidad?.distrito_especial);
  const mixturaUsoDisplay = formatMixturaUso(informeAMostrar.edificabilidad?.mixtura_uso);
  const edificabilidad = informeAMostrar.edificabilidad as unknown as Record<string, unknown>;
  const lfiAfeccionPercent = formatLfiAfeccionPercent(
    edificabilidad['lfi_afeccion_percent'] as number | null | undefined
  );

  return {
    esAPHFinal,
    aphLindero: informeAMostrar.edificabilidad?.parcelas_linderas?.aph_linderas,
    manzanaTipica,
    riesgoHidrico: informeAMostrar.edificabilidad?.afectaciones?.riesgo_hidrico,
    lep: informeAMostrar.edificabilidad?.afectaciones?.lep,
    ensanche: informeAMostrar.edificabilidad?.afectaciones?.ensanche,
    apertura: informeAMostrar.edificabilidad?.afectaciones?.apertura,
    bandaMinima:
      (
        (informeAMostrar as unknown as Record<string, unknown>)['shp_assets_info'] as
          | { banda_minima?: { features?: number } }
          | undefined
      )?.banda_minima?.features || 0 > 0,
    rivolta: informeAMostrar.edificabilidad?.rivolta,
    troneraIrregular: informeAMostrar.edificabilidad?.irregular,
    zonaEspecialDisplay: zonaEspecial || 'N/A',
    enrase: informeAMostrar.edificabilidad?.enrase,
    mixturaUsoDisplay,
    lfiAfeccionPercent,
  };
};

const BasicInformation: React.FC<BasicInformationProps> = ({
  informe,
  informeCompuesto,
  esInformeCompuesto,
  calculatedValues,
  pageCounter,
  isBasicSearch: isBasicSearchProp,
}) => {
  const informeAMostrar =
    esInformeCompuesto && informeCompuesto ? informeCompuesto.informeConsolidado : informe;

  const { parentTableStyle } = useTablePersonalization();

  const isBasicSearch = determineIsBasicSearch(isBasicSearchProp, informeAMostrar);

  const renderDirecciones = () => {
    if (esInformeCompuesto && informeCompuesto) {
      return <DirectionsSection direcciones={informeCompuesto.direcciones} />;
    }
    return null;
  };

  const basicInfoColumns = isBasicSearch
    ? ['Dirección', 'Barrio', 'Nomenclador', 'Frente', 'Fondo']
    : ['Dirección', 'Barrio', 'Nomenclador', 'Capacidad Constructiva Máx.', 'Plusvalía (estimada)'];

  const { capacityBreakdown, plusvaliaBreakdown } = calculateBreakdowns(
    esInformeCompuesto,
    informeCompuesto
  );

  const frente = formatMedida(informeAMostrar.datosCatastrales?.frente);
  const fondo = formatMedida(informeAMostrar.datosCatastrales?.fondo);

  const basicInfoValues = getBasicInfoValues(
    isBasicSearch,
    esInformeCompuesto,
    informeCompuesto,
    informeAMostrar,
    frente,
    fondo,
    calculatedValues,
    capacityBreakdown,
    plusvaliaBreakdown
  );

  const parametros = getParametrosNormativos(informeAMostrar);

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {esInformeCompuesto ? 'DATOS CONSOLIDADOS DE PARCELAS' : 'DATOS DE LA PARCELA'}
      </div>

      <div className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        INFORMACIÓN BÁSICA
      </div>

      {renderDirecciones()}

      <div className="w-full mb-8">
        <div className={PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} style={parentTableStyle}>
          INFORMACIÓN BÁSICA
        </div>

        <GridTableHeader columns={basicInfoColumns} gridClass={PARCEL_DATA_CONFIG.GRID_COLS_5} />

        <GridTableRow values={basicInfoValues} gridClass={PARCEL_DATA_CONFIG.GRID_COLS_5} />
      </div>

      {/* Tabla de parámetros normativos disponibles */}
      <div className="w-full mt-8">
        <DataTable title="PARÁMETROS NORMATIVOS DISPONIBLES">
          <div className="p-2">
            <div className={PARCEL_DATA_CONFIG.GRID_COLS_2}>
              <TableRow label="APH" value={parametros.esAPHFinal ? 'Sí' : 'No'} />
              <TableRow label="APH Lindero" value={parametros.aphLindero ? 'Sí' : 'No'} />
              <TableRow label="Manzana Típica" value={parametros.manzanaTipica} />
              <TableRow label="Riesgo Hídrico" value={parametros.riesgoHidrico ? 'Sí' : 'No'} />
              <TableRow label="LEP" value={parametros.lep ? 'Sí' : 'No'} />
              <TableRow label="Ensanche" value={parametros.ensanche ? 'Sí' : 'No'} />
              <TableRow label="Apertura de Calle" value={parametros.apertura ? 'Sí' : 'No'} />
              <TableRow label="Banda Mínima" value={parametros.bandaMinima ? 'Sí' : 'No'} />
              <TableRow label="Rivolta" value={parametros.rivolta ? 'Sí' : 'No'} />
              <TableRow
                label="Tronera Irregular"
                value={parametros.troneraIrregular ? 'Sí' : 'No'}
              />
              <TableRow label="Zona Especial" value={parametros.zonaEspecialDisplay} />
              <TableRow label="Enrase" value={parametros.enrase ? 'Sí' : 'No'} />
              <TableRow label="Mixtura de Uso" value={parametros.mixturaUsoDisplay} />
              <TableRow label="% Afección LFI/LBI" value={parametros.lfiAfeccionPercent} />
            </div>
          </div>
        </DataTable>
      </div>

      {pageCounter > 0 && <div className="text-right text-sm mt-8">{pageCounter}</div>}
    </div>
  );
};

const DirectionsSection: React.FC<DirectionsSectionProps> = ({ direcciones }) => (
  <div className="mb-4 p-2 border bg-orange-50">
    <div className="font-semibold mb-2">Direcciones incluidas en este informe:</div>
    <ul className="list-disc pl-5">
      {direcciones.map((dir, index) => (
        <li key={index}>{dir}</li>
      ))}
    </ul>
  </div>
);

export default BasicInformation;
