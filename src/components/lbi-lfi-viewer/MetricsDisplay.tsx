import React from 'react';

import {
  MetricsContentProps,
  TronerasHeaderProps,
  TronerasSectionProps,
} from '../../types/components';
import { LBI_LFI_CONFIG, MetricsDisplayProps, TroneraFeature } from '../../types/enums';

import MetricsGrid from './MetricsGrid';
import TronerasTable from './TronerasTable';

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({
  calculandoMetricas,
  mediciones,
  geoJSONData,
}) => {
  const shouldShowMetrics =
    calculandoMetricas ||
    mediciones.areaLIB ||
    mediciones.areaLFI ||
    mediciones.distanciaLIB_LFI ||
    mediciones.totalTroneras !== undefined ||
    geoJSONData.troneras !== null;

  if (!shouldShowMetrics) return null;

  return (
    <div className="p-4 bg-blue-50 border-t border-blue-100">
      {calculandoMetricas ? (
        <CalculatingMetrics />
      ) : (
        <MetricsContent
          mediciones={mediciones as unknown as Record<string, unknown>}
          geoJSONData={geoJSONData as unknown as Record<string, unknown>}
        />
      )}
    </div>
  );
};

const CalculatingMetrics: React.FC = () => (
  <div className="flex items-center justify-center py-4">
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span className="text-blue-700 font-medium">{LBI_LFI_CONFIG.MESSAGES.CALCULATING_METRICS}</span>
  </div>
);

const MetricsContent: React.FC<MetricsContentProps> = ({ mediciones, geoJSONData }) => (
  <>
    <h3 className="text-lg font-medium text-blue-800 mb-4">Mediciones</h3>

    <MetricsGrid mediciones={mediciones} />

    {geoJSONData['troneras'] !== null &&
      geoJSONData['troneras'] !== undefined &&
      Array.isArray(geoJSONData['troneras']) && (
        <TronerasSection troneras={geoJSONData['troneras'] as Array<Record<string, unknown>>} />
      )}
  </>
);

const TronerasSection: React.FC<TronerasSectionProps> = ({ troneras }) => (
  <div className="mt-6">
    <TronerasHeader tronerasCount={troneras.length} />

    {troneras.length === 0 ? (
      <EmptyTronerasDisplay />
    ) : (
      <TronerasTable troneras={troneras as unknown as TroneraFeature[]} />
    )}
  </div>
);

const TronerasHeader: React.FC<TronerasHeaderProps> = ({ tronerasCount }) => (
  <h4 className="text-md font-medium text-green-800 mb-3 flex items-center">
    <span className="w-3 h-3 bg-green-500 rounded-sm mr-2"></span>
    Detalle de Troneras ({tronerasCount})
    {tronerasCount === 0 && (
      <span className="ml-2 text-xs text-gray-500 font-normal">
        - No aplicable para esta parcela
      </span>
    )}
  </h4>
);

const EmptyTronerasDisplay: React.FC = () => (
  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
    <div className="text-center text-gray-600">
      <div className="text-sm">
        <strong>Sin troneras identificadas</strong>
      </div>
      <div className="text-xs mt-2 text-gray-500">Esto puede ocurrir en casos especiales como:</div>
      <ul className="text-xs mt-2 text-gray-500 text-left max-w-md mx-auto">
        <li>• Lotes con geometría LFI no estándar</li>
        <li>• Parcelas donde no aplica la normativa de troneras</li>
        <li>• Casos con restricciones urbanísticas específicas</li>
        <li>• Geometrías LFI abiertas o incompletas</li>
      </ul>
    </div>
  </div>
);

export default MetricsDisplay;
