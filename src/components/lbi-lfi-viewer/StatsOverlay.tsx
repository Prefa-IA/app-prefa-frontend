import React from 'react';

import { MapData } from '../../types/components';

interface StatsOverlayProps {
  estadisticas: MapData['estadisticas'];
}

const StatsOverlay: React.FC<StatsOverlayProps> = ({ estadisticas }) => {
  if (!estadisticas) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '200px',
        fontSize: '14px',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '16px' }}>Estadísticas</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {estadisticas.esquinas_con_troneras !== undefined &&
          estadisticas.total_esquinas !== undefined && (
            <div>
              <strong>Esquinas con troneras:</strong> {estadisticas.esquinas_con_troneras} /{' '}
              {estadisticas.total_esquinas}
            </div>
          )}
        {estadisticas.porcentaje_afectacion_lfi !== undefined && (
          <div>
            <strong>Afectación LFI:</strong> {estadisticas.porcentaje_afectacion_lfi}%
          </div>
        )}
        {estadisticas.porcentaje_afectacion_lib !== undefined && (
          <div>
            <strong>Afectación LIB:</strong> {estadisticas.porcentaje_afectacion_lib}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsOverlay;
