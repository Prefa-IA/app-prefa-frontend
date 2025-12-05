import React from 'react';

import { PARCEL_DATA_CONFIG } from '../../types/enums';

import { GridTableHeader, GridTableRow } from './DataTable';

interface BasicInfoTableProps {
  basicInfoColumns: string[];
  basicInfoValues: React.ReactNode[];
  parentTableStyle: React.CSSProperties;
}

const BasicInfoTable: React.FC<BasicInfoTableProps> = ({
  basicInfoColumns,
  basicInfoValues,
  parentTableStyle,
}) => (
  <div className="w-full mb-8">
    <div className={PARCEL_DATA_CONFIG.TABLE_HEADER_CLASS} style={parentTableStyle}>
      INFORMACIÓN BÁSICA
    </div>

    <GridTableHeader columns={basicInfoColumns} gridClass={PARCEL_DATA_CONFIG.GRID_COLS_5} />

    <GridTableRow values={basicInfoValues} gridClass={PARCEL_DATA_CONFIG.GRID_COLS_5} />
  </div>
);

export default BasicInfoTable;
