import { useCallback, useEffect, useState } from 'react';

import { prefactibilidad } from '../services/api';
import { Informe } from '../types/enums';

import { useInformesDownload } from './use-informes-download';
import { useInformesPagination } from './use-informes-pagination';
import { useInformesSearch } from './use-informes-search';

export const useInformesList = () => {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const { search, searchCooldown, handleSearchSubmit, handleSearchChange } = useInformesSearch();
  const { page, handlePrevPage, handleNextPage, resetPage } = useInformesPagination(totalPages);
  const {
    handleDescargar,
    downloadingIds,
    downloadedIds,
    error: downloadError,
    setError: setDownloadError,
  } = useInformesDownload();

  const cargarInformes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await prefactibilidad.obtenerInformes(page, search);
      setInformes(data.informes);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error al cargar informes:', error);
      setError('Error al cargar los informes. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

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

  useEffect(() => {
    if (downloadError) {
      setError(downloadError);
      setDownloadError(null);
    }
  }, [downloadError, setDownloadError, setError]);

  const handleSearchSubmitWithReset = useCallback(
    (e: React.FormEvent) => {
      handleSearchSubmit(e);
      resetPage();
    },
    [handleSearchSubmit, resetPage]
  );

  return {
    informes,
    loading,
    error,
    page,
    totalPages,
    search,
    downloadingIds,
    downloadedIds,
    searchCooldown,
    cargarInformes,
    handleDescargar,
    handleSearchSubmit: handleSearchSubmitWithReset,
    handleSearchChange,
    handlePrevPage,
    handleNextPage,
  };
};
