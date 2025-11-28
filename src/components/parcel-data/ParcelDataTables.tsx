import React from 'react';

import useTablePersonalization from '../../hooks/use-table-personalization';
import { Informe, PARCEL_DATA_CONFIG, ParcelDataTablesProps } from '../../types/enums';
import { calculateAllValues } from '../../utils/parcel-calculations';

import DataTable, { TableRow } from './DataTable';
import OptimizationsTable from './OptimizationsTable';
import { calculateDisplayValues } from './ParcelDataDisplayCalculations';

type CalculatedValues = ReturnType<typeof calculateAllValues>;

const ParcelDataTables: React.FC<ParcelDataTablesProps & { pageCounter?: number }> = ({
  informe,
  informeCompuesto,
  esInformeCompuesto = false,
  calculatedValues,
  pageCounter,
}) => {
  const informeAMostrar = informe;
  const { parentTableStyle } = useTablePersonalization();

  const breakdown = calculateDisplayValues({
    informe,
    informeCompuesto,
    esInformeCompuesto,
    calculatedValues,
  });

  return (
    <>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-4`} style={parentTableStyle}>
        SEGÚN CÓDIGO URBANÍSTICO
      </div>

      <div className={PARCEL_DATA_CONFIG.GRID_COLS_3}>
        <TerrainDataTable
          informe={informeAMostrar}
          calculatedValues={calculatedValues as CalculatedValues}
          breakdown={breakdown}
        />

        <ZoningDataTable
          informe={informeAMostrar}
          calculatedValues={calculatedValues as CalculatedValues}
        />

        <BuildabilityDataTable
          informe={informeAMostrar}
          calculatedValues={calculatedValues as CalculatedValues}
        />
      </div>

      <RestrictionsTable informe={informeAMostrar} />

      <OptimizationsTable informe={informeAMostrar} />

      <PlusvaliaParametersTable
        informe={informeAMostrar}
        calculatedValues={calculatedValues as CalculatedValues}
      />

      {pageCounter && (
        <div className="mt-4 border rounded w-fit px-3 py-1 text-dark dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 ml-auto">
          {pageCounter}
        </div>
      )}

      <ObservationsSection informe={informeAMostrar} />
    </>
  );
};

const TerrainDataTable: React.FC<{
  informe: Informe;
  calculatedValues: CalculatedValues;
  breakdown: {
    superficieTerrenoDisplay: string;
    superficieCubiertaDisplay: string;
    frenteDisplay: string;
  };
}> = ({ informe, calculatedValues: _calculatedValues, breakdown }) => (
  <DataTable title="DATOS DEL TERRENO">
    <div className="p-2">
      <TableRow label="Superficie" value={breakdown.superficieTerrenoDisplay} />

      <TableRow label="Superficie Cubierta" value={breakdown.superficieCubiertaDisplay} />

      <TableRow label="Frente" value={breakdown.frenteDisplay} />

      <TableRow
        label="Fondo"
        value={
          informe.datosCatastrales?.fondo
            ? `${parseFloat(informe.datosCatastrales.fondo).toFixed(2)} m`
            : 'N/A'
        }
      />

      <TableRow
        label="Ochava"
        value={(informe.datosCatastrales?.['ochava'] as string | undefined) || 'N/A'}
      />
    </div>
  </DataTable>
);

const ZoningDataTable: React.FC<{
  informe: Informe;
  calculatedValues: CalculatedValues;
}> = ({ informe, calculatedValues: _calculatedValues }) => {
  const distritoCPU = informe.edificabilidad?.plusvalia?.distrito_cpu;
  const catalogacion =
    informe.edificabilidad?.catalogacion?.catalogacion ||
    informe.edificabilidad?.catalogacion?.denominacion ||
    null;
  const troneras = informe.edificabilidad?.troneras;

  return (
    <DataTable title="DATOS DE LA ZONIFICACIÓN">
      <div className="p-2">
        <TableRow label="Zonificación según CU" value={distritoCPU || 'N/A'} />

        <TableRow
          label="Troneras"
          value={
            troneras && troneras.cantidad > 0
              ? `${troneras.cantidad}${troneras.area_total ? ` (${troneras.area_total.toFixed(2)} m²)` : ''}`
              : 'N/A'
          }
        />

        <TableRow label="Catalogación" value={catalogacion || 'N/A'} />
      </div>
    </DataTable>
  );
};

const BuildabilityDataTable: React.FC<{
  informe: Informe;
  calculatedValues: CalculatedValues;
}> = ({ informe, calculatedValues }) => {
  const alturaMax =
    (calculatedValues.alturaMax ?? 0) > 0
      ? (calculatedValues.alturaMax ?? 0)
      : informe.edificabilidad?.altura_max?.[0] || 0;
  const unidadEdificabilidad = informe.edificabilidad?.unidad_edificabilidad?.[0] || 0;

  return (
    <DataTable title="DATOS DE EDIFICABILIDAD">
      <div className="p-2">
        <TableRow label="Altura Máxima" value={alturaMax > 0 ? `${alturaMax} m` : 'N/A'} />

        <TableRow
          label="Tipo de Edificación"
          value={(calculatedValues.tipoEdificacion as string | undefined) || 'N/A'}
        />

        <TableRow
          label="Unidad de Edificabilidad"
          value={unidadEdificabilidad > 0 ? unidadEdificabilidad.toString() : 'N/A'}
        />
      </div>
    </DataTable>
  );
};

const RestrictionsTable: React.FC<{
  informe: Informe;
}> = ({ informe }) => {
  const afectaciones = informe.edificabilidad?.afectaciones;
  const hasAfectaciones =
    afectaciones &&
    Object.values(afectaciones).some((value) => typeof value === 'number' && value > 0);

  if (!hasAfectaciones) return null;

  return (
    <div className="mt-6">
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-4`}>RESTRICCIONES</div>

      <DataTable title="AFECTACIONES">
        <div className="p-2">
          <div className={PARCEL_DATA_CONFIG.GRID_COLS_2}>
            <TableRow label="Apertura" value={afectaciones.apertura || 'N/A'} />
            <TableRow label="CI Digital" value={afectaciones.ci_digital || 'N/A'} />
            <TableRow label="Ensanche" value={afectaciones.ensanche || 'N/A'} />
            <TableRow label="LEP" value={afectaciones.lep || 'N/A'} />
            <TableRow label="Riesgo Hídrico" value={afectaciones.riesgo_hidrico || 'N/A'} />
          </div>
        </div>
      </DataTable>
    </div>
  );
};

const PlusvaliaParametersTable: React.FC<{
  informe: Informe;
  calculatedValues: CalculatedValues;
}> = ({ informe, calculatedValues }) => {
  const plusvalia = informe.edificabilidad?.plusvalia;
  if (!plusvalia) return null;

  return (
    <div className="mt-6">
      <DataTable title="PARA CÁLCULO DE PLUSVALÍA">
        <div className="p-2">
          <div className={PARCEL_DATA_CONFIG.GRID_COLS_2}>
            <TableRow
              label="Alícuota"
              value={
                calculatedValues.alicuota
                  ? `${calculatedValues.alicuota}%`
                  : plusvalia.alicuota
                    ? `${plusvalia.alicuota}%`
                    : 'N/A'
              }
            />
            <TableRow label="Incidencia UVA" value={plusvalia.incidencia_uva || 'N/A'} />
          </div>
        </div>
      </DataTable>
    </div>
  );
};

const ObservationsSection: React.FC<{ informe: Informe }> = ({ informe }) => (
  <div className="mt-6">
    <div className="font-semibold mb-2 dark:text-gray-200">Observaciones:</div>
    <ol className="pl-6 list-decimal text-sm space-y-2 dark:text-gray-300">
      <li>
        Para cálculo del FOT se deben computar todas las superficies al 100%, excepto en el cálculo
        las superficies comunes, que dependen del proyecto. También se deben sumar las superficies
        de balcones y los subsuelos.
      </li>
      <li>
        {informe.datosCatastrales?.frente && parseFloat(informe.datosCatastrales.frente) > 10
          ? 'Por poseer más de 10m de ancho libre deben contemplarse estacionamientos de uso transitorio para bicicletas según módulos de bicicletas de acuerdo al cuadro de usos 3.3'
          : 'No se requieren estacionamientos adicionales de bicicletas debido al ancho de frente.'}
      </li>
      <li>
        Los valores de altura máxima incluyen los retiros correspondientes según la normativa
        vigente.
      </li>
      <li>
        Las superficies edificables están sujetas a las restricciones y afectaciones indicadas en el
        presente informe.
      </li>
    </ol>

    {informe.edificabilidad?.memo && (
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-600">
        <div className="font-semibold text-blue-800 dark:text-blue-300">Memo técnico:</div>
        <div className="text-sm text-blue-700 dark:text-blue-400 mt-1">
          {informe.edificabilidad.memo}
        </div>
      </div>
    )}
  </div>
);

export default ParcelDataTables;
