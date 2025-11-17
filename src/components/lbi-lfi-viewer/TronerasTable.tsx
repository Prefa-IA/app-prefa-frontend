import React from 'react';

import {
  DistanciasCellProps,
  TipoEsquinaBadgeProps,
  TroneraRowProps,
  TronerasTableBodyProps,
  TronerasTableFooterProps,
} from '../../types/components';
import { TronerasTableProps } from '../../types/enums';

const TronerasTable: React.FC<TronerasTableProps> = ({ troneras }) => {
  return (
    <div className="bg-white rounded-lg border border-green-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-green-200">
          <TronerasTableHeader />
          <TronerasTableBody troneras={troneras as unknown as Array<Record<string, unknown>>} />
        </table>
      </div>

      <TronerasTableFooter troneras={troneras as unknown as Array<Record<string, unknown>>} />
    </div>
  );
};

const TronerasTableHeader: React.FC = () => (
  <thead className="bg-green-50">
    <tr>
      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
        #
      </th>
      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
        Posición
      </th>
      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
        Tipo
      </th>
      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
        Tamaño
      </th>
      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
        Área
      </th>
      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
        Ángulo
      </th>
      <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
        Distancias
      </th>
    </tr>
  </thead>
);

const TronerasTableBody: React.FC<TronerasTableBodyProps> = ({ troneras }) => (
  <tbody className="bg-white divide-y divide-green-100">
    {troneras.map((tronera, index) => (
      <TroneraRow key={index} tronera={tronera} index={index} />
    ))}
  </tbody>
);

const TroneraRow: React.FC<TroneraRowProps> = ({ tronera, index }) => {
  const props = tronera['properties'] as Record<string, unknown>;
  return (
    <tr className="hover:bg-green-50">
      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-900">
        {index + 1}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
        {(props['posicion'] as string) || 'N/A'}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
        <TipoEsquinaBadge tipo={props['tipo_esquina'] as string} />
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
        {(props['tamaño_metros'] as number) || 0}m × {(props['tamaño_metros'] as number) || 0}m
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
        {((props['area'] as number) || 0).toFixed(2)} m²
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
        {props['angulo'] ? `${((props['angulo'] as number) || 0).toFixed(1)}°` : 'N/A'}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
        <DistanciasCell tronera={tronera} />
      </td>
    </tr>
  );
};

const TipoEsquinaBadge: React.FC<TipoEsquinaBadgeProps> = ({ tipo }) => (
  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
    {tipo || 'esquina'}
  </span>
);

const DistanciasCell: React.FC<DistanciasCellProps> = ({ tronera }) => {
  const props = tronera['properties'] as Record<string, unknown>;
  const distancia_anterior = props['distancia_anterior'] as number | undefined;
  const distancia_siguiente = props['distancia_siguiente'] as number | undefined;

  if (distancia_anterior && distancia_siguiente) {
    return (
      <div className="flex flex-col">
        <span>Ant: {distancia_anterior.toFixed(1)}m</span>
        <span>Sig: {distancia_siguiente.toFixed(1)}m</span>
      </div>
    );
  }

  if (distancia_anterior) {
    return <span>Ant: {distancia_anterior.toFixed(1)}m</span>;
  }

  if (distancia_siguiente) {
    return <span>Sig: {distancia_siguiente.toFixed(1)}m</span>;
  }

  return <span>N/A</span>;
};

const TronerasTableFooter: React.FC<TronerasTableFooterProps> = ({ troneras }) => {
  const totalArea = troneras.reduce((sum, t) => {
    const props = t['properties'] as Record<string, unknown>;
    return sum + ((props['area'] as number) || 0);
  }, 0);
  const averageArea = totalArea / troneras.length;

  return (
    <div className="bg-green-50 px-4 py-3 border-t border-green-100">
      <div className="flex flex-wrap gap-4 text-sm text-green-700">
        <span>
          <strong>Total:</strong> {troneras.length} troneras
        </span>
        <span>
          <strong>Área total:</strong> {totalArea.toFixed(2)} m²
        </span>
        <span>
          <strong>Tamaño promedio:</strong> {averageArea.toFixed(2)} m² c/u
        </span>
      </div>
    </div>
  );
};

export default TronerasTable;
