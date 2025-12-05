import React from 'react';
import { LocationMarkerIcon } from '@heroicons/react/outline';

interface MisDireccionesEmptyStateProps {
  hasItems: boolean;
}

const MisDireccionesEmptyState: React.FC<MisDireccionesEmptyStateProps> = ({ hasItems }) => (
  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
    <LocationMarkerIcon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
      {hasItems ? 'No se encontraron direcciones' : 'No hay direcciones guardadas'}
    </h3>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
      {hasItems
        ? 'Intenta con otro término de búsqueda.'
        : 'Las direcciones que consultes se guardarán aquí para acceso rápido.'}
    </p>
  </div>
);

export default MisDireccionesEmptyState;
