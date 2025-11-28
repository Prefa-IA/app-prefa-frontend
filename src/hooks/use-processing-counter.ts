import { useEffect, useState } from 'react';

import { PROCESSING_CONFIG } from '../types/consulta-direccion';

export const useProcessingCounter = (
  isProcessing: boolean,
  numeroDirecciones: number = 1
): number => {
  const tiempoInicial = PROCESSING_CONFIG.INITIAL_COUNTER * numeroDirecciones;
  const [counter, setCounter] = useState<number>(tiempoInicial);

  useEffect(() => {
    if (!isProcessing) {
      setCounter(tiempoInicial);
      return;
    }

    setCounter(tiempoInicial);

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isProcessing, tiempoInicial]);

  return counter;
};
