import { useEffect, useState } from 'react';
import { PROCESSING_CONFIG } from '../types/consultaDireccion';

export const useProcessingCounter = (isProcessing: boolean): number => {
  const [counter, setCounter] = useState<number>(PROCESSING_CONFIG.INITIAL_COUNTER);

  useEffect(() => {
    if (!isProcessing) return;

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


