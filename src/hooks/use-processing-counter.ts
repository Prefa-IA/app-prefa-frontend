import { useEffect, useState } from 'react';

import { PROCESSING_CONFIG } from '../types/consulta-direccion';

export const useProcessingCounter = (isProcessing: boolean): number => {
  const [counter, setCounter] = useState<number>(PROCESSING_CONFIG.INITIAL_COUNTER);

  useEffect(() => {
    if (!isProcessing) {
      // Resetear el contador cuando se detiene el procesamiento
      setCounter(PROCESSING_CONFIG.INITIAL_COUNTER);
      return;
    }

    // Inicializar el contador inmediatamente cuando empieza el procesamiento
    setCounter(PROCESSING_CONFIG.INITIAL_COUNTER);

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
  }, [isProcessing]);

  return counter;
};
