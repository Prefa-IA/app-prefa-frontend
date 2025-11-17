import React from 'react';

import useTablePersonalization from '../../hooks/use-table-personalization';
import {
  DataTableExtraProps,
  GridTableHeaderProps,
  GridTableRowProps,
} from '../../types/components';
import { DataTableProps, PARCEL_DATA_CONFIG, TableRowProps } from '../../types/enums';

const DataTable: React.FC<DataTableProps & DataTableExtraProps> = ({
  title,
  children,
  className,
  useParentHeader = false,
  bodyClassName,
}) => {
  const { tableStyles, childTableStyle, parentTableStyle } = useTablePersonalization();
  const headerStyle = useParentHeader ? parentTableStyle : childTableStyle;

  return (
    <div className={`${PARCEL_DATA_CONFIG.TABLE_CONTAINER_CLASS} ${className}`} style={tableStyles}>
      <div className="text-center p-3 font-bold rounded-t-lg" style={headerStyle}>
        {title}
      </div>
      <div
        className={`rounded-b-lg bg-white dark:bg-gray-800 ${bodyClassName ?? 'overflow-hidden'}`}
      >
        {children}
      </div>
    </div>
  );
};

const TableRow: React.FC<TableRowProps> = ({ label, value, isAlternate = false }) => {
  const hoverStyle = {
    '--hover-bg': '#00000010',
  } as React.CSSProperties;

  return (
    <div
      className={`grid grid-cols-2 text-sm hover:bg-opacity-10 transition-colors duration-200 dark:hover:bg-gray-700 ${isAlternate ? 'bg-gray-25' : ''}`}
      style={hoverStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isAlternate ? '#f9f9f9' : 'transparent';
      }}
    >
      <div className="border-b border-r border-gray-200 dark:border-gray-700 p-3 font-semibold bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
        {label}
      </div>
      <div className="border-b border-gray-200 dark:border-gray-700 p-3 text-gray-700 dark:text-gray-300">
        {value}
      </div>
    </div>
  );
};

const GridTableHeader: React.FC<GridTableHeaderProps> = ({ columns, gridClass }) => {
  const { colores } = useTablePersonalization();

  const headerStyle = {
    backgroundColor: colores.fondoEncabezadosSecundarios,
    color: colores.colorTextoTablasSecundarias,
  };

  return (
    <div className={gridClass} style={headerStyle}>
      {columns.map((column, index) => (
        <div
          key={index}
          className={`p-3 font-semibold text-center border-gray-200 dark:border-gray-700 ${index < columns.length - 1 ? 'border-r' : ''}`}
        >
          {column}
        </div>
      ))}
    </div>
  );
};

const GridTableRow: React.FC<GridTableRowProps> = ({ values, gridClass }) => {
  return (
    <div
      className={`${gridClass} hover:bg-opacity-10 transition-colors duration-200 dark:hover:bg-gray-700`}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {values.map((value, index) => (
        <div
          key={index}
          className={`p-3 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 ${index < values.length - 1 ? 'border-r' : ''}`}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default DataTable;
export { DataTable, GridTableHeader, GridTableRow, TableRow };
