import React from 'react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <button
        onClick={onPrevPage}
        disabled={page === 1}
        className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-center">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={page === totalPages}
        className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
};

export default PaginationControls;
