import React, { useCallback, useEffect } from 'react';

import { useModalLoading } from '../../contexts/ModalLoadingContext';

interface ConfirmToastModalProps {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalContent: React.FC<{
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, confirmText, cancelText, onConfirm, onCancel }) => (
  <div>
    <div className="flex items-start mb-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900">
          <svg
            className="h-6 w-6 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <div className="ml-3 flex-1">
        <p id="confirm-modal-title" className="text-sm text-gray-700 dark:text-gray-300">
          {message}
        </p>
      </div>
    </div>
    <div className="flex justify-end space-x-3 mt-6">
      <button
        onClick={onCancel}
        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 rounded-md bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors text-sm font-medium"
      >
        {confirmText}
      </button>
    </div>
  </div>
);

const ConfirmToastModal: React.FC<ConfirmToastModalProps> = ({
  message,
  confirmText = 'Sobrescribir',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  const { setModalOpen } = useModalLoading();

  const handleConfirm = useCallback(() => {
    setModalOpen(false);
    onConfirm();
  }, [setModalOpen, onConfirm]);

  const handleCancel = useCallback(() => {
    setModalOpen(false);
    onCancel();
  }, [setModalOpen, onCancel]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <button
        type="button"
        onClick={handleCancel}
        className="fixed inset-0 bg-black/50 cursor-default z-40"
        aria-label="Cerrar modal"
      />
      <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg w-full max-w-md p-6 mx-4 sm:mx-0 z-50">
        <ModalContent
          message={message}
          confirmText={confirmText}
          cancelText={cancelText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ConfirmToastModal;
