import { useAuth } from '../contexts/AuthContext';

export const useTablePersonalization = () => {
  const { usuario } = useAuth();

  const personalizacion = usuario?.personalizacion || {};
  const colores = {
    fondoEncabezadosPrincipales: personalizacion.fondoEncabezadosPrincipales || '#3B82F6',
    colorTextoTablasPrincipales: personalizacion.colorTextoTablasPrincipales || '#FFFFFF',
    fondoEncabezadosSecundarios: personalizacion.fondoEncabezadosSecundarios || '#6B7280',
    colorTextoTablasSecundarias: personalizacion.colorTextoTablasSecundarias || '#FFFFFF',
  };

  // Genera un color más claro para backgrounds
  const lightenColor = (color: string, opacity: number = 0.1): string => {
    // Si el color ya incluye alpha, usar tal como está
    if (color.includes('rgba')) return color;

    // Para colores hex, añadir transparencia
    if (color.startsWith('#')) {
      const alpha = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0');
      return color + alpha;
    }

    // Para otros formatos, envolver en rgba
    return `rgba(${color}, ${opacity})`;
  };

  const getTableStyles = () => {
    return {
      '--color-primary': colores.fondoEncabezadosPrincipales,
      '--color-primary-text': colores.colorTextoTablasPrincipales,
      '--color-secondary': colores.fondoEncabezadosSecundarios,
      '--color-secondary-text': colores.colorTextoTablasSecundarias,
      '--color-primary-light': lightenColor(colores.fondoEncabezadosPrincipales, 0.1),
      '--color-secondary-light': lightenColor(colores.fondoEncabezadosSecundarios, 0.1),
    } as React.CSSProperties;
  };

  // Estilos para tablas PADRE (separadoras de índice) - Encabezados principales
  const getParentTableStyle = () => {
    return {
      backgroundColor: colores.fondoEncabezadosPrincipales,
      color: colores.colorTextoTablasPrincipales,
    };
  };

  // Estilos para tablas HIJAS - Encabezados secundarios
  const getChildTableStyle = () => {
    return {
      backgroundColor: colores.fondoEncabezadosSecundarios,
      color: colores.colorTextoTablasSecundarias,
    };
  };

  // Estilos para bordes y divisores - Sin color de acento
  const getBorderStyle = () => {
    return {
      // Sin borderColor personalizado
    };
  };

  const getTableClasses = () => {
    return {
      TABLE_HEADER_CLASS: 'text-center p-3 font-bold',
      TABLE_BORDER_CLASS: 'rounded-lg overflow-hidden bg-white',
      TABLE_CONTAINER_CLASS: 'mb-6 bg-white rounded-lg',
      TABLE_ROW_CLASS: 'hover:opacity-90 transition-colors duration-200',
      TABLE_CELL_LABEL: 'border-b border-r p-3 font-semibold bg-gray-50 text-gray-800',
      TABLE_CELL_VALUE: 'border-b p-3 text-gray-700',
      // Clases adicionales para aplicar estilos personalizados
      HEADER_PERSONALIZED: 'text-white',
      BORDER_PERSONALIZED: '',
      HOVER_PERSONALIZED: '',
    };
  };

  return {
    tableStyles: getTableStyles(),
    tableClasses: getTableClasses(),
    parentTableStyle: getParentTableStyle(),
    childTableStyle: getChildTableStyle(),
    borderStyle: getBorderStyle(),
    colores,
  };
};

export default useTablePersonalization;
