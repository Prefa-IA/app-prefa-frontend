import React from 'react';
import { listAddressHistory, AddressHistoryItem } from '../../services/addressHistory';
import { useNavigate } from 'react-router-dom';
import { LocationMarkerIcon, ClockIcon } from '@heroicons/react/outline';

const MisDirecciones: React.FC = () => {
  const [items, setItems] = React.useState<AddressHistoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [searchCooldown, setSearchCooldown] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const history = await listAddressHistory();
        setItems(history);
      } catch (error) {
        console.error('Error cargando historial:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const handleVerDatos = (address: string) => {
    const q = new URLSearchParams({ direccion: address, fromHistory: 'true' });
    navigate(`/buscar?${q.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCooldown) return;
    setSearchCooldown(true);
    setTimeout(() => setSearchCooldown(false), 1500);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toUpperCase());
  };

  const filteredItems = React.useMemo(() => {
    if (!search.trim()) return items;
    const searchLower = search.toLowerCase();
    return items.filter(item => 
      item.address.toLowerCase().includes(searchLower)
    );
  }, [items, search]);

  return (
    <>
      <form onSubmit={handleSearchSubmit} className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
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

      {loading ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando historial...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <LocationMarkerIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            {items.length === 0 
              ? 'No hay direcciones guardadas'
              : 'No se encontraron direcciones'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            {items.length === 0
              ? 'Las direcciones que consultes se guardarán aquí para acceso rápido.'
              : 'Intenta con otro término de búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <ul className="divide-y divide-gray-200">
            {filteredItems.map((item, idx) => (
          <li key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
              <div className="flex items-center">
                <LocationMarkerIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-primary-600 dark:text-primary-400">{item.address}</div>
                  <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {new Date(item.timestamp).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleVerDatos(item.address)}
                className="inline-flex justify-center items-center w-full sm:w-auto px-3 py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Ver datos básicos
              </button>
            </div>
          </li>
        ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default MisDirecciones;


