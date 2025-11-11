import { useState, useCallback } from 'react';
import { UvaModalState } from '../types/consultaDireccion';

export const useUvaModal = () => {
  const [uvaModalState, setUvaModalState] = useState<UvaModalState | null>(null);

  const solicitarValorUva = useCallback((valorDefault: number): Promise<number | null> => {
    return new Promise(resolve => {
      setUvaModalState({ show: true, defaultValue: valorDefault, resolve });
    });
  }, []);

  const closeUvaModal = useCallback(() => {
    if (uvaModalState) {
      uvaModalState.resolve(null);
      setUvaModalState(null);
    }
  }, [uvaModalState]);

  const confirmUvaModal = useCallback((val: number) => {
    if (uvaModalState) {
      uvaModalState.resolve(val);
      setUvaModalState(null);
    }
  }, [uvaModalState]);

  return { uvaModalState, solicitarValorUva, closeUvaModal, confirmUvaModal };
};

