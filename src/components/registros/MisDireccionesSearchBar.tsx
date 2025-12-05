import React from 'react';
import { RefreshIcon } from '@heroicons/react/outline';

interface MisDireccionesSearchBarProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onRefresh: () => void;
  searchCooldown: boolean;
  loading: boolean;
}

const MisDireccionesSearchBar: React.FC<MisDireccionesSearchBarProps> = ({
  search,
  onSearchChange,
  onSearchSubmit,
  onRefresh,
  searchCooldown,
  loading,
}) => (
  <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
    <form
      onSubmit={onSearchSubmit}
      className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-1"
    >
      <input
        type="text"
        value={search}
        onChange={onSearchChange}
        placeholder="Buscá por dirección"
        className="w-full sm:flex-1 border rounded px-3 py-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
      />
      <button
        type="submit"
        className="w-full sm:w-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white rounded"
        disabled={searchCooldown}
      >
        Buscar
      </button>
    </form>
    <button
      onClick={onRefresh}
      disabled={loading}
      className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      title="Actualizar historial"
    >
      <RefreshIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
    </button>
  </div>
);

export default MisDireccionesSearchBar;
