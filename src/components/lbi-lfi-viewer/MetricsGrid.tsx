import React from 'react';
import { MetricsGridProps } from '../../types/enums';

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

      {(mediciones.totalTroneras !== undefined && mediciones.totalTroneras >= 0) && (
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

const MetricCard: React.FC<{
  label: string;
  value: string;
  borderColor: string;
}> = ({ label, value, borderColor }) => (
  <div className={`bg-white p-3 rounded shadow-sm border ${borderColor}`}>
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-lg font-medium">{value}</div>
  </div>
);

const TronerasMetricCard: React.FC<{ totalTroneras: number }> = ({ totalTroneras }) => {
  const getTronerasDescription = (count: number): { text: string; color: string } => {
    if (count === 0) return { text: 'Sin troneras aplicables', color: 'text-gray-400' };
    if (count === 1) return { text: 'Caso especial: 1 tronera', color: 'text-blue-500' };
    if (count === 2) return { text: 'Caso especial: 2 troneras', color: 'text-blue-500' };
    if (count === 3) return { text: 'Manzana triangular', color: 'text-orange-500' };
    if (count === 4) return { text: 'Manzana típica', color: 'text-green-500' };
    return { text: 'Manzana irregular', color: 'text-purple-500' };
  };

  const description = getTronerasDescription(totalTroneras);

  return (
    <div className="bg-white p-3 rounded shadow-sm border border-green-100">
      <div className="text-sm text-gray-500">Total Troneras</div>
      <div className="text-lg font-medium">
        {totalTroneras} unidades
        <span className={`text-xs ${description.color} block`}>
          {description.text}
        </span>
      </div>
    </div>
  );
};

export default MetricsGrid; 