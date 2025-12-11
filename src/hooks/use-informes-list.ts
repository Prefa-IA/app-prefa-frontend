import { useCallback, useEffect, useState } from 'react';

import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';

import { useInformesDownload } from './use-informes-download';
import { useInformesSearch } from './use-informes-search';
import { useInformesShare } from './use-informes-share';

const ITEMS_PER_PAGE_STORAGE_KEY = 'listaInformes_itemsPerPage';

const useItemsPerPageState = () => {
  return useState<number>(() => {
    const saved = localStorage.getItem(ITEMS_PER_PAGE_STORAGE_KEY);
    const parsed = saved ? Number.parseInt(saved, 10) : 10;
    return parsed === 10 || parsed === 25 || parsed === 50 ? parsed : 10;
  });
};

const useInformesData = (
  page: number,
  search: string,
  itemsPerPage: number,
  downloadError: string | null,
  setDownloadError: (error: string | null) => void
) => {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (downloadError) {
      setError(downloadError);
      setDownloadError(null);
    }
  }, [downloadError, setDownloadError]);

  const cargarInformes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await prefactibilidad.obtenerInformes(page, search, itemsPerPage);
      setInformes(data.informes);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error al cargar informes:', error);
      setError('Error al cargar los informes. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [page, search, itemsPerPage]);

  useEffect(() => {
    void cargarInformes();
  }, [cargarInformes]);

  useEffect(() => {
    const handleInformeGuardado = () => {
      void cargarInformes();
    };
    window.addEventListener('informe-guardado', handleInformeGuardado);
    return () => {
      window.removeEventListener('informe-guardado', handleInformeGuardado);
    };
  }, [cargarInformes]);

  return { informes, loading, error, totalPages, cargarInformes };
};

export const useInformesList = () => {
  const [itemsPerPage, setItemsPerPage] = useItemsPerPageState();
  const [page, setPage] = useState(1);
  const { search, searchCooldown, handleSearchSubmit, handleSearchChange } = useInformesSearch();
  const {
    handleDescargar,
    downloadingIds,
    error: downloadError,
    setError: setDownloadError,
  } = useInformesDownload();

  const {
    handleCompartir,
    sharingIds,
    error: shareError,
    setError: setShareError,
  } = useInformesShare();

  const { informes, loading, error, totalPages, cargarInformes } = useInformesData(
    page,
    search,
    itemsPerPage,
    downloadError || shareError,
    (error) => {
      setDownloadError(error);
      setShareError(error);
    }
  );

  const handlePrevPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) setPage(page + 1);
  }, [page, totalPages]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const handleSearchSubmitWithReset = useCallback(
    (e: React.FormEvent) => {
      handleSearchSubmit(e);
      resetPage();
    },
    [handleSearchSubmit, resetPage]
  );

  const handleItemsPerPageChange = useCallback(
    (newLimit: number) => {
      setItemsPerPage(newLimit);
      localStorage.setItem(ITEMS_PER_PAGE_STORAGE_KEY, newLimit.toString());
      resetPage();
    },
    [setItemsPerPage, resetPage]
  );

  return {
    informes,
    loading,
    error,
    page,
    totalPages,
    search,
    downloadingIds,
    sharingIds,
    searchCooldown,
    itemsPerPage,
    cargarInformes,
    handleDescargar,
    handleCompartir,
    handleSearchSubmit: handleSearchSubmitWithReset,
    handleSearchChange,
    handlePrevPage,
    handleNextPage,
    handleItemsPerPageChange,
  };
};
