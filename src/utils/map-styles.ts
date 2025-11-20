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

import { createMapStylesCSS } from './map-styles-css';

export { createMapStylesCSS };

export const injectMapStyles = (): void => {
  if (typeof document !== 'undefined' && !document.querySelector('#lbi-lfi-3d-styles')) {
    const style = document.createElement('style');
    style.id = 'lbi-lfi-3d-styles';
    style.textContent = createMapStylesCSS();
    document.head.appendChild(style);
  }
};
