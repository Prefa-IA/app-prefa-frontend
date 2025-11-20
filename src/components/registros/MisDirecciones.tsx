import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AddressHistoryItem, listAddressHistory } from '../../services/address-history';

import MisDireccionesEmptyState from './MisDireccionesEmptyState';
import MisDireccionesList from './MisDireccionesList';
import MisDireccionesSearchBar from './MisDireccionesSearchBar';

const MisDirecciones: React.FC = () => {
  const [items, setItems] = React.useState<AddressHistoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [searchCooldown, setSearchCooldown] = React.useState(false);
  const navigate = useNavigate();

  const loadHistory = React.useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      const history = await listAddressHistory(forceRefresh);
      setItems(history);
    } catch (error) {
      console.error('Error cargando historial:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

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
    return items.filter((item) => item.address.toLowerCase().includes(searchLower));
  }, [items, search]);

  return (
    <>
      <MisDireccionesSearchBar
        search={search}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onRefresh={() => {
          void loadHistory(true);
        }}
        searchCooldown={searchCooldown}
        loading={loading}
      />

      {loading ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando historial...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <MisDireccionesEmptyState hasItems={items.length > 0} />
      ) : (
        <MisDireccionesList items={filteredItems} onVerDatos={handleVerDatos} />
      )}
    </>
  );
};

export default MisDirecciones;
