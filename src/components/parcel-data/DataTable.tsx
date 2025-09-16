import React from 'react';
import { DataTableProps, TableRowProps, PARCEL_DATA_CONFIG } from '../../types/enums';
import useTablePersonalization from '../../hooks/useTablePersonalization';

interface ExtraProps {
  useParentHeader?: boolean;
  bodyClassName?: string;
}

const DataTable: React.FC<DataTableProps & ExtraProps> = ({ 
  title, 
  children, 
  className, 
  useParentHeader = false,
  bodyClassName
}) => {
  const { tableStyles, childTableStyle, parentTableStyle } = useTablePersonalization();
  const headerStyle = useParentHeader ? parentTableStyle : childTableStyle;

  return (
    <div className={`${PARCEL_DATA_CONFIG.TABLE_CONTAINER_CLASS} ${className}`} style={tableStyles}>
      <div 
        className="text-center p-3 font-bold rounded-t-lg"
        style={headerStyle}
      >
        {title}
      </div>
      <div className={`rounded-b-lg bg-white ${bodyClassName ?? 'overflow-hidden'}`}>
        {children}
      </div>
    </div>
  );
};

const TableRow: React.FC<TableRowProps> = ({ label, value, isAlternate = false }) => {
  const { colores } = useTablePersonalization();

  const hoverStyle = {
    '--hover-bg': '#00000010'
  } as React.CSSProperties;

  return (
    <div 
      className={`grid grid-cols-2 text-sm hover:bg-opacity-10 transition-colors duration-200 ${isAlternate ? 'bg-gray-25' : ''}`}
      style={hoverStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#00000010';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isAlternate ? '#f9f9f9' : 'transparent';
      }}
    >
      <div 
        className="border-b border-r p-3 font-semibold bg-gray-50 text-gray-800"
      >
        {label}
      </div>
      <div 
        className="border-b p-3 text-gray-700"
      >
        {value}
      </div>
    </div>
  );
};



interface GridTableHeaderProps {
  columns: string[];
  gridClass: string;
}

const GridTableHeader: React.FC<GridTableHeaderProps> = ({ columns, gridClass }) => {
  const { colores } = useTablePersonalization();

  const headerStyle = {
    backgroundColor: colores.fondoEncabezadosSecundarios,
    color: colores.colorTextoTablasSecundarias
  };

  return (
    <div className={gridClass} style={headerStyle}>
      {columns.map((column, index) => (
        <div
          key={index}
          className={`p-3 font-semibold text-center ${index < columns.length - 1 ? 'border-r' : ''}`}
        >
          {column}
        </div>
      ))}
    </div>
  );
};

interface GridTableRowProps {
  values: (string | number | React.ReactNode)[];
  gridClass: string;
}

const GridTableRow: React.FC<GridTableRowProps> = ({ values, gridClass }) => {
  const { colores } = useTablePersonalization();

  return (
    <div 
      className={`${gridClass} hover:bg-opacity-10 transition-colors duration-200`}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#00000010';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {values.map((value, index) => (
        <div
          key={index}
          className={`p-3 text-gray-700 ${index < values.length - 1 ? 'border-r' : ''}`}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default DataTable;
export { DataTable, TableRow, GridTableHeader, GridTableRow }; 