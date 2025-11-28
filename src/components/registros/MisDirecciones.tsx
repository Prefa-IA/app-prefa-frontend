import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AddressHistoryItem, listAddressHistory } from '../../services/address-history';

import MisDireccionesEmptyState from './MisDireccionesEmptyState';
import MisDireccionesList from './MisDireccionesList';
import MisDireccionesSearchBar from './MisDireccionesSearchBar';
import PaginationControls from './PaginationControls';

const ITEMS_PER_PAGE_STORAGE_KEY = 'listaDirecciones_itemsPerPage';

const useItemsPerPage = (storageKey: string) => {
  return React.useState<number>(() => {
    const saved = localStorage.getItem(storageKey);
    const parsed = saved ? Number.parseInt(saved, 10) : 10;
    return parsed === 10 || parsed === 25 || parsed === 50 ? parsed : 10;
  });
};

const useDireccionesPagination = (filteredItems: AddressHistoryItem[], itemsPerPage: number) => {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = React.useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, page, itemsPerPage]);

  React.useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  const handlePrevPage = React.useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const handleNextPage = React.useCallback(() => {
    if (page < totalPages) setPage(page + 1);
  }, [page, totalPages]);

  const resetPage = React.useCallback(() => setPage(1), []);

  return { page, totalPages, paginatedItems, handlePrevPage, handleNextPage, resetPage };
};

const useDireccionesData = () => {
  const [items, setItems] = React.useState<AddressHistoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

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

  return { items, loading, loadHistory };
};

const MisDirecciones: React.FC = () => {
  const { items, loading, loadHistory } = useDireccionesData();
  const [search, setSearch] = React.useState('');
  const [searchCooldown, setSearchCooldown] = React.useState(false);
  const [itemsPerPage, setItemsPerPage] = useItemsPerPage(ITEMS_PER_PAGE_STORAGE_KEY);
  const navigate = useNavigate();

  const handleVerDatos = React.useCallback(
    (address: string) => {
      const q = new URLSearchParams({ direccion: address, fromHistory: 'true' });
      navigate(`/buscar?${q.toString()}`);
    },
    [navigate]
  );

  const handleSearchSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchCooldown) return;
      setSearchCooldown(true);
      setTimeout(() => setSearchCooldown(false), 1500);
    },
    [searchCooldown]
  );

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toUpperCase());
  }, []);

  const filteredItems = React.useMemo(() => {
    if (!search.trim()) return items;
    const searchLower = search.toLowerCase();
    return items.filter((item) => item.address.toLowerCase().includes(searchLower));
  }, [items, search]);

  const { page, totalPages, paginatedItems, handlePrevPage, handleNextPage, resetPage } =
    useDireccionesPagination(filteredItems, itemsPerPage);

  const handleItemsPerPageChange = React.useCallback(
    (newLimit: number) => {
      setItemsPerPage(newLimit);
      localStorage.setItem(ITEMS_PER_PAGE_STORAGE_KEY, newLimit.toString());
      resetPage();
    },
    [setItemsPerPage, resetPage]
  );

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
        <>
          <MisDireccionesList items={paginatedItems} onVerDatos={handleVerDatos} />
          <PaginationControls
            page={page}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
    </>
  );
};

export default MisDirecciones;
