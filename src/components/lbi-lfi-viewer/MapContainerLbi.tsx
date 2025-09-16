import React from 'react';
import { MapContainerLbiProps, LBI_LFI_CONFIG } from '../../types/enums';

const MapContainerLbi: React.FC<MapContainerLbiProps> = ({
  mapRef,
  loading,
  loadingData,
  error,
  smp
}) => {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      {error && <ErrorDisplay error={error} />}
      
      <div
        ref={mapRef}
        className="w-full h-[500px]"
        style={{ position: 'relative', minHeight: LBI_LFI_CONFIG.MAP.DEFAULT_HEIGHT }}
      >
        {(loading || loadingData) && (
          <LoadingOverlay loading={loading} loadingData={loadingData} smp={smp} />
        )}
      </div>
    </div>
  );
};

const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
    {error}
  </div>
);

const LoadingOverlay: React.FC<{
  loading: boolean;
  loadingData: boolean;
  smp: string;
}> = ({ loading, loadingData, smp }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10">
    <LoadingSpinner />
    {loadingData ? (
      <LoadingDataContent smp={smp} />
    ) : (
      <LoadingMapContent />
    )}
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
);

const LoadingDataContent: React.FC<{ smp: string }> = ({ smp }) => (
  <div className="text-center">
    <div className="text-lg font-medium text-blue-600 mb-2">
      {LBI_LFI_CONFIG.MESSAGES.LOADING_DATA}
    </div>
    <div className="text-sm text-gray-600">
      {LBI_LFI_CONFIG.MESSAGES.LOADING_SUBTITLE}
    </div>
    <div className="text-xs text-gray-500 mt-1">
      SMP: {smp}
    </div>
  </div>
);

const LoadingMapContent: React.FC = () => (
  <div className="text-center">
    <div className="text-lg font-medium text-blue-600">
      {LBI_LFI_CONFIG.MESSAGES.LOADING_MAP}
    </div>
  </div>
);

export default MapContainerLbi; 