import { useMemo } from 'react';

import { Usuario } from '../types/enums';

const getFontFamily = (tipografia: string): string => {
  const fontMap: Record<string, string> = {
    Inter: 'Inter, system-ui, sans-serif',
    Roboto: 'Roboto, sans-serif',
    Montserrat: 'Montserrat, sans-serif',
    'Open Sans': 'Open Sans, sans-serif',
    Lato: 'Lato, sans-serif',
    Poppins: 'Poppins, sans-serif',
  };
  return Reflect.get(fontMap, tipografia) || 'Inter, system-ui, sans-serif';
};

export const useReportPreviewStyles = (usuario: Usuario | null) => {
  const customStyles = useMemo(() => {
    const personalizacion = usuario?.personalizacion || {};
    const colores = {
      fondoEncabezadosPrincipales: personalizacion.fondoEncabezadosPrincipales || '#3B82F6',
      colorTextoTablasPrincipales: personalizacion.colorTextoTablasPrincipales || '#FFFFFF',
      fondoEncabezadosSecundarios: personalizacion.fondoEncabezadosSecundarios || '#6B7280',
      colorTextoTablasSecundarias: personalizacion.colorTextoTablasSecundarias || '#FFFFFF',
    };
    const tipografia = personalizacion.tipografia || 'Inter';
    const fontFamily = getFontFamily(tipografia);

    return {
      fontFamily,
      '--color-primary': colores.fondoEncabezadosPrincipales,
      '--color-primary-text': colores.colorTextoTablasPrincipales,
      '--color-secondary': colores.fondoEncabezadosSecundarios,
      '--color-secondary-text': colores.colorTextoTablasSecundarias,
    } as React.CSSProperties;
  }, [usuario?.personalizacion]);

  return customStyles;
};
