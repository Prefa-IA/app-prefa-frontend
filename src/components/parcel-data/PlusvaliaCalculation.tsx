import React from 'react';

import useTablePersonalization from '../../hooks/use-table-personalization';
import {
  CalculoA1TableProps,
  CalculoA2TableProps,
  CapacidadConstructivaTableProps,
  PlusvaliaFinalTableProps,
} from '../../types/components';
import { PARCEL_DATA_CONFIG, PlusvaliaCalculationProps } from '../../types/enums';

import DataTable, { TableRow } from './DataTable';
import PageNumber from './PageNumber';

const PlusvaliaCalculation: React.FC<PlusvaliaCalculationProps> = ({
  informe,
  informeCompuesto,
  esInformeCompuesto = false,
  calculatedValues,
  pageCounter,
  plusvaliaRef,
}) => {
  const { parentTableStyle } = useTablePersonalization();

  return (
    <div ref={plusvaliaRef} className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-4`} style={parentTableStyle}>
        CÁLCULO DETALLADO DE PLUSVALÍA / DDHUS
      </div>

      <div className={PARCEL_DATA_CONFIG.GRID_COLS_3}>
        <CapacidadConstructivaTable
          informe={informe}
          calculatedValues={calculatedValues}
          {...(informeCompuesto?.informeConsolidado && {
            informeCompuesto: informeCompuesto.informeConsolidado,
          })}
          esInformeCompuesto={esInformeCompuesto}
        />

        <CalculoA1Table informe={informe} calculatedValues={calculatedValues} />

        <CalculoA2Table informe={informe} calculatedValues={calculatedValues} />
      </div>

      <div className="mt-4">
        <TableRow
          label="TOTAL CAPACIDAD CONSTRUCTIVA"
          value={`${Number(calculatedValues['totalCapConstructiva'] ?? 0).toFixed(2)} m²`}
        />
        <TableRow
          label="TOTAL SUPERFICIE VENDIBLE"
          value={`${(Number(calculatedValues['totalCapConstructiva'] ?? 0) * 0.8).toFixed(2)} m²`}
        />
      </div>
      <PlusvaliaFinalTable calculatedValues={calculatedValues} />

      <PageNumber pageNumber={pageCounter} />
    </div>
  );
};

const CapacidadConstructivaTable: React.FC<CapacidadConstructivaTableProps> = ({
  informe: _informe,
  calculatedValues,
  informeCompuesto: _informeCompuesto,
  esInformeCompuesto: _esInformeCompuesto,
}) => {
  return (
    <DataTable title="CÁLCULO DE CAPACIDAD CONSTRUCTIVA">
      <div className="p-2">
        <div className="space-y-2">
          <TableRow
            label="Altura Máxima"
            value={`${(calculatedValues['alturaMax'] as number) || 0} m`}
          />

          <TableRow
            label="Tipo de Edificación"
            value={(calculatedValues['tipoEdificacion'] as string | undefined) || 'N/A'}
          />

          <TableRow
            label="Total de Pisos"
            value={
              (calculatedValues['totalPisosFormatted'] as string | undefined) ||
              (calculatedValues['totalPisos'] as number | undefined)?.toString() ||
              'N/A'
            }
          />

          <TableRow
            label="Área Plantas Típicas"
            value={`${((calculatedValues['areaPlantasTipicas'] as number) || 0).toFixed(2)} m²`}
          />

          <TableRow
            label="Área Primer Retiro"
            value={`${((calculatedValues['areaPrimerRetiro'] as number) || 0).toFixed(2)} m²`}
          />

          {calculatedValues['areaSegundoRetiro'] ? (
            <TableRow
              label="Área Segundo Retiro"
              value={`${((calculatedValues['areaSegundoRetiro'] as number) || 0).toFixed(2)} m²`}
            />
          ) : null}
        </div>
      </div>
    </DataTable>
  );
};

const CalculoA1Table: React.FC<CalculoA1TableProps> = ({ informe: _informe, calculatedValues }) => (
  <DataTable title="CÁLCULO DE A1">
    <div className="p-2">
      <div className="space-y-2">
        <TableRow
          label="Superficie de la Parcela"
          value={`${(calculatedValues['superficieParcela'] as number) || 0} m²`}
        />

        <TableRow
          label="FOT"
          value={(calculatedValues['fotMedanera'] as number | undefined)?.toString() || 'N/A'}
        />

        <div className="border-t pt-2 mt-2">
          <TableRow
            label="A1 = Superficie × FOT"
            value={`${((calculatedValues['a1'] as number) || 0).toFixed(2)} m²`}
          />
        </div>
      </div>
    </div>
  </DataTable>
);

const CalculoA2Table: React.FC<CalculoA2TableProps> = ({ informe: _informe, calculatedValues }) => (
  <DataTable title="CÁLCULO DE A2">
    <div className="p-2">
      <div className="space-y-2">
        <TableRow
          label="Capacidad Constructiva Total"
          value={`${((calculatedValues['totalCapConstructiva'] as number) || 0).toFixed(2)} m²`}
        />

        <TableRow label="A1" value={`${((calculatedValues['a1'] as number) || 0).toFixed(2)} m²`} />

        <div className="border-t pt-2 mt-2">
          <TableRow
            label="A2 = Cap. Constructiva - A1"
            value={`${((calculatedValues['a2'] as number) || 0).toFixed(2)} m²`}
          />
        </div>
      </div>
    </div>
  </DataTable>
);

const PlusvaliaFinalTable: React.FC<PlusvaliaFinalTableProps> = ({ calculatedValues }) => (
  <div className="mt-6">
    <DataTable title="CÁLCULO DE PLUSVALÍA">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <TableRow
              label="A = A1 + A2"
              value={`${((calculatedValues['a'] as number) || 0).toFixed(2)} m²`}
            />
          </div>
          <div>
            <TableRow
              label="B (Valor Incidencia Suelo)"
              value={`$${((calculatedValues['b'] as number) || 0).toLocaleString('es-AR')}`}
            />
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <TableRow
              label="A × B"
              value={`$${((calculatedValues['axb'] as number) || 0).toLocaleString('es-AR')}`}
            />
            <TableRow
              label="Alícuota"
              value={`${(calculatedValues['alicuota'] as number | undefined) || 0}%`}
            />
          </div>
        </div>

        <div className="mt-4 border-t pt-4 bg-blue-50 dark:bg-blue-900/30 p-3 rounded border-gray-300 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-bold dark:text-gray-200">PLUSVALÍA TOTAL ESTIMADA</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              ${((calculatedValues['plusvaliaFinal'] as number) || 0).toLocaleString('es-AR')}
            </div>
          </div>
        </div>
      </div>
    </DataTable>
  </div>
);

export default PlusvaliaCalculation;
