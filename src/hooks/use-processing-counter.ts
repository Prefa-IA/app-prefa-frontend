import { useEffect, useState } from 'react';

import { PROCESSING_CONFIG } from '../types/consulta-direccion';

export const useProcessingCounter = (
  isProcessing: boolean,
  numeroDirecciones: number = 1,
  modoCompuesto: boolean = false
): number => {
  const tiempoInicial: number = modoCompuesto
    ? numeroDirecciones === 2
      ? 120
      : numeroDirecciones === 3
        ? 180
        : PROCESSING_CONFIG.INITIAL_COUNTER
    : PROCESSING_CONFIG.INITIAL_COUNTER * numeroDirecciones;
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
