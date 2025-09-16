import React from 'react';
import { BasicInformationProps, PARCEL_DATA_CONFIG } from '../../types/enums';
import DataTable, { GridTableHeader, GridTableRow, TableRow } from './DataTable';
import useTablePersonalization from '../../hooks/useTablePersonalization';
import { calculateAllValues } from '../../utils/parcelCalculations';

const BasicInformation: React.FC<BasicInformationProps> = ({ 
  informe, 
  informeCompuesto, 
  esInformeCompuesto,
  calculatedValues,
  pageCounter 
}) => {
  const informeAMostrar = esInformeCompuesto && informeCompuesto 
    ? informeCompuesto.informeConsolidado
    : informe;

  const { parentTableStyle } = useTablePersonalization();

  const renderDirecciones = () => {
    if (esInformeCompuesto && informeCompuesto) {
      return (
        <DirectionsSection direcciones={informeCompuesto.direcciones} />
      );
    }
    return null;
  };

  // Métricas pre-calculadas (capacidad, plusvalía) provistas por cálculo detallado
  const metrics = (informeAMostrar as any)?.edificabilidad?.metrics || {};

  const basicInfoColumns = ['Dirección', 'Barrio', 'Nomenclador', 'Capacidad Constructiva Máx.', 'Plusvalía (estimada)'];
  
  // Construir valores individuales para desglose si es compuesto
  let capacityBreakdown = '';
  let plusvaliaBreakdown = '';

  if (esInformeCompuesto && informeCompuesto) {
    const individuales = informeCompuesto.informesIndividuales;
    const caps: string[] = [];
    const plusVals: string[] = [];

    individuales.forEach((inf) => {
      const vals = calculateAllValues(inf, {});
      caps.push(vals.totalCapConstructiva.toFixed(2));
      plusVals.push(vals.plusvaliaFinal.toLocaleString('es-AR'));
    });

    if (caps.length > 0) capacityBreakdown = ` (${caps.join(' + ')})`;
    if (plusVals.length > 0) plusvaliaBreakdown = ` ($${plusVals.join(' + $')})`;
  }

  const basicInfoValues = [
    esInformeCompuesto && informeCompuesto 
      ? informeCompuesto.direcciones.join(', ') 
      : (informeAMostrar.direccionesNormalizadas?.[0]?.direccion || 'N/A'),
    informeAMostrar.datosUtiles?.barrio || 'N/A',
    esInformeCompuesto && informeCompuesto
      ? informeCompuesto.informesIndividuales.map(i=>i.datosCatastrales?.smp||'').join(', ')
      : informeAMostrar.datosCatastrales?.smp || 'N/A',
    <div className="text-center">
      {calculatedValues?.totalCapConstructiva
        ? `${calculatedValues.totalCapConstructiva.toFixed(2)} m²${capacityBreakdown}`
        : metrics.superficie_edificable_maxima_m2
          ? `${metrics.superficie_edificable_maxima_m2.toFixed(2)} m²${capacityBreakdown}`
          : 'N/A'}
    </div>,
    <div className="text-center">
      {calculatedValues?.plusvaliaFinal
        ? `$${calculatedValues.plusvaliaFinal.toLocaleString('es-AR')}${plusvaliaBreakdown}`
        : metrics.plusvalia_total_estimada
          ? `$${metrics.plusvalia_total_estimada.toLocaleString('es-AR')}${plusvaliaBreakdown}`
          : 'N/A'}
    </div>
  ];

  /********************
   * PARÁMETROS NORMATIVOS
   ********************/
  // APH propio
  const esAPH = (informeAMostrar as any)?.shp_assets_info?.aph?.contexto?.protegido ||
                !!(informeAMostrar.edificabilidad?.catalogacion?.proteccion);

  // APH Lindero
  const aphLindero = informeAMostrar.edificabilidad?.parcelas_linderas?.aph_linderas;

  // Manzana típica
  const manzanaTipica = informeAMostrar.edificabilidad?.tipica || 'N/A';

  // Riesgo hídrico
  const riesgoHidrico = informeAMostrar.edificabilidad?.afectaciones?.riesgo_hidrico;

  // LEP / Ensanche y Apertura
  const lep = informeAMostrar.edificabilidad?.afectaciones?.lep;
  const ensanche = informeAMostrar.edificabilidad?.afectaciones?.ensanche;
  const apertura = informeAMostrar.edificabilidad?.afectaciones?.apertura;

  // Banda mínima edificable (flag si hay features)
  const bandaMinima = (informeAMostrar as any)?.shp_assets_info?.banda_minima?.features > 0;

  // Rivolta
  const rivolta = informeAMostrar.edificabilidad?.rivolta;

  // Tronera irregular (consolidado invadiendo LFI)
  const troneraIrregular = informeAMostrar.edificabilidad?.irregular;

  // Zona especial (primer distrito específico no vacío)
  const zonaEspecial = (informeAMostrar.edificabilidad?.distrito_especial as any)?.find((d: any) => d.distrito_especifico)?.distrito_especifico || 'N/A';

  // Enrase
  const enrase = (informeAMostrar.edificabilidad as any)?.enrase;

  // Mixtura de uso (primer valor)
  const mixturaUso = (informeAMostrar.edificabilidad as any)?.mixtura_uso;

  // Cinturón Digital ya no se muestra

  // Afección LFI (si existe porcentaje)
  const lfiAfeccionPercent = (informeAMostrar.edificabilidad as any)?.lfi_afeccion_percent;

  // Recalcular APH incluyendo flag extra
  const aphExtra = (informeAMostrar.edificabilidad as any)?.aph_extra;
  const esAPHFinal = esAPH || aphExtra;

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className="text-2xl font-bold mb-2">
        {esInformeCompuesto ? 'DATOS CONSOLIDADOS DE PARCELAS' : 'DATOS DE LA PARCELA'}
      </div>
      
      <div className="text-xl font-semibold mb-6">INFORMACIÓN BÁSICA</div>

      {renderDirecciones()}

      <div className="w-full mb-8">
        <div 
          className={PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS}
          style={parentTableStyle}
        >
          INFORMACIÓN BÁSICA
        </div>
        
        <GridTableHeader 
          columns={basicInfoColumns} 
          gridClass={PARCEL_DATA_CONFIG.GRID_COLS_5}
        />
        
        <GridTableRow 
          values={basicInfoValues}
          gridClass={PARCEL_DATA_CONFIG.GRID_COLS_5}
        />
      </div>

      {/* Tabla de parámetros normativos disponibles */}
      <div className="w-full mt-8">
        <DataTable title="PARÁMETROS NORMATIVOS DISPONIBLES">
          <div className="p-2">
            <div className={PARCEL_DATA_CONFIG.GRID_COLS_2}>
              <TableRow label="APH" value={esAPHFinal ? 'Sí' : 'No'} />
              <TableRow label="APH Lindero" value={aphLindero ? 'Sí' : 'No'} />
              <TableRow label="Manzana Típica" value={manzanaTipica} />
              <TableRow label="Riesgo Hídrico" value={riesgoHidrico ? 'Sí' : 'No'} />
              <TableRow label="LEP" value={lep ? 'Sí' : 'No'} />
              <TableRow label="Ensanche" value={ensanche ? 'Sí' : 'No'} />
              <TableRow label="Apertura de Calle" value={apertura ? 'Sí' : 'No'} />
              <TableRow label="Banda Mínima" value={bandaMinima ? 'Sí' : 'No'} />
              <TableRow label="Rivolta" value={rivolta ? 'Sí' : 'No'} />
              <TableRow label="Tronera Irregular" value={troneraIrregular ? 'Sí' : 'No'} />
              <TableRow label="Zona Especial" value={zonaEspecial || 'N/A'} />
              <TableRow label="Enrase" value={enrase ? 'Sí' : 'No'} />
              <TableRow label="Mixtura de Uso" value={mixturaUso !== null && mixturaUso !== undefined ? mixturaUso : 'N/A'} />
              <TableRow label="% Afección LFI/LBI" value={lfiAfeccionPercent !== undefined ? `${lfiAfeccionPercent}%` : 'N/A'} />
            </div>
          </div>
        </DataTable>
      </div>

      {pageCounter > 0 && (
        <div className="text-right text-sm mt-8">{pageCounter}</div>
      )}
    </div>
  );
};

const DirectionsSection: React.FC<{ direcciones: string[] }> = ({ direcciones }) => (
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