const createEdificio3DStyles = (): string => `
  /* Efectos 3D para edificios */
  .edificio-3d {
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
    transition: all 0.3s ease;
  }
  
  .edificio-3d:hover {
    filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.4));
    transform: translateZ(0) scale(1.05);
  }
`;

const createTooltipStyles = (): string => `
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
`;

const createAnimationStyles = (): string => `
  @keyframes pulse-gold {
    0% { opacity: 0.4; }
    50% { opacity: 0.6; }
    100% { opacity: 0.4; }
  }
  
  @keyframes glow-green {
    from { filter: drop-shadow(2px 2px 4px rgba(22,163,74,0.5)); }
    to { filter: drop-shadow(2px 2px 8px rgba(22,163,74,0.8)); }
  }
  
  @keyframes line-pulse {
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.8; }
  }
  
  @keyframes dash-move {
    0% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 15px; }
  }
`;

const createFeatureStyles = (): string => `
  /* Efectos para superficie edificable */
  .superficie-edificable-3d {
    filter: drop-shadow(1px 1px 3px rgba(218,165,32,0.5));
    animation: pulse-gold 3s infinite;
  }
  
  /* Efectos para troneras */
  .tronera-3d {
    filter: drop-shadow(2px 2px 4px rgba(22,163,74,0.5));
    animation: glow-green 2s ease-in-out infinite alternate;
  }
  
  /* Efectos para líneas LIB/LFI */
  .lib-line, .lfi-line {
    filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
    animation: line-pulse 1.5s ease-in-out infinite;
  }
  
  /* Efectos para banda mínima */
  .banda-minima {
    filter: drop-shadow(1px 1px 2px rgba(147,51,234,0.4));
    animation: dash-move 2s linear infinite;
  }
  
  /* Efectos para manzanas contextuales */
  .manzana-contexto {
    transition: all 0.2s ease;
  }
  
  .manzana-contexto:hover {
    filter: drop-shadow(1px 1px 3px rgba(156,163,175,0.5));
  }
`;

const createLeafletStyles = (): string => `
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

export const createMapStylesCSS = (): string => {
  return [
    createEdificio3DStyles(),
    createTooltipStyles(),
    createAnimationStyles(),
    createFeatureStyles(),
    createLeafletStyles(),
  ].join('\n');
};
