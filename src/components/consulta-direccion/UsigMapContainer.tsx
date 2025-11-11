import React from 'react';
import { useUsigMap } from '../../hooks/useUsigMap';
import { UsigMapContainerProps } from '../../types/components';

const UsigMapContainer: React.FC<UsigMapContainerProps> = ({ 
  center, 
  showMarker = true,
  className = "" 
}) => {
  const mapId = React.useMemo(() => `mapa-usig-${Date.now()}`, []);
  const { mapRef, isLoaded } = useUsigMap({ center, showMarker });

  return (
    <div className={`relative ${className}`} style={{ zIndex: 1 }}>
      <div
        ref={mapRef}
        id={mapId}
        className="w-full h-full min-h-[200px] rounded-lg relative"
        style={{ 
          minHeight: '200px',
          zIndex: 10,
          position: 'relative'
        }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg" style={{ zIndex: 20 }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsigMapContainer; 