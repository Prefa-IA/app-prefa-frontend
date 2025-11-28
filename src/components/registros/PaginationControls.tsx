import React from 'react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  itemsPerPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onItemsPerPageChange: (limit: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  itemsPerPage,
  onPrevPage,
  onNextPage,
  onItemsPerPageChange,
}) => {
  return (
    <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="itemsPerPage" className="text-sm text-gray-700 dark:text-gray-300">
          Mostrar:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number.parseInt(e.target.value, 10))}
          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
      {totalPages > 1 && (
        <>
          <button
            onClick={onPrevPage}
            disabled={page === 1}
            className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            Anterior
          </button>
          <span className="text-center text-sm text-gray-700 dark:text-gray-300">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={page === totalPages}
            className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            Siguiente
          </button>
        </>
      )}
    </div>
  );
};

export default PaginationControls;
