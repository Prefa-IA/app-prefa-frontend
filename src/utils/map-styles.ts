import { LBI_LFI_CONFIG } from '../types/enums';

export const crear3DEffect = (altura: number, tipo: string = 'edificio') => {
  const alturaMax = 50;
  const alturaRelativa = Math.min(altura, alturaMax) / alturaMax;

  if (tipo === 'edificio') {
    const intensity = Math.floor(255 * (1 - alturaRelativa * 0.4));
    const greenIntensity = Math.floor(150 + 105 * alturaRelativa);
    return {
      fillColor: `rgb(16, ${greenIntensity}, ${intensity})`,
      color: '#047857',
      weight: 1 + alturaRelativa * 2,
      opacity: 0.8,
      fillOpacity: 0.3 + alturaRelativa * 0.4,
      className: 'edificio-3d',
    };
  }

  return {
    fillColor: '#10B981',
    color: '#047857',
    weight: 1,
    opacity: 0.6,
    fillOpacity: 0.25,
  };
};

export const crearAPHEffect = (proteccion: string) => {
  const baseStyle = {
    color: '#B91C1C',
    weight: 2,
    opacity: 0.9,
  };

  switch (proteccion?.toUpperCase()) {
    case 'INTEGRAL':
    case 'ESTRUCTURAL':
      return {
        ...baseStyle,
        fillColor: '#DC2626',
        fillOpacity: 0.5,
        dashArray: undefined,
      };
    case 'CAUTELAR':
      return {
        ...baseStyle,
        fillColor: '#F59E0B',
        fillOpacity: 0.4,
        dashArray: '8, 4',
      };
    case 'DESESTIMADO':
      return {
        ...baseStyle,
        fillColor: '#6B7280',
        fillOpacity: 0.2,
        dashArray: '15, 5',
      };
    default:
      return {
        ...baseStyle,
        fillColor: '#DC2626',
        fillOpacity: 0.3,
      };
  }
};

export const getMapStyles = () => ({
  superficieEdificable: LBI_LFI_CONFIG.STYLES.SUPERFICIE_EDIFICABLE,
  lib: LBI_LFI_CONFIG.STYLES.LIB,
  lfi: LBI_LFI_CONFIG.STYLES.LFI,
  mapaManzanas: LBI_LFI_CONFIG.STYLES.MAPA_MANZANAS,
  bandaMinima: LBI_LFI_CONFIG.STYLES.BANDA_MINIMA,
  troneras: LBI_LFI_CONFIG.STYLES.TRONERAS,
  aph: {},
  tejido: {},
});

export const createMapStylesCSS = (): string => {
  return `
    /* Efectos 3D para edificios */
    .edificio-3d {
      filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
      transition: all 0.3s ease;
    }
    
    .edificio-3d:hover {
      filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.4));
      transform: translateZ(0) scale(1.05);
    }
    
    /* Tooltip personalizado para edificios */
    .edificio-tooltip {
      background: linear-gradient(135deg, #10B981, #047857);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    .edificio-tooltip::before {
      border-top-color: #047857;
    }
    
    /* Tooltip personalizado para APH */
    .aph-tooltip {
      background: linear-gradient(135deg, #DC2626, #B91C1C);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    
    .aph-tooltip::before {
      border-top-color: #B91C1C;
    }
    
    /* Efectos para superficie edificable */
    .superficie-edificable-3d {
      filter: drop-shadow(1px 1px 3px rgba(218,165,32,0.5));
      animation: pulse-gold 3s infinite;
    }
    
    @keyframes pulse-gold {
      0% { opacity: 0.4; }
      50% { opacity: 0.6; }
      100% { opacity: 0.4; }
    }
    
    /* Efectos para troneras */
    .tronera-3d {
      filter: drop-shadow(2px 2px 4px rgba(22,163,74,0.5));
      animation: glow-green 2s ease-in-out infinite alternate;
    }
    
    @keyframes glow-green {
      from { filter: drop-shadow(2px 2px 4px rgba(22,163,74,0.5)); }
      to { filter: drop-shadow(2px 2px 8px rgba(22,163,74,0.8)); }
    }
    
    /* Efectos para líneas LIB/LFI */
    .lib-line, .lfi-line {
      filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
      animation: line-pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes line-pulse {
      0% { opacity: 0.8; }
      50% { opacity: 1; }
      100% { opacity: 0.8; }
    }
    
    /* Efectos para banda mínima */
    .banda-minima {
      filter: drop-shadow(1px 1px 2px rgba(147,51,234,0.4));
      animation: dash-move 2s linear infinite;
    }
    
    @keyframes dash-move {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: 15px; }
    }
    
    /* Efectos para manzanas contextuales */
    .manzana-contexto {
      transition: all 0.2s ease;
    }
    
    .manzana-contexto:hover {
      filter: drop-shadow(1px 1px 3px rgba(156,163,175,0.5));
    }
    
    /* Mejoras para el mapa base */
    .leaflet-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }
    
    .leaflet-popup-content-wrapper {
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
    
    .leaflet-popup-content {
      margin: 12px 16px;
      line-height: 1.5;
    }
    
    .leaflet-popup-tip {
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
  `;
};

export const injectMapStyles = (): void => {
  if (typeof document !== 'undefined' && !document.querySelector('#lbi-lfi-3d-styles')) {
    const style = document.createElement('style');
    style.id = 'lbi-lfi-3d-styles';
    style.textContent = createMapStylesCSS();
    document.head.appendChild(style);
  }
};
