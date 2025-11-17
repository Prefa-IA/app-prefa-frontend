import React from 'react';

import { MetricCardProps, TronerasMetricCardProps } from '../../types/components';
import { MetricsGridProps } from '../../types/enums';
import { getTronerasDescription } from '../../utils/troneras-utils';

const MetricsGrid: React.FC<MetricsGridProps> = ({ mediciones }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {mediciones.areaLIB && (
        <MetricCard
          label="Área LIB"
          value={`${mediciones.areaLIB.toFixed(2)} m²`}
          borderColor="border-blue-100"
        />
      )}

      {mediciones.areaLFI && (
        <MetricCard
          label="Área LFI"
          value={`${mediciones.areaLFI.toFixed(2)} m²`}
          borderColor="border-blue-100"
        />
      )}

      {mediciones.perimetroLIB && (
        <MetricCard
          label="Perímetro LIB"
          value={`${mediciones.perimetroLIB.toFixed(2)} m`}
          borderColor="border-blue-100"
        />
      )}

      {mediciones.perimetroLFI && (
        <MetricCard
          label="Perímetro LFI"
          value={`${mediciones.perimetroLFI.toFixed(2)} m`}
          borderColor="border-blue-100"
        />
      )}

      {mediciones.distanciaLIB_LFI && (
        <MetricCard
          label="Distancia LIB-LFI"
          value={`${mediciones.distanciaLIB_LFI.toFixed(2)} m`}
          borderColor="border-blue-100"
        />
      )}

      {mediciones.totalTroneras !== undefined && mediciones.totalTroneras >= 0 && (
        <TronerasMetricCard totalTroneras={mediciones.totalTroneras} />
      )}

      {mediciones.areaTotalTroneras && (
        <MetricCard
          label="Área Total Troneras"
          value={`${mediciones.areaTotalTroneras.toFixed(2)} m²`}
          borderColor="border-green-100"
        />
      )}
    </div>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({ label, value, borderColor }) => (
  <div className={`bg-white p-3 rounded shadow-sm border ${borderColor}`}>
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-lg font-medium">{value}</div>
  </div>
);

const TronerasMetricCard: React.FC<TronerasMetricCardProps> = ({ totalTroneras }) => {
  const description = getTronerasDescription(totalTroneras);

  return (
    <div className="bg-white p-3 rounded shadow-sm border border-green-100">
      <div className="text-sm text-gray-500">Total Troneras</div>
      <div className="text-lg font-medium">
        {totalTroneras} unidades
        <span className={`text-xs ${description.color} block`}>{description.text}</span>
      </div>
    </div>
  );
};

export default MetricsGrid;
