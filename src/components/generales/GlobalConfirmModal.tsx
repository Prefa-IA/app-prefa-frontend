import React, { useCallback, useEffect, useState } from 'react';

import { useModalLoading } from '../../contexts/ModalLoadingContext';

import ConfirmToastModal from './ConfirmToastModal';

interface ConfirmOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface GlobalModalState {
  resolve: ((value: boolean) => void) | null;
  setModalState: ((options: ConfirmOptions | null) => void) | null;
}

const globalState: GlobalModalState = {
  resolve: null,
  setModalState: null,
};

export const showGlobalConfirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    globalState.resolve = resolve;
    if (globalState.setModalState) {
      globalState.setModalState(options);
    }
  });
};

const GlobalConfirmModal: React.FC = () => {
  const { setModalOpen } = useModalLoading();
  const [modalState, setModalState] = useState<ConfirmOptions | null>(null);

  const setModalStateWrapper = useCallback(
    (options: ConfirmOptions | null) => {
      setModalState(options);
      setModalOpen(options !== null);
    },
    [setModalOpen]
  );

  // Asignar la función al estado global en el primer render
  useEffect(() => {
    globalState.setModalState = setModalStateWrapper;
    return () => {
      globalState.setModalState = null;
    };
  }, [setModalStateWrapper]);

  const handleConfirm = useCallback(() => {
    if (globalState.resolve) {
      globalState.resolve(true);
      globalState.resolve = null;
    }
    setModalState(null);
    setModalOpen(false);
  }, [setModalOpen]);

  const handleCancel = useCallback(() => {
    if (globalState.resolve) {
      globalState.resolve(false);
      globalState.resolve = null;
    }
    setModalState(null);
    setModalOpen(false);
  }, [setModalOpen]);

  if (!modalState) {
    return null;
  }

  const modalProps: {
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
  } = {
    message: modalState.message,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
  };

  if (modalState.confirmText !== undefined) {
    modalProps.confirmText = modalState.confirmText;
  }

  if (modalState.cancelText !== undefined) {
    modalProps.cancelText = modalState.cancelText;
  }

  return <ConfirmToastModal {...modalProps} />;
};

export default GlobalConfirmModal;
