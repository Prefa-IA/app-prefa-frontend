import React from 'react';
import { PlusvaliaCalculationProps, PARCEL_DATA_CONFIG } from '../../types/enums';
import DataTable, { TableRow } from './DataTable';
import useTablePersonalization from '../../hooks/useTablePersonalization';
import PageNumber from './PageNumber';

const PlusvaliaCalculation: React.FC<PlusvaliaCalculationProps> = ({ 
  informe, 
  informeCompuesto,
  esInformeCompuesto = false,
  calculatedValues,
  pageCounter 
}) => {
  const { parentTableStyle } = useTablePersonalization();

  return (
    <div className={PARCEL_DATA_CONFIG.PAGE_BREAK_CLASS}>
      <div 
        className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-4`}
        style={parentTableStyle}
      >
        CÁLCULO DETALLADO DE PLUSVALÍA / DDHUS
      </div>

      <div className={PARCEL_DATA_CONFIG.GRID_COLS_3}>
        <CapacidadConstructivaTable 
          informe={informe}
          calculatedValues={calculatedValues}
          informeCompuesto={informeCompuesto}
          esInformeCompuesto={esInformeCompuesto}
        />

        <CalculoA1Table 
          informe={informe}
          calculatedValues={calculatedValues}
        />

        <CalculoA2Table 
          informe={informe}
          calculatedValues={calculatedValues}
        />
      </div>

      <PlusvaliaFinalTable 
        calculatedValues={calculatedValues}
      />

      <PageNumber pageNumber={pageCounter} />
    </div>
  );
};

const CapacidadConstructivaTable: React.FC<{
  informe: any;
  calculatedValues: any;
  informeCompuesto?: any;
  esInformeCompuesto?: boolean;
}> = ({ informe, calculatedValues, informeCompuesto, esInformeCompuesto }) => {
  const breakdownSuperficie = esInformeCompuesto && informeCompuesto ?
    `(${informeCompuesto.informesIndividuales.map((i: any) => i.edificabilidad?.superficie_parcela || 0).join(' + ')})` : '';

  return (
    <DataTable title="CÁLCULO DE CAPACIDAD CONSTRUCTIVA">
      <div className="p-2">
        <div className="space-y-2">
          
          <TableRow
            label="Altura Máxima"
            value={`${calculatedValues.alturaMax} m`}
          />
          
          <TableRow
            label="Tipo de Edificación"
            value={calculatedValues.tipoEdificacion}
          />
          
          <TableRow
            label="Total de Pisos"
            value={calculatedValues.totalPisos}
          />
          
          <TableRow
            label="Área Plantas Típicas"
            value={`${calculatedValues.areaPlantasTipicas.toFixed(2)} m²`}
          />
          
          <TableRow
            label="Área Primer Retiro"
            value={`${calculatedValues.areaPrimerRetiro.toFixed(2)} m²`}
          />
          
          <TableRow
            label="Área Segundo Retiro"
            value={`${calculatedValues.areaSegundoRetiro.toFixed(2)} m²`}
          />
          
          <div className="border-t pt-2 mt-2">
            <TableRow
              label="TOTAL CAPACIDAD CONSTRUCTIVA"
              value={`${calculatedValues.totalCapConstructivaOriginal?.toFixed(2)} m²`}
            />
          </div>

          {/* Nueva fila: capacidad ajustada por afección LBI/LFI */}
          {calculatedValues.lfiAfeccionPercent > 0 && (
            <div className="pt-2">
              <TableRow
                label={`TOTAL CAPACIDAD CONSTRUCTIVA - % DE AFECCION LFI/LBI (-${calculatedValues.lfiAfeccionPercent}%)`}
                value={`${calculatedValues.totalCapConstructiva.toFixed(2)} m²`}
              />
            </div>
          )}
        </div>
      </div>
    </DataTable>
  );
};

const CalculoA1Table: React.FC<{
  informe: any;
  calculatedValues: any;
}> = ({ informe, calculatedValues }) => (
  <DataTable title="CÁLCULO DE A1">
    <div className="p-2">
      <div className="space-y-2">
        <TableRow
          label="Superficie de la Parcela"
          value={`${calculatedValues.superficieParcela} m²`}
        />
        
        <TableRow
          label="FOT"
          value={calculatedValues.fotMedanera}
        />
        
        <div className="border-t pt-2 mt-2">
          <TableRow
            label="A1 = Superficie × FOT"
            value={`${calculatedValues.a1.toFixed(2)} m²`}
          />
        </div>
      </div>
    </div>
  </DataTable>
);

const CalculoA2Table: React.FC<{
  informe: any;
  calculatedValues: any;
}> = ({ informe, calculatedValues }) => (
  <DataTable title="CÁLCULO DE A2">
    <div className="p-2">
      <div className="space-y-2">
        <TableRow
          label="Capacidad Constructiva Total"
          value={`${calculatedValues.totalCapConstructiva.toFixed(2)} m²`}
        />
        
        <TableRow
          label="A1"
          value={`${calculatedValues.a1.toFixed(2)} m²`}
        />
        
        <div className="border-t pt-2 mt-2">
          <TableRow
            label="A2 = Cap. Constructiva - A1"
            value={`${calculatedValues.a2.toFixed(2)} m²`}
          />
        </div>
      </div>
    </div>
  </DataTable>
);

const PlusvaliaFinalTable: React.FC<{
  calculatedValues: any;
}> = ({ calculatedValues }) => (
  <div className="mt-6">
    <DataTable title="CÁLCULO DE PLUSVALÍA">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <TableRow
              label="A = A1 + A2"
              value={`${calculatedValues.a.toFixed(2)} m²`}
            />
          </div>
          <div>
            <TableRow
              label="B (Valor Incidencia Suelo)"
              value={`$${calculatedValues.b.toLocaleString('es-AR')}`}
            />
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <TableRow
              label="A × B"
              value={`$${calculatedValues.axb.toLocaleString('es-AR')}`}
            />
            <TableRow
              label="Alícuota"
              value={`${calculatedValues.alicuota}%`}
            />
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4 bg-blue-50 p-3 rounded">
          <div className="text-center">
            <div className="text-lg font-bold">
              PLUSVALÍA TOTAL ESTIMADA
            </div>
            <div className="text-2xl font-bold text-blue-600 mt-2">
              ${calculatedValues.plusvaliaFinal.toLocaleString('es-AR')}
            </div>
          </div>
        </div>
      </div>
    </DataTable>
  </div>
);

export default PlusvaliaCalculation; 