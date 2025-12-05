import React from 'react';

import { ConsultaMapContainerProps } from '../../types/components';

import UsigMapContainer from './UsigMapContainer';

const MapContainer: React.FC<ConsultaMapContainerProps> = ({ center, showMarker = false }) => {
  return (
    <div
      className="mt-6 mb-6 overflow-hidden rounded-lg border border-gray-200 relative"
      style={{ zIndex: 1 }}
    >
      <UsigMapContainer center={center} showMarker={showMarker} className="h-64" />
    </div>
  );
};

export default MapContainer;
