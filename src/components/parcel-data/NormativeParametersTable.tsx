import React from 'react';

import { PARCEL_DATA_CONFIG } from '../../types/enums';

import DataTable, { TableRow } from './DataTable';

interface NormativeParametersTableProps {
  parametros: {
    esAPHFinal: boolean;
    aphLindero: boolean | undefined;
    manzanaTipica: string;
    riesgoHidrico: boolean | undefined;
    lep: boolean | undefined;
    ensanche: boolean | undefined;
    apertura: boolean | undefined;
    bandaMinima: boolean;
    rivolta: boolean | undefined;
    troneraIrregular: boolean | undefined;
    zonaEspecialDisplay: string;
    enrase: boolean | undefined;
    mixturaUsoDisplay: string;
    lfiAfeccionPercent: string;
  };
}

const NormativeParametersTable: React.FC<NormativeParametersTableProps> = ({ parametros }) => (
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
          <TableRow label="Tronera Irregular" value={parametros.troneraIrregular ? 'Sí' : 'No'} />
          <TableRow label="Zona Especial" value={parametros.zonaEspecialDisplay} />
          <TableRow label="Enrase" value={parametros.enrase ? 'Sí' : 'No'} />
          <TableRow label="Mixtura de Uso" value={parametros.mixturaUsoDisplay} />
          <TableRow label="% Afección LFI/LBI" value={parametros.lfiAfeccionPercent} />
        </div>
      </div>
    </DataTable>
  </div>
);

export default NormativeParametersTable;
