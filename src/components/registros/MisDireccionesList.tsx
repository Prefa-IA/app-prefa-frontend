import React from 'react';
import { ClockIcon, LocationMarkerIcon } from '@heroicons/react/outline';

import { AddressHistoryItem } from '../../services/address-history';

interface MisDireccionesListProps {
  items: AddressHistoryItem[];
  onVerDatos: (address: string) => void;
}

const MisDireccionesList: React.FC<MisDireccionesListProps> = ({ items, onVerDatos }) => (
  <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
    <ul className="divide-y divide-gray-200">
      {items.map((item, idx) => (
        <li
          key={idx}
          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <LocationMarkerIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                <h3 className="text-lg font-medium text-primary-600 dark:text-primary-400">
                  {item.address}
                </h3>
              </div>
              <div className="hidden sm:flex mt-2 sm:mt-0 sm:ml-2 flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => onVerDatos(item.address)}
                  className="inline-flex justify-center items-center w-full sm:w-auto px-2 py-1 sm:px-3 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  Ver datos básicos
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {new Date(item.timestamp).toLocaleString('es-AR', {
                timeZone: 'America/Argentina/Buenos_Aires',
              })}
            </div>
            {/* Botón móvil */}
            <div className="sm:hidden mt-4">
              <button
                onClick={() => onVerDatos(item.address)}
                className="w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-xs leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Ver datos básicos
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default MisDireccionesList;
