import React from 'react';

import { LBI_LFI_CONFIG, MapLegendProps } from '../../types/enums';

const MapLegend: React.FC<MapLegendProps> = ({ visualizacion3D, onToggleVisualizacion3D }) => {
  return (
    <div className="p-4 bg-gray-50 border-t">
      <LegendHeader
        visualizacion3D={visualizacion3D}
        onToggleVisualizacion3D={onToggleVisualizacion3D}
      />
      <LegendGrid />
    </div>
  );
};

const LegendHeader: React.FC<{
  visualizacion3D: boolean;
  onToggleVisualizacion3D: () => void;
}> = ({ visualizacion3D, onToggleVisualizacion3D }) => (
  <div className="flex justify-between items-center mb-4">
    <div className="text-sm font-medium">Referencias:</div>
    <ViewToggle visualizacion3D={visualizacion3D} onToggle={onToggleVisualizacion3D} />
  </div>
);

const ViewToggle: React.FC<{
  visualizacion3D: boolean;
  onToggle: () => void;
}> = ({ visualizacion3D, onToggle }) => (
  <div className="flex items-center space-x-2">
    <span className="text-xs text-gray-600">Vista:</span>
    <button
      onClick={onToggle}
      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
        visualizacion3D
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {visualizacion3D ? '🌆 3D ON' : '🗺️ 2D'}
    </button>
    <div className="text-xs text-gray-500">
      {visualizacion3D ? 'Alturas dinámicas' : 'Vista plana'}
    </div>
  </div>
);

const LegendGrid: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
    {LBI_LFI_CONFIG.LEGEND.ITEMS.map((item, index) => (
      <LegendItem key={index} item={item} />
    ))}
  </div>
);

const LegendItem: React.FC<{
  item: {
    color: string;
    opacity: number;
    border: string;
    label: string;
  };
}> = ({ item }) => (
  <div className="flex items-center">
    <div
      className="w-4 h-4 mr-2"
      style={{
        backgroundColor: item.color,
        opacity: item.opacity,
        border: item.border,
      }}
    ></div>
    <span className="text-xs">{item.label}</span>
  </div>
);

export default MapLegend;
