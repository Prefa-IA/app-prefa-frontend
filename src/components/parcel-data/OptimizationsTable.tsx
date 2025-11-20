import React from 'react';

import { Informe, PARCEL_DATA_CONFIG } from '../../types/enums';

import DataTable, { TableRow } from './DataTable';
import { hasOptimizations } from './OptimizationsTableHelpers';

interface OptimizationsTableProps {
  informe: Informe;
}

const OptimizationsTable: React.FC<OptimizationsTableProps> = ({ informe }) => {
  if (!hasOptimizations(informe)) return null;

  return (
    <div className="mt-6">
      <div className={`${PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} mb-4`}>OPTIMIZACIONES</div>

      <DataTable title="PARÁMETROS DE OPTIMIZACIÓN">
        <div className="p-2">
          <div className={PARCEL_DATA_CONFIG.GRID_COLS_2}>
            <TableRow
              label="Completamiento de Tejido"
              value={informe.edificabilidad?.completamiento_tejido || 'N/A'}
            />
            <TableRow
              label="Manzana Atípica"
              value={informe.edificabilidad?.manzana_atipica || 'N/A'}
            />
            <TableRow
              label="Patio de Iluminación"
              value={informe.edificabilidad?.patio_iluminacion || 'N/A'}
            />
            <TableRow
              label="Profundidad Balcones"
              value={informe.edificabilidad?.profundidad_balcones || 'N/A'}
            />
            <TableRow label="Balcones" value={informe.edificabilidad?.balcones || 'N/A'} />
            <TableRow
              label="Superficie Construible"
              value={informe.edificabilidad?.sup_construible || 'N/A'}
            />
          </div>
        </div>
      </DataTable>
    </div>
  );
};

export default OptimizationsTable;
