import React, { createContext, useCallback, useContext, useState } from 'react';

interface ModalLoadingContextType {
  isModalOpen: boolean;
  isLoading: boolean;
  setModalOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  shouldBlockNavigation: boolean;
}

const ModalLoadingContext = createContext<ModalLoadingContextType | undefined>(undefined);

export const ModalLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setModalOpen = useCallback((open: boolean) => {
    setIsModalOpen(open);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const shouldBlockNavigation = isModalOpen || isLoading;

  return (
    <ModalLoadingContext.Provider
      value={{
        isModalOpen,
        isLoading,
        setModalOpen,
        setLoading,
        shouldBlockNavigation,
      }}
    >
      {children}
    </ModalLoadingContext.Provider>
  );
};

export const useModalLoading = () => {
  const context = useContext(ModalLoadingContext);
  if (context === undefined) {
    throw new Error('useModalLoading debe ser usado dentro de un ModalLoadingProvider');
  }
  return context;
};
