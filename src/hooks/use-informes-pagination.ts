import { useCallback, useState } from 'react';

export const useInformesPagination = (totalPages: number) => {
  const [page, setPage] = useState(1);

  const handlePrevPage = useCallback(() => {
    if (page > 1) setPage(page - 1);
  }, [page]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) setPage(page + 1);
  }, [page, totalPages]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    setPage,
    handlePrevPage,
    handleNextPage,
    resetPage,
  };
};
