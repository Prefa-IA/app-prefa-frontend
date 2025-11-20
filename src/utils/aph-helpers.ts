export interface ProteccionInfo {
  icono: string;
  color: string;
  nivelInfo: string;
}

export const getProteccionInfo = (prot: string): ProteccionInfo => {
  const upperProt = prot.toUpperCase();
  switch (upperProt) {
    case 'INTEGRAL':
      return {
        icono: '🏛️⭐',
        color: '#DC2626',
        nivelInfo:
          '<div style="background: #FEE2E2; padding: 8px; margin-top: 8px; border-radius: 4px; font-size: 12px;"><strong>⚠️ PROTECCIÓN MÁXIMA:</strong> Edificio con valor patrimonial excepcional. Restricciones muy estrictas.</div>',
      };
    case 'ESTRUCTURAL':
      return {
        icono: '🏛️🔒',
        color: '#DC2626',
        nivelInfo:
          '<div style="background: #FEF3C7; padding: 8px; margin-top: 8px; border-radius: 4px; font-size: 12px;"><strong>🔧 PROTECCIÓN ESTRUCTURAL:</strong> Se debe mantener la estructura y fachada principal.</div>',
      };
    case 'CAUTELAR':
      return {
        icono: '🏛️⚠️',
        color: '#F59E0B',
        nivelInfo:
          '<div style="background: #FEF3C7; padding: 8px; margin-top: 8px; border-radius: 4px; font-size: 12px;"><strong>⏳ PROTECCIÓN CAUTELAR:</strong> Medida preventiva mientras se estudia su valor patrimonial.</div>',
      };
    case 'DESESTIMADO':
      return {
        icono: '🏛️❌',
        color: '#6B7280',
        nivelInfo:
          '<div style="background: #F3F4F6; padding: 8px; margin-top: 8px; border-radius: 4px; font-size: 12px;"><strong>❌ SIN PROTECCIÓN:</strong> No presenta valor patrimonial significativo.</div>',
      };
    default:
      return {
        icono: '🏛️',
        color: '#6B7280',
        nivelInfo: '',
      };
  }
};

export const buildAPHPopupContent = (
  feature: { properties?: Record<string, unknown> },
  proteccionInfo: ProteccionInfo,
  proteccion: string,
  estado: string,
  catalogacion: string
): string => {
  const props = feature.properties || {};
  return `<div><strong>${proteccionInfo.icono} Área de Protección Histórica</strong><br>
    <strong>SMP:</strong> ${(props['SMP'] as string) || 'N/A'}<br>
    <strong>🏘️ Barrio:</strong> ${(props['BARRIOS'] as string) || 'N/A'}<br>
    <strong>🗺️ Comuna:</strong> ${(props['COMUNA'] as string) || 'N/A'}<br>
    ${props['1_DIRECCIO'] ? `<strong>📍 Dirección:</strong> ${props['1_DIRECCIO']}<br>` : ''}
    <strong>🛡️ Protección:</strong> <span style="color: ${proteccionInfo.color}; font-weight: bold;">${proteccion}</span><br>
    <strong>📋 Estado:</strong> ${estado}<br>
    <strong>⚖️ Ley 3056:</strong> ${(props['LEY_3056'] as string) || 'N/A'}<br>
    ${props['DENOMINACI'] ? `<strong>🏛️ Denominación:</strong> ${props['DENOMINACI']}<br>` : ''}
    ${catalogacion ? `<strong>📚 Catalogación:</strong> ${catalogacion}<br>` : ''}
    ${proteccionInfo.nivelInfo}
  </div>`;
};
