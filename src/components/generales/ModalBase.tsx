import React from 'react';

import { ModalBaseProps } from '../../types/components';

const ModalBase: React.FC<ModalBaseProps> = ({
  title,
  onClose,
  children,
  hideConfirm = false,
  confirmText = 'Entendido',
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4 select-none">
    <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl ring-1 ring-indigo-100 dark:ring-gray-700 w-[95%] sm:max-w-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto hidden-scrollbar animate-[fadeIn_0.25s_ease-out]">
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-600 hover:text-indigo-700 dark:hover:text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{title}</h2>

      {children}

      {!hideConfirm && (
        <div className="pt-4 text-center">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-600 text-white rounded-lg shadow-md hover:from-primary-700 hover:to-primary-800 dark:hover:from-primary-600 dark:hover:to-primary-500 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      )}
    </div>
  </div>
);

export default ModalBase;
